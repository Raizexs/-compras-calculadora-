import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Currency, useCurrency } from "../../src/context/CurrencyContext";
import {
  authAPI,
  Person,
  personsAPI,
  Purchase,
  purchasesAPI,
  User,
} from "../../src/services/api";

const STORAGE_KEYS = {
  USER: "@user_data",
  PERSON: "@person_data",
};

export default function TabTwoScreen() {
  const { currency, setCurrency, formatPrice, getCurrencySymbol } =
    useCurrency();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [personName, setPersonName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [person, setPerson] = useState<Person | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  useEffect(() => {
    loadStoredData();
  }, []);

  useEffect(() => {
    if (person?._id) {
      loadPurchases();
    }
  }, [person]);

  const loadPurchases = async () => {
    if (!person?._id) return;

    setLoadingPurchases(true);
    try {
      const purchasesList = await purchasesAPI.listByPerson(person._id);
      setPurchases(purchasesList);
    } catch (error) {
      console.error("Error loading purchases:", error);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const loadStoredData = async () => {
    try {
      const [storedUser, storedPerson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.PERSON),
      ]);

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }

      if (storedPerson) {
        setPerson(JSON.parse(storedPerson));
      }
    } catch (error) {
      console.error("Error loading stored data:", error);
    }
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      let userData: User;

      if (isLogin) {
        userData = await authAPI.login(email, password);
        Alert.alert("Éxito", "Inicio de sesión exitoso");
      } else {
        userData = await authAPI.register(email, password);
        Alert.alert("Éxito", "Registro exitoso. Ahora puedes iniciar sesión.");
      }

      setUser(userData);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePerson = async () => {
    if (!personName.trim()) {
      Alert.alert("Error", "Por favor ingresa un nombre");
      return;
    }

    setLoading(true);
    try {
      const newPerson = await personsAPI.create(personName);
      setPerson(newPerson);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PERSON,
        JSON.stringify(newPerson)
      );
      Alert.alert("Éxito", `Persona "${newPerson.name}" creada correctamente`);
      setPersonName("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al crear persona");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.PERSON]);
      setUser(null);
      setPerson(null);
      setIsAuthenticated(false);
      Alert.alert("Sesión cerrada", "Has cerrado sesión exitosamente");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header con gradiente */}
          <View style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Ionicons name="person-circle" size={40} color="#fff" />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>
                  {isLogin ? "Bienvenido" : "Regístrate"}
                </Text>
                <Text style={styles.subtitle}>
                  {isLogin
                    ? "Inicia sesión para continuar"
                    : "Crea tu cuenta nueva"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.contentWrapper}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name={isLogin ? "log-in" : "person-add"}
                  size={24}
                  color="#6366f1"
                />
                <Text style={styles.cardTitle}>
                  {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                </Text>
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail"
                  size={20}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Correo electrónico"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  loading && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name={isLogin ? "log-in" : "person-add"}
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.buttonText}>
                      {isLogin ? "Iniciar Sesión" : "Registrarse"}
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={styles.switchButton}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.switchText}>
                  {isLogin
                    ? "¿No tienes cuenta? Regístrate"
                    : "¿Ya tienes cuenta? Inicia sesión"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={24} color="#6366f1" />
                <Text style={styles.infoTitle}>Información</Text>
              </View>
              <Text style={styles.infoText}>
                Esta es una versión demo. Las contraseñas se almacenan sin
                encriptación.
              </Text>
              <View style={styles.credentialsBox}>
                <Text style={styles.credentialsTitle}>
                  Credenciales de prueba:
                </Text>
                <Text style={styles.credentialsText}>
                  <Ionicons name="mail" size={14} color="#64748b" />{" "}
                  alumno@unab.cl
                </Text>
                <Text style={styles.credentialsText}>
                  <Ionicons name="lock-closed" size={14} color="#64748b" />{" "}
                  123456
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con gradiente */}
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Mi Perfil</Text>
              <Text style={styles.subtitle}>Gestiona tu información</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-circle" size={24} color="#6366f1" />
              <Text style={styles.cardTitle}>Información de Usuario</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="mail" size={18} color="#6366f1" />
                <Text style={styles.label}>Email</Text>
              </View>
              <Text style={styles.value}>{user?.email}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Ionicons name="key" size={18} color="#6366f1" />
                <Text style={styles.label}>ID</Text>
              </View>
              <Text style={styles.valueSmall}>{user?._id}</Text>
            </View>
          </View>

          {/* Selector de Moneda */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="cash" size={24} color="#f59e0b" />
              <Text style={styles.cardTitle}>Moneda</Text>
            </View>
            <Text style={styles.helpText}>
              Selecciona la moneda para ver los precios
            </Text>

            <View style={styles.currencySelector}>
              {(["CLP", "USD", "EUR"] as Currency[]).map((curr) => (
                <Pressable
                  key={curr}
                  style={({ pressed }) => [
                    styles.currencyOption,
                    currency === curr && styles.currencyOptionActive,
                    pressed && styles.currencyOptionPressed,
                  ]}
                  onPress={() => setCurrency(curr)}
                >
                  <View
                    style={[
                      styles.currencyIconContainer,
                      currency === curr && styles.currencyIconContainerActive,
                    ]}
                  >
                    <Ionicons
                      name={
                        curr === "CLP"
                          ? "wallet"
                          : curr === "USD"
                          ? "logo-usd"
                          : "logo-euro"
                      }
                      size={24}
                      color={currency === curr ? "#fff" : "#6366f1"}
                    />
                  </View>
                  <View style={styles.currencyInfo}>
                    <Text
                      style={[
                        styles.currencyCode,
                        currency === curr && styles.currencyCodeActive,
                      ]}
                    >
                      {curr}
                    </Text>
                    <Text
                      style={[
                        styles.currencyName,
                        currency === curr && styles.currencyNameActive,
                      ]}
                    >
                      {curr === "CLP"
                        ? "Peso Chileno"
                        : curr === "USD"
                        ? "Dólar"
                        : "Euro"}
                    </Text>
                  </View>
                  {currency === curr && (
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {person ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                <Text style={styles.cardTitle}>Persona Asociada</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="person" size={18} color="#10b981" />
                  <Text style={styles.label}>Nombre</Text>
                </View>
                <Text style={styles.value}>{person.name}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="key" size={18} color="#10b981" />
                  <Text style={styles.label}>ID</Text>
                </View>
                <Text style={styles.valueSmall}>{person._id}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="person-add" size={24} color="#f59e0b" />
                <Text style={styles.cardTitle}>Crear Persona</Text>
              </View>
              <Text style={styles.helpText}>
                Necesitas una persona para realizar compras
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person"
                  size={20}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Nombre completo"
                  value={personName}
                  onChangeText={setPersonName}
                  style={styles.input}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  loading && styles.buttonDisabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleCreatePerson}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="add-circle" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Crear Persona</Text>
                  </>
                )}
              </Pressable>
            </View>
          )}

          {person && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="receipt" size={24} color="#6366f1" />
                <Text style={styles.cardTitle}>Historial de Compras</Text>
              </View>

              {loadingPurchases ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#6366f1" />
                  <Text style={styles.loadingText}>Cargando historial...</Text>
                </View>
              ) : purchases.length === 0 ? (
                <View style={styles.emptyPurchases}>
                  <Ionicons name="cart-outline" size={48} color="#cbd5e1" />
                  <Text style={styles.emptyPurchasesText}>
                    Aún no has realizado compras
                  </Text>
                  <Text style={styles.emptyPurchasesSubtext}>
                    Ve a la pestaña 'Compras' para empezar
                  </Text>
                </View>
              ) : (
                <View style={styles.purchasesList}>
                  {purchases.map((purchase, index) => (
                    <View key={purchase._id} style={styles.purchaseCard}>
                      <View style={styles.purchaseHeader}>
                        <View style={styles.purchaseIcon}>
                          <Ionicons
                            name="bag-check"
                            size={20}
                            color="#10b981"
                          />
                        </View>
                        <View style={styles.purchaseInfo}>
                          <Text style={styles.purchaseTitle}>
                            Compra #{purchases.length - index}
                          </Text>
                          <Text style={styles.purchaseItems}>
                            {purchase.items.length}{" "}
                            {purchase.items.length === 1
                              ? "producto"
                              : "productos"}
                          </Text>
                        </View>
                        <Text style={styles.purchaseTotal}>
                          {getCurrencySymbol()} {formatPrice(purchase.total)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#ef4444" />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </Pressable>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="bulb" size={24} color="#6366f1" />
              <Text style={styles.infoTitle}>Siguiente paso</Text>
            </View>
            <Text style={styles.infoText}>
              {person
                ? "Ve a la pestaña 'Compras' para empezar a comprar productos"
                : "Crea una persona para poder realizar compras"}
            </Text>
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
  contentWrapper: {
    padding: 16,
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
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
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
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  buttonPressed: {
    backgroundColor: "#4f46e5",
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  switchButton: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 8,
  },
  switchText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
  },
  valueSmall: {
    fontSize: 12,
    color: "#64748b",
    fontFamily: "Courier New",
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 16,
  },
  helpText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#fee2e2",
    boxShadow: "0px 2px 8px rgba(239, 68, 68, 0.1)",
  },
  logoutButtonPressed: {
    backgroundColor: "#fef2f2",
    transform: [{ scale: 0.98 }],
  },
  logoutButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: "#eff6ff",
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
    marginBottom: 8,
  },
  credentialsBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  credentialsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
  },
  credentialsText: {
    fontSize: 13,
    color: "#475569",
    fontFamily: "Courier New",
    marginBottom: 4,
  },
  // Purchase History
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
  },
  emptyPurchases: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyPurchasesText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
  },
  emptyPurchasesSubtext: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 8,
  },
  purchasesList: {
    gap: 12,
  },
  purchaseCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  purchaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  purchaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#d1fae5",
    justifyContent: "center",
    alignItems: "center",
  },
  purchaseInfo: {
    flex: 1,
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  purchaseItems: {
    fontSize: 13,
    color: "#64748b",
  },
  purchaseTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6366f1",
    fontFamily: "Courier New",
  },
  // Currency Selector
  currencySelector: {
    gap: 12,
    marginTop: 8,
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  currencyOptionActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  currencyOptionPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  currencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  currencyIconContainerActive: {
    backgroundColor: "#818cf8",
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  currencyCodeActive: {
    color: "#fff",
  },
  currencyName: {
    fontSize: 14,
    color: "#64748b",
  },
  currencyNameActive: {
    color: "#e0e7ff",
  },
});
