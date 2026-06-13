import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import StarRating from "./StarRating";
import { formatPrice } from "../utils/format";
import { useWishlistStore } from "../store/wishlistStore";
import { useAuthStore } from "../store/authStore";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggleWishlist(product.id);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-surface dark:bg-dark-surface rounded-card border border-border dark:border-dark-border overflow-hidden shadow-card hover:shadow-premium hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative aspect-square overflow-hidden bg-bg dark:bg-dark-bg">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[11px] font-bold px-2 py-1 rounded-md">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-dark-surface/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            size={15}
            className={isWishlisted ? "text-primary" : "text-muted"}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="p-3 space-y-1">
        <p className="text-sm font-medium text-ink dark:text-dark-ink line-clamp-2 leading-snug min-h-[2.5em]">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-muted text-xs line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} size={12} />
          <span className="text-xs text-muted">({product.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
