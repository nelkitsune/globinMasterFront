"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface AdminGuardProps {
    children: React.ReactNode;
}

/**
 * AdminGuard: Protege rutas y componentes que requieren rol ADMIN
 * - Si el usuario no está autenticado → redirige a /login
 * - Si está autenticado pero role != ADMIN → redirige a /
 * - Muestra loader mientras valida (evita flicker)
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuthStore();
    const [isValidating, setIsValidating] = useState(true);
    const normalizedRole = String(user?.role || "").trim().toUpperCase();

    useEffect(() => {
        // Esperar a que hydrate() termine de cargar
        const checkAccess = async () => {
            // Si todavía está cargando auth, esperar
            if (loading) {
                return;
            }

            // Si no está autenticado → login
            if (!isAuthenticated || !user) {
                router.push("/login");
                return;
            }

            // Si no es ADMIN → home
            if (normalizedRole !== "ADMIN") {
                router.push("/");
                return;
            }

            // Todo OK
            setIsValidating(false);
        };

        const timer = setTimeout(checkAccess, 100);
        return () => clearTimeout(timer);
    }, [isAuthenticated, user, normalizedRole, loading, router]);

    // Mientras valida, mostrar loader
    if (isValidating || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg mb-2">Validando acceso...</p>
                    <p className="text-sm muted">Si acabas de actualizar el backend, puede que necesites hacer logout/login para obtener un nuevo token.</p>
                </div>
            </div>
        );
    }

    // Si llegó aquí, es ADMIN
    return <>{children}</>;
};
