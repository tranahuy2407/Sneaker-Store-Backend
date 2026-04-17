import { sequelize, User, Order } from "../models/index.js";

async function syncLoyalty() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    const users = await User.findAll();
    console.log(`Syncing ${users.length} users...`);

    for (const user of users) {
      const completedOrders = await Order.findAll({
        where: {
          user_id: user.id,
          status: "Completed"
        }
      });

      const totalSpent = completedOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
      
      await user.update({ total_spent: totalSpent });
      console.log(`User ${user.username}: ${totalSpent.toLocaleString()} VND`);
    }

    console.log("Loyalty sync completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Sync failed:", error);
    process.exit(1);
  }
}

syncLoyalty();
