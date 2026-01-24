const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const submitComplaint = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { message, requestId } = req.body;
  const complaint = await Complaint.create({
    userId: req.user.id,
    message,
    requestId: requestId || null,
  });

  await logActivity(req.user.id, 'SUBMIT_COMPLAINT', 'Complaint', complaint._id);
  return res.status(201).json(new ApiResponse(complaint, 'Complaint submitted'));
});

const getComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  return res.json(new ApiResponse(complaints));
});

const resolveComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status: 'resolved', resolvedBy: req.user.id, resolvedAt: new Date() },
    { new: true }
  );
  if (!complaint) {
    throw new ApiError(404, 'Complaint not found');
  }
  await logActivity(req.user.id, 'RESOLVE_COMPLAINT', 'Complaint', complaint._id);
  return res.json(new ApiResponse(complaint, 'Complaint resolved'));
});

module.exports = {
  submitComplaint,
  getComplaints,
  resolveComplaint,
};


