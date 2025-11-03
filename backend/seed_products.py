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

# Sample products (precios en CLP - Pesos Chilenos)
SAMPLE_PRODUCTS = [
    {
        "name": "Leche 1L",
        "price": 1200,
        "description": "Leche entera de vaca, rica en calcio y proteínas. Ideal para toda la familia.",
        "category": "Lácteos",
        "characteristics": ["Entera", "1 Litro", "Rica en calcio", "Pasteurizada", "Refrigeración requerida"]
    },
    {
        "name": "Pan integral",
        "price": 1500,
        "description": "Pan artesanal elaborado con harina integral 100%. Alto en fibra y nutrientes.",
        "category": "Panadería",
        "characteristics": ["100% integral", "Alto en fibra", "Sin conservantes", "Recién horneado", "500g"]
    },
    {
        "name": "Huevos (12 unidades)",
        "price": 3500,
        "description": "Huevos frescos de gallinas libres. Excelente fuente de proteína de alta calidad.",
        "category": "Lácteos",
        "characteristics": ["12 unidades", "Tamaño grande", "Gallinas libres", "Frescos", "Alto en proteína"]
    },
    {
        "name": "Arroz 1kg",
        "price": 1800,
        "description": "Arroz grano largo de primera calidad. Perfecto para cualquier preparación.",
        "category": "Granos",
        "characteristics": ["Grano largo", "1 kilogramo", "Fácil cocción", "Sin gluten", "Rendidor"]
    },
    {
        "name": "Aceite 1L",
        "price": 3500,
        "description": "Aceite vegetal 100% puro. Ideal para cocinar y aliñar ensaladas.",
        "category": "Aceites",
        "characteristics": ["1 Litro", "100% vegetal", "Sin colesterol", "Sabor neutro", "Botella PET"]
    },
    {
        "name": "Azúcar 1kg",
        "price": 1500,
        "description": "Azúcar blanca refinada de caña. Perfecta para endulzar y repostería.",
        "category": "Granos",
        "characteristics": ["1 kilogramo", "Refinada", "De caña", "Cristalina", "Empaque sellado"]
    },
    {
        "name": "Café 250g",
        "price": 4500,
        "description": "Café molido selección premium. Aroma intenso y sabor equilibrado.",
        "category": "Granos",
        "characteristics": ["250 gramos", "Molido", "Tueste medio", "Aroma intenso", "100% arábica"]
    },
    {
        "name": "Pasta 500g",
        "price": 1200,
        "description": "Pasta tipo spaghetti de sémola de trigo. Cocción al dente perfecta.",
        "category": "Granos",
        "characteristics": ["500 gramos", "Spaghetti", "Sémola de trigo", "Tiempo cocción 8-10 min", "Formato largo"]
    },
    {
        "name": "Tomate (kg)",
        "price": 2500,
        "description": "Tomates frescos y maduros. Ideales para ensaladas y salsas caseras.",
        "category": "Verduras",
        "characteristics": ["Fresco", "Maduro", "1 kilogramo aprox", "Origen nacional", "Rico en licopeno"]
    },
    {
        "name": "Manzanas (kg)",
        "price": 2800,
        "description": "Manzanas rojas crujientes y jugosas. Perfectas para comer o cocinar.",
        "category": "Frutas",
        "characteristics": ["Rojas", "Crujientes", "1 kilogramo aprox", "Dulces", "Alto contenido vitamina C"]
    },
    {
        "name": "Plátanos (kg)",
        "price": 1800,
        "description": "Plátanos maduros, ricos en potasio y energía natural.",
        "category": "Frutas",
        "characteristics": ["Maduros", "1 kilogramo aprox", "Rico en potasio", "Energizante natural", "Dulce sabor"]
    },
    {
        "name": "Pollo (kg)",
        "price": 5500,
        "description": "Pechuga de pollo fresca, sin piel. Baja en grasa y alta en proteína.",
        "category": "Carnes",
        "characteristics": ["Pechuga", "Sin piel", "1 kilogramo", "Fresco", "Bajo en grasa"]
    },
    {
        "name": "Carne molida (kg)",
        "price": 7500,
        "description": "Carne molida de res premium. Ideal para hamburguesas y boloñesa.",
        "category": "Carnes",
        "characteristics": ["Res premium", "Molida fina", "1 kilogramo", "Fresca", "80% magra"]
    },
    {
        "name": "Queso 500g",
        "price": 4500,
        "description": "Queso mantecoso semi-maduro. Sabor suave y textura cremosa.",
        "category": "Lácteos",
        "characteristics": ["Mantecoso", "500 gramos", "Semi-maduro", "Cremoso", "Refrigeración requerida"]
    },
    {
        "name": "Yogurt natural",
        "price": 2200,
        "description": "Yogurt natural sin azúcar añadida. Contiene probióticos vivos.",
        "category": "Lácteos",
        "characteristics": ["Natural", "Sin azúcar añadida", "Con probióticos", "1 Litro", "Bajo en grasa"]
    },
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
            response = input("¿Deseas eliminar los productos existentes y agregar nuevos? (s/n): ")
            if response.lower() == 's':
                await products_collection.delete_many({})
                print(f"🗑️  {count} productos eliminados")
            else:
                print("❌ Operación cancelada")
                return
        
        # Insert products
        result = await products_collection.insert_many(SAMPLE_PRODUCTS)
        print(f"✅ {len(result.inserted_ids)} productos agregados exitosamente")
        
        # Show inserted products
        print("\n📦 Productos insertados:")
        for i, product in enumerate(SAMPLE_PRODUCTS, 1):
            print(f"{i}. {product['name']} - CLP ${int(product['price'])}")
        
        # Close connection
        client.close()
        print("\n🎉 Seed completado exitosamente!")
        
    except Exception as e:
        print(f"❌ Error durante el seed: {e}")


if __name__ == "__main__":
    asyncio.run(seed_products())
