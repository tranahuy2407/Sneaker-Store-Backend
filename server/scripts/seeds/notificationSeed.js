import Notification from "../../models/notification.model.js";

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const adminNotifTypes = ["new_order", "low_stock", "new_contact", "new_review", "system"];
const userNotifTypes = ["order_status", "promotion", "delivery", "review_remind", "coupon"];

export async function seedNotifications(admins, users, orders) {
  const notifications = [];

  // ---- Thông báo cho Admin ----
  const adminNotifData = [
    {
      title: "Đơn hàng mới",
      message: "Có đơn hàng mới cần xử lý. Mã đơn: " + (orders[0]?.order_code || "ORD001"),
      type: "new_order",
      entity_type: "order",
      entity_id: orders[0]?.id || null,
      receiver_type: "admin",
      receiver_id: admins[0].id,
      is_read: false,
    },
    {
      title: "Đơn hàng mới",
      message: "Có đơn hàng mới cần xử lý. Mã đơn: " + (orders[1]?.order_code || "ORD002"),
      type: "new_order",
      entity_type: "order",
      entity_id: orders[1]?.id || null,
      receiver_type: "admin",
      receiver_id: admins[0].id,
      is_read: true,
    },
    {
      title: "Cảnh báo tồn kho thấp",
      message: "Một số sản phẩm đang có tồn kho thấp dưới 5 đôi. Vui lòng kiểm tra và bổ sung.",
      type: "low_stock",
      entity_type: "product",
      entity_id: null,
      receiver_type: "admin",
      receiver_id: admins[0].id,
      is_read: false,
    },
    {
      title: "Liên hệ mới từ khách hàng",
      message: "Bạn có một tin nhắn liên hệ mới từ khách hàng Nguyễn Văn Tú về hỗ trợ mua trả góp.",
      type: "new_contact",
      entity_type: "contact",
      entity_id: null,
      receiver_type: "admin",
      receiver_id: admins[0].id,
      is_read: false,
    },
    {
      title: "Đánh giá 1 sao cần xử lý",
      message: "Khách hàng vừa để lại đánh giá 1 sao cho sản phẩm. Vui lòng xem xét và phản hồi.",
      type: "new_review",
      entity_type: "review",
      entity_id: null,
      receiver_type: "admin",
      receiver_id: admins[0].id,
      is_read: false,
    },
    {
      title: "Hệ thống sao lưu thành công",
      message: "Quá trình sao lưu cơ sở dữ liệu đã hoàn thành lúc 03:00 AM. Tất cả dữ liệu an toàn.",
      type: "system",
      entity_type: null,
      entity_id: null,
      receiver_type: "admin",
      receiver_id: admins[0].id,
      is_read: true,
    },
    {
      title: "Đơn hàng mới cần duyệt",
      message: "Có 5 đơn hàng mới đang chờ xử lý hôm nay. Vui lòng vào trang quản lý để duyệt.",
      type: "new_order",
      entity_type: "order",
      entity_id: null,
      receiver_type: "admin",
      receiver_id: admins[1]?.id || admins[0].id,
      is_read: false,
    },
    {
      title: "Doanh thu tuần đạt mục tiêu",
      message: "Chúc mừng! Doanh thu tuần này đã vượt mục tiêu 15%. Tổng doanh thu: 45.600.000đ.",
      type: "system",
      entity_type: null,
      entity_id: null,
      receiver_type: "admin",
      receiver_id: admins[0].id,
      is_read: true,
    },
  ];

  for (const data of adminNotifData) {
    const n = await Notification.create(data);
    notifications.push(n);
  }

  // ---- Thông báo cho User ----
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const order = orders[i] || orders[0];

    const userNotifData = [
      {
        title: "Đơn hàng đã được xác nhận",
        message: `Đơn hàng ${order?.order_code || "ORD001"} của bạn đã được xác nhận và đang được chuẩn bị.`,
        type: "order_status",
        entity_type: "order",
        entity_id: order?.id || null,
        receiver_type: "user",
        receiver_id: user.id,
        is_read: i < 5,
      },
      {
        title: "Ưu đãi đặc biệt dành cho bạn!",
        message: "Dùng mã NEWUSER giảm ngay 10% cho đơn hàng tiếp theo. Ưu đãi có hạn!",
        type: "promotion",
        entity_type: "coupon",
        entity_id: null,
        receiver_type: "user",
        receiver_id: user.id,
        is_read: false,
      },
      {
        title: "Đơn hàng đang được giao",
        message: `Đơn hàng ${order?.order_code || "ORD001"} của bạn đang trên đường giao đến. Dự kiến nhận hàng trong hôm nay.`,
        type: "delivery",
        entity_type: "order",
        entity_id: order?.id || null,
        receiver_type: "user",
        receiver_id: user.id,
        is_read: i % 2 === 0,
      },
    ];

    for (const data of userNotifData) {
      const n = await Notification.create(data);
      notifications.push(n);
    }
  }

  console.log(`✅ Seeded ${notifications.length} notifications`);
  return notifications;
}
