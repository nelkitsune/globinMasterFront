import React from 'react'
import '../../app/globals.css'

export const TablaDeIniciativa = () => {
  return (
    <div className='container'>
        <table className="min-w-full border border-gray-300 text-sm text-left">
            <thead className='bg-[var(--olive-500)] text-[var(--fg)]'>
                <tr>
                    <th className="px-4 py-2 border border-gray-300">
                        Estadisticas
                    </th>
                    <th className="px-4 py-2 border border-gray-300">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody className="bg-[var(--card)] text-[var(--fg)]">
                <tr className="hover:bg-[var(--olive-300)] transition">
                    <td className="px-4 py-2  grid grid-cols-3 gap-4">
                        <div>
                            Nombre
                        </div>
                        <div>
                            Hp: 100/100
                        </div>
                        <div>
                            <div>
                                Estados
                            </div>
                        </div>
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                        <div>
                            <button className='btn btn-primary btn-primary:focus btn-primary:hover mr-2 mb-2'>
                                Agregar Estados
                            </button>
                            <button className='btn btn-danger btn-danger:focus btn-danger:hover'>
                                Muerto
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}
