import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Create donation (payment will be processed separately)
export const createDonation = async (req, res, next) => {
  try {
    const { requestId, amount, anonymous = false, message } = req.body;

    // Verify request exists and is verified
    const request = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found.',
      });
    }

    if (!request.verified || request.status !== 'VERIFIED') {
      return res.status(400).json({
        success: false,
        error: 'Can only donate to verified requests.',
      });
    }

    // Check if request is already fully funded
    if (request.currentAmount >= request.amount) {
      return res.status(400).json({
        success: false,
        error: 'This request is already fully funded.',
      });
    }

    // Generate receipt number
    const receiptNumber = `SEDS-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Create donation record (payment will be processed via payment gateway)
    const donation = await prisma.donation.create({
      data: {
        requestId,
        donorId: req.user.id,
        amount: parseFloat(amount),
        anonymous,
        message,
        paymentMethod: 'STRIPE', // Will be updated after payment processing
        paymentStatus: 'PENDING',
        receiptNumber,
      },
      include: {
        request: {
          select: {
            id: true,
            title: true,
            amount: true,
            currentAmount: true,
          },
        },
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Donation created. Please complete payment.',
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// Get all donations (admin only or own donations)
export const getDonations = async (req, res, next) => {
  try {
    const { requestId, donorId, page = 1, limit = 20 } = req.query;

    const where = {};

    // Non-admins can only see their own donations
    if (req.user.role !== 'ADMIN') {
      where.donorId = req.user.id;
    } else {
      if (donorId) where.donorId = donorId;
    }

    if (requestId) where.requestId = requestId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        include: {
          request: {
            select: {
              id: true,
              title: true,
            },
          },
          donor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.donation.count({ where }),
    ]);

    res.json({
      success: true,
      data: donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get donation by ID
export const getDonationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        request: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        transaction: true,
      },
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        error: 'Donation not found.',
      });
    }

    // Check permissions
    if (req.user.role !== 'ADMIN' && donation.donorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    res.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// Get donation history (for donors)
export const getDonationHistory = async (req, res, next) => {
  try {
    const donations = await prisma.donation.findMany({
      where: {
        donorId: req.user.id,
        paymentStatus: 'COMPLETED',
      },
      include: {
        request: {
          select: {
            id: true,
            title: true,
            status: true,
            progress: true,
          },
        },
        transaction: {
          select: {
            id: true,
            gatewayTxId: true,
            status: true,
            completedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

