import { PrismaClient } from '@prisma/client';
import { createAdminLog } from '../utils/adminLog.utils.js';

const prisma = new PrismaClient();

// Approve request
export const approveRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const request = await prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found.',
      });
    }

    if (request.status !== 'SUBMITTED') {
      return res.status(400).json({
        success: false,
        error: 'Request must be in SUBMITTED status to approve.',
      });
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        status: 'VERIFIED',
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: req.user.id,
        adminNotes: adminNotes || 'Request verified and approved.',
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

    // Create admin log
    await createAdminLog(
      req.user.id,
      'APPROVE_REQUEST',
      'REQUEST',
      id,
      { status: 'VERIFIED', adminNotes },
      adminNotes,
      req
    );

    res.json({
      success: true,
      message: 'Request approved successfully.',
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Reject request
export const rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminNotes, reason } = req.body;
    const rejectionReason = reason || adminNotes || 'Request rejected by admin.';

    const request = await prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found.',
      });
    }

    if (!['SUBMITTED', 'VERIFIED'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot reject request in current status.',
      });
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        status: 'REJECTED',
        verified: false,
        adminNotes: rejectionReason,
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

    // Create admin log
    await createAdminLog(
      req.user.id,
      'REJECT_REQUEST',
      'REQUEST',
      id,
      { status: 'REJECTED', adminNotes },
      adminNotes,
      req
    );

    res.json({
      success: true,
      message: 'Request rejected.',
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const { role, verified, page = 1, limit = 20, search } = req.query;

    const where = {};
    if (role) where.role = role;
    if (verified !== undefined) where.verified = verified === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          verified: true,
          organization: true,
          organizationType: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              donations: true,
              requests: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
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

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        phone: true,
        address: true,
        organization: true,
        organizationType: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            donations: true,
            requests: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Verify user
export const verifyUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    // Create admin log
    await createAdminLog(
      req.user.id,
      'VERIFY_USER',
      'USER',
      id,
      { verified: true },
      'User verified by admin',
      req
    );

    res.json({
      success: true,
      message: 'User verified successfully.',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Get analytics - ALL METRICS COMPUTED FROM REAL DATABASE DATA
export const getAnalytics = async (req, res, next) => {
  try {
    // Compute all metrics from actual database queries - NO HARD-CODED VALUES
    const [
      totalUsers,
      totalDonors,
      totalReceivers,
      totalRequests,
      verifiedRequests,
      pendingRequests,
      rejectedRequests,
      completedRequests,
      fundedRequests,
      totalDonations,
      totalAmount,
      totalRequestedAmount,
      totalRaisedAmount,
      // Category breakdown
      categoryBreakdown,
      // Status breakdown
      statusBreakdown,
      // Recent activity (last 30 days)
      recentDonations,
      recentRequests,
      recentUsers,
    ] = await Promise.all([
      // User counts - computed from users table
      prisma.user.count(),
      prisma.user.count({ where: { role: 'DONOR' } }),
      prisma.user.count({ where: { role: 'RECEIVER' } }),
      
      // Request counts - computed from requests table
      prisma.request.count(),
      prisma.request.count({ where: { verified: true } }),
      prisma.request.count({ where: { status: 'SUBMITTED' } }),
      prisma.request.count({ where: { status: 'REJECTED' } }),
      prisma.request.count({ where: { status: 'COMPLETED' } }),
      prisma.request.count({ where: { status: 'FUNDED' } }),
      
      // Donation counts and amounts - computed from donations table (only completed payments)
      prisma.donation.count({ where: { paymentStatus: 'COMPLETED' } }),
      prisma.donation.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { amount: true },
      }),
      
      // Total requested amount - sum of all request amounts
      prisma.request.aggregate({
        _sum: { amount: true },
      }),
      
      // Total raised amount - sum of currentAmount from requests
      prisma.request.aggregate({
        _sum: { currentAmount: true },
      }),
      
      // Category breakdown - group requests by category
      prisma.request.groupBy({
        by: ['category'],
        _count: { category: true },
        _sum: { amount: true, currentAmount: true },
      }),
      
      // Status breakdown - group requests by status
      prisma.request.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      
      // Recent activity (last 30 days)
      (async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return prisma.donation.count({
          where: {
            createdAt: { gte: thirtyDaysAgo },
            paymentStatus: 'COMPLETED',
          },
        });
      })(),
      (async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return prisma.request.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        });
      })(),
      (async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return prisma.user.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        });
      })(),
    ]);

    // Format category breakdown
    const categoryData = categoryBreakdown.reduce((acc, item) => {
      acc[item.category] = {
        count: item._count.category,
        requested: Number(item._sum.amount || 0),
        raised: Number(item._sum.currentAmount || 0),
      };
      return acc;
    }, {});

    // Format status breakdown
    const statusData = statusBreakdown.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        // User metrics - computed from users table
        users: {
          total: totalUsers,
          donors: totalDonors,
          receivers: totalReceivers,
          recent: recentUsers, // Last 30 days
        },
        // Request metrics - computed from requests table
        requests: {
          total: totalRequests,
          verified: verifiedRequests,
          pending: pendingRequests,
          rejected: rejectedRequests,
          completed: completedRequests,
          funded: fundedRequests,
          recent: recentRequests, // Last 30 days
          totalRequested: Number(totalRequestedAmount._sum.amount || 0),
          totalRaised: Number(totalRaisedAmount._sum.currentAmount || 0),
          byCategory: categoryData,
          byStatus: statusData,
        },
        // Donation metrics - computed from donations table (only completed payments)
        donations: {
          count: totalDonations,
          totalAmount: Number(totalAmount._sum.amount || 0),
          recent: recentDonations, // Last 30 days
        },
        // Overall platform metrics
        platform: {
          fundingProgress: totalRequestedAmount._sum.amount 
            ? ((totalRaisedAmount._sum.currentAmount || 0) / totalRequestedAmount._sum.amount * 100).toFixed(1)
            : 0,
          averageDonation: totalDonations > 0
            ? Number(totalAmount._sum.amount || 0) / totalDonations
            : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get stats - COMPUTED FROM REAL DATA (used for dashboard quick stats)
export const getStats = async (req, res, next) => {
  try {
    // Compute stats from actual database - NO HARD-CODED VALUES
    const [
      totalUsers,
      totalDonors,
      totalReceivers,
      totalRequests,
      pendingRequests,
      totalDonations,
      totalAmount,
      completedRequests,
      // Last 30 days activity
      recentDonations,
      recentRequests,
      recentUsers,
      // Last 7 days for trend
      weekAgo,
      weekDonations,
      weekRequests,
    ] = await Promise.all([
      // Total counts - computed from database
      prisma.user.count(),
      prisma.user.count({ where: { role: 'DONOR' } }),
      prisma.user.count({ where: { role: 'RECEIVER' } }),
      prisma.request.count(),
      prisma.request.count({ 
        where: { status: { in: ['SUBMITTED', 'DRAFT'] } } 
      }),
      prisma.donation.count({ where: { paymentStatus: 'COMPLETED' } }),
      prisma.donation.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.request.count({ where: { status: 'COMPLETED' } }),
      
      // Last 30 days - computed from timestamps
      (async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return prisma.donation.count({
          where: {
            createdAt: { gte: thirtyDaysAgo },
            paymentStatus: 'COMPLETED',
          },
        });
      })(),
      (async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return prisma.request.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        });
      })(),
      (async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return prisma.user.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        });
      })(),
      
      // Last 7 days for trend analysis
      (async () => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return {
          donations: await prisma.donation.count({
            where: {
              createdAt: { gte: sevenDaysAgo },
              paymentStatus: 'COMPLETED',
            },
          }),
          requests: await prisma.request.count({
            where: { createdAt: { gte: sevenDaysAgo } },
          }),
        };
      })(),
    ]);

    res.json({
      success: true,
      data: {
        // Current totals - all computed from database
        totals: {
          users: totalUsers,
          donors: totalDonors,
          receivers: totalReceivers,
          requests: totalRequests,
          pendingRequests,
          donations: totalDonations,
          totalAmount: Number(totalAmount._sum.amount || 0),
          completedRequests,
        },
        // Last 30 days activity - computed from timestamps
        last30Days: {
          donations: recentDonations,
          requests: recentRequests,
          users: recentUsers,
        },
        // Last 7 days for trend - computed from timestamps
        last7Days: {
          donations: weekAgo.donations,
          requests: weekAgo.requests,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get activity logs
export const getActivityLogs = async (req, res, next) => {
  try {
    const { action, entityType, page = 1, limit = 50 } = req.query;

    const where = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        include: {
          admin: {
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
      prisma.adminLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
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

