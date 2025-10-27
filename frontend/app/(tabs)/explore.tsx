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
import { authAPI, Person, personsAPI, User } from "../../src/services/api";

const STORAGE_KEYS = {
  USER: "@user_data",
  PERSON: "@person_data",
};

export default function TabTwoScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [personName, setPersonName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    loadStoredData();
  }, []);

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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? "🔐 Iniciar Sesión" : "📝 Registrarse"}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin ? "Ingresa tus credenciales" : "Crea una cuenta nueva"}
            </Text>
          </View>

          <View style={styles.card}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
            />

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? "Iniciar Sesión" : "Registrarse"}
                </Text>
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
            <Text style={styles.infoTitle}>ℹ️ Información</Text>
            <Text style={styles.infoText}>
              Esta es una versión demo. Las contraseñas se almacenan sin
              encriptación.
            </Text>
            <Text style={styles.infoText}>
              Credenciales de prueba:{"\n"}
              Email: alumno@unab.cl{"\n"}
              Contraseña: 123456
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>👤 Mi Perfil</Text>
          <Text style={styles.subtitle}>Gestiona tu información</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📧 Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>🆔 ID:</Text>
            <Text style={styles.valueSmall}>{user?._id}</Text>
          </View>
        </View>

        {person ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✅ Persona Asociada</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>👤 Nombre:</Text>
              <Text style={styles.value}>{person.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>🆔 ID:</Text>
              <Text style={styles.valueSmall}>{person._id}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>➕ Crear Persona</Text>
            <Text style={styles.helpText}>
              Necesitas una persona para realizar compras
            </Text>

            <TextInput
              placeholder="Nombre completo"
              value={personName}
              onChangeText={setPersonName}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleCreatePerson}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Crear Persona</Text>
              )}
            </Pressable>
          </View>
        )}

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
        </Pressable>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Siguiente paso</Text>
          <Text style={styles.infoText}>
            {person
              ? "Ve a la pestaña 'Compras' para empezar a comprar productos"
              : "Crea una persona para poder realizar compras"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    backgroundColor: "#4f46e5",
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#e0e7ff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 15,
    backgroundColor: "#f9fafb",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  switchButton: {
    marginTop: 16,
    alignItems: "center",
  },
  switchText: {
    color: "#4f46e5",
    fontSize: 14,
    fontWeight: "500",
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
  },
  valueSmall: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "monospace",
  },
  helpText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fbbf24",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#78350f",
    lineHeight: 20,
    marginBottom: 4,
  },
});
