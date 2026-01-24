const Organization = require('../models/Organization');
const Request = require('../models/Request');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listOrganizations = asyncHandler(async (req, res) => {
  const orgs = await Organization.find().sort({ createdAt: -1 });
  return res.json(new ApiResponse(orgs));
});

const createOrganization = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  if (!name) {
    throw new ApiError(400, 'Name is required');
  }
  const org = await Organization.create({ name, type: type || 'OTHER' });
  return res.status(201).json(new ApiResponse(org, 'Organization created'));
});

const updateOrganization = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  const org = await Organization.findByIdAndUpdate(
    req.params.id,
    { name, type },
    { new: true }
  );
  if (!org) {
    throw new ApiError(404, 'Organization not found');
  }
  return res.json(new ApiResponse(org, 'Organization updated'));
});

const deleteOrganization = asyncHandler(async (req, res) => {
  const org = await Organization.findByIdAndDelete(req.params.id);
  if (!org) {
    throw new ApiError(404, 'Organization not found');
  }
  return res.json(new ApiResponse({}, 'Organization deleted'));
});

const verifyOrganization = asyncHandler(async (req, res) => {
  const org = await Organization.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    { new: true }
  );
  if (!org) {
    throw new ApiError(404, 'Organization not found');
  }
  return res.json(new ApiResponse(org, 'Organization verified'));
});

const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(400, 'userId is required');
  }
  const org = await Organization.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { members: userId } },
    { new: true }
  );
  if (!org) {
    throw new ApiError(404, 'Organization not found');
  }
  return res.json(new ApiResponse(org, 'Member added'));
});

const listMembers = asyncHandler(async (req, res) => {
  const org = await Organization.findById(req.params.id).populate('members', 'fullName email role');
  if (!org) {
    throw new ApiError(404, 'Organization not found');
  }
  return res.json(new ApiResponse(org.members || []));
});

const listOrganizationRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ organizationId: req.params.id }).sort({ createdAt: -1 });
  return res.json(new ApiResponse(requests));
});

module.exports = {
  listOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  verifyOrganization,
  addMember,
  listMembers,
  listOrganizationRequests,
};


