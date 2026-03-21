import { HomeSection, Product } from "../models/index.js";

export const HomeSectionService = {
  async getActiveSections() {
    return HomeSection.findAll({
      where: { is_active: true },
      include: [{ model: Product, as: "products" }],
      order: [
        ["display_order", "ASC"],
        ["created_at", "DESC"],
      ],
    });
  },

  async getAllSections() {
    return HomeSection.findAll({
      include: [
        { model: Product, as: "products", attributes: ["id", "name"] },
      ],
      order: [["display_order", "ASC"], ["created_at", "DESC"]],
    });
  },

  async createSection(data) {
    let productIds = data.productIds;
    if (typeof productIds === "string") {
      try {
        productIds = JSON.parse(productIds);
      } catch {
        productIds = [];
      }
    }

    const sectionData = {
      title: data.title || "",
      slug: data.slug || "",
      banner_url: data.banner_url || "",
      section_type: data.section_type || "manual",
      display_order: Number(data.display_order) || 0,
      is_active: data.is_active == "1" || data.is_active === true,
    };

    const section = await HomeSection.create(sectionData);

    if (productIds?.length) {
      const validProducts = await Product.findAll({
        where: { id: productIds },
      });

      await section.setProducts(validProducts.map((p) => p.id));
    }

    return section;
  },

  // UPDATE
  async updateSection(id, data) {
    const section = await HomeSection.findByPk(id);
    if (!section) throw new Error("Section không tồn tại");

    let productIds = data.productIds;

    if (typeof productIds === "string") {
      try {
        productIds = JSON.parse(productIds);
      } catch {
        productIds = [];
      }
    }

    const sectionData = {
      title: data.title || section.title,
      slug: data.slug || section.slug,
      banner_url: data.banner_url || section.banner_url,
      section_type: data.section_type || section.section_type,
      display_order: Number(data.display_order) || section.display_order,
      is_active:
        data.is_active !== undefined
          ? data.is_active == "1" || data.is_active === true
          : section.is_active,
    };

    await section.update(sectionData);

    if (productIds?.length) {
      const validProducts = await Product.findAll({
        where: { id: productIds },
      });

      await section.setProducts(validProducts.map((p) => p.id));
    }

    return section;
  },

  async deleteSection(id) {
    const section = await HomeSection.findByPk(id);
    if (!section) throw new Error("Section không tồn tại");
    return section.destroy();
  },
};