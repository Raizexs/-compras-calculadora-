# 📦 Instalación de Dependencias

Este documento te guía para instalar todas las dependencias necesarias del proyecto.

## 🎯 Backend (Python)

### 1. Crear Entorno Virtual

**Windows PowerShell:**

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows CMD:**

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar Dependencias Python

```bash
pip install -r requirements.txt
```

Esto instalará:

- ✅ `fastapi` - Framework web async
- ✅ `uvicorn[standard]` - Servidor ASGI
- ✅ `motor` - Driver async de MongoDB
- ✅ `pydantic` - Validación de datos
- ✅ `pydantic-settings` - Configuración
- ✅ `python-dotenv` - Variables de entorno

### 3. Verificar Instalación

```bash
python -c "import fastapi, motor, pydantic; print('✅ Todo OK')"
```

### ⚠️ Problemas Comunes

**Error: "pip no se reconoce"**

```bash
python -m pip install -r requirements.txt
```

**Error: "No module named venv"**

```bash
# Instalar python-venv (Linux)
sudo apt-get install python3-venv
```

**Error de permisos (Windows)**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🎯 Frontend (Node.js)

### 1. Instalar Dependencias Node

En la **raíz del proyecto**:

```bash
npm install
```

Esto instalará:

- ✅ `axios` - Cliente HTTP
- ✅ `expo` - Framework móvil
- ✅ `react-native` - Framework UI
- ✅ `@react-native-async-storage/async-storage` - Almacenamiento local
- ✅ Y todas las demás dependencias del `package.json`

### 2. Verificar Instalación

```bash
npx expo --version
```

Deberías ver la versión de Expo instalada.

### ⚠️ Problemas Comunes

**Error: "npm no se reconoce"**

- Instala Node.js desde https://nodejs.org/

**Error: módulos corruptos**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Error en Windows con scripts largos**

```powershell
npm install --legacy-peer-deps
```

## 🔍 Verificación Completa

### Backend

```bash
cd backend
python -c "import fastapi, motor, pydantic; print('✅ Backend OK')"
```

### Frontend

```bash
npm list axios
# Deberías ver: axios@1.7.9
```

## 📊 Resumen de Versiones

### Python (Backend)

```
Python >= 3.11
fastapi == 0.115.0
motor == 3.6.0
pydantic == 2.9.2
```

### Node.js (Frontend)

```
Node.js >= 18
npm >= 9
axios >= 1.7.9
expo ~54.0.13
react-native 0.81.4
```

## 🚀 Siguiente Paso

Una vez instaladas todas las dependencias:

1. ✅ Configura MongoDB Atlas
2. ✅ Crea el archivo `.env` en backend
3. ✅ Ejecuta `python seed_products.py`
4. ✅ Inicia el backend: `uvicorn app.main:app --reload`
5. ✅ Configura `src/config.ts` con la URL de tu API
6. ✅ Inicia el frontend: `npx expo start`

Ver [QUICK_START.md](./QUICK_START.md) para la guía completa.

## 💡 Consejos

- **Siempre activa el venv** antes de trabajar con Python
- **Usa `pip list`** para ver paquetes instalados en Python
- **Usa `npm list --depth=0`** para ver paquetes en Node.js
- **Reinstala si hay problemas**: `pip install -r requirements.txt --force-reinstall`

## 🆘 ¿Necesitas Ayuda?

1. Verifica que tengas Python 3.11+ y Node.js 18+
2. Revisa los logs de error completos
3. Busca el error específico en Google
4. Consulta la [documentación oficial](../README.md)

---

¡Éxito con la instalación! 🎉
