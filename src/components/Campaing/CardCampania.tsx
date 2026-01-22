import React from 'react'

export const CardCampania = () => {
  return (
    <div className='bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 border border-gray-200 w-full max-w-sm cursor-pointer'>
      <div className='inline-flex'>
        <span className='bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full'>
          Activa
        </span>
      </div>
      <h3 className='text-lg sm:text-xl font-bold text-gray-800'>Título de la Campaña</h3>
      <p className='text-gray-600 text-xs sm:text-sm line-clamp-3'>
        Este es un resumen de la campaña que puede tener múltiples líneas...
      </p>
      <div className='flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 border-t pt-3 sm:pt-4'>
        <div className='flex items-center gap-1'>
          <span className='font-semibold'>5</span> jugadores
        </div>
        <div className='flex items-center gap-1'>
          <span className='font-semibold'>12</span> sesiones
        </div>
      </div>
      <button className='mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base'>
        Ver Detalles
      </button>
    </div>
  )
}
