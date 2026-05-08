import { sequelize } from "../config/connect.js";

import { seedAdmins }           from "../scripts/seeds/adminSeed.js";
import { seedBrands }           from "../scripts/seeds/brandSeed.js";
import { seedCategories }       from "../scripts/seeds/categorySeed.js";
import { seedPaymentMethods }   from "../scripts/seeds/paymentMethodSeed.js";
import { seedShippingCosts }    from "../scripts/seeds/shippingCostSeed.js";
import { seedUsers }            from "../scripts/seeds/userSeed.js";
import { seedProducts }         from "../scripts/seeds/productSeed.js";
import { seedPromotions,
         seedCoupons }          from "../scripts/seeds/promotionCouponSeed.js";
import { seedUserAddresses }    from "../scripts/seeds/userAddressSeed.js";
import { seedOrders }           from "../scripts/seeds/orderSeed.js";
import { seedReviews }          from "../scripts/seeds/reviewSeed.js";
import { seedCarts }            from "../scripts/seeds/cartSeed.js";
import { seedWarehouseHistory } from "../scripts/seeds/warehouseHistorySeed.js";
import { seedFavorites,
         seedRecentlyViewed }   from "../scripts/seeds/favoriteRecentlySeed.js";
import { seedHomeSections }     from "../scripts/seeds/homeSectionSeed.js";
import { seedNews }             from "../scripts/seeds/newsSeed.js";
import { seedContacts }         from "../scripts/seeds/contactSeed.js";
import { seedStoreInfo }        from "../scripts/seeds/storeInfoSeed.js";
import { seedNotifications }    from "../scripts/seeds/notificationSeed.js";

// Danh sách bảng cần xoá (theo thứ tự phụ thuộc ngược)
const TABLES = [
  "notifications", "store_info", "contacts", "news",
  "home_section_product", "home_sections",
  "recently_viewed", "favorites",
  "warehouse_histories", "cart_items", "carts",
  "reviews", "invoices", "order_details", "orders",
  "user_addresses", "coupon_product", "coupons",
  "promotion_product", "promotion_user", "promotions",
  "product_category", "product_sizes", "product_images", "products",
  "users", "shippingcosts", "payment_methods",
  "categories", "brands", "admins",
];

async function clearDatabase() {
  // Dùng DELETE FROM theo đúng thứ tự phụ thuộc (không cần superuser)
  for (const table of TABLES) {
    try {
      await sequelize.query(`DELETE FROM "${table}"`);
    } catch (_) { /* bảng chưa tồn tại → bỏ qua */ }
  }

  // Reset auto-increment sequences (bỏ qua nếu không có quyền)
  for (const table of TABLES) {
    try {
      await sequelize.query(
        `ALTER SEQUENCE IF EXISTS "${table}_id_seq" RESTART WITH 1`
      );
    } catch (_) { /* bỏ qua */ }
  }
}

export const runSeed = async (req, res) => {
  const { secret } = req.query;
  const SEED_SECRET = process.env.SEED_SECRET || "sneaker_seed_2025";

  if (secret !== SEED_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: secret key không hợp lệ",
    });
  }

  // Nếu đang chạy seed rồi thì bỏ qua
  if (global._seeding) {
    return res.status(429).json({
      success: false,
      message: "Seed đang chạy, vui lòng đợi...",
    });
  }

  // Trả về response ngay lập tức, seed chạy ở background
  res.json({
    success: true,
    message: "✅ Seed đang chạy ở background. Kiểm tra logs trên Render để theo dõi tiến trình.",
  });

  // ── Chạy seed ở background ─────────────────────────────────────────────────
  runSeedBackground();
};

export const runSeedBackground = async () => {
  if (global._seeding) return;
  global._seeding = true;
  try {
    console.log("\n🚀 [SEED] Bắt đầu seeding dữ liệu...");

      await clearDatabase();
      console.log("🗑️  [SEED] Đã xoá dữ liệu cũ");

      const admins         = await seedAdmins();
      const brands         = await seedBrands();
      const categories     = await seedCategories();
      const paymentMethods = await seedPaymentMethods();
      const shippingCosts  = await seedShippingCosts();
      const users          = await seedUsers();
      const products       = await seedProducts(brands, categories);
      const promotions     = await seedPromotions(products);
      const coupons        = await seedCoupons(promotions, products);
      await seedUserAddresses(users);
      const orders         = await seedOrders(users, products, paymentMethods, shippingCosts);
      await seedReviews(users, products);
      await seedCarts(users, products);
      await seedWarehouseHistory(admins, products);
      await seedFavorites(users, products);
      await seedRecentlyViewed(users, products);
      await seedHomeSections(products);
      await seedNews();
      await seedContacts();
      await seedStoreInfo();
      await seedNotifications(admins, users, orders);

      console.log(`
🎉 [SEED] HOÀN TẤT!
   Admins: ${admins.length} | Brands: ${brands.length} | Categories: ${categories.length}
   Products: ${products.length} | Users: ${users.length} | Orders: ${orders.length}
   Coupons: ${coupons.length} | Promotions: ${promotions.length}
`);
    } catch (err) {
      console.error("❌ [SEED] Lỗi:", err.message, err.stack);
    } finally {
      global._seeding = false;
    }
};

export const getSeedStatus = (_req, res) => {
  res.json({
    success: true,
    seeding: global._seeding === true,
    message: global._seeding ? "Đang seed..." : "Không có seed đang chạy",
  });
};
