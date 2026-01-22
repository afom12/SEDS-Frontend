import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create delivery record
export const createDelivery = async (req, res, next) => {
  try {
    const {
      requestId,
      offerId,
      quantity,
      unit,
      amount,
      deliveryMethod,
      deliveryLocation,
      deliveryAddress,
      scheduledAt,
      organizationId,
    } = req.body;

    // Verify request and offer
    const [request, offer] = await Promise.all([
      prisma.request.findUnique({
        where: { id: requestId },
      }),
      prisma.aidOffer.findUnique({
        where: { id: offerId },
      }),
    ]);

    if (!request || !offer) {
      return res.status(404).json({
        success: false,
        error: 'Request or offer not found.',
      });
    }

    // Verify permissions
    if (req.user.role !== 'ADMIN' && offer.providerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only create deliveries for your own offers.',
      });
    }

    // Verify offer is matched/accepted
    if (!['MATCHED', 'ACCEPTED'].includes(offer.status)) {
      return res.status(400).json({
        success: false,
        error: 'Offer must be matched or accepted before delivery.',
      });
    }

    const delivery = await prisma.delivery.create({
      data: {
        requestId,
        offerId,
        providerId: offer.providerId,
        seekerId: request.receiverId,
        quantity: quantity || offer.quantity || 1,
        unit: unit || offer.unit,
        amount: amount ? parseFloat(amount) : offer.amount,
        deliveryMethod,
        deliveryLocation,
        deliveryAddress,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        organizationId,
        status: 'SCHEDULED',
      },
      include: {
        request: {
          select: {
            id: true,
            title: true,
          },
        },
        offer: {
          select: {
            id: true,
            title: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        seeker: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update offer and request status
    await Promise.all([
      prisma.aidOffer.update({
        where: { id: offerId },
        data: { status: 'IN_TRANSIT' },
      }),
      prisma.request.update({
        where: { id: requestId },
        data: {
          status: 'IN_PROGRESS',
          inProgressAt: new Date(),
        },
      }),
    ]);

    res.status(201).json({
      success: true,
      message: 'Delivery created successfully.',
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

// Get deliveries
export const getDeliveries = async (req, res, next) => {
  try {
    const {
      requestId,
      offerId,
      status,
      providerId,
      seekerId,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};

    // Filter by user role
    if (req.user.role === 'AID_PROVIDER') {
      where.providerId = req.user.id;
    } else if (req.user.role === 'AID_SEEKER') {
      where.seekerId = req.user.id;
    } else if (req.user.role !== 'ADMIN') {
      // Non-admin users can only see their own deliveries
      where.OR = [
        { providerId: req.user.id },
        { seekerId: req.user.id },
      ];
    }

    if (requestId) where.requestId = requestId;
    if (offerId) where.offerId = offerId;
    if (status) where.status = status;
    if (providerId && req.user.role === 'ADMIN') where.providerId = providerId;
    if (seekerId && req.user.role === 'ADMIN') where.seekerId = seekerId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where,
        include: {
          request: {
            select: {
              id: true,
              title: true,
            },
          },
          offer: {
            select: {
              id: true,
              title: true,
            },
          },
          provider: {
            select: {
              id: true,
              name: true,
            },
          },
          seeker: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.delivery.count({ where }),
    ]);

    res.json({
      success: true,
      data: deliveries,
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

// Get delivery by ID
export const getDeliveryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        request: true,
        offer: {
          include: {
            aidType: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found.',
      });
    }

    // Check permissions
    if (req.user.role !== 'ADMIN' &&
        delivery.providerId !== req.user.id &&
        delivery.seekerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    res.json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNotes, deliveryNotes } = req.body;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found.',
      });
    }

    // Check permissions
    if (req.user.role !== 'ADMIN' && delivery.providerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own deliveries.',
      });
    }

    const updateData = {
      status,
      trackingNotes,
      deliveryNotes,
    };

    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: updateData,
    });

    // Update offer status if delivered
    if (status === 'DELIVERED') {
      await prisma.aidOffer.update({
        where: { id: delivery.offerId },
        data: { status: 'DELIVERED' },
      });
    }

    res.json({
      success: true,
      message: 'Delivery status updated successfully.',
      data: updatedDelivery,
    });
  } catch (error) {
    next(error);
  }
};

// Confirm delivery (by seeker)
export const confirmDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found.',
      });
    }

    if (delivery.seekerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only confirm deliveries for your requests.',
      });
    }

    if (delivery.status !== 'DELIVERED') {
      return res.status(400).json({
        success: false,
        error: 'Delivery must be marked as delivered before confirmation.',
      });
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
    });

    // Update offer and request status
    await Promise.all([
      prisma.aidOffer.update({
        where: { id: delivery.offerId },
        data: {
          status: 'CONFIRMED',
          completedAt: new Date(),
        },
      }),
      prisma.request.update({
        where: { id: delivery.requestId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      }),
    ]);

    res.json({
      success: true,
      message: 'Delivery confirmed successfully.',
      data: updatedDelivery,
    });
  } catch (error) {
    next(error);
  }
};

// Upload proof photos
export const uploadProof = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { photos } = req.body; // Array of photo URLs/paths

    const delivery = await prisma.delivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found.',
      });
    }

    // Check permissions
    if (req.user.role !== 'ADMIN' &&
        delivery.providerId !== req.user.id &&
        delivery.seekerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: {
        proofPhotos: photos,
      },
    });

    res.json({
      success: true,
      message: 'Proof photos uploaded successfully.',
      data: updatedDelivery,
    });
  } catch (error) {
    next(error);
  }
};

