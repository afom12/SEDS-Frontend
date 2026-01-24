const ActivityLog = require('../models/ActivityLog');

const logActivity = async (actorId, action, targetType = '', targetId = null, metadata = {}) => {
  try {
    await ActivityLog.create({
      actorId,
      action,
      targetType,
      targetId,
      metadata,
    });
  } catch (err) {
    // Avoid breaking core flows on log failure
    console.warn('ActivityLog write failed:', err.message);
  }
};

module.exports = logActivity;


