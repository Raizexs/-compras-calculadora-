import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB settings
MONGODB_URI = os.getenv("MONGODB_URI", "")
DATABASE_NAME = os.getenv("DATABASE_NAME", "shopping_app_db")

# MongoDB client
client: AsyncIOMotorClient = None


async def connect_to_mongo():
    """Connect to MongoDB"""
    global client
    try:
        client = AsyncIOMotorClient(MONGODB_URI)
        # Test connection
        await client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")


def get_database():
    """Get database instance"""
    return client[DATABASE_NAME]


def get_collection(collection_name: str):
    """Get collection from database"""
    db = get_database()
    return db[collection_name]
