import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all aid types (public)
export const getAidTypes = async (req, res, next) => {
  try {
    const { category, active } = req.query;

    const where = {};
    if (category) where.category = category;
    if (active !== undefined) where.isActive = active === 'true';

    const aidTypes = await prisma.aidType.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    res.json({
      success: true,
      data: aidTypes,
    });
  } catch (error) {
    next(error);
  }
};

// Get aid type by ID
export const getAidTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const aidType = await prisma.aidType.findUnique({
      where: { id },
    });

    if (!aidType) {
      return res.status(404).json({
        success: false,
        error: 'Aid type not found.',
      });
    }

    res.json({
      success: true,
      data: aidType,
    });
  } catch (error) {
    next(error);
  }
};

// Create aid type (admin only)
export const createAidType = async (req, res, next) => {
  try {
    const aidType = await prisma.aidType.create({
      data: req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Aid type created successfully.',
      data: aidType,
    });
  } catch (error) {
    next(error);
  }
};

// Update aid type (admin only)
export const updateAidType = async (req, res, next) => {
  try {
    const { id } = req.params;

    const aidType = await prisma.aidType.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      message: 'Aid type updated successfully.',
      data: aidType,
    });
  } catch (error) {
    next(error);
  }
};

