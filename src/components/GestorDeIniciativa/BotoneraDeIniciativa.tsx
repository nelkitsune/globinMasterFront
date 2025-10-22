import React from 'react'

export const BotoneraDeIniciativa = () => {
  return (
    <div className='grid grid-columns-1 md:grid-cols-3 gap-4 mt-4'>
      <div className='grid grid-rows-2 gap-4'>
        <div className='bg-[var(--card)] border border-[var(--card)] rounded shadow-sm align-middle p-2'>Turno Actual: x</div>
        <div className='bg-[var(--card)] border border-[var(--card)] rounded shadow-sm align-middle p-2'>Asalto: x</div>
      </div>
      <div>
        <button className='btn btn-secondary btn-secondary:focus btn-secondary:hover mr-2 mb-2'>
          siguiente Turno
        </button>
        </div>
      <div className='grid grid-column-1'>
        <button className='btn btn-primary btn-primary:focus btn-primary:hover mr-2 mb-2'>
          Agregar a la lista
        </button>
        <button className='btn btn-danger btn-danger:focus btn-danger:hover mr-2 mb-2'>
          Lanzar Iniciativa
        </button>
      </div>
    </div>
  )
}
