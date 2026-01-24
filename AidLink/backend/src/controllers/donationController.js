const { validationResult } = require('express-validator');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const generateReceipt = () =>
  `AL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0')}`;

const createDonation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { requestId, amount, anonymous } = req.body;

  const request = await Request.findById(requestId);
  if (!request) {
    throw new ApiError(404, 'Request not found');
  }
  if (request.status !== 'approved') {
    throw new ApiError(400, 'Request is not approved');
  }

  const donation = await Donation.create({
    donorId: req.user.id,
    requestId,
    amount,
    anonymous: !!anonymous,
    receiptNumber: generateReceipt(),
  });

  const newRaised = (request.amountRaised || 0) + amount;
  const newStatus = newRaised >= request.amountRequested ? 'fulfilled' : request.status;

  await Request.updateOne(
    { _id: requestId },
    { amountRaised: newRaised, status: newStatus }
  );

  return res.status(201).json(new ApiResponse(donation, 'Donation created'));
});

const listDonations = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === 'admin';
  const filter = isAdmin ? {} : { donorId: req.user.id };

  const donations = await Donation.find(filter)
    .populate('requestId', 'title')
    .sort({ createdAt: -1 });

  return res.json(new ApiResponse(donations));
});

const donationHistory = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ donorId: req.user.id })
    .populate('requestId', 'title')
    .sort({ createdAt: -1 });
  return res.json(new ApiResponse(donations));
});

module.exports = {
  createDonation,
  listDonations,
  donationHistory,
};


