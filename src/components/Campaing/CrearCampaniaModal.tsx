"use client";
import React, { useState } from 'react';
import { CampaignImageUploader } from '../CampaignImageUploader';
import { useCampaignStore } from '@/store/useCampaignStore';
import { CampaignCreate } from '@/api/campaignsApi';

type CrearCampaniaModalProps = {
  onClose: () => void;
  onSuccess?: () => void;
};

export const CrearCampaniaModal = ({ onClose, onSuccess }: CrearCampaniaModalProps) => {
  const [formData, setFormData] = useState<CampaignCreate>({
    name: '',
    description: '',
    game_system: '',
    setting: '',
  });
  const [createdCampaignId, setCreatedCampaignId] = useState<number | null>(null);
  const [step, setStep] = useState<'form' | 'image'>('form');

  const { createCampaign, loading, error } = useCampaignStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Submitting form with data:', formData);
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('El nombre de la campaña es obligatorio');
      return;
    }

    const payload: CampaignCreate = {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      game_system: formData.game_system?.trim() || null,
      setting: formData.setting?.trim() || null,
    };

    const campaign = await createCampaign(payload);
    console.log('Created campaign:', campaign);

    if (campaign) {
      setCreatedCampaignId(campaign.id);
      setStep('image');
    }
  };

  const handleImageSuccess = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleSkipImage = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-close" onClick={onClose}>X</div>

        {step === 'form' ? (
          <>
            <h2 className="modal-tabs">Crear Nueva Campaña</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <label>Nombre de la Campaña *:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="modal-input"
                required
                disabled={loading}
              />

              <label>Descripción:</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                className="modal-input"
                disabled={loading}
              />

              <label>Sistema:</label>
              <input
                type="text"
                name="game_system"
                value={formData.game_system || ''}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="ej: D&D 5e, Pathfinder"
                disabled={loading}
              />

              <label>Ambientación:</label>
              <input
                type="text"
                name="setting"
                value={formData.setting || ''}
                onChange={handleInputChange}
                className="modal-input"
                placeholder="ej: Forgotten Realms"
                disabled={loading}
              />

              {error && (
                <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-primary:focus btn-primary:hover mr-2 mb-2"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Campaña'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ padding: '20px' }}>
            <h2 className="modal-tabs">¡Campaña Creada! 🎉</h2>
            <p style={{ marginBottom: '20px', color: '#666', fontSize: '16px' }}>
              Tu campaña ha sido creada exitosamente. Ahora puedes agregar una imagen de portada (opcional).
            </p>

            {createdCampaignId && (
              <div style={{ marginBottom: '20px' }}>
                <CampaignImageUploader
                  campaignId={createdCampaignId}
                  onImageUploadSuccess={handleImageSuccess}
                />
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={handleSkipImage}
                className="btn btn-secondary"
                style={{
                  padding: '10px 30px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Omitir y Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
