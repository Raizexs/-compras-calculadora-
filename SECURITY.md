# 🔒 Guía de Seguridad del Proyecto

## ⚠️ Información Sensible Protegida

Este proyecto está configurado para **nunca exponer información sensible** en el repositorio de GitHub.

### 🛡️ Archivos Protegidos por .gitignore

El `.gitignore` está configurado para bloquear:

#### 1. Variables de Entorno
- `.env`
- `.env.*` (development, production, staging, etc.)
- Cualquier archivo que contenga configuraciones sensibles

#### 2. Credenciales y Keys
- `*.key` - Llaves privadas
- `*.pem` - Certificados
- `*.p12`, `*.pfx` - Certificados de firma
- `api-keys.json` - API keys
- `credentials.json` - Credenciales
- `firebase-config.json` - Configuración de Firebase
- `google-services.json` - Servicios de Google
- `GoogleService-Info.plist` - Info de servicios iOS

#### 3. Archivos Nativos Sensibles
- `*.jks` - Keystores de Android
- `*.keystore` - Keystores
- `*.mobileprovision` - Perfiles de provisión iOS

#### 4. Archivos de Build
- `node_modules/` - Dependencias (se instalan con npm/yarn)
- `dist/`, `build/` - Archivos compilados
- `.expo/` - Cache de Expo

## 🔐 Mejores Prácticas de Seguridad

### 1. Variables de Entorno

**✅ HACER:**
```typescript
// Usar variables de entorno para valores sensibles
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

**❌ NO HACER:**
```typescript
// NUNCA hardcodear API keys o secrets
const API_KEY = "sk_live_51abc123..."; // ¡MAL!
const PASSWORD = "miPassword123"; // ¡MAL!
```

### 2. Tasas de Cambio

**Actualmente en el código:**
Las tasas de cambio están hardcodeadas en `app/(tabs)/index.tsx`:

```typescript
const EXCHANGE_RATES = {
  USD_TO_CLP: 950,
  EUR_TO_CLP: 1050,
};
```

**✅ Mejor práctica (para producción):**
```typescript
// Mover a variables de entorno o API
const EXCHANGE_RATES = {
  USD_TO_CLP: Number(process.env.EXPO_PUBLIC_USD_TO_CLP) || 950,
  EUR_TO_CLP: Number(process.env.EXPO_PUBLIC_EUR_TO_CLP) || 1050,
};

// O mejor aún, usar una API de tipos de cambio:
// https://exchangerate-api.com
// https://fixer.io
```

### 3. Configuración de Expo

**app.json o app.config.js:**
- ✅ Datos públicos del proyecto (nombre, versión, etc.)
- ❌ NO incluir API keys directamente
- ✅ Usar referencias a variables de entorno

```javascript
// app.config.js (recomendado para secrets)
export default {
  expo: {
    name: "compras-calculadora",
    extra: {
      apiKey: process.env.API_KEY, // Referencia segura
    }
  }
}
```

### 4. AsyncStorage

**Datos sensibles en el dispositivo:**

```typescript
// ✅ BUENO: Guardar preferencias del usuario
await AsyncStorage.setItem("@currency", "CLP");
await AsyncStorage.setItem("@items", JSON.stringify(items));

// ⚠️ PRECAUCIÓN: No guardar contraseñas o tokens sin encriptar
// Si necesitas guardar datos sensibles, usa:
// - expo-secure-store (para tokens, passwords)
// - react-native-encrypted-storage
```

## 📋 Checklist de Seguridad

Antes de hacer commit, verifica:

- [ ] No hay API keys hardcodeadas en el código
- [ ] Archivos `.env` están en `.gitignore`
- [ ] No hay contraseñas o tokens visibles
- [ ] Credenciales están en archivos ignorados
- [ ] `git status` no muestra archivos sensibles
- [ ] Revisaste el diff antes de hacer push

## 🚨 ¿Expusiste un Secret por Error?

Si accidentalmente subiste información sensible:

### 1. Rotación Inmediata
- Cambia/invalida el API key o secret inmediatamente
- Genera nuevas credenciales

### 2. Limpiar el Historial de Git

```bash
# Método 1: BFG Repo-Cleaner (recomendado)
# Descarga: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files secrets.json
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Método 2: git filter-branch (más complejo)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret/file" \
  --prune-empty --tag-name-filter cat -- --all
```

### 3. Force Push (¡Cuidado!)
```bash
git push origin --force --all
git push origin --force --tags
```

### 4. Notificar
- Informa al equipo si es un proyecto colaborativo
- Cambia todas las credenciales relacionadas

## 🔍 Verificar Seguridad

### Comando útil para buscar secrets accidentales:

```bash
# Buscar posibles API keys (patrones comunes)
git grep -E "api[_-]?key|secret|password|token" -- '*.ts' '*.tsx' '*.js' '*.json'

# Buscar URLs con credenciales
git grep -E "https?://[^:]+:[^@]+@" 

# Verificar si hay archivos sensibles staged
git status --ignored
```

## 📚 Recursos Adicionales

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Expo Security Best Practices](https://docs.expo.dev/guides/security/)
- [React Native Security](https://reactnative.dev/docs/security)
- [Git Secrets Prevention](https://github.com/awslabs/git-secrets)

## 🛠️ Herramientas Recomendadas

- **git-secrets** - Previene commits con secrets
- **truffleHog** - Escanea el repo buscando secrets
- **detect-secrets** - Detecta secrets en el código
- **dotenv** - Manejo seguro de variables de entorno

---

⚡ **Recuerda:** La seguridad es responsabilidad de todos. Mantén este proyecto seguro.
