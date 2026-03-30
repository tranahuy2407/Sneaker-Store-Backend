/**
 * =============================================
 *  SNEAKER STORE - MASTER SEED FILE
 * =============================================
 *  Chạy lệnh: npm run seed
 *
 *  Thứ tự seed:
 *  1.  Admins
 *  2.  Brands
 *  3.  Categories
 *  4.  PaymentMethods
 *  5.  ShippingCosts
 *  6.  Users
 *  7.  Products (+ ProductImages + ProductSizes + ProductCategories)
 *  8.  Promotions + Coupons
 *  9.  UserAddresses
 *  10. Orders (+ OrderDetails + Invoices)
 *  11. Reviews
 *  12. Carts (+ CartItems)
 *  13. WarehouseHistory
 *  14. Favorites + RecentlyViewed
 *  15. HomeSections (+ HomeSectionProducts)
 *  16. News
 *  17. Contacts
 *  18. StoreInfo
 *  19. Notifications
 * =============================================
 */

import "../models/index.js"; // Khởi tạo tất cả associations
import { sequelize } from "../config/connect.js";

import { seedAdmins }             from "./seeds/adminSeed.js";
import { seedBrands }             from "./seeds/brandSeed.js";
import { seedCategories }         from "./seeds/categorySeed.js";
import { seedPaymentMethods }     from "./seeds/paymentMethodSeed.js";
import { seedShippingCosts }      from "./seeds/shippingCostSeed.js";
import { seedUsers }              from "./seeds/userSeed.js";
import { seedProducts }           from "./seeds/productSeed.js";
import { seedPromotions,
         seedCoupons }            from "./seeds/promotionCouponSeed.js";
import { seedUserAddresses }      from "./seeds/userAddressSeed.js";
import { seedOrders }             from "./seeds/orderSeed.js";
import { seedReviews }            from "./seeds/reviewSeed.js";
import { seedCarts }              from "./seeds/cartSeed.js";
import { seedWarehouseHistory }   from "./seeds/warehouseHistorySeed.js";
import { seedFavorites,
         seedRecentlyViewed }     from "./seeds/favoriteRecentlySeed.js";
import { seedHomeSections }       from "./seeds/homeSectionSeed.js";
import { seedNews }               from "./seeds/newsSeed.js";
import { seedContacts }           from "./seeds/contactSeed.js";
import { seedStoreInfo }          from "./seeds/storeInfoSeed.js";
import { seedNotifications }      from "./seeds/notificationSeed.js";

// ─── helpers ─────────────────────────────────────────────────────────────────
const step = (msg) => console.log(`\n${"─".repeat(50)}\n⏳  ${msg}`);
const done = (msg) => console.log(`✅  ${msg}`);

// ─── clear all tables (reverse-dependency order) ─────────────────────────────
async function clearAll() {
  step("Xoá toàn bộ dữ liệu cũ...");
  await sequelize.query("SET session_replication_role = 'replica'"); // tắt FK check (PostgreSQL)

  const tablesToClear = [
    "notifications",
    "store_info",
    "contacts",
    "news",
    "home_section_product",   // HomeSectionProduct
    "home_sections",
    "recently_viewed",        // RecentlyViewed
    "favorites",
    "warehouse_histories",
    "cart_items",             // CartItem
    "carts",
    "reviews",
    "invoices",
    "order_details",
    "orders",
    "user_addresses",
    "coupon_product",         // CouponProduct
    "coupons",
    "promotion_product",      // PromotionProduct
    "promotion_user",         // Sequelize auto join table (N-N Promotion-User)
    "promotions",
    "product_category",       // ProductCategory
    "product_sizes",
    "product_images",
    "products",
    "users",
    "shippingcosts",          // ShippingCost
    "payment_methods",
    "categories",
    "brands",
    "admins",
  ];

  // Dùng TRUNCATE CASCADE cho PostgreSQL hoặc xoá tuần tự
  for (const table of tablesToClear) {
    try {
      await sequelize.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
    } catch {
      // bỏ qua nếu bảng chưa tồn tại
    }
  }

  await sequelize.query("SET session_replication_role = 'origin'"); // bật lại FK
  done("Đã xoá dữ liệu cũ");
}

