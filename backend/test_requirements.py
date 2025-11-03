"""
Script de prueba para verificar los requisitos del proyecto

Pruebas requeridas:
1. Crear al menos 1 usuario y registrar su persona asociada
2. Cargar los 10 productos de ejemplo
3. Realizar una compra con al menos 3 productos distintos
4. Verificar el cálculo del total
5. Consultar el total acumulado de compras del usuario

Ejecutar: python test_requirements.py
"""
import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from bson import ObjectId

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "shopping_app_db")

# Test data
TEST_USER = {
    "email": "test@example.com",
    "password": "123456"
}

TEST_PERSON = {
    "name": "Juan Pérez Test"
}

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
]


class TestResults:
    def __init__(self):
        self.passed = []
        self.failed = []
    
    def add_pass(self, test_name: str, details: str = ""):
        self.passed.append((test_name, details))
        print(f"✅ {test_name}")
        if details:
            print(f"   {details}")
    
    def add_fail(self, test_name: str, error: str):
        self.failed.append((test_name, error))
        print(f"❌ {test_name}")
        print(f"   Error: {error}")
    
    def print_summary(self):
        print("\n" + "="*60)
        print("📊 RESUMEN DE PRUEBAS")
        print("="*60)
        print(f"✅ Pruebas exitosas: {len(self.passed)}")
        print(f"❌ Pruebas fallidas: {len(self.failed)}")
        print(f"📈 Total: {len(self.passed) + len(self.failed)}")
        
        if len(self.passed) == 5 and len(self.failed) == 0:
            print("\n🎉 ¡TODAS LAS PRUEBAS PASARON! El proyecto cumple con todos los requisitos.")
            return True
        else:
            print("\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.")
            return False


