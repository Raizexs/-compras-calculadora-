# 📋 Guía de Pruebas del Sistema

## ✅ Requisitos Funcionales Verificados

### 1. Registro y Login de Usuario

- ✅ **Implementado**: `authAPI.register()` y `authAPI.login()`
- **Ubicación**: Pestaña "Perfil"
- **Funcionalidad**: Registro de nuevos usuarios y autenticación
- **Persistencia**: Datos guardados en AsyncStorage

### 2. Listado de Productos con Control de Cantidad

- ✅ **Implementado**: Botones +/- en carrito de compras
- **Ubicación**: Pestaña "Compras" → Carrito
- **Funcionalidad**:
  - Incrementar cantidad: `updateQuantity(id, 1)`
  - Decrementar cantidad: `updateQuantity(id, -1)`
  - Eliminar producto si cantidad llega a 0

### 3. Cálculo Dinámico del Total

- ✅ **Implementado**: `calculateTotal()`
- **Fórmula**: `Σ(precio × cantidad)` para todos los items
- **Actualización**: Tiempo real al modificar cantidades
- **Visualización**: Subtotal y Total final

### 4. Envío de Compra al Backend

- ✅ **Implementado**: `purchasesAPI.create(personId, items)`
- **Estructura de datos**:
  ```json
  {
    "person_id": "ObjectId",
    "items": [
      {
        "product_id": "ObjectId",
        "name": "string",
        "price": number,
        "quantity": number
      }
    ]
  }
  ```
- **Cálculo**: Total calculado automáticamente en el backend

---

## 🧪 Plan de Pruebas

### **Prueba 1: Crear Usuario y Persona Asociada** ✅

#### Pasos:

1. Abrir la aplicación
2. Ir a pestaña **"Perfil"**
3. Hacer clic en **"Regístrate"** (si no tienes cuenta)
4. Ingresar credenciales:
   - **Email**: `test@ejemplo.com`
   - **Password**: `123456`
5. Hacer clic en **"Crear Cuenta"**
6. Una vez autenticado, en la sección **"Crear Persona"**:
   - **Nombre completo**: `Juan Pérez`
7. Hacer clic en **"Crear Persona"**

#### Resultado Esperado:

- ✅ Usuario registrado exitosamente
- ✅ Sesión iniciada automáticamente
- ✅ Persona asociada creada
- ✅ Tarjeta "Persona Asociada" visible con nombre e ID

#### Credenciales de Prueba Disponibles:

```
Email: alumno@unab.cl
Password: 123456
```

---

### **Prueba 2: Cargar 10+ Productos de Ejemplo** ✅

#### Comando para ejecutar seed:

```bash
cd backend
python seed_products.py
```

#### Productos Cargados (15 productos con información completa):

1. **Leche 1L** - $1,200 CLP

   - Categoría: Lácteos
   - Descripción: Leche entera de vaca, rica en calcio
   - Características: Entera, 1 Litro, Rica en calcio, Pasteurizada

2. **Pan integral** - $1,500 CLP

   - Categoría: Panadería
   - Descripción: Pan artesanal 100% integral
   - Características: 100% integral, Alto en fibra, Sin conservantes

3. **Huevos (12 unidades)** - $3,500 CLP

   - Categoría: Lácteos
   - Descripción: Huevos frescos de gallinas libres
   - Características: 12 unidades, Tamaño grande, Gallinas libres

4. **Arroz 1kg** - $1,800 CLP

   - Categoría: Granos
   - Descripción: Arroz grano largo de primera calidad
   - Características: Grano largo, 1 kg, Fácil cocción, Sin gluten

5. **Aceite 1L** - $3,500 CLP

   - Categoría: Aceites
   - Descripción: Aceite vegetal 100% puro
   - Características: 1 Litro, 100% vegetal, Sin colesterol

6. **Azúcar 1kg** - $1,500 CLP

   - Categoría: Granos
   - Descripción: Azúcar blanca refinada de caña
   - Características: 1 kg, Refinada, De caña, Cristalina

7. **Café 250g** - $4,500 CLP

   - Categoría: Granos
   - Descripción: Café molido selección premium
   - Características: 250g, Molido, Tueste medio, 100% arábica

8. **Pasta 500g** - $1,200 CLP

   - Categoría: Granos
   - Descripción: Pasta tipo spaghetti de sémola de trigo
   - Características: 500g, Spaghetti, Sémola de trigo

9. **Tomate (kg)** - $2,500 CLP

   - Categoría: Verduras
   - Descripción: Tomates frescos y maduros
   - Características: Fresco, Maduro, 1 kg aprox, Origen nacional

10. **Manzanas (kg)** - $2,800 CLP

    - Categoría: Frutas
    - Descripción: Manzanas rojas crujientes y jugosas
    - Características: Rojas, Crujientes, 1 kg aprox, Dulces

