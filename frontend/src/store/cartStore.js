import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findProduct } from "../data/products";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, quantity, selected }

      addItem: (productId, quantity = 1) => {
        const items = [...get().items];
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({ productId, quantity, selected: true });
        }
        set({ items });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      setQuantity: (productId, quantity) => {
        const items = get().items.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
        );
        set({ items });
      },

      toggleSelected: (productId) => {
        const items = get().items.map((i) =>
          i.productId === productId ? { ...i, selected: !i.selected } : i
        );
        set({ items });
      },

      setAllSelected: (selected) => {
        const items = get().items.map((i) => ({ ...i, selected }));
        set({ items });
      },

      clearSelected: () => {
        set({ items: get().items.filter((i) => !i.selected) });
      },

      // Derived helpers
      getEnrichedItems: () => {
        return get()
          .items.map((i) => ({ ...i, product: findProduct(i.productId) }))
          .filter((i) => i.product);
      },

      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSelectedTotal: () => {
        return get()
          .items.filter((i) => i.selected)
          .reduce((sum, i) => {
            const product = findProduct(i.productId);
            return product ? sum + product.price * i.quantity : sum;
          }, 0);
      },

      getSelectedCount: () => get().items.filter((i) => i.selected).length,
    }),
    { name: "shopi-cart" }
  )
);
