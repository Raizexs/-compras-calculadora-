import { useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function App() {
  const [name, setName] = useState("");
  const [priceText, setPriceText] = useState("");
  const [items, setItems] = useState([]);

  const addItem = () => {
    const price = Number(priceText.replace(",", "."));

    if (!name.trim()) {
      return Alert.alert("Validación", "Ingresa un nombre de producto.");
    }
    if (isNaN(price) || price <= 0) {
      return Alert.alert("Validación", "Ingresa un precio válido (> 0).");
    }

    const newItem = { id: Date.now().toString(), name: name.trim(), price };
    setItems((prev) => [newItem, ...prev]);
    setName("");
    setPriceText("");
  };

  const total = items.reduce((acc, it) => acc + it.price, 0);

  const formatCLP = (n) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(n);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Calculadora de Compras</Text>

      <View style={styles.row}>
        <TextInput
          placeholder="Producto"
          value={name}
          onChangeText={setName}
          style={[styles.input, { flex: 1.4 }]}
        />
        <TextInput
          placeholder="Precio"
          value={priceText}
          onChangeText={setPriceText}
          keyboardType="decimal-pad"
          style={[styles.input, { flex: 1 }]}
        />
        <Button title="Agregar" onPress={addItem} />
      </View>

      <Text style={styles.total}>Total: {formatCLP(total)}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <View style={styles.item} onTouchEndCapture={() => {}}>
            <Text
              style={styles.itemName}
              onLongPress={() =>
                setItems((prev) => prev.filter((it) => it.id !== item.id))
              }
            >
              {item.name}
            </Text>
            <Text style={styles.itemPrice}>{formatCLP(item.price)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#888", textAlign: "center", marginTop: 20 }}>
            Sin productos aún
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  total: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: { fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: "600" },
});

const isAddDisabled =
  !name.trim() ||
  isNaN(Number(priceText.replace(",", "."))) ||
  Number(priceText.replace(",", ".")) <= 0;
// ...
<Button title="Agregar" onPress={addItem} disabled={isAddDisabled} />;
