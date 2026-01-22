import React from 'react'

export const FiltrosAndBarra = () => {
    return (
        <div className='flex items-center justify-between mb-4 bg-gray-100 p-4 rounded shadow mt-6'>
            <div className='flex gap-8'>
                <div className='cursor-pointer hover:bg-gray-200 rounded w-30 text-center p-2'>Todas</div>
                <div className='cursor-pointer hover:bg-gray-200 rounded w-30 text-center p-2'>Activas</div>
                <div className='cursor-pointer hover:bg-gray-200 rounded w-30 text-center p-2'>Archivadas</div>
            </div>
            <div className='flex items-center gap-4'>
                <input type="search" placeholder='Buscar campaña...' className='border rounded px-2 py-1 bg-white' />
                <div className="border bg-white hover:bg-gray-200 cursor-pointer border rounded px-2"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=search" /><span className="material-symbols-outlined">search</span></div>
            </div>
        </div>
    )
}
