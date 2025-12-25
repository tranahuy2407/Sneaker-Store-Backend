import { BrandService } from "../services/brand.service.js";

export const getAllBrands = async (req, res) => {
  try {
    const { page, limit, search, status } = req.query;
    const result = await BrandService.getAll({
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

export const getBrandBySlug = async (req, res) => {
  try {
    const brand = await BrandService.getBySlug(req.params.slug);
    if (!brand)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const brand = await BrandService.getById(req.params.id);
    if (!brand)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const brandData = req.body;
    const file = req.file;
    const brand = await BrandService.create(brandData, file);
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brandData = req.body;
    const file = req.file;
    const updated = await BrandService.update(id, brandData, file);
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const deleted = await BrandService.delete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandProducts = async (req, res) => {
  try {
    const products = await BrandService.getProducts(req.params.id);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
