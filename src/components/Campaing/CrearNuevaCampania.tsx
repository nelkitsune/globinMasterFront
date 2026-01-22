import React from 'react'

export const CrearNuevaCampania = () => {
    return (
        <div className='bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-dashed border-yellow-400 hover:border-yellow-500 hover:shadow-xl transition-all duration-300 p-8 sm:p-12 flex flex-col items-center justify-center gap-4 w-full max-w-sm cursor-pointer hover:scale-105 min-h-[300px]'>
            <div className='bg-white rounded-full p-4 shadow-md hover:shadow-lg transition-shadow duration-300'>
                <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </div>
            <h3 className='text-xl sm:text-2xl font-bold text-yellow-800 text-center'>
                Crear Nueva Campaña
            </h3>
            <p className='text-yellow-700 text-sm sm:text-base text-center'>
                Comienza una nueva aventura épica
            </p>
        </div>
    )
}
