# 🛒 App de Compras - Full Stack

Una aplicación móvil completa de compras con backend FastAPI y MongoDB Atlas, construida con React Native y Expo.

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 🚀 Inicio Rápido

| Acción                      | Enlace                             | Tiempo |
| ---------------------------- | ---------------------------------- | ------ |
| ⚡ Comenzar ahora            | [QUICK_START.md](docs/QUICK_START.md) | 15 min |
| 📚 Ver documentación        | [Índice de Docs](docs/README.md)     | -      |
| 🏗️ Estructura del proyecto | [STRUCTURE.md](docs/STRUCTURE.md)     | -      |
| 🔌 Referencia de API         | [API_DOCS.md](docs/API_DOCS.md)       | -      |

---

## 📋 Descripción del Proyecto

Sistema completo de compras que permite:

- 🔐 Registro y autenticación de usuarios (demo)
- 👤 Gestión de perfiles de personas
- 📦 Catálogo de productos desde MongoDB
- 🛒 Carrito de compras con cálculo de totales
- 💾 Persistencia de compras en base de datos
- 💰 Consultas de totales por persona

## 🏗️ Arquitectura

```
┌─────────────────────┐
│   App Móvil (Expo)  │
│   React Native      │
└──────────┬──────────┘
           │ Axios
           │ HTTP/JSON
           ▼
┌─────────────────────┐
│   Backend FastAPI   │
│   Python Async      │
└──────────┬──────────┘
           │ Motor
           │ (Async Driver)
           ▼
┌─────────────────────┐
│  MongoDB Atlas      │
│  Cloud Database     │
└─────────────────────┘
```

## ✨ Características

### App Móvil

- ✅ Interfaz moderna y responsive
- ✅ Autenticación con persistencia local
- ✅ Carrito de compras interactivo
- ✅ Actualización en tiempo real
- ✅ Indicadores de carga y estados
- ✅ Manejo de errores elegante

### Backend API

- ✅ 8 endpoints REST
- ✅ Validaciones con Pydantic
- ✅ Motor async para MongoDB
- ✅ CORS habilitado
- ✅ Documentación automática (Swagger)
- ✅ Manejo de errores HTTP

### Base de Datos

- ✅ 4 colecciones: users, persons, products, purchases
- ✅ Relaciones con ObjectId
- ✅ Agregaciones para totales
- ✅ Cloud hosting en Atlas

## 🚀 Instalación

> **¿Primera vez?** Sigue la [Guía de Inicio Rápido (15 min)](./docs/QUICK_START.md) 🎯

### Requisitos Previos

- **Node.js** 18+ y npm
- **Python** 3.11+
- **Cuenta MongoDB Atlas** (gratuita)
- **Expo Go** app (para móvil)

### Instalación Básica

```bash
# 1. Clonar repositorio
git clone https://github.com/Raizexs/-compras-calculadora-.git
cd compras-calculadora

# 2. Backend - Configurar y ejecutar
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
# Configurar .env con tu MongoDB URI
uvicorn app.main:app --reload

# 3. Frontend - En otra terminal
cd ../frontend
npm install
# Configurar src/config.ts con IP del backend
npx expo start
```

📖 **Guías detalladas**:

- [📦 Instalación completa](./docs/INSTALL.md)
- [🚀 Inicio rápido](./docs/QUICK_START.md)
- [🛠️ Comandos útiles](./docs/COMMANDS.md)

### Configuración de MongoDB Atlas (Resumen)

1. Crea cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea cluster M0 (gratuito)
3. Crea usuario con permisos ReadWrite
4. Whitelist tu IP (0.0.0.0/0 para desarrollo)
5. Obtén URI de conexión
6. Configura `.env` en la carpeta `backend/`

