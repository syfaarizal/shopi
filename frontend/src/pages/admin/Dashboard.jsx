import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, ShoppingBag, Package, Users,
  ChevronRight, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { useOrderStore } from "../../store/orderStore";
import { useProductStore } from "../../store/productStore";
import { useAuthStore } from "../../store/authStore";
import { formatPrice } from "../../utils/format";

const STATUS_PILL = {
  pending:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  paid:      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  shipped:   "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export default function Dashboard() {
  const orders   = useOrderStore((s) => s.orders);
  const products = useProductStore((s) => s.getAllProducts());
  const users    = useAuthStore((s) => s.getAllUsers());

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    [orders]
  );

  // Simple monthly revenue for last 6 months
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return { label: d.toLocaleString("default", { month: "short" }), total: 0 };
    });
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const d = new Date(o.createdAt);
      const now = new Date();
      const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diffMonths >= 0 && diffMonths < 6) months[5 - diffMonths].total += o.total;
    });
    return months;
  }, [orders]);

  const maxRevenue = Math.max(...monthlyData.map((m) => m.total), 1);

  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 7);

  const STATS = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
      trend: "+12.5%",
      up: true,
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      trend: "+8.2%",
      up: true,
    },
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      trend: "+3",
      up: true,
    },
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      trend: "-2.1%",
      up: false,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-ink dark:text-dark-ink">Dashboard</h1>
        <p className="text-sm text-muted mt-0.5">Welcome back — here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, trend, up }) => (
          <div key={label} className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-5">
            <div className="flex items-start justify-between mb-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </span>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-600" : "text-primary"}`}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {trend}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-ink dark:text-dark-ink">{value}</p>
            <p className="text-xs text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue bar chart */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-ink dark:text-dark-ink">Monthly Revenue</h2>
          <span className="text-xs text-muted">Last 6 months</span>
        </div>
        <div className="flex items-end gap-3 h-36">
          {monthlyData.map((m) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1.5 group">
              <span className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatPrice(m.total)}
              </span>
              <div className="w-full relative rounded-t-lg overflow-hidden bg-bg dark:bg-dark-bg" style={{ height: "100px" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-500"
                  style={{ height: `${(m.total / maxRevenue) * 100}%`, minHeight: m.total > 0 ? "4px" : "0" }}
                />
              </div>
              <p className="text-[10px] text-muted font-medium">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-dark-border">
          <h2 className="text-sm font-bold text-ink dark:text-dark-ink">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
            View all <ChevronRight size={13} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-dark-border text-xs text-muted uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Order</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-dark-border">
              {recent.map((order) => (
                <tr key={order.id} className="hover:bg-bg dark:hover:bg-dark-bg transition-colors">
                  <td className="px-5 py-3 font-medium text-ink dark:text-dark-ink">{order.orderNumber}</td>
                  <td className="px-5 py-3 text-muted">{order.address?.name || "—"}</td>
                  <td className="px-5 py-3 text-muted whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-ink dark:text-dark-ink">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_PILL[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
