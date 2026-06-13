import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import { useOrderStore } from "../store/orderStore";
import { formatPrice } from "../utils/format";

const TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const navigate = useNavigate();
  const orders = useOrderStore((s) => s.orders);
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="text-muted hover:text-primary">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-ink dark:text-dark-ink">My Orders</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-primary text-white"
                : "bg-surface dark:bg-dark-surface border border-border dark:border-dark-border text-ink dark:text-dark-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-primary" />
          </div>
          <p className="text-lg font-semibold text-ink dark:text-dark-ink mb-1">No orders here</p>
          <p className="text-sm text-muted mb-5">Orders with this status will appear here.</p>
          <Link to="/search" className="inline-block bg-primary text-white font-semibold rounded-xl px-6 py-2.5 hover:bg-primary-dark transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((order) => (
            <div key={order.id} className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-ink dark:text-dark-ink">{order.orderNumber}</p>
                  <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <ul className="space-y-2 mb-3">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink dark:text-dark-ink line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-ink dark:text-dark-ink shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-border dark:border-dark-border pt-3">
                <span className="text-sm text-muted">Total Payment</span>
                <span className="text-sm font-bold text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
