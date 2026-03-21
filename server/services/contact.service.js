import { Contact } from "../models/index.js";
import { Op } from "sequelize";

export const ContactService = {
  async create(data) {
    return Contact.create({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      status: "new",
    });
  },

  async getAll({ page = 1, limit = 10, status, search } = {}) {
    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Contact.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: Number(limit),
      offset: Number(offset),
    });
    return { total: count, page: Number(page), limit: Number(limit), data: rows };
  },

  async getById(id) {
    const contact = await Contact.findByPk(id);
    if (!contact) throw new Error("Liên hệ không tồn tại");
    return contact;
  },

  async updateStatus(id, status) {
    const contact = await Contact.findByPk(id);
    if (!contact) throw new Error("Liên hệ không tồn tại");

    const validStatuses = ["new", "read", "replied"];
    if (!validStatuses.includes(status)) {
      throw new Error("Trạng thái không hợp lệ");
    }

    await contact.update({ status });
    return contact;
  },

  async delete(id) {
    const contact = await Contact.findByPk(id);
    if (!contact) throw new Error("Liên hệ không tồn tại");
    return contact.destroy();
  },
};
