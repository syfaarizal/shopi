export function formatPrice(value) {
  return "Rp" + Math.round(value).toLocaleString("id-ID");
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
