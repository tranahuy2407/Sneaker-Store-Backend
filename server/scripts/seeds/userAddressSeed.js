import UserAddress from "../../models/user_address.model.js";

const addressData = [
  {
    receiver_name: "Nguyễn Văn An",
    receiver_phone: "0912345678",
    address_line: "123 Đường Lê Lợi",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    is_default: true,
  },
  {
    receiver_name: "Nguyễn Văn An",
    receiver_phone: "0912345678",
    address_line: "456 Đường Nguyễn Huệ",
    ward: "Phường Bến Thành",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    is_default: false,
  },
  {
    receiver_name: "Trần Thị Bích",
    receiver_phone: "0987654321",
    address_line: "789 Đường Trần Hưng Đạo",
    ward: "Phường 1",
    district: "Quận 5",
    city: "TP. Hồ Chí Minh",
    is_default: true,
  },
  {
    receiver_name: "Lê Hoàng Cường",
    receiver_phone: "0901234567",
    address_line: "12 Ngõ 45 Đinh Tiên Hoàng",
    ward: "Phường Đinh Tiên Hoàng",
    district: "Quận Bình Thạnh",
    city: "TP. Hồ Chí Minh",
    is_default: true,
  },
  {
    receiver_name: "Phạm Thị Dung",
    receiver_phone: "0978901234",
    address_line: "78 Phố Huế",
    ward: "Phường Nguyễn Du",
    district: "Quận Hai Bà Trưng",
    city: "Hà Nội",
    is_default: true,
  },
  {
    receiver_name: "Hoàng Minh Em",
    receiver_phone: "0956789012",
    address_line: "34 Bà Triệu",
    ward: "Phường Hàng Bài",
    district: "Quận Hoàn Kiếm",
    city: "Hà Nội",
    is_default: true,
  },
  {
    receiver_name: "Đặng Thị Hoa",
    receiver_phone: "0934567890",
    address_line: "56 Lý Thường Kiệt",
    ward: "Phường 14",
    district: "Quận 10",
    city: "TP. Hồ Chí Minh",
    is_default: true,
  },
  {
    receiver_name: "Vũ Văn Giang",
    receiver_phone: "0923456789",
    address_line: "90 Nguyễn Trãi",
    ward: "Phường Nguyễn Cư Trinh",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    is_default: true,
  },
  {
    receiver_name: "Bùi Thị Hương",
    receiver_phone: "0945678901",
    address_line: "67 Trường Chinh",
    ward: "Phường Khương Trung",
    district: "Quận Thanh Xuân",
    city: "Hà Nội",
    is_default: true,
  },
  {
    receiver_name: "Tống Minh Khôi",
    receiver_phone: "0967890123",
    address_line: "23 Cách Mạng Tháng 8",
    ward: "Phường 6",
    district: "Quận 3",
    city: "TP. Hồ Chí Minh",
    is_default: true,
  },
];

export async function seedUserAddresses(users) {
  const addresses = [];
  for (let i = 0; i < users.length; i++) {
    const addr = addressData[i];
    const created = await UserAddress.create({
      ...addr,
      user_id: users[i].id,
    });
    addresses.push(created);
  }

  console.log(`✅ Seeded ${addresses.length} user addresses`);
  return addresses;
}
