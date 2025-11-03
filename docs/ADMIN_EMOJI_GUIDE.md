# 🎨 Guía de Emojis Automáticos para Productos

## ✨ Funcionalidad Implementada

Cuando un administrador agrega un nuevo producto, el sistema **asigna automáticamente un emoji** basándose en el nombre del producto.

## 📝 Cómo Funciona

### 1. **En el Panel de Administración**

Cuando el administrador escribe el nombre del producto, verá:

- ✅ **Vista previa en tiempo real** del emoji que se asignará
- ✅ **Vista previa del nombre completo** con emoji incluido

### 2. **Ejemplos de Emojis Automáticos**

| Nombre que escribes | Emoji asignado | Resultado final |
| ------------------- | -------------- | --------------- |
| Leche               | 🥛             | 🥛 Leche        |
| Pan                 | 🍞             | 🍞 Pan          |
| Huevos              | 🥚             | 🥚 Huevos       |
| Manzana             | 🍎             | 🍎 Manzana      |
| Tomate              | 🍅             | 🍅 Tomate       |
| Pollo               | 🍗             | 🍗 Pollo        |
| Carne               | 🥩             | 🥩 Carne        |
| Arroz               | 🍚             | 🍚 Arroz        |
| Café                | ☕             | ☕ Café         |
| Aceite              | 🫒             | 🫒 Aceite       |
| Queso               | 🧀             | 🧀 Queso        |
| Yogurt              | 🥛             | 🥛 Yogurt       |
| Chocolate           | 🍫             | 🍫 Chocolate    |
| Pescado             | 🐟             | 🐟 Pescado      |
| Plátano             | 🍌             | 🍌 Plátano      |

### 3. **Categorías de Emojis**

El sistema detecta automáticamente la categoría del producto:

#### 🥛 **Lácteos**

- Leche, Yogurt, Queso → 🥛🧀

#### 🍞 **Panadería**

- Pan, Pasta → 🍞🍝

#### 🍎 **Frutas**

- Manzana, Plátano, Naranja, Uva, Frutilla → 🍎🍌🍊🍇🍓

#### 🍅 **Verduras**

- Tomate, Lechuga, Zanahoria, Papa, Cebolla → 🍅🥬🥕🥔🧅

#### 🍗 **Carnes**

- Pollo, Carne, Pescado, Cerdo → 🍗🥩🐟🥓

#### 🍚 **Granos**

- Arroz, Café, Azúcar → 🍚☕🧂

#### 🫒 **Aceites**

- Aceite, Mantequilla → 🫒

#### 🥚 **Huevos**

- Huevos, Huevo → 🥚

## 🎯 Uso en la Aplicación

### **Panel de Administración**

1. Ve a la pestaña **"Admin"**
2. Haz clic en **"Agregar Nuevo Producto"**
3. Escribe el nombre (ej: "Leche")
4. Verás una **vista previa**: 🥛 Leche
5. Ingresa el precio
6. Haz clic en **"Guardar"**

### **Visualización**

El emoji aparecerá automáticamente en:

- ✅ **Catálogo** (pestaña Shopping)
- ✅ **Selector de Compras** (pestaña Compras)
- ✅ **Carrito de Compras**
- ✅ **Historial de Compras**
- ✅ **Lista de Productos en Admin**

## 🔧 Características Técnicas

### **Vista Previa en Tiempo Real**

```tsx
{
  productName.trim() && (
    <View style={styles.emojiPreview}>
      <Text style={styles.emojiPreviewIcon}>
        {getProductEmoji(productName.trim())}
      </Text>
      <Text style={styles.emojiPreviewText}>
        Vista previa: {getProductEmoji(productName.trim())} {productName.trim()}
      </Text>
    </View>
  );
}
```

### **Asignación Automática**

```tsx
const emoji = getProductEmoji(productName.trim());
const productNameWithEmoji = `${emoji} ${productName.trim()}`;
await productsAPI.create(productNameWithEmoji, price);
```

## 💡 Consejos

1. **Nombres Descriptivos**: Usa nombres claros para obtener el emoji correcto

   - ✅ "Leche" → 🥛
   - ✅ "Pan integral" → 🍞
   - ❌ "Prod1" → 🛒 (emoji genérico)

2. **Caso Insensible**: El sistema detecta mayúsculas y minúsculas

   - "LECHE" → 🥛
   - "leche" → 🥛
   - "Leche" → 🥛

3. **Palabras Clave**: Incluye la palabra clave principal
   - "Leche descremada" → 🥛
   - "Pan de molde" → 🍞
   - "Huevos grandes" → 🥚

## 🎨 Emoji por Defecto

Si el sistema no reconoce el producto, usará:

- 🛒 (carrito de compras genérico)

Ejemplo:

- "Producto genérico" → 🛒 Producto genérico

## ✅ Resultado Final

Cuando agregas un producto como "Leche" con precio "1200":

1. **En el formulario** verás:

   ```
   Vista previa: 🥛 Leche
   ```

2. **En la lista de admin**:

   ```
   1. 🥛 Leche - CLP 1,200
   ```

3. **En el catálogo**:

   ```
   🥛
   Leche
   Leche fresca entera - 1 Litro
   $ 1,200
   ```

4. **En el carrito**:
   ```
   🥛 Leche
   Cantidad: 2
   $ 2,400
   ```

---

**¡Los emojis hacen que la app sea más visual y atractiva!** 🎉
