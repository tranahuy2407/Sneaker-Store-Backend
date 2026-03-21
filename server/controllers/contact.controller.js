import { ContactService } from "../services/contact.service.js";

export const ContactController = {
  async create(req, res) {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ message: "Họ tên, email và nội dung là bắt buộc" });
      }

      const contact = await ContactService.create({ name, email, phone, subject, message });
      res.status(201).json({ message: "Gửi liên hệ thành công", data: contact });
    } catch (err) {
      console.error("CREATE CONTACT ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const { page, limit, status, search } = req.query;
      const result = await ContactService.getAll({ page, limit, status, search });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ADMIN: chi tiết liên hệ
  async getById(req, res) {
    try {
      const { id } = req.params;
      const contact = await ContactService.getById(id);
      res.status(200).json({ data: contact });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  // ADMIN: cập nhật trạng thái liên hệ
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Trạng thái là bắt buộc" });
      }

      const contact = await ContactService.updateStatus(id, status);
      res.status(200).json({ message: "Cập nhật trạng thái thành công", data: contact });
    } catch (err) {
      console.error("UPDATE CONTACT STATUS ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // ADMIN: xóa liên hệ
  async delete(req, res) {
    try {
      const { id } = req.params;
      await ContactService.delete(id);
      res.status(200).json({ message: "Đã xóa liên hệ" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