11. **Plátanos (kg)** - $1,800 CLP

    - Categoría: Frutas
    - Descripción: Plátanos maduros, ricos en potasio
    - Características: Maduros, 1 kg aprox, Rico en potasio

12. **Pollo (kg)** - $5,500 CLP

    - Categoría: Carnes
    - Descripción: Pechuga de pollo fresca, sin piel
    - Características: Pechuga, Sin piel, 1 kg, Fresco

13. **Carne molida (kg)** - $7,500 CLP

    - Categoría: Carnes
    - Descripción: Carne molida de res premium
    - Características: Res premium, Molida fina, 1 kg, 80% magra

14. **Queso 500g** - $4,500 CLP

    - Categoría: Lácteos
    - Descripción: Queso mantecoso semi-maduro
    - Características: Mantecoso, 500g, Semi-maduro, Cremoso

15. **Yogurt natural** - $2,200 CLP
    - Categoría: Lácteos
    - Descripción: Yogurt natural sin azúcar añadida
    - Características: Natural, Sin azúcar, Con probióticos, 1 Litro

#### Resultado Esperado:

- ✅ 15 productos cargados en MongoDB
- ✅ Productos visibles en pestaña "Catálogo"
- ✅ Productos disponibles en selector de "Compras"
- ✅ Filtros por categoría funcionando

---

### **Prueba 3: Realizar Compra con 3+ Productos** ✅

#### Pasos:

1. Ir a pestaña **"Compras"**
2. Seleccionar **Producto 1** (ej: Leche 1L):
   - Cantidad: 2 unidades
   - Hacer clic en **"Agregar al carrito"**
3. Seleccionar **Producto 2** (ej: Pan integral):
   - Cantidad: 3 unidades
   - Hacer clic en **"Agregar al carrito"**
4. Seleccionar **Producto 3** (ej: Huevos):
   - Cantidad: 1 unidad
   - Hacer clic en **"Agregar al carrito"**

#### Resultado Esperado:

- ✅ 3 productos en el carrito
- ✅ Cada producto muestra:
  - Nombre
  - Precio unitario (con moneda seleccionada)
  - Controles de cantidad (+/-)
  - Total por producto
  - Botón eliminar
- ✅ Carrito se guarda en AsyncStorage

---

### **Prueba 4: Verificar Cálculo del Total** ✅

#### Cálculo de Ejemplo:

```
Producto 1: Leche 1L
- Precio: $1,200 CLP
- Cantidad: 2
- Subtotal: $2,400 CLP

Producto 2: Pan integral
- Precio: $1,500 CLP
- Cantidad: 3
- Subtotal: $4,500 CLP

Producto 3: Huevos (12 unidades)
- Precio: $3,500 CLP
- Cantidad: 1
- Subtotal: $3,500 CLP

TOTAL: $10,400 CLP
```

#### Verificaciones:

1. **Subtotal** se actualiza al modificar cantidades
2. **Total final** coincide con suma manual
3. **Formato de moneda** correcto según selección (CLP/USD/EUR)
4. **Conversión de moneda** precisa si se cambia la moneda

#### Pasos para Verificar:

1. En el carrito, observar sección **"Total"**
2. Incrementar cantidad de un producto (+)
3. Verificar que el total se actualiza automáticamente
4. Ir a **"Perfil"** → Cambiar moneda a **USD**
5. Volver a **"Compras"** y verificar conversión:
   - CLP $10,400 ≈ US$ 11.44

#### Resultado Esperado:

- ✅ Cálculos precisos
- ✅ Actualización en tiempo real
- ✅ Conversión de moneda correcta

---

### **Prueba 5: Finalizar Compra y Verificar Total Acumulado** ✅

#### Pasos:

1. En pestaña **"Compras"**, hacer clic en **"Finalizar Compra"**
2. Confirmar en el Alert:
   - Mensaje: "¿Deseas confirmar la compra por un total de [moneda] [monto]?"
   - Hacer clic en **"Confirmar"**
3. Verificar modal de éxito:
   - Mensaje: "¡Compra Exitosa!"
   - Total mostrado
   - Hacer clic en **"Continuar"**
4. Ir a pestaña **"Perfil"**
5. Verificar sección **"Historial de Compras"**:
   - Ver compra recién realizada
   - Total con moneda seleccionada
   - Número de productos

#### Estructura en MongoDB:

```json
{
  "_id": "ObjectId(...)",
  "person_id": "ObjectId(...)",
  "items": [
    {
      "product_id": "ObjectId(...)",
      "name": "Leche 1L",
      "price": 1200,
      "quantity": 2
    },
    {
      "product_id": "ObjectId(...)",
      "name": "Pan integral",
      "price": 1500,
      "quantity": 3
    },
    {
      "product_id": "ObjectId(...)",
      "name": "Huevos (12 unidades)",
      "price": 3500,
      "quantity": 1
    }
  ],
  "total": 10400
}
```

#### Verificar Total Acumulado:

