import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useOrderStore } from "../../store/orderStore";
import { formatPrice } from "../../utils/format";

const STATUSES = ["all", "pending", "paid", "shipped", "delivered", "cancelled"];

const STATUS_PILL = {
  pending:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  paid:      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  shipped:   "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const STATUS_FLOW = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const orders           = useOrderStore((s) => s.orders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch]             = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  const sorted = useMemo(() => {
    let list = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filterStatus !== "all") list = list.filter((o) => o.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.address?.name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, filterStatus, search]);

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-ink dark:text-dark-ink">Orders</h1>
        <p className="text-sm text-muted">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-3 flex-1 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl px-4 shadow-card overflow-hidden">
          <Search size={15} className="text-muted shrink-0" />
          <input
            type="text" placeholder="Search by order number or customer..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 text-sm bg-transparent text-ink dark:text-dark-ink outline-none placeholder:text-muted"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                filterStatus === s ? "bg-primary text-white" : "bg-surface dark:bg-dark-surface border border-border dark:border-dark-border text-ink dark:text-dark-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-dark-border text-xs text-muted uppercase tracking-wide bg-bg dark:bg-dark-bg">
                <th className="px-5 py-3 text-left">Order</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Items</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-dark-border">
              {sorted.map((order) => (
                <tr key={order.id} className="hover:bg-bg dark:hover:bg-dark-bg transition-colors">
                  <td className="px-5 py-3 font-medium text-ink dark:text-dark-ink whitespace-nowrap">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-ink dark:text-dark-ink">{order.address?.name || "—"}</p>
                    <p className="text-xs text-muted">{order.address?.phone || ""}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover border-2 border-surface dark:border-dark-surface"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <span className="w-8 h-8 rounded-lg bg-bg dark:bg-dark-bg border-2 border-surface dark:border-dark-surface flex items-center justify-center text-[10px] font-bold text-muted">
                          +{order.items.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-ink dark:text-dark-ink whitespace-nowrap">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-3">
                    {/* Status dropdown */}
                    <div className="relative flex justify-center">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                        className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_PILL[order.status]} cursor-pointer`}
                      >
                        {order.status}
                        <ChevronDown size={10} />
                      </button>

                      {openDropdown === order.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                          <div className="absolute top-8 right-0 z-20 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl shadow-premium py-1 min-w-[130px] animate-scaleIn">
                            {STATUS_FLOW.map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  updateOrderStatus(order.id, s);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-xs capitalize hover:bg-bg dark:hover:bg-dark-bg transition-colors font-medium ${order.status === s ? "text-primary" : "text-ink dark:text-dark-ink"}`}
                              >
                                {s}
                                {order.status === s && " ✓"}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
