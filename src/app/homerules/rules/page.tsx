"use client";

import { useEffect, useMemo, useState } from "react";
import { useRulesStore } from "@/store/useRulesStore";

export default function HomebrewRulesPage() {
    const { items, loading, error, fetchMine, clearError } = useRulesStore();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        fetchMine();
    }, []);

    useEffect(() => {
        if (items.length === 0) return;
        const exists = items.some((rule) => rule.id === selectedId);
        if (!exists) {
            setSelectedId(items[0].id);
        }
    }, [items, selectedId]);

    const selectedRule = useMemo(() => {
        if (!items.length) return null;
        return items.find((rule) => rule.id === selectedId) ?? items[0] ?? null;
    }, [items, selectedId]);

    return (
        <main className="container">
            <div className="mb-6 text-center">
                <h1 className="brand text-3xl mb-2" style={{ color: "var(--olive-900)" }}>
                    Reglas Caseras
                </h1>
                <p className="muted text-base">
                    Consulta las reglas personalizadas que creaste.
                </p>
            </div>

            <section
                className="rounded-2xl p-6"
                style={{ backgroundColor: "var(--card)" }}
            >
                {error && (
                    <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                        <button
                            onClick={clearError}
                            className="ml-2 text-xs underline"
                        >
                            Descartar
                        </button>
                    </div>
                )}

                {loading ? (
                    <p className="text-sm muted">Cargando reglas...</p>
                ) : items.length === 0 ? (
                    <p className="text-sm muted">
                        Aun no tienes reglas caseras creadas.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] gap-4">
                        <div className="space-y-2">
                            {items.map((rule) => {
                                const isSelected = rule.id === selectedId;
                                return (
                                    <button
                                        key={rule.id}
                                        onClick={() => setSelectedId(rule.id)}
                                        className={
                                            "w-full text-left rounded-xl border px-3 py-2 transition " +
                                            (isSelected
                                                ? "border-black/30 bg-[color:var(--olive-300)]/70"
                                                : "border-black/10 bg-[color:var(--olive-100)]/40 hover:bg-[color:var(--olive-300)]/40")
                                        }
                                    >
                                        <div className="font-semibold text-sm">{rule.name}</div>
                                        {rule.description && (
                                            <div className="text-xs muted line-clamp-2">
                                                {rule.description}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedRule && (
                            <div className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4">
                                <h2 className="text-xl font-bold">
                                    {selectedRule.name}
                                </h2>
                                {selectedRule.originalName && (
                                    <p className="text-xs muted">
                                        {selectedRule.originalName}
                                    </p>
                                )}
                                <div className="mt-3 space-y-3 text-sm">
                                    <div>
                                        <p className="font-semibold">Descripcion</p>
                                        <p className="whitespace-pre-line">
                                            {selectedRule.description}
                                        </p>
                                    </div>
                                    {(selectedRule.pages || selectedRule.books) && (
                                        <div>
                                            <p className="font-semibold">Referencia</p>
                                            <p>
                                                {[selectedRule.pages, selectedRule.books]
                                                    .filter(Boolean)
                                                    .join(" | ")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}
