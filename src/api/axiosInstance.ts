import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// debug: muestra la URL completa de cada request y errores
api.interceptors.request.use(cfg => {
  // eslint-disable-next-line no-console
  console.debug("API request:", cfg.method, `${cfg.baseURL}${cfg.url}`);
  return cfg;
});
api.interceptors.response.use(
  r => r,
  err => {
    // eslint-disable-next-line no-console
    console.error("API error:", err?.response?.status, err?.config?.url, err?.response?.data);
    return Promise.reject(err);
  }
);