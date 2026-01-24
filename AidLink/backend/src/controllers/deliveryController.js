const { validationResult } = require('express-validator');
const Delivery = require('../models/Delivery');
const Request = require('../models/Request');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createDelivery = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { requestId, notes, proof } = req.body;
  const request = await Request.findById(requestId);
  if (!request) {
    throw new ApiError(404, 'Request not found');
  }

  const delivery = await Delivery.create({
    requestId,
    donorId: req.user.id,
    notes: notes || '',
    proof: proof || [],
  });

  return res.status(201).json(new ApiResponse(delivery, 'Delivery created'));
});

const listDeliveries = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== 'admin') {
    filter.donorId = req.user.id;
  }

  const deliveries = await Delivery.find(filter)
    .populate('requestId', 'title')
    .sort({ createdAt: -1 });

  return res.json(new ApiResponse(deliveries));
});

const getDeliveryById = asyncHandler(async (req, res) => {
  const delivery = await Delivery.findById(req.params.id).populate('requestId', 'title');
  if (!delivery) {
    throw new ApiError(404, 'Delivery not found');
  }
  return res.json(new ApiResponse(delivery));
});

const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  const delivery = await Delivery.findByIdAndUpdate(
    req.params.id,
    { status, notes: notes || '' },
    { new: true }
  );

  if (!delivery) {
    throw new ApiError(404, 'Delivery not found');
  }

  return res.json(new ApiResponse(delivery, 'Status updated'));
});

const confirmDelivery = asyncHandler(async (req, res) => {
  const delivery = await Delivery.findByIdAndUpdate(
    req.params.id,
    { status: 'confirmed' },
    { new: true }
  );

  if (!delivery) {
    throw new ApiError(404, 'Delivery not found');
  }

  return res.json(new ApiResponse(delivery, 'Delivery confirmed'));
});

module.exports = {
  createDelivery,
  listDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
  confirmDelivery,
};


