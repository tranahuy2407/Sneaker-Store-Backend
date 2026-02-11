import { sequelize, Order, OrderDetail, Cart, CartItem, PaymentMethod, Product, ProductImage, ProductSize, Notification } from "../models/index.js";
import { publishOrderCancelled } from "../queues/order.cancel.producer.js";
import { publishOrderCreated } from "../queues/order.producer.js";
import cartService from "./cart.service.js";
import { generateOrderCode } from "../utils/orderCode.js";
import { emitOrderStatus } from "../helpers/socket.js";

export const OrderService = {
async createOrder({ user, items, payment_method_id, shippingInfo, total }) {
  let order;     
  let details;

  await sequelize.transaction(async (t) => {
    let retries = 0;

    while (!order && retries < 5) {
      try {
        order = await Order.create(
          {
            order_code: generateOrderCode(),
            user_id: user?.id || null,
            email: shippingInfo.email,
            payment_method_id,
            receiver_name: shippingInfo.name,
            receiver_phone: shippingInfo.phone,
            address_line: shippingInfo.address_line,
            ward: shippingInfo.ward,
            district: shippingInfo.district,
            city: shippingInfo.city,
            note: shippingInfo.note,
            total_amount: total,
            status: "Pending",
          },
          { transaction: t }
        );
      } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
          retries++;
        } else {
          throw err;
        }
      }
    }

    if (!order) {
      throw new Error("Không thể tạo mã đơn hàng, vui lòng thử lại");
    }

    details = items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      product_size_id: i.product_size_id,
      quantity: i.quantity,
      price: i.price ?? 0,
    }));

    await OrderDetail.bulkCreate(details, { transaction: t });

    if (user?.id) {
      await cartService.clearCart(user.id, t);
    }
  }); 

  await publishOrderCreated({
    orderId: order.id,
    orderCode: order.order_code,
    userId: user?.id || null,
    items: details,
    totalAmount: total,
  });


  return order;
},


  async cancelOrder({ orderId, reason, user }) {
    return sequelize.transaction(async (t) => {
      const order = await Order.findByPk(orderId, { transaction: t });

      if (!order) throw new Error("Đơn hàng không tồn tại");
      if (order.status === "Completed")
        throw new Error("Không thể huỷ đơn đã hoàn thành");
      if (order.status === "Cancelled")
        throw new Error("Đơn hàng đã bị huỷ");

      await order.update(
        {
          status: "Cancelled",
          note: reason,
        },
        { transaction: t }
      );

      await publishOrderCancelled({
        orderId,
        reason,
        cancelledBy: user?.id || null,
      });

      return true;
    });
  },
    /* ================= GET ALL ORDERS ================= */
  async getAllOrders({ page = 1, limit = 20, status, keyword }) {
    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (keyword) {
      where[Op.or] = [
        { order_code: { [Op.like]: `%${keyword}%` } },
        { receiver_name: { [Op.like]: `%${keyword}%` } },
        { receiver_phone: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const { rows, count } = await Order.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
      },
    };
  },

  /* ================= GET ORDER DETAIL ================= */
  async getOrderDetail(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderDetail,
          as: "details",
          include: [
            {
              model: Product,
              as: "product",
              include: [
                {
                  model: ProductImage,
                  as: "images",
                }
              ]
            },
            {
              model: ProductSize,
              as: "productSize",
            }

          ],
        },
        {
          model: PaymentMethod,
          as: "paymentMethod",
        }
      ],
    });

    if (!order) throw new Error("Đơn hàng không tồn tại");

    return order;
  },

/* ================= UPDATE STATUS ================= */
async updateStatus({ orderId, status }) {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error("Đơn hàng không tồn tại");

  const current = order.status;

  if (current === "Completed" || current === "Cancelled") {
    throw new Error("Không thể thay đổi trạng thái đơn này");
  }

  const validFlow = {
    Pending: ["Processing", "Cancelled"],
    Processing: ["Completed", "Cancelled"],
  };

  if (!validFlow[current]?.includes(status)) {
    throw new Error(`Không thể chuyển từ ${current} sang ${status}`);
  }

  await order.update({ status });

  if (order.user_id) {
    await Notification.create({
      title: "Cập nhật trạng thái đơn hàng",
      message: `Đơn hàng #${order.order_code} đã chuyển sang trạng thái ${status}`,
      type: "order_status_updated",
      entity_type: "order",
      entity_id: order.id,
      receiver_type: "user",
      receiver_id: order.user_id,
    });
  }

  emitOrderStatus(order.id, status);
  return order;
},

/* ================= GET MY ORDERS ================= */
async getMyOrders({ user, page = 1, limit = 10, status }) {
  if (!user?.id) throw new Error("Chưa đăng nhập");

  const offset = (page - 1) * limit;

  const where = {
    user_id: user.id,
  };

  if (status) {
    where.status = status;
  }

  const { rows, count } = await Order.findAndCountAll({
    where,
    order: [["created_at", "DESC"]],
    limit,
    offset,
    include: [
      {
        model: PaymentMethod,
        as: "paymentMethod",
      },
    ],
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      limit,
    },
  };
},
/* ================= GET MY ORDER DETAIL ================= */
async getMyOrderDetail({ orderId, user }) {
  if (!user?.id) throw new Error("Chưa đăng nhập");

  const order = await Order.findOne({
    where: {
      id: orderId,
      user_id: user.id,
    },
    include: [
      {
        model: OrderDetail,
        as: "details",
        include: [
          {
            model: Product,
            as: "product",
            include: [
              {
                model: ProductImage,
                as: "images",
              },
            ],
          },
          {
            model: ProductSize,
            as: "productSize",
          },
        ],
      },
      {
        model: PaymentMethod,
        as: "paymentMethod",
      },
    ],
  });

  if (!order) throw new Error("Không tìm thấy đơn hàng");

  return order;
},

};
