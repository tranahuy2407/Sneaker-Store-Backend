import { CategoryService } from "../services/category.service.js";

export const getAllCategories = async (req, res) => {
  try {
    const { page, limit, search, status } = req.query;
    const result = await CategoryService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search,
      status,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await CategoryService.getBySlug(req.params.slug);
    if (!category)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryService.getById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: category });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const file = req.file;
    const category = await CategoryService.create(categoryData, file);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    const file = req.file;
    const updated = await CategoryService.update(id, categoryData, file);
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await CategoryService.delete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryProducts = async (req, res) => {
  try {
    const filters = { ...req.query };

    const products = await CategoryService.getProductsBySlug(
      req.params.slug,
      filters
    );

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

