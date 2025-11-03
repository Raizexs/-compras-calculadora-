# 🧪 Verificación de Requisitos del Proyecto

Este documento explica cómo verificar que el proyecto cumple con todos los requisitos especificados.

## 📋 Requisitos a Verificar

El proyecto debe cumplir con las siguientes pruebas:

1. ✅ **Crear al menos 1 usuario y registrar su persona asociada**
2. ✅ **Cargar los 10 productos de ejemplo**
3. ✅ **Realizar una compra con al menos 3 productos distintos**
4. ✅ **Verificar el cálculo del total**
5. ✅ **Consultar el total acumulado de compras del usuario**

## 🚀 Verificación Automática

### Opción 1: Script de Prueba Automatizado

Ejecuta el script de prueba que verifica automáticamente todos los requisitos:

```bash
# Desde la carpeta backend/
cd backend
python test_requirements.py
```

Este script:

- ✅ Conecta a MongoDB
- ✅ Crea un usuario de prueba
- ✅ Registra una persona asociada
- ✅ Carga 10 productos (si no existen)
- ✅ Realiza una compra con 3 productos
- ✅ Verifica el cálculo del total
- ✅ Consulta el total acumulado
- ✅ Genera un reporte completo

**Salida esperada:**

```
🧪 SCRIPT DE VERIFICACIÓN DE REQUISITOS DEL PROYECTO
================================================================

✅ 1️⃣ Usuario creado exitosamente
   Email: test@example.com, ID: 67...
✅ 1️⃣ Persona registrada exitosamente
   Nombre: Juan Pérez Test, ID: 67...

✅ 2️⃣ Productos cargados exitosamente
   Insertados: 10 productos

✅ 3️⃣ Compra creada exitosamente
   ID: 67..., Productos: 3

✅ 4️⃣ Cálculo de total correcto
   Total almacenado: $6.90, Total calculado: $6.90

✅ 5️⃣ Consulta de total acumulado exitosa
   Total acumulado: $6.90, Compras: 1

================================================================
📊 RESUMEN DE PRUEBAS
================================================================
✅ Pruebas exitosas: 5
❌ Pruebas fallidas: 0
📈 Total: 5

🎉 ¡TODAS LAS PRUEBAS PASARON! El proyecto cumple con todos los requisitos.
```

## 🔍 Verificación Manual

### Requisito 1: Usuario y Persona

#### Usando Swagger UI (http://localhost:8000/docs)

1. **Registrar usuario:**

   ```
   POST /auth/register
   {
     "email": "usuario@example.com",
     "password": "123456"
   }
   ```

   Respuesta esperada:

   ```json
   {
     "id": "67...",
     "email": "usuario@example.com"
   }
   ```

2. **Crear persona:**

   ```
   POST /persons
   {
     "name": "Juan Pérez"
   }
   ```

   Respuesta esperada:

   ```json
   {
     "id": "67...",
     "name": "Juan Pérez"
   }
   ```

#### Usando cURL

```bash
# Registrar usuario
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"123456"}'

# Crear persona
curl -X POST "http://localhost:8000/persons" \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez"}'
```

### Requisito 2: Cargar 10 Productos

#### Usando el script seed

```bash
cd backend
python seed_products.py
```

Salida esperada:

```
🌱 Iniciando seed de productos...
✅ Conectado a MongoDB: shopping_app_db
✅ 15 productos agregados exitosamente

📦 Productos insertados:
1. Leche 1L - $1.20
2. Pan integral - $1.00
3. Huevos (12 unidades) - $2.50
...
```

#### Verificar en Swagger UI

```
GET /products
```

Debe retornar al menos 10 productos.

### Requisito 3: Compra con 3+ Productos

#### Usando Swagger UI

```
POST /purchases
{
  "person_id": "67...",  // ID de la persona creada
  "items": [
    {
      "product_id": "67...",  // ID del producto 1
      "name": "Leche 1L",
      "price": 1.20,
      "quantity": 2
    },
    {
      "product_id": "67...",  // ID del producto 2
      "name": "Pan integral",
      "price": 1.00,
      "quantity": 1
    },
    {
      "product_id": "67...",  // ID del producto 3
      "name": "Huevos (12 unidades)",
      "price": 2.50,
      "quantity": 1
    }
  ]
}
```

#### Usando la App Móvil

1. Abre la app en Expo
2. Ve a la pestaña "Compras"
3. Agrega al menos 3 productos diferentes al carrito
4. Presiona "Finalizar Compra"
5. Confirma la compra

