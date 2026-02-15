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
        <div className="my-6 rounded-lg border border-[color:var(--olive-200)] bg-[var(--card)] p-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-semibold text-[color:var(--olive-900)]">📊 Registro de XP</h3>
                {isOwner && (
                    <button
                        className="whitespace-nowrap rounded-md bg-[var(--olive-700)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--olive-800)] disabled:cursor-not-allowed disabled:bg-[var(--olive-300)]"
                        onClick={() => setShowForm(!showForm)}
                        disabled={formLoading}
                    >
                        {showForm ? 'Cancelar' : '+ Registrar XP'}
                    </button>
                )}
            </div>

            {/* Form */}
            {isOwner && showForm && (
                <form className="mb-6 rounded-md border border-[color:var(--olive-200)] bg-[color:var(--olive-50)] p-6" onSubmit={handleSubmit}>
                    {(formError || error) && (
                        <div className="mb-4 rounded border border-red-200 bg-red-100 px-4 py-3 text-sm text-red-700">
                            {formError || error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="xpGained" className="mb-2 block text-sm font-medium text-[color:var(--olive-900)]">XP Ganado *</label>
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
                            className="w-full rounded border border-[color:var(--olive-300)] bg-white p-3 text-sm text-[color:var(--olive-900)] focus:border-[color:var(--olive-700)] focus:outline-none focus:ring-2 focus:ring-[rgba(107,140,58,0.1)]"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="mb-2 block text-sm font-medium text-[color:var(--olive-900)]">Descripción (opcional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            placeholder="Ej: Derrota del dragón rojo, defensa de la aldea..."
                            disabled={formLoading}
                            className="min-h-[80px] w-full resize-y rounded border border-[color:var(--olive-300)] bg-white p-3 text-sm text-[color:var(--olive-900)] focus:border-[color:var(--olive-700)] focus:outline-none focus:ring-2 focus:ring-[rgba(107,140,58,0.1)]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-[color:var(--olive-900)]">Participantes *</label>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {campaignCharacters.filter(c => !c.isNpc && !c.isDeleted).length > 0 ? (
                                campaignCharacters.filter(c => !c.isNpc && !c.isDeleted).map(character => (
                                    <div
                                        key={character.characterId}
                                        className={
                                            "flex flex-col gap-3 rounded-lg border-2 bg-white p-4 transition " +
                                            (formData.selectedParticipants.includes(character.characterId)
                                                ? "border-[color:var(--olive-700)] bg-[color:var(--olive-50)] ring-2 ring-[rgba(107,140,58,0.1)]"
                                                : "border-[color:var(--olive-200)] hover:border-[color:var(--olive-400)] hover:shadow")
                                        }
                                        onClick={() => !formLoading && handleParticipantToggle(character.characterId)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.selectedParticipants.includes(character.characterId)}
                                                    onChange={() => handleParticipantToggle(character.characterId)}
                                                    disabled={formLoading}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="h-4 w-4 accent-[var(--olive-700)]"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-[color:var(--olive-900)]">
                                                    {character.characterName}
                                                </p>
                                                <p className="mt-1 text-xs text-[color:var(--olive-600)]">
                                                    Jugador
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-[color:var(--olive-600)]">
                                    No hay jugadores en esta campaña
                                </p>
                            )}
                        </div>
                        <small className="mt-3 block text-xs text-[color:var(--olive-600)]">
                            Selecciona los jugadores que participaron en esta sesión
                        </small>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            type="submit"
                            className="rounded-md bg-[var(--olive-700)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--olive-800)] disabled:cursor-not-allowed disabled:bg-[var(--olive-300)]"
                            disabled={formLoading}
                        >
                            {formLoading ? 'Registrando...' : 'Registrar XP'}
                        </button>
                        <button
                            type="button"
                            className="rounded-md bg-[color:var(--olive-200)] px-6 py-3 text-sm font-medium text-[color:var(--olive-900)] transition hover:bg-[color:var(--olive-300)]"
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
                <div className="p-8 text-center text-[color:var(--olive-600)]">
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--olive-200)] border-t-[color:var(--olive-700)]" />
                    <p className="mt-4 text-sm">Cargando registros...</p>
                </div>
            ) : (
                <>
                    <div className="max-h-[500px] overflow-y-auto rounded-md border border-[color:var(--olive-200)] bg-white">
                        {logs.length === 0 ? (
                            <div className="p-8 text-center text-sm text-[color:var(--olive-600)]">
                                No hay registros de XP aún. {isOwner && 'Crea uno con "+ Registrar XP"'}
                            </div>
                        ) : (
                            logs.map(log => (
                                <div key={log.id} className="border-b border-[color:var(--olive-100)] bg-white p-5 last:border-b-0">
                                    <div className="mb-3 flex items-start justify-between gap-4">
                                        <div className="text-xl font-bold text-[color:var(--olive-700)]">+{log.xpGained} XP</div>
                                        <div className="text-xs text-[color:var(--olive-600)]">
                                            {formatDate(log.createdAt)}
                                        </div>
                                    </div>

                                    {log.description && (
                                        <div className="mt-2 text-sm text-[color:var(--olive-800)]">
                                            {log.description}
                                        </div>
                                    )}

                                    {log.participants && log.participants.length > 0 && (
                                        <div className="mt-3 text-xs text-[color:var(--olive-600)]">
                                            <div>Participantes:</div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {log.participants.map((participant, idx) => (
                                                    <span key={idx} className="rounded border border-[color:var(--olive-300)] bg-[color:var(--olive-100)] px-3 py-1 text-xs text-[color:var(--olive-700)]">
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
                        <div className="mt-6 flex items-center justify-center gap-3 border-t border-[color:var(--olive-200)] pt-6">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="rounded bg-[var(--olive-700)] px-4 py-2 text-sm text-white transition hover:bg-[var(--olive-800)] disabled:cursor-not-allowed disabled:bg-[var(--olive-300)]"
                            >
                                ← Anterior
                            </button>
                            <span className="text-sm text-[color:var(--olive-600)]">
                                Página {currentPage + 1} de {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="rounded bg-[var(--olive-700)] px-4 py-2 text-sm text-white transition hover:bg-[var(--olive-800)] disabled:cursor-not-allowed disabled:bg-[var(--olive-300)]"
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
