import { Op } from "sequelize";
import { sequelize, Product, ProductImage, Brand, Category, ProductSize } from "../models/index.js";
import { PaginationService } from "./pagination.service.js";

export const ProductService = {
  // Lấy tất cả sản phẩm
  async getAll({ page = 1, limit = 10, search, status, categoryId, categoryIds, brandId, brandIds, minPrice, maxPrice, sort }) {
    const where = { status: status || "Active" };
    
    // Brand Filter
    if (brandIds) {
      const ids = Array.isArray(brandIds)
        ? brandIds.map(Number)
        : brandIds.split(",").map((id) => Number(id.trim())).filter(Boolean);
      where.brand_id = { [Op.in]: ids };
    } else if (brandId) {
      where.brand_id = parseInt(brandId);
    }

    // Price Filter - lọc theo discountPrice (nếu có) hoặc price
    if (minPrice !== undefined && minPrice !== '' && minPrice !== null ||
        maxPrice !== undefined && maxPrice !== '' && maxPrice !== null) {
      const priceCondition = {};
      if (minPrice !== undefined && minPrice !== '' && minPrice !== null)
        priceCondition[Op.gte] = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '' && maxPrice !== null)
        priceCondition[Op.lte] = Number(maxPrice);
      where.discountPrice = priceCondition;
    }

    // Category Filter
    let hasCategoryFilter = false;
    let categoryFilter = {};
    if (categoryIds) {
      const ids = Array.isArray(categoryIds)
        ? categoryIds.map(Number)
        : categoryIds.split(",").map((id) => Number(id.trim())).filter(Boolean);
      if (ids.length > 0) {
        categoryFilter = { id: { [Op.in]: ids } };
        hasCategoryFilter = true;
      }
    } else if (categoryId) {
      categoryFilter = { id: parseInt(categoryId) };
      hasCategoryFilter = true;
    }

    const include = [
      { model: Brand, as: "brand", attributes: ["id", "name"] },
      { model: ProductImage, as: "images", attributes: ["id", "url", "isDefault", "allText"] },
      { model: ProductSize, as: "sizes", attributes: ["id", "size", "stock"] },
      {
        model: Category,
        as: "categories",
        attributes: ["id", "name"],
        through: { attributes: [] },
        // Khi có filter category: dùng INNER JOIN (required: true) để đảm bảo lọc đúng
        ...(hasCategoryFilter ? { where: categoryFilter, required: true } : { required: false }),
      },
    ];

    let order = [["created_at", "DESC"]];

    switch (sort) {
      case "name_asc":
        order = [["name", "ASC"]];
        break;
      case "name_desc":
        order = [["name", "DESC"]];
        break;
      case "price_asc":
        order = [["discountPrice", "ASC"]];
        break;
      case "price_desc":
        order = [["discountPrice", "DESC"]];
        break;
      case "newest":
        order = [["created_at", "DESC"]];
        break;
      case "popular":
        order = [["created_at", "DESC"]];
        break;
      case "discount":
        // Sắp xếp theo % giảm nhiều nhất
        order = [[sequelize.literal("(price - discountPrice) / price"), "DESC"]];
        break;
      default:
        order = [["created_at", "DESC"]];
    }

    if (search) {
      const keyword = search.toLowerCase();

      const findByName = Product.findAll({
        where: {
          ...where,
          name: sequelize.where(
            sequelize.fn("LOWER", sequelize.col("Product.name")),
            "LIKE",
            `%${keyword}%`
          ),
        },
        include,
        order,
      });

      const findByBrand = Product.findAll({
        where,
        include: [
          ...include.filter(inc => inc.as !== "brand"), // Replace brand include
          {
            model: Brand,
            as: "brand",
            where: sequelize.where(
              sequelize.fn("LOWER", sequelize.col("brand.name")),
              "LIKE",
              `%${keyword}%`
            ),
          },
        ],
        order,
      });

      const findByCategory = Product.findAll({
        where,
        include: [
          ...include.filter(inc => inc.as !== "categories"), // Replace categories include
          {
            model: Category,
            as: "categories",
            through: { attributes: [] },
            where: {
              ...(Object.keys(categoryFilter).length > 0 ? categoryFilter : {}),
              name: sequelize.where(
                sequelize.fn("LOWER", sequelize.col("categories.name")),
                "LIKE",
                `%${keyword}%`
              ),
            },
          },
        ],
        order,
      });

      const [byName, byBrand, byCategory] = await Promise.all([
        findByName,
        findByBrand,
        findByCategory,
      ]);

      const merged = [...byName, ...byBrand, ...byCategory];
      const matched = [];
      const seen = new Set();

      for (const p of merged) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          matched.push(p);
        }
      }

      const all = matched;
      const total = all.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const items = all.slice(start, start + limit);

      return {
        data: items,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
        },
        matchedCount: matched.length,
      };
    }

    return PaginationService.paginate(Product, {
      page: Number(page),
      limit: Number(limit),
      where,
      include,
      order,
    });
  },
  async getById(id) {
    return Product.findByPk(id, {
      include: [
        { model: Brand, as: "brand", attributes: ["id", "name", "slug"] },
        { model: Category, as: "categories", attributes: ["id", "name", "slug"], through: { attributes: [] } },
        { model: ProductImage, as: "images", attributes: ["id", "url", "isDefault", "allText"] },
        { model: ProductSize, as: "sizes", attributes: ["id", "size" , "stock"],},
      ],
    });
  },

  async getBySlug(slug) {
    return Product.findOne({
      where: { slug, status: "Active" },
      include: [
        { model: Brand, as: "brand", attributes: ["id", "name", "slug"] },
        { model: Category, as: "categories", attributes: ["id", "name", "slug"], through: { attributes: [] } },
        { model: ProductImage, as: "images", attributes: ["id", "url", "isDefault", "allText"] },
        { model: ProductSize, as: "sizes", attributes: ["id", "size", "stock"]},
      ],
    });
  },

