import { News } from "../models/index.js";
import { Op } from "sequelize";

export const NewsService = {
  async getActive({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const { count, rows } = await News.findAndCountAll({
      where: { status: "Active" },
      order: [["created_at", "DESC"]],
      limit: Number(limit),
      offset: Number(offset),
    });
    return { total: count, page: Number(page), limit: Number(limit), data: rows };
  },

  // PUBLIC: chi tiết 1 tin qua slug
  async getBySlug(slug) {
    const news = await News.findOne({ where: { slug, status: "Active" } });
    if (!news) throw new Error("Tin tức không tồn tại");
    return news;
  },

  // PUBLIC: chi tiết 1 tin qua ID
  async getById(id) {
    const news = await News.findByPk(id);
    if (!news) throw new Error("Tin tức không tồn tại");
    return news;
  },
  async getAll({ page = 1, limit = 10, status, search } = {}) {
    const where = {};
    if (status) where.status = status;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const offset = (page - 1) * limit;
    const { count, rows } = await News.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: Number(limit),
      offset: Number(offset),
    });
    return { total: count, page: Number(page), limit: Number(limit), data: rows };
  },

  // ADMIN: tạo tin tức
  async create(data) {
    const slug = data.slug || this.generateSlug(data.title);
    return News.create({
      title: data.title,
      slug: slug,
      summary: data.summary || null,
      content: data.content,
      image_url: data.image_url || null,
      author: data.author || null,
      status: data.status || "Active",
    });
  },

  // ADMIN: cập nhật tin tức
  async update(id, data) {
    const news = await News.findByPk(id);
    if (!news) throw new Error("Tin tức không tồn tại");

    const updateData = {
      title: data.title ?? news.title,
      summary: data.summary ?? news.summary,
      content: data.content ?? news.content,
      image_url: data.image_url ?? news.image_url,
      author: data.author ?? news.author,
      status: data.status ?? news.status,
    };

    if (data.title && !data.slug) {
      updateData.slug = this.generateSlug(data.title);
    } else if (data.slug) {
      updateData.slug = data.slug;
    }

    await news.update(updateData);
    return news;
  },

  generateSlug(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  async delete(id) {
    const news = await News.findByPk(id);
    if (!news) throw new Error("Tin tức không tồn tại");
    return news.destroy();
  },
};
