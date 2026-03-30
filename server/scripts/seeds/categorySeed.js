import Category from "../../models/category.model.js";

export async function seedCategories() {
  const categories = await Category.bulkCreate([
    {
      name: "Giày Sneaker",
      slug: "giay-sneaker",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      status: "Active",
    },
    {
      name: "Giày Chạy Bộ",
      slug: "giay-chay-bo",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300",
      status: "Active",
    },
    {
      name: "Giày Bóng Rổ",
      slug: "giay-bong-ro",
      image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=300",
      status: "Active",
    },
    {
      name: "Giày Thể Thao",
      slug: "giay-the-thao",
      image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=300",
      status: "Active",
    },
    {
      name: "Giày Casual",
      slug: "giay-casual",
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300",
      status: "Active",
    },
    {
      name: "Giày Trẻ Em",
      slug: "giay-tre-em",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300",
      status: "Active",
    },
    {
      name: "Giày Nữ",
      slug: "giay-nu",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300",
      status: "Active",
    },
    {
      name: "Phụ Kiện",
      slug: "phu-kien",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300",
      status: "Active",
    },
  ]);

  console.log(`✅ Seeded ${categories.length} categories`);
  return categories;
}
