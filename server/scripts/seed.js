import { sequelize } from "../config/connect.js";
import Admin from "../models/admin.model.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import Product from "../models/product.model.js";
import Promotion from "../models/promotion.model.js";
import bcrypt from "bcrypt";

const seedDatabase = async () => {
  try {
    console.log(" Bắt đầu seeding dữ liệu...");

    // Sync database
    await sequelize.sync({ alter: true });
    console.log(" Database synchronized");

    // Clear existing data
    await Promise.all([
      Admin.destroy({ where: {} }),
      Category.destroy({ where: {} }),
      Brand.destroy({ where: {} }),
      Product.destroy({ where: {} }),
      Promotion.destroy({ where: {} }),
    ]);
    console.log("  Cleared existing data");

    // 1. Create Admins
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admins = await Admin.bulkCreate([
      {
        username: "admin",
        password: adminPassword,
        role: "Admin",
      },
      {
        username: "superadmin",
        password: adminPassword,
        role: "SuperAdmin",
      },
    ]);
    console.log(`Created ${admins.length} admin users`);

    // 2. Create Categories
    const categories = await Category.bulkCreate([
      {
        name: "Giày Nike",
        slug: "giay-nike",
        image: "https://via.placeholder.com/300?text=Nike",
        status: "Active",
      },
      {
        name: "Giày Adidas",
        slug: "giay-adidas",
        image: "https://via.placeholder.com/300?text=Adidas",
        status: "Active",
      },
      {
        name: "Giày Jordan",
        slug: "giay-jordan",
        image: "https://via.placeholder.com/300?text=Jordan",
        status: "Active",
      },
      {
        name: "Giày Chạy Bộ",
        slug: "giay-chay-bo",
        image: "https://via.placeholder.com/300?text=Running",
        status: "Active",
      },
      {
        name: "Giày Bóng Rổ",
        slug: "giay-bong-ro",
        image: "https://via.placeholder.com/300?text=Basketball",
        status: "Active",
      },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // 3. Create Brands
    const brands = await Brand.bulkCreate([
      {
        name: "Nike",
        slug: "nike",
        image: "https://via.placeholder.com/300?text=Nike+Brand",
        status: "Active",
      },
      {
        name: "Adidas",
        slug: "adidas",
        image: "https://via.placeholder.com/300?text=Adidas+Brand",
        status: "Active",
      },
      {
        name: "Jordan",
        slug: "jordan-brand",
        image: "https://via.placeholder.com/300?text=Jordan+Brand",
        status: "Active",
      },
      {
        name: "Puma",
        slug: "puma",
        image: "https://via.placeholder.com/300?text=Puma+Brand",
        status: "Active",
      },
      {
        name: "New Balance",
        slug: "new-balance",
        image: "https://via.placeholder.com/300?text=New+Balance",
        status: "Active",
      },
    ]);
    console.log(` Created ${brands.length} brands`);

    // 4. Create Products
    const products = await Product.bulkCreate([
      {
        name: "Nike Air Force 1 - Trắng",
        slug: "nike-air-force-1-trang",
        price: 2500000,
        description: "Giày sneaker Nike Air Force 1 kinh điển",
        images: [
          "https://via.placeholder.com/500?text=Nike+AF1+1",
          "https://via.placeholder.com/500?text=Nike+AF1+2",
        ],
        stockQuantity: 50,
        brand_id: brands[0].id,
        category_id: categories[0].id,
      },
      {
        name: "Nike Air Max 90 - Đỏ Đen",
        slug: "nike-air-max-90-do-den",
        price: 2800000,
        description: "Thiết kế biểu tượng Nike Air Max 90",
        images: [
          "https://via.placeholder.com/500?text=Nike+AM90+1",
          "https://via.placeholder.com/500?text=Nike+AM90+2",
        ],
        stockQuantity: 45,
        brand_id: brands[0].id,
        category_id: categories[0].id,
      },
      {
        name: "Adidas Ultraboost - Xanh",
        slug: "adidas-ultraboost-xanh",
        price: 3500000,
        description: "Giày chạy bộ Adidas Ultraboost hiệu suất cao",
        images: [
          "https://via.placeholder.com/500?text=Adidas+UB+1",
          "https://via.placeholder.com/500?text=Adidas+UB+2",
        ],
        stockQuantity: 40,
        brand_id: brands[1].id,
        category_id: categories[3].id,
      },
      {
        name: "Jordan 1 Retro High - Bred",
        slug: "jordan-1-retro-high-bred",
        price: 3800000,
        description: "Giày bóng rổ Jordan 1 Retro High huyền thoại",
        images: [
          "https://via.placeholder.com/500?text=Jordan+1+1",
          "https://via.placeholder.com/500?text=Jordan+1+2",
        ],
        stockQuantity: 35,
        brand_id: brands[2].id,
        category_id: categories[4].id,
      },
      {
        name: "Puma RS-X - Trắng Xám",
        slug: "puma-rs-x-trang-xam",
        price: 2100000,
        description: "Giày sneaker Puma RS-X hiện đại",
        images: [
          "https://via.placeholder.com/500?text=Puma+RSX+1",
          "https://via.placeholder.com/500?text=Puma+RSX+2",
        ],
        stockQuantity: 60,
        brand_id: brands[3].id,
        category_id: categories[0].id,
      },
      {
        name: "New Balance 990v5 - Xám",
        slug: "new-balance-990v5-xam",
        price: 3900000,
        description: "Giày chạy bộ New Balance 990v5 cao cấp",
        images: [
          "https://via.placeholder.com/500?text=NB+990v5+1",
          "https://via.placeholder.com/500?text=NB+990v5+2",
        ],
        stockQuantity: 30,
        brand_id: brands[4].id,
        category_id: categories[3].id,
      },
      {
        name: "Nike React Infinity Run - Đen",
        slug: "nike-react-infinity-run-den",
        price: 3200000,
        description: "Giày chạy bộ hiệu suất cao Nike React Infinity",
        images: [
          "https://via.placeholder.com/500?text=Nike+RIR+1",
          "https://via.placeholder.com/500?text=Nike+RIR+2",
        ],
        stockQuantity: 25,
        brand_id: brands[0].id,
        category_id: categories[3].id,
      },
      {
        name: "Adidas Superstar - Trắng Xanh",
        slug: "adidas-superstar-trang-xanh",
        price: 1800000,
        description: "Giày sneaker Adidas Superstar kinh điển",
        images: [
          "https://via.placeholder.com/500?text=Adidas+SS+1",
          "https://via.placeholder.com/500?text=Adidas+SS+2",
        ],
        stockQuantity: 70,
        brand_id: brands[1].id,
        category_id: categories[1].id,
      },
      {
        name: "Jordan 11 Retro - Đen Vàng",
        slug: "jordan-11-retro-den-vang",
        price: 4200000,
        description: "Giày bóng rổ Jordan 11 Retro biểu tượng",
        images: [
          "https://via.placeholder.com/500?text=Jordan+11+1",
          "https://via.placeholder.com/500?text=Jordan+11+2",
        ],
        stockQuantity: 20,
        brand_id: brands[2].id,
        category_id: categories[4].id,
      },
      {
        name: "Puma Future Rider - Đỏ",
        slug: "puma-future-rider-do",
        price: 2300000,
        description: "Giày sneaker Puma Future Rider bóng bẩy",
        images: [
          "https://via.placeholder.com/500?text=Puma+FR+1",
          "https://via.placeholder.com/500?text=Puma+FR+2",
        ],
        stockQuantity: 55,
        brand_id: brands[3].id,
        category_id: categories[0].id,
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    // 5. Create Promotions
    const today = new Date();
    const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later

    const promotions = await Promotion.bulkCreate([
      {
        name: "Khuyến Mãi Hè - Giảm 20%",
        image: "https://via.placeholder.com/500?text=Summer+Sale",
        discount: 20,
        startDate: today,
        endDate: endDate,
        status: "Active",
      },
      {
        name: "Đặc Biệt Năm Mới - Giảm 15%",
        image: "https://via.placeholder.com/500?text=New+Year+Special",
        discount: 15,
        startDate: today,
        endDate: endDate,
        status: "Active",
      },
      {
        name: "Khuyến Mãi Chớp Nhoáng - Giảm 30%",
        image: "https://via.placeholder.com/500?text=Flash+Sale",
        discount: 30,
        startDate: today,
        endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: "Active",
      },
      {
        name: "Ưu Đãi Dành Cho Thành Viên - Giảm 10%",
        image: "https://via.placeholder.com/500?text=Member+Exclusive",
        discount: 10,
        startDate: today,
        endDate: endDate,
        status: "Active",
      },
    ]);
    console.log(` Created ${promotions.length} promotions`);

    console.log(`\n Seeding hoàn tất thành công!`);
    console.log(`
     Dữ liệu đã tạo:
    - Tài khoản quản trị: ${admins.length}
    - Danh mục: ${categories.length}
    - Thương hiệu: ${brands.length}
    - Sản phẩm: ${products.length}
    - Khuyến mãi: ${promotions.length}
    
    Thông tin đăng nhập quản trị:
    - Tên đăng nhập: admin, Mật khẩu: admin123
    - Tên đăng nhập: superadmin, Mật khẩu: admin123
    `);

    process.exit(0);
  } catch (error) {
    console.error(" Lỗi khi seeding:", error.message);
    process.exit(1);
  }
};

seedDatabase();
