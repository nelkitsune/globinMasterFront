"use client";
import { create } from "zustand";
import { authEndpoints, LoginPayload, RegisterPayload } from "@/lib/authApiClient";
import { useCampaignStore } from "@/store/useCampaignStore";
import { useIniciativaStore } from "@/store/useIniciativaStore";

interface User {
  id: number;
  username: string;
  email: string;
  biography?: string | null;
  avatar_url?: string | null;
  avatar_public_id?: string | null;
  role?: string;
  user_code?: string | null;
  active?: number | boolean;
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
  setUser: (user: User | null) => void;
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

    const rawToken = localStorage.getItem("token");
    const token = rawToken && rawToken !== "undefined" && rawToken !== "null" ? rawToken : null;
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
      // Si no hay user guardado, pedirlo al backend
      if (!user) {
        authEndpoints.getCurrentUser()
          .then((currentUser) => {
            set({ user: currentUser });
            localStorage.setItem("user", JSON.stringify(currentUser));
          })
          .catch((err) => {
            console.error("Error hydrating user from /auth/me:", err);
            // Si falla (401), limpiar sesión
            if (err?.response?.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              set({ token: null, user: null, isAuthenticated: false });
            }
          });
      }
    } else if (rawToken) {
      localStorage.removeItem("token");

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

      const token = response.token || (response as any).accessToken || (response as any).jwt;
      if (!token) {
        set({ loading: false, error: "Login sin token. Revisa el backend." });
        throw new Error("Login response without token");
      }

      localStorage.setItem("token", token);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      set({
        token,
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

      const token = response.token || (response as any).accessToken || (response as any).jwt;
      if (!token) {
        set({ loading: false, error: "Registro sin token. Revisa el backend." });
        throw new Error("Register response without token");
      }

      // Auto-login después del registro
      localStorage.setItem("token", token);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      set({
        token,
        user: response.user || null,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      // Si el login no devuelve user, pedirlo a /auth/me
      if (!response.user) {
        try {
          const currentUser = await authEndpoints.getCurrentUser();
          localStorage.setItem("user", JSON.stringify(currentUser));
          set({ user: currentUser });
        } catch (fetchError) {
          console.error("Error fetching current user after login:", fetchError);
        }
      }
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
    useCampaignStore.getState().resetStore();
    useIniciativaStore.getState().resetStore();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  setUser: (user: User | null) => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
    set({ user });
  },
}));
