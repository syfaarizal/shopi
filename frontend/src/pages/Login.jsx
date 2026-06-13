import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Mail, Lock, Eye, EyeOff, User, AlertCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "demo@shopi.com", password: "password123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-premium border border-border p-8 animate-scaleIn">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <span className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-3 shadow-premium">
            <ShoppingBag size={28} className="text-white" />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Shopi</h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-ink">
            {mode === "login" ? "Welcome Back 👋" : "Create an Account"}
          </h2>
          <p className="text-sm text-muted mt-1">
            {mode === "login"
              ? "Sign in to continue shopping"
              : "Sign up to start shopping with Shopi"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-primary/10 text-primary text-sm rounded-xl px-3 py-2 mb-4">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-sm font-medium text-ink mb-1.5 block">Full Name</label>
              <div className="flex items-center border border-border rounded-xl px-3 focus-within:border-primary transition-colors">
                <User size={18} className="text-muted shrink-0" />
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Email Address</label>
            <div className="flex items-center border border-border rounded-xl px-3 focus-within:border-primary transition-colors">
              <Mail size={18} className="text-muted shrink-0" />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-ink">Password</label>
              {mode === "login" && (
                <button type="button" className="text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="flex items-center border border-border rounded-xl px-3 focus-within:border-primary transition-colors">
              <Lock size={18} className="text-muted shrink-0" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-muted shrink-0">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl py-3 transition-colors disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 border border-border rounded-xl py-2.5 text-sm font-medium text-ink hover:bg-bg transition-colors">
            <GoogleIcon /> Google
          </button>
          <button className="flex items-center justify-center gap-2 border border-border rounded-xl py-2.5 text-sm font-medium text-ink hover:bg-bg transition-colors">
            <FacebookIcon /> Facebook
          </button>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="text-primary font-semibold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>

        {mode === "login" && (
          <p className="text-center text-xs text-muted mt-4">
            Demo account — email: <span className="font-mono">demo@shopi.com</span> / password:{" "}
            <span className="font-mono">password123</span>
          </p>
        )}

        <p className="text-center text-xs text-muted mt-2">
          <Link to="/" className="hover:text-primary">
            ← Continue browsing as guest
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16 4 9.1 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.4l-6.5-5.4c-2 1.4-4.6 2.2-7.5 2.2-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9 39.5 16 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H24v8h11.3a12 12 0 0 1-5.2 6.2l6.5 5.4C40.7 36.9 44 31.3 44 24c0-1.3-.1-2.5-.4-3.5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.5.3v2.7h-1.4c-1.2 0-1.6.8-1.6 1.6V12h2.9l-.5 2.9h-2.4v7C18.3 21.1 22 17 22 12z" />
    </svg>
  );
}
