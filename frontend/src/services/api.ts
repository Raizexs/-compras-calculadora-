import axios, { AxiosError } from "axios";
import { API_CONFIG } from "../config";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handler
const handleError = (error: AxiosError) => {
  if (error.response) {
    // Server responded with error status
    const message =
      (error.response.data as any)?.detail || "Error en el servidor";
    throw new Error(message);
  } else if (error.request) {
    // Request was made but no response
    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu conexión."
    );
  } else {
    // Something else happened
    throw new Error("Error inesperado: " + error.message);
  }
};

// ============= TYPES =============
export interface User {
  _id: string;
  email: string;
}

export interface Person {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  characteristics?: string[];
}

export interface PurchaseItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Purchase {
  _id: string;
  person_id: string;
  items: PurchaseItem[];
  total: number;
}

export interface TotalResponse {
  person_id: string;
  total: number;
  purchase_count: number;
}

// ============= AUTH API =============
export const authAPI = {
  register: async (email: string, password: string): Promise<User> => {
    try {
      const response = await api.post<User>("/auth/register", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await api.post<User>("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },
};

// ============= PERSONS API =============
export const personsAPI = {
  create: async (name: string): Promise<Person> => {
    try {
      const response = await api.post<Person>("/persons", { name });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  getById: async (personId: string): Promise<Person> => {
    try {
      const response = await api.get<Person>(`/persons/${personId}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  list: async (): Promise<Person[]> => {
    try {
      const response = await api.get<Person[]>("/persons");
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },
};

// ============= PRODUCTS API =============
export const productsAPI = {
  create: async (name: string, price: number): Promise<Product> => {
    try {
      const response = await api.post<Product>("/products", { name, price });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  list: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>("/products");
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  getById: async (productId: string): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/products/${productId}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },
};

// ============= PURCHASES API =============
export const purchasesAPI = {
  create: async (
    personId: string,
    items: PurchaseItem[]
  ): Promise<Purchase> => {
    try {
      const response = await api.post<Purchase>("/purchases", {
        person_id: personId,
        items,
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  getById: async (purchaseId: string): Promise<Purchase> => {
    try {
      const response = await api.get<Purchase>(`/purchases/${purchaseId}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  listByPerson: async (personId: string): Promise<Purchase[]> => {
    try {
      const response = await api.get<Purchase[]>(
        `/purchases/person/${personId}`
      );
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },

  getTotalByPerson: async (personId: string): Promise<TotalResponse> => {
    try {
      const response = await api.get<TotalResponse>(
        `/purchases/person/${personId}/total`
      );
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
      throw error;
    }
  },
};

// ============= HEALTH CHECK =============
export const healthCheck = async (): Promise<{
  status: string;
  message: string;
}> => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw error;
  }
};

export default api;
