"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SpellLevel, getBySpellClassAndLevel } from "@/api/spellsApi";
import Link from "next/link";

export default function SpellClassPage() {
    const params = useParams();
    const rawId = params?.id; // <-- usar `id`
    const [spellsListLevel0, setSpellsListLevel0] = useState<SpellLevel[]>([]);
    const [spellsListLevel1, setSpellsListLevel1] = useState<SpellLevel[]>([]);
    const [spellsListLevel2, setSpellsListLevel2] = useState<SpellLevel[]>([]);
    const [spellsListLevel3, setSpellsListLevel3] = useState<SpellLevel[]>([]);
    const [spellsListLevel4, setSpellsListLevel4] = useState<SpellLevel[]>([]);
    const [spellsListLevel5, setSpellsListLevel5] = useState<SpellLevel[]>([]);
    const [spellsListLevel6, setSpellsListLevel6] = useState<SpellLevel[]>([]);
    const [spellsListLevel7, setSpellsListLevel7] = useState<SpellLevel[]>([]);
    const [spellsListLevel8, setSpellsListLevel8] = useState<SpellLevel[]>([]);
    const [spellsListLevel9, setSpellsListLevel9] = useState<SpellLevel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const spellsByLevel = [
        spellsListLevel0,
        spellsListLevel1,
        spellsListLevel2,
        spellsListLevel3,
        spellsListLevel4,
        spellsListLevel5,
        spellsListLevel6,
        spellsListLevel7,
        spellsListLevel8,
        spellsListLevel9,
    ];

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
                setSpellsListLevel0(results[0] || []);
                setSpellsListLevel1(results[1] || []);
                setSpellsListLevel2(results[2] || []);
                setSpellsListLevel3(results[3] || []);
                setSpellsListLevel4(results[4] || []);
                setSpellsListLevel5(results[5] || []);
                setSpellsListLevel6(results[6] || []);
                setSpellsListLevel7(results[7] || []);
                setSpellsListLevel8(results[8] || []);
                setSpellsListLevel9(results[9] || []);
            } catch (e: any) {
                setError(e?.message || "Error cargando conjuros");
            } finally {
                setLoading(false);
            }
        };

        fetchAllLevels();
    }, [rawId]);

    if (loading) return <p className="p-4">Cargando...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div>
            {spellsByLevel.map((list, level) => (
                <section key={level} className="mb-4">
                    <h3 className="text-md font-semibold mb-2">Conjuros de nivel {level}</h3>
                    {list.length === 0 ? (
                        <p className="italic">No hay conjuros para este nivel</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Nombre del Conjuro</th>
                                    <th className="border px-4 py-2">Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map(spell => (
                                    <tr key={(spell as any).id}>
                                        <td className="border px-4 py-2">
                                            <Link href={`/spells/${(spell as any).id}`}>{(spell as any).name}</Link>
                                        </td>
                                        <td className="border px-4 py-2">{(spell as any).summary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            ))}
        </div>
    );
}