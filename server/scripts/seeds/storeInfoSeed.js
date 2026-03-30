import StoreInfo from "../../models/store_info.model.js";

export async function seedStoreInfo() {
  // Xoá dữ liệu cũ trước
  await StoreInfo.destroy({ where: {} });

  const storeInfo = await StoreInfo.create({
    address: "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    phone: "0901234567",
    email: "contact@sneakerstore.vn",
    map_url:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4656897609!2d106.70192!3d10.77726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzM4LjEiTiAxMDbCsDQyJzA2LjkiRQ!5e0!3m2!1svi!2svn!4v1617000000000!5m2!1svi!2svn",
    working_hours: "Thứ Hai - Chủ Nhật: 08:00 - 22:00",
    facebook_url: "https://facebook.com/sneakerstore.vn",
    instagram_url: "https://instagram.com/sneakerstore.vn",
    logo_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
  });

  console.log(`✅ Seeded store info`);
  return storeInfo;
}
