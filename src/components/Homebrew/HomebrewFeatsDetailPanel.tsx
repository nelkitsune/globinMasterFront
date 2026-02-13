"use client";

import { useEffect, useMemo, useState } from "react";
import { Feat, listMyHomebrewFeats } from "@/api/featsApi";
import CardDatosDote from "@/components/Feats/CardDatosDote";

export default function HomebrewFeatsDetailPanel() {
    const [items, setItems] = useState<Feat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        const loadFeats = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await listMyHomebrewFeats();
                setItems(data);
                if (data.length > 0 && selectedId == null) {
                    setSelectedId(data[0].id ?? null);
                }
            } catch (err: any) {
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Error al cargar dotes caseras"
                );
            } finally {
                setLoading(false);
            }
        };

        loadFeats();
    }, []);

    const selectedFeat = useMemo(() => {
        if (!items.length) return null;
        const match = items.find((feat) => feat.id === selectedId);
        return match ?? items[0] ?? null;
    }, [items, selectedId]);

    return (
        <section
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--card)" }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h3 className="sectionTitle mb-1">Mis Dotes Caseras</h3>
                    <p className="text-sm muted">
                        Selecciona una dote para ver el detalle completo.
                    </p>
                </div>
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

            {loading ? (
                <p className="text-sm muted">Cargando dotes...</p>
            ) : items.length === 0 ? (
                <p className="text-sm muted">
                    Aun no tienes dotes caseras creadas.
                </p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] gap-4">
                    <div className="space-y-2">
                        {items.map((feat) => {
                            const isSelected = feat.id === selectedId;
                            return (
                                <button
                                    key={feat.id ?? feat.code}
                                    onClick={() => setSelectedId(feat.id ?? null)}
                                    className={
                                        "w-full text-left rounded-xl border px-3 py-2 transition " +
                                        (isSelected
                                            ? "border-black/30 bg-[color:var(--olive-300)]/70"
                                            : "border-black/10 bg-[color:var(--olive-100)]/40 hover:bg-[color:var(--olive-300)]/40")
                                    }
                                >
                                    <div className="font-semibold text-sm">{feat.name}</div>
                                    {feat.benefit && (
                                        <div className="text-xs muted line-clamp-2">
                                            {feat.benefit}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {selectedFeat && (
                        <div className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4">
                            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] items-start">
                                <div>
                                    <h4 className="text-xl font-bold">
                                        {selectedFeat.name}
                                    </h4>
                                    {selectedFeat.originalName && (
                                        <p className="text-xs muted">
                                            {selectedFeat.originalName}
                                        </p>
                                    )}

                                    <div className="mt-3 space-y-3 text-sm">
                                        <div>
                                            <p className="font-semibold">Descripcion</p>
                                            <p className="whitespace-pre-line">
                                                {selectedFeat.descripcion}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-semibold">Beneficio</p>
                                            <p className="whitespace-pre-line">
                                                {selectedFeat.benefit}
                                            </p>
                                        </div>

                                        {selectedFeat.special && (
                                            <div>
                                                <p className="font-semibold">Especial</p>
                                                <p className="whitespace-pre-line">
                                                    {selectedFeat.special}
                                                </p>
                                            </div>
                                        )}

                                        {selectedFeat.tipo?.length ? (
                                            <div>
                                                <p className="font-semibold">Tipos</p>
                                                <p>{selectedFeat.tipo.join(" | ")}</p>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <CardDatosDote
                                    className="self-start"
                                    nombre={selectedFeat.name}
                                    code={selectedFeat.code}
                                    nombreOriginal={selectedFeat.originalName}
                                    fuente={selectedFeat.source}
                                    prereqGroups={selectedFeat.prereqGroups}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
