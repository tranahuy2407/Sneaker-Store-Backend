import {
  Cart,
  CartItem,
  Product,
  ProductImage,
  ProductSize,
} from "../models/index.js";

class CartService {
  // Lấy cart của user
  async getUserCart(userId) {
    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: ProductSize,
              as: "productSize",
              include: [
                {
                  model: Product,
                  as: "product",
                  include: [
                    {
                      model: ProductImage,
                      as: "images",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    return cart;
  }

  // Thêm sản phẩm vào cart
  async addItem(userId, productSizeId, quantity = 1) {
    const cart = await this.getUserCart(userId);

    let item = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_size_id: productSizeId,
      },
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({
        cart_id: cart.id,
        product_size_id: productSizeId,
        quantity,
      });
    }

    return item;
  }

  // Cập nhật số lượng
  async updateItem(userId, productSizeId, quantity) {
    const cart = await this.getUserCart(userId);

    const item = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_size_id: productSizeId,
      },
    });

    if (!item) throw new Error("Item not found in cart");

    if (quantity <= 0) {
      await item.destroy();
      return null;
    }

    item.quantity = quantity;
    await item.save();

    return item;
  }

  // Xóa sản phẩm khỏi cart
  async removeItem(userId, productSizeId) {
    const cart = await this.getUserCart(userId);

    const item = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_size_id: productSizeId,
      },
    });

    if (!item) throw new Error("Item not found in cart");

    await item.destroy();
    return true;
  }

// Xóa toàn bộ cart (có transaction)
async clearCart(userId, transaction = null) {
  const cart = await Cart.findOne({
    where: { user_id: userId },
    transaction,
  });

  if (!cart) return true;

  await CartItem.destroy({
    where: { cart_id: cart.id },
    transaction,
  });

  return true;
}

}

export default new CartService();
