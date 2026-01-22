import { PrismaClient } from '@prisma/client';
import { createAdminLog } from '../utils/adminLog.utils.js';

const prisma = new PrismaClient();

// Create organization (admin only)
export const createOrganization = async (req, res, next) => {
  try {
    const organization = await prisma.organization.create({
      data: req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Organization created successfully.',
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

// Get all organizations
export const getOrganizations = async (req, res, next) => {
  try {
    const { verified, type, search } = req.query;

    const where = {};
    if (verified !== undefined) where.verified = verified === 'true';
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAmharic: { contains: search, mode: 'insensitive' } },
      ];
    }

    const organizations = await prisma.organization.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true,
            verifiedRequests: true,
          },
        },
      },
      orderBy: [
        { verified: 'desc' },
        { name: 'asc' },
      ],
    });

    res.json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    next(error);
  }
};

// Get organization by ID
export const getOrganizationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            verifiedRequests: true,
            managedDeliveries: true,
          },
        },
      },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found.',
      });
    }

    res.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

// Update organization
export const updateOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;

    const organization = await prisma.organization.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      message: 'Organization updated successfully.',
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

// Verify organization (admin only)
export const verifyOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;

    const organization = await prisma.organization.update({
      where: { id },
      data: {
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: req.user.id,
      },
    });

    // Create admin log
    await createAdminLog(
      req.user.id,
      'VERIFY_ORGANIZATION',
      'ORGANIZATION',
      id,
      { verified: true },
      'Organization verified by admin',
      req
    );

    res.json({
      success: true,
      message: 'Organization verified successfully.',
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

// Add member to organization
export const addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role = 'MEMBER' } = req.body;

    // Check if user is admin or organization coordinator
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        members: {
          where: { userId: req.user.id },
        },
      },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found.',
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'ADMIN';
    const isCoordinator = organization.members.some(
      m => m.userId === req.user.id && ['ADMIN', 'COORDINATOR'].includes(m.role)
    );

    if (!isAdmin && !isCoordinator) {
      return res.status(403).json({
        success: false,
        error: 'Only admins and coordinators can add members.',
      });
    }

    const member = await prisma.organizationMember.create({
      data: {
        organizationId: id,
        userId,
        role,
      },
      include: {
        user: {
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
      message: 'Member added successfully.',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// Get organization members
export const getMembers = async (req, res, next) => {
  try {
    const { id } = req.params;

    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId: id,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'asc' },
      ],
    });

    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// Get requests verified by organization
export const getVerifiedRequests = async (req, res, next) => {
  try {
    const { id } = req.params;

    const requests = await prisma.request.findMany({
      where: {
        verifiedByOrganizationId: id,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        aidType: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        _count: {
          select: {
            matchedOffers: true,
            deliveries: true,
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

