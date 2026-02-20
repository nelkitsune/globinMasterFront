"use client";

import { AdminGuard } from "@/components/AdminGuard";
import Link from "next/link";

export default function AdminPage() {
    return (
        <AdminGuard>
            <div className="container">
                <div className="mb-8">
                    <h1 className="brand text-4xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                        Panel de Administración
                    </h1>
                    <p className="muted text-lg">Gestiona dotes, conjuros y normas</p>
                </div>

                {/* Cards de módulos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                    {/* Card Feats */}
                    <Link href="/admin/feats">
                        <div
                            className="p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
                            style={{
                                backgroundColor: "var(--card)",
                                border: "2px solid var(--olive-500)",
                            }}
                        >
                            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                                ⚔️ Dotes
                            </h3>
                            <p className="muted mb-4 text-sm">
                                Crear, editar y gestionar dotes disponibles en el sistema.
                            </p>
                            <button
                                className="w-full py-2 rounded-md font-semibold transition-colors"
                                style={{
                                    backgroundColor: "var(--olive-600)",
                                    color: "white",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--olive-700)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--olive-600)";
                                }}
                            >
                                Gestionar Dotes
                            </button>
                        </div>
                    </Link>

                    {/* Card Spells */}
                    <Link href="/admin/spells">
                        <div
                            className="p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
                            style={{
                                backgroundColor: "var(--card)",
                                border: "2px solid var(--olive-500)",
                            }}
                        >
                            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                                ✨ Conjuros
                            </h3>
                            <p className="muted mb-4 text-sm">
                                Crear, editar y gestionar conjuros disponibles en el sistema.
                            </p>
                            <button
                                className="w-full py-2 rounded-md font-semibold transition-colors"
                                style={{
                                    backgroundColor: "var(--olive-600)",
                                    color: "white",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--olive-700)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--olive-600)";
                                }}
                            >
                                Gestionar Conjuros
                            </button>
                        </div>
                    </Link>

                    {/* Card Rules */}
                    <Link href="/admin/rules">
                        <div
                            className="p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
                            style={{
                                backgroundColor: "var(--card)",
                                border: "2px solid var(--olive-500)",
                            }}
                        >
                            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                                📜 Normas
                            </h3>
                            <p className="muted mb-4 text-sm">
                                Crear, editar y gestionar normas personalizadas del juego.
                            </p>
                            <button
                                className="w-full py-2 rounded-md font-semibold transition-colors"
                                style={{
                                    backgroundColor: "var(--olive-600)",
                                    color: "white",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--olive-700)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--olive-600)";
                                }}
                            >
                                Gestionar Normas
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
        </AdminGuard>
    );
}
