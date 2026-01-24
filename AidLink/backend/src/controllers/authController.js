const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const signAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

const signRefreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username,
  fullName: user.fullName,
  role: user.role,
  isVerified: user.isVerified,
});

const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { email, password, username, fullName, role } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    throw new ApiError(409, 'User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    username,
    fullName,
    role: role || 'donor',
    passwordHash,
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await User.updateOne({ _id: user._id }, { refreshToken });

  return res.status(201).json(
    new ApiResponse(
      { user: sanitizeUser(user), accessToken, refreshToken },
      'User registered successfully'
    )
  );
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await User.updateOne({ _id: user._id }, { refreshToken });

  return res.json(
    new ApiResponse(
      { user: sanitizeUser(user), accessToken, refreshToken },
      'Login successful'
    )
  );
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    throw new ApiError(400, 'Refresh token required');
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(payload.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const accessToken = signAccessToken(user);
  return res.json(new ApiResponse({ accessToken }, 'Token refreshed'));
});

const logout = asyncHandler(async (req, res) => {
  await User.updateOne({ _id: req.user.id }, { refreshToken: null });
  return res.json(new ApiResponse({}, 'Logged out'));
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return res.json(new ApiResponse(sanitizeUser(user)));
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  me,
};





