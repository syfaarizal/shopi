import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  ShieldCheck, LogOut, ChevronRight, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

const NAV = [
  { to: "/admin",          label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products",  icon: Package },
  { to: "/admin/orders",   label: "Orders",    icon: ShoppingBag },
  { to: "/admin/users",    label: "Users",     icon: Users },
];

export default function AdminLayout() {
  const navigate   = useNavigate();
  const user       = useAuthStore((s) => s.user);
  const logout     = useAuthStore((s) => s.logout);
  const isDark     = useThemeStore((s) => s.isDark);
  const toggleTheme= useThemeStore((s) => s.toggle);
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex bg-bg dark:bg-dark-bg">
      {/* ── Sidebar ───────────────────────────────────────────── */}
      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-40 w-64
          bg-surface dark:bg-dark-surface border-r border-border dark:border-dark-border
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border dark:border-dark-border shrink-0">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink dark:text-dark-ink leading-none">Shopi</p>
            <p className="text-[10px] text-muted font-medium tracking-wide uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                  isActive
                    ? "bg-primary text-white shadow-premium"
                    : "text-muted hover:bg-bg dark:hover:bg-dark-bg hover:text-ink dark:hover:text-dark-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3">
                    <Icon size={17} className={isActive ? "text-white" : "text-muted group-hover:text-primary"} />
                    {label}
                  </span>
                  {!isActive && <ChevronRight size={13} className="text-muted opacity-0 group-hover:opacity-100" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user + actions */}
        <div className="p-4 border-t border-border dark:border-dark-border space-y-3 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink dark:text-dark-ink truncate">{user?.name}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 text-xs text-muted border border-border dark:border-dark-border rounded-lg py-1.5 hover:border-primary hover:text-primary transition-colors"
            >
              {isDark ? "☀ Light" : "☾ Dark"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 text-xs text-muted border border-border dark:border-dark-border rounded-lg py-1.5 hover:border-primary hover:text-primary transition-colors"
            >
              ← Store
            </button>
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border dark:border-dark-border text-muted hover:border-primary hover:text-primary transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar (mobile) */}
        <header className="lg:hidden sticky top-0 z-20 h-14 bg-surface dark:bg-dark-surface border-b border-border dark:border-dark-border flex items-center gap-3 px-4">
          <button onClick={() => setOpen(true)} className="text-ink dark:text-dark-ink">
            <Menu size={22} />
          </button>
          <span className="font-bold text-ink dark:text-dark-ink">Admin Panel</span>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
