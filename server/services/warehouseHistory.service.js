import {
  WarehouseHistory,
  ProductSize,
  Admin,
  Product,
} from "../models/index.js";
import { PaginationService } from "./pagination.service.js";

export class WarehouseHistoryService {
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

  // NHẬP HÀNG TỪ EXCEL
  static async importFromExcel(buffer, adminId) {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const results = {
      success: 0,
      errors: [],
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const productSlug = row["Mã sản phẩm"] || row["slug"];
      const productId = row["ID sản phẩm"] || row["product_id"];
      const sizeId = row["ID biến thể"] || row["size_id"] || row["ID Size"];
      
      const sizeValue = row["Kích thước"] || row["size"];
      const quantity = parseInt(row["Số lượng nhập"] || row["quantity"] || row["Số lượng"]);
      const note = row["Ghi chú"] || row["note"] || "Nhập hàng từ Excel";

      try {
        if (!quantity) throw new Error(`Dòng ${i + 2}: Thiếu số lượng`);

        let productSize = null;

        // 1. Ưu tiên tìm theo size_id (ID biến thể)
        if (sizeId) {
          productSize = await ProductSize.findByPk(sizeId);
          if (!productSize) {
            throw new Error(`Dòng ${i + 2}: Biến thể ID '${sizeId}' không tồn tại`);
          }
        } 
        // 2. Tìm theo productId + sizeValue
        else if (productId && sizeValue) {
          productSize = await ProductSize.findOne({
            where: { product_id: productId, size: sizeValue }
          });
          if (!productSize) {
             throw new Error(`Dòng ${i + 2}: Không tìm thấy size '${sizeValue}' cho sản phẩm ID '${productId}'`);
          }
        }
        // 3. Tìm theo productSlug + sizeValue 
        else if (productSlug && sizeValue) {
          const product = await Product.findOne({ where: { slug: productSlug } });
          if (!product) {
            throw new Error(`Dòng ${i + 2}: Sản phẩm với slug '${productSlug}' không tồn tại`);
          }
          productSize = await ProductSize.findOne({
            where: { product_id: product.id, size: sizeValue }
          });
          if (!productSize) {
            // Nếu chưa có size này thì tạo mới (Tùy chọn: có thể lỗi hoặc tạo mới)
            productSize = await ProductSize.create({ product_id: product.id, size: sizeValue, stock: 0 });
          }
        } else {
          throw new Error(`Dòng ${i + 2}: Thiếu thông tin định danh (ID Size hoặc ID Sản phẩm + Size)`);
        }

        const old_quantity = productSize.stock;
        const new_quantity = old_quantity + quantity;

        if (new_quantity < 0) {
          throw new Error(`Dòng ${i + 2}: Tồn kho không thể âm`);
        }

        // Cập nhật tồn kho
        await productSize.update({ stock: new_quantity });

        // Lưu lịch sử
        await WarehouseHistory.create({
          size_id: productSize.id,
          admin_id: adminId,
          old_quantity,
          new_quantity,
          change_quantity: quantity,
          note,
        });

        results.success++;
      } catch (err) {
        results.errors.push({ line: i + 2, message: err.message });
      }
    }

    return results;
  }

  // DELETE
  static async delete(id) {
    const history = await WarehouseHistory.findByPk(id);
    if (!history) throw new Error("Warehouse history not found");

    await history.destroy();
    return true;
  }
}
