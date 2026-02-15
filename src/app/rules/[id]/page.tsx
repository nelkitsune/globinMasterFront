"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getRule } from "@/api/rulesApi";
import { RuleResponse } from "@/types/rules";

export default function RuleDetailPage() {
    const params = useParams();
    const rawId = params?.id;
    const [rule, setRule] = useState<RuleResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = Number(rawId);
        if (!rawId || Number.isNaN(id)) return;

        setLoading(true);
        getRule(id)
            .then((data) => setRule(data))
            .catch((error) => console.error("Error fetching rule:", error))
            .finally(() => setLoading(false));
    }, [rawId]);

    if (loading) {
        return <p className="p-4">Cargando...</p>;
    }

    if (!rule) {
        return <p className="p-4">Regla no encontrada.</p>;
    }

    const badgeLabel = rule.isCustom ? "Homerule" : "Oficial";

    return (
        <main className="container">
            <Link href="/rules" className="text-sm underline opacity-80">
                ← Volver
            </Link>

            <div className="mt-4 rounded-2xl p-6" style={{ backgroundColor: "var(--card)" }}>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h1 className="text-3xl font-bold">{rule.name}</h1>
                    <span
                        className={
                            "text-xs px-3 py-1 rounded-full border " +
                            (rule.isCustom
                                ? "border-emerald-600/40 bg-emerald-100 text-emerald-900"
                                : "border-slate-400/60 bg-white/60 text-slate-700")
                        }
                    >
                        {badgeLabel}
                    </span>
                </div>

                {rule.originalName && (
                    <p className="text-xs muted mb-3">{rule.originalName}</p>
                )}

                <div className="space-y-4 text-sm">
                    <div>
                        <h2 className="text-lg font-semibold">Descripcion</h2>
                        <p className="whitespace-pre-line">{rule.description}</p>
                    </div>

                    {(rule.pages || rule.books) && (
                        <div>
                            <h2 className="text-lg font-semibold">Referencia</h2>
                            <p>
                                {[rule.pages, rule.books].filter(Boolean).join(" | ")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
