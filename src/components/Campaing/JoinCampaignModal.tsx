"use client";
import React, { useState } from 'react';
import { useCampaignStore } from '@/store/useCampaignStore';

type JoinCampaignModalProps = {
    onClose: () => void;
    onSuccess?: () => void;
};

export const JoinCampaignModal = ({ onClose, onSuccess }: JoinCampaignModalProps) => {
    const [joinCode, setJoinCode] = useState('');
    const { joinCampaign, loading, error } = useCampaignStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!joinCode.trim()) {
            alert('Debe ingresar un código de campaña');
            return;
        }

        const campaign = await joinCampaign(joinCode.trim());

        if (campaign) {
            setJoinCode('');
            if (onSuccess) onSuccess();
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-close" onClick={onClose}>X</div>

                <h2 className="modal-tabs">Unirse a Campaña</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <label>Código de Campaña *:</label>
                    <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        className="modal-input"
                        placeholder="Ej: GM-XXXX"
                        required
                        disabled={loading}
                        autoFocus
                    />

                    {error && (
                        <p className="text-sm text-red-600 mt-2">{error}</p>
                    )}

                    <div className="modal-buttons">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !joinCode.trim()}
                        >
                            {loading ? 'Uniendo...' : 'Unirse'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
