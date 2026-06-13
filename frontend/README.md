# Shopi Frontend (React + Tailwind)

A premium, mobile-responsive e-commerce UI built with React, Tailwind CSS,
React Router, Zustand and TanStack Query — matching the Shopi design
reference (red/white marketplace theme, 20px radii, soft shadows).

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Demo login

```
Email:    demo@shopi.com
Password: password123
```

(or create a new account via "Sign up")

## Notes

- All data (products, categories) ships as curated mock data with Unsplash
  images in `src/data/products.js`, served through `src/api/products.js`
  with simulated network latency — wire this up to the FastAPI backend by
  swapping these functions for `axios`/`fetch` calls to `/api/...`.
- Auth, cart, wishlist and orders are persisted to `localStorage` via Zustand
  so the app is fully usable without a backend connected.
- Dark mode toggle is available in the navbar and on the Profile page.
- Voucher code `SHOPI10` gives 10% off in the cart for testing.

## Build for production

```bash
npm run build
npm run preview
```
