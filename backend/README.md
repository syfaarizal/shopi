# Shopi Backend (FastAPI + MongoDB)

## Setup

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

## Environment variables

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=shopi
JWT_SECRET=change-me-in-production
```

## Seed the database

```bash
python -m app.seed
```

## Run the API

```bash
uvicorn app.main:app --reload --port 8000
```

API docs available at http://localhost:8000/docs

## Endpoints overview

- `POST /api/auth/register` / `POST /api/auth/login` / `GET /api/auth/me`
- `GET /api/categories`
- `GET /api/products` (query: q, category, brand, min_price, max_price, min_rating, flash_sale, sort)
- `GET /api/products/{id}` / `GET /api/products/{id}/related`
- `GET/POST/PATCH/DELETE /api/cart`
- `GET/POST/DELETE /api/wishlist/{product_id}`
- `GET/POST /api/orders`, `GET /api/orders/{id}`
- `GET/POST /api/profile/addresses`, `PUT /api/profile/me`
