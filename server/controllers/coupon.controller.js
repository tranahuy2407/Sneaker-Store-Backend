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

  // Áp dụng giảm giá từ mã coupon
  async applyDiscount(req, res) {
    try {
      const { code, orderTotal, productIds = [] } = req.body;

      if (!code) {
        return res.status(400).json({ message: "Mã coupon là bắt buộc" });
      }

      if (!orderTotal || isNaN(orderTotal) || Number(orderTotal) <= 0) {
        return res
          .status(400)
          .json({ message: "Tổng giá trị đơn hàng không hợp lệ" });
      }

      const result = await CouponService.applyDiscount(
        code,
        Number(orderTotal),
        productIds
      );

      res.json({
        success: true,
        message: "Áp dụng mã giảm giá thành công",
        data: result,
      });
    } catch (err) {
      const errorMessages = {
        COUPON_NOT_FOUND: "Mã coupon không tồn tại",
        COUPON_INACTIVE: "Mã coupon đã bị vô hiệu hoá",
        COUPON_NOT_STARTED: "Mã coupon chưa có hiệu lực",
        COUPON_EXPIRED: "Mã coupon đã hết hạn",
        COUPON_USAGE_LIMIT_REACHED: "Mã coupon đã đạt giới hạn sử dụng",
        COUPON_PRODUCT_REQUIRED:
          "Coupon này chỉ áp dụng cho sản phẩm cụ thể, vui lòng cung cấp danh sách sản phẩm",
        COUPON_NOT_APPLICABLE_TO_PRODUCTS:
          "Mã coupon không áp dụng cho sản phẩm trong giỏ hàng",
        COUPON_NOT_MATCH_PROMOTION:
          "Sản phẩm của bạn thuộc chương trình khuyến mãi riêng, vui lòng dùng mã coupon của chương trình đó",
      };

      // Xử lý lỗi min_order_value có kèm giá trị
      if (err.message && err.message.startsWith("ORDER_TOTAL_TOO_LOW:")) {
        const minValue = err.message.split(":")[1];
        return res.status(400).json({
          message: `Giá trị đơn hàng tối thiểu phải đạt ${Number(
            minValue
          ).toLocaleString("vi-VN")}đ để dùng mã này`,
        });
      }

      const message = errorMessages[err.message] || err.message;
      const status =
        err.message === "COUPON_NOT_FOUND" ? 404 : 400;

      res.status(status).json({ message });
    }
  }
}

export default new CouponController();
