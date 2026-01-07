import { ShippingCost } from "../models/index.js";

export class ShippingCostService {
  // Lấy danh sách 
  async getAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;

    const { rows, count } = await ShippingCost.findAndCountAll({
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // Lấy chi tiết
  async getById(id) {
    const item = await ShippingCost.findByPk(id);
    if (!item) throw new Error("Không tìm thấy phí vận chuyển");
    return item;
  }

  // Tạo mới
  async create(data) {
    return await ShippingCost.create({
      name: data.name,
      cost: data.cost,
    });
  }

  // Cập nhật
  async update(id, data) {
    const item = await this.getById(id);

    await item.update({
      name: data.name ?? item.name,
      cost: data.cost ?? item.cost,
    });

    return item;
  }

  // Xóa
  async delete(id) {
    const item = await this.getById(id);
    await item.destroy();
    return true;
  }

  // lấy phí theo tên tỉnh/thành
  async getCostByName(name) {
    const item = await ShippingCost.findOne({
      where: { name },
    });

    return item?.cost ?? 0;
  }
}
