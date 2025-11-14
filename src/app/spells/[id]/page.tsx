"use client"
import React from 'react'
import { useParams } from "next/navigation";
import { getSpellById, Spell } from '@/api/spellsApi';
import { useEffect, useState } from 'react';


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
    }, [])
    return (
        <div>
            {spell ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">{spell.name}</h1>
                    <p className="mb-2"><strong>Casting Time:</strong> {spell.castingTime}</p>
                    <p className="mb-2"><strong>Range:</strong> {spell.rangeText}</p>
                    <p className="mb-2"><strong>Duration:</strong> {spell.durationText}</p>
                    <p className="mb-4"><strong>Description:</strong> {spell.description}</p>

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}
