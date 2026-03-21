import { DashboardService } from "../services/dashboard.service.js";

export const DashboardController = {
  async getStatistics(req, res) {
    try {
      const [overview, recentOrders, categoryStats, brandStats] = await Promise.all([
        DashboardService.getOverview(),
        DashboardService.getRecentOrders(5),
        DashboardService.getCategoryStats(),
        DashboardService.getBrandStats()
      ]);

      res.status(200).json({
        status: "success",
        data: {
          overview,
          recent_orders: recentOrders,
          category_stats: categoryStats,
          brand_stats: brandStats
        }
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getRevenueChart(req, res) {
    try {
      const { type } = req.query; // daily or monthly
      const chartData = await DashboardService.getRevenueChart(type);
      res.status(200).json({
        status: "success",
        data: chartData
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getTopProducts(req, res) {
    try {
      const { limit } = req.query;
      const products = await DashboardService.getTopProducts(limit);
      res.status(200).json({
        status: "success",
        data: products
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
