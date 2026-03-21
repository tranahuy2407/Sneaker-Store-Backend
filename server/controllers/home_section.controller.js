import { HomeSectionService } from "../services/home_section.service.js";

export const HomeSectionController = {
  async getActiveSections(req, res) {
    try {
      const sections = await HomeSectionService.getActiveSections();
      res.status(200).json({ data: sections });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getAllSections(req, res) {
    try {
      const sections = await HomeSectionService.getAllSections();
      res.status(200).json({ data: sections });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // CREATE
  async createSection(req, res) {
    try {
      const data = { ...req.body };

      // lấy file upload
      if (req.file) {
        data.banner_url = req.file.path;
      }

      //  validate banner (fix lỗi 500)
      if (!data.banner_url) {
        return res.status(400).json({
          message: "Vui lòng upload banner",
        });
      }

      const section = await HomeSectionService.createSection(data);

      res.status(201).json({
        message: "Thành công",
        data: section,
      });
    } catch (err) {
      console.error("CREATE ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  },

  //  UPDATE
  async updateSection(req, res) {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      if (req.file) {
        data.banner_url = req.file.path;
      }

      const section = await HomeSectionService.updateSection(id, data);

      res.status(200).json({
        message: "Thành công",
        data: section,
      });
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  },

  async deleteSection(req, res) {
    try {
      const { id } = req.params;
      await HomeSectionService.deleteSection(id);
      res.status(200).json({ message: "Đã xóa" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};