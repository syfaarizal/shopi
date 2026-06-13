import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";
import { fetchProduct, fetchRelatedProducts } from "../api/products";
import { formatPrice, clamp } from "../utils/format";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useAuthStore } from "../store/authStore";
import { CATEGORIES } from "../data/products";

const SAMPLE_REVIEWS = [
  {
    name: "Andi Pratama",
    rating: 5,
    date: "2 weeks ago",
    text: "Great quality for the price! Arrived well packaged and exactly as described. Will buy again.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    name: "Sarah Wijaya",
    rating: 4,
    date: "1 month ago",
    text: "Good product overall, fast shipping. Color is slightly different from the photo but still nice.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    name: "Reza Maulana",
    rating: 5,
    date: "1 month ago",
    text: "Excellent! Exceeded my expectations. The seller responded quickly to my questions too.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  const { data: related } = useQuery({
    queryKey: ["related", id],
    queryFn: () => fetchRelatedProducts(id),
    enabled: !!product,
  });

  if (isLoading) {
    return <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10 text-muted">Loading product...</div>;
  }
  if (!product) {
    return <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10 text-muted">Product not found.</div>;
  }

  const categoryName = CATEGORIES.find((c) => c.id === product.category)?.name || product.category;

  function requireAuth(action) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    action();
  }

  function handleAddToCart() {
    requireAuth(() => addItem(product.id, quantity));
  }

  function handleBuyNow() {
    requireAuth(() => {
      addItem(product.id, quantity);
      navigate("/cart");
    });
  }

  function handleWishlist() {
    requireAuth(() => toggleWishlist(product.id));
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted flex-wrap">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/search?category=${product.category}`} className="hover:text-primary">{categoryName}</Link>
        <ChevronRight size={14} />
        <span className="text-ink dark:text-dark-ink line-clamp-1">{product.name}</span>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface dark:bg-dark-surface border border-border dark:border-dark-border mb-3">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                  activeImage === idx ? "border-primary" : "border-border dark:border-dark-border"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-primary font-semibold mb-1">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-ink dark:text-dark-ink mb-3 leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} size={16} />
            <span className="text-sm text-muted">{product.rating} ({product.reviewCount} reviews)</span>
            <span className="text-muted">•</span>
            <span className="text-sm text-muted">{product.sold} sold</span>
          </div>

          <div className="bg-bg dark:bg-dark-bg rounded-xl p-4 mb-5">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-primary">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-ink dark:text-dark-ink">Quantity</span>
            <div className="flex items-center border border-border dark:border-dark-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => clamp(q - 1, 1, product.stock))}
                className="w-9 h-9 flex items-center justify-center text-muted hover:text-primary"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm font-semibold text-ink dark:text-dark-ink">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => clamp(q + 1, 1, product.stock))}
                className="w-9 h-9 flex items-center justify-center text-muted hover:text-primary"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-xs text-muted">{product.stock} pieces available</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleWishlist}
              className="w-12 h-12 rounded-xl border border-border dark:border-dark-border flex items-center justify-center hover:border-primary transition-colors shrink-0"
            >
              <Heart size={20} className={isWishlisted ? "text-primary" : "text-muted"} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary font-semibold rounded-xl py-3 hover:bg-primary/5 transition-colors"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-primary text-white font-semibold rounded-xl py-3 hover:bg-primary-dark transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-border dark:border-dark-border pt-5">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Truck size={16} className="text-primary shrink-0" /> Free shipping
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <ShieldCheck size={16} className="text-primary shrink-0" /> Secure payment
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <RotateCcw size={16} className="text-primary shrink-0" /> 14-day return
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-5">
        <h2 className="text-lg font-bold text-ink dark:text-dark-ink mb-3">Product Details</h2>
        <p className="text-sm text-muted leading-relaxed">{product.description}</p>
      </section>

      {/* Reviews */}
      <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink dark:text-dark-ink">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} size={16} />
            <span className="text-sm font-semibold text-ink dark:text-dark-ink">{product.rating}</span>
            <span className="text-sm text-muted">({product.reviewCount})</span>
          </div>
        </div>
        <div className="space-y-4">
          {SAMPLE_REVIEWS.map((review, idx) => (
            <div key={idx} className="flex gap-3 border-b border-border dark:border-dark-border last:border-0 pb-4 last:pb-0">
              <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-ink dark:text-dark-ink">{review.name}</p>
                  <span className="text-xs text-muted">• {review.date}</span>
                </div>
                <StarRating rating={review.rating} size={12} />
                <p className="text-sm text-muted mt-1.5 leading-relaxed">{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related products */}
      {related?.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-ink dark:text-dark-ink mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
