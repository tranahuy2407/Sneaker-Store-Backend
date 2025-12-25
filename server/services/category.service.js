import Category from "../models/category.model.js";
import { Product, Brand, ProductImage } from "../models/index.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "./cloudinary.service.js";
import { PaginationService } from "./pagination.service.js";

export const CategoryService = {
  
 async getAll({ page = 1, limit = 10, search, status }) {
    const where = {};
    if (status) where.status = status;

    return await PaginationService.paginate(Category, {
      page,
      limit,
      where,
      search: search ? { key: "name", value: search } : null,
      order: [["created_at", "DESC"]],
    });
  },

  // Lấy category theo slug
  async getBySlug(slug) {
    return await Category.findOne({ where: { slug, status: "Active" } });
  },

  //Lấy theo id
  async getById(id) {
    return await Category.findByPk(id);
  },
 async create(data, file) {
    try {
      if (file) data.image = file.path; 
      return await Category.create(data);
    } catch (error) {
      console.error("CategoryService.create error:", error);
      throw error;
    }
  },

  async update(id, data, file) {
    try {
      const category = await Category.findByPk(id);
      if (!category) return null;

      if (file) {
        if (category.image) await deleteFromCloudinary(category.image);
        data.image = file.path;
      }

      const [updated] = await Category.update(data, { where: { id } });
      if (!updated) return null;
      return await Category.findByPk(id);
    } catch (error) {
      console.error("CategoryService.update error:", error);
      throw error;
    }
  },
  // Xóa category
  async delete(id) {
    try {
      const category = await Category.findByPk(id);
      if (!category) return false;
      if (category.image) {
        await deleteFromCloudinary(category.image);
      }

      const deleted = await Category.destroy({ where: { id } });
      return deleted > 0;
    } catch (error) {
      throw error;
    }
  },
 async getProducts(categoryId, filters = {}) {
  const {
    page = 1,
    limit = 20,
    brandId,
    minPrice,
    maxPrice,
    sort,
    search
  } = filters;

  const where = {
    status: "Active"
  };

  if (brandId) where.brand_id = parseInt(brandId);

  if (minPrice || maxPrice) {
    where.discountPrice = {};
    if (minPrice) where.discountPrice[Op.gte] = Number(minPrice);
    if (maxPrice) where.discountPrice[Op.lte] = Number(maxPrice);
  }

  let order = [["created_at", "DESC"]];

  switch (sort) {
    case "price_asc":
      order = [["discountPrice", "ASC"]];
      break;

    case "price_desc":
      order = [["discountPrice", "DESC"]];
      break;

    case "name_asc":
      order = [["name", "ASC"]];
      break;

    case "name_desc":
      order = [["name", "DESC"]];
      break;
  }

  const include = [
    {
      model: Category,
      as: "categories",
      where: { id: categoryId },
      attributes: ["id", "name", "slug"],
      through: { attributes: [] }
    },
    {
      model: Brand,
      as: "brand",
      attributes: ["id", "name", "slug"]
    },
    {
      model: ProductImage,
      as: "images",
      attributes: ["id", "url", "isDefault"]
    }
  ];

  if (search) {
    where.name = sequelize.where(
      sequelize.fn("LOWER", sequelize.col("Product.name")),
      "LIKE",
      `%${search.toLowerCase()}%`
    );
  }

  // PAGINATION
  return PaginationService.paginate(Product, {
    page,
    limit,
    where,
    include,
    order
  });
},
 async getProductsBySlug(slug, filters = {}) {
  const category = await this.getBySlug(slug);
  if (!category) throw new Error("Category not found");
  return await this.getProducts(category.id, filters);
}

};
