import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get public donation ledger (anonymous but verifiable)
export const getPublicLedger = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where: {
          paymentStatus: 'COMPLETED',
          request: {
            verified: true,
          },
        },
        select: {
          id: true,
          amount: true,
          anonymous: true,
          createdAt: true,
          receiptNumber: true,
          request: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
          donor: {
            select: {
              name: anonymous ? false : true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.donation.count({
        where: {
          paymentStatus: 'COMPLETED',
          request: { verified: true },
        },
      }),
    ]);

    // Anonymize donations
    const anonymizedDonations = donations.map(donation => ({
      ...donation,
      donor: donation.anonymous ? null : donation.donor,
    }));

    res.json({
      success: true,
      data: anonymizedDonations,
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

// Get public request details
export const getPublicRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await prisma.request.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        amount: true,
        currentAmount: true,
        progress: true,
        status: true,
        verified: true,
        verifiedAt: true,
        createdAt: true,
        receiver: {
          select: {
            organization: true,
            organizationType: true,
          },
        },
        impactReports: {
          where: { verified: true },
          select: {
            id: true,
            title: true,
            description: true,
            photos: true,
            beneficiariesCount: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            donations: true,
          },
        },
      },
    });

    if (!request || !request.verified) {
      return res.status(404).json({
        success: false,
        error: 'Request not found or not verified.',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// Get public stats
export const getPublicStats = async (req, res, next) => {
  try {
    const [
      totalDonations,
      totalAmount,
      totalRequests,
      completedRequests,
    ] = await Promise.all([
      prisma.donation.count({
        where: {
          paymentStatus: 'COMPLETED',
          request: { verified: true },
        },
      }),
      prisma.donation.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          request: { verified: true },
        },
        _sum: { amount: true },
      }),
      prisma.request.count({
        where: { verified: true },
      }),
      prisma.request.count({
        where: {
          verified: true,
          status: 'COMPLETED',
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalDonations,
        totalAmount: totalAmount._sum.amount || 0,
        totalRequests,
        completedRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

