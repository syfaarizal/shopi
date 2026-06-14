import { useState, useMemo } from "react";
import { Search, ShieldCheck, User, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function AdminUsers() {
  const getAllUsers  = useAuthStore((s) => s.getAllUsers);
  const setUserRole  = useAuthStore((s) => s.setUserRole);
  const currentUser  = useAuthStore((s) => s.user);

  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all"); // "all" | "admin" | "user"
  const [confirm, setConfirm]     = useState(null);  // { userId, newRole }

  // Re-read every render so changes show immediately
  const users = getAllUsers();

  const filtered = useMemo(() => {
    let list = [...users];
    if (filter !== "all") list = list.filter((u) => u.role === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, filter, search]);

  function handleRoleToggle(user) {
    if (user.id === currentUser?.id) return; // can't change own role
    const newRole = user.role === "admin" ? "user" : "admin";
    setConfirm({ userId: user.id, userName: user.name, newRole });
  }

  function confirmToggle() {
    setUserRole(confirm.userId, confirm.newRole);
    setConfirm(null);
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-ink dark:text-dark-ink">Users</h1>
        <p className="text-sm text-muted">{users.length} registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-3 flex-1 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl px-4 shadow-card overflow-hidden">
          <Search size={15} className="text-muted shrink-0" />
          <input
            type="text" placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 text-sm bg-transparent text-ink dark:text-dark-ink outline-none placeholder:text-muted"
          />
        </div>
        <div className="flex gap-2">
          {["all", "admin", "user"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-primary text-white" : "bg-surface dark:bg-dark-surface border border-border dark:border-dark-border text-ink dark:text-dark-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
          <p className="text-2xl font-extrabold text-ink dark:text-dark-ink">{users.length}</p>
          <p className="text-xs text-muted mt-0.5">Total Users</p>
        </div>
        <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
          <p className="text-2xl font-extrabold text-primary">{users.filter((u) => u.role === "admin").length}</p>
          <p className="text-xs text-muted mt-0.5">Admins</p>
        </div>
        <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4">
          <p className="text-2xl font-extrabold text-ink dark:text-dark-ink">{users.filter((u) => u.role !== "admin").length}</p>
          <p className="text-xs text-muted mt-0.5">Regular Users</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-dark-border text-xs text-muted uppercase tracking-wide bg-bg dark:bg-dark-bg">
                <th className="px-5 py-3 text-left">User</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-center">Role</th>
                <th className="px-5 py-3 text-center">Toggle Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-dark-border">
              {filtered.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="hover:bg-bg dark:hover:bg-dark-bg transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=80`}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-border dark:border-dark-border"
                        />
                        <div>
                          <p className="font-semibold text-ink dark:text-dark-ink">{u.name}</p>
                          {isSelf && <p className="text-[10px] text-primary font-semibold">You</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted">{u.email}</td>
                    <td className="px-5 py-3 text-muted">{u.phone || "—"}</td>
                    <td className="px-5 py-3 text-center">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                          <ShieldCheck size={11} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-bg dark:bg-dark-bg text-muted px-2.5 py-1 rounded-full">
                          <User size={11} /> User
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        disabled={isSelf}
                        title={isSelf ? "Cannot change your own role" : `Make ${u.role === "admin" ? "regular user" : "admin"}`}
                        className="text-muted hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {u.role === "admin" ? (
                          <ToggleRight size={24} className="text-primary" />
                        ) : (
                          <ToggleLeft size={24} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role toggle confirmation modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirm(null)} />
          <div className="relative bg-surface dark:bg-dark-surface rounded-2xl shadow-premium p-6 max-w-sm w-full animate-scaleIn text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={22} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold text-ink dark:text-dark-ink mb-2">Change Role?</h3>
            <p className="text-sm text-muted mb-5">
              Make <strong>{confirm.userName}</strong> a{" "}
              <strong className="capitalize">{confirm.newRole}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 border border-border dark:border-dark-border rounded-xl py-2.5 text-sm font-semibold text-ink dark:text-dark-ink hover:border-primary hover:text-primary transition-colors">
                Cancel
              </button>
              <button onClick={confirmToggle} className="flex-1 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
