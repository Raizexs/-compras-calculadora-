import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Person,
  Product,
  productsAPI,
  PurchaseItem,
  purchasesAPI,
} from "../../src/services/api";

const STORAGE_KEYS = {
  PERSON: "@person_data",
  CART: "@cart_data",
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Save cart to AsyncStorage
    AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)).catch(
      () => {}
    );
  }, [cart]);

  const loadInitialData = async () => {
    try {
      // Load person from storage
      const storedPerson = await AsyncStorage.getItem(STORAGE_KEYS.PERSON);
      if (storedPerson) {
        setPerson(JSON.parse(storedPerson));
      }

      // Load cart from storage
      const storedCart = await AsyncStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      // Load products from API
      await loadProducts();
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.list();
      setProducts(data);

      if (data.length === 0) {
        Alert.alert(
          "Sin productos",
          "No hay productos disponibles. El administrador debe agregar productos al catálogo."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error de conexión",
        error.message ||
          "No se pudieron cargar los productos. Verifica que el servidor esté activo."
      );
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      const currentQty = newCart[productId] || 0;
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = newQty;
      }

      return newCart;
    });
  };

  const clearCart = () => {
    Alert.alert(
      "Limpiar carrito",
      "¿Estás seguro de que deseas vaciar el carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpiar",
          style: "destructive",
          onPress: () => setCart({}),
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

    const itemsInCart = Object.keys(cart).filter((id) => cart[id] > 0);
    if (itemsInCart.length === 0) {
      Alert.alert(
        "Carrito vacío",
        "Agrega productos al carrito antes de finalizar la compra."
      );
      return;
    }

    Alert.alert(
      "Confirmar compra",
      `¿Deseas confirmar la compra por un total de CLP ${formatNumber(
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
              const items: PurchaseItem[] = products
                .filter((p) => cart[p._id] && cart[p._id] > 0)
                .map((p) => ({
                  product_id: p._id,
                  name: p.name,
                  price: p.price,
                  quantity: cart[p._id],
                }));

              // Create purchase
              const purchase = await purchasesAPI.create(person._id, items);

              Alert.alert(
                "¡Compra exitosa!",
                `Tu compra ha sido registrada.\nTotal: CLP ${formatNumber(
                  purchase.total
                )}\nID: ${purchase._id}`,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setCart({}); // Clear cart after successful purchase
                    },
                  },
                ]
              );
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
    return products.reduce((acc, product) => {
      const quantity = cart[product._id] || 0;
      return acc + product.price * quantity;
    }, 0);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getTotalItems = (): number => {
    return Object.values(cart).reduce((acc, qty) => acc + qty, 0);
  };

  if (loading && products.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🛒 Catálogo de Productos</Text>
          <Text style={styles.subtitle}>
            {person
              ? `Comprando como ${person.name}`
              : "Inicia sesión en Perfil"}
          </Text>
        </View>
        {Object.keys(cart).length > 0 && (
          <Pressable style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>🗑️</Text>
          </Pressable>
        )}
      </View>

      {/* Total Card */}
      {Object.keys(cart).length > 0 && (
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.total}>
              CLP {formatNumber(calculateTotal())}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.itemCount}>
              {getTotalItems()}{" "}
              {getTotalItems() === 1 ? "producto" : "productos"}
            </Text>
            <Pressable
              style={[
                styles.checkoutButton,
                loading && styles.checkoutButtonDisabled,
              ]}
              onPress={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      {/* Products List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4f46e5"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No hay productos disponibles</Text>
            <Text style={styles.emptySubtext}>
              El catálogo está vacío. Contacta al administrador.
            </Text>
            <Pressable style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>🔄 Reintentar</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const quantity = cart[item._id] || 0;
          const inCart = quantity > 0;

          return (
            <View
              style={[styles.productCard, inCart && styles.productCardSelected]}
            >
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  CLP {formatNumber(item.price)}
                </Text>
                {inCart && (
                  <Text style={styles.productSubtotal}>
                    Subtotal: CLP {formatNumber(item.price * quantity)}
                  </Text>
                )}
              </View>

              <View style={styles.quantityControls}>
                {inCart ? (
                  <>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item._id, -1)}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </Pressable>
                    <View style={styles.quantityDisplay}>
                      <Text style={styles.quantityText}>{quantity}</Text>
                    </View>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item._id, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    style={styles.addButton}
                    onPress={() => updateQuantity(item._id, 1)}
                  >
                    <Text style={styles.addButtonText}>Agregar</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#e0e7ff",
  },
  clearButton: {
    backgroundColor: "#ef4444",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 20,
  },
  totalCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  total: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4f46e5",
  },
  itemCount: {
    fontSize: 13,
    color: "#9ca3af",
  },
  checkoutButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  checkoutButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productCardSelected: {
    borderWidth: 2,
    borderColor: "#4f46e5",
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  productSubtotal: {
    fontSize: 13,
    color: "#4f46e5",
    fontWeight: "600",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  quantityDisplay: {
    minWidth: 40,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  addButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
