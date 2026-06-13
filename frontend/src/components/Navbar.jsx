import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  LayoutGrid,
  Tag,
  Package,
  Bell,
  User,
  ShoppingCart,
  Moon,
  Sun,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = useCartStore((s) => s.getCount());
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggle);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  }

  function go(path) {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(path);
    }
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-surface dark:bg-dark-surface shadow-nav">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-[72px] flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <ShoppingBag size={20} className="text-white" />
          </span>
          <span className="text-xl font-extrabold text-ink dark:text-dark-ink tracking-tight">
            Shopi
          </span>
        </Link>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-2xl items-center bg-bg dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border overflow-hidden"
        >
          <Search size={18} className="text-muted ml-4 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, or categories..."
            className="w-full bg-transparent px-3 py-2.5 text-sm outline-none text-ink dark:text-dark-ink placeholder:text-muted"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-6 py-2.5 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Desktop nav icons */}
        <nav className="hidden lg:flex items-center gap-6 ml-auto">
          <button
            onClick={() => navigate("/search")}
            className="flex flex-col items-center gap-1 text-xs text-muted hover:text-primary transition-colors"
          >
            <LayoutGrid size={20} />
            <span>Categories</span>
          </button>
          <button
            onClick={() => navigate("/search?flashSale=true")}
            className="flex flex-col items-center gap-1 text-xs text-muted hover:text-primary transition-colors"
          >
            <Tag size={20} />
            <span>Promo</span>
          </button>
          <button
            onClick={() => go("/orders")}
            className="flex flex-col items-center gap-1 text-xs text-muted hover:text-primary transition-colors"
          >
            <Package size={20} />
            <span>Orders</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-xs text-muted hover:text-primary transition-colors">
            <Bell size={20} />
            <span>Alerts</span>
          </button>
          <button
            onClick={() => go("/profile")}
            className="flex flex-col items-center gap-1 text-xs text-muted hover:text-primary transition-colors"
          >
            <User size={20} />
            <span>Account</span>
          </button>
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center gap-1 text-xs text-muted hover:text-primary transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>
          <button
            onClick={() => go("/cart")}
            className="relative flex flex-col items-center gap-1 text-xs text-muted hover:text-primary transition-colors"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile right icons */}
        <div className="flex items-center gap-3 ml-auto lg:hidden">
          <button onClick={toggleTheme} className="text-ink dark:text-dark-ink">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => go("/cart")} className="relative text-ink dark:text-dark-ink">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="text-ink dark:text-dark-ink"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border dark:border-dark-border px-4 py-4 space-y-3 animate-fadeIn">
          <form onSubmit={handleSearch} className="flex items-center bg-bg dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border overflow-hidden">
            <Search size={18} className="text-muted ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none text-ink dark:text-dark-ink placeholder:text-muted"
            />
            <button type="submit" className="bg-primary text-white text-sm font-semibold px-5 py-2.5">
              Search
            </button>
          </form>
          <div className="grid grid-cols-4 gap-2 text-center">
            <button onClick={() => navigate("/search")} className="flex flex-col items-center gap-1 text-xs text-muted py-2">
              <LayoutGrid size={20} /> Categories
            </button>
            <button onClick={() => go("/wishlist")} className="flex flex-col items-center gap-1 text-xs text-muted py-2">
              <Heart size={20} /> Wishlist
            </button>
            <button onClick={() => go("/orders")} className="flex flex-col items-center gap-1 text-xs text-muted py-2">
              <Package size={20} /> Orders
            </button>
            <button onClick={() => go("/profile")} className="flex flex-col items-center gap-1 text-xs text-muted py-2">
              <User size={20} /> Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
