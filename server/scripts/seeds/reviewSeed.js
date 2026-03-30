import Review from "../../models/review.model.js";

const reviewTexts = [
  "Giày đẹp lắm, chất lượng tốt, đi rất êm chân. Sẽ ủng hộ shop lần sau!",
  "Hàng chính hãng, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận.",
  "Mình rất hài lòng với sản phẩm này. Da mềm, đế bền, đi cả ngày không mỏi.",
  "Sản phẩm ok, giá hợp lý. Ship nhanh, seller nhiệt tình.",
  "Giày đẹp nhưng size hơi nhỏ, đặt size to hơn so với bình thường nhé.",
  "Chất lượng vượt trội so với giá tiền. Mình đặt mua thêm cho người thân.",
  "Đóng gói rất cẩn thận, giày không bị trầy xước. Rất hài lòng.",
  "Thiết kế đẹp, màu sắc chuẩn như ảnh. Đi nhẹ nhàng, thoải mái.",
  "Mua lần 2 ở shop rồi, lần nào cũng hài lòng. Recommend cho mọi người!",
  "Giày authentic 100%, có hộp đầy đủ. Shop tư vấn nhiệt tình.",
  "Giày đẹp nhưng giao hàng hơi lâu. Chất lượng thì ổn.",
  "Rất hài lòng về chất lượng sản phẩm. Sẽ tiếp tục mua hàng ở đây.",
  "Mua làm quà tặng bạn, bạn rất thích. Cảm ơn shop!",
  "Giày đúng hàng, đúng size. Đi thử rất êm, không đau chân.",
  "Chất lượng tốt, giá cả phải chăng. Shop đáng tin cậy.",
];

const ratings = [5, 5, 5, 4, 4, 4, 5, 3, 5, 4, 3, 5, 4, 5, 4];

export async function seedReviews(users, products) {
  const reviews = [];

  for (let i = 0; i < 40; i++) {
    const user = users[i % users.length];
    const product = products[i % products.length];
    const textIdx = i % reviewTexts.length;

    const pastDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);

    const review = await Review.create({
      user_id: user.id,
      product_id: product.id,
      content: reviewTexts[textIdx],
      rating: ratings[textIdx],
      created_at: pastDate,
      updated_at: pastDate,
    });

    reviews.push(review);
  }

  console.log(`✅ Seeded ${reviews.length} reviews`);
  return reviews;
}
