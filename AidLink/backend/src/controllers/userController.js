const { validationResult } = require('express-validator');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res.json(new ApiResponse(users));
});

const getUserById = asyncHandler(async (req, res) => {
  const isSelf = req.user.id === req.params.id;
  const isAdmin = req.user.role === 'admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(403, 'Forbidden');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res.json(new ApiResponse(user));
});

const updateUser = asyncHandler(async (req, res) => {
  const isSelf = req.user.id === req.params.id;
  const isAdmin = req.user.role === 'admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(403, 'Forbidden');
  }

  const updates = { fullName: req.body.fullName, email: req.body.email };
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res.json(new ApiResponse(user, 'User updated'));
});

const verifyUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await logActivity(req.user.id, 'VERIFY_USER', 'User', user._id);
  return res.json(new ApiResponse(user, 'User verified'));
});

const suspendUser = asyncHandler(async (req, res) => {
  const { isSuspended } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isSuspended: isSuspended !== false },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await logActivity(req.user.id, 'SUSPEND_USER', 'User', user._id, { isSuspended: user.isSuspended });
  return res.json(new ApiResponse(user, 'User updated'));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!role) {
    throw new ApiError(400, 'Role is required');
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await logActivity(req.user.id, 'UPDATE_USER_ROLE', 'User', user._id, { role });
  return res.json(new ApiResponse(user, 'Role updated'));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await logActivity(req.user.id, 'DELETE_USER', 'User', user._id);
  return res.json(new ApiResponse({}, 'User deleted'));
});

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  verifyUser,
  suspendUser,
  updateUserRole,
  deleteUser,
};

