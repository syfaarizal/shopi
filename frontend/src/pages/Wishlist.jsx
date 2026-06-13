import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";
import StarRating from "../components/StarRating";
import { formatPrice } from "../utils/format";

export default function Wishlist() {
  const navigate = useNavigate();
  const items = useWishlistStore((s) => s.getItems());
  const removeFromWishlist = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.addItem);

  function moveToCart(productId) {
    addToCart(productId, 1);
    removeFromWishlist(productId);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-muted hover:text-primary">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-ink dark:text-dark-ink flex items-center gap-2">
          <Heart size={20} className="text-primary" /> My Wishlist
        </h1>
        <span className="text-sm text-muted">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-primary" />
          </div>
          <p className="text-lg font-semibold text-ink dark:text-dark-ink mb-1">Your wishlist is empty</p>
          <p className="text-sm text-muted mb-5">Save items you love and find them here anytime.</p>
          <Link to="/search" className="inline-block bg-primary text-white font-semibold rounded-xl px-6 py-2.5 hover:bg-primary-dark transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex gap-4 bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-3"
            >
              <Link to={`/product/${product.id}`} className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <Link to={`/product/${product.id}`} className="text-sm font-medium text-ink dark:text-dark-ink line-clamp-2 mb-1">
                  {product.name}
                </Link>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-muted text-xs line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <StarRating rating={product.rating} size={12} />
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <button
                    onClick={() => moveToCart(product.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-semibold rounded-lg py-2 hover:bg-primary-dark transition-colors"
                  >
                    <ShoppingCart size={13} /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border dark:border-dark-border text-muted hover:text-primary hover:border-primary transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
