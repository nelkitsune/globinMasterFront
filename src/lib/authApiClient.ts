"use client";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: añade Authorization header
authApi.interceptors.request.use(
  (config) => {
    const url = config.url ?? "";
    const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/register");
    if (typeof window !== "undefined") {
      const rawToken = localStorage.getItem("token");
      const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;

      if (!token && rawToken) {
        localStorage.removeItem("token");
      }

      if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
    }

    console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    console.log("📦 Request body:", config.data);
    console.log("📋 Headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: maneja 401
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

authApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.error("❌ API Error:", error?.response?.status, error?.config?.url);
    console.error("Response data:", error?.response?.data);

    const config = error?.config as (typeof error.config & { _retryCount?: number }) | undefined;
    const isNetworkError = !error?.response;
    const isGet = (config?.method || "").toLowerCase() === "get";
    const retryCount = config?._retryCount ?? 0;

    if (isNetworkError && isGet && config && retryCount < 2) {
      config._retryCount = retryCount + 1;
      await sleep(400 * config._retryCount);
      return authApi(config);
    }

    // Si es 401, logout automático
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// DTOs
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

// Endpoints de autenticación
export const authEndpoints = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await authApi.post<AuthResponse>("/auth/register", payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await authApi.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  // Ejemplo de endpoint protegido
  getCurrentUser: async () => {
    const response = await authApi.get("/auth/me");
    return response.data;
  },
};
