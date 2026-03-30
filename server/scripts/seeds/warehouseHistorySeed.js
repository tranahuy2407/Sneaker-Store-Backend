import WarehouseHistory from "../../models/warehouse_history.model.js";
import ProductSize from "../../models/product_size.model.js";

const notes = [
  "Nhập hàng từ nhà cung cấp",
  "Bổ sung tồn kho theo yêu cầu",
  "Nhập hàng đợt 2",
  "Điều chỉnh tồn kho sau kiểm kê",
  "Nhập hàng mới về kho",
  "Bổ sung hàng dịp lễ",
  "Nhập hàng sale cuối tháng",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function seedWarehouseHistory(admins, products) {
  const histories = [];

  for (let i = 0; i < 30; i++) {
    const product = randomItem(products);
    const sizes = await ProductSize.findAll({ where: { product_id: product.id } });
    if (!sizes.length) continue;

    const size = randomItem(sizes);
    const admin = randomItem(admins);
    const oldQty = size.stock;
    const changeQty = randomInt(5, 30);
    const newQty = oldQty + changeQty;

    const history = await WarehouseHistory.create({
      size_id: size.id,
      admin_id: admin.id,
      old_quantity: oldQty,
      new_quantity: newQty,
      change_quantity: changeQty,
      note: randomItem(notes),
    });

    // Cập nhật stock trong product_size
    await size.update({ stock: newQty });

    histories.push(history);
  }

  console.log(`✅ Seeded ${histories.length} warehouse histories`);
  return histories;
}
