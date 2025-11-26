"use client"
import React, { useState } from 'react'
import { AgregarListaModal } from '@/components/GestorDeIniciativa/AgregarListaModal'
import { useIniciativaStore } from '../../store/useIniciativaStore';

export const BotoneraDeIniciativa = () => {
  const lanzarIniciativa = useIniciativaStore((state) => state.lanzarIniciativa);
  const avanzarTurno = useIniciativaStore((state) => state.avanzarTurno);
  const lista = useIniciativaStore((state) => state.lista);
  const asalto = useIniciativaStore((state) => state.asalto);
  const [showModal, setShowModal] = useState(false);

  function handleLanzarIniciativa() {
    lanzarIniciativa();
  }

  const nombreTurnoActual = lista.find(p => p.actualmenteTurno)?.nombre ?? '—';

  return (
    <div className='grid grid-columns-1 md:grid-cols-3 gap-4 mt-4'>
      <div className='grid grid-rows-2 gap-4'>
        <div className='bg-[var(--card)] border border-[var(--card)] rounded shadow-sm align-middle p-2 text-lg font-semibold'>Turno Actual: {nombreTurnoActual}</div>
        <div className='bg-[var(--card)] border border-[var(--card)] rounded shadow-sm align-middle p-2 text-lg font-semibold'>Asalto: {asalto}</div>
      </div>
      <div>
        <button className='btn btn-secondary btn-secondary:focus btn-secondary:hover mr-2 mb-2' onClick={avanzarTurno}>
          siguiente Turno
        </button>
      </div>
      <div className='grid grid-column-1'>
        <button className='btn btn-primary btn-primary:focus btn-primary:hover mr-2 mb-2' onClick={() => setShowModal(true)}>
          Agregar a la lista
        </button>
        <button className='btn btn-danger btn-danger:focus btn-danger:hover mr-2 mb-2' onClick={handleLanzarIniciativa}>
          Lanzar Iniciativa
        </button>
      </div>
      {showModal && <AgregarListaModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
