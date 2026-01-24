const Notification = require('../models/Notification');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(100);
  return res.json(new ApiResponse(notifications));
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { read: true },
    { new: true }
  );
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }
  return res.json(new ApiResponse(notification, 'Notification marked as read'));
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    throw new ApiError(400, 'Title and message are required');
  }

  const { userIds } = req.body;
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ApiError(400, 'userIds must be a non-empty array');
  }

  const notifications = await Notification.insertMany(
    userIds.map((id) => ({
      userId: id,
      title,
      message,
      type: 'announcement',
    }))
  );

  await logActivity(req.user.id, 'CREATE_ANNOUNCEMENT', 'Notification', null, {
    count: userIds.length,
  });
  return res.status(201).json(new ApiResponse(notifications, 'Announcement sent'));
});

module.exports = {
  getMyNotifications,
  markNotificationRead,
  createAnnouncement,
};

