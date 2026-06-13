import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag, Ticket } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { formatPrice } from "../utils/format";

export default function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.getEnrichedItems());
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const toggleSelected = useCartStore((s) => s.toggleSelected);
  const setAllSelected = useCartStore((s) => s.setAllSelected);
  const selectedTotal = useCartStore((s) => s.getSelectedTotal());
  const selectedCount = useCartStore((s) => s.getSelectedCount());

  const [voucherInput, setVoucherInput] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(null);
  const [voucherError, setVoucherError] = useState("");

  const allSelected = items.length > 0 && items.every((i) => i.selected);

  function applyVoucher() {
    const code = voucherInput.trim().toUpperCase();
    if (code === "SHOPI10") {
      setVoucherApplied({ code, discount: 0.1 });
      setVoucherError("");
    } else {
      setVoucherApplied(null);
      setVoucherError("Voucher code is invalid or expired.");
    }
  }

  const discount = voucherApplied ? selectedTotal * voucherApplied.discount : 0;
  const total = selectedTotal - discount;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 pb-28 md:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-muted hover:text-primary">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-ink dark:text-dark-ink">Shopping Cart</h1>
        <span className="text-sm text-muted">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-primary" />
          </div>
          <p className="text-lg font-semibold text-ink dark:text-dark-ink mb-1">Your cart is empty</p>
          <p className="text-sm text-muted mb-5">Add items to get started.</p>
          <Link to="/search" className="inline-block bg-primary text-white font-semibold rounded-xl px-6 py-2.5 hover:bg-primary-dark transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Items */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-dark-border">
              <label className="flex items-center gap-2 text-sm font-medium text-ink dark:text-dark-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => setAllSelected(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded"
                />
                Select All ({items.length})
              </label>
            </div>
            <ul className="divide-y divide-border dark:divide-dark-border">
              {items.map(({ product, quantity, selected }) => (
                <li key={product.id} className="flex items-center gap-3 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleSelected(product.id)}
                    className="w-4 h-4 accent-primary rounded shrink-0"
                  />
                  <Link to={`/product/${product.id}`} className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.id}`} className="text-sm font-medium text-ink dark:text-dark-ink line-clamp-2">
                      {product.name}
                    </Link>
                    <p className="text-primary font-bold text-sm mt-1">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex items-center border border-border dark:border-dark-border rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-ink dark:text-dark-ink">{quantity}</span>
                    <button
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-muted hover:text-primary shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
              <h3 className="text-sm font-semibold text-ink dark:text-dark-ink mb-3 flex items-center gap-2">
                <Ticket size={16} className="text-primary" /> Voucher
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  placeholder="Enter voucher code"
                  className="flex-1 border border-border dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary"
                />
                <button
                  onClick={applyVoucher}
                  className="bg-primary text-white text-sm font-semibold rounded-lg px-4 hover:bg-primary-dark transition-colors"
                >
                  Apply
                </button>
              </div>
              {voucherApplied && (
                <p className="text-xs text-green-600 mt-2">Voucher "{voucherApplied.code}" applied — 10% off!</p>
              )}
              {voucherError && <p className="text-xs text-primary mt-2">{voucherError}</p>}
              <p className="text-xs text-muted mt-2">Try code <span className="font-mono font-semibold">SHOPI10</span> for 10% off.</p>
            </div>

            <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
              <h3 className="text-sm font-semibold text-ink dark:text-dark-ink mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal ({selectedCount} items)</span>
                  <span>{formatPrice(selectedTotal)}</span>
                </div>
                {voucherApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Voucher discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-border dark:border-dark-border pt-2 flex justify-between font-bold text-ink dark:text-dark-ink">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout", { state: { voucher: voucherApplied } })}
                disabled={selectedCount === 0}
                className="w-full mt-4 bg-primary text-white font-semibold rounded-xl py-3 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden lg:block"
              >
                Checkout ({selectedCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky mobile checkout bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface dark:bg-dark-surface border-t border-border dark:border-dark-border p-4 flex items-center justify-between gap-4 lg:hidden">
          <div>
            <p className="text-xs text-muted">Total</p>
            <p className="text-lg font-bold text-primary">{formatPrice(total)}</p>
          </div>
          <button
            onClick={() => navigate("/checkout", { state: { voucher: voucherApplied } })}
            disabled={selectedCount === 0}
            className="bg-primary text-white font-semibold rounded-xl px-8 py-3 hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            Checkout ({selectedCount})
          </button>
        </div>
      )}
    </div>
  );
}
