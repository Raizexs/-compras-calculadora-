import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Currency = "CLP" | "USD" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (priceInCLP: number) => number;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

// Tasas de conversión (CLP como base)
const EXCHANGE_RATES = {
  CLP: 1,
  USD: 0.0011, // 1 CLP = 0.0011 USD (aprox 900 CLP = 1 USD)
  EUR: 0.001, // 1 CLP = 0.0010 EUR (aprox 1000 CLP = 1 EUR)
};

const CURRENCY_SYMBOLS = {
  CLP: "$",
  USD: "US$",
  EUR: "€",
};

const STORAGE_KEY = "@selected_currency";

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrencyState] = useState<Currency>("CLP");

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCurrencyState(stored as Currency);
      }
    } catch (error) {
      console.error("Error loading currency:", error);
    }
  };

  const setCurrency = async (newCurrency: Currency) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newCurrency);
      setCurrencyState(newCurrency);
    } catch (error) {
      console.error("Error saving currency:", error);
    }
  };

  const convertPrice = (priceInCLP: number): number => {
    return priceInCLP * EXCHANGE_RATES[currency];
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);

    switch (currency) {
      case "CLP":
        return new Intl.NumberFormat("es-CL", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(convertedPrice);

      case "USD":
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(convertedPrice);

      case "EUR":
        return new Intl.NumberFormat("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(convertedPrice);

      default:
        return convertedPrice.toString();
    }
  };

  const getCurrencySymbol = (): string => {
    return CURRENCY_SYMBOLS[currency];
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        getCurrencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
