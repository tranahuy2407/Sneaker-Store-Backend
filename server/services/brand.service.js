import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "./cloudinary.service.js";
import { PaginationService } from "./pagination.service.js";

export const BrandService = {
  async getAll({ page = 1, limit = 10, search, status }) {
    const where = {};
    if (status) where.status = status;

    return await PaginationService.paginate(Brand, {
      page,
      limit,
      where,
      search: search ? { key: "name", value: search } : null,
      order: [["created_at", "DESC"]],
    });
  },

  async getBySlug(slug) {
    return await Brand.findOne({ where: { slug, status: "Active" } });
  },

  async getById(id) {
    return await Brand.findByPk(id);
  },

  async create(data, file) {
    try {
      if (file) data.image = file.path;
      return await Brand.create(data);
    } catch (error) {
      console.error("BrandService.create error:", error);
      throw error;
    }
  },

  async update(id, data, file) {
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) return null;

      if (file) {
        if (brand.image) await deleteFromCloudinary(brand.image);
        data.image = file.path;
      }

      const [updated] = await Brand.update(data, { where: { id } });
      if (!updated) return null;
      return await Brand.findByPk(id);
    } catch (error) {
      console.error("BrandService.update error:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) return false;

      if (brand.image) {
        await deleteFromCloudinary(brand.image);
      }

      const deleted = await Brand.destroy({ where: { id } });
      return deleted > 0;
    } catch (error) {
      console.error("BrandService.delete error:", error);
      throw error;
    }
  },

  async getProducts(brandId) {
    return await Product.findAll({
      where: { brand_id: brandId },
      order: [["created_at", "DESC"]],
    });
  },
};
