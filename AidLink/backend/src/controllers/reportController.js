const { validationResult } = require('express-validator');
const Report = require('../models/Report');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  return res.json(new ApiResponse(reports));
});

const createReport = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { title, description } = req.body;
  const report = await Report.create({
    title,
    description: description || '',
    createdBy: req.user.id,
  });

  return res.status(201).json(new ApiResponse(report, 'Report created'));
});

module.exports = {
  listReports,
  createReport,
};


