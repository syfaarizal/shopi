import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS } from "../data/products";

/**
 * Admin product store — sits on top of the base mock catalog.
 * - customProducts: products added by admin
 * - editedProducts: overrides for base products {[id]: partialProduct}
 * - deletedIds: base products removed by admin
 */
export const useProductStore = create(
  persist(
    (set, get) => ({
      customProducts: [],
      editedProducts: {},
      deletedIds: [],

      /** Merge base catalog with admin changes */
      getAllProducts: () => {
        const { customProducts, deletedIds, editedProducts } = get();
        const base = PRODUCTS.filter((p) => !deletedIds.includes(p.id)).map((p) =>
          editedProducts[p.id] ? { ...p, ...editedProducts[p.id] } : p
        );
        return [...customProducts, ...base];
      },

      addProduct: (product) => {
        const newProduct = {
          id: "custom-" + Date.now(),
          slug: product.name.toLowerCase().replace(/\s+/g, "-"),
          rating: 0,
          reviewCount: 0,
          sold: 0,
          isFlashSale: false,
          images: [],
          ...product,
          price: Number(product.price),
          originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
          discount: product.discount ? Number(product.discount) : null,
          stock: Number(product.stock),
        };
        set((s) => ({ customProducts: [newProduct, ...s.customProducts] }));
        return newProduct;
      },

      updateProduct: (id, updates) => {
        const isCustom = get().customProducts.some((p) => p.id === id);
        if (isCustom) {
          set((s) => ({
            customProducts: s.customProducts.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          }));
        } else {
          set((s) => ({
            editedProducts: {
              ...s.editedProducts,
              [id]: { ...(s.editedProducts[id] || {}), ...updates },
            },
          }));
        }
      },

      deleteProduct: (id) => {
        const isCustom = get().customProducts.some((p) => p.id === id);
        if (isCustom) {
          set((s) => ({
            customProducts: s.customProducts.filter((p) => p.id !== id),
          }));
        } else {
          set((s) => ({ deletedIds: [...s.deletedIds, id] }));
        }
      },

      resetAll: () => set({ customProducts: [], editedProducts: {}, deletedIds: [] }),
    }),
    { name: "shopi-admin-products" }
  )
);
