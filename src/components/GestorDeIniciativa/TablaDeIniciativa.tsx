import React from 'react'
import '../../app/globals.css'
import { CuerpoTabla } from './CuerpoTabla';
import { useIniciativaStore } from '../../store/useIniciativaStore';

export const TablaDeIniciativa = () => {
    const lista = useIniciativaStore((state) => state.lista);
    return (
        <div className='container'>
            <table className="iniciativa-table">
                <thead className=''>
                    <tr>
                        <th>
                            Estadisticas
                        </th>
                        <th>
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="">
                    {lista.map((iniciativa) => (
                        <tr key={iniciativa.id} className="transition">
                            <CuerpoTabla iniciativa={iniciativa} />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
