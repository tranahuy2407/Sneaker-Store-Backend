import CartService from "../services/cart.service.js";

class CartController {
  // Lấy cart của user
  async getCart(req, res) {
    try {
      const userId = req.user.id;
      const cart = await CartService.getUserCart(userId);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Thêm sản phẩm vào cart
  async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { productSizeId, quantity = 1 } = req.body;

      if (!productSizeId) {
        return res.status(400).json({
          message: "Chưa chọn size",
        });
      }

      const item = await CartService.addItem(
        userId,
        Number(productSizeId),
        Number(quantity)
      );

      res.json(item);
    } catch (err) {
      console.error("ADD CART ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }

  // Cập nhật số lượng
  async updateCartItem(req, res) {
    try {
      const userId = req.user.id;
      const { productSizeId, quantity } = req.body;

      if (!productSizeId) {
        return res.status(400).json({
          message: "Thiếu productSizeId",
        });
      }

      const item = await CartService.updateItem(
        userId,
        Number(productSizeId),
        Number(quantity)
      );

      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Xóa 1 item khỏi cart
async removeCartItem(req, res) {
  try {
    const userId = req.user.id;
    const { productSizeId } = req.params;

    if (!productSizeId || isNaN(productSizeId)) {
      return res.status(400).json({
        message: "productSizeId không hợp lệ",
      });
    }


    await CartService.removeItem(
      userId,
      Number(productSizeId)
    );

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
}

  // Xóa toàn bộ cart
  async clearCart(req, res) {
    try {
      const userId = req.user.id;

      await CartService.clearCart(userId);

      res.json({
        success: true,
        message: "Cart cleared",
      });
    } catch (err) {
      console.error("CLEAR CART ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
}

export default new CartController();
