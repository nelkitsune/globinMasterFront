import React, { useState } from 'react'
import { CrearCampaniaModal } from './CrearCampaniaModal';

export const BotoneraCrearUnirse = () => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <div className='brand underline'>
                <h1>
                    Campañas
                </h1>
            </div>
            <div className='mt-6 w-full max-w-3xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                <button
                    className="btn btn-primary btn-primary:focus btn-primary:hover w-full md:w-auto"
                    onClick={() => setShowModal(true)}
                >
                    Crear una Nueva Campaña
                </button>
                <button
                    className="btn btn-secondary btn-secondary:focus btn-secondary:hover w-full md:w-auto"
                >
                    Unirse Campaña Existente
                </button>
            </div>
            {showModal && <CrearCampaniaModal onClose={() => setShowModal(false)} />}
        </>
    )
}
