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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: maneja 401
authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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
