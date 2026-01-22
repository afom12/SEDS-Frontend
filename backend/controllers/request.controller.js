import { PrismaClient } from '@prisma/client';
import { calculateFoodUrgency } from '../utils/food-urgency.js';

const prisma = new PrismaClient();

// Create new request (supports both money and aid coordination)
export const createRequest = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      amount,
      organizationName,
      organizationType,
      // Aid coordination fields
      aidTypeId,
      aidTypeCode,
      quantity,
      unit,
      urgency,
      neededBy,
      expiresAt,
      isPerishable,
      location,
      deliveryMethod,
      preferredDeliveryTime,
      verifiedByOrganizationId,
    } = req.body;

    // Determine if this is an aid request or money request
    const isAidRequest = !!aidTypeId;

    const requestData = {
      title,
      description,
      category,
      receiverId: req.user.id,
      organizationName,
      organizationType,
      status: 'DRAFT',
    };

    // Add money fields (for legacy money requests)
    if (amount) {
      requestData.amount = parseFloat(amount);
      requestData.currentAmount = 0;
      requestData.progress = 0;
    }

    // Add aid coordination fields
    if (isAidRequest) {
      requestData.aidTypeId = aidTypeId;
      requestData.aidTypeCode = aidTypeCode;
      requestData.quantity = quantity ? parseInt(quantity) : null;
      requestData.unit = unit;
      requestData.neededBy = neededBy ? new Date(neededBy) : null;
      requestData.expiresAt = expiresAt ? new Date(expiresAt) : null;
      requestData.isPerishable = isPerishable || false;
      requestData.location = location;
      requestData.deliveryMethod = deliveryMethod || 'PICKUP';
      requestData.preferredDeliveryTime = preferredDeliveryTime ? new Date(preferredDeliveryTime) : null;
      requestData.verifiedByOrganizationId = verifiedByOrganizationId || null;
      
      // Auto-set urgency for perishable food based on expiration date
      if (requestData.isPerishable && requestData.expiresAt) {
        requestData.urgency = calculateFoodUrgency(requestData.expiresAt);
      } else {
        // Get default urgency from aid type if available
        if (aidTypeId) {
          const aidType = await prisma.aidType.findUnique({
            where: { id: aidTypeId },
          });
          if (aidType?.defaultUrgency) {
            requestData.urgency = aidType.defaultUrgency;
          } else {
            requestData.urgency = urgency || 'MEDIUM';
          }
        } else {
          requestData.urgency = urgency || 'MEDIUM';
        }
      }
    }

    const request = await prisma.request.create({
      data: requestData,
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            organization: true,
            organizationType: true,
          },
        },
        aidType: isAidRequest ? {
          select: {
            id: true,
            code: true,
            name: true,
            nameAmharic: true,
            category: true,
            isPerishable: true,
          },
        } : undefined,
      },
    });

    res.status(201).json({
      success: true,
      message: isAidRequest ? 'Aid request created successfully.' : 'Request created successfully.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// Get all requests (with filters) - supports both money and aid requests
export const getRequests = async (req, res, next) => {
  try {
    const {
      status,
      category,
      verified,
      minAmount,
      maxAmount,
      search,
      // Aid coordination filters
      aidTypeId,
      aidTypeCode,
      urgency,
      isPerishable,
      location,
      requestType, // 'money' or 'aid'
      urgent, // 'true' for urgent requests
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};
    const user = req.user;

    // If not admin, only show verified requests
    if (!user || user.role !== 'ADMIN') {
      where.verified = true;
      where.status = { in: ['VERIFIED', 'MATCHED', 'IN_PROGRESS', 'FUNDED', 'COMPLETED'] };
    }

    // Apply filters
    if (status) where.status = status;
    if (category) where.category = category;
    if (verified !== undefined) where.verified = verified === 'true';
    
    // Money request filters
    if (minAmount) where.amount = { ...where.amount, gte: parseFloat(minAmount) };
    if (maxAmount) {
      where.amount = {
        ...where.amount,
        lte: parseFloat(maxAmount),
      };
    }

    // Aid coordination filters
    if (aidTypeId) where.aidTypeId = aidTypeId;
    if (aidTypeCode) where.aidTypeCode = aidTypeCode;
    if (urgency) where.urgency = urgency;
    if (isPerishable !== undefined) where.isPerishable = isPerishable === 'true';
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (urgent === 'true') where.urgency = 'URGENT';
    
    // Filter by request type
    if (requestType === 'aid') {
      where.aidTypeId = { not: null };
    } else if (requestType === 'money') {
      where.aidTypeId = null;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
              organization: true,
              organizationType: true,
            },
          },
          aidType: {
            select: {
              id: true,
              code: true,
              name: true,
              nameAmharic: true,
              category: true,
              isPerishable: true,
            },
          },
          verifiedByOrganization: {
            select: {
              id: true,
              name: true,
              nameAmharic: true,
            },
          },
          _count: {
            select: {
              donations: true,
              matchedOffers: true,
              deliveries: true,
            },
          },
        },
        orderBy: [
          // Prioritize urgent/perishable requests
          { urgency: 'desc' },
          { expiresAt: 'asc' }, // Expiring soon first
          { createdAt: 'desc' },
        ],
        skip,
        take: parseInt(limit),
      }),
      prisma.request.count({ where }),
    ]);

    res.json({
      success: true,
      data: requests,
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

// Get request by ID
export const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            organization: true,
            organizationType: true,
            verified: true,
          },
        },
        donations: {
          where: user?.role === 'ADMIN' ? {} : { anonymous: false },
          include: {
            donor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        matchedOffers: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
              },
            },
            aidType: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        deliveries: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
              },
            },
            offer: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          where: {
            type: { in: ['PROOF_OF_NEED', 'MEDICAL_REPORT', 'IMPACT_PHOTO'] },
          },
        },
        impactReports: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            donations: true,
          },
        },
      },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found.',
      });
    }

    // Check permissions
    if (user?.role !== 'ADMIN' && request.receiverId !== user?.id) {
      if (!request.verified || !['VERIFIED', 'FUNDED', 'COMPLETED'].includes(request.status)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied.',
        });
      }
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// Update request
export const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check ownership
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        error: 'Request not found.',
      });
    }

    if (existingRequest.receiverId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own requests.',
      });
    }

    // Can't update if already submitted
    if (existingRequest.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update request after submission.',
      });
    }

    if (updateData.amount) {
      updateData.amount = parseFloat(updateData.amount);
    }

    const request = await prisma.request.update({
      where: { id },
      data: updateData,
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Request updated successfully.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// Delete request
export const deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        error: 'Request not found.',
      });
    }

    if (existingRequest.receiverId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own requests.',
      });
    }

    // Can't delete if already submitted
    if (existingRequest.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete request after submission.',
      });
    }

    await prisma.request.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Request deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Submit request for verification
export const submitRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        error: 'Request not found.',
      });
    }

    if (existingRequest.receiverId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You can only submit your own requests.',
      });
    }

    if (existingRequest.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        error: 'Request already submitted.',
      });
    }

    const request = await prisma.request.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Request submitted for verification.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// Get receiver's requests
export const getReceiverRequests = async (req, res, next) => {
  try {
    const requests = await prisma.request.findMany({
      where: {
        receiverId: req.user.id,
      },
      include: {
        _count: {
          select: {
            donations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

