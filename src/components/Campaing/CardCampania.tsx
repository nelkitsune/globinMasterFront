import React from 'react'
import Link from 'next/link'
import type { Campaign } from '@/api/campaignsApi'
export const CardCampania: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  return (
    <div className='bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-5 flex flex-col gap-3 border border-gray-200 w-full h-full min-h-[320px]'>
      <div className='flex items-center justify-between'>
        {campaign.active ? (
          <span className='bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded'>Activa</span>
        ) : (
          <span className='bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded'>Inactiva</span>
        )}
      </div>
      <h3 className='text-base sm:text-lg md:text-xl font-bold text-gray-800 line-clamp-2'>
        {campaign.name}
      </h3>
      {campaign.imageUrl ? (
        <div className='w-full aspect-[4/3] overflow-hidden rounded-md bg-gray-100'>
          <img
            src={campaign.imageUrl}
            alt={campaign.name}
            className='w-full h-full object-cover'
          />
        </div>
      ) : (
        <div className='w-full aspect-[4/3] rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs sm:text-sm'>
          Sin imagen
        </div>
      )}
      <p className='text-gray-600 text-xs sm:text-sm line-clamp-3'>
        {campaign.description || 'Sin descripción'}
      </p>
      <div className='flex flex-wrap gap-3 text-xs sm:text-sm text-gray-500 border-t pt-3 mt-auto'>
        <div className='flex items-center gap-1'>
          <span className='font-semibold'>
            {typeof campaign.membersCount === 'number' ? campaign.membersCount : '-'}
          </span>
          jugadores
        </div>
      </div>
      <Link
        href={`/campaing/${campaign.id}`}
        className='mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base text-center'
      >
        Ver Detalles
      </Link>
    </div>
  )
}
