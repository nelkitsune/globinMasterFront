import axios from "axios";

const normalizeApiBase = (value: string): string => {
  const trimmed = value.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_URL = normalizeApiBase(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// debug: muestra la URL completa de cada request y errores
api.interceptors.request.use(cfg => {
  if (typeof window !== "undefined") {
    const rawToken = localStorage.getItem("token");
    const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;

    if (!token && rawToken) {
      localStorage.removeItem("token");
    }

    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    } else if (cfg.headers?.Authorization) {
      delete cfg.headers.Authorization;
    }
  }

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