"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SpellLevel, getBySpellClassAndLevel } from "@/api/spellsApi";
import Link from "next/link";

export default function SpellClassPage() {
    const params = useParams();
    const rawId = params?.id;
    const [spellsByLevelMap, setSpellsByLevelMap] = useState<Record<number, SpellLevel[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const idNum = rawId ? Number(rawId) : NaN;
        if (!rawId || Number.isNaN(idNum)) {
            setLoading(false);
            setError("ID de clase inválido");
            return;
        }

        setLoading(true);
        setError(null);

        const fetchAllLevels = async () => {
            try {
                const promises: Promise<SpellLevel[]>[] = [];
                for (let lvl = 0; lvl <= 9; lvl++) {
                    promises.push(getBySpellClassAndLevel(idNum, lvl));
                }
                const results = await Promise.all(promises);
                const spellMap: Record<number, SpellLevel[]> = {};

                for (let lvl = 0; lvl <= 9; lvl++) {
                    // El backend ya filtra por usuario autenticado
                    spellMap[lvl] = results[lvl] || [];
                }

                setSpellsByLevelMap(spellMap);
            } catch (e: any) {
                setError(e?.message || "Error cargando conjuros");
            } finally {
                setLoading(false);
            }
        };

        fetchAllLevels();
    }, [rawId]);

    if (loading) return <p className="p-4 text-center">Cargando conjuros...</p>;
    if (error) return <p className="p-4 text-red-500 text-center">{error}</p>;

    const allSpells = Object.values(spellsByLevelMap).flat();
    const hasSpells = allSpells.length > 0;

    return (
        <div className="container">
            <Link href="/spells" className="text-sm underline opacity-70 mb-4 inline-block">← Volver</Link>

            <div className="text-center mb-8">
                <h1 className="brand text-4xl mb-2" style={{ color: "var(--olive-900)" }}>
                    Conjuros por Nivel
                </h1>
                <p className="muted text-lg">Conjuros oficiales disponibles</p>
            </div>

            {!hasSpells ? (
                <p className="text-center muted py-8">No hay conjuros disponibles para esta clase.</p>
            ) : (
                <div className="space-y-8">
                    {Array.from({ length: 10 }, (_, lvl) => lvl).map((level) => {
                        const list = spellsByLevelMap[level] || [];

                        return (
                            <section key={level}>
                                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--olive-700)" }}>
                                    Nivel {level}
                                </h2>
                                {list.length === 0 ? (
                                    <p className="text-sm muted italic">No hay conjuros de este nivel.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {list
                                            .map((spellLevel, idx) => {
                                                // Ser flexible: obtener spell de donde sea que esté
                                                const spell = (spellLevel as any)?.spell || (spellLevel as any);
                                                const spellId = spell?.id || (spellLevel as any)?.spellId;

                                                if (!spellId) return null;

                                                const spellName = spell?.name || spell?.nombre || "Sin nombre";
                                                const spellSummary = spell?.summary || spell?.descripcion || spell?.description;
                                                const castingTime = spell?.castingTime || spell?.castingTime;
                                                const schoolName = spell?.schoolName || spell?.schoolCode;
                                                const subschoolName = spell?.subschoolName;
                                                const target = spell?.target;

                                                return (
                                                    <Link href={`/spells/${spellId}`} key={`${spellId}-${idx}`}>
                                                        <div
                                                            className="p-4 rounded-2xl transition-transform hover:shadow-lg hover:-translate-y-1"
                                                            style={{
                                                                backgroundColor: "var(--card)",
                                                                border: "1px solid var(--olive-300)",
                                                            }}
                                                        >
                                                            <h3 className="font-bold text-lg" style={{ color: "var(--olive-900)" }}>
                                                                {spellName}
                                                            </h3>
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {schoolName && (
                                                                    <span className="text-[11px] bg-blue-200 text-blue-900 px-2 py-1 rounded">
                                                                        {schoolName}
                                                                    </span>
                                                                )}
                                                                {subschoolName && (
                                                                    <span className="text-[11px] bg-indigo-200 text-indigo-900 px-2 py-1 rounded">
                                                                        {subschoolName}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {spellSummary && (
                                                                <p className="text-sm muted mt-2 line-clamp-2">{spellSummary}</p>
                                                            )}
                                                            {castingTime && (
                                                                <p className="text-xs muted mt-2">
                                                                    <strong>Tiempo:</strong> {castingTime}
                                                                </p>
                                                            )}
                                                            {target && (
                                                                <p className="text-xs muted mt-1 line-clamp-1">
                                                                    <strong>Objetivo:</strong> {target}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                        }
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}