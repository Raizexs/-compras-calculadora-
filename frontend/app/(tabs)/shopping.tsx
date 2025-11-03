import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCurrency } from "../../src/context/CurrencyContext";
import { Person, Product, productsAPI } from "../../src/services/api";
import { getProductColor, getProductEmoji } from "../../src/utils/productIcons";

const STORAGE_KEYS = {
  PERSON: "@person_data",
  CART: "@cart_data",
};

// Componente separado para cada producto
const ProductCard = ({ item, index }: { item: Product; index: number }) => {
  const { formatPrice, getCurrencySymbol } = useCurrency();

  // Generar descripción completa basada en el producto
  const getProductDescription = (name: string): string => {
    const descriptions: { [key: string]: string } = {
      Leche: "Leche fresca entera - 1 Litro",
      Pan: "Pan fresco del día - Unidad",
      Huevos: "Huevos frescos - Docena",
      Arroz: "Arroz grano largo - 1 Kilo",
      Aceite: "Aceite vegetal - 1 Litro",
      Azúcar: "Azúcar blanca - 1 Kilo",
      Sal: "Sal de mesa - 1 Kilo",
      Café: "Café molido - 250g",
      Té: "Té surtido - Caja x20",
      Jugo: "Jugo natural - 1 Litro",
      Agua: "Agua mineral - 1.5L",
      Pollo: "Pollo fresco - 1 Kilo",
      Carne: "Carne molida - 1 Kilo",
      Pescado: "Pescado fresco - 1 Kilo",
      Yogurt: "Yogurt natural - 150ml",
      Queso: "Queso fresco - 250g",
      Tomate: "Tomate fresco - 1 Kilo",
      Plátano: "Plátanos maduros - 1 Kilo",
    };

    // Buscar descripción completa
    for (const [key, desc] of Object.entries(descriptions)) {
      if (name.includes(key)) {
        return desc;
      }
    }

    // Si no encuentra, crear descripción genérica
    return `${name} - Unidad`;
  };

  return (
    <View
      style={[
        styles.productCard,
        {
          backgroundColor: getProductColor(item.name),
        },
      ]}
    >
      <View style={styles.productEmojiContainer}>
        <Text style={styles.productEmoji}>{getProductEmoji(item.name)}</Text>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {getProductDescription(item.name)}
        </Text>
        <View style={styles.priceTag}>
          <Ionicons name="pricetag" size={14} color="#6366f1" />
          <Text style={styles.productPrice}>
            {getCurrencySymbol()} {formatPrice(item.price)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function CatalogoScreen() {
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const categories = [
    "Todos",
    "Lácteos",
    "Panadería",
    "Frutas",
    "Granos",
    "Verduras",
    "Aceites",
    "Carnes",
  ];

  const getCategoryForProduct = (productName: string): string => {
    const name = productName.toLowerCase();
    if (
      name.includes("leche") ||
      name.includes("yogurt") ||
      name.includes("queso") ||
      name.includes("huevos")
    )
      return "Lácteos";
    if (name.includes("pan") || name.includes("pasta")) return "Panadería";
    if (
      name.includes("manzana") ||
      name.includes("plátano") ||
      name.includes("banana")
    )
      return "Frutas";
    if (name.includes("arroz") || name.includes("café") || name.includes("té"))
      return "Granos";
    if (
      name.includes("tomate") ||
      name.includes("lechuga") ||
      name.includes("cebolla")
    )
      return "Verduras";
    if (name.includes("aceite") || name.includes("mantequilla"))
      return "Aceites";
    if (
      name.includes("pollo") ||
      name.includes("carne") ||
      name.includes("pescado")
    )
      return "Carnes";
    return "Otros";
  };

  useEffect(() => {
    loadInitialData();
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Save cart to AsyncStorage
    AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)).catch(
      () => {}
    );
  }, [cart]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(
        (product) => getCategoryForProduct(product.name) === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  };

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
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error("Error parsing cart:", e);
          setCart({});
        }
      }

      // Load products from API
      await loadProducts();
    } catch (error) {
      console.error("Error loading initial data:", error);
      // Continuar aunque haya error
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.list();
      setProducts(data);
      setFilteredProducts(data);

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

  const goToCheckout = () => {
    const itemsInCart = Object.keys(cart).filter((id) => cart[id] > 0);
    if (itemsInCart.length === 0) {
      Alert.alert(
        "Carrito vacío",
        "Agrega productos al carrito antes de ir a compras."
      );
      return;
    }

    // Navigate to Compras tab
    router.push("/(tabs)");
  };

  const calculateTotal = (): number => {
    return products.reduce((acc, product) => {
      const quantity = cart[product._id] || 0;
      return acc + product.price * quantity;
    }, 0);
  };

  const getTotalItems = (): number => {
    return Object.values(cart).reduce((acc, qty) => acc + qty, 0);
  };

  if (loading && products.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Cargando catálogo...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="storefront" size={32} color="#fff" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Catálogo de Productos</Text>
              <Text style={styles.subtitle}>
                Explora nuestros productos disponibles
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#9ca3af"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Buscar productos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                style={({ pressed }) => [
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                  pressed && styles.categoryChipPressed,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Products Grid */}
          {loading && products.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="cube-outline" size={80} color="#cbd5e1" />
              </View>
              <Text style={styles.emptyText}>No se encontraron productos</Text>
              <Text style={styles.emptySubtext}>
                Intenta con otra búsqueda o categoría
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && styles.retryButtonPressed,
                ]}
                onPress={() => {
                  setSearchQuery("");
                  setSelectedCategory("Todos");
                }}
              >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.retryButtonText}>Ver todos</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.map((item, index) => (
                <View key={item._id} style={styles.productCardWrapper}>
                  <ProductCard item={item} index={index} />
                  <Pressable
                    style={({ pressed }) => [
                      styles.detailsButton,
                      pressed && styles.detailsButtonPressed,
                    ]}
                    onPress={() => {
                      setSelectedProduct(item);
                      setShowDetailModal(true);
                    }}
                  >
                    <Ionicons
                      name="information-circle"
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.detailsButtonText}>Ver detalles</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Detalle del Producto */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedProduct && (
                <>
                  {/* Header del Modal */}
                  <View style={styles.modalHeader}>
                    <View style={styles.modalProductIcon}>
                      <Text style={styles.modalProductEmoji}>
                        {getProductEmoji(selectedProduct.name)}
                      </Text>
                    </View>
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setShowDetailModal(false)}
                    >
                      <Ionicons name="close-circle" size={32} color="#64748b" />
                    </Pressable>
                  </View>

                  {/* Información Principal */}
                  <View style={styles.modalBody}>
                    <Text style={styles.modalProductName}>
                      {selectedProduct.name}
                    </Text>
                    <Text style={styles.modalProductPrice}>
                      {getCurrencySymbol()} {formatPrice(selectedProduct.price)}
                    </Text>
                    {selectedProduct.category && (
                      <View style={styles.modalCategoryBadge}>
                        <Ionicons name="pricetag" size={14} color="#6366f1" />
                        <Text style={styles.modalCategoryText}>
                          {selectedProduct.category}
                        </Text>
                      </View>
                    )}

                    {/* Descripción */}
                    {selectedProduct.description && (
                      <View style={styles.modalSection}>
                        <View style={styles.modalSectionHeader}>
                          <Ionicons
                            name="document-text"
                            size={20}
                            color="#6366f1"
                          />
                          <Text style={styles.modalSectionTitle}>
                            Descripción
                          </Text>
                        </View>
                        <Text style={styles.modalDescription}>
                          {selectedProduct.description}
                        </Text>
                      </View>
                    )}

                    {/* Características */}
                    {selectedProduct.characteristics &&
                      selectedProduct.characteristics.length > 0 && (
                        <View style={styles.modalSection}>
                          <View style={styles.modalSectionHeader}>
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#10b981"
                            />
                            <Text style={styles.modalSectionTitle}>
                              Características
                            </Text>
                          </View>
                          <View style={styles.characteristicsList}>
                            {selectedProduct.characteristics.map(
                              (char, index) => (
                                <View
                                  key={index}
                                  style={styles.characteristicItem}
                                >
                                  <Ionicons
                                    name="checkmark"
                                    size={16}
                                    color="#10b981"
                                  />
                                  <Text style={styles.characteristicText}>
                                    {char}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        </View>
                      )}
                  </View>

                  {/* Botón de Agregar al Carrito */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.modalAddButton,
                      pressed && styles.modalAddButtonPressed,
                    ]}
                    onPress={() => {
                      setShowDetailModal(false);
                      // Aquí puedes agregar la lógica para ir a la pantalla de compras
                      router.push("/(tabs)");
                    }}
                  >
                    <Ionicons name="cart" size={20} color="#fff" />
                    <Text style={styles.modalAddButtonText}>Ir a Compras</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  headerGradient: {
    backgroundColor: "#6366f1",
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  contentWrapper: {
    padding: 16,
  },
  searchContainer: {
    position: "relative",
    marginBottom: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 16,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    gap: 8,
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  categoryChipActive: {
    backgroundColor: "#1e293b",
    borderColor: "#1e293b",
  },
  categoryChipPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    minHeight: 120,
    flexDirection: "row",
    alignItems: "center",
  },
  productEmojiContainer: {
    marginRight: 12,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  productEmoji: {
    fontSize: 36,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 8,
    lineHeight: 14,
  },
  priceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6366f1",
    fontFamily: "Courier New",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 6,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    fontFamily: "Courier New",
  },
  addButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  floatingCart: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  cartButton: {
    backgroundColor: "#6366f1",
    borderRadius: 20,
    boxShadow: "0px 8px 24px rgba(99, 102, 241, 0.3)",
  },
  cartButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  cartButtonTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cartButtonSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Courier New",
  },
  cartButtonIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  cartButtonIconText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  detailsButton: {
    backgroundColor: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  detailsButtonPressed: {
    backgroundColor: "#0f172a",
    transform: [{ scale: 0.98 }],
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  retryButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryButtonPressed: {
    backgroundColor: "#4f46e5",
    transform: [{ scale: 0.98 }],
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalProductIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  modalProductEmoji: {
    fontSize: 36,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalProductName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  modalProductPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: "#6366f1",
    fontFamily: "Courier New",
    marginBottom: 12,
  },
  modalCategoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#eff6ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  modalCategoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  modalDescription: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
  },
  characteristicsList: {
    gap: 8,
  },
  characteristicItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
  },
  characteristicText: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },
  modalAddButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 16,
    marginTop: 8,
    boxShadow: "0px 8px 24px rgba(99, 102, 241, 0.4)",
  },
  modalAddButtonPressed: {
    backgroundColor: "#4f46e5",
    transform: [{ scale: 0.98 }],
  },
  modalAddButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