// ─── main ────────────────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    console.log("\n🚀  SNEAKER STORE — BẮT ĐẦU SEEDING DỮ LIỆU");
    console.log("=".repeat(50));

    // Kết nối DB
    await sequelize.authenticate();
    console.log("🔌  Kết nối database thành công");

    // Đồng bộ schema (tạo bảng nếu chưa có)
    await sequelize.sync({ alter: false });
    console.log("🔄  Database schema synchronized");

    // Xoá dữ liệu cũ
    await clearAll();

    // ── 1. Admins ─────────────────────────────────────────────────────────
    step("Seeding Admins...");
    const admins = await seedAdmins();

    // ── 2. Brands ─────────────────────────────────────────────────────────
    step("Seeding Brands...");
    const brands = await seedBrands();

    // ── 3. Categories ─────────────────────────────────────────────────────
    step("Seeding Categories...");
    const categories = await seedCategories();

    // ── 4. Payment Methods ────────────────────────────────────────────────
    step("Seeding Payment Methods...");
    const paymentMethods = await seedPaymentMethods();

    // ── 5. Shipping Costs ─────────────────────────────────────────────────
    step("Seeding Shipping Costs...");
    const shippingCosts = await seedShippingCosts();

    // ── 6. Users ──────────────────────────────────────────────────────────
    step("Seeding Users...");
    const users = await seedUsers();

    // ── 7. Products (images + sizes + categories) ─────────────────────────
    step("Seeding Products (+ images, sizes, categories)...");
    const products = await seedProducts(brands, categories);

    // ── 8. Promotions + Coupons ───────────────────────────────────────────
    step("Seeding Promotions & Coupons...");
    const promotions = await seedPromotions(products);
    const coupons    = await seedCoupons(promotions, products);

    // ── 9. User Addresses ─────────────────────────────────────────────────
    step("Seeding User Addresses...");
    await seedUserAddresses(users);

    // ── 10. Orders (details + invoices) ───────────────────────────────────
    step("Seeding Orders (+ order details + invoices)...");
    const orders = await seedOrders(users, products, paymentMethods, shippingCosts);

    // ── 11. Reviews ───────────────────────────────────────────────────────
    step("Seeding Reviews...");
    await seedReviews(users, products);

    // ── 12. Carts + CartItems ─────────────────────────────────────────────
    step("Seeding Carts & Cart Items...");
    await seedCarts(users, products);

    // ── 13. Warehouse History ─────────────────────────────────────────────
    step("Seeding Warehouse History...");
    await seedWarehouseHistory(admins, products);

    // ── 14. Favorites + Recently Viewed ───────────────────────────────────
    step("Seeding Favorites & Recently Viewed...");
    await seedFavorites(users, products);
    await seedRecentlyViewed(users, products);

    // ── 15. Home Sections ─────────────────────────────────────────────────
    step("Seeding Home Sections...");
    await seedHomeSections(products);

    // ── 16. News ──────────────────────────────────────────────────────────
    step("Seeding News Articles...");
    await seedNews();

    // ── 17. Contacts ──────────────────────────────────────────────────────
    step("Seeding Contacts...");
    await seedContacts();

    // ── 18. Store Info ────────────────────────────────────────────────────
    step("Seeding Store Info...");
    await seedStoreInfo();

    // ── 19. Notifications ─────────────────────────────────────────────────
    step("Seeding Notifications...");
    await seedNotifications(admins, users, orders);

    // ── Summary ───────────────────────────────────────────────────────────
    console.log("\n" + "=".repeat(50));
    console.log("🎉  SEEDING HOÀN TẤT THÀNH CÔNG!");
    console.log("=".repeat(50));
    console.log(`
📊  TÓM TẮT DỮ LIỆU ĐÃ TẠO:
  👤  Admins          : ${admins.length}
  🏷️   Brands          : ${brands.length}
  📂  Categories      : ${categories.length}
  💳  Payment Methods : ${paymentMethods.length}
  🚚  Shipping Costs  : ${shippingCosts.length}
  👥  Users           : ${users.length}
  👟  Products        : ${products.length}
  🎯  Promotions      : ${promotions.length}
  🎟️   Coupons         : ${coupons.length}
  📦  Orders          : ${orders.length}
  🏠  Home Sections   : 5
  📰  News Articles   : 10
  📬  Contacts        : 12

🔐  THÔNG TIN ĐĂNG NHẬP:
  Admin:      admin / admin123
  SuperAdmin: superadmin / admin123
  User:       nguyenvanan@gmail.com / user123
`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌  LỖI KHI SEEDING:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();
