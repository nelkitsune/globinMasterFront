"use client"

import React from 'react'
import { useEffect, useState } from "react";
import { getSpellClasses, SpellClass, Spell, getSpellLevelsByClassId } from "@/api/spellsApi";
import Link from 'next/link';


export default function SpellListPage() {

  const [spellClasses, setSpellClasses] = useState<SpellClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpellClasses()
      .then((data) => setSpellClasses(data))
      .catch((err) => console.error("Error cargando clases de conjuros:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4 text-center">Cargando clases...</p>;

  return (
    <div className="container">
      <div className="text-center mb-8">
        <h1 className="brand text-4xl mb-2" style={{ color: "var(--olive-900)" }}>
          Clases Lanzadoras de Conjuros
        </h1>
        <p className="muted text-lg">Selecciona una clase para ver sus conjuros</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {spellClasses.map((spellClass) => (
          <Link href={`/spells/class/${spellClass.id}`} key={spellClass.id}>
            <div
              className="p-6 rounded-2xl transition-transform hover:shadow-lg hover:scale-105"
              style={{
                backgroundColor: "var(--card)",
                border: "2px solid var(--olive-500)",
                cursor: "pointer",
              }}
            >
              <h3 className="text-xl font-bold" style={{ color: "var(--olive-900)" }}>
                {spellClass.name}
              </h3>
              <p className="text-sm muted mt-2">Toca para ver conjuros disponibles</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
