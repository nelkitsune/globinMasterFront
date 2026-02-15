'use client';

import { useEffect, useState } from 'react';
import { useCampaignXpLogStore } from '@/store/useCampaignXpLogStore';
import { useCampaignCharactersStore } from '@/store/useCampaignCharactersStore';
import { CreateXpLogPayload } from '@/api/campaignXpLogApi';
import type { MemberResponse } from '@/api/campaignsApi';

interface XpLogSectionProps {
    campaignId: number;
    userId: number;
    isOwner: boolean;
    members?: MemberResponse[];
}

export default function XpLogSection({ campaignId, userId, isOwner, members = [] }: XpLogSectionProps) {
    const { logs, loading, error, totalPages, currentPage, fetchLogs, createLog, clearError } = useCampaignXpLogStore();
    const { items: campaignCharacters, setCampaign: setCampaignId, fetch: fetchCharacters } = useCampaignCharactersStore();
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        xpGained: '',
        description: '',
        selectedParticipants: [] as number[],
    });

    // Load logs on mount
    useEffect(() => {
        fetchLogs(campaignId, 0);
        setCampaignId(campaignId);
        fetchCharacters();
    }, [campaignId, fetchLogs, setCampaignId, fetchCharacters]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleParticipantToggle = (memberId: number) => {
        setFormData(prev => ({
            ...prev,
            selectedParticipants: prev.selectedParticipants.includes(memberId)
                ? prev.selectedParticipants.filter(id => id !== memberId)
                : [...prev.selectedParticipants, memberId],
        }));
    };

    const validateForm = (): boolean => {
        setFormError(null);

        if (!formData.xpGained || isNaN(Number(formData.xpGained)) || Number(formData.xpGained) <= 0) {
            setFormError('XP debe ser un número positivo');
            return false;
        }

        if (formData.selectedParticipants.length === 0) {
            setFormError('Debes seleccionar al menos un participante');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setFormLoading(true);
        try {
            // Build participantsText from selected character IDs
            const participantNames = formData.selectedParticipants
                .map(id => campaignCharacters.find(c => c.characterId === id)?.characterName)
                .filter(Boolean) as string[];

            const payload: CreateXpLogPayload = {
                xpGained: Number(formData.xpGained),
                description: formData.description.trim() || undefined,
                participantsText: participantNames.join(', '),
            };

            await createLog(campaignId, userId, payload);

            // Reset form
            setFormData({
                xpGained: '',
                description: '',
                selectedParticipants: [],
            });
            setShowForm(false);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Error al crear el log de XP');
        } finally {
            setFormLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            fetchLogs(campaignId, page);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="xp-log-section">
            <style>{`
        .xp-log-section {
          background: var(--card, #f5f5f5);
          border: 1px solid var(--olive-200, #e8e8e0);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }

        .xp-log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .xp-log-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--olive-900, #2d2d1f);
          margin: 0;
        }

        .xp-log-btn-create {
          background: var(--olive-700, #6b8c3a);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .xp-log-btn-create:hover {
          background: var(--olive-800, #54692d);
        }

        .xp-log-btn-create:disabled {
          background: var(--olive-300, #c9c9b8);
          cursor: not-allowed;
        }

        .xp-log-form {
          background: var(--olive-50, #fafaf8);
          border: 1px solid var(--olive-200, #e8e8e0);
          border-radius: 6px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .xp-log-form-group {
          margin-bottom: 1rem;
        }

        .xp-log-form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--olive-900, #2d2d1f);
          margin-bottom: 0.5rem;
        }

        .xp-log-form-group input,
        .xp-log-form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--olive-300, #c9c9b8);
          border-radius: 4px;
          font-size: 0.95rem;
          font-family: inherit;
          background: white;
          color: var(--olive-900, #2d2d1f);
        }

        .xp-log-form-group input:focus,
        .xp-log-form-group textarea:focus {
          outline: none;
          border-color: var(--olive-700, #6b8c3a);
          box-shadow: 0 0 0 3px rgba(107, 140, 58, 0.1);
        }

        .xp-log-form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .xp-log-form-buttons {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .xp-log-btn-submit, .xp-log-btn-cancel {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .xp-log-btn-submit {
          background: var(--olive-700, #6b8c3a);
          color: white;
        }

        .xp-log-btn-submit:hover {
          background: var(--olive-800, #54692d);
        }

        .xp-log-btn-submit:disabled {
          background: var(--olive-300, #c9c9b8);
          cursor: not-allowed;
        }

        .xp-log-btn-cancel {
          background: var(--olive-200, #e8e8e0);
          color: var(--olive-900, #2d2d1f);
        }

        .xp-log-btn-cancel:hover {
          background: var(--olive-300, #c9c9b8);
        }

        .xp-log-participants-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .xp-log-participant-card {
          border: 2px solid var(--olive-200, #e8e8e0);
          border-radius: 8px;
          padding: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .xp-log-participant-card:hover {
          border-color: var(--olive-400, #d4d4c0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .xp-log-participant-card.selected {
          border-color: var(--olive-700, #6b8c3a);
          background: var(--olive-50, #fafaf8);
          box-shadow: 0 0 0 3px rgba(107, 140, 58, 0.1);
        }

        .xp-log-participant-card input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--olive-700, #6b8c3a);
        }

        .xp-log-participant-head {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .xp-log-participant-checkbox {
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .xp-log-participant-info {
          flex: 1;
        }

        .xp-log-participant-name {
          font-weight: 600;
          color: var(--olive-900, #2d2d1f);
          margin: 0;
              }

        .xp-log-participant-role {
          font-size: 0.8rem;
          color: var(--olive-600, #888855);
          margin: 0.25rem 0 0 0;
        }

        .xp-log-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
          border-radius: 4px;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .xp-log-list-container {
          max-height: 500px;
          overflow-y: auto;
          border: 1px solid var(--olive-200, #e8e8e0);
          border-radius: 6px;
          background: white;
        }

        .xp-log-list-empty {
          padding: 2rem;
          text-align: center;
          color: var(--olive-600, #888855);
          font-size: 0.95rem;
        }

        .xp-log-item {
          border-bottom: 1px solid var(--olive-100, #f0f0e8);
          padding: 1.25rem;
          background: white;
        }

        .xp-log-item:last-child {
          border-bottom: none;
        }

        .xp-log-item-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .xp-log-item-xp {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--olive-700, #6b8c3a);
        }

        .xp-log-item-date {
          font-size: 0.85rem;
          color: var(--olive-600, #888855);
        }

        .xp-log-item-description {
          color: var(--olive-800, #54692d);
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
          margin-top: 0.5rem;
        }

        .xp-log-item-participants {
          font-size: 0.85rem;
          color: var(--olive-600, #888855);
        }

        .xp-log-participants-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .xp-log-participant-badge {
          background: var(--olive-100, #f0f0e8);
          border: 1px solid var(--olive-300, #c9c9b8);
          border-radius: 4px;
          padding: 0.25rem 0.75rem;
          font-size: 0.8rem;
          color: var(--olive-700, #6b8c3a);
        }

        .xp-log-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--olive-200, #e8e8e0);
        }

        .xp-log-pagination button {
          background: var(--olive-700, #6b8c3a);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s;
        }

        .xp-log-pagination button:hover:not(:disabled) {
          background: var(--olive-800, #54692d);
        }

        .xp-log-pagination button:disabled {
          background: var(--olive-300, #c9c9b8);
          cursor: not-allowed;
        }

        .xp-log-pagination-info {
          font-size: 0.9rem;
          color: var(--olive-600, #888855);
        }

        .xp-log-loading {
          text-align: center;
          padding: 2rem;
          color: var(--olive-600, #888855);
        }

        .xp-log-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid var(--olive-200, #e8e8e0);
          border-top: 3px solid var(--olive-700, #6b8c3a);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

            {/* Header */}
            <div className="xp-log-header">
                <h3>📊 Registro de XP</h3>
                {isOwner && (
                    <button
                        className="xp-log-btn-create"
                        onClick={() => setShowForm(!showForm)}
                        disabled={formLoading}
                    >
                        {showForm ? 'Cancelar' : '+ Registrar XP'}
                    </button>
                )}
            </div>

            {/* Form */}
            {isOwner && showForm && (
                <form className="xp-log-form" onSubmit={handleSubmit}>
                    {(formError || error) && (
                        <div className="xp-log-error">
                            {formError || error}
                        </div>
                    )}

                    <div className="xp-log-form-group">
                        <label htmlFor="xpGained">XP Ganado *</label>
                        <input
                            id="xpGained"
                            type="number"
                            name="xpGained"
                            value={formData.xpGained}
                            onChange={handleFormChange}
                            placeholder="Ej: 250"
                            min="1"
                            required
                            disabled={formLoading}
                        />
                    </div>

                    <div className="xp-log-form-group">
                        <label htmlFor="description">Descripción (opcional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            placeholder="Ej: Derrota del dragón rojo, defensa de la aldea..."
                            disabled={formLoading}
                        />
                    </div>

                    <div className="xp-log-form-group">
                        <label>Participantes *</label>
                        <div className="xp-log-participants-container">
                            {campaignCharacters.filter(c => !c.isNpc && !c.isDeleted).length > 0 ? (
                                campaignCharacters.filter(c => !c.isNpc && !c.isDeleted).map(character => (
                                    <div
                                        key={character.characterId}
                                        className={`xp-log-participant-card ${formData.selectedParticipants.includes(character.characterId) ? 'selected' : ''
                                            }`}
                                        onClick={() => !formLoading && handleParticipantToggle(character.characterId)}
                                    >
                                        <div className="xp-log-participant-head">
                                            <div className="xp-log-participant-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.selectedParticipants.includes(character.characterId)}
                                                    onChange={() => handleParticipantToggle(character.characterId)}
                                                    disabled={formLoading}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="xp-log-participant-info">
                                                <p className="xp-log-participant-name">
                                                    {character.characterName}
                                                </p>
                                                <p className="xp-log-participant-role">
                                                    Jugador
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--olive-600, #888855)', fontSize: '0.9rem' }}>
                                    No hay jugadores en esta campaña
                                </p>
                            )}
                        </div>
                        <small style={{ color: 'var(--olive-600, #888855)', marginTop: '0.75rem', display: 'block' }}>
                            Selecciona los jugadores que participaron en esta sesión
                        </small>
                    </div>

                    <div className="xp-log-form-buttons">
                        <button
                            type="submit"
                            className="xp-log-btn-submit"
                            disabled={formLoading}
                        >
                            {formLoading ? 'Registrando...' : 'Registrar XP'}
                        </button>
                        <button
                            type="button"
                            className="xp-log-btn-cancel"
                            onClick={() => {
                                setShowForm(false);
                                setFormError(null);
                                setFormData({ xpGained: '', description: '', selectedParticipants: [] });
                            }}
                            disabled={formLoading}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Logs List */}
            {loading && logs.length === 0 ? (
                <div className="xp-log-loading">
                    <div className="xp-log-spinner"></div>
                    <p style={{ marginTop: '1rem' }}>Cargando registros...</p>
                </div>
            ) : (
                <>
                    <div className="xp-log-list-container">
                        {logs.length === 0 ? (
                            <div className="xp-log-list-empty">
                                No hay registros de XP aún. {isOwner && 'Crea uno con "+ Registrar XP"'}
                            </div>
                        ) : (
                            logs.map(log => (
                                <div key={log.id} className="xp-log-item">
                                    <div className="xp-log-item-header">
                                        <div className="xp-log-item-xp">+{log.xpGained} XP</div>
                                        <div className="xp-log-item-date">
                                            {formatDate(log.createdAt)}
                                        </div>
                                    </div>

                                    {log.description && (
                                        <div className="xp-log-item-description">
                                            {log.description}
                                        </div>
                                    )}

                                    {log.participants && log.participants.length > 0 && (
                                        <div className="xp-log-item-participants">
                                            <div>Participantes:</div>
                                            <div className="xp-log-participants-list">
                                                {log.participants.map((participant, idx) => (
                                                    <span key={idx} className="xp-log-participant-badge">
                                                        {participant.displayName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="xp-log-pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                ← Anterior
                            </button>
                            <span className="xp-log-pagination-info">
                                Página {currentPage + 1} de {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
