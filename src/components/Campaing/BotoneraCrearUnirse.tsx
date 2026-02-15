import React, { useState } from 'react'
import { CrearCampaniaModal } from './CrearCampaniaModal';
import { JoinCampaignModal } from './JoinCampaignModal';

export const BotoneraCrearUnirse = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

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
                    onClick={() => setShowCreateModal(true)}
                >
                    Crear una Nueva Campaña
                </button>
                <button
                    className="btn btn-secondary btn-secondary:focus btn-secondary:hover w-full md:w-auto"
                    onClick={() => setShowJoinModal(true)}
                >
                    Unirse Campaña Existente
                </button>
            </div>
            {showCreateModal && <CrearCampaniaModal onClose={() => setShowCreateModal(false)} />}
            {showJoinModal && <JoinCampaignModal onClose={() => setShowJoinModal(false)} />}
        </>
    )
}
