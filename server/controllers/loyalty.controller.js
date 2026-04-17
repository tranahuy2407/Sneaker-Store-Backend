import { User, Notification, Product, Order } from "../models/index.js";
import { sequelize } from "../models/index.js";

const refreshTotalSpent = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return 0;

  const result = await Order.findAll({
    where: {
      user_id: userId,
      status: 'Completed'
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('total_amount')), 'total']
    ],
    raw: true
  });

  const actualSpent = parseFloat(result[0]?.total || 0);

  user.total_spent = actualSpent;
  await user.save();
  
  return actualSpent;
};

export const getLoyaltyStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const total_spent = await refreshTotalSpent(userId);

    const milestones = [
      { threshold: 500000, reward: "Coupon 5%", type: "coupon" },
      { threshold: 1500000, reward: "Coupon 10%", type: "coupon" },
      { threshold: 2000000, reward: "Coupon 15%", type: "coupon" },
      { threshold: 5000000, reward: "Coupon 20%", type: "coupon" },
      { threshold: 10000000, reward: "Free Shoe", type: "gift" },
    ];

    res.json({
      status: "success",
      data: {
        total_spent,
        milestones
      }
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const claimLoyaltyGift = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.user.id;
    
    // Cập nhật lại chi tiêu trước khi kiểm tra để đảm bảo chính xác
    const totalSpent = await refreshTotalSpent(userId);

    if (totalSpent < 10000000) {
      return res.status(400).json({ 
        message: `Bạn đã chi tiêu ${totalSpent.toLocaleString()}₫. Bạn cần đạt mốc 10.000.000₫ để nhận quà.` 
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const user = await User.findByPk(userId);

    // Gửi thông báo cho Admin
    await Notification.create({
      title: "Yêu cầu nhận quà tặng VIP",
      message: `Khách hàng ${user.username} (ID: ${user.id}) đã yêu cầu nhận quà: ${product.name} - Size: ${size}`,
      type: "reward_claim",
      entity_type: "user",
      entity_id: user.id,
      receiver_type: "admin",
      receiver_id: 1, // Mặc định gửi cho admin đầu tiên
    });

    res.json({
      status: "success",
      message: "Yêu cầu nhận quà đã được gửi! Admin sẽ liên hệ với bạn sớm nhất."
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
