"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="container py-12">
        <div className="bg-[var(--card)] rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--olive-900)" }}>
            Dashboard
          </h1>
          
          <div className="mb-6">
            {user ? (
              <>
                <p className="text-lg">Bienvenido, <strong>{user.username}</strong>!</p>
                <p className="text-gray-600">{user.email}</p>
              </>
            ) : (
              <p className="text-lg">¡Bienvenido de nuevo!</p>
            )}
          </div>

          <div className="space-y-4">
            <p>Esta es una ruta protegida. Solo los usuarios autenticados pueden verla.</p>
            
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="btn btn-danger"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
