"use client"

import React from 'react'
import { useEffect, useState } from "react";
import { getFeats, Feat } from "@/api/featsApi";
import '../globals.css'
import Link from 'next/link';
export default function FeatsListPage() {
  const [feats, setFeats] = useState<Feat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeats()
      .then((data) => setFeats(data))
      .catch((err) => console.error("Error cargando feats:", err))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <p className="p-4">Cargando...</p>;
  return (
    <>
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-15">
          {feats.map((feat) => (
            <Link href={`/feats/${feat.id}`} key={feat.id} >
              <div
                key={feat.id}
                className="
                container
                "
                style={{ background: `var(--olive-700)`, padding: 16, borderRadius: 8, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", border: "1px solid var(--olive-800)", textAlign: 'center' }}
              >
                {feat.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

    </>

  )
}