async create(data, files) {
  const t = await sequelize.transaction();
  try {
    if (data.brand_id) data.brand_id = parseInt(data.brand_id);
    if (data.price) data.price = parseFloat(data.price);
    if (data.discountPrice) data.discountPrice = parseFloat(data.discountPrice);
    if (data.mainImageIndex) data.mainImageIndex = parseInt(data.mainImageIndex);

    if (data.categoryIds) {
      if (!Array.isArray(data.categoryIds)) data.categoryIds = [data.categoryIds];
      data.categoryIds = data.categoryIds.map(Number);
    }

    let sizesArray = [];
    if (data.sizes) {
      if (!Array.isArray(data.sizes)) {
        sizesArray = [JSON.parse(data.sizes)];
      } else {
        sizesArray = data.sizes.map(s => (typeof s === 'string' ? JSON.parse(s) : s));
      }
    }

    const product = await Product.create(data, { transaction: t });

    if (data.categoryIds && data.categoryIds.length > 0) {
      await product.setCategories(data.categoryIds, { transaction: t });
    }

    if (files && files.length > 0) {
      const mainIndex = data.mainImageIndex || 0;
      const images = files.map((f, index) => ({
        product_id: product.id,
        url: f.path || f.secure_url || f.location,
        isDefault: index === mainIndex,
      }));
      await ProductImage.bulkCreate(images, { transaction: t });
    }

    if (sizesArray.length > 0) {
      const sizeRecords = sizesArray.map(s => {
        const sizeVal = (typeof s === 'object' && s !== null) ? s.size : s;
        const stockVal = (typeof s === 'object' && s !== null) ? (s.stock || 0) : 0;
        
        if (sizeVal === undefined || sizeVal === null) {
          throw new Error("Mỗi bản ghi kích thước phải có giá trị 'size'");
        }

        return {
          product_id: product.id,
          size: parseFloat(sizeVal),
          stock: parseInt(stockVal),
        };
      });
      await ProductSize.bulkCreate(sizeRecords, { transaction: t });
    }
    await t.commit();

   const fullProduct = await ProductService.getById(product.id);
    return fullProduct;
  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error("Create product error:", err);
    throw err;
  }
},

async update(id, data, files) {
  const t = await sequelize.transaction();
  try {
    const product = await Product.findByPk(id);
    if (!product) throw new Error("Product not found");

    if (data.brand_id) data.brand_id = parseInt(data.brand_id);
    if (data.price) data.price = parseFloat(data.price);
    if (data.discountPrice) data.discountPrice = parseFloat(data.discountPrice);
    if (data.mainImageIndex) data.mainImageIndex = parseInt(data.mainImageIndex);

    // categoryIds
    if (data.categoryIds) {
      if (!Array.isArray(data.categoryIds)) data.categoryIds = [data.categoryIds];
      data.categoryIds = data.categoryIds.map(Number);
    }

    // sizes
    let sizesArray = [];
    if (data.sizes) {
      if (!Array.isArray(data.sizes)) {
        sizesArray = [JSON.parse(data.sizes)];
      } else {
        sizesArray = data.sizes.map(s => (typeof s === 'string' ? JSON.parse(s) : s));
      }
    }
    await product.update(data, { transaction: t });
    if (data.categoryIds) {
      await product.setCategories(data.categoryIds, { transaction: t });
    }

    if (files && files.length > 0) {
      const mainIndex = data.mainImageIndex || 0;
      const images = files.map((f, index) => ({
        product_id: product.id,
        url: f.path || f.secure_url || f.location,
        isDefault: index === mainIndex,
      }));
      await ProductImage.bulkCreate(images, { transaction: t });
    }

    if (sizesArray.length > 0) {
      await ProductSize.destroy({ where: { product_id: product.id }, transaction: t });
      const sizeRecords = sizesArray.map(s => {
        const sizeVal = (typeof s === 'object' && s !== null) ? s.size : s;
        const stockVal = (typeof s === 'object' && s !== null) ? (s.stock || 0) : 0;

        if (sizeVal === undefined || sizeVal === null) {
          throw new Error("Mỗi bản ghi kích thước phải có giá trị 'size'");
        }

        return {
          product_id: product.id,
          size: parseFloat(sizeVal),
          stock: parseInt(stockVal),
        };
      });
      await ProductSize.bulkCreate(sizeRecords, { transaction: t });
    }
    await t.commit();
 
  const fullProduct = await ProductService.getById(product.id);
  return fullProduct;
  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error("Update product error:", err);
    throw err;
  }
},


  async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return false;

    await ProductImage.destroy({ where: { product_id: id } });
    const deleted = await Product.destroy({ where: { id } });
    return deleted > 0;
  },
};
