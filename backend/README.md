# Shopping App Backend - FastAPI + MongoDB

Backend API para la aplicación móvil de compras, construido con FastAPI y MongoDB Atlas.

## 🚀 Características

- ✅ Autenticación de usuarios (demo sin JWT)
- ✅ Gestión de personas
- ✅ Catálogo de productos
- ✅ Sistema de compras con cálculo de totales
- ✅ Base de datos MongoDB Atlas
- ✅ API REST async con FastAPI
- ✅ Validaciones con Pydantic v2

## 📋 Requisitos Previos

- Python 3.11 o superior
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuita)
- pip (gestor de paquetes de Python)

## 🔧 Instalación

### 1. Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) y crea una cuenta gratuita
2. Crea un nuevo cluster (selecciona la opción FREE M0)
3. Espera a que el cluster se cree (puede tomar unos minutos)
4. Haz clic en "Connect" en tu cluster
5. Selecciona "Connect your application"
6. Copia la cadena de conexión (URI)
7. Crea un usuario de base de datos con permisos de lectura/escritura

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

Edita el archivo `.env` y completa:

```env
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=shopping_app_db
API_HOST=0.0.0.0
API_PORT=8000
```

### 3. Instalar Dependencias

```bash
# Crear entorno virtual (opcional pero recomendado)
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 4. Iniciar el Servidor

```bash
# Modo desarrollo (con auto-reload)
uvicorn app.main:app --reload --port 8000

# O usando Python directamente
python -m uvicorn app.main:app --reload
```

El servidor estará disponible en: `http://localhost:8000`

## 📚 Documentación de la API

Una vez que el servidor esté corriendo, puedes acceder a:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🗄️ Estructura de la Base de Datos

### Base de datos: `shopping_app_db`

#### Colección: `users`

```json
{
  "_id": ObjectId("..."),
  "email": "usuario@example.com",
  "password": "123456"
}
```

#### Colección: `persons`

```json
{
  "_id": ObjectId("..."),
  "name": "Juan Pérez"
}
```

#### Colección: `products`

```json
{
  "_id": ObjectId("..."),
  "name": "Leche",
  "price": 1.20
}
```

#### Colección: `purchases`

```json
{
  "_id": ObjectId("..."),
  "person_id": ObjectId("..."),
  "items": [
    {
      "product_id": ObjectId("..."),
      "name": "Leche",
      "price": 1.20,
      "quantity": 2
    }
  ],
  "total": 2.40
}
```

## 📡 Endpoints

### Autenticación

- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión

### Personas

- `POST /persons` - Crear persona
- `GET /persons/{person_id}` - Obtener persona por ID
- `GET /persons` - Listar todas las personas

### Productos

- `POST /products` - Crear producto
- `GET /products` - Listar todos los productos
- `GET /products/{product_id}` - Obtener producto por ID

### Compras

- `POST /purchases` - Crear compra
- `GET /purchases/{purchase_id}` - Obtener compra por ID
- `GET /purchases/person/{person_id}` - Listar compras de una persona
- `GET /purchases/person/{person_id}/total` - Obtener total de compras por persona

### Health Check

- `GET /health` - Verificar estado de la API

## 🧪 Ejemplos de Uso

### Registrar Usuario

```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "123456"
  }'
```

### Crear Producto

```bash
curl -X POST "http://localhost:8000/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Leche",
    "price": 1.20
  }'
```

### Crear Compra

```bash
curl -X POST "http://localhost:8000/purchases" \
  -H "Content-Type: application/json" \
  -d '{
    "person_id": "671df05b3f0e0d4a8a2df634",
    "items": [
      {
        "product_id": "671df0313f0e0d4a8a2df631",
        "name": "Leche",
        "price": 1.20,
        "quantity": 2
      }
    ]
  }'
```

## 🛠️ Carga Inicial de Datos

Para probar la aplicación, necesitas cargar productos iniciales. Puedes hacerlo:

1. **Usando la documentación Swagger** (http://localhost:8000/docs):

   - Ve a la sección "Products"
   - Usa el endpoint `POST /products`
   - Crea al menos 10 productos

2. **Usando MongoDB Compass** o **Atlas UI**:

   - Conéctate a tu cluster
   - Inserta documentos directamente en la colección `products`

3. **Usando un script Python** (próximamente)

### Productos de Ejemplo

```json
[
  { "name": "Leche 1L", "price": 1.2 },
  { "name": "Pan integral", "price": 1.0 },
  { "name": "Huevos (12 unidades)", "price": 2.5 },
  { "name": "Arroz 1kg", "price": 1.5 },
  { "name": "Aceite 1L", "price": 3.0 },
  { "name": "Azúcar 1kg", "price": 1.8 },
  { "name": "Café 250g", "price": 4.5 },
  { "name": "Pasta 500g", "price": 1.2 },
  { "name": "Tomate (kg)", "price": 2.0 },
  { "name": "Manzanas (kg)", "price": 2.5 }
]
```

## 🔒 Seguridad

⚠️ **Nota importante**: Esta es una versión demo para propósitos educativos.

En un entorno de producción, deberías implementar:

- ✅ Hash de contraseñas con `bcrypt`
- ✅ Autenticación con JWT tokens
- ✅ Validación de permisos y roles
- ✅ Rate limiting
- ✅ HTTPS obligatorio
- ✅ Variables de entorno seguras
- ✅ Logging y monitoreo

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py          # Package marker
│   ├── main.py              # Aplicación FastAPI y endpoints
│   ├── models.py            # Modelos Pydantic
│   └── database.py          # Configuración MongoDB
├── .env                     # Variables de entorno (NO subir a git)
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore              # Archivos a ignorar en git
├── requirements.txt         # Dependencias Python
└── README.md               # Este archivo
```

## 🐛 Solución de Problemas

### Error de conexión a MongoDB

```
pymongo.errors.ServerSelectionTimeoutError: ...
```

**Solución**:

1. Verifica que tu URI de MongoDB sea correcta
2. Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas
3. Verifica que el usuario/contraseña sean correctos

### Error de importación

```
ModuleNotFoundError: No module named 'fastapi'
```

**Solución**:

```bash
pip install -r requirements.txt
```

### Puerto ya en uso

```
ERROR: [Errno 48] Address already in use
```

**Solución**:

```bash
# Cambiar el puerto
uvicorn app.main:app --reload --port 8001
```

## 📝 Licencia

MIT

## 👤 Autor

Desarrollado para el curso de Desarrollo Web y Móvil - UNAB
