import Brand from "../../models/brand.model.js";

export async function seedBrands() {
  const brands = await Brand.bulkCreate([
    {
      name: "Nike",
      slug: "nike",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
      status: "Active",
    },
    {
      name: "Adidas",
      slug: "adidas",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png",
      status: "Active",
    },
    {
      name: "Jordan",
      slug: "jordan-brand",
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/Air_Jordan_logo.svg/1200px-Air_Jordan_logo.svg.png",
      status: "Active",
    },
    {
      name: "Puma",
      slug: "puma",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Puma_logo.svg/1200px-Puma_logo.svg.png",
      status: "Active",
    },
    {
      name: "New Balance",
      slug: "new-balance",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/1200px-New_Balance_logo.svg.png",
      status: "Active",
    },
    {
      name: "Converse",
      slug: "converse",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Converse_logo.svg/1200px-Converse_logo.svg.png",
      status: "Active",
    },
    {
      name: "Vans",
      slug: "vans",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Vans-logo.svg/1200px-Vans-logo.svg.png",
      status: "Active",
    },
    {
      name: "Reebok",
      slug: "reebok",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Reebok_2019_logo.svg/1200px-Reebok_2019_logo.svg.png",
      status: "Active",
    },
  ]);

  console.log(`✅ Seeded ${brands.length} brands`);
  return brands;
}
