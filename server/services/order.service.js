import { sequelize, Order, OrderDetail, Cart, CartItem } from "../models/index.js";
import { publishOrderCancelled } from "../queues/order.cancel.producer.js";
import { publishOrderCreated } from "../queues/order.producer.js";
import cartService from "./cart.service.js";

export const OrderService = {
  async createOrder({ user, items, payment_method_id, shippingInfo, total }) {
    return sequelize.transaction(async (t) => {
      const order = await Order.create(
        {
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

      const details = items.map((i) => ({
        order_id: order.id,
        product_size_id: i.product_size_id,
        quantity: i.quantity,
        price: i.price ?? 0,
      }));

      await OrderDetail.bulkCreate(details, { transaction: t });

      if (user?.id) {
      await cartService.clearCart(user.id, t);
     }

      await publishOrderCreated({
        orderId: order.id,
        items: details,
        totalAmount: total,
      });

      return order;
    });
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
};
