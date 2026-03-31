import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories.length > 0) {
      return res.status(400).json({
        success: false,
        message: "no category found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All categories",
      count: categories.length,
      categories: categories,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }
    const category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists.",
      });
    }

    const newCategory = await Category.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    return res.status(201).json({
      success: true,
      message: "New category created.",
      category: newCategory,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: `Category with id ${req.params.id} successfully deleted: `,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

export const updatedCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      validators: true,
    });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: `Category with id ${req.params.id} successfully updated`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};