📖 [Ver guía detallada](./docs/QUICK_START.md#1️⃣-mongodb-atlas-5-minutos)

## 📱 Uso de la Aplicación

### 1. Crear Cuenta y Perfil

1. Abre la app
2. Ve a la pestaña **"Perfil"**
3. Haz clic en **"Registrarse"**
4. Ingresa:
   - Email: `tu@email.com`
   - Contraseña: `123456`
5. Inicia sesión con las mismas credenciales
6. Crea una **Persona** (ej: "Juan Pérez")

### 2. Realizar Compras

1. Ve a la pestaña **"Compras"**
2. Verás el catálogo de productos
3. Presiona **"Agregar"** en los productos que desees
4. Ajusta las cantidades con los botones **+** y **−**
5. Revisa el total en la tarjeta superior
6. Presiona **"Finalizar Compra"**
7. Confirma la compra

### 3. Ver Historial

- Usa la API para consultar el historial de compras por persona
- Endpoint: `GET /purchases/person/{person_id}`

## 🔌 API Endpoints

**8 endpoints REST** organizados en 4 categorías:

| Categoría   | Endpoints                                                                    | Documentación                                  |
| ------------ | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| 🔐 Auth      | `POST /auth/register`, `POST /auth/login`                                | [Ver detalles](./docs/API_DOCS.md#-autenticación) |
| 👤 Persons   | `POST /persons`, `GET /persons/{id}`, `GET /persons`                   | [Ver detalles](./docs/API_DOCS.md#-personas)       |
| 📦 Products  | `GET /products`, `GET /products/{id}`, `POST /products`                | [Ver detalles](./docs/API_DOCS.md#-productos)      |
| 🛒 Purchases | `POST /purchases`, `GET /purchases/{id}`, `GET /purchases/person/{id}` | [Ver detalles](./docs/API_DOCS.md#-compras)        |

📖 **Documentación completa**:

- [API Reference con ejemplos](./docs/API_DOCS.md)
- [Swagger UI](http://localhost:8000/docs) (cuando el servidor esté corriendo)

## 📂 Estructura del Proyecto

```
compras-calculadora/
│
├── 📱 frontend/                # Aplicación móvil (React Native + Expo)
│   ├── app/                   # Pantallas y rutas
│   │   ├── (tabs)/           # Navegación por pestañas
│   │   │   ├── index.tsx     # 🧮 Calculadora original
│   │   │   ├── shopping.tsx  # 🛒 Compras con API
│   │   │   └── explore.tsx   # 👤 Auth y perfil
│   │   └── _layout.tsx       # Layout principal
│   │
│   ├── components/           # Componentes reutilizables
│   ├── src/                  # Servicios y config
│   │   ├── config.ts         # ⚙️ Config de API
│   │   └── services/
│   │       └── api.ts        # 📡 Cliente Axios
│   │
│   ├── assets/               # Imágenes y recursos
│   ├── constants/            # Constantes y tema
│   ├── hooks/                # Custom hooks
│   ├── package.json          # Dependencias npm
│   └── README.md            # Docs del frontend
│
├── ⚡ backend/                # Backend FastAPI + MongoDB
│   ├── app/
│   │   ├── main.py          # 🌐 8 endpoints REST
│   │   ├── models.py        # 📋 Modelos Pydantic
│   │   └── database.py      # 🗄️ Conexión MongoDB
│   │
│   ├── .env                 # 🔐 Variables (NO en git)
│   ├── .env.example         # Template de .env
│   ├── seed_products.py     # 🌱 Carga de datos
│   ├── requirements.txt     # 📦 Dependencias Python
│   └── README.md           # Docs del backend
│
├── 📚 docs/                  # Documentación completa
│   ├── README.md            # 📑 Índice de docs
│   ├── QUICK_START.md       # 🚀 Guía rápida (15 min)
│   ├── INSTALL.md           # 📦 Instalación detallada
│   ├── API_DOCS.md          # 📡 Referencia API
│   ├── COMMANDS.md          # 🛠️ Comandos útiles
│   ├── STRUCTURE.md         # 📁 Estructura detallada
│   └── IMPLEMENTATION.md    # ✅ Resumen técnico
│
├── 📄 README.md             # Este archivo
├──  LICENSE               # Licencia MIT
└── 🔧 .gitignore            # Archivos ignorados
```

📖 **Ver detalles**: [Estructura completa con diagramas](./docs/STRUCTURE.md)

## 🗄️ Base de Datos MongoDB

### 4 Colecciones

**users** → Autenticación

```json
{"_id": ObjectId("..."), "email": "user@example.com", "password": "123456"}
```

**persons** → Perfiles de compra

```json
{"_id": ObjectId("..."), "name": "Juan Pérez"}
```

**products** → Catálogo (15 items)

```json
{"_id": ObjectId("..."), "name": "Leche 1L", "price": 1.20}
```

**purchases** → Compras con totales

```json
{
  "_id": ObjectId("..."),
  "person_id": ObjectId("..."),
  "items": [{"product_id": ObjectId("..."), "name": "Leche", "price": 1.20, "quantity": 2}],
  "total": 2.40
}
```

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React Native** 0.76.5 - Framework móvil
- **Expo** ~54.0.13 - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Axios** 1.7.9 - Cliente HTTP
- **AsyncStorage** - Persistencia local

### Backend

- **FastAPI** 0.115.0 - Framework web async
- **Motor** 3.6.0 - Driver async de MongoDB
- **Pydantic** 2.9.2 - Validación de datos
- **Uvicorn** - Servidor ASGI
- **Python** 3.11+

### Base de Datos

- **MongoDB Atlas** - Base de datos NoSQL en la nube (M0 gratuito)

## 🔐 Notas de Seguridad

⚠️ **IMPORTANTE**: Esta es una versión **demo para propósitos educativos**.

En producción, deberías:

- ✅ Usar **bcrypt** para hashear contraseñas
- ✅ Implementar **JWT** para autenticación
- ✅ Validar permisos y roles
- ✅ Usar HTTPS en producción
- ✅ Configurar CORS con orígenes específicos
- ✅ Implementar rate limiting
- ✅ Agregar logging y monitoreo

## 🐛 Solución de Problemas

### Problemas Comunes

| Problema                     | Solución Rápida                         | Documentación                                        |
| ---------------------------- | ----------------------------------------- | ----------------------------------------------------- |
| Backend no conecta a MongoDB | Verifica `.env` y whitelist de IP       | [Ver detalles](./docs/INSTALL.md#⚠️-problemas-comunes) |
| App no conecta al backend    | Usa `http://10.0.2.2:8000` para Android | [Ver guía](./docs/QUICK_START.md#-obtener-tu-ip-local)  |
| No aparecen productos        | Ejecuta `python seed_products.py`       | [Ver comandos](./docs/COMMANDS.md#-backend-fastapi)      |
| Error de módulos Python     | `pip install -r requirements.txt`       | [Ver instalación](./docs/INSTALL.md#-backend-python)    |
| Error de módulos Node       | `npm install` o borrar `node_modules` | [Ver instalación](./docs/INSTALL.md#-frontend-nodejs)   |

📖 **Más ayuda**: [Guía completa de troubleshooting](./docs/INSTALL.md#⚠️-problemas-comunes)

## 📚 Documentación

### Guías Disponibles

| Documento                                   | Descripción                      | Tiempo |
| ------------------------------------------- | --------------------------------- | ------ |
| [🚀 Quick Start](./docs/QUICK_START.md)        | Inicio rápido del proyecto       | 15 min |
| [📦 Instalación](./docs/INSTALL.md)           | Guía de instalación detallada   | -      |
| [📡 API Docs](./docs/API_DOCS.md)              | Referencia completa de endpoints  | -      |
| [🛠️ Comandos](./docs/COMMANDS.md)            | Comandos útiles para desarrollo  | -      |
| [📁 Estructura](./docs/STRUCTURE.md)           | Estructura detallada del proyecto | -      |
| [✅ Implementación](./docs/IMPLEMENTATION.md) | Resumen técnico del proyecto     | -      |
| [📱 Frontend README](./frontend/README.md)     | Documentación del frontend       | -      |
| [⚡ Backend README](./backend/README.md)       | Documentación del backend        | -      |

📖 **Índice completo**: [docs/README.md](./docs/README.md)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**Ryzek**

- GitHub: [@Raizexs](https://github.com/Raizexs)

## 🎓 Proyecto Académico

Desarrollado para el curso de **Desarrollo Web y Móvil** - Universidad Andrés Bello (UNAB)

---

⭐️ Si este proyecto te fue útil, considera darle una estrella en GitHub!
