import { ProductService } from "../services/product.service.js";


export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductService.getAll(req.query);
    res.status(200).json({ status: "success", data: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await ProductService.getById(req.params.id);
    if (!product) return res.status(404).json({ status: "error", message: "Product not found" });
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


export const getProductBySlug = async (req, res) => {
  try {
    const product = await ProductService.getBySlug(req.params.slug);
    if (!product) return res.status(404).json({ status: "error", message: "Product not found" });
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const data = req.body;

    if (data.categoryIds && typeof data.categoryIds === "string") {
      data.categoryIds = data.categoryIds.split(",").map(Number);
    }
    const product = await ProductService.create(data, req.files);
    res.status(201).json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = req.body;
    if (data.categoryIds && typeof data.categoryIds === "string") {
      data.categoryIds = data.categoryIds.split(",").map(Number);
    }
    const product = await ProductService.update(req.params.id, data, req.files);
    if (!product) return res.status(404).json({ status: "error", message: "Product not found" });
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await ProductService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ status: "error", message: "Product not found" });
    res.status(200).json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
