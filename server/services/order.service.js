import { Sequelize } from "sequelize";
import { sequelize, Order, OrderDetail, Cart, CartItem, PaymentMethod, Product, ProductImage, ProductSize, Notification, UserAddress, Coupon, ShippingCost, User } from "../models/index.js";
import { publishOrderCancelled } from "../queues/order.cancel.producer.js";
import { publishOrderCreated } from "../queues/order.producer.js";
import cartService from "./cart.service.js";
import { ZaloPayService } from "./zalopay.service.js";
import { generateOrderCode } from "../utils/orderCode.js";
import { emitOrderStatus } from "../helpers/socket.js";

export const OrderService = {
async createOrder({ user, items, payment_method_id, shippingInfo, total }) {
  let order;     
  let details;
  let finalTotal = total;
  let isOnlinePayment = false;

  await sequelize.transaction(async (t) => {
    const productIds = items.map(i => i.product_id || i.productId);
    const productSizes = await ProductSize.findAll({
      where: { id: items.map(i => i.product_size_id || i.productSizeId).filter(Boolean) },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    for (const item of items) {
      const sizeId = item.product_size_id || item.productSizeId;
      const dbSize = productSizes.find(s => s.id == sizeId);
      if (!dbSize || dbSize.stock < item.quantity) {
        throw new Error(`Sản phẩm với size ID ${sizeId} không đủ tồn kho.`);
      }
    }

    let calculatedShippingCost = 0;
    let shippingCostId = shippingInfo.shipping_cost_id;

    if (shippingCostId) {
      const sc = await ShippingCost.findByPk(shippingCostId, { transaction: t });
      if (sc) calculatedShippingCost = sc.cost;
    } else if (shippingInfo.city) {
      const sc = await ShippingCost.findOne({
        where: { name: { [Sequelize.Op.iLike]: `%${shippingInfo.city.trim()}%` } },
        transaction: t
      });
      if (sc) {
        calculatedShippingCost = sc.cost;
        shippingCostId = sc.id;
      }
    }

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
            total_amount: finalTotal,
            shipping_cost: calculatedShippingCost,
            shipping_cost_id: shippingCostId,
            status: "Pending",
            payment_status: "Unpaid"
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

    const products = await Product.findAll({
      where: { id: productIds },
      attributes: ['id', 'name', 'price', 'discountPrice'],
      transaction: t
    });

    details = items.map((i) => {
      const product_id = i.product_id || i.productId;
      const sizeId = i.product_size_id || i.productSizeId;
      const product = products.find(p => p.id == product_id);
      const itemPrice = product ? (product.discountPrice || product.price) : (i.price ?? 0);

      return {
        order_id: order.id,
        product_id: product_id,
        product_size_id: sizeId,
        quantity: i.quantity,
        price: itemPrice,
        name: product ? product.name : "Sản phẩm",
      };
    });

    await OrderDetail.bulkCreate(details.map(({name, ...d}) => d), { transaction: t });

    for (const item of items) {
      const sizeId = item.product_size_id || item.productSizeId;
      const dbSize = productSizes.find(s => s.id == sizeId);
      await dbSize.update({ stock: dbSize.stock - item.quantity }, { transaction: t });
    }

    if (shippingInfo.couponCode) {
      const coupon = await Coupon.findOne({ where: { code: shippingInfo.couponCode, is_active: true }, transaction: t });
      if (coupon) {
        await coupon.update({ used_count: coupon.used_count + 1 }, { transaction: t });
      }
    }

    const paymentMethod = await PaymentMethod.findByPk(payment_method_id, { transaction: t });
    if (paymentMethod && paymentMethod.name.toLowerCase().includes("zalopay")) {
      isOnlinePayment = true;
      const zaloResult = await ZaloPayService.createPayment({
        orderId: order.id,
        amount: total,
        customerName: shippingInfo.name,
        items: details
      });

      if (zaloResult.return_code === 1) {
        await order.update({ transaction_id: zaloResult.app_trans_id }, { transaction: t });
        order.setDataValue("paymentUrl", zaloResult.order_url);
      } else {
        throw new Error(zaloResult.return_message || "Không thể tạo giao dịch ZaloPay. Vui lòng thử lại.");
      }
    }

    // Chỉ xoá giỏ hàng ngay lập tức nếu là thanh toán OFFLINE (Ví dụ: COD)
    // Thanh toán online sẽ xoá khi có callback/status thành công
    if (user?.id && !isOnlinePayment) {
      await cartService.clearCart(user.id, t);
    }

    if (user?.id) {
      const addressCount = await UserAddress.count({ 
        where: { user_id: user.id },
        transaction: t 
      });
      if (addressCount === 0) {
        await UserAddress.create({
          user_id: user.id,
          receiver_name: shippingInfo.name,
          receiver_phone: shippingInfo.phone,
          address_line: shippingInfo.address_line,
          ward: shippingInfo.ward,
          district: shippingInfo.district,
          city: shippingInfo.city,
          note: shippingInfo.note,
          is_default: true,
        }, { transaction: t });
      }
    }
  }); 

  if (!isOnlinePayment) {
    await publishOrderCreated({
      orderId: order.id,
      orderCode: order.order_code,
      userId: user?.id || null,
      email: order.email,
      receiverName: order.receiver_name,
      items: details,
      totalAmount: finalTotal,
    });
  }

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

      const details = await OrderDetail.findAll({ where: { order_id: orderId }, transaction: t });
      for (const item of details) {
        const sizeId = item.product_size_id;
        const dbSize = await ProductSize.findByPk(sizeId, { transaction: t, lock: t.LOCK.UPDATE });
        if (dbSize) {
          await dbSize.update({ stock: dbSize.stock + item.quantity }, { transaction: t });
        }
      }

      if (order.payment_status === "Paid" && order.zp_trans_id) {
        try {
          const refundResult = await ZaloPayService.refund({
            zp_trans_id: order.zp_trans_id,
            amount: order.total_amount,
            description: `Hoàn tiền đơn hàng #${order.order_code} do bị huỷ`
          });
          
          if (refundResult.return_code === 1) {
            await order.update({ 
              payment_status: "Refunded",
              m_refund_id: refundResult.m_refund_id 
            }, { transaction: t });
            console.log(`[ZaloPay] Refunded success for order: ${order.id}, Refund ID: ${refundResult.m_refund_id}`);
          } else {
            console.error(`[ZaloPay] Refund failed for order ${order.id}:`, refundResult.return_message);
          }
        } catch (refundErr) {
          console.error(`[ZaloPay] Refund Error for order ${order.id}:`, refundErr.message);
        }
      }

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
      where[Sequelize.Op.or] = [
        { order_code: { [Sequelize.Op.like]: `%${keyword}%` } },
        { receiver_name: { [Sequelize.Op.like]: `%${keyword}%` } },
        { receiver_phone: { [Sequelize.Op.like]: `%${keyword}%` } },
        { email: { [Sequelize.Op.like]: `%${keyword}%` } },
      ];
    }

    const { rows, count } = await Order.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
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

  // Update User Total Spent if status is Completed
  if (status === "Completed" && order.user_id) {
    const user = await User.findByPk(order.user_id);
    if (user) {
      await user.update({
        total_spent: Sequelize.literal(`total_spent + ${order.total_amount}`)
      });
    }
  }

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

/* ================= RESET ORDER ================= */
async resetOrder({ orderId, user }) {
  return sequelize.transaction(async (t) => {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) throw new Error("Đơn hàng không tồn tại");
    if (order.status !== "Cancelled") throw new Error("Chỉ có thể khôi phục đơn hàng đã huỷ");

    const details = await OrderDetail.findAll({ where: { order_id: orderId }, transaction: t });
    for (const item of details) {
      const dbSize = await ProductSize.findByPk(item.product_size_id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!dbSize || dbSize.stock < item.quantity) {
        throw new Error(`Sản phẩm với size ID ${item.product_size_id} không đủ tồn kho để khôi phục.`);
      }
      await dbSize.update({ stock: dbSize.stock - item.quantity }, { transaction: t });
    }

    await order.update({ 
      status: "Pending",
      note: "Đơn hàng đã được khôi phục"
    }, { transaction: t });

    return order;
  });
},

async getOrderHistory({ page = 1, limit = 20 }) {
  return this.getAllOrders({ page, limit, status: "Completed" });
},

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
    distinct: true,
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
  