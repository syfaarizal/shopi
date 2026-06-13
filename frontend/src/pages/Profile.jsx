import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Moon,
  Sun,
  LogOut,
  Plus,
  Pencil,
  Package,
  Heart,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useOrderStore } from "../store/orderStore";
import { useWishlistStore } from "../store/wishlistStore";

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const addAddress = useAuthStore((s) => s.addAddress);
  const logout = useAuthStore((s) => s.logout);
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const orderCount = useOrderStore((s) => s.orders.length);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: "", phone: "", fullAddress: "", label: "Home", isDefault: false });

  function handleSaveProfile() {
    updateProfile(form);
    setEditing(false);
  }

  function handleAddAddress() {
    if (!newAddress.name || !newAddress.phone || !newAddress.fullAddress) return;
    addAddress(newAddress);
    setNewAddress({ name: "", phone: "", fullAddress: "", label: "Home", isDefault: false });
    setShowAddressForm(false);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-5">
      {/* User card */}
      <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-5">
        <div className="flex items-center gap-4 mb-4">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="border border-border dark:border-dark-border rounded-lg px-3 py-1.5 text-sm font-bold text-ink dark:text-dark-ink bg-transparent outline-none focus:border-primary w-full mb-1"
              />
            ) : (
              <h1 className="text-lg font-bold text-ink dark:text-dark-ink">{user.name}</h1>
            )}
            <p className="text-sm text-muted">{user.email}</p>
          </div>
          {editing ? (
            <button onClick={handleSaveProfile} className="bg-primary text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors">
              Save
            </button>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              <Pencil size={14} /> Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-bg dark:bg-dark-bg rounded-lg px-3 py-2.5">
            <Mail size={16} className="text-primary shrink-0" />
            <div className="text-sm">
              <p className="text-xs text-muted">Email</p>
              <p className="text-ink dark:text-dark-ink">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-bg dark:bg-dark-bg rounded-lg px-3 py-2.5">
            <Phone size={16} className="text-primary shrink-0" />
            <div className="text-sm flex-1">
              <p className="text-xs text-muted">Phone</p>
              {editing ? (
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="bg-transparent outline-none text-ink dark:text-dark-ink w-full border-b border-border dark:border-dark-border"
                />
              ) : (
                <p className="text-ink dark:text-dark-ink">{user.phone || "Not set"}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate("/orders")} className="flex items-center gap-3 bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4 hover:border-primary transition-colors">
          <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Package size={18} />
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-ink dark:text-dark-ink">{orderCount}</p>
            <p className="text-xs text-muted">My Orders</p>
          </div>
        </button>
        <button onClick={() => navigate("/wishlist")} className="flex items-center gap-3 bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4 hover:border-primary transition-colors">
          <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Heart size={18} />
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-ink dark:text-dark-ink">{wishlistCount}</p>
            <p className="text-xs text-muted">Wishlist</p>
          </div>
        </button>
      </section>

      {/* Addresses */}
      <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink dark:text-dark-ink flex items-center gap-2">
            <MapPin size={16} className="text-primary" /> Saved Addresses
          </h2>
          <button onClick={() => setShowAddressForm((s) => !s)} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <Plus size={14} /> Add
          </button>
        </div>

        <div className="space-y-2">
          {(user.addresses || []).map((addr) => (
            <div key={addr.id} className="border border-border dark:border-dark-border rounded-xl p-3 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-ink dark:text-dark-ink">{addr.name}</span>
                <span className="text-xs bg-bg dark:bg-dark-bg text-muted px-2 py-0.5 rounded-full">{addr.label}</span>
                {addr.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
              </div>
              <p className="text-muted">{addr.phone}</p>
              <p className="text-muted">{addr.fullAddress}</p>
            </div>
          ))}
          {(user.addresses || []).length === 0 && !showAddressForm && (
            <p className="text-sm text-muted">No saved addresses yet.</p>
          )}
        </div>

        {showAddressForm && (
          <div className="mt-3 space-y-2 border-t border-border dark:border-dark-border pt-3">
            <div className="grid grid-cols-2 gap-2">
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
              placeholder="Full address"
              value={newAddress.fullAddress}
              onChange={(e) => setNewAddress((a) => ({ ...a, fullAddress: e.target.value }))}
              rows={2}
              className="w-full border border-border dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary resize-none"
            />
            <button onClick={handleAddAddress} className="bg-primary text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors">
              Save Address
            </button>
          </div>
        )}
      </section>

      {/* Payment methods */}
      <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-5">
        <h2 className="text-sm font-semibold text-ink dark:text-dark-ink flex items-center gap-2 mb-3">
          <CreditCard size={16} className="text-primary" /> Payment Methods
        </h2>
        <div className="space-y-2 text-sm text-muted">
          <div className="flex items-center justify-between border border-border dark:border-dark-border rounded-xl p-3">
            <span className="text-ink dark:text-dark-ink">Bank Transfer</span>
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center justify-between border border-border dark:border-dark-border rounded-xl p-3">
            <span className="text-ink dark:text-dark-ink">E-Wallet (OVO, GoPay, DANA, ShopeePay)</span>
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center justify-between border border-border dark:border-dark-border rounded-xl p-3">
            <span className="text-ink dark:text-dark-ink">Credit / Debit Card</span>
            <span className="text-xs">Available</span>
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-5">
        <h2 className="text-sm font-semibold text-ink dark:text-dark-ink mb-3">Settings</h2>
        <div className="flex items-center justify-between border border-border dark:border-dark-border rounded-xl p-3 mb-3">
          <span className="flex items-center gap-2 text-sm text-ink dark:text-dark-ink">
            {isDark ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-primary" />}
            Dark Mode
          </span>
          <button
            onClick={toggleTheme}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors ${isDark ? "bg-primary" : "bg-border dark:bg-dark-border"}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${isDark ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold rounded-xl py-3 hover:bg-primary/5 transition-colors"
        >
          <LogOut size={18} /> Log Out
        </button>
      </section>
    </div>
  );
}
