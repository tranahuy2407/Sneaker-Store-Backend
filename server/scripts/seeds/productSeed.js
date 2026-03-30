import Product from "../../models/product.model.js";
import ProductImage from "../../models/product_image.model.js";
import ProductSize from "../../models/product_size.model.js";
import ProductCategory from "../../models/product_category.model.js";

const SIZES = [38, 39, 40, 41, 42, 43, 44, 45];

const productData = [
  // Nike (brandIndex 0)
  {
    name: "Nike Air Force 1 Low - Trắng",
    slug: "nike-air-force-1-low-trang",
    price: 2500000,
    discountPrice: 2200000,
    description: "Nike Air Force 1 Low là mẫu giày sneaker biểu tượng ra đời năm 1982. Với đế Air đệm đặc trưng, thiết kế da cao cấp và màu trắng tinh khôi, đây là lựa chọn hoàn hảo cho mọi trang phục.",
    brandIndex: 0,
    categoryIndex: 0,
    images: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/4f37fca8-6bce-43e7-ad07-f57ae3c13142/air-force-1-07-shoes-WrLlWX.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350a5b8a-4de8-41e2-9bb4-d8f9e00cd897/air-force-1-07-shoes-WrLlWX.png",
    ],
  },
  {
    name: "Nike Air Max 90 - Đỏ Đen",
    slug: "nike-air-max-90-do-den",
    price: 3200000,
    discountPrice: 2900000,
    description: "Nike Air Max 90 với đế air cổ điển, thiết kế đan xen nhiều màu sắc táo bạo. Mang lại sự thoải mái tối đa cho cả ngày dài.",
    brandIndex: 0,
    categoryIndex: 1,
    images: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-4ab97dd4-ef1e-4b12-a6a2-6e7c3f6e07c4/air-max-90-shoes-kRsBnD.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/air-max-90-shoes.png",
    ],
  },
  {
    name: "Nike React Infinity Run Flyknit 3 - Đen",
    slug: "nike-react-infinity-run-flyknit-3-den",
    price: 3800000,
    discountPrice: 3500000,
    description: "Giày chạy bộ Nike React Infinity Run Flyknit 3 với công nghệ foam React đàn hồi, phần giữa đế rộng giúp tăng độ ổn định và giảm chấn thương khi chạy.",
    brandIndex: 0,
    categoryIndex: 1,
    images: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/nike-react-infinity-run.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/nike-react-infinity-run-2.png",
    ],
  },
  {
    name: "Nike Dunk Low - Panda",
    slug: "nike-dunk-low-panda",
    price: 2800000,
    discountPrice: null,
    description: "Nike Dunk Low Panda với phối màu đen trắng kinh điển, upper da cao cấp và đế ngăn cao giúp nâng đỡ mắt cá. Một trong những mẫu giày bán chạy nhất mọi thời đại.",
    brandIndex: 0,
    categoryIndex: 0,
    images: [
      "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/nike-dunk-low-panda.png",
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/nike-dunk-low-panda-2.png",
    ],
  },
  // Adidas (brandIndex 1)
  {
    name: "Adidas Ultraboost 22 - Xanh Navy",
    slug: "adidas-ultraboost-22-xanh-navy",
    price: 4200000,
    discountPrice: 3800000,
    description: "Adidas Ultraboost 22 với công nghệ Boost tiên tiến mang lại năng lượng hoàn trả tối đa. Phần upper Primeknit thoáng khí ôm vừa vặn bàn chân.",
    brandIndex: 1,
    categoryIndex: 1,
    images: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ultraboost-22.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ultraboost-22-2.jpg",
    ],
  },
  {
    name: "Adidas Superstar - Trắng Vàng",
    slug: "adidas-superstar-trang-vang",
    price: 2100000,
    discountPrice: 1900000,
    description: "Adidas Superstar với shell-toe nổi tiếng và 3 sọc đặc trưng. Mẫu giày casual hoàn hảo kết hợp với nhiều phong cách thời trang.",
    brandIndex: 1,
    categoryIndex: 0,
    images: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adidas-superstar.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adidas-superstar-2.jpg",
    ],
  },
  {
    name: "Adidas NMD R1 - Xám Trắng",
    slug: "adidas-nmd-r1-xam-trang",
    price: 3500000,
    discountPrice: 3100000,
    description: "Adidas NMD R1 kết hợp phần đế Boost cổ điển với thiết kế Primeknit hiện đại. Đôi giày lifestyle lý tưởng cho những người yêu thích sự năng động.",
    brandIndex: 1,
    categoryIndex: 4,
    images: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adidas-nmd-r1.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/adidas-nmd-r1-2.jpg",
    ],
  },
  // Jordan (brandIndex 2)
  {
    name: "Air Jordan 1 Retro High OG - Bred",
    slug: "air-jordan-1-retro-high-og-bred",
    price: 5500000,
    discountPrice: null,
    description: "Air Jordan 1 Retro High OG Bred là phiên bản tái sinh của đôi giày huyền thoại Michael Jordan mang năm 1984-1985. Phối màu đen đỏ biểu tượng với upper da cao cấp.",
    brandIndex: 2,
    categoryIndex: 2,
    images: [
      "https://cdn.sneakernews.com/wp-content/uploads/2019/10/air-jordan-1-retro-high-og-bred-555088-610-1.jpg",
      "https://cdn.sneakernews.com/wp-content/uploads/2019/10/air-jordan-1-retro-high-og-bred-555088-610-2.jpg",
    ],
  },
  {
    name: "Air Jordan 4 Retro - White Cement",
    slug: "air-jordan-4-retro-white-cement",
    price: 6200000,
    discountPrice: 5800000,
    description: "Air Jordan 4 Retro White Cement với thiết kế lưới thoáng khí, móc kéo ở gót và đế ngăn Air. Một trong những mẫu Jordan được săn đón nhất.",
    brandIndex: 2,
    categoryIndex: 2,
    images: [
      "https://cdn.sneakernews.com/wp-content/uploads/2023/02/air-jordan-4-white-cement-reimagined.jpg",
      "https://cdn.sneakernews.com/wp-content/uploads/2023/02/air-jordan-4-white-cement-reimagined-2.jpg",
    ],
  },
  {
    name: "Air Jordan 11 Concord",
    slug: "air-jordan-11-concord",
    price: 7000000,
    discountPrice: null,
    description: "Air Jordan 11 Concord với upper patent leather óng ánh và đế pha lê trong suốt. Mẫu giày được mệnh danh là đẹp nhất dòng Jordan.",
    brandIndex: 2,
    categoryIndex: 2,
    images: [
      "https://cdn.sneakernews.com/wp-content/uploads/2018/10/air-jordan-11-concord-2018.jpg",
      "https://cdn.sneakernews.com/wp-content/uploads/2018/10/air-jordan-11-concord-2018-2.jpg",
    ],
  },
  // Puma (brandIndex 3)
  {
    name: "Puma RS-X3 Puzzle - Đa Màu",
    slug: "puma-rs-x3-puzzle-da-mau",
    price: 2400000,
    discountPrice: 2100000,
    description: "Puma RS-X3 Puzzle với thiết kế chunky độc đáo, phối màu đa sắc nổi bật. Đế RS đặc trưng mang lại độ đệm thoải mái suốt cả ngày.",
    brandIndex: 3,
    categoryIndex: 0,
    images: [
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/puma-rs-x3-puzzle.jpg",
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/puma-rs-x3-puzzle-2.jpg",
    ],
  },
  {
    name: "Puma Suede Classic - Đen",
    slug: "puma-suede-classic-den",
    price: 1800000,
    discountPrice: 1600000,
    description: "Puma Suede Classic với chất liệu suede mềm mại, đường viền gọn gàng và đế keo bền bỉ. Mẫu giày retro dating từ năm 1968 vẫn giữ nguyên vẻ đẹp vượt thời gian.",
    brandIndex: 3,
    categoryIndex: 4,
    images: [
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/puma-suede-classic.jpg",
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/puma-suede-classic-2.jpg",
    ],
  },
  // New Balance (brandIndex 4)
  {
    name: "New Balance 574 - Xám",
    slug: "new-balance-574-xam",
    price: 2200000,
    discountPrice: 2000000,
    description: "New Balance 574 với phần đế ENCAP kết hợp EVA và polyurethane cho độ đệm và hỗ trợ lâu dài. Upper da lộn và lưới thoáng khí cân bằng phong cách và tiện dụng.",
    brandIndex: 4,
    categoryIndex: 0,
    images: [
      "https://nb.scene7.com/is/image/NB/ml574evg_nb_02_i?$pdpflexf2$&qlt=70&fmt=webp&wid=440&hei=440",
      "https://nb.scene7.com/is/image/NB/ml574evg_nb_03_i?$pdpflexf2$&qlt=70&fmt=webp&wid=440&hei=440",
    ],
  },
  {
    name: "New Balance 990v5 - Xám Bạc",
    slug: "new-balance-990v5-xam-bac",
    price: 5800000,
    discountPrice: null,
    description: "New Balance 990v5 Made in USA với thiết kế cao cấp, đế ENCAP và Blown Rubber. Đây là mẫu giày chạy bộ premium được nhiều celebrities ưa chuộng.",
    brandIndex: 4,
    categoryIndex: 1,
    images: [
      "https://nb.scene7.com/is/image/NB/m990gl5_nb_02_i?$pdpflexf2$&qlt=70&fmt=webp&wid=440&hei=440",
      "https://nb.scene7.com/is/image/NB/m990gl5_nb_03_i?$pdpflexf2$&qlt=70&fmt=webp&wid=440&hei=440",
    ],
  },
  // Converse (brandIndex 5)
  {
    name: "Converse Chuck Taylor All Star - Trắng Cổ Thấp",
    slug: "converse-chuck-taylor-all-star-trang-co-thap",
    price: 1500000,
    discountPrice: 1350000,
    description: "Converse Chuck Taylor All Star cổ thấp với upper canvas nhẹ, đế cao su vulcanized bền bỉ. Đôi giày biểu tượng hơn 100 năm tuổi không bao giờ lỗi mốt.",
    brandIndex: 5,
    categoryIndex: 4,
    images: [
      "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw3b6dc2e2/images/a_107/M7652_A_107X1.jpg",
      "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw3b6dc2e2/images/a_107/M7652_A_107X4.jpg",
    ],
  },
  {
    name: "Converse Chuck 70 Hi - Be Vintage",
    slug: "converse-chuck-70-hi-be-vintage",
    price: 1900000,
    discountPrice: null,
    description: "Converse Chuck 70 Hi phiên bản vintage với màu be cổ điển, phần cao cổ bảo vệ mắt cá. Upper canvas dày dặn hơn phiên bản thường.",
    brandIndex: 5,
    categoryIndex: 4,
    images: [
      "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/chuck-70-hi.jpg",
      "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/chuck-70-hi-2.jpg",
    ],
  },
  // Vans (brandIndex 6)
  {
    name: "Vans Old Skool - Đen Trắng",
    slug: "vans-old-skool-den-trang",
    price: 1700000,
    discountPrice: 1500000,
    description: "Vans Old Skool với sọc Side Stripe đặc trưng và upper da lộn/canvas. Mẫu giày skate cổ điển phù hợp cả chơi thể thao lẫn phong cách thường ngày.",
    brandIndex: 6,
    categoryIndex: 0,
    images: [
      "https://images.vans.com/is/image/VansEU/D3HY28-HERO?wid=1600&hei=1600",
      "https://images.vans.com/is/image/VansEU/D3HY28-ALT1?wid=1600&hei=1600",
    ],
  },
  {
    name: "Vans Authentic - Đỏ",
    slug: "vans-authentic-do",
    price: 1400000,
    discountPrice: 1250000,
    description: "Vans Authentic với thiết kế tối giản, upper canvas một màu và đế Waffle độc quyền. Mẫu giày đầu tiên của Vans ngay từ năm 1966.",
    brandIndex: 6,
    categoryIndex: 4,
    images: [
      "https://images.vans.com/is/image/VansEU/EE3NRD-HERO?wid=1600&hei=1600",
      "https://images.vans.com/is/image/VansEU/EE3NRD-ALT1?wid=1600&hei=1600",
    ],
  },
  // Reebok (brandIndex 7)
  {
    name: "Reebok Classic Leather - Trắng",
    slug: "reebok-classic-leather-trang",
    price: 1900000,
    discountPrice: 1700000,
    description: "Reebok Classic Leather với upper da mềm mại, đế nhẹ và logo Reebok quen thuộc. Mẫu giày lifestyle hoàn hảo cho mọi dịp.",
    brandIndex: 7,
    categoryIndex: 0,
    images: [
      "https://assets.reebok.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/reebok-classic-leather.jpg",
      "https://assets.reebok.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/reebok-classic-leather-2.jpg",
    ],
  },
  {
    name: "Reebok Nano X2 - Đen Cam",
    slug: "reebok-nano-x2-den-cam",
    price: 3200000,
    discountPrice: 2900000,
    description: "Reebok Nano X2 được thiết kế cho CrossFit với Flexweave thoáng khí, đế Lift and Run Chassis đa năng hỗ trợ cả lifting và cardio.",
    brandIndex: 7,
    categoryIndex: 3,
    images: [
      "https://assets.reebok.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/reebok-nano-x2.jpg",
      "https://assets.reebok.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/reebok-nano-x2-2.jpg",
    ],
  },
];

export async function seedProducts(brands, categories) {
  const products = [];

  for (const data of productData) {
    const product = await Product.create({
      name: data.name,
      slug: data.slug,
      price: data.price,
      discountPrice: data.discountPrice,
      description: data.description,
      status: "Active",
      brand_id: brands[data.brandIndex].id,
    });

    // Tạo ProductImages
    const imageRecords = data.images.map((url, idx) => ({
      product_id: product.id,
      url,
      isDefault: idx === 0,
      allText: `${data.name} - ảnh ${idx + 1}`,
    }));
    await ProductImage.bulkCreate(imageRecords);

    // Tạo ProductSizes
    const sizeRecords = SIZES.map((size) => ({
      product_id: product.id,
      size,
      stock: Math.floor(Math.random() * 30) + 5,
    }));
    await ProductSize.bulkCreate(sizeRecords);

    // Tạo ProductCategory
    await ProductCategory.create({
      product_id: product.id,
      category_id: categories[data.categoryIndex].id,
    });

    products.push(product);
  }

  console.log(`✅ Seeded ${products.length} products (with images, sizes, categories)`);
  return products;
}
