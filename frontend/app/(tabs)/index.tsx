import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Item = {
  id: string;
  name: string;
  price: number;
  currency: string;
};

const STORAGE_KEYS = {
  ITEMS: "@calc_items",
  CURRENCY: "@calc_currency",
};

// Tasas de cambio a CLP
const EXCHANGE_RATES = {
  USD_TO_CLP: 950,
  EUR_TO_CLP: 1050,
};

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [priceText, setPriceText] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [currency, setCurrency] = useState<"CLP" | "USD" | "EUR">("CLP");

  // Persistencia: cargar al iniciar
  useEffect(() => {
    (async () => {
      try {
        const [rawItems, savedCurrency] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ITEMS),
          AsyncStorage.getItem(STORAGE_KEYS.CURRENCY),
        ]);
        if (rawItems) setItems(JSON.parse(rawItems));
        if (
          savedCurrency === "USD" ||
          savedCurrency === "EUR" ||
          savedCurrency === "CLP"
        ) {
          setCurrency(savedCurrency);
        }
      } catch (e) {
        console.warn("Error cargando datos:", e);
      }
    })();
  }, []);

  // Persistencia: guardar al cambiar
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items)).catch(
      () => {}
    );
  }, [items]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, currency).catch(() => {});
  }, [currency]);

  const convertToCLP = (price: number, fromCurrency: string): number => {
    if (fromCurrency === "CLP") return price;
    if (fromCurrency === "USD") return price * EXCHANGE_RATES.USD_TO_CLP;
    if (fromCurrency === "EUR") return price * EXCHANGE_RATES.EUR_TO_CLP;
    return price;
  };

  const addItem = () => {
    const price = Number(priceText.replace(",", "."));
    if (!name.trim())
      return Alert.alert("Validación", "Ingresa un nombre de producto.");
    if (isNaN(price) || price <= 0)
      return Alert.alert("Validación", "Ingresa un precio válido (> 0).");

    const newItem: Item = {
      id: Date.now().toString(),
      name: name.trim(),
      price: round2(price),
      currency: currency,
    };
    setItems((prev) => [newItem, ...prev]);
    setName("");
    setPriceText("");
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((it) => it.id !== id));
  const clearAll = () => setItems([]);

  // Convertir precio a la moneda seleccionada actualmente
  const convertToSelectedCurrency = (
    price: number,
    itemCurrency: string
  ): number => {
    // Si es la misma moneda, no convertir
    if (itemCurrency === currency) return price;

    // Convertir primero a CLP si no lo es
    const priceInCLP = convertToCLP(price, itemCurrency);

    // Si la moneda seleccionada es CLP, retornar
    if (currency === "CLP") return priceInCLP;

    // Convertir de CLP a la moneda seleccionada
    if (currency === "USD") return priceInCLP / EXCHANGE_RATES.USD_TO_CLP;
    if (currency === "EUR") return priceInCLP / EXCHANGE_RATES.EUR_TO_CLP;

    return price;
  };

  // Calcular total en la moneda seleccionada
  const total = items.reduce((acc, it) => {
    const priceInSelectedCurrency = convertToSelectedCurrency(
      it.price,
      it.currency
    );
    return acc + priceInSelectedCurrency;
  }, 0);

  // Redondeo a 2 decimales
  function round2(n: number) {
    return Math.round(n * 100) / 100;
  }

  const formatMoney = (price: number, curr: string) => {
    if (curr === "CLP") {
      const formatted = new Intl.NumberFormat("es-CL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
      return `CLP ${formatted}`;
    }
    // USD y EUR con símbolo
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMoneyWithConversion = (price: number, itemCurrency: string) => {
    // Si estamos en modo CLP
    if (currency === "CLP") {
      if (itemCurrency !== "CLP") {
        // Mostrar precio original con conversión a CLP
        const priceInCLP = convertToCLP(price, itemCurrency);
        const original = formatMoney(price, itemCurrency);
        const clpFormatted = new Intl.NumberFormat("es-CL", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(priceInCLP);
        return `${original} (CLP ${clpFormatted})`;
      }
      // Si el ítem ya está en CLP, mostrarlo normal
      return formatMoney(price, "CLP");
    }

    // Si estamos en USD o EUR, convertir todo a esa moneda
    const priceInSelectedCurrency = convertToSelectedCurrency(
      price,
      itemCurrency
    );
    return formatMoney(priceInSelectedCurrency, currency);
  };

  const isAddDisabled =
    !name.trim() ||
    isNaN(Number(priceText.replace(",", "."))) ||
    Number(priceText.replace(",", ".")) <= 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🛒 Calculadora de Compras</Text>
        <Text style={styles.subtitle}>Gestiona tus gastos fácilmente</Text>
      </View>

      {/* Card de configuración */}
      <View style={styles.card}>
        <View style={styles.pickerRow}>
          <Text style={styles.label}>💱 Moneda:</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={currency}
              onValueChange={(v) => setCurrency(v)}
              mode="dropdown"
              style={styles.picker}
            >
              <Picker.Item label="CLP" value="CLP" />
              <Picker.Item label="USD (1 = $950)" value="USD" />
              <Picker.Item label="EUR (1 = $1.050)" value="EUR" />
            </Picker>
          </View>
          <Pressable style={styles.clearButton} onPress={clearAll}>
            <Text style={styles.clearButtonText}>🗑️ Limpiar</Text>
          </Pressable>
        </View>

        {/* Inputs */}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Nombre del producto"
            value={name}
            onChangeText={setName}
            style={[styles.input, { flex: 1.5 }]}
            returnKeyType="next"
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Precio"
            value={priceText}
            onChangeText={setPriceText}
            keyboardType="decimal-pad"
            style={[styles.input, { flex: 1 }]}
            returnKeyType="done"
            onSubmitEditing={addItem}
            placeholderTextColor="#999"
          />
        </View>

        <Pressable
          style={[styles.addButton, isAddDisabled && styles.addButtonDisabled]}
          onPress={addItem}
          disabled={isAddDisabled}
        >
          <Text style={styles.addButtonText}>➕ Agregar Producto</Text>
        </Pressable>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total a Pagar</Text>
        <Text style={styles.total}>{formatMoney(round2(total), currency)}</Text>
        <Text style={styles.itemCount}>
          {items.length} {items.length === 1 ? "producto" : "productos"}
        </Text>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyText}>No hay productos aún</Text>
            <Text style={styles.emptySubtext}>
              Agrega tu primer producto arriba
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() => removeItem(item.id)}
            style={styles.item}
            android_ripple={{ color: "#e0e0e0" }}
          >
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Text style={styles.itemIconText}>📦</Text>
              </View>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemHint}>
                  Mantén presionado para eliminar
                </Text>
              </View>
            </View>
            <Text style={styles.itemPrice}>
              {formatMoneyWithConversion(item.price, item.currency)}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginRight: 12,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pickerBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
  },
  picker: {
    height: 50,
  },
  clearButton: {
    marginLeft: 12,
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
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
  },
  addButton: {
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  addButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  totalCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  total: {
    fontSize: 32,
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 13,
    color: "#9ca3af",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#ede9fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemIconText: {
    fontSize: 20,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  itemHint: {
    fontSize: 11,
    color: "#9ca3af",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4f46e5",
    textAlign: "right",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
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
  },
});
