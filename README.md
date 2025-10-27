# 🛒 Calculadora de Compras

Una aplicación móvil moderna y elegante para gestionar y calcular tus compras con soporte multimoneda, construida con React Native y Expo.

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Características

### 💱 Conversión de Monedas
- Soporte para **CLP** (Peso Chileno), **USD** (Dólar Estadounidense) y **EUR** (Euro)
- Conversión automática entre monedas con tasas de cambio configurables
- Visualización inteligente: muestra conversión a CLP cuando seleccionas esa moneda

### 💾 Persistencia de Datos
- Almacenamiento local con AsyncStorage
- Guarda automáticamente tu lista de productos
- Recupera tus datos al abrir la aplicación

### 🎨 Interfaz Moderna
- Diseño limpio y profesional
- Cards con sombras y bordes redondeados
- Paleta de colores cuidadosamente seleccionada
- Iconos emoji para mejor UX
- Estados visuales claros (habilitado/deshabilitado)

### 📊 Funcionalidades
- ➕ Agregar productos con nombre y precio
- 🗑️ Eliminar productos (mantener presionado)
- 🧹 Limpiar toda la lista con un botón
- 📈 Cálculo automático del total
- 🔢 Contador de productos
- 💰 Formato de números según moneda (2 decimales)

## 📱 Capturas de Pantalla

```
┌─────────────────────────┐
│  🛒 Calculadora         │
│  Gestiona tus gastos    │
├─────────────────────────┤
│ Moneda: [CLP ▼] 🗑️     │
│ [Producto] [Precio]     │
│ [➕ Agregar Producto]   │
├─────────────────────────┤
│   Total a Pagar         │
│   CLP 150.000,00       │
│   3 productos           │
├─────────────────────────┤
│ 📦 Laptop               │
│    $1.000 (CLP 950k)   │
├─────────────────────────┤
│ 📦 Mouse                │
│    CLP 50.000,00       │
└─────────────────────────┘
```

## 🚀 Comenzando

### Prerequisitos

- Node.js (v14 o superior)
- npm o yarn
- Expo CLI
- Expo Go app (para pruebas en dispositivo físico)

### Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/TU_USUARIO/compras-calculadora.git
cd compras-calculadora
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Instala las dependencias específicas**
```bash
npx expo install @react-native-async-storage/async-storage @react-native-picker/picker
```

4. **Inicia el proyecto**
```bash
npx expo start
```

5. **Ejecuta en tu dispositivo**
   - Escanea el código QR con la app Expo Go (Android/iOS)
   - O presiona `a` para Android emulator
   - O presiona `i` para iOS simulator

## 🛠️ Tecnologías Utilizadas

- **[React Native](https://reactnative.dev/)** - Framework para aplicaciones móviles
- **[Expo](https://expo.dev/)** - Plataforma para desarrollo React Native
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para JavaScript
- **[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)** - Almacenamiento local persistente
- **[@react-native-picker/picker](https://github.com/react-native-picker/picker)** - Selector de opciones nativo

## 📂 Estructura del Proyecto

```
compras-calculadora/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Pantalla principal (Calculadora)
│   │   ├── explore.tsx         # Pantalla de exploración
│   │   └── _layout.tsx         # Layout de tabs
│   ├── _layout.tsx             # Layout principal
│   └── modal.tsx               # Modal
├── assets/                     # Recursos (imágenes, iconos)
├── components/                 # Componentes reutilizables
├── constants/                  # Constantes y temas
├── hooks/                      # Custom hooks
├── scripts/                    # Scripts de utilidad
├── app.json                    # Configuración de Expo
├── package.json               # Dependencias
├── tsconfig.json              # Configuración TypeScript
└── README.md                  # Este archivo
```

## 💡 Uso

### Agregar un Producto
1. Selecciona la moneda deseada (CLP, USD, EUR)
2. Escribe el nombre del producto
3. Ingresa el precio
4. Presiona "➕ Agregar Producto"

### Eliminar un Producto
- Mantén presionado el producto que deseas eliminar

### Limpiar Lista
- Presiona el botón "🗑️ Limpiar" en la parte superior

### Cambiar Moneda
- Selecciona una moneda diferente del desplegable
- Los precios se convertirán automáticamente

## ⚙️ Configuración

### Tasas de Cambio

Puedes modificar las tasas de cambio en `app/(tabs)/index.tsx`:

```typescript
const EXCHANGE_RATES = {
  USD_TO_CLP: 950,    // 1 USD = 950 CLP
  EUR_TO_CLP: 1050,   // 1 EUR = 1050 CLP
};
```

### Personalización de Colores

Los colores principales están definidos en los estilos:

```typescript
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4f46e5", // Morado índigo
  },
  addButton: {
    backgroundColor: "#10b981", // Verde
  },
  clearButton: {
    backgroundColor: "#ef4444", // Rojo
  },
  // ... más estilos
});
```

## 🔄 Funcionalidades Futuras

- [ ] Historial de compras
- [ ] Categorización de productos
- [ ] Gráficos de gastos
- [ ] Compartir lista de compras
- [ ] Modo oscuro
- [ ] Soporte para más monedas
- [ ] Actualización automática de tasas de cambio (API)
- [ ] Exportar a PDF/Excel
- [ ] Calculadora de propinas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**Ryzek**
- GitHub: [@Ryzek](https://github.com/Ryzek)

## 🙏 Agradecimientos

- Expo team por la excelente plataforma
- React Native community
- Todos los contribuidores de las librerías utilizadas

---

⭐️ Si este proyecto te fue útil, considera darle una estrella en GitHub!

## 📞 Soporte

¿Tienes preguntas o sugerencias? Abre un [issue](https://github.com/Ryzek/compras-calculadora/issues) en GitHub.
