import Favorite from "../../models/favorite.model.js";
import RecentlyViewed from "../../models/recently_viewed.model.js";

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function seedFavorites(users, products) {
  const favorites = [];

  for (const user of users) {
    // Mỗi user yêu thích 2-5 sản phẩm
    const count = Math.floor(Math.random() * 4) + 2;
    const usedProductIds = new Set();

    for (let i = 0; i < count; i++) {
      let product;
      do {
        product = randomItem(products);
      } while (usedProductIds.has(product.id));
      usedProductIds.add(product.id);

      const fav = await Favorite.create({
        user_id: user.id,
        product_id: product.id,
      });
      favorites.push(fav);
    }
  }

  console.log(`✅ Seeded ${favorites.length} favorites`);
  return favorites;
}

export async function seedRecentlyViewed(users, products) {
  const recentlyViewed = [];

  for (const user of users) {
    // Mỗi user đã xem 3-7 sản phẩm gần đây
    const count = Math.floor(Math.random() * 5) + 3;
    const usedProductIds = new Set();

    for (let i = 0; i < count; i++) {
      let product;
      do {
        product = randomItem(products);
      } while (usedProductIds.has(product.id));
      usedProductIds.add(product.id);

      const viewed = await RecentlyViewed.create({
        user_id: user.id,
        product_id: product.id,
      });
      recentlyViewed.push(viewed);
    }
  }

  console.log(`✅ Seeded ${recentlyViewed.length} recently viewed records`);
  return recentlyViewed;
}
