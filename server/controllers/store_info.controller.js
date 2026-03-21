import { StoreInfoService } from "../services/store_info.service.js";

export const StoreInfoController = {
  async get(req, res) {
    try {
      const info = await StoreInfoService.get();
      res.status(200).json({ data: info });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = { ...req.body };
      
      // Xử lý upload logo nêú có (dùng chung upload middleware nếu cần)
      if (req.file) {
          data.logo_url = req.file.path;
      }

      const info = await StoreInfoService.update(data);
      res.status(200).json({ message: "Cập nhật thành công", data: info });
    } catch (err) {
      console.error("UPDATE STORE INFO ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  },
};
