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



  if (loading) return <p className="p-4">Cargando...</p>;
  return (
    <>
      <div className="container">
        <h1 className="text-4xl font-bold mb-4 p-4 text-center">Lista de clases lanzadoras de conjuros</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-15">
          {spellClasses.map((spellClass) => (
            <Link href={`/spells/class/${spellClass.id}`} key={spellClass.id} className="
                btn
                btn-primary
                w-full
              ">
              {spellClass.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
