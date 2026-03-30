import Contact from "../../models/contact.model.js";

const contactData = [
  {
    name: "Nguyễn Minh Tuấn",
    email: "nguyenminhtuan@gmail.com",
    phone: "0912345678",
    subject: "Hỏi về chính sách đổi trả hàng",
    message: "Chào shop, tôi muốn hỏi về chính sách đổi trả. Tôi mua giày size 42 nhưng đi hơi chật, tôi có thể đổi sang size 43 không? Thời hạn đổi trả là bao lâu?",
    status: "replied",
  },
  {
    name: "Trần Thị Thanh Huyền",
    email: "tranthithanhuyen@gmail.com",
    phone: "0987654321",
    subject: "Yêu cầu tư vấn sản phẩm Nike Air Force 1",
    message: "Shop ơi, tôi đang quan tâm đến Nike Air Force 1 Low bản trắng. Hiện tại shop còn size 38 không? Giày có đúng size không hay nên lên size? Cảm ơn shop!",
    status: "replied",
  },
  {
    name: "Lê Văn Đức",
    email: "levanduc@gmail.com",
    phone: "0901234567",
    subject: "Phản hồi về đơn hàng bị giao trễ",
    message: "Tôi đặt hàng ngày 20/3 nhưng đến hôm nay vẫn chưa nhận được. Mã đơn hàng ORD240320001. Shop có thể kiểm tra giúp tôi không? Tôi cần giày gấp để đi dự sự kiện.",
    status: "read",
  },
  {
    name: "Phạm Thị Kim Anh",
    email: "phamthikimanh@gmail.com",
    phone: "0978901234",
    subject: "Hỏi về chương trình khuyến mãi",
    message: "Xin chào, tôi muốn hỏi về chương trình sale hiện tại của shop. Coupon SUMMER20 có áp dụng cho giày Nike không? Minimum order là bao nhiêu?",
    status: "replied",
  },
  {
    name: "Hoàng Đình Phúc",
    email: "hoangdinhphuc@gmail.com",
    phone: "0956789012",
    subject: "Yêu cầu hóa đơn VAT",
    message: "Tôi cần xuất hóa đơn VAT cho đơn hàng gần nhất của mình phục vụ mục đích thanh toán công ty. Thông tin công ty: Công ty TNHH ABC, MST: 0123456789. Shop xử lý trong bao lâu?",
    status: "read",
  },
  {
    name: "Vũ Thị Hồng Nhung",
    email: "vuthihongnhung@gmail.com",
    phone: "0934567890",
    subject: "Hỏi về tình trạng hàng giới hạn",
    message: "Jordan 1 Bred phiên bản retro high shop có không? Nếu có giá bao nhiêu và ship ra Hà Nội mất bao lâu? Mình đang rất cần tìm đôi này.",
    status: "new",
  },
  {
    name: "Đặng Minh Hiếu",
    email: "dangminhhieu@gmail.com",
    phone: "0923456789",
    subject: "Góp ý cải thiện website",
    message: "Shop ơi, mình thấy website khá đẹp nhưng phần tìm kiếm hơi chậm. Ngoài ra mình muốn có thể lọc giày theo nhiều tiêu chí cùng lúc như màu sắc + size + giá. Hy vọng shop cải thiện sớm!",
    status: "read",
  },
  {
    name: "Ngô Thị Bảo Châu",
    email: "ngothibaochau@gmail.com",
    phone: "0945678901",
    subject: "Hỏi về bảo hành sản phẩm",
    message: "Đôi Adidas Ultraboost tôi mua 3 tháng trước đang bị bong đế bên phải. Shop có hỗ trợ bảo hành không? Tôi cần mang giày đến trực tiếp hay ship về?",
    status: "replied",
  },
  {
    name: "Tống Văn Khánh",
    email: "tongvankhanh@gmail.com",
    phone: "0967890123",
    subject: "Hỏi về chương trình affiliate",
    message: "Tôi là KOL với 50K followers trên Instagram chuyên về sneaker. Shop có chương trình hợp tác affiliate không? Tôi muốn giới thiệu sản phẩm của shop đến followers của mình.",
    status: "new",
  },
  {
    name: "Bùi Thị Thu Hà",
    email: "buithithuha@gmail.com",
    phone: "0989012345",
    subject: "Khiếu nại nhận được hàng khác",
    message: "Tôi đặt Nike Dunk Low Panda nhưng nhận được hộp bên trong là Dunk Low màu khác. Mã đơn ORD240315002. Tôi cần được đổi đúng sản phẩm đã đặt. Rất mong shop xử lý nhanh!",
    status: "replied",
  },
  {
    name: "Lý Minh Quân",
    email: "lyminhquan@gmail.com",
    phone: "0912098765",
    subject: "Hỏi mua số lượng lớn",
    message: "Shop có chính sách giá sỉ không? Tôi muốn mua 20-30 đôi giày các loại phục vụ đội bóng. Có thể thương lượng giá và giao hàng không?",
    status: "new",
  },
  {
    name: "Nguyễn Văn Tú",
    email: "nguyenvantu@gmail.com",
    phone: "0976543210",
    subject: "Hỏi về phương thức thanh toán trả góp",
    message: "Shop có hỗ trợ mua trả góp 0% lãi suất không? Tôi muốn mua một đôi Jordan giá khoảng 6-7 triệu nhưng chưa đủ tiền một lúc. Nếu có, điều kiện là gì?",
    status: "new",
  },
];

export async function seedContacts() {
  const contacts = await Contact.bulkCreate(contactData);
  console.log(`✅ Seeded ${contacts.length} contacts`);
  return contacts;
}
