# 🛠️ Comandos Útiles

Referencia rápida de comandos comunes para desarrollo.

## 🐍 Backend (FastAPI)

### Iniciar Servidor

```powershell
cd backend
.\venv\Scripts\Activate.ps1  # Activar venv
uvicorn app.main:app --reload --port 8000
```

### Cargar Productos

```powershell
python seed_products.py
```

### Verificar Conexión a MongoDB

```python
python -c "from app.database import connect_to_mongo; import asyncio; asyncio.run(connect_to_mongo())"
```

### Ver Logs en Tiempo Real

```powershell
uvicorn app.main:app --reload --log-level debug
```

### Reinstalar Dependencias

```powershell
pip install -r requirements.txt --force-reinstall
```

### Crear Nuevo Producto desde Python

```python
python
>>> from motor.motor_asyncio import AsyncIOMotorClient
>>> import asyncio
>>> client = AsyncIOMotorClient("tu_mongodb_uri")
>>> db = client["shopping_app_db"]
>>> async def add():
...     await db.products.insert_one({"name": "Nuevo Producto", "price": 5.99})
>>> asyncio.run(add())
```

## 📱 Frontend (Expo)

### Iniciar App

```powershell
npx expo start
```

### Limpiar Caché

```powershell
npx expo start -c
```

### Ejecutar en Plataformas

```powershell
npx expo start --web          # Web
npx expo start --android      # Android
npx expo start --ios          # iOS
```

### Reinstalar Dependencias

```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Ver Info del Proyecto

```powershell
npx expo config
```

### Compilar para Producción

```powershell
eas build --platform android
eas build --platform ios
```

## 🗃️ MongoDB Atlas

### Conectar con mongosh

```bash
mongosh "mongodb+srv://cluster.xxxxx.mongodb.net/" --apiVersion 1 --username TU_USUARIO
```

### Comandos útiles en mongosh

```javascript
// Ver bases de datos
show dbs

// Usar base de datos
use shopping_app_db

// Ver colecciones
show collections

// Contar documentos
db.products.countDocuments()
db.purchases.countDocuments()

// Ver todos los productos
db.products.find().pretty()

// Ver compras de una persona
db.purchases.find({person_id: ObjectId("...")}).pretty()

// Agregación: total por persona
db.purchases.aggregate([
  {$group: {
    _id: "$person_id",
    total: {$sum: "$total"},
    count: {$sum: 1}
  }}
])

// Eliminar todos los productos
db.products.deleteMany({})

// Insertar producto
db.products.insertOne({name: "Nuevo", price: 1.99})
```

## 🔍 Debugging

### Ver Requests del Backend

```powershell
# El servidor mostrará automáticamente:
# INFO: 127.0.0.1:xxxx - "GET /products HTTP/1.1" 200 OK
```

### Ver Logs de Expo

```powershell
# Los logs aparecen automáticamente en la terminal
# También puedes usar:
npx react-native log-android    # Android
npx react-native log-ios        # iOS
```

### Probar API con cURL

```powershell
# Health check
curl http://localhost:8000/health

# Listar productos
curl http://localhost:8000/products

# Crear usuario
curl -X POST http://localhost:8000/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@test.com\",\"password\":\"123\"}'
```

### Probar API con Python

```python
import requests

# Health check
r = requests.get("http://localhost:8000/health")
print(r.json())

# Listar productos
r = requests.get("http://localhost:8000/products")
print(r.json())

# Crear compra
r = requests.post("http://localhost:8000/purchases", json={
    "person_id": "...",
    "items": [...]
})
print(r.json())
```

## 📊 Estado del Proyecto

### Ver Estado Git

```powershell
git status
git log --oneline -5
```

### Crear Commit

```powershell
git add .
git commit -m "feat: descripción del cambio"
git push origin main
```

### Ver Diferencias

```powershell
git diff
git diff --staged
```

## 🧪 Testing

### Test Manual del Backend

```powershell
# 1. Health
curl http://localhost:8000/health

# 2. Productos
curl http://localhost:8000/products

# 3. Registro
curl -X POST http://localhost:8000/auth/register -H "Content-Type: application/json" -d '{\"email\":\"test@test.com\",\"password\":\"123\"}'
```

### Verificar Conexiones

```powershell
# Backend escuchando
netstat -an | findstr :8000

# MongoDB conectado
# Ver logs del backend al iniciar
```

## 🔄 Actualizar Proyecto

### Pull de Cambios

```powershell
git pull origin main

# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ..
npm install
```

### Actualizar Dependencias

```powershell
# Backend
pip list --outdated
pip install --upgrade nombre_paquete

# Frontend
npm outdated
npm update
```

## 🚀 Producción

### Build Backend para Producción

```powershell
# Instalar sin dev dependencies
pip install -r requirements.txt --no-dev

# Ejecutar con gunicorn
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Build Frontend para Producción

```powershell
# Configurar EAS
npm install -g eas-cli
eas login
eas build:configure

# Build APK
eas build --platform android --profile preview

# Build para tiendas
eas build --platform android
eas build --platform ios
```

## 📦 Backup

### Backup de MongoDB

```powershell
# Con mongodump
mongodump --uri="mongodb+srv://..." --out=backup_$(Get-Date -Format "yyyy-MM-dd")

# Restaurar
mongorestore --uri="mongodb+srv://..." backup_2024-01-15/
```

### Backup del Código

```powershell
# Crear zip del proyecto
Compress-Archive -Path . -DestinationPath backup_$(Get-Date -Format "yyyy-MM-dd").zip
```

## 🎨 Útiles de Desarrollo

### Formatear Código Python

```powershell
pip install black
black app/
```

### Formatear Código TypeScript

```powershell
npm install -g prettier
prettier --write "app/**/*.{ts,tsx}"
```

### Ver Info del Sistema

```powershell
# Python
python --version
pip --version

# Node
node --version
npm --version

# Expo
npx expo --version
```

## 🆘 Reiniciar Todo

```powershell
# Parar servidores
# Ctrl+C en cada terminal

# Backend
cd backend
Remove-Item venv -Recurse -Force
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Frontend
cd ..
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install

# Reiniciar servidores
# Backend: uvicorn app.main:app --reload
# Frontend: npx expo start
```

---

💡 **Tip**: Guarda este archivo en tus favoritos para acceso rápido a comandos comunes.
