"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSpellLevelsByClassId, SpellLevel } from "@/api/spellsApi";

export default function SpellClassPage() {
    const params = useParams();
    const rawId = params?.spellClassId;
    const [spellsList, setSpellsList] = useState<SpellLevel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const classId = Number(rawId);
                if (Number.isNaN(classId)) throw new Error("spellClassId inválido");

                const list = await getSpellLevelsByClassId(classId);

                console.debug("Fetched list (raw):", list);

                if (mounted) setSpellsList(list ?? []);
            } catch (err: any) {
                console.error(err);
                if (mounted) setError(err?.message ?? "Error desconocido");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        if (rawId != null) load();
        return () => { mounted = false; };
    }, [rawId]);

    useEffect(() => {
        console.debug("spellsList updated (state):", spellsList);
    }, [spellsList]);

    return (
        <div className="container">
            <h2 className="text-lg font-semibold mb-2">Conjuros por clase</h2>

            {loading && <p>Cargando…</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {!loading && !error && (
                <>
                    {spellsList.length === 0 ? (
                        <p>No se encontraron conjuros para esta clase.</p>
                    ) : (
                        <ul>
                            {spellsList.map((s, i) => {
                                const spellObj: any = (s as any)?.spell ?? s;
                                const title = spellObj?.name ?? spellObj?.nombre ?? spellObj?.title ?? "Sin nombre";
                                const level = (s as any)?.level ?? spellObj?.level ?? null;

                                return (
                                    <li key={spellObj?.id ?? i} className="btn btn-primary m-1 p-2">
                                        <strong>{title}</strong>
                                        {level != null && <span> — Nivel {level}</span>}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
