import { Product } from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@shared_cart_data";

type CartData = { [productId: string]: number };

export function useSharedCart() {
  const [cart, setCart] = useState<CartData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveCart();
    }
  }, [cart, isLoaded]);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
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

  const setQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (quantity <= 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = quantity;
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const getTotalItems = (): number => {
    return Object.values(cart).reduce((acc, qty) => acc + qty, 0);
  };

  const calculateTotal = (products: Product[]): number => {
    return products.reduce((acc, product) => {
      const quantity = cart[product._id] || 0;
      return acc + product.price * quantity;
    }, 0);
  };

  const getCartItems = (products: Product[]) => {
    return products
      .filter((p) => cart[p._id] && cart[p._id] > 0)
      .map((p) => ({
        product: p,
        quantity: cart[p._id],
      }));
  };

  return {
    cart,
    isLoaded,
    updateQuantity,
    setQuantity,
    clearCart,
    getTotalItems,
    calculateTotal,
    getCartItems,
  };
}
