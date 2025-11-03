import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCurrency } from "../../src/context/CurrencyContext";
import {
  Person,
  Product,
  productsAPI,
  PurchaseItem,
  purchasesAPI,
} from "../../src/services/api";
import { getProductEmoji } from "../../src/utils/productIcons";

const STORAGE_KEYS = {
  PERSON: "@person_data",
  CART: "@cart_data",
};

type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

export default function ComprasScreen() {
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState("1");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseTotal, setPurchaseTotal] = useState(0);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Save cart to AsyncStorage
    if (cartItems.length > 0) {
      AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    } else {
      AsyncStorage.removeItem(STORAGE_KEYS.CART);
    }
  }, [cartItems]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load person from storage
      const storedPerson = await AsyncStorage.getItem(STORAGE_KEYS.PERSON);
      if (storedPerson) {
        setPerson(JSON.parse(storedPerson));
      }

      // Load products from API
      const data = await productsAPI.list();
      setProducts(data);

      // Load cart from storage and reconstruct with full product data
      const storedCart = await AsyncStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          // Reconstruir el carrito con productos completos desde la API
          const reconstructedCart = parsedCart
            .map((item: any) => {
              const product = data.find((p) => p._id === item.product?._id);
              if (product) {
                return {
                  id: item.id,
                  product: product,
                  quantity: item.quantity,
                };
              }
              return null;
            })
            .filter((item): item is CartItem => item !== null);

          setCartItems(reconstructedCart);
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!selectedProductId) {
      Alert.alert("Selecciona un producto", "Elige un producto de la lista.");
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Validación", "Ingresa una cantidad válida (> 0).");
      return;
    }

    const product = products.find((p) => p._id === selectedProductId);
    if (!product) {
      Alert.alert("Error", "Producto no encontrado.");
      return;
    }

    const existingItemIndex = cartItems.findIndex(
      (item) => item.product._id === product._id
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += qty;
      setCartItems(updatedCart);
      Alert.alert(
        "Actualizado",
        `${product.name}: ${updatedCart[existingItemIndex].quantity} unidades`
      );
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        product: product,
        quantity: qty,
      };
      setCartItems([...cartItems, newItem]);
      Alert.alert("Agregado", `${product.name} x ${qty}`);
    }

    setSelectedProductId("");
    setQuantity("1");
  };

  const updateQuantity = (id: string, delta: number) => {
    const newCartItems = cartItems
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCartItems(newCartItems);
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (cartItems.length === 0) {
      return;
    }

    Alert.alert(
      "Limpiar carrito",
      "¿Estás seguro de que deseas vaciar el carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpiar",
          style: "destructive",
          onPress: () => {
            setCartItems([]);
            AsyncStorage.removeItem(STORAGE_KEYS.CART);
            Alert.alert(
              "Carrito limpiado",
              "El carrito ha sido vaciado exitosamente."
            );
          },
        },
      ]
    );
  };

  const handleCheckout = async () => {
    if (!person) {
      Alert.alert(
        "Sin perfil",
        "Necesitas crear un perfil en la pestaña 'Perfil' antes de realizar una compra."
      );
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert(
        "Carrito vacío",
        "Agrega productos al carrito antes de finalizar la compra."
      );
      return;
    }

    Alert.alert(
      "Confirmar compra",
      `¿Deseas confirmar la compra por un total de ${getCurrencySymbol()} ${formatPrice(
        calculateTotal()
      )}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              setLoading(true);

              // Prepare purchase items
              const items: PurchaseItem[] = cartItems.map((item) => ({
                product_id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
              }));

              // Create purchase
              const purchase = await purchasesAPI.create(person._id, items);

              // Show success modal
              setPurchaseTotal(purchase.total);
              setCartItems([]);
              setShowSuccessModal(true);
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message ||
                  "No se pudo procesar la compra. Intenta nuevamente."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const calculateTotal = (): number => {
    return cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  };

  const getTotalItems = (): number => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  if (loading && products.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header con gradiente */}
          <View style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Ionicons name="cart" size={32} color="#fff" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Compras</Text>
                <Text style={styles.subtitle}>Tu carrito de compras</Text>
              </View>
            </View>
          </View>

          {/* Product Selection Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="bag-add" size={24} color="#6366f1" />
              <Text style={styles.sectionTitle}>Agregar Producto</Text>
            </View>

            <View style={styles.pickerWrapper}>
              <Ionicons
                name="search"
                size={20}
                color="#9ca3af"
                style={styles.pickerIcon}
              />
              <Picker
                selectedValue={selectedProductId}
                onValueChange={(value) => setSelectedProductId(value)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un producto..." value="" />
                {products.map((product) => (
                  <Picker.Item
                    key={product._id}
                    label={`${getProductEmoji(product.name)} ${
                      product.name
                    } - ${getCurrencySymbol()} ${formatPrice(product.price)}`}
                    value={product._id}
                  />
                ))}
              </Picker>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              onPress={addToCart}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Agregar al Carrito</Text>
            </Pressable>
          </View>

          {/* Cart */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cartHeaderLeft}>
                <Ionicons name="basket" size={24} color="#6366f1" />
                <Text style={styles.sectionTitle}>
                  Mi Carrito ({getTotalItems()})
                </Text>
              </View>
              {cartItems.length > 0 && (
                <Pressable style={styles.clearButton} onPress={clearCart}>
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  <Text style={styles.clearText}>Limpiar</Text>
                </Pressable>
              )}
            </View>

            {cartItems.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="cart-outline" size={64} color="#e5e7eb" />
                <Text style={styles.emptyText}>Tu carrito está vacío</Text>
                <Text style={styles.emptySubtext}>
                  Agrega productos para comenzar
                </Text>
              </View>
            ) : (
              <>
                {cartItems.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <View style={styles.productIcon}>
                      <Text style={styles.productEmoji}>
                        {getProductEmoji(item.product.name)}
                      </Text>
                    </View>

                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>
                        {item.product.name}
                      </Text>
                      <Text style={styles.productPrice}>
                        {getCurrencySymbol()} {formatPrice(item.product.price)}{" "}
                        <Text style={styles.priceUnit}>c/u</Text>
                      </Text>
                    </View>

                    <View style={styles.itemRight}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.cartQuantityButton,
                          pressed && styles.cartQuantityButtonPressed,
                        ]}
                        onPress={() => updateQuantity(item.id, -1)}
                      >
                        <Ionicons name="remove" size={20} color="#6366f1" />
                      </Pressable>

                      <Text style={styles.quantityText}>{item.quantity}</Text>

                      <Pressable
                        style={({ pressed }) => [
                          styles.cartQuantityButton,
                          pressed && styles.cartQuantityButtonPressed,
                        ]}
                        onPress={() => updateQuantity(item.id, 1)}
                      >
                        <Ionicons name="add" size={20} color="#6366f1" />
                      </Pressable>
                    </View>

                    <View style={styles.itemTotalContainer}>
                      <Text style={styles.itemTotal}>
                        {getCurrencySymbol()}{" "}
                        {formatPrice(item.product.price * item.quantity)}
                      </Text>
                      <Pressable
                        style={styles.removeButton}
                        onPress={() => removeItem(item.id)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#ef4444"
                        />
                      </Pressable>
                    </View>
                  </View>
                ))}

                {/* Total Section */}
                <View style={styles.totalSection}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal</Text>
                    <Text style={styles.totalValue}>
                      {getCurrencySymbol()} {formatPrice(calculateTotal())}
                    </Text>
                  </View>
                  <View style={styles.totalDivider} />
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabelFinal}>Total</Text>
                    <Text style={styles.totalAmount}>
                      {getCurrencySymbol()} {formatPrice(calculateTotal())}
                    </Text>
                  </View>
                </View>

                {/* Checkout Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.checkoutButton,
                    pressed && styles.checkoutButtonPressed,
                  ]}
                  onPress={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#fff"
                      />
                      <Text style={styles.checkoutButtonText}>
                        Finalizar Pedido
                      </Text>
                    </>
                  )}
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            </View>
            <Text style={styles.modalTitle}>¡Compra Finalizada!</Text>
            <Text style={styles.modalSubtitle}>
              Tu pedido ha sido procesado exitosamente
            </Text>
            <View style={styles.modalTotalContainer}>
              <Text style={styles.modalTotalLabel}>Total</Text>
              <Text style={styles.modalTotal}>
                {getCurrencySymbol()} {formatPrice(purchaseTotal)}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.modalButton,
                pressed && styles.modalButtonPressed,
              ]}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>Continuar</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontFamily: "Courier New",
  },
  content: {
    flex: 1,
  },
  // Header con gradiente
  headerGradient: {
    backgroundColor: "#6366f1",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "Courier New",
  },
  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cartHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.3,
  },
  // Picker
  pickerWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  pickerIcon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 10,
  },
  picker: {
    height: 56,
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    paddingLeft: 48,
    fontSize: 15,
    fontFamily: "Courier New",
    borderWidth: 2,
    borderColor: "transparent",
  },
  // Quantity Input
  quantityContainer: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 12,
    gap: 20,
  },
  quantityButton: {
    backgroundColor: "#6366f1",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 12px rgba(99, 102, 241, 0.3)",
  },
  quantityButtonPressed: {
    backgroundColor: "#4f46e5",
    transform: [{ scale: 0.95 }],
  },
  quantityDisplay: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1e293b",
    fontFamily: "Courier New",
    minWidth: 60,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputIcon: {
    marginRight: 12,
  },
  quantityInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Courier New",
    color: "#1e293b",
  },
  // Add Button
  addButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0px 8px 24px rgba(99, 102, 241, 0.4)",
  },
  addButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  // Clear Button
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
  },
  clearText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
  // Empty Cart
  emptyCart: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 8,
    fontFamily: "Courier New",
  },
  // Cart Items
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 12,
  },
  productIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  productEmoji: {
    fontSize: 28,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  productPrice: {
    fontSize: 17,
    fontFamily: "Courier New",
    color: "#6366f1",
    fontWeight: "600",
  },
  priceUnit: {
    fontSize: 14,
    color: "#94a3b8",
    fontFamily: "Courier New",
  },
  // Quantity Controls (Cart Items)
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cartQuantityButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  cartQuantityButtonPressed: {
    backgroundColor: "#ddd6fe",
    transform: [{ scale: 0.95 }],
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Courier New",
    color: "#1e293b",
    minWidth: 32,
    textAlign: "center",
  },
  itemTotalContainer: {
    alignItems: "flex-end",
    gap: 8,
    marginLeft: 12,
  },
  itemTotal: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Courier New",
    color: "#10b981",
  },
  removeButton: {
    padding: 4,
  },
  // Total Section
  totalSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: "#f1f5f9",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 18,
    fontFamily: "Courier New",
    color: "#1e293b",
  },
  totalDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
  totalLabelFinal: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Courier New",
    color: "#6366f1",
  },
  // Checkout Button
  checkoutButton: {
    backgroundColor: "#10b981",
    paddingVertical: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
    boxShadow: "0px 8px 24px rgba(16, 185, 129, 0.4)",
  },
  checkoutButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backdropFilter: "blur(8px)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 40,
    alignItems: "center",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0px 20px 60px rgba(0, 0, 0, 0.3)",
  },
  successIconContainer: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 24,
  },
  modalTotalContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 32,
  },
  modalTotalLabel: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "Courier New",
    marginBottom: 8,
    textAlign: "center",
  },
  modalTotal: {
    fontSize: 36,
    fontWeight: "700",
    fontFamily: "Courier New",
    color: "#10b981",
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    boxShadow: "0px 8px 24px rgba(99, 102, 241, 0.4)",
  },
  modalButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
