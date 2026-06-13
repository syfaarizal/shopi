import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ChevronRight, Tag } from "lucide-react";
import CategorySidebar from "../components/CategorySidebar";
import FeatureHighlights from "../components/FeatureHighlights";
import FlashSaleTimer from "../components/FlashSaleTimer";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/products";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => fetchProducts({}),
  });

  const products = data?.items || [];
  const flashSale = products.filter((p) => p.isFlashSale);
  const rest = products.filter((p) => !p.isFlashSale);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Hero section: sidebar + banner */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="hidden lg:block">
          <CategorySidebar />
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary-dark min-h-[280px] flex items-center shadow-premium">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"
            alt="Special discount promotion"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="relative z-10 px-8 md:px-12 py-10 text-white max-w-md">
            <span className="inline-block bg-white text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
              SPECIAL DISCOUNT
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-2">
              Up to <span className="text-5xl md:text-7xl">70%</span>
              <span className="text-3xl md:text-5xl"> Off</span>
            </h1>
            <p className="text-white/90 mb-6 font-medium">+ Free Shipping on every order</p>
            <Link
              to="/search?flashSale=true"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-6 py-3 rounded-xl hover:bg-bg transition-colors"
            >
              Shop Now <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <FeatureHighlights />

      {/* Flash Sale */}
      <section className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-primary font-extrabold text-lg">
              <Tag size={20} />
              Flash Sale
            </span>
            <FlashSaleTimer />
          </div>
          <Link
            to="/search?flashSale=true"
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {flashSale.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Product grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink dark:text-dark-ink">Recommended for You</h2>
          <Link
            to="/search"
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {rest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
