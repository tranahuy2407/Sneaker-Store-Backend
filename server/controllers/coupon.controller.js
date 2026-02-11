import CouponService from "../services/coupon.service.js";

class CouponController {
  // Tạo coupon
  async create(req, res) {
    try {
      const coupon = await CouponService.create(req.body);
      res.json({
        success: true,
        message: "Create coupon successfully",
        data: coupon,
      });
    } catch (err) {
      console.error("CREATE COUPON ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }

  // Lấy danh sách coupon
  async getAll(req, res) {
    try {
      const result = await CouponService.getAll(req.query);
      res.json(result);
    } catch (err) {
      console.error("GET COUPONS ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }

  // Lấy chi tiết coupon
  async getDetail(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          message: "Coupon id không hợp lệ",
        });
      }

      const coupon = await CouponService.getById(Number(id));
      res.json(coupon);
    } catch (err) {
      res.status(404).json({ message: "Coupon not found" });
    }
  }

  // Cập nhật coupon
  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          message: "Coupon id không hợp lệ",
        });
      }

      const coupon = await CouponService.update(Number(id), req.body);

      res.json({
        success: true,
        message: "Update coupon successfully",
        data: coupon,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Xóa coupon
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          message: "Coupon id không hợp lệ",
        });
      }

      await CouponService.delete(Number(id));

      res.json({
        success: true,
        message: "Delete coupon successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Bật / tắt coupon
  async toggleActive(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          message: "Coupon id không hợp lệ",
        });
      }

      const coupon = await CouponService.toggleActive(Number(id));

      res.json({
        success: true,
        message: "Update coupon status successfully",
        data: coupon,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

    // Gán sản phẩm vào coupon
  async addProducts(req, res) {
    try {
      const { id } = req.params;
      const { productIds } = req.body;

      await CouponService.addProducts(Number(id), productIds);

      res.json({
        success: true,
        message: "Products added to coupon successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new CouponController();
