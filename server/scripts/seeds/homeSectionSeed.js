import HomeSection from "../../models/home_section.model.js";
import HomeSectionProduct from "../../models/home_section_product.model.js";

export async function seedHomeSections(products) {
  const sections = await HomeSection.bulkCreate([
    {
      title: "Nike Collection 2025",
      slug: "nike-collection-2025",
      banner_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
      section_type: "brand",
      display_order: 1,
      is_active: true,
    },
    {
      title: "Flash Sale - Giảm đến 30%",
      slug: "flash-sale-giam-30",
      banner_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
      section_type: "sale",
      display_order: 2,
      is_active: true,
    },
    {
      title: "Hàng Mới Về",
      slug: "hang-moi-ve",
      banner_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200",
      section_type: "new_arrival",
      display_order: 3,
      is_active: true,
    },
    {
      title: "Jordan Brand Collection",
      slug: "jordan-brand-collection",
      banner_url: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1200",
      section_type: "brand",
      display_order: 4,
      is_active: true,
    },
    {
      title: "Banner Mùa Hè 2025",
      slug: null,
      banner_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
      section_type: "banner_only",
      display_order: 5,
      is_active: true,
    },
  ]);

  // Gắn sản phẩm vào từng section
  const sectionProductMap = [
    products.slice(0, 4),   // Nike
    products.slice(0, 6),   // Sale
    products.slice(14, 20), // New arrival
    products.slice(7, 10),  // Jordan
  ];

  for (let i = 0; i < 4; i++) {
    for (const product of sectionProductMap[i]) {
      await HomeSectionProduct.create({
        home_section_id: sections[i].id,
        product_id: product.id,
      });
    }
  }

  console.log(`✅ Seeded ${sections.length} home sections with products`);
  return sections;
}
