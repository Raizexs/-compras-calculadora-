# 📁 Estructura del Proyecto - Vista Detallada

Esta es una vista completa y organizada de la estructura del proyecto.

## 🌳 Árbol de Directorios

```
compras-calculadora/
│
├── 📱 FRONTEND (React Native + Expo)
│   │
│   ├── app/                          # Aplicación principal
│   │   ├── (tabs)/                  # Navegación por pestañas
│   │   │   ├── _layout.tsx         # ⚙️ Layout de tabs
│   │   │   ├── index.tsx           # 🧮 Calculadora original (local)
│   │   │   ├── shopping.tsx        # 🛒 Compras con API (NUEVO)
│   │   │   └── explore.tsx         # 👤 Autenticación y perfil (MODIFICADO)
│   │   │
│   │   ├── _layout.tsx             # ⚙️ Layout raíz
│   │   └── modal.tsx               # 📝 Modal de ejemplo
│   │
│   ├── assets/                      # Recursos estáticos
│   │   └── images/                 # 🖼️ Imágenes
│   │
│   ├── components/                  # Componentes reutilizables
│   │   ├── ui/                     # Componentes UI base
│   │   ├── external-link.tsx
│   │   ├── haptic-tab.tsx
│   │   ├── hello-wave.tsx
│   │   ├── parallax-scroll-view.tsx
│   │   ├── themed-text.tsx
│   │   └── themed-view.tsx
│   │
│   ├── constants/                   # Constantes y configuración
│   │   └── theme.ts                # 🎨 Tema y colores
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme-color.ts
│   │
│   ├── src/                         # 🔧 SERVICIOS (NUEVO)
│   │   ├── config.ts               # ⚙️ Configuración API
│   │   └── services/
│   │       └── api.ts              # 📡 Cliente Axios
│   │
│   ├── scripts/                     # Scripts de utilidad
│   │   └── reset-project.js
│   │
│   ├── app.js                       # Entry point (Expo)
│   ├── app.json                     # Configuración Expo
│   ├── eas.json                     # Configuración EAS Build
│   ├── eslint.config.js            # Configuración ESLint
│   ├── expo-env.d.ts               # Types de Expo
│   ├── package.json                # 📦 Dependencias Node.js
│   ├── package-lock.json           # Lock de dependencias
│   └── tsconfig.json               # Configuración TypeScript
│
├── ⚡ BACKEND (FastAPI + MongoDB)
│   │
│   ├── backend/
│   │   │
│   │   ├── app/                    # Aplicación FastAPI
│   │   │   ├── __init__.py        # Package marker
│   │   │   ├── main.py            # 🌐 8 Endpoints REST + CORS
│   │   │   ├── models.py          # 📋 Modelos Pydantic v2
│   │   │   └── database.py        # 🗄️ Conexión async con Motor
│   │   │
│   │   ├── .env                    # 🔐 Variables de entorno (NO en git)
│   │   ├── .env.example           # Template de .env
│   │   ├── .gitignore             # Archivos ignorados
│   │   ├── seed_products.py       # 🌱 Script de carga de datos
│   │   ├── requirements.txt       # 📦 Dependencias Python
│   │   └── README.md              # 📖 Docs del backend
│   │
│   └── venv/                       # Entorno virtual Python (NO en git)
│
├── 📚 DOCUMENTACIÓN
│   │
│   ├── docs/
│   │   ├── README.md               # 📑 Índice de documentación
│   │   ├── QUICK_START.md          # 🚀 Inicio rápido (15 min)
│   │   ├── INSTALL.md              # 📦 Guía de instalación
│   │   ├── API_DOCS.md             # 📡 Referencia API completa
│   │   ├── COMMANDS.md             # 🛠️ Comandos útiles
│   │   └── IMPLEMENTATION.md       # ✅ Resumen técnico
│   │
│   └── README.md                   # 📄 Documentación principal
│
├── 🔧 CONFIGURACIÓN
│   │
│   ├── .expo/                      # Cache de Expo (NO en git)
│   ├── .git/                       # Repositorio Git
│   ├── .github/                    # Configuración GitHub
│   ├── .gitignore                  # Archivos ignorados por Git
│   ├── .vscode/                    # Configuración VS Code
│   ├── LICENSE                     # Licencia MIT
│   └── node_modules/               # Dependencias npm (NO en git)
│
└── 📊 OTROS
    └── STRUCTURE.md                # 📁 Este archivo
```

## 🎯 Archivos Clave por Funcionalidad

### 🔐 Autenticación

