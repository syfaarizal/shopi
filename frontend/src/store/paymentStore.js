import { create } from "zustand";

function randomDigits(n) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
}

const BANK_NAMES = ["BCA", "BNI", "Mandiri", "BRI"];
const EWALLET_NAMES = ["GoPay", "OVO", "DANA", "ShopeePay"];

export const usePaymentStore = create((set, get) => ({
  payments: {}, // keyed by orderId

  initPayment: (orderId, { method, amount }) => {
    const existing = get().payments[orderId];
    if (existing) return existing;

    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    let details = { orderId, method, amount, status: "pending", expiresAt };

    if (method === "bank_transfer") {
      details.bankName = BANK_NAMES[Math.floor(Math.random() * BANK_NAMES.length)];
      details.virtualAccount = "8877" + randomDigits(9);
    } else if (method === "ewallet") {
      details.ewalletName = EWALLET_NAMES[Math.floor(Math.random() * EWALLET_NAMES.length)];
      details.qrToken = "QR" + Math.random().toString(36).slice(2, 14).toUpperCase();
    } else if (method === "card") {
      details.processor = "Sandbox Processor";
    }

    set((s) => ({ payments: { ...s.payments, [orderId]: details } }));
    return details;
  },

  getPayment: (orderId) => get().payments[orderId] || null,

  confirmPayment: (orderId) => {
    set((s) => ({
      payments: {
        ...s.payments,
        [orderId]: s.payments[orderId]
          ? { ...s.payments[orderId], status: "paid" }
          : s.payments[orderId],
      },
    }));
  },
}));
