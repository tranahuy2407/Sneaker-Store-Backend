import ShippingCost from "../../models/shippingcost.model.js";

export async function seedShippingCosts() {
  const shippingCosts = await ShippingCost.bulkCreate([
    { name: "Giao hàng nội thành", cost: 20000 },
    { name: "Giao hàng ngoại thành", cost: 35000 },
    { name: "Giao hàng toàn quốc (nhanh)", cost: 50000 },
    { name: "Giao hàng toàn quốc (tiết kiệm)", cost: 30000 },
    { name: "Giao hàng miễn phí (đơn > 500k)", cost: 0 },
  ]);

  console.log(`✅ Seeded ${shippingCosts.length} shipping costs`);
  return shippingCosts;
}
