import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS } from "../data/products";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      productIds: [],

      toggle: (productId) => {
        const ids = get().productIds;
        if (ids.includes(productId)) {
          set({ productIds: ids.filter((id) => id !== productId) });
        } else {
          set({ productIds: [...ids, productId] });
        }
      },

      remove: (productId) => {
        set({ productIds: get().productIds.filter((id) => id !== productId) });
      },

      isWishlisted: (productId) => get().productIds.includes(productId),

      getItems: () => {
        const ids = get().productIds;
        return PRODUCTS.filter((p) => ids.includes(p.id));
      },
    }),
    { name: "shopi-wishlist" }
  )
);
