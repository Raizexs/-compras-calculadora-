// API Configuration
// Cambia esta URL según tu entorno

// Para desarrollo con Expo:
// - Android Emulator: usar 10.0.2.2
// - iOS Simulator: usar localhost
// - Dispositivo físico: usar la IP de tu computadora en la red local

export const API_CONFIG = {
  // Cambia esto por tu IP local o el dominio de tu servidor
  BASE_URL: "http://localhost:8000",

  // Alternativas comunes:
  // Android Emulator: "http://10.0.2.2:8000"
  // Dispositivo físico en misma red: "http://192.168.1.X:8000" (reemplaza X con tu IP)
  // Producción: "https://tu-api.com"

  TIMEOUT: 10000, // 10 segundos
};

// Ayuda para obtener tu IP local:
// Windows (CMD): ipconfig
// macOS/Linux (Terminal): ifconfig o ip addr show
