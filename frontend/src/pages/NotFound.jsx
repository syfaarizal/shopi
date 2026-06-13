import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 text-center">
      <div>
        <span className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={28} className="text-white" />
        </span>
        <h1 className="text-3xl font-extrabold text-ink mb-2">404</h1>
        <p className="text-muted mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-block bg-primary text-white font-semibold rounded-xl px-6 py-2.5 hover:bg-primary-dark transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
