import { Order, OrderDetail, Product, User, Category, Brand, sequelize } from "../models/index.js";
import { Op, fn, col, literal } from "sequelize";

export const DashboardService = {
  // 1. Tổng quan
  async getOverview() {
    const [
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts
    ] = await Promise.all([
      Order.sum("total_amount", { where: { status: "Completed" } }),
      Order.count(),
      User.count({ where: { status: "Active" } }),
      Product.count({ where: { status: "Active" } })
    ]);

    return {
      total_revenue: totalRevenue || 0,
      total_orders: totalOrders || 0,
      total_users: totalUsers || 0,
      total_products: totalProducts || 0
    };
  },

  // 2. Doanh thu theo thời gian (Biểu đồ đường)
  async getRevenueChart(type = "daily") {
    if (type === "daily") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return Order.findAll({
        attributes: [
          [fn("TO_CHAR", col("created_at"), "YYYY-MM-DD"), "date"],
          [fn("SUM", col("total_amount")), "revenue"]
        ],
        where: {
          status: "Completed",
          created_at: { [Op.gte]: thirtyDaysAgo }
        },
        group: [fn("TO_CHAR", col("created_at"), "YYYY-MM-DD")],
        order: [[fn("TO_CHAR", col("created_at"), "YYYY-MM-DD"), "ASC"]]
      });
    } else {
      return Order.findAll({
        attributes: [
          [fn("TO_CHAR", col("created_at"), "YYYY-MM"), "month"],
          [fn("SUM", col("total_amount")), "revenue"]
        ],
        where: { status: "Completed" },
        group: [fn("TO_CHAR", col("created_at"), "YYYY-MM")],
        order: [[fn("TO_CHAR", col("created_at"), "YYYY-MM"), "ASC"]],
        limit: 12
      });
    }
  },

  // 3. Thống kê theo danh mục (Biểu đồ tròn)

  async getCategoryStats() {
    return Category.findAll({
      attributes: [
        "id", "name",
        [fn("SUM", col("products->orderDetails.quantity")), "count"]
      ],
      include: [
        {
          model: Product,
          as: "products",
          attributes: [],
          include: [
            {
              model: OrderDetail,
              as: "orderDetails",
              attributes: []
            }
          ],
          through: { attributes: [] }
        }
      ],
      group: ["Category.id", "Category.name"],
      order: [[literal("count"), "DESC"]],
      subQuery: false
    });
  },

  // 4. Top sản phẩm bán chạy
  async getTopProducts(limit = 5) {
    return OrderDetail.findAll({
      attributes: [
        "product_id",
        [fn("SUM", col("quantity")), "total_sold"]
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name", "price"]
        }
      ],
      group: ["product_id", "product.id"],
      order: [[fn("SUM", col("quantity")), "DESC"]],
      limit: Number(limit)
    });
  },

  async getBrandStats() {
    return Brand.findAll({
      attributes: [
        "id", "name",
        [fn("SUM", col("products->orderDetails.quantity")), "count"]
      ],
      include: [
        {
          model: Product,
          as: "products",
          attributes: [],
          include: [
            {
              model: OrderDetail,
              as: "orderDetails",
              attributes: []
            }
          ]
        }
      ],
      group: ["Brand.id", "Brand.name"],
      order: [[literal("count"), "DESC"]],
      subQuery: false
    });
  },

  // 5. Đơn hàng gần đây
  async getRecentOrders(limit = 10) {
    return Order.findAll({
      attributes: ["id", "order_code", "total_amount", "status", "created_at", "receiver_name"],
      order: [["created_at", "DESC"]],
      limit: Number(limit)
    });
  }
};
