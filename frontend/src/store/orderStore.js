import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS } from "../data/products";

const SHIPPING_COSTS = { regular: 0, express: 15000 };

const DEMO_ADDRESS = {
  id: "addr-1", label: "Home", name: "Budi Santoso",
  phone: "0812-3456-7890",
  fullAddress: "Jl. Merdeka No. 10, RT 01/RW 02, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta, 10310",
  isDefault: true,
};

function demoOrder(daysAgo, status, productIds, paymentMethod) {
  const items = productIds.map((id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return { productId: p.id, name: p.name, image: p.images[0], price: p.price, quantity: 1 };
  });
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id: "demo-order-" + daysAgo + "-" + status,
    orderNumber: `INV/${date.toISOString().slice(0, 10).replace(/-/g, "/")}/${10000 + daysAgo * 137}`,
    items, address: DEMO_ADDRESS, shippingMethod: "regular", shippingCost: 0,
    paymentMethod, voucher: null, subtotal, total: subtotal,
    status, createdAt: date.toISOString(),
  };
}

const DEMO_ORDERS = [
  demoOrder(1,  "pending",   ["p2"],       "bank_transfer"),
  demoOrder(3,  "paid",      ["p4", "p1"], "ewallet"),
  demoOrder(7,  "shipped",   ["p6"],       "card"),
  demoOrder(14, "delivered", ["p17","p21"],"bank_transfer"),
  demoOrder(20, "cancelled", ["p9"],       "ewallet"),
];

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: DEMO_ORDERS,

      createOrder: ({ items, address, shippingMethod, paymentMethod, voucher }) => {
        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const shippingCost = SHIPPING_COSTS[shippingMethod] ?? 0;
        const total = subtotal + shippingCost;
        const order = {
          id: "order-" + Date.now(),
          orderNumber: `INV/${new Date().toISOString().slice(0, 10).replace(/-/g, "/")}/${Math.floor(10000 + Math.random() * 89999)}`,
          items, address, shippingMethod, shippingCost, paymentMethod,
          voucher: voucher || null, subtotal, total,
          status: "pending",     // ← starts as pending, payment page confirms to "paid"
          createdAt: new Date().toISOString(),
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },

      // ← NEW: update status (used by Payment page and Admin dashboard)
      updateOrderStatus: (id, status) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }));
      },

      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "shopi-orders" }
  )
);

export { SHIPPING_COSTS };
