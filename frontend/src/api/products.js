import { PRODUCTS, CATEGORIES, findProduct, relatedProducts } from "../data/products";
import { delay } from "../utils/format";

export async function fetchCategories() {
  await delay(150);
  return CATEGORIES;
}

export async function fetchProducts(filters = {}) {
  await delay(250);
  let items = [...PRODUCTS];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (filters.category && filters.category.length) {
    items = items.filter((p) => filters.category.includes(p.category));
  }
  if (filters.brand && filters.brand.length) {
    items = items.filter((p) => filters.brand.includes(p.brand));
  }
  if (filters.minPrice != null) {
    items = items.filter((p) => p.price >= filters.minPrice);
  }
  if (filters.maxPrice != null) {
    items = items.filter((p) => p.price <= filters.maxPrice);
  }
  if (filters.minRating != null) {
    items = items.filter((p) => p.rating >= filters.minRating);
  }
  if (filters.flashSale) {
    items = items.filter((p) => p.isFlashSale);
  }

  switch (filters.sort) {
    case "price_asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
      items.sort((a, b) => b.sold - a.sold);
      break;
    default:
      break;
  }

  return { items, total: items.length };
}

export async function fetchProduct(id) {
  await delay(200);
  const product = findProduct(id);
  if (!product) throw new Error("Product not found");
  return product;
}

export async function fetchRelatedProducts(id) {
  await delay(200);
  const product = findProduct(id);
  if (!product) return [];
  return relatedProducts(product);
}

export function getAllBrands() {
  return [...new Set(PRODUCTS.map((p) => p.brand))].sort();
}
