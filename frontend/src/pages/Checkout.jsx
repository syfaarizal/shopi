import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Truck, Zap, CreditCard, Wallet, Landmark, Plus } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useOrderStore, SHIPPING_COSTS } from "../store/orderStore";
import { formatPrice } from "../utils/format";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const voucher = location.state?.voucher || null;

  const items = useCartStore((s) => s.getEnrichedItems()).filter((i) => i.selected);
  const clearSelected = useCartStore((s) => s.clearSelected);

  const user = useAuthStore((s) => s.user);
  const addAddress = useAuthStore((s) => s.addAddress);
  const createOrder = useOrderStore((s) => s.createOrder);

  const addresses = user?.addresses || [];
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || null
  );
  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0);
  const [newAddress, setNewAddress] = useState({ name: user?.name || "", phone: user?.phone || "", fullAddress: "", label: "Home" });

  const [shippingMethod, setShippingMethod] = useState("regular");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [placing, setPlacing] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discount = voucher ? subtotal * voucher.discount : 0;
  const shippingCost = SHIPPING_COSTS[shippingMethod] ?? 0;
  const total = subtotal - discount + shippingCost;

  function handleSaveAddress() {
    if (!newAddress.name || !newAddress.phone || !newAddress.fullAddress) return;
    addAddress({ ...newAddress, isDefault: addresses.length === 0 });
    setShowAddressForm(false);
  }

  function handlePlaceOrder() {
    if (!selectedAddress) {
      setShowAddressForm(true);
      return;
    }
    setPlacing(true);
    const order = createOrder({
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        image: i.product.images[0],
        price: i.product.price,
        quantity: i.quantity,
      })),
      address: selectedAddress,
      shippingMethod,
      paymentMethod,
      voucher: voucher?.code,
    });
    clearSelected();
    setTimeout(() => {
      navigate(`/order-success/${order.id}`);
    }, 600);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10 text-center">
        <p className="text-lg font-semibold text-ink dark:text-dark-ink mb-2">No items to check out</p>
        <Link to="/cart" className="text-primary font-semibold hover:underline">Go back to cart</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 pb-28 md:pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-muted hover:text-primary">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-ink dark:text-dark-ink">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          {/* Address */}
          <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
            <h3 className="text-sm font-semibold text-ink dark:text-dark-ink mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Shipping Address
            </h3>

            {!showAddressForm && addresses.length > 0 && (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 border rounded-xl p-3 cursor-pointer transition-colors ${
                      selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-border dark:border-dark-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-primary"
                    />
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink dark:text-dark-ink">{addr.name}</span>
                        <span className="text-xs bg-bg dark:bg-dark-bg text-muted px-2 py-0.5 rounded-full">{addr.label}</span>
                      </div>
                      <p className="text-muted">{addr.phone}</p>
                      <p className="text-muted">{addr.fullAddress}</p>
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <Plus size={14} /> Add new address
                </button>
              </div>
            )}

            {showAddressForm && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress((a) => ({ ...a, name: e.target.value }))}
                    className="border border-border dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress((a) => ({ ...a, phone: e.target.value }))}
                    className="border border-border dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary"
                  />
                </div>
                <textarea
                  placeholder="Full address (street, district, city, province, postal code)"
                  value={newAddress.fullAddress}
                  onChange={(e) => setNewAddress((a) => ({ ...a, fullAddress: e.target.value }))}
                  rows={3}
                  className="w-full border border-border dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveAddress}
                    className="bg-primary text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors"
                  >
                    Save Address
                  </button>
                  {addresses.length > 0 && (
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-sm font-semibold text-muted hover:text-primary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Shipping options */}
          <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
            <h3 className="text-sm font-semibold text-ink dark:text-dark-ink mb-3 flex items-center gap-2">
              <Truck size={16} className="text-primary" /> Shipping Method
            </h3>
            <div className="space-y-2">
              <label className={`flex items-center justify-between border rounded-xl p-3 cursor-pointer transition-colors ${shippingMethod === "regular" ? "border-primary bg-primary/5" : "border-border dark:border-dark-border"}`}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="shipping" checked={shippingMethod === "regular"} onChange={() => setShippingMethod("regular")} className="accent-primary" />
                  <span>
                    <p className="text-sm font-medium text-ink dark:text-dark-ink">Regular (2-3 days)</p>
                  </span>
                </span>
                <span className="text-sm font-semibold text-green-600">Free</span>
              </label>
              <label className={`flex items-center justify-between border rounded-xl p-3 cursor-pointer transition-colors ${shippingMethod === "express" ? "border-primary bg-primary/5" : "border-border dark:border-dark-border"}`}>
                <span className="flex items-center gap-3">
                  <input type="radio" name="shipping" checked={shippingMethod === "express"} onChange={() => setShippingMethod("express")} className="accent-primary" />
                  <span className="flex items-center gap-1.5 text-sm font-medium text-ink dark:text-dark-ink">
                    <Zap size={14} className="text-primary" /> Express (1 day)
                  </span>
                </span>
                <span className="text-sm font-semibold text-ink dark:text-dark-ink">{formatPrice(SHIPPING_COSTS.express)}</span>
              </label>
            </div>
          </section>

          {/* Payment methods */}
          <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
            <h3 className="text-sm font-semibold text-ink dark:text-dark-ink mb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-primary" /> Payment Method
            </h3>
            <div className="space-y-2">
              <PaymentOption
                icon={Landmark}
                label="Bank Transfer"
                sublabel="Free"
                value="bank_transfer"
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />
              <PaymentOption
                icon={Wallet}
                label="E-Wallet"
                sublabel="OVO, GoPay, DANA, ShopeePay"
                value="ewallet"
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />
              <PaymentOption
                icon={CreditCard}
                label="Credit / Debit Card"
                sublabel="Visa, Mastercard, JCB"
                value="card"
                selected={paymentMethod}
                onSelect={setPaymentMethod}
              />
            </div>
          </section>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
            <h3 className="text-sm font-semibold text-ink dark:text-dark-ink mb-3">Order Summary</h3>
            <ul className="space-y-3 mb-3">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3">
                  <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink dark:text-dark-ink line-clamp-1">{product.name}</p>
                    <p className="text-xs text-muted">Qty: {quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink dark:text-dark-ink shrink-0">{formatPrice(product.price * quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm border-t border-border dark:border-dark-border pt-3">
              <div className="flex justify-between text-muted">
                <span>Subtotal ({items.length} products)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {voucher && (
                <div className="flex justify-between text-green-600">
                  <span>Voucher ({voucher.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
              </div>
              <div className="border-t border-border dark:border-dark-border pt-2 flex justify-between font-bold text-ink dark:text-dark-ink">
                <span>Total Payment</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full mt-4 bg-primary text-white font-semibold rounded-xl py-3 hover:bg-primary-dark transition-colors disabled:opacity-60 hidden lg:block"
            >
              {placing ? "Placing order..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky mobile pay bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface dark:bg-dark-surface border-t border-border dark:border-dark-border p-4 flex items-center justify-between gap-4 lg:hidden">
        <div>
          <p className="text-xs text-muted">Total Payment</p>
          <p className="text-lg font-bold text-primary">{formatPrice(total)}</p>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="bg-primary text-white font-semibold rounded-xl px-8 py-3 hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {placing ? "Placing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

function PaymentOption({ icon: Icon, label, sublabel, value, selected, onSelect }) {
  return (
    <label className={`flex items-center justify-between border rounded-xl p-3 cursor-pointer transition-colors ${selected === value ? "border-primary bg-primary/5" : "border-border dark:border-dark-border"}`}>
      <span className="flex items-center gap-3">
        <input type="radio" name="payment" checked={selected === value} onChange={() => onSelect(value)} className="accent-primary" />
        <Icon size={18} className="text-primary" />
        <span className="text-sm font-medium text-ink dark:text-dark-ink">{label}</span>
      </span>
      <span className="text-xs text-muted">{sublabel}</span>
    </label>
  );
}
