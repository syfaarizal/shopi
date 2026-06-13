import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { fetchProducts, getAllBrands } from "../api/products";
import { CATEGORIES } from "../data/products";
import { formatPrice } from "../utils/format";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const BRANDS = getAllBrands();

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? searchParams.get("category").split(",") : []
  );
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(null);
  const [sort, setSort] = useState("newest");
  const [flashSale, setFlashSale] = useState(searchParams.get("flashSale") === "true");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get("category");
    setSelectedCategories(cat ? cat.split(",") : []);
    setFlashSale(searchParams.get("flashSale") === "true");
  }, [searchParams]);

  const filters = useMemo(
    () => ({
      q,
      category: selectedCategories,
      brand: selectedBrands,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      minRating,
      flashSale,
      sort,
    }),
    [q, selectedCategories, selectedBrands, minPrice, maxPrice, minRating, flashSale, sort]
  );

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });

  const products = data?.items || [];

  function toggleCategory(id) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function toggleBrand(brand) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating(null);
    setFlashSale(false);
    setSearchParams(q ? { q } : {});
  }

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (minRating ? 1 : 0) +
    (flashSale ? 1 : 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-ink dark:text-dark-ink">
            {q ? `Results for "${q}"` : "All Products"}
          </h1>
          <p className="text-sm text-muted">
            {isLoading ? "Searching..." : `${products.length} products found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-border dark:border-dark-border rounded-xl px-4 py-2 text-sm font-medium text-ink dark:text-dark-ink"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none border border-border dark:border-dark-border rounded-xl pl-4 pr-9 py-2 text-sm font-medium text-ink dark:text-dark-ink bg-surface dark:bg-dark-surface cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Filter sidebar - desktop */}
        <aside className="hidden lg:block">
          <FilterPanel
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
            flashSale={flashSale}
            setFlashSale={setFlashSale}
            clearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
          />
        </aside>

        {/* Product grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-surface dark:bg-dark-surface rounded-card border border-border dark:border-dark-border overflow-hidden animate-pulse">
                  <div className="aspect-square bg-bg dark:bg-dark-bg" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-bg dark:bg-dark-bg rounded w-3/4" />
                    <div className="h-3 bg-bg dark:bg-dark-bg rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-semibold text-ink dark:text-dark-ink mb-1">No products found</p>
              <p className="text-sm text-muted">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-surface dark:bg-dark-surface p-4 overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink dark:text-dark-ink">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} className="text-muted" />
              </button>
            </div>
            <FilterPanel
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minRating={minRating}
              setMinRating={setMinRating}
              flashSale={flashSale}
              setFlashSale={setFlashSale}
              clearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-primary text-white font-semibold rounded-xl py-3 mt-4"
            >
              Show {products.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  selectedCategories,
  toggleCategory,
  selectedBrands,
  toggleBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  flashSale,
  setFlashSale,
  clearFilters,
  activeFilterCount,
}) {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl border border-border dark:border-dark-border shadow-card p-4 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink dark:text-dark-ink flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Flash sale toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={flashSale}
          onChange={(e) => setFlashSale(e.target.checked)}
          className="w-4 h-4 accent-primary rounded"
        />
        <span className="text-sm text-ink dark:text-dark-ink">Flash Sale only</span>
      </label>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold text-ink dark:text-dark-ink mb-2">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-ink dark:text-dark-ink">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-sm font-semibold text-ink dark:text-dark-ink mb-2">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-border dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary"
          />
          <span className="text-muted text-sm">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-border dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary"
          />
        </div>
        {(minPrice || maxPrice) && (
          <p className="text-xs text-muted mt-1.5">
            {minPrice ? formatPrice(minPrice) : "Rp0"} — {maxPrice ? formatPrice(maxPrice) : "Any"}
          </p>
        )}
      </div>

      {/* Brand */}
      <div>
        <h4 className="text-sm font-semibold text-ink dark:text-dark-ink mb-2">Brand</h4>
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-ink dark:text-dark-ink">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-ink dark:text-dark-ink mb-2">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setMinRating(minRating === r ? null : r)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-ink dark:text-dark-ink">{r}★ & Up</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
