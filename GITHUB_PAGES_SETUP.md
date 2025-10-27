# 🌐 Activar GitHub Pages - Guía Paso a Paso

## ✅ Landing Page Creada

Ya tienes una landing page profesional en `docs/index.html` que incluye:

- 🎨 **Diseño moderno** con gradientes y animaciones
- 📱 **Responsive** (se adapta a móviles)
- ✨ **Secciones**: Hero, Features, Screenshots, Tech Stack, Instalación
- 🔗 **Links** a tu repositorio
- 💫 **Animaciones** suaves
- 🏷️ **Badges** de tecnologías

## 🚀 Cómo Activar GitHub Pages

### Paso 1: Ve a la Configuración

1. Abre tu navegador
2. Ve a: `https://github.com/Raizexs/-compras-calculadora-`
3. Click en **"Settings"** (⚙️) en la parte superior

### Paso 2: Encuentra Pages

1. En el menú lateral izquierdo, busca **"Pages"**
2. Click en **"Pages"**

### Paso 3: Configurar Source

En la sección **"Build and deployment"**:

1. **Source**: Selecciona `Deploy from a branch`
2. **Branch**:
   - Selecciona `main`
   - Carpeta: `/docs`
3. Click en **"Save"**

### Paso 4: Esperar Deployment

- Espera 2-3 minutos
- Actualiza la página
- Verás un mensaje: **"Your site is live at https://raizexs.github.io/-compras-calculadora-/"**

## 🎉 ¡Listo!

Tu landing page estará disponible en:

```
https://raizexs.github.io/-compras-calculadora-/
```

## 📝 Personalización Futura

### Agregar Screenshots Reales

1. Toma capturas de tu app con:

   - Android/iOS emulador
   - Expo Go en tu teléfono

2. Guárdalas en `docs/images/`:

   ```
   docs/
   ├── index.html
   └── images/
       ├── screenshot1.png
       ├── screenshot2.png
       └── screenshot3.png
   ```

3. Actualiza `index.html`:
   ```html
   <!-- Reemplaza los placeholders por: -->
   <img
     src="images/screenshot1.png"
     class="screenshot-img"
     alt="Screenshot 1"
   />
   ```

### Agregar un Video Demo

```html
<!-- Agrega esto en la sección de screenshots -->
<video width="300" controls>
  <source src="demo.mp4" type="video/mp4" />
</video>
```

### Cambiar Colores

En el `<style>` de `index.html`, busca:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Puedes cambiar los colores usando:

- https://cssgradient.io/
- https://coolors.co/

## 🔗 Agregar al README

Actualiza tu README.md agregando:

```markdown
## 🌐 Demo Online

🔗 [Ver Landing Page](https://raizexs.github.io/-compras-calculadora-/)
```

## 🎯 Beneficios

✅ **Portfolio**: Link directo para mostrar en CV
✅ **Profesional**: Demuestra tus habilidades frontend
✅ **Compartir**: Fácil de mostrar a reclutadores/amigos
✅ **SEO**: Google indexará tu proyecto
✅ **Gratis**: Hosting ilimitado por GitHub

## 🐛 Solución de Problemas

### "404 - Page not found"

- Espera 5 minutos más
- Verifica que la carpeta sea `/docs` no `/root`
- Asegúrate que el archivo se llame `index.html`

### No se ven los estilos

- Verifica que todo el CSS esté en el mismo archivo HTML
- No uses rutas absolutas (`/images/`) sino relativas (`images/`)

### Cambios no se reflejan

- Espera 2-3 minutos después del push
- GitHub Pages tiene un pequeño delay de cache
- Puedes forzar refresh: Ctrl + F5

## 📊 Analytics (Opcional)

Para ver cuánta gente visita tu página:

1. Crea cuenta en [Google Analytics](https://analytics.google.com/)
2. Obtén tu código de tracking
3. Agrégalo antes de `</head>` en `index.html`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

---

¡Tu proyecto ahora tiene presencia web profesional! 🚀
