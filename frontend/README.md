# 📱 Frontend - App de Compras

Aplicación móvil construida con **React Native** y **Expo**.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npx expo start
```

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Expo CLI
- Android Studio (para Android) o Xcode (para iOS)

## ⚙️ Configuración

1. **Configurar URL del Backend**

   Edita `src/config.ts`:

   ```typescript
   export const API_CONFIG = {
     BASE_URL: "http://TU_IP:8000", // Cambia por tu IP local
   };
   ```

2. **Para Android Emulator**: `http://10.0.2.2:8000`
3. **Para dispositivo físico**: Tu IP local (ej: `http://192.168.1.100:8000`)

## 📁 Estructura

```
frontend/
├── app/                    # Pantallas de la app
│   └── (tabs)/            # Navegación por pestañas
│       ├── index.tsx      # 🧮 Calculadora
│       ├── explore.tsx    # 👤 Auth/Perfil
│       └── shopping.tsx   # 🛒 Compras
├── components/            # Componentes reutilizables
├── src/
│   ├── config.ts         # ⚙️ Configuración
│   └── services/
│       └── api.ts        # 📡 Cliente API
├── assets/               # Imágenes y recursos
├── constants/            # Constantes y tema
└── hooks/                # Custom hooks
```

## 🔗 Pantallas

### 🧮 Calculadora (`index.tsx`)

- Calculadora local sin conexión a API
- Funcionalidad original del template

### 👤 Autenticación (`explore.tsx`)

- Login y registro de usuarios
- Creación de perfiles de personas
- Persistencia con AsyncStorage

### 🛒 Compras (`shopping.tsx`)

- Catálogo de productos desde API
- Carrito de compras
- Checkout y confirmación
- Historial de compras por persona

## 📦 Dependencias Principales

- `expo`: ~54.0.13
- `react-native`: 0.76.5
- `axios`: ^1.7.9
- `@react-native-async-storage/async-storage`: 2.1.0
- `expo-router`: ~4.0.14

## 🛠️ Comandos

```bash
# Desarrollo
npx expo start              # Iniciar dev server
npx expo start --clear      # Limpiar cache

# Plataformas específicas
npx expo start --android    # Solo Android
npx expo start --ios        # Solo iOS
npx expo start --web        # Solo Web

# Producción
npx expo export             # Exportar para producción
eas build --platform android # Build con EAS
```

## 🐛 Troubleshooting

| Problema                   | Solución                                    |
| -------------------------- | ------------------------------------------- |
| "Network request failed"   | Verifica `src/config.ts` con la IP correcta |
| "Unable to resolve module" | Ejecuta `npm install` y reinicia            |
| Cache issues               | `npx expo start --clear`                    |
| Android no conecta         | Usa `http://10.0.2.2:8000`                  |

## 📖 Más información

- Ver [documentación completa](../docs/README.md)
- Ver [referencia de API](../docs/API_DOCS.md)
- Ver [guía de instalación](../docs/INSTALL.md)
