"use client";
import { create } from "zustand";
import { authEndpoints, LoginPayload, RegisterPayload } from "@/lib/authApiClient";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;

  // Actions
  hydrate: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,

  // Hidratar desde localStorage
  hydrate: () => {
    if (typeof window === "undefined") return;
    
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user = null;
    
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    
    if (token) {
      set({ 
        token,
        user,
        isAuthenticated: true 
      });
      
      // Opcionalmente cargar datos del usuario si el endpoint existe
      // authEndpoints.getCurrentUser()
      //   .then((user) => set({ user }))
      //   .catch(() => {
      //     // Si falla, el token era inválido
      //     localStorage.removeItem("token");
      //     set({ token: null, isAuthenticated: false });
      //   });
    }
  },

  // Login
  login: async (payload: LoginPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await authEndpoints.login(payload);
      
      localStorage.setItem("token", response.token);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      
      set({
        token: response.token,
        user: response.user || null,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      const message = error?.response?.data?.message 
        || error?.response?.data?.error
        || error?.message 
        || "Error al iniciar sesión";
      set({ 
        loading: false, 
        error: message,
        isAuthenticated: false 
      });
      throw error;
    }
  },

  // Register
  register: async (payload: RegisterPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await authEndpoints.register(payload);
      
      // Auto-login después del registro
      localStorage.setItem("token", response.token);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      
      set({
        token: response.token,
        user: response.user || null,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Register error:", error);
      const message = error?.response?.data?.message 
        || error?.response?.data?.error
        || error?.message 
        || "Error al registrarse";
      set({ 
        loading: false, 
        error: message,
        isAuthenticated: false 
      });
      throw error;
    }
  },

  // Logout
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