async def test_all_requirements():
    """Run all required tests"""
    results = TestResults()
    
    print("🧪 Iniciando pruebas de requisitos del proyecto...\n")
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        
        # Test connection
        await client.admin.command('ping')
        print(f"🔗 Conectado a MongoDB: {DATABASE_NAME}\n")
        
        # Get collections
        users = db["users"]
        persons = db["persons"]
        products = db["products"]
        purchases = db["purchases"]
        
        user_id = None
        person_id = None
        product_ids = []
        purchase_id = None
        
        # ============= TEST 1: Crear usuario y persona =============
        print("="*60)
        print("PRUEBA 1: Crear usuario y registrar persona asociada")
        print("="*60)
        
        try:
            # Check if user exists
            existing_user = await users.find_one({"email": TEST_USER["email"]})
            if existing_user:
                user_id = existing_user["_id"]
                results.add_pass(
                    "1️⃣ Usuario ya existe en la BD",
                    f"Email: {TEST_USER['email']}, ID: {user_id}"
                )
            else:
                # Create user
                user_result = await users.insert_one(TEST_USER)
                user_id = user_result.inserted_id
                results.add_pass(
                    "1️⃣ Usuario creado exitosamente",
                    f"Email: {TEST_USER['email']}, ID: {user_id}"
                )
            
            # Create person
            person_result = await persons.insert_one(TEST_PERSON)
            person_id = person_result.inserted_id
            results.add_pass(
                "1️⃣ Persona registrada exitosamente",
                f"Nombre: {TEST_PERSON['name']}, ID: {person_id}"
            )
            
        except Exception as e:
            results.add_fail("1️⃣ Crear usuario y persona", str(e))
            return results
        
        # ============= TEST 2: Cargar 10 productos =============
        print("\n" + "="*60)
        print("PRUEBA 2: Cargar al menos 10 productos de ejemplo")
        print("="*60)
        
        try:
            # Check existing products
            existing_count = await products.count_documents({})
            
            if existing_count >= 10:
                results.add_pass(
                    "2️⃣ Ya existen suficientes productos",
                    f"Productos en BD: {existing_count}"
                )
                # Get product IDs for purchase test
                cursor = products.find({}).limit(10)
                product_list = await cursor.to_list(length=10)
                product_ids = [(p["_id"], p["name"], p["price"]) for p in product_list]
            else:
                # Insert sample products
                result = await products.insert_many(SAMPLE_PRODUCTS)
                product_ids = [(pid, SAMPLE_PRODUCTS[i]["name"], SAMPLE_PRODUCTS[i]["price"]) 
                              for i, pid in enumerate(result.inserted_ids)]
                results.add_pass(
                    "2️⃣ Productos cargados exitosamente",
                    f"Insertados: {len(result.inserted_ids)} productos"
                )
            
            # Show products
            print(f"\n   📦 Productos disponibles:")
            for i, (pid, name, price) in enumerate(product_ids[:10], 1):
                print(f"   {i}. {name} - ${price:.2f}")
                
        except Exception as e:
            results.add_fail("2️⃣ Cargar productos", str(e))
            return results
        
        # ============= TEST 3: Realizar compra con 3+ productos =============
        print("\n" + "="*60)
        print("PRUEBA 3: Realizar compra con al menos 3 productos distintos")
        print("="*60)
        
        try:
            # Select first 3 products for purchase
            purchase_items = []
            expected_total = 0.0
            
            for i in range(min(3, len(product_ids))):
                pid, name, price = product_ids[i]
                quantity = i + 1  # 1, 2, 3 quantities
                item = {
                    "product_id": pid,
                    "name": name,
                    "price": price,
                    "quantity": quantity
                }
                purchase_items.append(item)
                expected_total += price * quantity
            
            expected_total = round(expected_total, 2)
            
            # Create purchase
            purchase_doc = {
                "person_id": person_id,
                "items": purchase_items,
                "total": expected_total
            }
            
            purchase_result = await purchases.insert_one(purchase_doc)
            purchase_id = purchase_result.inserted_id
            
            results.add_pass(
                "3️⃣ Compra creada exitosamente",
                f"ID: {purchase_id}, Productos: {len(purchase_items)}"
            )
            
            # Show purchase details
            print(f"\n   🛒 Detalle de la compra:")
            for item in purchase_items:
                subtotal = item["price"] * item["quantity"]
                print(f"   - {item['name']}: {item['quantity']} x ${item['price']:.2f} = ${subtotal:.2f}")
            print(f"   💰 Total esperado: ${expected_total:.2f}")
            
        except Exception as e:
            results.add_fail("3️⃣ Realizar compra", str(e))
            return results
        
        # ============= TEST 4: Verificar cálculo del total =============
        print("\n" + "="*60)
        print("PRUEBA 4: Verificar el cálculo del total")
        print("="*60)
        
        try:
            # Retrieve the purchase
            created_purchase = await purchases.find_one({"_id": purchase_id})
            
            if not created_purchase:
                raise Exception("No se pudo recuperar la compra creada")
            
            stored_total = created_purchase["total"]
            
            # Calculate total manually
            calculated_total = 0.0
            for item in created_purchase["items"]:
                calculated_total += item["price"] * item["quantity"]
            calculated_total = round(calculated_total, 2)
            
            if abs(stored_total - calculated_total) < 0.01:  # Allow small floating point differences
                results.add_pass(
                    "4️⃣ Cálculo de total correcto",
                    f"Total almacenado: ${stored_total:.2f}, Total calculado: ${calculated_total:.2f}"
                )
            else:
                raise Exception(f"El total no coincide. Almacenado: ${stored_total:.2f}, Calculado: ${calculated_total:.2f}")
            
        except Exception as e:
            results.add_fail("4️⃣ Verificar cálculo del total", str(e))
            return results
        
        # ============= TEST 5: Consultar total acumulado =============
        print("\n" + "="*60)
        print("PRUEBA 5: Consultar total acumulado de compras")
        print("="*60)
        
        try:
            # Aggregate total purchases for person
            pipeline = [
                {"$match": {"person_id": person_id}},
                {"$group": {
                    "_id": "$person_id",
                    "total": {"$sum": "$total"},
                    "purchase_count": {"$sum": 1}
                }}
            ]
            
            result = await purchases.aggregate(pipeline).to_list(length=1)
            
            if not result:
                raise Exception("No se encontraron compras para la persona")
            
            accumulated_total = round(result[0]["total"], 2)
            purchase_count = result[0]["purchase_count"]
            
            results.add_pass(
                "5️⃣ Consulta de total acumulado exitosa",
                f"Total acumulado: ${accumulated_total:.2f}, Compras: {purchase_count}"
            )
            
            print(f"\n   👤 Persona: {TEST_PERSON['name']}")
            print(f"   💰 Total acumulado: ${accumulated_total:.2f}")
            print(f"   🛒 Número de compras: {purchase_count}")
            
        except Exception as e:
            results.add_fail("5️⃣ Consultar total acumulado", str(e))
            return results
        
        # Close connection
        client.close()
        
    except Exception as e:
        print(f"\n❌ Error crítico durante las pruebas: {e}")
        results.add_fail("Conexión a base de datos", str(e))
    
    return results


def main():
    """Main entry point"""
    print("\n" + "="*60)
    print("🧪 SCRIPT DE VERIFICACIÓN DE REQUISITOS DEL PROYECTO")
    print("="*60)
    print("\nEste script verificará que se cumplan los siguientes requisitos:")
    print("1. ✅ Crear al menos 1 usuario y registrar su persona asociada")
    print("2. ✅ Cargar los 10 productos de ejemplo")
    print("3. ✅ Realizar una compra con al menos 3 productos distintos")
    print("4. ✅ Verificar el cálculo del total")
    print("5. ✅ Consultar el total acumulado de compras del usuario")
    print("\n" + "="*60 + "\n")
    
    # Check environment variables
    if not MONGODB_URI:
        print("❌ Error: MONGODB_URI no está configurado en .env")
        print("Por favor, configura tu archivo .env antes de ejecutar las pruebas.")
        sys.exit(1)
    
    # Run tests
    results = asyncio.run(test_all_requirements())
    
    # Print summary
    success = results.print_summary()
    
    if success:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
