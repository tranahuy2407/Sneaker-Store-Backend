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
      order_code: order.order_code,
      paymentUrl: order.getDataValue("paymentUrl") || null
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

  /* ===== GET ALL ===== */
  async getAll(req, res) {
    try {
      const { page, limit, status, keyword } = req.query;

      const result = await OrderService.getAllOrders({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        status,
        keyword,
      });

      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  /* ===== GET DETAIL ===== */
  async getDetail(req, res) {
    try {
      const { id } = req.params;

      const order = await OrderService.getOrderDetail(id);

      res.json({
        success: true,
        data: order,
      });
    } catch (err) {
      res.status(404).json({
        success: false,
        message: err.message,
      });
    }
  },

  /* ===== UPDATE STATUS ===== */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          message: "Status là bắt buộc",
        });
      }

      const order = await OrderService.updateStatus({
        orderId: id,
        status,
      });

      res.json({
        success: true,
        data: order,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

async getMyOrders(req, res) {
  try {
    const { page, limit, status } = req.query;

    const result = await OrderService.getMyOrders({
      user: req.user,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      status,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
},


async getMyOrderDetail(req, res) {
  try {
    const { id } = req.params;

    const order = await OrderService.getMyOrderDetail({
      orderId: id,
      user: req.user,
    });

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
},

async getHistory(req, res) {
  try {
    const { page, limit } = req.query;
    const result = await OrderService.getOrderHistory({
      page: Number(page) || 1,
      limit: Number(limit) || 20
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
},

async resetOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await OrderService.resetOrder({ orderId: id, user: req.user });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

};
