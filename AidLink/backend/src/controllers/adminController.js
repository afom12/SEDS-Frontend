const ActivityLog = require('../models/ActivityLog');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getLogs = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(200);
  return res.json(new ApiResponse(logs));
});

const getStats = asyncHandler(async (req, res) => {
  const [userCount, donorCount, receiverCount, requestCount, pendingRequests, donations, amountAgg, completedRequests] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'recipient' }),
      Request.countDocuments(),
      Request.countDocuments({ status: 'submitted' }),
      Donation.countDocuments({ status: 'completed' }),
      Donation.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Request.countDocuments({ status: 'fulfilled' }),
    ]);

  const totalAmount = amountAgg[0]?.total || 0;

  return res.json(
    new ApiResponse({
      totals: {
        users: userCount,
        donors: donorCount,
        receivers: receiverCount,
        requests: requestCount,
        pendingRequests,
        donations,
        totalAmount,
        completedRequests,
      },
      last30Days: {
        donations: 0,
        requests: 0,
        users: 0,
      },
    })
  );
});

const getAnalytics = asyncHandler(async (req, res) => {
  const [userCount, donorCount, receiverCount, requestCounts, donationCounts, donationAmountAgg, categoryAgg, statusAgg] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'recipient' }),
      Request.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, totalRequested: { $sum: '$amountRequested' }, totalRaised: { $sum: '$amountRaised' } } },
      ]),
      Donation.countDocuments({ status: 'completed' }),
      Donation.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Request.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Request.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

  const byCategory = categoryAgg.reduce((acc, cur) => {
    acc[cur._id || 'Unknown'] = cur.count;
    return acc;
  }, {});
  const byStatus = statusAgg.reduce((acc, cur) => {
    acc[cur._id || 'unknown'] = cur.count;
    return acc;
  }, {});

  const totalRequested = requestCounts.reduce((sum, r) => sum + (r.totalRequested || 0), 0);
  const totalRaised = requestCounts.reduce((sum, r) => sum + (r.totalRaised || 0), 0);
  const totalAmount = donationAmountAgg[0]?.total || 0;

  return res.json(
    new ApiResponse({
      users: { total: userCount, donors: donorCount, receivers: receiverCount, recent: 0 },
      requests: {
        total: requestCounts.reduce((sum, r) => sum + r.count, 0),
        verified: byStatus.approved || 0,
        pending: byStatus.submitted || 0,
        rejected: byStatus.rejected || 0,
        completed: byStatus.fulfilled || 0,
        funded: byStatus.fulfilled || 0,
        recent: 0,
        totalRequested,
        totalRaised,
        byCategory,
        byStatus,
      },
      donations: { count: donationCounts, totalAmount, recent: 0 },
      platform: {
        fundingProgress: totalRequested ? Math.round((totalRaised / totalRequested) * 100) : 0,
        averageDonation: donationCounts ? Math.round(totalAmount / donationCounts) : 0,
      },
    })
  );
});

module.exports = {
  getLogs,
  getStats,
  getAnalytics,
};


