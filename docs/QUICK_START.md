# 🚀 Guía Rápida de Inicio

Esta es una guía paso a paso para poner en marcha el proyecto completo en menos de 15 minutos.

## ⚡ Inicio Rápido

### 1️⃣ MongoDB Atlas (5 minutos)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cuenta gratuita
3. Crea cluster M0 (free)
4. Database Access → Add User (readWriteAnyDatabase)
5. Network Access → Add IP (0.0.0.0/0)
6. Connect → URI: `mongodb+srv://user:pass@cluster.xxx.mongodb.net/`

### 2️⃣ Backend Setup (3 minutos)

```powershell
cd backend

# Crear y activar entorno virtual
python -m venv venv
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env
copy .env.example .env
# Edita .env con tu URI de MongoDB

# Cargar productos de prueba
python seed_products.py

# Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

✅ Verifica: http://localhost:8000/docs

### 3️⃣ Frontend Setup (3 minutos)

En **nueva terminal**:

```powershell
# Volver a raíz
cd ..

# Instalar dependencias
npm install

# Configurar API URL
# Edita src/config.ts:
# - Android Emulator: http://10.0.2.2:8000
# - iOS Simulator: http://localhost:8000
# - Dispositivo físico: http://TU_IP_LOCAL:8000

# Iniciar Expo
npx expo start
```

### 4️⃣ Ejecutar App (2 minutos)

- Presiona `w` para web
- Presiona `a` para Android emulator
- Escanea QR con Expo Go en tu teléfono

## 📱 Primer Uso

### Paso 1: Crear Perfil

1. Ve a pestaña **Perfil**
2. Regístrate: `alumno@unab.cl` / `123456`
3. Inicia sesión
4. Crea persona: `Tu Nombre`

### Paso 2: Comprar

1. Ve a pestaña **Compras**
2. Agrega productos al carrito
3. Ajusta cantidades
4. **Finalizar Compra**

¡Listo! 🎉

## 🔧 Obtener tu IP Local

**Windows PowerShell:**

```powershell
ipconfig
```

Busca "IPv4 Address" de tu WiFi (ej: 192.168.1.5)

**macOS/Linux:**

```bash
ifconfig
```

## 📊 Verificar que Todo Funciona

✅ Backend: http://localhost:8000/health

```json
{ "status": "ok", "message": "API is running" }
```

✅ Productos: http://localhost:8000/products

```json
[{"_id": "...", "name": "Leche 1L", "price": 1.20}, ...]
```

✅ App: Deberías ver los productos en la pestaña Compras

## 🆘 Problemas Comunes

### Backend no inicia

```powershell
# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall
```

### App no conecta al backend

1. Verifica que backend esté corriendo
2. Usa IP correcta en `src/config.ts`
3. Ambos dispositivos en misma WiFi

### No aparecen productos

```powershell
cd backend
python seed_products.py
```

### Puerto 8000 ocupado

```powershell
# Cambiar puerto
uvicorn app.main:app --reload --port 8001
# Y actualizar src/config.ts
```

## 📚 Documentación Completa

- [README principal](../README.md)
- [Backend README](../backend/README.md)
- [API Docs](http://localhost:8000/docs)

## 💡 Consejos

- **Desarrollo**: Usa `http://10.0.2.2:8000` para Android Emulator
- **Producción**: Despliega backend en Heroku/Railway + MongoDB Atlas
- **Debug**: Revisa consola del backend para ver requests
- **Persistencia**: Los datos se guardan en MongoDB Atlas (permanente)

---

¿Problemas? Revisa la [sección de troubleshooting](../README.md#-solución-de-problemas) en el README principal.
