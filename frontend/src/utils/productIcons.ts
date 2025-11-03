// Mapeo de productos con sus emojis representativos
export const getProductEmoji = (productName: string): string => {
  const name = productName.toLowerCase();

  // Lácteos
  if (name.includes("leche")) return "🥛";
  if (name.includes("yogurt")) return "🥛";
  if (name.includes("queso")) return "🧀";

  // Panadería
  if (name.includes("pan")) return "🍞";

  // Huevos
  if (name.includes("huevo")) return "🥚";

  // Granos y cereales
  if (name.includes("arroz")) return "🍚";
  if (name.includes("pasta")) return "🍝";

  // Condimentos y aceites
  if (name.includes("aceite")) return "🫒";
  if (name.includes("azúcar")) return "🧂";
  if (name.includes("sal")) return "🧂";

  // Bebidas
  if (name.includes("café")) return "☕";
  if (name.includes("té")) return "🍵";
  if (name.includes("jugo")) return "🧃";
  if (name.includes("agua")) return "💧";

  // Frutas
  if (name.includes("manzana")) return "🍎";
  if (name.includes("plátano") || name.includes("banana")) return "🍌";
  if (name.includes("naranja")) return "🍊";
  if (name.includes("uva")) return "🍇";
  if (name.includes("frutilla") || name.includes("fresa")) return "🍓";
  if (name.includes("pera")) return "🍐";
  if (name.includes("sandía")) return "🍉";
  if (name.includes("melón")) return "🍈";

  // Verduras
  if (name.includes("tomate")) return "🍅";
  if (name.includes("lechuga")) return "🥬";
  if (name.includes("zanahoria")) return "🥕";
  if (name.includes("papa") || name.includes("patata")) return "🥔";
  if (name.includes("cebolla")) return "🧅";
  if (name.includes("ajo")) return "🧄";
  if (name.includes("pimiento") || name.includes("pimentón")) return "🫑";
  if (name.includes("brócoli")) return "🥦";

  // Carnes
  if (name.includes("pollo")) return "🍗";
  if (name.includes("carne") || name.includes("vacuno")) return "🥩";
  if (name.includes("cerdo")) return "🥓";
  if (name.includes("pescado")) return "🐟";
  if (name.includes("salmón")) return "🐟";

  // Snacks y dulces
  if (name.includes("chocolate")) return "🍫";
  if (name.includes("galleta")) return "🍪";
  if (name.includes("caramelo") || name.includes("dulce")) return "🍬";
  if (name.includes("helado")) return "🍦";
  if (name.includes("papas fritas") || name.includes("chips")) return "🍟";

  // Enlatados
  if (name.includes("atún")) return "🥫";
  if (name.includes("conserva")) return "🥫";

  // Default
  return "🛒";
};

// Colores para los productos según categoría
export const getProductColor = (productName: string): string => {
  const name = productName.toLowerCase();

  // Lácteos - Azul claro
  if (
    name.includes("leche") ||
    name.includes("yogurt") ||
    name.includes("queso")
  ) {
    return "#E3F2FD";
  }

  // Panadería - Naranja claro
  if (name.includes("pan")) {
    return "#FFF3E0";
  }

  // Frutas - Rosa/Rojo claro
  if (
    name.includes("manzana") ||
    name.includes("plátano") ||
    name.includes("naranja") ||
    name.includes("uva") ||
    name.includes("frutilla") ||
    name.includes("pera")
  ) {
    return "#FCE4EC";
  }

  // Verduras - Verde claro
  if (
    name.includes("tomate") ||
    name.includes("lechuga") ||
    name.includes("zanahoria") ||
    name.includes("papa") ||
    name.includes("cebolla")
  ) {
    return "#E8F5E9";
  }

  // Carnes - Rojo claro
  if (
    name.includes("pollo") ||
    name.includes("carne") ||
    name.includes("cerdo")
  ) {
    return "#FFEBEE";
  }

  // Granos - Amarillo claro
  if (name.includes("arroz") || name.includes("pasta")) {
    return "#FFFDE7";
  }

  // Default - Gris claro
  return "#F5F5F5";
};
