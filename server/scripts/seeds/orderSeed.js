import Order from "../../models/order.model.js";
import OrderDetail from "../../models/order_detail.model.js";
import Invoice from "../../models/invoice.model.js";
import ProductSize from "../../models/product_size.model.js";

const vietnamPhones = [
  "0912345678", "0987654321", "0901234567", "0978901234",
  "0956789012", "0934567890", "0923456789", "0945678901",
  "0967890123", "0989012345",
];

const addresses = [
  {
    address_line: "123 Lê Lợi", ward: "Phường Bến Thành", district: "Quận 1", city: "TP. Hồ Chí Minh",
  },
  {
    address_line: "456 Nguyễn Huệ", ward: "Phường Bến Nghé", district: "Quận 1", city: "TP. Hồ Chí Minh",
  },
  {
    address_line: "78 Phố Huế", ward: "Phường Nguyễn Du", district: "Quận Hai Bà Trưng", city: "Hà Nội",
  },
  {
    address_line: "34 Bà Triệu", ward: "Phường Hàng Bài", district: "Quận Hoàn Kiếm", city: "Hà Nội",
  },
  {
    address_line: "90 Trần Hưng Đạo", ward: "Phường 1", district: "Quận 5", city: "TP. Hồ Chí Minh",
  },
  {
    address_line: "55 Cách Mạng Tháng 8", ward: "Phường 6", district: "Quận 3", city: "TP. Hồ Chí Minh",
  },
  {
    address_line: "12 Nguyễn Trãi", ward: "Phường 3", district: "Quận 5", city: "TP. Hồ Chí Minh",
  },
  {
    address_line: "67 Đinh Tiên Hoàng", ward: "Phường 3", district: "Quận Bình Thạnh", city: "TP. Hồ Chí Minh",
  },
  {
    address_line: "23 Trường Chinh", ward: "Phường Khương Trung", district: "Quận Thanh Xuân", city: "Hà Nội",
  },
  {
    address_line: "89 Lý Thường Kiệt", ward: "Phường 14", district: "Quận 10", city: "TP. Hồ Chí Minh",
  },
];

const receiverNames = [
  "Nguyễn Văn An", "Trần Thị Bích", "Lê Hoàng Cường", "Phạm Thị Dung",
  "Hoàng Minh Em", "Đặng Thị Hoa", "Vũ Văn Giang", "Bùi Thị Hương",
  "Tống Minh Khôi", "Ngô Thị Lan",
];

const orderStatuses = ["Pending", "Processing", "Completed", "Completed", "Completed", "Cancelled"];
const paymentStatuses = ["Unpaid", "Paid", "Paid", "Paid", "Refunded"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOrderCode(idx) {
  const timestamp = Date.now().toString().slice(-6);
  return `ORD${timestamp}${String(idx).padStart(4, "0")}`;
}

function randomDateInPast(days = 90) {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * days * 24 * 60 * 60 * 1000);
  return past;
}

export async function seedOrders(users, products, paymentMethods, shippingCosts) {
  const orders = [];
  const orderDetails = [];
  const invoices = [];

  for (let i = 0; i < 30; i++) {
    const userIdx = i % users.length;
    const addrIdx = i % addresses.length;
    const orderStatus = randomItem(orderStatuses);
    const paymentStatus = orderStatus === "Completed" ? "Paid" : randomItem(paymentStatuses);
    const shippingCost = randomItem(shippingCosts);
    const paymentMethod = randomItem(paymentMethods);
    const createdAt = randomDateInPast(120);

    // Chọn 1-3 sản phẩm ngẫu nhiên
    const numItems = randomInt(1, 3);
    const selectedProducts = [];
    const usedProductIds = new Set();
    for (let j = 0; j < numItems; j++) {
      let p;
      do {
        p = randomItem(products);
      } while (usedProductIds.has(p.id));
      usedProductIds.add(p.id);
      selectedProducts.push(p);
    }

    let totalAmount = 0;
    const detailsData = [];

    for (const product of selectedProducts) {
      // Lấy product_size
      const sizes = await ProductSize.findAll({ where: { product_id: product.id } });
      if (!sizes.length) continue;
      const size = randomItem(sizes);
      const qty = randomInt(1, 3);
      const price = product.discountPrice || product.price;
      totalAmount += price * qty;
      detailsData.push({ product, size, qty, price });
    }

    totalAmount += shippingCost.cost;

    const order = await Order.create({
      order_code: generateOrderCode(i),
      user_id: users[userIdx].id,
      payment_method_id: paymentMethod.id,
      receiver_name: receiverNames[addrIdx],
      receiver_phone: vietnamPhones[addrIdx],
      email: users[userIdx].email,
      address_line: addresses[addrIdx].address_line,
      ward: addresses[addrIdx].ward,
      district: addresses[addrIdx].district,
      city: addresses[addrIdx].city,
      note: i % 3 === 0 ? "Gọi trước khi giao hàng" : null,
      total_amount: totalAmount,
      shipping_cost: shippingCost.cost,
      shipping_cost_id: shippingCost.id,
      payment_status: paymentStatus,
      status: orderStatus,
      created_at: createdAt,
      updated_at: createdAt,
    });

    for (const { product, size, qty, price } of detailsData) {
      const detail = await OrderDetail.create({
        order_id: order.id,
        product_id: product.id,
        product_size_id: size.id,
        quantity: qty,
        price,
      });
      orderDetails.push(detail);
    }

    // Tạo Invoice cho các đơn đã hoàn thành
    if (orderStatus === "Completed") {
      const invoice = await Invoice.create({
        order_id: order.id,
        total_amount: totalAmount,
        issued_at: new Date(createdAt.getTime() + 2 * 60 * 60 * 1000),
        created_at: createdAt,
        updated_at: createdAt,
      });
      invoices.push(invoice);
    }

    orders.push(order);
  }

  console.log(`✅ Seeded ${orders.length} orders, ${orderDetails.length} order details, ${invoices.length} invoices`);
  return orders;
}