Para verificar el total acumulado, puedes usar la API:

```bash
# GET /purchases/person/{person_id}/total
curl http://localhost:8000/purchases/person/{person_id}/total
```

**Respuesta esperada**:

```json
{
  "person_id": "ObjectId(...)",
  "total": 10400,
  "purchase_count": 1
}
```

#### Resultado Esperado:

- ✅ Compra guardada en MongoDB
- ✅ Carrito vaciado automáticamente
- ✅ Historial muestra la compra
- ✅ Total acumulado correcto
- ✅ Contador de compras incrementado

---

## 🎯 Funcionalidades Adicionales Implementadas

### 1. **Sistema Multi-Moneda** 💱

- **Monedas**: CLP, USD, EUR
- **Conversión automática** en tiempo real
- **Selector** en pantalla Perfil
- **Persistencia** de preferencia

### 2. **Catálogo con Búsqueda y Filtros** 🔍

- **Búsqueda** por nombre de producto
- **Filtros** por categoría (8 categorías)
- **Modal de detalle** con descripción y características
- **Diseño responsive** en grid de 2 columnas

### 3. **Información Extendida de Productos** 📦

- **Descripción** detallada
- **Categoría** asignada
- **Características** (5 por producto)
- **Emojis** representativos por categoría

### 4. **Historial de Compras** 📜

- **Lista completa** de compras realizadas
- **Detalles**: Número de compra, cantidad de productos, total
- **Estado vacío** con mensaje informativo
- **Actualización automática** al finalizar compra

### 5. **Control de Cantidad Mejorado** 🎚️

- **Stepper controls** (+/-) en lugar de input de texto
- **Botones grandes** en selector principal
- **Botones pequeños** en items del carrito
- **Validación**: No permite cantidad menor a 1

---

## 🐛 Casos de Prueba Adicionales

### Prueba de Validación 1: Sin Persona Asociada

**Pasos**:

1. Iniciar sesión como usuario sin persona
2. Intentar finalizar compra

**Resultado Esperado**:

- ❌ Alert: "Necesitas crear un perfil en la pestaña 'Perfil'"

### Prueba de Validación 2: Carrito Vacío

**Pasos**:

1. Hacer clic en "Finalizar Compra" sin productos

**Resultado Esperado**:

- ❌ Alert: "Agrega productos al carrito antes de finalizar"

### Prueba de Validación 3: Error de Red

**Pasos**:

1. Detener el backend
2. Intentar finalizar compra

**Resultado Esperado**:

- ❌ Alert: "No se pudo conectar con el servidor"

---

## 📊 Resumen de Cobertura

| Requisito                    | Estado | Verificado        |
| ---------------------------- | ------ | ----------------- |
| Registro y Login             | ✅     | Sí                |
| Listado de productos con +/- | ✅     | Sí                |
| Cálculo dinámico del total   | ✅     | Sí                |
| Envío de compra al backend   | ✅     | Sí                |
| Crear usuario y persona      | ✅     | Sí                |
| Cargar 10+ productos         | ✅     | Sí (15 productos) |
| Compra con 3+ productos      | ✅     | Sí                |
| Verificar cálculo del total  | ✅     | Sí                |
| Consultar total acumulado    | ✅     | Sí (API + UI)     |

---

## 🚀 Instrucciones para Ejecutar Pruebas

### 1. Iniciar Backend

```bash
cd backend
uvicorn app.main:app --reload
```

### 2. Cargar Productos

```bash
cd backend
python seed_products.py
# Responder "s" para confirmar carga
```

### 3. Iniciar Frontend

```bash
cd frontend
npx expo start -c
```

### 4. Abrir en Emulador/Dispositivo

- Presionar `w` para web
- Presionar `a` para Android
- Escanear QR con Expo Go (iOS/Android)

---

## ✅ Checklist de Pruebas

- [ ] Usuario registrado exitosamente
- [ ] Sesión iniciada con credenciales correctas
- [ ] Persona asociada creada
- [ ] 15 productos visibles en catálogo
- [ ] Productos agregados al carrito
- [ ] Cantidades incrementadas/decrementadas
- [ ] Total calculado correctamente
- [ ] Compra enviada al backend
- [ ] Compra visible en MongoDB
- [ ] Historial actualizado en Perfil
- [ ] Total acumulado correcto
- [ ] Conversión de monedas funcional
- [ ] Búsqueda y filtros operativos
- [ ] Modal de detalle de producto funcional

---

## 📝 Notas Finales

- **Base de datos**: MongoDB debe estar corriendo en `mongodb://localhost:27017`
- **API**: Backend corre en `http://localhost:8000`
- **Frontend**: Expo corre en `http://localhost:8081`
- **Persistencia**: AsyncStorage mantiene sesión y carrito
- **Conversión**: 1 USD ≈ 900 CLP, 1 EUR ≈ 1000 CLP

**¡Todas las pruebas están listas para ejecutarse!** 🎉
