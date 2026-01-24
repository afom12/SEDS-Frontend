const { validationResult } = require('express-validator');
const Item = require('../models/Item');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const createItem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { title, description, category, quantity, location } = req.body;
  const item = await Item.create({
    donorId: req.user.id,
    title,
    description,
    category,
    quantity,
    location,
  });

  await logActivity(req.user.id, 'CREATE_ITEM', 'Item', item._id, { title });
  return res.status(201).json(new ApiResponse(item, 'Item created'));
});

const getApprovedItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ status: 'approved' }).sort({ createdAt: -1 });
  return res.json(new ApiResponse(items));
});

const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  return res.json(new ApiResponse(items));
});

const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }
  return res.json(new ApiResponse(item));
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findOneAndUpdate(
    { _id: req.params.id, donorId: req.user.id },
    req.body,
    { new: true }
  );
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }
  await logActivity(req.user.id, 'UPDATE_ITEM', 'Item', item._id);
  return res.json(new ApiResponse(item, 'Item updated'));
});

const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findOneAndDelete({ _id: req.params.id, donorId: req.user.id });
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }
  await logActivity(req.user.id, 'DELETE_ITEM', 'Item', item._id);
  return res.json(new ApiResponse({}, 'Item deleted'));
});

const approveItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  );
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }
  await logActivity(req.user.id, 'APPROVE_ITEM', 'Item', item._id);
  return res.json(new ApiResponse(item, 'Item approved'));
});

const rejectItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  );
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }
  await logActivity(req.user.id, 'REJECT_ITEM', 'Item', item._id);
  return res.json(new ApiResponse(item, 'Item rejected'));
});

module.exports = {
  createItem,
  getApprovedItems,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  approveItem,
  rejectItem,
};