- `app/(tabs)/explore.tsx` - Pantalla de login/registro
- `backend/app/main.py` - Endpoints `/auth/register` y `/auth/login`
- `backend/app/models.py` - Modelos `UserIn`, `UserOut`, `UserLogin`
- `src/services/api.ts` - Función `authAPI.login()` y `authAPI.register()`

### 🛒 Sistema de Compras

- `app/(tabs)/shopping.tsx` - Pantalla de catálogo y carrito
- `backend/app/main.py` - Endpoints de products y purchases
- `backend/app/models.py` - Modelos `ProductOut`, `PurchaseIn`, `PurchaseOut`
- `src/services/api.ts` - Funciones `productsAPI.*` y `purchasesAPI.*`

### 🗄️ Base de Datos

- `backend/app/database.py` - Conexión async a MongoDB
- `backend/.env` - URI de conexión (configurar)
- `backend/seed_products.py` - Carga inicial de productos

### ⚙️ Configuración

- `src/config.ts` - URL del backend (IMPORTANTE: configurar IP)
- `backend/.env` - Variables de entorno del backend
- `app.json` - Configuración de Expo
- `tsconfig.json` - Configuración de TypeScript

## 📏 Tamaño Aproximado

```
Total del proyecto: ~150 MB
├── node_modules/       ~140 MB (puede variar)
├── backend/venv/       ~8 MB
├── Código fuente       ~2 MB
├── Documentación       ~100 KB
└── Assets              ~50 KB
```

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE LA APLICACIÓN                    │
└─────────────────────────────────────────────────────────────┘

1. Usuario abre app
   │
   └─> app/(tabs)/explore.tsx
       ├─> Lee AsyncStorage (¿ya logueado?)
       │   ├─ SÍ → Muestra perfil
       │   └─ NO → Muestra login
       │
       └─> Login/Register
           └─> src/services/api.ts (authAPI)
               └─> HTTP POST → backend/app/main.py
                   └─> MongoDB Atlas (users collection)

2. Usuario navega a Compras
   │
   └─> app/(tabs)/shopping.tsx
       └─> Carga productos
           └─> src/services/api.ts (productsAPI.list())
               └─> HTTP GET → backend/app/main.py
                   └─> MongoDB Atlas (products collection)

3. Usuario agrega al carrito (local en memoria + AsyncStorage)

4. Usuario finaliza compra
   │
   └─> app/(tabs)/shopping.tsx
       └─> Crea compra
           └─> src/services/api.ts (purchasesAPI.create())
               └─> HTTP POST → backend/app/main.py
                   ├─> Calcula total
                   └─> MongoDB Atlas (purchases collection)
```

## 🎨 Convenciones de Nombres

### Archivos TypeScript

- Componentes: `PascalCase.tsx` (ej: `ThemedView.tsx`)
- Utilidades: `kebab-case.ts` (ej: `use-color-scheme.ts`)
- Configuración: `camelCase.ts` (ej: `config.ts`)

### Archivos Python

- Módulos: `snake_case.py` (ej: `seed_products.py`)
- Clases: `PascalCase` en el código

### Carpetas

- Todas en minúsculas: `components/`, `constants/`, `hooks/`
- Con paréntesis para grupos de rutas: `(tabs)/`

## 🔍 Archivos Importantes a Configurar

Antes de ejecutar el proyecto, configura estos archivos:

1. **backend/.env**

   ```env
   MONGODB_URI=mongodb+srv://...  # Tu URI de MongoDB Atlas
   DATABASE_NAME=shopping_app_db
   ```

2. **src/config.ts**
   ```typescript
   BASE_URL: "http://10.0.2.2:8000"; // Para Android Emulator
   // O tu IP local para dispositivo físico
   ```

## 📦 Archivos que NO deben estar en Git

Estos archivos están en `.gitignore`:

- `backend/.env` - Credenciales sensibles
- `backend/venv/` - Entorno virtual Python
- `node_modules/` - Dependencias npm
- `.expo/` - Cache de Expo
- `*.pyc` - Archivos compilados Python
- `__pycache__/` - Cache Python

## 🚀 Próximos Archivos a Crear (Opcional)

Para expandir el proyecto:

- `app/(tabs)/history.tsx` - Historial de compras
- `app/(tabs)/profile.tsx` - Perfil detallado
- `backend/app/auth.py` - Separar lógica de auth
- `backend/app/config.py` - Config separada
- `backend/tests/` - Tests unitarios
- `app/__tests__/` - Tests de componentes
- `.github/workflows/ci.yml` - CI/CD

---

📖 **Ver más**: [Índice de documentación](./README.md)
