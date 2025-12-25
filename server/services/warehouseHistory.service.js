import {
  WarehouseHistory,
  ProductSize,
  Admin,
  Product,
} from "../models/index.js";
import { PaginationService } from "./pagination.service.js";

export class WarehouseHistoryService {
  // LẤY TẤT CẢ + FILTER + PAGINATION
  static async getAll({ page = 1, limit = 10, sizeId, productId }) {
    const where = {};
    if (sizeId) where.size_id = sizeId;

    const include = [
      {
        model: ProductSize,
        as: "size",
        attributes: ["id", "product_id", "size", "stock"],
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name"],
          },
        ],
      },
      {
        model: Admin,
        as: "admin",
        attributes: ["id", "username"],
      },
    ];

    if (productId) {
      include[0].where = { product_id: productId };
    }

    const options = {
      page,
      limit,
      where,
      include,
      order: [["created_at", "DESC"]],
    };

    return await PaginationService.paginate(WarehouseHistory, options);
  }

  // Lấy theo ID
  static async getById(id) {
    return await WarehouseHistory.findByPk(id, {
      include: [
        {
          model: ProductSize,
          as: "size",
          attributes: ["id", "product_id", "size", "stock"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "username"],
        },
      ],
    });
  }

  static async create({ size_id, change_quantity, admin_id }) {
    const size = await ProductSize.findByPk(size_id);
    if (!size) throw new Error("Product size not found");

    const old_quantity = size.stock;
    const new_quantity = old_quantity + change_quantity;

    if (new_quantity < 0) {
      throw new Error("Stock cannot be negative");
    }

    await size.update({ stock: new_quantity });

    return await WarehouseHistory.create({
      size_id,
      admin_id,
      old_quantity,
      new_quantity,
      change_quantity,
    });
  }

  // UPDATE
  static async update(id, data) {
    const history = await WarehouseHistory.findByPk(id);
    if (!history) throw new Error("Warehouse history not found");

    await history.update(data);
    return history;
  }

  // DELETE
  static async delete(id) {
    const history = await WarehouseHistory.findByPk(id);
    if (!history) throw new Error("Warehouse history not found");

    await history.destroy();
    return true;
  }
}
