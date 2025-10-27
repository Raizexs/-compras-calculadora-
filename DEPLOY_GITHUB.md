# 📤 Guía para Subir el Proyecto a GitHub

## Opción 1: Crear un Nuevo Repositorio (Recomendado)

### Paso 1: Crear el repositorio en GitHub
1. Ve a [github.com](https://github.com) e inicia sesión
2. Click en el botón `+` en la esquina superior derecha
3. Selecciona `New repository`
4. Configura tu repositorio:
   - **Repository name:** `compras-calculadora`
   - **Description:** `🛒 Aplicación móvil para gestionar compras con conversión de monedas (CLP, USD, EUR)`
   - **Public** o **Private** (según tu preferencia)
   - ❌ **NO marques** "Initialize this repository with a README" (ya tenemos uno)
5. Click en `Create repository`

### Paso 2: Inicializar Git localmente (si no está inicializado)

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "🎉 Initial commit: Calculadora de Compras con React Native"

# Renombrar la rama principal a 'main'
git branch -M main
```

### Paso 3: Conectar con GitHub y subir

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub:

```powershell
# Agregar el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/compras-calculadora.git

# Subir el código
git push -u origin main
```

## Opción 2: Si ya existe un repositorio Git

```powershell
# Verificar el estado actual
git status

# Agregar cambios
git add .

# Commit de cambios
git commit -m "✨ Feat: Calculadora completa con UI mejorada"

# Push a GitHub
git push origin main
```

## 🔐 Autenticación en GitHub

Si te pide usuario y contraseña, necesitas usar un **Personal Access Token**:

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en `Generate new token`
3. Dale un nombre descriptivo (ej: "Compras Calculator")
4. Selecciona los scopes: `repo` (todos los permisos de repositorio)
5. Click en `Generate token`
6. **COPIA EL TOKEN** (no podrás verlo de nuevo)
7. Usa el token como contraseña cuando Git te lo pida

### Alternativa: Usar GitHub CLI

```powershell
# Instalar GitHub CLI (si no lo tienes)
winget install GitHub.cli

# Autenticarte
gh auth login

# Crear y subir el repositorio
gh repo create compras-calculadora --public --source=. --push
```

## 📋 Verificaciones Previas

Antes de subir, verifica que estos archivos importantes estén en orden:

- ✅ `README.md` - Documentación completa
- ✅ `.gitignore` - Archivos a ignorar
- ✅ `package.json` - Dependencias del proyecto
- ✅ `app.json` - Configuración de Expo

## 🚫 Archivos que NO deben subirse

El `.gitignore` ya está configurado para ignorar:

```
node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env
.env.*
```

## 📝 Mensajes de Commit Recomendados

Usa commits descriptivos con emojis:

```powershell
git commit -m "✨ Feat: Agregar conversión de monedas"
git commit -m "🎨 Style: Mejorar interfaz con nuevo diseño"
git commit -m "🐛 Fix: Corregir cálculo del total"
git commit -m "📝 Docs: Actualizar README"
git commit -m "♻️ Refactor: Optimizar función de formato"
git commit -m "🔧 Config: Actualizar tasas de cambio"
```

## 🌟 Después de Subir

1. **Agrega topics/tags** a tu repositorio:
   - `react-native`
   - `expo`
   - `typescript`
   - `mobile-app`
   - `calculator`
   - `currency-converter`

2. **Configura GitHub Pages** (opcional, para documentación)

3. **Agrega un archivo LICENSE** (MIT recomendado):
   ```powershell
   # Crear archivo LICENSE con licencia MIT
   # Ve a: Add file → Create new file → Nombra "LICENSE"
   # GitHub te ofrecerá plantillas de licencias
   ```

4. **Considera agregar GitHub Actions** para CI/CD

## 🔄 Actualizaciones Futuras

Cuando hagas cambios:

```powershell
# Ver cambios
git status

# Agregar cambios
git add .

# Commit
git commit -m "✨ Descripción del cambio"

# Push
git push
```

## 🆘 Solución de Problemas

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/compras-calculadora.git
```

### Error: "failed to push some refs"
```powershell
git pull origin main --rebase
git push origin main
```

### Deshacer último commit (sin perder cambios)
```powershell
git reset --soft HEAD~1
```

## 📱 Badge del Proyecto

Después de subir, agrega estos badges al README (ya incluidos):

```markdown
![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
```

---

¡Listo! Tu proyecto estará en GitHub para que otros lo vean, usen y contribuyan. 🚀
