import axios from "axios";

/**
 * Para mock: NEXT_PUBLIC_API_URL no definida -> usa http://localhost:3001/api
 * Para prod/dev real: definí NEXT_PUBLIC_API_URL en .env.local (ej: http://localhost:8080/api)
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  // Si necesitás credenciales/cookies entre dominios:
  // withCredentials: true,
});

// Interceptor opcional para errores
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);
