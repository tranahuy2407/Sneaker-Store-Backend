import { OrderService } from "../services/order.service.js";

export const OrderController = {
async checkout(req, res) {
  try {
    const user = req.user; 
    const {
      items,
      payment_method_id,
      shippingInfo,
      total,
    } = req.body;
      const email = user?.email || shippingInfo?.email;

      if (!email) {
        return res.status(400).json({
          message: "Email là bắt buộc !",
        });
      }

    if (!payment_method_id) {
      return res.status(400).json({
        message: "Chưa chọn phương thức thanh toán",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Danh sách sản phẩm không hợp lệ",
      });
    }

    const order = await OrderService.createOrder({
      user,              
      items,           
      payment_method_id,
      shippingInfo,
      total,            
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
    });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    res.status(400).json({
      message: err.message || "Checkout thất bại",
    });
  }
},

  async cancel(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          message: "Vui lòng nhập lý do huỷ đơn",
        });
      }

      await OrderService.cancelOrder({
        orderId: id,
        reason,
        userId: req.user.id,
      });

      res.json({
        success: true,
        message: "Đã huỷ đơn hàng",
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  },
};
