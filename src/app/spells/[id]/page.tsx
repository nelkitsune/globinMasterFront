"use client"
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSpellById, Spell } from "@/api/spellsApi";
import { useEffect, useState } from "react";


export default function SpellPage() {
    const params = useParams();
    const rawId = params?.id;
    const [spell, setSpell] = useState<Spell | null>(null);

    useEffect(() => {
        const id = Number(rawId);
        if (!rawId || Number.isNaN(id)) return;

        getSpellById(id).then(spellData => {
            setSpell(spellData);
        }).catch(error => {
            console.error("Error fetching spell:", error);
        });
    }, [rawId])
    if (!spell) {
        return <p className="p-4">Cargando...</p>;
    }

    return (
        <main className="container">
            <Link href="/spells" className="text-sm underline opacity-80">
                ← Volver
            </Link>

            <div className="mt-4 rounded-2xl p-6" style={{ backgroundColor: "var(--card)" }}>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h1 className="text-3xl font-bold">{spell.name}</h1>
                    <span
                        className={
                            "text-xs px-3 py-1 rounded-full border " +
                            (spell.source === "homerule"
                                ? "border-emerald-600/40 bg-emerald-100 text-emerald-900"
                                : "border-slate-400/60 bg-white/60 text-slate-700")
                        }
                    >
                        {spell.source === "homerule" ? "Homerule" : "Oficial"}
                    </span>
                    {spell.schoolName && (
                        <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">
                            {spell.schoolName}
                        </span>
                    )}
                    {spell.subschoolName && (
                        <span className="text-xs bg-indigo-200 text-indigo-900 px-2 py-1 rounded">
                            {spell.subschoolName}
                        </span>
                    )}
                </div>

                {spell.originalName && (
                    <p className="text-xs muted mb-3">{spell.originalName}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <p className="font-semibold">Casting Time</p>
                        <p>{spell.tiempoIncantacion || spell.castingTime || "—"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Range</p>
                        <p>{spell.rango || spell.rangeText || "—"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Duration</p>
                        <p>{spell.duracion || spell.durationText || "—"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Target</p>
                        <p>{spell.objetivo || spell.target || "—"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Saving Throw</p>
                        <p>{spell.salvacion || spell.savingThrow || "—"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Spell Resistance</p>
                        <p>{
                            typeof spell.resistenciaConjuros === 'string'
                                ? spell.resistenciaConjuros
                                : spell.spellResistance ? "Si" : "No"
                        }</p>
                    </div>
                    <div>
                        <p className="font-semibold">Componentes</p>
                        <p>
                            {[
                                spell.componentsV && "V",
                                spell.componentsS && "S",
                                spell.componentsM && "M",
                                spell.componentsF && "F",
                                spell.componentsDf && "DF",
                            ]
                                .filter(Boolean)
                                .join(", ") || "—"}
                        </p>
                    </div>
                </div>

                {spell.areaText && (
                    <div className="mb-4 text-sm">
                        <p className="font-semibold">Area</p>
                        <p>{spell.areaText}</p>
                    </div>
                )}

                {spell.materialDesc && (
                    <div className="mb-4 text-sm">
                        <p className="font-semibold">Material</p>
                        <p>{spell.materialDesc}</p>
                    </div>
                )}

                {spell.focusDesc && (
                    <div className="mb-4 text-sm">
                        <p className="font-semibold">Foco</p>
                        <p>{spell.focusDesc}</p>
                    </div>
                )}

                {spell.divineFocusDesc && (
                    <div className="mb-4 text-sm">
                        <p className="font-semibold">Foco Divino</p>
                        <p>{spell.divineFocusDesc}</p>
                    </div>
                )}

                {spell.summary && (
                    <div className="mb-4 text-sm">
                        <p className="font-semibold">Resumen</p>
                        <p className="whitespace-pre-line">{spell.summary}</p>
                    </div>
                )}

                {spell.source && (
                    <div className="mb-4 text-sm">
                        <p className="font-semibold">Fuente</p>
                        <p>{spell.source}</p>
                    </div>
                )}

                <div className="text-sm">
                    <h2 className="text-lg font-semibold">Descripcion</h2>
                    <p className="whitespace-pre-line">{spell.description}</p>
                </div>
            </div>
        </main>
    );
}
