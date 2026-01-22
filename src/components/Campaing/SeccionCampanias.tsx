import React from 'react'
import { CardCampania } from './CardCampania'
import { CrearNuevaCampania } from './CrearNuevaCampania'

export const SeccionCampanias = () => {
    return (
        <div className='mt-6 w-full mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
            <CardCampania />
            <CrearNuevaCampania />
        </div>
    )
}
