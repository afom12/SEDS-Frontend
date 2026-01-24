const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  return res.json(new ApiResponse(categories));
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    throw new ApiError(400, 'Name is required');
  }

  const category = await Category.create({ name, description: description || '' });
  return res.status(201).json(new ApiResponse(category, 'Category created'));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  );
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return res.json(new ApiResponse(category, 'Category updated'));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return res.json(new ApiResponse({}, 'Category deleted'));
});

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};


