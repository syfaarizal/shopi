import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "shopi")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

users_collection = db["users"]
products_collection = db["products"]
categories_collection = db["categories"]
orders_collection = db["orders"]
wishlist_collection = db["wishlist"]
cart_collection = db["cart"]
