const { validationResult } = require('express-validator');
const Request = require('../models/Request');
const Donation = require('../models/Donation');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const createRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const {
    title,
    description,
    category,
    urgency,
    amountRequested,
    location,
    documents,
  } = req.body;

  const request = await Request.create({
    requestedBy: req.user.id,
    title,
    description,
    category,
    urgency,
    amountRequested,
    location,
    documents,
    organizationId: req.body.organizationId || null,
  });

  await logActivity(req.user.id, 'CREATE_REQUEST', 'Request', request._id);
  return res.status(201).json(new ApiResponse(request, 'Request created'));
});

const listRequests = asyncHandler(async (req, res) => {
  const { status, category, urgency } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (urgency) filter.urgency = urgency;

  const requests = await Request.find(filter).sort({ createdAt: -1 });
  return res.json(new ApiResponse(requests));
});

const getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) {
    throw new ApiError(404, 'Request not found');
  }
  return res.json(new ApiResponse(request));
});

const approveRequest = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: 'approved', adminNotes: adminNotes || '' },
    { new: true }
  );

  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  await logActivity(req.user.id, 'APPROVE_REQUEST', 'Request', request._id);
  return res.json(new ApiResponse(request, 'Request approved'));
});

const rejectRequest = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected', adminNotes: adminNotes || '' },
    { new: true }
  );

  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  await logActivity(req.user.id, 'REJECT_REQUEST', 'Request', request._id);
  return res.json(new ApiResponse(request, 'Request rejected'));
});

const getIncomingRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ requestedBy: req.user.id }).sort({ createdAt: -1 });
  return res.json(new ApiResponse(requests));
});

const getOutgoingRequests = asyncHandler(async (req, res) => {
  if (req.user.role === 'donor') {
    const donations = await Donation.find({ donorId: req.user.id }).select('requestId');
    const requestIds = donations.map((d) => d.requestId);
    const requests = await Request.find({ _id: { $in: requestIds } }).sort({ createdAt: -1 });
    return res.json(new ApiResponse(requests));
  }

  const requests = await Request.find({ requestedBy: req.user.id }).sort({ createdAt: -1 });
  return res.json(new ApiResponse(requests));
});

module.exports = {
  createRequest,
  listRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  getIncomingRequests,
  getOutgoingRequests,
};




