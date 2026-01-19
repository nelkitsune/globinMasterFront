"use client";
import React, { useEffect, useRef, useState } from "react";
import { AgregarListaModal } from "@/components/GestorDeIniciativa/AgregarListaModal";
import { useIniciativaStore } from "../../store/useIniciativaStore";

export const BotoneraDeIniciativa = () => {
  const lanzarIniciativa = useIniciativaStore((state) => state.lanzarIniciativa);
  const avanzarTurno = useIniciativaStore((state) => state.avanzarTurno);
  const lista = useIniciativaStore((state) => state.lista);
  const asalto = useIniciativaStore((state) => state.asalto);

  const [showModal, setShowModal] = useState(false);

  // --- NUEVO: detectar si el botón de "siguiente turno" está visible ---
  const nextTurnBtnRef = useRef<HTMLButtonElement | null>(null);
  const [showFloatingNext, setShowFloatingNext] = useState(false);

  useEffect(() => {
    const el = nextTurnBtnRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // si NO se ve el botón normal, mostramos el flotante
        setShowFloatingNext(!entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleLanzarIniciativa() {
    lanzarIniciativa();
  }

  const nombreTurnoActual = lista.find((p) => p.actualmenteTurno)?.nombre ?? "—";

  return (
    <>
      <div className="grid grid-columns-1 md:grid-cols-3 gap-4 mt-4">
        <div className="grid grid-rows-2 gap-4">
          <div className="bg-[var(--card)] border border-[var(--card)] rounded-lg shadow-sm align-middle p-3 text-lg font-semibold">
            <span className="text-sm text-gray-600 block mb-1">Turno Actual</span>
            <span className="text-xl">{nombreTurnoActual}</span>
          </div>
          <div className="bg-[var(--card)] border border-[var(--card)] rounded-lg shadow-sm align-middle p-3 text-lg font-semibold">
            <span className="text-sm text-gray-600 block mb-1">Asalto</span>
            <span className="text-xl">{asalto}</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          {/* Botón normal (el que está arriba) */}
          <button
            ref={nextTurnBtnRef}
            className="group relative w-full h-full min-h-[120px] bg-gradient-to-br from-[var(--olive-500)] to-[var(--olive-700)] hover:from-[var(--olive-700)] hover:to-[var(--olive-900)] text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            onClick={avanzarTurno}
          >
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-10 h-10 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span>Siguiente Turno</span>
            </div>
          </button>
        </div>

        <div className="grid grid-column-1">
          <button
            className="btn btn-primary btn-primary:focus btn-primary:hover mr-2 mb-2"
            onClick={() => setShowModal(true)}
          >
            Agregar a la lista
          </button>
          <button
            className="btn btn-danger btn-danger:focus btn-danger:hover mr-2 mb-2"
            onClick={handleLanzarIniciativa}
          >
            Lanzar Iniciativa
          </button>
        </div>

        {showModal && <AgregarListaModal onClose={() => setShowModal(false)} />}
      </div>

      {/* Botón flotante: aparece solo cuando el de arriba no está visible */}
      {showFloatingNext && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="group flex items-center gap-3 bg-gradient-to-r from-[var(--olive-500)] to-[var(--olive-700)] hover:from-[var(--olive-700)] hover:to-[var(--olive-900)] text-white font-bold px-6 py-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-200 active:scale-95 hover:scale-105"
            onClick={avanzarTurno}
          >
            <span className="text-lg">Siguiente Turno</span>
            <svg
              className="w-6 h-6 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};
