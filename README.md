# Shopi — E-Commerce Web Application

A modern marketplace UI (red & white premium theme) inspired by the provided
design reference, built with:

- **Frontend**: React (JavaScript), Tailwind CSS, React Router, Zustand, TanStack Query
- **Backend**: FastAPI + MongoDB (Motor), JWT auth
- **Images**: Curated Unsplash photos for all seeded products

## Project structure

```
shopi/
├── frontend/   React app (Vite) — runs standalone with mock data
└── backend/    FastAPI + MongoDB API (optional, for real persistence)
```

## Quick start (frontend only — fastest)

The frontend works fully on its own using local mock data + localStorage
(auth, cart, wishlist, orders all persist in the browser).

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 — log in with:

```
Email:    demo@shopi.com
Password: password123
```

To access the admin dashboard, log in with the seeded admin account instead:

```
Email:    admin@shopi.com
Password: admin123
```

## Full stack (with FastAPI + MongoDB)

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m app.seed          # seed categories, products & admin user into MongoDB
uvicorn app.main:app --reload --port 8000
```

The backend exposes a complete REST API (`/api/auth`, `/api/products`,
`/api/cart`, `/api/wishlist`, `/api/orders`, `/api/profile`, `/api/admin`,
`/api/payments`, `/api/uploads`) ready to be wired into the frontend's
`src/api/*.js` files in place of the mock layer. Uploaded product images are
served from `backend/uploads/`.

## Pages included

Login, Home, Search & Filters, Product Detail, Wishlist, Cart, Checkout,
Payment, Order Success, Profile, Orders, and an Admin Dashboard — all
responsive with dark mode support.

## Features

### Shopping
- Browse, search, and filter products
- Wishlist and cart with persistent state
- Checkout flow → dummy payment page → order confirmation

### Roles & Admin
- Users have a `role` field: `'user'` or `'admin'`
- `/admin/*` routes are protected and only accessible to admin accounts
- **Admin Dashboard** with a sidebar covering 4 sections: overview, products, orders, and users
- **Product CRUD** — admins can create, edit, and delete products, including drag-and-drop image upload
- **Order management** — admins can update order status (`pending` → `paid`, etc.)

### Checkout & Payment
- Checkout creates an order with status `pending`, then redirects to `/payment/:id`
- Dummy payment page supports Virtual Account, E-Wallet QR, and a card form
- Successful payment transitions the order from `pending` to `paid`

## Design system

- Primary: `#FF1F1F`
- Background: `#F8F9FB`
- Surface: `#FFFFFF`
- Text: `#111111`
- Border: `#ECECEC`
- Radius: `20px` (cards use `16px`)

## Project layout reference

### Frontend (`frontend/src/`)
- `store/` — Zustand stores: `authStore.js` (auth + role), `productStore.js`,
  `orderStore.js`, `paymentStore.js`
- `components/` — shared UI, including `AdminRoute.jsx` (role-gated route
  guard) and `ImageUpload.jsx` (drag-drop upload)
- `pages/` — customer-facing pages, including `Payment.jsx`
- `pages/admin/` — `AdminLayout.jsx`, `Dashboard.jsx`, `AdminProducts.jsx`,
  `AdminOrders.jsx`, `AdminUsers.jsx`

### Backend (`backend/app/`)
- `auth.py` — JWT auth, including `require_admin` dependency
- `models.py` — data models, including the `role` field on users
- `routers/` — `auth.py`, `admin.py`, `payments.py`, `uploads.py`, plus the
  core product/cart/wishlist/order/profile routers
- `main.py` — app entrypoint, router registration, static file serving
- `seed.py` — seeds categories, products, and the admin user