"""
Seed script — populates MongoDB with an admin user, a demo user,
categories and products. Run with: python -m app.seed
"""
import asyncio
import uuid

from app.auth import hash_password
from app.database import products_collection, categories_collection, users_collection

CATEGORIES = [
    {"id": "electronics", "name": "Electronics", "icon": "Cpu"},
    {"id": "fashion", "name": "Fashion", "icon": "Shirt"},
    {"id": "beauty", "name": "Beauty", "icon": "Sparkles"},
    {"id": "home", "name": "Home & Living", "icon": "Home"},
    {"id": "phones", "name": "Phones & Tablets", "icon": "Smartphone"},
    {"id": "sports", "name": "Sports", "icon": "Dumbbell"},
    {"id": "automotive", "name": "Automotive", "icon": "Car"},
    {"id": "food", "name": "Food & Beverages", "icon": "UtensilsCrossed"},
]

SEED_USERS = [
    {
        "_id": "user-admin-seed",
        "name": "Admin Shopi",
        "email": "admin@shopi.com",
        "password": hash_password("admin123"),
        "phone": "0811-0000-0001",
        "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
        "role": "admin",             # ← admin role
        "addresses": [],
    },
    {
        "_id": "user-demo-seed",
        "name": "Budi Santoso",
        "email": "demo@shopi.com",
        "password": hash_password("password123"),
        "phone": "0812-3456-7890",
        "avatar": "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80",
        "role": "user",              # ← regular user
        "addresses": [
            {
                "id": "addr-1",
                "label": "Home",
                "name": "Budi Santoso",
                "phone": "0812-3456-7890",
                "fullAddress": "Jl. Merdeka No. 10, RT 01/RW 02, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta, 10310",
                "isDefault": True,
            }
        ],
    },
]

PRODUCTS = [
    {
        "name": "Classic Men's Analog Watch",
        "category": "fashion", "brand": "Fossil",
        "price": 199000, "original_price": 399000, "discount": 50,
        "rating": 4.6, "review_count": 120, "sold": 540, "stock": 35,
        "images": ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80"],
        "description": "A timeless analog watch with genuine leather strap.", "is_flash_sale": True,
    },
    {
        "name": "Wireless Over-Ear Headphones",
        "category": "electronics", "brand": "Sony",
        "price": 279000, "original_price": 399000, "discount": 30,
        "rating": 4.7, "review_count": 120, "sold": 890, "stock": 60,
        "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
        "description": "Immersive sound with ANC and 30-hour battery life.", "is_flash_sale": True,
    },
    {
        "name": "Running Sneakers Air Max",
        "category": "sports", "brand": "Nike",
        "price": 299000, "original_price": 499000, "discount": 40,
        "rating": 4.8, "review_count": 120, "sold": 1200, "stock": 80,
        "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
        "description": "Lightweight running sneakers with responsive cushioning.", "is_flash_sale": True,
    },
    {
        "name": "JBL Tune 510BT Wireless On-Ear",
        "category": "electronics", "brand": "JBL",
        "price": 499000, "original_price": None, "discount": None,
        "rating": 4.5, "review_count": 120, "sold": 760, "stock": 90,
        "images": ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"],
        "description": "JBL Pure Bass sound, up to 40-hour battery life.", "is_flash_sale": False,
    },
    {
        "name": "Smartwatch Fitness Tracker",
        "category": "electronics", "brand": "Xiaomi",
        "price": 399000, "original_price": 549000, "discount": 27,
        "rating": 4.4, "review_count": 410, "sold": 1500, "stock": 100,
        "images": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
        "description": "Track heart rate, sleep, and workouts with AMOLED display.", "is_flash_sale": False,
    },
]


async def seed():
    # Users
    await users_collection.delete_many({})
    await users_collection.insert_many(SEED_USERS)
    print(f"Seeded {len(SEED_USERS)} users (admin@shopi.com / demo@shopi.com).")

    # Categories
    await categories_collection.delete_many({})
    await categories_collection.insert_many(CATEGORIES)

    # Products
    await products_collection.delete_many({})
    docs = []
    for p in PRODUCTS:
        doc = dict(p)
        doc["_id"] = str(uuid.uuid4())
        doc["slug"] = "-".join(p["name"].lower().split())
        docs.append(doc)
    await products_collection.insert_many(docs)
    print(f"Seeded {len(CATEGORIES)} categories and {len(docs)} products.")


if __name__ == "__main__":
    asyncio.run(seed())
