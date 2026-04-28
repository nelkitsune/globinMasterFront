"use client"

import { useEffect, useState } from "react";
import { getSpellClasses, SpellClass } from "@/api/spellsApi";
import { SpellClassCard } from "@/components/Spells/SpellClassCard";


export default function SpellListPage() {

  const [spellClasses, setSpellClasses] = useState<SpellClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getSpellClasses()
      .then((data) => setSpellClasses(data))
      .catch((err) => {
        console.error("Error cargando clases de conjuros:", err);
        setError(err?.message || "Error cargando clases de conjuros");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4 text-center">Cargando clases...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;

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
          <SpellClassCard key={spellClass.id ?? spellClass.code} spellClass={spellClass} />
        ))}
      </div>
    </div>
  );
}
