"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listRules } from "@/api/rulesApi";
import { RuleResponse } from "@/types/rules";

export default function RulesListPage() {
    const [items, setItems] = useState<RuleResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRules = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await listRules();
                setItems(data);
            } catch (err: any) {
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Error al cargar reglas"
                );
            } finally {
                setLoading(false);
            }
        };

        loadRules();
    }, []);


    return (
        <main className="container">
            <div className="mb-6 text-center">
                <h1 className="brand text-3xl mb-2" style={{ color: "var(--olive-900)" }}>
                    Reglas
                </h1>
                <p className="muted text-base">
                    Explora reglas oficiales.
                </p>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 text-xs underline"
                    >
                        Descartar
                    </button>
                </div>
            )}

            <section
                className="rounded-2xl p-6"
                style={{ backgroundColor: "var(--card)" }}
            >
                {loading ? (
                    <p className="text-sm muted">Cargando reglas...</p>
                ) : items.length === 0 ? (
                    <p className="text-sm muted">
                        No hay reglas oficiales disponibles.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((rule) => (
                            <Link
                                key={rule.id}
                                href={`/rules/${rule.id}`}
                                className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4 transition hover:bg-[color:var(--olive-300)]/40"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <h2 className="font-semibold text-base">{rule.name}</h2>
                                </div>
                                {rule.description && (
                                    <p className="text-xs muted mt-2 line-clamp-3">
                                        {rule.description}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
