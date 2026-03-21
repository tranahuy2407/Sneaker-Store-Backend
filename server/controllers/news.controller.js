import { NewsService } from "../services/news.service.js";

export const NewsController = {
  // PUBLIC: danh sách tin tức active
  async getActive(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await NewsService.getActive({ page, limit });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // PUBLIC: chi tiết 1 tin qua slug
  async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const news = await NewsService.getBySlug(slug);
      res.status(200).json({ data: news });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  // PUBLIC: chi tiết 1 tin
  async getById(req, res) {
    try {
      const { id } = req.params;
      const news = await NewsService.getById(id);
      res.status(200).json({ data: news });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  // ADMIN: lấy tất cả tin tức
  async getAll(req, res) {
    try {
      const { page, limit, status, search } = req.query;
      const result = await NewsService.getAll({ page, limit, status, search });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ADMIN: tạo tin tức
  async create(req, res) {
    try {
      const data = { ...req.body };

      if (req.file) {
        data.image_url = req.file.path;
      }

      if (!data.title || !data.content) {
        return res.status(400).json({ message: "Tiêu đề và nội dung là bắt buộc" });
      }

      const news = await NewsService.create(data);
      res.status(201).json({ message: "Tạo tin tức thành công", data: news });
    } catch (err) {
      console.error("CREATE NEWS ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ADMIN: cập nhật tin tức
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      if (req.file) {
        data.image_url = req.file.path;
      }

      const news = await NewsService.update(id, data);
      res.status(200).json({ message: "Cập nhật thành công", data: news });
    } catch (err) {
      console.error("UPDATE NEWS ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ADMIN: xóa tin tức
  async delete(req, res) {
    try {
      const { id } = req.params;
      await NewsService.delete(id);
      res.status(200).json({ message: "Đã xóa tin tức" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
