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

## Full stack (with FastAPI + MongoDB)

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m app.seed          # seed categories & products into MongoDB
uvicorn app.main:app --reload --port 8000
```

The backend exposes a complete REST API (`/api/auth`, `/api/products`,
`/api/cart`, `/api/wishlist`, `/api/orders`, `/api/profile`) ready to be
wired into the frontend's `src/api/*.js` files in place of the mock layer.

## Pages included

Login, Home, Search & Filters, Product Detail, Wishlist, Cart, Checkout,
Order Success, Profile, Orders — all responsive with dark mode support.

## Design system

- Primary: `#FF1F1F`
- Background: `#F8F9FB`
- Surface: `#FFFFFF`
- Text: `#111111`
- Border: `#ECECEC`
- Radius: `20px` (cards use `16px`)
