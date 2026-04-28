"use client"

import { useParams } from "next/navigation";
import Link from "next/link";
import { getSpellById, Spell } from "@/api/spellsApi";
import { useEffect, useState } from "react";
import { SpellDetailCard } from "@/components/Spells/SpellDetailCard";

export default function SpellPage() {
    const params = useParams();
    const rawId = params?.id;
    const [spell, setSpell] = useState<Spell | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = Number(rawId);
        if (!rawId || Number.isNaN(id)) {
            setSpell(null);
            setLoading(false);
            setError("ID de conjuro inválido");
            return;
        }

        setLoading(true);
        setError(null);

        getSpellById(id)
            .then((spellData) => {
                setSpell(spellData);
            })
            .catch((fetchError) => {
                console.error("Error fetching spell:", fetchError);
                setError(fetchError?.message || "Error cargando conjuro");
            })
            .finally(() => setLoading(false));
    }, [rawId])

    if (loading) {
        return <p className="p-4">Cargando...</p>;
    }

    if (error) {
        return <p className="p-4 text-red-500">{error}</p>;
    }

    if (!spell) {
        return <p className="p-4">No se encontró el conjuro.</p>;
    }

    return (
        <main className="container">
            <Link href="/spells" className="text-sm underline opacity-80">
                ← Volver
            </Link>

            <SpellDetailCard spell={spell} />
        </main>
    );
}