### Requisito 4: Verificar Cálculo del Total

El endpoint `POST /purchases` calcula automáticamente el total:

```python
total = sum(item.price * item.quantity for item in purchase.items)
```

**Ejemplo:**

- Leche 1L: $1.20 x 2 = $2.40
- Pan integral: $1.00 x 1 = $1.00
- Huevos: $2.50 x 1 = $2.50
- **TOTAL: $5.90**

Verificar que el campo `total` en la respuesta coincida con el cálculo manual.

### Requisito 5: Total Acumulado

#### Usando Swagger UI

```
GET /purchases/person/{person_id}/total
```

Respuesta esperada:

```json
{
  "person_id": "67...",
  "total": 5.9,
  "purchase_count": 1
}
```

#### Usando cURL

```bash
curl -X GET "http://localhost:8000/purchases/person/67.../total"
```

## 📱 Verificación con la App Móvil

La app móvil implementa toda la funcionalidad necesaria:

### Pantalla de Autenticación (`explore.tsx`)

- ✅ Registro de usuarios
- ✅ Login
- ✅ Creación de personas

### Pantalla de Compras (`shopping.tsx`)

- ✅ Visualización de productos
- ✅ Carrito de compras
- ✅ Cálculo automático de totales
- ✅ Finalización de compra

### Flujo Completo en la App

1. **Registrarse e Iniciar Sesión:**

   - Ir a pestaña "Perfil"
   - Registrarse con email y contraseña
   - Crear una persona

2. **Realizar Compra:**

   - Ir a pestaña "Compras"
   - Ver catálogo de productos
   - Agregar 3+ productos al carrito
   - Ver el total calculado en tiempo real
   - Presionar "Finalizar Compra"
   - Confirmar

3. **Verificar Total:**
   - El total se muestra en la tarjeta superior
   - Se puede consultar el historial usando la API

## 🗄️ Verificación en MongoDB

### Usando MongoDB Compass o Atlas UI

1. **Colección `users`:**

   - Debe tener al menos 1 documento

2. **Colección `persons`:**

   - Debe tener al menos 1 documento

3. **Colección `products`:**

   - Debe tener al menos 10 documentos

4. **Colección `purchases`:**
   - Debe tener al menos 1 documento con:
     - `person_id`
     - `items` (array con 3+ productos)
     - `total` (calculado correctamente)

### Consulta de Agregación Manual

```javascript
db.purchases.aggregate([
  { $match: { person_id: ObjectId("67...") } },
  {
    $group: {
      _id: "$person_id",
      total: { $sum: "$total" },
      purchase_count: { $sum: 1 },
    },
  },
]);
```

## ✅ Checklist de Verificación

Marca cada requisito cuando lo verifiques:

- [ ] **Requisito 1:** Usuario y persona creados
  - [ ] Usuario existe en colección `users`
  - [ ] Persona existe en colección `persons`
- [ ] **Requisito 2:** 10 productos cargados

  - [ ] Colección `products` tiene 10+ documentos
  - [ ] Productos tienen `name` y `price`

- [ ] **Requisito 3:** Compra con 3+ productos

  - [ ] Compra existe en colección `purchases`
  - [ ] Array `items` tiene 3+ elementos
  - [ ] Cada item tiene `product_id`, `name`, `price`, `quantity`

- [ ] **Requisito 4:** Cálculo de total correcto

  - [ ] Campo `total` existe en el documento de compra
  - [ ] Total = suma de (price × quantity) de todos los items
  - [ ] Cálculo manual coincide con valor almacenado

- [ ] **Requisito 5:** Total acumulado consulta correctamente
  - [ ] Endpoint `/purchases/person/{id}/total` funciona
  - [ ] Retorna `total` y `purchase_count`
  - [ ] Total acumulado = suma de todos los totales de compras

## 🎯 Criterios de Éxito

El proyecto cumple **todos los requisitos** si:

1. ✅ El script `test_requirements.py` ejecuta exitosamente sin errores
2. ✅ Todas las 5 pruebas pasan
3. ✅ Los datos se pueden verificar en MongoDB
4. ✅ La app móvil permite realizar todo el flujo de compra
5. ✅ Los cálculos de totales son correctos

## 📖 Documentación Adicional

- [Guía de Inicio Rápido](../docs/QUICK_START.md)
- [Referencia de API](../docs/API_DOCS.md)
- [Documentación del Backend](./README.md)

---

**Última actualización:** Noviembre 2025
