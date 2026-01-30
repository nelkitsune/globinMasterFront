"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();

  useEffect(() => {
    // Hidratar el store al montar
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    // Redirigir si no está autenticado
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Mostrar loading o nada mientras verifica
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Verificando autenticación...</p>
      </div>
    );
  }

  return <>{children}</>;
}
