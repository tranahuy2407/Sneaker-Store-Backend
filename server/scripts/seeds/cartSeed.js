import Cart from "../../models/cart.model.js";
import CartItem from "../../models/cartItem.model.js";
import ProductSize from "../../models/product_size.model.js";

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function seedCarts(users, products) {
  const carts = [];

  for (const user of users) {
    // Tạo cart cho mỗi user
    const cart = await Cart.create({ user_id: user.id });

    // Thêm 1-4 sản phẩm vào cart
    const numItems = randomInt(1, 4);
    const usedProductIds = new Set();

    for (let i = 0; i < numItems; i++) {
      let product;
      do {
        product = randomItem(products);
      } while (usedProductIds.has(product.id));
      usedProductIds.add(product.id);

      // Lấy một size ngẫu nhiên của sản phẩm
      const sizes = await ProductSize.findAll({ where: { product_id: product.id } });
      if (!sizes.length) continue;
      const size = randomItem(sizes);

      await CartItem.create({
        cart_id: cart.id,
        product_size_id: size.id,
        quantity: randomInt(1, 3),
      });
    }

    carts.push(cart);
  }

  console.log(`✅ Seeded ${carts.length} carts with cart items`);
  return carts;
}
