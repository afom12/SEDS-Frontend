import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create aid offer
export const createOffer = async (req, res, next) => {
  try {
    const {
      aidTypeId,
      aidTypeCode,
      title,
      description,
      quantity,
      unit,
      amount,
      availableFrom,
      availableUntil,
      expiresAt,
      location,
      canDeliver,
      deliveryRadius,
    } = req.body;

    // Verify aid type exists
    const aidType = await prisma.aidType.findUnique({
      where: { id: aidTypeId },
    });

    if (!aidType) {
      return res.status(404).json({
        success: false,
        error: 'Aid type not found.',
      });
    }

    const offer = await prisma.aidOffer.create({
      data: {
        providerId: req.user.id,
        aidTypeId,
        aidTypeCode: aidTypeCode || aidType.code,
        title,
        description,
        quantity,
        unit,
        availableQuantity: quantity,
        amount: amount ? parseFloat(amount) : null,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        availableUntil: availableUntil ? new Date(availableUntil) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        location,
        canDeliver: canDeliver || false,
        deliveryRadius,
        status: 'AVAILABLE',
      },
      include: {
        aidType: true,
        provider: {
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
      message: 'Aid offer created successfully.',
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// Get all offers
export const getOffers = async (req, res, next) => {
  try {
    const {
      aidTypeId,
      status,
      providerId,
      requestId,
      available,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};

    // If user is provider, show their offers; otherwise show all
    if (req.user?.role === 'AID_PROVIDER' && !providerId) {
      where.providerId = req.user.id;
    } else if (providerId) {
      where.providerId = providerId;
    }

    if (aidTypeId) where.aidTypeId = aidTypeId;
    if (status) where.status = status;
    if (requestId) where.requestId = requestId;
    if (available === 'true') {
      where.status = 'AVAILABLE';
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [offers, total] = await Promise.all([
      prisma.aidOffer.findMany({
        where,
        include: {
          aidType: true,
          provider: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          request: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.aidOffer.count({ where }),
    ]);

    res.json({
      success: true,
      data: offers,
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

// Get available offers (for matching)
export const getAvailableOffers = async (req, res, next) => {
  try {
    const { aidTypeId, location, urgent } = req.query;

    const where = {
      status: 'AVAILABLE',
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    };

    if (aidTypeId) where.aidTypeId = aidTypeId;
    if (location) {
      // Simple location matching - can be enhanced with geolocation
      where.location = { contains: location, mode: 'insensitive' };
    }

    const offers = await prisma.aidOffer.findMany({
      where,
      include: {
        aidType: true,
        provider: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: [
        // Prioritize urgent/perishable items
        { aidType: { isPerishable: 'desc' } },
        { createdAt: 'asc' },
      ],
      take: 50, // Limit for performance
    });

    res.json({
      success: true,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};

// Get offer by ID
export const getOfferById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await prisma.aidOffer.findUnique({
      where: { id },
      include: {
        aidType: true,
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        request: {
          include: {
            receiver: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        deliveries: {
          include: {
            seeker: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found.',
      });
    }

    // Check permissions
    if (req.user?.role !== 'ADMIN' && offer.providerId !== req.user?.id) {
      if (offer.status !== 'AVAILABLE' && offer.request?.receiverId !== req.user?.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied.',
        });
      }
    }

    res.json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// Update offer
export const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingOffer = await prisma.aidOffer.findUnique({
      where: { id },
    });

    if (!existingOffer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found.',
      });
    }

    if (existingOffer.providerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own offers.',
      });
    }

    if (existingOffer.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update offer that is already matched or delivered.',
      });
    }

    const updateData = { ...req.body };
    if (updateData.availableFrom) updateData.availableFrom = new Date(updateData.availableFrom);
    if (updateData.availableUntil) updateData.availableUntil = new Date(updateData.availableUntil);
    if (updateData.expiresAt) updateData.expiresAt = new Date(updateData.expiresAt);
    if (updateData.amount) updateData.amount = parseFloat(updateData.amount);

    const offer = await prisma.aidOffer.update({
      where: { id },
      data: updateData,
      include: {
        aidType: true,
      },
    });

    res.json({
      success: true,
      message: 'Offer updated successfully.',
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel offer
export const cancelOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await prisma.aidOffer.findUnique({
      where: { id },
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found.',
      });
    }

    if (offer.providerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only cancel your own offers.',
      });
    }

    if (['DELIVERED', 'CONFIRMED'].includes(offer.status)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel offer that is already delivered.',
      });
    }

    const updatedOffer = await prisma.aidOffer.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.json({
      success: true,
      message: 'Offer cancelled successfully.',
      data: updatedOffer,
    });
  } catch (error) {
    next(error);
  }
};

// Accept offer (by seeker)
export const acceptOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { requestId } = req.body;

    const offer = await prisma.aidOffer.findUnique({
      where: { id },
      include: {
        request: true,
      },
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Offer not found.',
      });
    }

    if (offer.status !== 'AVAILABLE' && offer.status !== 'MATCHED') {
      return res.status(400).json({
        success: false,
        error: 'Offer is not available for acceptance.',
      });
    }

    // Verify request belongs to seeker
    if (requestId) {
      const request = await prisma.request.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Request not found.',
        });
      }

      if (request.receiverId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'You can only accept offers for your own requests.',
        });
      }
    }

    // Update offer status
    const updatedOffer = await prisma.aidOffer.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        requestId: requestId || offer.requestId,
        acceptedAt: new Date(),
      },
      include: {
        aidType: true,
        request: true,
      },
    });

    // Update request status if matched
    if (requestId) {
      await prisma.request.update({
        where: { id: requestId },
        data: {
          status: 'MATCHED',
          matchedAt: new Date(),
        },
      });
    }

    res.json({
      success: true,
      message: 'Offer accepted successfully.',
      data: updatedOffer,
    });
  } catch (error) {
    next(error);
  }
};

