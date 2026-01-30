"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { validateRegisterForm } from "@/lib/validation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, error, loading, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setValidationErrors({});
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación del lado del cliente
    const validation = validateRegisterForm(formData);
    const errors: Record<string, string> = {};
    
    Object.entries(validation).forEach(([key, value]) => {
      if (value) errors[key] = value;
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      // El useEffect manejará la redirección
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="bg-[var(--card)] rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6" style={{ color: "var(--olive-900)" }}>
          Crear Cuenta
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--olive-500)] focus:outline-none"
              placeholder="usuario123"
            />
            {validationErrors.username && (
              <span className="error-message">{validationErrors.username}</span>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--olive-500)] focus:outline-none"
              placeholder="tucorreo@ejemplo.com"
            />
            {validationErrors.email && (
              <span className="error-message">{validationErrors.email}</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--olive-500)] focus:outline-none"
              placeholder="********"
            />
            {validationErrors.password && (
              <span className="error-message">{validationErrors.password}</span>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--olive-500)] focus:outline-none"
              placeholder="********"
            />
            {validationErrors.confirmPassword && (
              <span className="error-message">{validationErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[var(--olive-700)] font-semibold hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
