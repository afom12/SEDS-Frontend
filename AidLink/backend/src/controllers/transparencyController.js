const Donation = require('../models/Donation');
const Request = require('../models/Request');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getLedger = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ status: 'completed' })
    .populate('requestId', 'title')
    .populate('donorId', 'fullName')
    .sort({ createdAt: -1 })
    .limit(50);

  const ledger = donations.map((donation) => ({
    id: donation._id,
    amount: donation.amount,
    anonymous: donation.anonymous,
    receiptNumber: donation.receiptNumber,
    createdAt: donation.createdAt,
    request: donation.requestId
      ? { id: donation.requestId._id, title: donation.requestId.title }
      : null,
    donor: donation.anonymous
      ? null
      : { name: donation.donorId?.fullName || 'Anonymous' },
  }));

  return res.json(new ApiResponse(ledger));
});

const getStats = asyncHandler(async (req, res) => {
  const [totalDonations, totals, totalRequests, completedRequests] =
    await Promise.all([
      Donation.countDocuments({ status: 'completed' }),
      Donation.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Request.countDocuments({ status: { $in: ['approved', 'fulfilled'] } }),
      Request.countDocuments({ status: 'fulfilled' }),
    ]);

  const totalAmount = totals[0]?.total || 0;

  return res.json(
    new ApiResponse({
      totalDonations,
      totalAmount,
      totalRequests,
      completedRequests,
    })
  );
});

module.exports = {
  getLedger,
  getStats,
};

