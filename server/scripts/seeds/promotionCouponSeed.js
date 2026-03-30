import Promotion from "../../models/promotion.model.js";
import Coupon from "../../models/coupon.model.js";
import CouponProduct from "../../models/coupon_product.model.js";
import PromotionProduct from "../../models/promotion_product.model.js";

export async function seedPromotions(products) {
  const now = new Date();
  const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const past30days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const promotions = await Promotion.bulkCreate([
    {
      name: "Sale Cuối Mùa Hè - Giảm 20%",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500",
      description: "Chương trình giảm giá lớn cuối mùa hè, áp dụng cho nhiều mẫu giày thể thao.",
      start_date: now,
      end_date: in30days,
      is_active: true,
    },
    {
      name: "Flash Sale Cuối Tuần - Giảm 30%",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=500",
      description: "Chương trình flash sale chớp nhoáng chỉ trong cuối tuần.",
      start_date: now,
      end_date: in7days,
      is_active: true,
    },
    {
      name: "Ưu Đãi Thành Viên VIP - Giảm 15%",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500",
      description: "Chương trình dành riêng cho thành viên VIP của cửa hàng.",
      start_date: now,
      end_date: in30days,
      is_active: true,
    },
    {
      name: "Khuyến Mãi Năm Mới - Giảm 10%",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500",
      description: "Chào đón năm mới với nhiều ưu đãi hấp dẫn.",
      start_date: past30days,
      end_date: now,
      is_active: false,
    },
  ]);

  // Gắn sản phẩm vào promotions
  for (let i = 0; i < 3; i++) {
    const promoProducts = products.slice(i * 5, i * 5 + 5);
    for (const p of promoProducts) {
      await PromotionProduct.create({
        promotion_id: promotions[i].id,
        product_id: p.id,
      });
    }
  }

  console.log(`✅ Seeded ${promotions.length} promotions`);
  return promotions;
}

export async function seedCoupons(promotions, products) {
  const now = new Date();
  const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const coupons = await Coupon.bulkCreate([
    {
      code: "SUMMER20",
      type: "PERCENT",
      value: 20,
      max_discount: 200000,
      min_order_value: 500000,
      usage_limit: 100,
      used_count: 12,
      start_date: now,
      end_date: in30days,
      is_active: true,
      promotion_id: promotions[0].id,
    },
    {
      code: "FLASH30",
      type: "PERCENT",
      value: 30,
      max_discount: 300000,
      min_order_value: 800000,
      usage_limit: 50,
      used_count: 8,
      start_date: now,
      end_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      is_active: true,
      promotion_id: promotions[1].id,
    },
    {
      code: "VIP15",
      type: "PERCENT",
      value: 15,
      max_discount: 150000,
      min_order_value: 0,
      usage_limit: 200,
      used_count: 25,
      start_date: now,
      end_date: in30days,
      is_active: true,
      promotion_id: promotions[2].id,
    },
    {
      code: "FIXED50K",
      type: "FIXED",
      value: 50000,
      max_discount: null,
      min_order_value: 300000,
      usage_limit: 500,
      used_count: 45,
      start_date: now,
      end_date: in30days,
      is_active: true,
      promotion_id: null,
    },
    {
      code: "NEWUSER",
      type: "PERCENT",
      value: 10,
      max_discount: 100000,
      min_order_value: 0,
      usage_limit: 1000,
      used_count: 140,
      start_date: now,
      end_date: in30days,
      is_active: true,
      promotion_id: null,
    },
    {
      code: "BIGSALE100K",
      type: "FIXED",
      value: 100000,
      max_discount: null,
      min_order_value: 1000000,
      usage_limit: 200,
      used_count: 33,
      start_date: now,
      end_date: in30days,
      is_active: true,
      promotion_id: null,
    },
  ]);

  // Gắn coupon với một số sản phẩm
  const firstCoupon = coupons[0];
  for (const p of products.slice(0, 5)) {
    await CouponProduct.create({
      coupon_id: firstCoupon.id,
      product_id: p.id,
    });
  }

  console.log(`✅ Seeded ${coupons.length} coupons`);
  return coupons;
}
