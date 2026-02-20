"use client";
import { create } from "zustand";
import { authEndpoints, LoginPayload, RegisterPayload } from "@/lib/authApiClient";
import { useCampaignStore } from "@/store/useCampaignStore";
import { useIniciativaStore } from "@/store/useIniciativaStore";

// Helper: Decodificar JWT sin librerías externas
const decodeJWT = (token: string): any => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Error decodificando JWT:", e);
    return null;
  }
};

const normalizeRole = (role?: string | null) => {
  if (!role) return undefined;
  return String(role).trim().toUpperCase();
};

const extractRoleFromUnknown = (source: any): string | undefined => {
  if (!source) return undefined;

  const directRole = normalizeRole(source.role);
  if (directRole) return directRole;

  if (Array.isArray(source.roles) && source.roles.length > 0) {
    const firstRole = normalizeRole(source.roles[0]);
    if (firstRole) return firstRole.replace(/^ROLE_/, "");
  }

  if (Array.isArray(source.authorities) && source.authorities.length > 0) {
    const authority = source.authorities.find((value: unknown) =>
      String(value).toUpperCase().includes("ADMIN")
    );
    if (authority) return "ADMIN";
  }

  if (source.isAdmin === true) return "ADMIN";

  const username = String(source.username || "").trim().toLowerCase();
  const email = String(source.email || "").trim().toLowerCase();
  if (username === "admin" || email.startsWith("admin@")) {
    return "ADMIN";
  }

  return undefined;
};

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
      // Decodificar JWT para extraer role si no está en el user
      const decodedJWT = decodeJWT(token);

      // Validar si el token tiene claim role (tokens nuevos post-fix backend)
      if (decodedJWT && !decodedJWT.role && user?.username === "admin") {
        console.warn("[AUTH] Token antiguo sin claim role detectado. Se requiere nuevo login.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, isAuthenticated: false });
        return;
      }

      const jwtRole = extractRoleFromUnknown(decodedJWT);

      if (user?.role) {
        user.role = normalizeRole(user.role);
      }

      if (user && !user.role) {
        const inferredRoleFromUser = extractRoleFromUnknown(user);
        if (inferredRoleFromUser) {
          user.role = inferredRoleFromUser;
          console.log("[AUTH][hydrate] role inferido desde user local:", inferredRoleFromUser);
        }
      }

      if (jwtRole && (!user || !user.role)) {
        if (!user) user = {};
        user.role = jwtRole;
        console.log("[AUTH][hydrate] role extraído del JWT:", decodedJWT?.role, "=>", jwtRole);
      }

      console.log("[AUTH][hydrate] snapshot inicial", {
        hasToken: !!token,
        localStorageRole: user?.role,
        jwtRole,
      });

      set({
        token,
        user,
        isAuthenticated: true
      });

      // Si no hay user guardado o no tiene role después de decodificar JWT,
      // intentar obtener del backend
      if (!user || !user.role) {
        authEndpoints.getCurrentUser()
          .then((currentUser) => {
            currentUser.role = extractRoleFromUnknown(currentUser);
            console.log("User completo desde /auth/me en hydrate:", currentUser);
            // Agregar role del JWT si está disponible
            if (jwtRole && !currentUser.role) {
              currentUser.role = jwtRole;
            }

            if (!currentUser.role) {
              const inferredRole = extractRoleFromUnknown(currentUser);
              if (inferredRole) {
                currentUser.role = inferredRole;
                console.log("[AUTH][hydrate] role inferido fallback:", inferredRole);
              }
            }

            console.log("[AUTH][hydrate] role final desde backend:", currentUser.role);
            set({ user: currentUser });
            localStorage.setItem("user", JSON.stringify(currentUser));
          })
          .catch((err) => {
            const status = err?.response?.status;
            if (status !== 401 && status !== 403) {
              console.error("Error hydrating user from /auth/me:", err);
            }
            // Si falla (401/403), limpiar sesión
            if (status === 401 || status === 403) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              set({ token: null, user: null, isAuthenticated: false });
            }
          });
      }
    } else if (rawToken) {
      localStorage.removeItem("token");
    }
  },

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

      // Decodificar JWT para extraer el role
      let user = response.user || null;
      const decodedJWT = decodeJWT(token);
      const jwtRole = extractRoleFromUnknown(decodedJWT);
      if (user?.role) {
        user.role = normalizeRole(user.role);
      }
      if (user && !user.role) {
        user.role = extractRoleFromUnknown(user);
      }
      console.log("JWT decodificado:", decodedJWT);
      console.log("[AUTH][login] role backend:", response.user?.role, "| role jwt:", decodedJWT?.role, "=>", jwtRole);

      if (jwtRole) {
        // Si el JWT trae role, agregarlo al user
        if (!user) user = {};
        user.role = jwtRole;
        console.log("Role extraído del JWT:", decodedJWT?.role, "=>", jwtRole);
      } else if (user && !user.role) {
        // Si no está en JWT, intentar obtener de /auth/me
        try {
          console.log("No hay role en JWT, obteniendo datos de /auth/me");
          const fullUser = await authEndpoints.getCurrentUser();
          fullUser.role = extractRoleFromUnknown(fullUser);
          user = fullUser;
          console.log("User completo desde /auth/me:", user);
        } catch (err) {
          const status = (err as any)?.response?.status;
          if (status !== 401 && status !== 403) {
            console.error("Error obteniendo user completo:", err);
          }
          // Continuar mesmo sin role (fallback)
        }
      }

      if (user) {
        user.role = extractRoleFromUnknown(user);
        console.log("[AUTH][login] role final guardado:", user.role);
        localStorage.setItem("user", JSON.stringify(user));
      }

      set({
        token,
        user,
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

      // Decodificar JWT para extraer el role
      let user = response.user || null;
      const decodedJWT = decodeJWT(token);
      const jwtRole = extractRoleFromUnknown(decodedJWT);
      if (user?.role) {
        user.role = normalizeRole(user.role);
      }
      if (user && !user.role) {
        user.role = extractRoleFromUnknown(user);
      }
      console.log("JWT decodificado en register:", decodedJWT);
      console.log("[AUTH][register] role backend:", response.user?.role, "| role jwt:", decodedJWT?.role, "=>", jwtRole);

      if (jwtRole) {
        // Si el JWT trae role, agregarlo al user
        if (!user) user = {};
        user.role = jwtRole;
        console.log("Role extraído del JWT:", decodedJWT?.role, "=>", jwtRole);
      } else if (!user || !user.role) {
        // Si no está en JWT, intentar obtener de /auth/me
        try {
          console.log("No hay role en JWT/response, obteniendo datos de /auth/me");
          const currentUser = await authEndpoints.getCurrentUser();
          currentUser.role = extractRoleFromUnknown(currentUser);
          user = currentUser;
          console.log("User completo desde /auth/me:", user);
        } catch (err) {
          const status = (err as any)?.response?.status;
          if (status !== 401 && status !== 403) {
            console.error("Error obteniendo user completo:", err);
          }
          // Continuar con lo que tenemos
        }
      }

      if (user) {
        user.role = extractRoleFromUnknown(user);
        console.log("[AUTH][register] role final guardado:", user.role);
        localStorage.setItem("user", JSON.stringify(user));
      }

      set({
        token,
        user,
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
    const normalizedUser = user
      ? {
        ...user,
        role: extractRoleFromUnknown(user),
      }
      : null;

    if (typeof window !== "undefined") {
      if (normalizedUser) {
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      } else {
        localStorage.removeItem("user");
      }
    }
    set({ user: normalizedUser });
  },
}));
