import { useParams, Link, Navigate } from "react-router-dom";
import { CheckCircle2, FileText, ShoppingBag } from "lucide-react";
import { useOrderStore } from "../store/orderStore";
import { formatPrice } from "../utils/format";

export default function OrderSuccess() {
  const { id } = useParams();
  const order = useOrderStore((s) => s.getOrder(id));

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const paymentLabels = {
    bank_transfer: "Bank Transfer",
    ewallet: "E-Wallet",
    card: "Credit / Debit Card",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border shadow-premium p-8 text-center animate-scaleIn">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={44} className="text-primary" />
        </div>
        <h1 className="text-xl font-extrabold text-ink dark:text-dark-ink mb-1">Order Placed Successfully!</h1>
        <p className="text-sm text-muted mb-6">
          Thank you for shopping with Shopi. Your order is being processed.
        </p>

        <div className="bg-bg dark:bg-dark-bg rounded-xl p-4 text-left space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-muted">Order Number</span>
            <span className="font-semibold text-ink dark:text-dark-ink">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Total Payment</span>
            <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Payment Method</span>
            <span className="font-semibold text-ink dark:text-dark-ink">{paymentLabels[order.paymentMethod]}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 w-full border-2 border-primary text-primary font-semibold rounded-xl py-3 hover:bg-primary/5 transition-colors"
          >
            <FileText size={18} /> View Order Details
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-primary text-white font-semibold rounded-xl py-3 hover:bg-primary-dark transition-colors"
          >
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
