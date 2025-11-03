import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Product, productsAPI, User } from "../../src/services/api";

const STORAGE_KEYS = {
  USER: "@user_data",
};

export default function AdminScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        await loadProducts();
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.list();
      setProducts(data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "No se pudieron cargar los productos"
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleAddProduct = async () => {
    if (!productName.trim()) {
      Alert.alert("Error", "Por favor ingresa el nombre del producto");
      return;
    }

    const price = parseFloat(productPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Error", "Por favor ingresa un precio válido mayor a 0");
      return;
    }

    setLoading(true);
    try {
      await productsAPI.create(productName.trim(), price);

      Alert.alert("Éxito", `Producto "${productName}" agregado correctamente`);
      setProductName("");
      setProductPrice("");
      setShowAddForm(false);
      await loadProducts();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al agregar producto");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContainer}>
          <View style={styles.lockIcon}>
            <Ionicons name="lock-closed" size={64} color="#cbd5e1" />
          </View>
          <Text style={styles.lockTitle}>Acceso Restringido</Text>
          <Text style={styles.lockText}>
            Debes iniciar sesión para acceder al panel de administración
          </Text>
          <View style={styles.lockHint}>
            <Ionicons name="arrow-forward" size={20} color="#6366f1" />
            <Text style={styles.lockHintText}>
              Ve a la pestaña Perfil para iniciar sesión
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366f1"]}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="shield-checkmark" size={32} color="#fff" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Administración</Text>
              <Text style={styles.subtitle}>
                Gestiona el catálogo de productos
              </Text>
            </View>
          </View>
        </View>

        {/* User info */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle" size={20} color="#6366f1" />
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Add Product Form */}
        {!showAddForm ? (
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Agregar Nuevo Producto</Text>
          </Pressable>
        ) : (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Ionicons name="cube" size={24} color="#6366f1" />
              <Text style={styles.formTitle}>Nuevo Producto</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="pricetag"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Nombre del producto"
                value={productName}
                onChangeText={setProductName}
                style={styles.input}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="cash"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Precio (CLP)"
                value={productPrice}
                onChangeText={setProductPrice}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                ]}
                onPress={() => {
                  setShowAddForm(false);
                  setProductName("");
                  setProductPrice("");
                }}
              >
                <Ionicons name="close-circle" size={20} color="#64748b" />
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  loading && styles.saveButtonDisabled,
                  pressed && styles.saveButtonPressed,
                ]}
                onPress={handleAddProduct}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* Products List */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={24} color="#1e293b" />
            <Text style={styles.sectionTitle}>
              Productos Registrados ({products.length})
            </Text>
          </View>

          {loading && products.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
          ) : products.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={64} color="#cbd5e1" />
              <Text style={styles.emptyText}>No hay productos registrados</Text>
              <Text style={styles.emptySubtext}>
                Agrega el primer producto usando el botón de arriba
              </Text>
            </View>
          ) : (
            <View style={styles.productsList}>
              {products.map((product, index) => (
                <View key={product._id} style={styles.productItem}>
                  <View style={styles.productNumber}>
                    <Text style={styles.productNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.productDetails}>
                    <Text style={styles.productItemName}>{product.name}</Text>
                    <View style={styles.productPriceTag}>
                      <Ionicons name="cash" size={14} color="#10b981" />
                      <Text style={styles.productItemPrice}>
                        CLP {formatNumber(product.price)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.productBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#10b981"
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color="#6366f1" />
            <Text style={styles.infoTitle}>Información</Text>
          </View>
          <Text style={styles.infoText}>
            Los productos agregados aparecerán inmediatamente en el catálogo
            para todos los usuarios.
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="cube" size={20} color="#6366f1" />
              <Text style={styles.statNumber}>{products.length}</Text>
              <Text style={styles.statLabel}>Productos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="checkmark-done" size={20} color="#10b981" />
              <Text style={styles.statNumber}>Activo</Text>
              <Text style={styles.statLabel}>Sistema</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  lockIcon: {
    marginBottom: 24,
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    textAlign: "center",
  },
  lockText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  lockHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  lockHintText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
  },
  headerGradient: {
    backgroundColor: "#6366f1",
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    marginBottom: 16,
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
  userCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userEmail: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#10b981",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0px 4px 12px rgba(16, 185, 129, 0.2)",
  },
  addButtonPressed: {
    backgroundColor: "#059669",
    transform: [{ scale: 0.98 }],
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 24,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e2e8f0",
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 15,
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    fontWeight: "500",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelButtonPressed: {
    backgroundColor: "#f8fafc",
    transform: [{ scale: 0.98 }],
  },
  cancelButtonText: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "700",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonPressed: {
    backgroundColor: "#4f46e5",
    transform: [{ scale: 0.98 }],
  },
  saveButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  productsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#64748b",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
  productsList: {
    gap: 12,
  },
  productItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
  },
  productNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  productNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366f1",
    fontFamily: "Courier New",
  },
  productDetails: {
    flex: 1,
  },
  productItemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  productPriceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  productItemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
    fontFamily: "Courier New",
  },
  productBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    backgroundColor: "#eff6ff",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#dbeafe",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e40af",
  },
  infoText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    fontFamily: "Courier New",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e2e8f0",
  },
});
