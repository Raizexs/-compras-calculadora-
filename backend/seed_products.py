"""
Script para cargar productos de prueba en MongoDB
Ejecutar: python seed_products.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "shopping_app_db")

# Sample products
SAMPLE_PRODUCTS = [
    {"name": "Leche 1L", "price": 1.20},
    {"name": "Pan integral", "price": 1.00},
    {"name": "Huevos (12 unidades)", "price": 2.50},
    {"name": "Arroz 1kg", "price": 1.50},
    {"name": "Aceite 1L", "price": 3.00},
    {"name": "Azúcar 1kg", "price": 1.80},
    {"name": "Café 250g", "price": 4.50},
    {"name": "Pasta 500g", "price": 1.20},
    {"name": "Tomate (kg)", "price": 2.00},
    {"name": "Manzanas (kg)", "price": 2.50},
    {"name": "Plátanos (kg)", "price": 1.80},
    {"name": "Pollo (kg)", "price": 5.00},
    {"name": "Carne molida (kg)", "price": 6.50},
    {"name": "Queso 500g", "price": 4.00},
    {"name": "Yogurt natural", "price": 2.20},
]


async def seed_products():
    """Seed the database with sample products"""
    print("🌱 Iniciando seed de productos...")
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        products_collection = db["products"]
        
        # Test connection
        await client.admin.command('ping')
        print(f"✅ Conectado a MongoDB: {DATABASE_NAME}")
        
        # Check if products already exist
        count = await products_collection.count_documents({})
        if count > 0:
            print(f"⚠️  Ya existen {count} productos en la base de datos")
            response = input("¿Deseas agregar más productos de todos modos? (s/n): ")
            if response.lower() != 's':
                print("❌ Operación cancelada")
                return
        
        # Insert products
        result = await products_collection.insert_many(SAMPLE_PRODUCTS)
        print(f"✅ {len(result.inserted_ids)} productos agregados exitosamente")
        
        # Show inserted products
        print("\n📦 Productos insertados:")
        for i, product in enumerate(SAMPLE_PRODUCTS, 1):
            print(f"{i}. {product['name']} - CLP ${product['price']:.2f}")
        
        # Close connection
        client.close()
        print("\n🎉 Seed completado exitosamente!")
        
    except Exception as e:
        print(f"❌ Error durante el seed: {e}")


if __name__ == "__main__":
    asyncio.run(seed_products())
