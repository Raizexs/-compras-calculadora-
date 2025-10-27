# 📡 Documentación de Endpoints

Guía completa de todos los endpoints de la API con ejemplos de uso.

## Base URL

```
http://localhost:8000
```

## 🔐 Autenticación

### Registrar Usuario

**POST** `/auth/register`

```json
// Request
{
  "email": "alumno@unab.cl",
  "password": "123456"
}

// Response 201
{
  "_id": "671df0313f0e0d4a8a2df631",
  "email": "alumno@unab.cl"
}
```

### Iniciar Sesión

**POST** `/auth/login`

```json
// Request
{
  "email": "alumno@unab.cl",
  "password": "123456"
}

// Response 200
{
  "_id": "671df0313f0e0d4a8a2df631",
  "email": "alumno@unab.cl"
}

// Error 401
{
  "detail": "Invalid credentials"
}
```

## 👤 Personas

### Crear Persona

**POST** `/persons`

```json
// Request
{
  "name": "Matías Vargas"
}

// Response 201
{
  "_id": "671df05b3f0e0d4a8a2df634",
  "name": "Matías Vargas"
}
```

### Obtener Persona por ID

**GET** `/persons/{person_id}`

```json
// Response 200
{
  "_id": "671df05b3f0e0d4a8a2df634",
  "name": "Matías Vargas"
}

// Error 404
{
  "detail": "Person not found"
}
```

### Listar Todas las Personas

**GET** `/persons`

```json
// Response 200
[
  {
    "_id": "671df05b3f0e0d4a8a2df634",
    "name": "Matías Vargas"
  },
  {
    "_id": "671df05b3f0e0d4a8a2df635",
    "name": "Ana López"
  }
]
```

## 📦 Productos

### Crear Producto

**POST** `/products`

```json
// Request
{
  "name": "Leche 1L",
  "price": 1.20
}

// Response 201
{
  "_id": "671df0893f0e0d4a8a2df638",
  "name": "Leche 1L",
  "price": 1.20
}
```

### Listar Todos los Productos

**GET** `/products`

```json
// Response 200
[
  {
    "_id": "671df0893f0e0d4a8a2df638",
    "name": "Leche 1L",
    "price": 1.2
  },
  {
    "_id": "671df0893f0e0d4a8a2df639",
    "name": "Pan integral",
    "price": 1.0
  },
  {
    "_id": "671df0893f0e0d4a8a2df63a",
    "name": "Huevos (12)",
    "price": 2.5
  }
]
```

### Obtener Producto por ID

**GET** `/products/{product_id}`

```json
// Response 200
{
  "_id": "671df0893f0e0d4a8a2df638",
  "name": "Leche 1L",
  "price": 1.2
}
```

## 🛒 Compras

### Crear Compra

**POST** `/purchases`

```json
// Request
{
  "person_id": "671df05b3f0e0d4a8a2df634",
  "items": [
    {
      "product_id": "671df0893f0e0d4a8a2df638",
      "name": "Leche 1L",
      "price": 1.20,
      "quantity": 2
    },
    {
      "product_id": "671df0893f0e0d4a8a2df639",
      "name": "Pan integral",
      "price": 1.00,
      "quantity": 3
    }
  ]
}

// Response 201
{
  "_id": "671df1123f0e0d4a8a2df642",
  "person_id": "671df05b3f0e0d4a8a2df634",
  "items": [
    {
      "product_id": "671df0893f0e0d4a8a2df638",
      "name": "Leche 1L",
      "price": 1.20,
      "quantity": 2
    },
    {
      "product_id": "671df0893f0e0d4a8a2df639",
      "name": "Pan integral",
      "price": 1.00,
      "quantity": 3
    }
  ],
  "total": 5.40
}

// Error 404 (persona no existe)
{
  "detail": "Person not found"
}

// Error 422 (validación)
{
  "detail": [
    {
      "loc": ["body", "items"],
      "msg": "Purchase must contain at least one item",
      "type": "value_error"
    }
  ]
}
```

