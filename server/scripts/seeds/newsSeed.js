import News from "../../models/news.model.js";

const newsData = [
  {
    title: "Nike Ra Mắt Bộ Sưu Tập Air Max 2025 - Đột Phá Công Nghệ Đệm Khí",
    slug: "nike-ra-mat-bo-suu-tap-air-max-2025",
    summary: "Nike vừa chính thức giới thiệu dòng Air Max 2025 với công nghệ đệm khí hoàn toàn mới, hứa hẹn mang lại trải nghiệm êm ái chưa từng có.",
    content: `<p>Nike vừa chính thức ra mắt bộ sưu tập <strong>Air Max 2025</strong> tại sự kiện thường niên của hãng tại New York. Đây được coi là bước đột phá lớn nhất trong lịch sử dòng Air Max kể từ khi ra đời năm 1987.</p>
<p>Công nghệ Air mới sử dụng buồng khí 360 độ xung quanh toàn bộ đế giày, mang lại độ đệm tối đa và phản lực năng lượng vượt trội. Đặc biệt, phần upper được làm từ vật liệu Flyknit thế hệ mới, nhẹ hơn 20% so với phiên bản trước nhưng vẫn đảm bảo độ bền cao.</p>
<p>Bộ sưu tập này bao gồm 8 phiên bản màu sắc khác nhau, từ những tông màu cổ điển đến những phối màu táo bạo phù hợp với Gen Z. Giá bán dự kiến từ 3.500.000đ đến 4.500.000đ.</p>
<p>Sản phẩm sẽ chính thức có mặt tại các cửa hàng Nike và đối tác ủy quyền từ tháng 4/2025.</p>`,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    author: "Biên Tập Viên Sneaker Store",
    status: "Active",
  },
  {
    title: "Top 10 Đôi Giày Sneaker Được Săn Đón Nhất Năm 2025",
    slug: "top-10-giay-sneaker-duoc-san-don-nhat-nam-2025",
    summary: "Điểm danh những đôi giày sneaker đình đám nhất trong năm 2025, từ các mẫu Air Jordan kinh điển đến những thiết kế đương đại từ Adidas và New Balance.",
    content: `<p>Năm 2025 chứng kiến sự bùng nổ của văn hóa sneaker tại Việt Nam với nhiều mẫu giày được săn lùng ráo riết. Dưới đây là danh sách <strong>Top 10 đôi giày sneaker được yêu thích nhất</strong> theo bình chọn của cộng đồng sneakerhead.</p>
<h3>1. Air Jordan 1 Retro High OG</h3>
<p>Không có gì ngạc nhiên khi Jordan 1 tiếp tục giữ vị trí số 1. Với lịch sử hơn 40 năm và vô số phiên bản colorway đặc sắc...</p>
<h3>2. Nike Dunk Low Panda</h3>
<p>Phối màu đen trắng tối giản nhưng không bao giờ lỗi mốt. Dunk Low Panda là lựa chọn an toàn cho bất kỳ outfit nào...</p>
<h3>3. Adidas Samba OG</h3>
<p>Từ sân bóng đến đường phố, Samba OG đã trở thành biểu tượng của thời trang đường phố đương đại...</p>
<p>Và còn nhiều mẫu giày đặc sắc khác trong danh sách. Bạn đang sở hữu đôi nào trong số này?</p>`,
    image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
    author: "Huy Sneaker Expert",
    status: "Active",
  },
  {
    title: "Hướng Dẫn Vệ Sinh Giày Sneaker Đúng Cách - Giữ Giày Mới Như Ngày Đầu",
    slug: "huong-dan-ve-sinh-giay-sneaker-dung-cach",
    summary: "Bí quyết vệ sinh và bảo quản giày sneaker đúng cách để đôi giày của bạn luôn sạch sẽ, bền đẹp như mới.",
    content: `<p>Giày sneaker là khoản đầu tư đáng giá, vì vậy việc vệ sinh và bảo quản đúng cách rất quan trọng. Dưới đây là <strong>hướng dẫn chi tiết</strong> từ các chuyên gia sneaker.</p>
<h3>Dụng cụ cần chuẩn bị</h3>
<ul>
<li>Bàn chải mềm (loại chuyên dụng cho giày)</li>
<li>Nước sạch và xà phòng nhẹ</li>
<li>Khăn mềm không xơ</li>
<li>Sneaker cleaner chuyên dụng (khuyến nghị)</li>
</ul>
<h3>Các bước vệ sinh cơ bản</h3>
<p><strong>Bước 1:</strong> Tháo dây giày và giặt riêng bằng nước ấm với xà phòng.</p>
<p><strong>Bước 2:</strong> Dùng bàn chải khô quét sạch bụi bẩn thô trên mũi giày và đế.</p>
<p><strong>Bước 3:</strong> Pha loãng sneaker cleaner với nước theo tỉ lệ 1:3.</p>
<p><strong>Bước 4:</strong> Dùng bàn chải mềm nhúng vào dung dịch và chải nhẹ nhàng theo chuyển động tròn.</p>
<p><strong>Bước 5:</strong> Lau sạch với khăn ẩm, sau đó để khô tự nhiên ở nơi thoáng mát.</p>
<h3>Lưu ý quan trọng</h3>
<p>Không bao giờ đặt giày trực tiếp dưới ánh nắng mặt trời hoặc dùng máy sấy để làm khô vì có thể làm biến dạng giày.</p>`,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    author: "Admin Sneaker Store",
    status: "Active",
  },
  {
    title: "Adidas Và Một Kỷ Nguyên Mới: Samba OG Thống Trị Xu Hướng Streetwear 2025",
    slug: "adidas-samba-og-thong-tri-xu-huong-streetwear-2025",
    summary: "Từ sân cỏ đến phố phường, Adidas Samba OG đang làm mưa làm gió trong giới thời trang đường phố Việt Nam và thế giới.",
    content: `<p>Chưa bao giờ chứng kiến một sự hồi sinh mạnh mẽ như Adidas Samba OG trong năm 2024-2025. Đôi giày ra đời từ năm 1950 dành cho các cầu thủ bóng đá, nay đã trở thành biểu tượng thời trang được yêu thích nhất.</p>
<p>Samba OG sở hữu thiết kế T-toe đặc trưng, lưỡi gà rộng và đế gum cao su màu nâu mang lại cảm giác nostalgia đặc biệt. Phối màu trắng đen cổ điển kết hợp với 3 sọc Adidas trở thành công thức không thể sai lầm.</p>
<h3>Vì Sao Samba Lại Thành Công Như Vậy?</h3>
<p>Các chuyên gia thời trang lý giải rằng, trong thế giới đầy biến động, người tiêu dùng tìm đến những thứ quen thuộc và đáng tin cậy. Samba mang lại cảm giác hoài niệm trong khi vẫn trông rất hiện đại.</p>
<p>Tại Việt Nam, Samba được giới young professionals và creative đặc biệt ưa chuộng. Nhiều sneakerhead đã sở hữu đến 5-6 đôi Samba với các màu sắc khác nhau.</p>`,
    image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800",
    author: "Fashion Editor",
    status: "Active",
  },
  {
    title: "Phân Biệt Giày Thật Giả: Cách Nhận Biết Sneaker Authentic Vs Replica",
    slug: "phan-biet-giay-that-gia-sneaker-authentic-vs-replica",
    summary: "Hướng dẫn chi tiết cách phân biệt giày sneaker chính hãng và hàng nhái, giúp bạn mua sắm thông minh và tránh bị lừa.",
    content: `<p>Thị trường giày nhái ngày càng tinh vi khiến nhiều người thật sự khó phân biệt. Bài viết này cung cấp những tiêu chí quan trọng nhất để nhận biết giày authentic.</p>
<h3>1. Kiểm Tra Từ Nhà Sản Xuất</h3>
<p>Mỗi đôi giày Nike và Adidas chính hãng đều có style code trên hộp và trong giày. Bạn có thể tra cứu style code này trên website chính thức của hãng để xác nhận tính xác thực.</p>
<h3>2. Chất Lượng Đường May</h3>
<p>Giày thật có đường may đều đặn, không xổ chỉ, không lỗi. Giày nhái thường có đường may không đều, khoảng cách giữa các mũi chỉ khác nhau.</p>
<h3>3. Trọng Lượng Và Vật Liệu</h3>
<p>Giày thật thường nhẹ hơn và vật liệu mềm mại hơn giày nhái. Đế giày thật đàn hồi tốt, trong khi giày nhái thường cứng hơn.</p>
<h3>4. Mua Từ Nguồn Uy Tín</h3>
<p>Cách an toàn nhất là mua tại cửa hàng ủy quyền chính thức hoặc những shop sneaker có uy tín lâu năm như Sneaker Store.</p>`,
    image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
    author: "Sneaker Expert",
    status: "Active",
  },
  {
    title: "New Balance 1906R - Mẫu Giày Đang Gây Bão Cộng Đồng Sneaker 2025",
    slug: "new-balance-1906r-gay-bao-cong-dong-sneaker-2025",
    summary: "New Balance 1906R trở thành hiện tượng của năm 2025 với thiết kế chunky đặc trưng và sự kết hợp hoàn hảo giữa retro và hiện đại.",
    content: `<p>New Balance 1906R đang là câu chuyện được nhắc đến nhiều nhất trong cộng đồng sneaker Việt Nam. Mẫu giày này kế thừa di sản từ 1906D huyền thoại với nhiều cải tiến đáng kể.</p>
<p>Điểm nổi bật nhất của 1906R là sự kết hợp giữa phần upper da lộn/da bóng truyền thống và công nghệ đế ABZORB + NDurance hiện đại. Kết quả là một đôi giày vừa mang vẻ đẹp retro vừa có hiệu năng thực sự ấn tượng.</p>
<p>Về mặt thời trang, 1906R hoàn toàn phù hợp với xu hướng <em>"Dad Shoe"</em> đang thịnh hành - những đôi giày có đế dày chunky, cồng kềnh nhưng lại tạo ra vẻ thẩm mỹ độc đáo.</p>
<p>Giá tham khảo tại thị trường Việt Nam: 3.200.000 - 3.800.000đ tùy phiên bản màu sắc.</p>`,
    image_url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800",
    author: "Sneaker Columnist",
    status: "Active",
  },
  {
    title: "Xu Hướng Phối Đồ Cùng Giày Sneaker Mùa Hè 2025",
    slug: "xu-huong-phoi-do-cung-giay-sneaker-mua-he-2025",
    summary: "Khám phá những xu hướng phối đồ cùng giày sneaker hot nhất mùa hè 2025, từ street style đến smart casual.",
    content: `<p>Mùa hè 2025 mang đến nhiều xu hướng thú vị trong cách phối đồ cùng giày sneaker. Dù bạn là tín đồ của street style hay ưa phong cách tối giản, đều có công thức phù hợp cho bạn.</p>
<h3>1. Monochrome Look</h3>
<p>Phong cách đơn sắc từ đầu đến chân đang là trend cực hot. Chọn một màu chủ đạo và phối toàn bộ outfit theo tone đó, bao gồm cả giày sneaker.</p>
<h3>2. Giày Trắng + Quần Short + Áo Thun Oversized</h3>
<p>Công thức bất bại cho mùa hè - đơn giản, thoải mái và luôn trông ổn. Nike Air Force 1 hoặc Adidas Superstar là những lựa chọn hoàn hảo.</p>
<h3>3. Smart Casual - Quần Tây Slim + Sneaker</h3>
<p>Xu hướng mix sneaker vào trang phục công sở casual ngày càng phổ biến. New Balance 990 hoặc Converse Chuck 70 là những đôi sneaker đủ tinh tế để phối cùng quần tây.</p>
<h3>4. Y2K Revival</h3>
<p>Phong cách những năm 2000 đang trở lại mạnh mẽ. Quần ống đứng, áo baby tee và giày chunky như Puma RS-X là sự kết hợp hoàn hảo.</p>`,
    image_url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
    author: "Fashion Stylist",
    status: "Active",
  },
  {
    title: "Jordan Brand Công Bố Kế Hoạch Ra Mắt 20 Colorway Mới Trong Năm 2025",
    slug: "jordan-brand-ke-hoach-ra-mat-20-colorway-moi-2025",
    summary: "Jordan Brand vừa tiết lộ kế hoạch phát hành đầy tham vọng với 20 colorway mới cho Air Jordan 1, 3, 4 và 11 trong năm 2025.",
    content: `<p>Jordan Brand vừa chính thức công bố lịch phát hành đầy tham vọng cho năm 2025 tại sự kiện All-Star Weekend. Với hơn 20 colorway mới được lên kế hoạch, đây sẽ là một năm cực kỳ sôi động cho cộng đồng Jordan head.</p>
<h3>Những Highlight Đáng Chú Ý</h3>
<p><strong>Air Jordan 1 High OG "Chicago Reimagined"</strong> - Phiên bản tái sinh của colorway huyền thoại Chicago với một số chi tiết cải tiến cho phù hợp với thị hiếu đương đại. Dự kiến ra mắt tháng 6/2025.</p>
<p><strong>Air Jordan 3 "Green Glow"</strong> - Lần đầu tiên Jordan 3 được phối cùng màu xanh lá neon táo bạo. Dự kiến ra mắt tháng 8/2025.</p>
<p><strong>Air Jordan 11 "Gratitude"</strong> - Phiên bản đặc biệt kỷ niệm 30 năm Jordan 11. Dự kiến drop vào dịp Giáng sinh 2025.</p>
<p>Đặt thông báo từ bây giờ để không bỏ lỡ những đôi giày hot nhất năm!</p>`,
    image_url: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800",
    author: "Jordan Brand Reporter",
    status: "Active",
  },
  {
    title: "Sneaker Store Khai Trương Chi Nhánh Mới Tại Hà Nội",
    slug: "sneaker-store-khai-truong-chi-nhanh-moi-tai-ha-noi",
    summary: "Sneaker Store chính thức mở rộng ra thị trường miền Bắc với chi nhánh mới tại trung tâm Hà Nội, hứa hẹn mang đến trải nghiệm mua sắm tuyệt vời cho khách hàng.",
    content: `<p>Chúng tôi vô cùng vui mừng thông báo <strong>Sneaker Store</strong> chính thức khai trương chi nhánh mới tại <strong>45 Hàng Bài, Quận Hoàn Kiếm, Hà Nội</strong> vào ngày 15/04/2025.</p>
<p>Chi nhánh mới có diện tích hơn 500m², trưng bày hơn 500 mẫu giày sneaker đến từ các thương hiệu hàng đầu thế giới: Nike, Adidas, Jordan, New Balance, Puma, Converse, Vans và nhiều thương hiệu khác.</p>
<h3>Ưu Đãi Khai Trương</h3>
<p>Trong 7 ngày đầu khai trương (15-21/04/2025), khách hàng sẽ được hưởng:</p>
<ul>
<li>Giảm 15% toàn bộ sản phẩm</li>
<li>Tặng quà cho 100 khách đầu tiên mỗi ngày</li>
<li>Free cleaning service cho mọi đôi giày mua tại store</li>
<li>Tặng sneaker care kit trị giá 200.000đ cho đơn hàng từ 2.000.000đ</li>
</ul>
<p>Đừng bỏ lỡ cơ hội sở hữu những đôi giày mơ ước với giá ưu đãi!</p>`,
    image_url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
    author: "Sneaker Store",
    status: "Active",
  },
  {
    title: "Review Chi Tiết: Vans Sk8-Hi Có Thực Sự Xứng Đáng Với Giá Tiền?",
    slug: "review-vans-sk8-hi-co-xung-dang-voi-gia-tien",
    summary: "Đánh giá toàn diện về Vans Sk8-Hi - từ thiết kế, chất liệu, độ bền đến sự thoải mái khi đi - để giúp bạn quyết định có nên mua hay không.",
    content: `<p>Vans Sk8-Hi là một trong những mẫu giày cổ cao được yêu thích nhất thế giới. Nhưng liệu nó có thực sự xứng đáng với mức giá? Hãy cùng tìm hiểu chi tiết.</p>
<h3>Thiết Kế (9/10)</h3>
<p>Sk8-Hi mang thiết kế cổ cao đặc trưng của Vans với sọc Side Stripe biểu tượng. Phần upper kết hợp da lộn và canvas mang lại vẻ ngoài thô ráp, cá tính - hoàn hảo cho những ai yêu thích phong cách skate và streetwear.</p>
<h3>Chất Liệu Và Độ Bền (8/10)</h3>
<p>Upper da lộn chất lượng tốt, có thể chống được các va chạm nhỏ. Đế WaffleSole đặc trưng của Vans bám đường rất tốt. Tuy nhiên phần canvas có thể bị bẩn nhanh nếu không được bảo quản đúng cách.</p>
<h3>Sự Thoải Mái (7/10)</h3>
<p>Đây là điểm yếu nhỏ của Sk8-Hi. Giày khá cứng khi mới đi, cần thời gian "break in" khoảng 1-2 tuần. Sau đó sẽ cảm thấy thoải mái hơn nhiều.</p>
<h3>Kết Luận</h3>
<p>Với mức giá khoảng 1.700.000 - 1.900.000đ, Vans Sk8-Hi là một lựa chọn xứng đáng nếu bạn yêu thích phong cách skate/streetwear. Không tốt bằng giày chạy bộ về mặt êm ái, nhưng về style thì khó có đôi nào cạnh tranh được.</p>
<p><strong>Điểm tổng:</strong> 8/10 - Highly Recommended!</p>`,
    image_url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800",
    author: "Product Reviewer",
    status: "Active",
  },
];

export async function seedNews() {
  const newsItems = await News.bulkCreate(newsData);
  console.log(`✅ Seeded ${newsItems.length} news articles`);
  return newsItems;
}
