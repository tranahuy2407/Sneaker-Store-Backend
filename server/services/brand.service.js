import { Op } from "sequelize";
import { sequelize, Brand, Product, ProductImage, Category } from "../models/index.js";
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

  async getProductsBySlug(slug, filters = {}) {
    const {
      page = 1,
      limit = 20,
      minPrice,
      maxPrice,
      categoryIds,
      sort,
      search
    } = filters;

    const brand = await this.getBySlug(slug);
    if (!brand) throw new Error("Thương hiệu không tồn tại");

    const where = { brand_id: brand.id, status: "Active" };

    // Price Filter
    if (minPrice || maxPrice) {
      where.discountPrice = {};
      if (minPrice) where.discountPrice[Op.gte] = Number(minPrice);
      if (maxPrice) where.discountPrice[Op.lte] = Number(maxPrice);
    }

    let categoryFilter = {};
    if (categoryIds) {
      const ids = Array.isArray(categoryIds) ? categoryIds : categoryIds.split(",").map(Number);
      categoryFilter = { id: { [Op.in]: ids } };
    }

    const order = [];
    if (sort === "price_asc") order.push(["discountPrice", "ASC"]);
    else if (sort === "price_desc") order.push(["discountPrice", "DESC"]);
    else if (sort === "name_asc") order.push(["name", "ASC"]);
    else if (sort === "name_desc") order.push(["name", "DESC"]);
    else if (sort === "newest") order.push(["created_at", "DESC"]);
    else order.push(["created_at", "DESC"]);

    if (search) {
      where.name = sequelize.where(
        sequelize.fn("LOWER", sequelize.col("Product.name")),
        "LIKE",
        `%${search.toLowerCase()}%`
      );
    }

    return await PaginationService.paginate(Product, {
      page: Number(page),
      limit: Number(limit),
      where,
      order,
      include: [
        { model: ProductImage, as: "images", attributes: ["id", "url", "isDefault"] },
        { 
          model: Category, 
          as: "categories", 
          attributes: ["id", "name", "slug"], 
          through: { attributes: [] },
          ...(Object.keys(categoryFilter).length > 0 ? { where: categoryFilter } : {}),
        },
      ],
    });
  },

  async getProducts(brandId) {
    return await Product.findAll({
      where: { brand_id: brandId },
      include: ["images"],
      order: [["created_at", "DESC"]],
    });
  },
};
