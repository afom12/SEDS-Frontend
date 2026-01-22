import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create admin log entry (immutable audit trail)
export const createAdminLog = async (adminId, action, entityType, entityId, details = null, reason = null, req = null) => {
  try {
    const log = await prisma.adminLog.create({
      data: {
        adminId,
        action,
        entityType,
        entityId,
        details: details ? JSON.parse(JSON.stringify(details)) : null,
        reason,
        ipAddress: req?.ip || req?.connection?.remoteAddress || null,
        userAgent: req?.get('user-agent') || null,
      },
    });
    return log;
  } catch (error) {
    // Don't throw error - logging should not break the main flow
    console.error('Failed to create admin log:', error);
    return null;
  }
};