### Obtener Compra por ID

**GET** `/purchases/{purchase_id}`

```json
// Response 200
{
  "_id": "671df1123f0e0d4a8a2df642",
  "person_id": "671df05b3f0e0d4a8a2df634",
  "items": [
    {
      "product_id": "671df0893f0e0d4a8a2df638",
      "name": "Leche 1L",
      "price": 1.2,
      "quantity": 2
    }
  ],
  "total": 2.4
}
```

### Listar Compras de una Persona

**GET** `/purchases/person/{person_id}`

```json
// Response 200
[
  {
    "_id": "671df1123f0e0d4a8a2df642",
    "person_id": "671df05b3f0e0d4a8a2df634",
    "items": [...],
    "total": 5.40
  },
  {
    "_id": "671df1123f0e0d4a8a2df643",
    "person_id": "671df05b3f0e0d4a8a2df634",
    "items": [...],
    "total": 12.80
  }
]
```

### Total de Compras por Persona

**GET** `/purchases/person/{person_id}/total`

```json
// Response 200
{
  "person_id": "671df05b3f0e0d4a8a2df634",
  "total": 18.20,
  "purchase_count": 2
}

// Persona sin compras
{
  "person_id": "671df05b3f0e0d4a8a2df634",
  "total": 0.0,
  "purchase_count": 0
}
```

## ❤️ Health Check

### Estado de la API

**GET** `/health`

```json
// Response 200
{
  "status": "ok",
  "message": "API is running"
}
```

## 📋 Códigos de Estado HTTP

| Código | Significado           | Uso                      |
| ------ | --------------------- | ------------------------ |
| 200    | OK                    | Operación exitosa (GET)  |
| 201    | Created               | Recurso creado (POST)    |
| 400    | Bad Request           | Datos inválidos          |
| 401    | Unauthorized          | Credenciales incorrectas |
| 404    | Not Found             | Recurso no encontrado    |
| 422    | Unprocessable Entity  | Error de validación      |
| 500    | Internal Server Error | Error del servidor       |

## 🧪 Ejemplos con cURL

### Registrar Usuario

```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### Listar Productos

```bash
curl -X GET "http://localhost:8000/products"
```

### Crear Compra

```bash
curl -X POST "http://localhost:8000/purchases" \
  -H "Content-Type: application/json" \
  -d '{
    "person_id": "671df05b3f0e0d4a8a2df634",
    "items": [
      {
        "product_id": "671df0893f0e0d4a8a2df638",
        "name": "Leche 1L",
        "price": 1.20,
        "quantity": 2
      }
    ]
  }'
```

## 🔍 Validaciones

### Productos

- ✅ `name`: requerido, string
- ✅ `price`: requerido, float > 0, redondeado a 2 decimales

### Compras

- ✅ `person_id`: requerido, ObjectId válido, debe existir
- ✅ `items`: array no vacío
- ✅ `items[].quantity`: integer > 0
- ✅ `items[].price`: float > 0

### Usuarios

- ✅ `email`: requerido, único
- ✅ `password`: requerido

## 📱 Uso desde la App Móvil

La app consume estos endpoints mediante el servicio `src/services/api.ts`:

```typescript
// Ejemplo: Listar productos
import { productsAPI } from "../services/api";

const products = await productsAPI.list();

// Ejemplo: Crear compra
const purchase = await purchasesAPI.create(personId, items);
```

## 🌐 Documentación Interactiva

Visita http://localhost:8000/docs para:

- 📖 Ver todos los endpoints
- 🧪 Probar requests desde el navegador
- 📋 Ver esquemas de datos
- ⚡ Ejecutar consultas en vivo

## 🔗 Recursos

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [MongoDB Aggregation](https://www.mongodb.com/docs/manual/aggregation/)
- [Pydantic Models](https://docs.pydantic.dev/)

---

Para más información, consulta el [README principal](../README.md).
