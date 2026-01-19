import React from 'react'
import '../../app/globals.css'
import { CuerpoTabla } from './CuerpoTabla';
import { useIniciativaStore } from '../../store/useIniciativaStore';

export const TablaDeIniciativa = () => {
    const lista = useIniciativaStore((state) => state.lista);

    return (
        <div className='container'>
            {/* Header - Solo visible en desktop */}
            <div className="hidden lg:grid lg:grid-cols-[2fr_1fr] mb-3 px-4 py-3 bg-[var(--olive-500)] rounded-xl">
                <h3 className="font-bold text-lg">Estadísticas</h3>
                <h3 className="font-bold text-lg text-right pr-4">Acciones</h3>
            </div>

            {/* Lista de iniciativas */}
            <div className="space-y-3">
                {lista.map((iniciativa) => (
                    <CuerpoTabla key={iniciativa.id} iniciativa={iniciativa} />
                ))}
            </div>

            {/* Mensaje si no hay elementos */}
            {lista.length === 0 && (
                <div className="text-center py-12 px-4">
                    <p className="text-gray-600 text-lg">No hay personajes en la iniciativa</p>
                    <p className="text-gray-500 text-sm mt-2">Agrega personajes para comenzar</p>
                </div>
            )}
        </div>
    )
}
