"use client"

import React from 'react'
import { useEffect, useState } from "react";
import { getFeats, Feat, FeatType } from "@/api/featsApi";
import '../globals.css'
import Link from 'next/link';

const FEAT_TYPES: FeatType[] = ["COMBATE", "GENERAL", "RACIAL", "MAGIA", "METAMAGIA"];

export default function FeatsListPage() {
  const [feats, setFeats] = useState<Feat[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);
  const [selectedTypes, setSelectedTypes] = useState<FeatType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadFeats = async (page: number, types: FeatType[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFeats(page, pageSize, types.length > 0 ? types : undefined);
      setFeats(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      console.error("Error cargando feats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeats(0, selectedTypes);
  }, [selectedTypes]);

  const toggleType = (type: FeatType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      loadFeats(currentPage - 1, selectedTypes);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      loadFeats(currentPage + 1, selectedTypes);
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-8">
        <h1 className="brand text-4xl mb-2" style={{ color: "var(--olive-900)" }}>
          Dotes
        </h1>
        <p className="muted text-lg">Explora todas las dotes disponibles</p>
      </div>

      {/* Filtros */}
      <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: "var(--card)", border: "1px solid var(--olive-300)" }}>
        <h3 className="font-bold mb-3">Filtrar por tipo:</h3>
        <div className="flex flex-wrap gap-2">
          {FEAT_TYPES.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className="px-4 py-2 rounded-md transition-colors text-sm font-semibold"
              style={{
                backgroundColor: selectedTypes.includes(type) ? "var(--olive-600)" : "var(--olive-200)",
                color: selectedTypes.includes(type) ? "white" : "var(--olive-900)",
                border: `2px solid var(--olive-600)`,
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
          Error: {error}
        </div>
      )}

      {loading ? (
        <p className="p-4 text-center">Cargando dotes...</p>
      ) : feats.length === 0 ? (
        <p className="p-4 text-center muted">No se encontraron dotes con los filtros seleccionados.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {feats.map((feat) => (
              <Link href={`/feats/${feat.id}`} key={feat.id}>
                <div
                  className="p-6 rounded-2xl transition-transform hover:shadow-lg hover:-translate-y-1 h-full"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "2px solid var(--olive-500)",
                  }}
                >
                  <h3 className="text-lg font-bold" style={{ color: "var(--olive-900)" }}>
                    {feat.name}
                  </h3>
                  {feat.code && (
                    <p className="text-xs muted mt-2">{feat.code}</p>
                  )}
                  {feat.tipo && feat.tipo.length > 0 && (
                    <p className="text-xs font-semibold mt-2" style={{ color: "var(--olive-700)" }}>
                      {Array.isArray(feat.tipo) ? feat.tipo.join(", ") : feat.tipo}
                    </p>
                  )}
                  <p className="text-sm muted mt-3 line-clamp-3">
                    {feat.descripcion}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-md font-semibold disabled:opacity-50"
              style={{
                backgroundColor: currentPage === 0 ? "var(--olive-200)" : "var(--olive-600)",
                color: currentPage === 0 ? "var(--olive-700)" : "white",
              }}
            >
              ← Anterior
            </button>
            <span className="muted">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 rounded-md font-semibold disabled:opacity-50"
              style={{
                backgroundColor: currentPage >= totalPages - 1 ? "var(--olive-200)" : "var(--olive-600)",
                color: currentPage >= totalPages - 1 ? "var(--olive-700)" : "white",
              }}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
