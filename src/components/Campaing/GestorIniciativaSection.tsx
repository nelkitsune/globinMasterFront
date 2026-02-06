"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCharacterModal } from "./CreateCharacterModal";
import { EditCharacterModal } from "./EditCharacterModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import {
    EncounterParticipant,
    SeleccionarParticipantesModal,
} from "./SeleccionarParticipantesModal";
import { MemberResponse } from "@/api/campaignsApi";
import { useCampaignCharactersStore } from "@/store/useCampaignCharactersStore";
import { useCharactersStore } from "@/store/useCharactersStore";
import { useIniciativaStore } from "@/store/useIniciativaStore";

interface GestorIniciativaSectionProps {
    campaignId?: number;
    members?: MemberResponse[];
}

export const GestorIniciativaSection: React.FC<GestorIniciativaSectionProps> = ({
    campaignId,
    members = [],
}) => {
    const router = useRouter();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editCharacterId, setEditCharacterId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showEncounterModal, setShowEncounterModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{
        characterId: number;
        characterName: string;
    } | null>(null);

    const {
        items,
        loading,
        error,
        setCampaign,
        fetch,
        refresh,
    } = useCampaignCharactersStore();
    const {
        remove: deleteCharacter,
        loading: characterLoading,
        error: characterError,
        items: characterItems,
        fetchAll: fetchAllCharacters,
    } = useCharactersStore();
    const setLista = useIniciativaStore((state) => state.setLista);

    const hasActiveCharacters = items.some((item) => !item.isDeleted);

    const characterDefaults = useMemo(
        () =>
            characterItems.reduce<Record<number, { maxHp: number; baseInitiative: number }>>(
                (acc, character) => {
                    acc[character.id] = {
                        maxHp: character.maxHp,
                        baseInitiative: character.baseInitiative,
                    };
                    return acc;
                },
                {}
            ),
        [characterItems]
    );

    useEffect(() => {
        if (!campaignId) return;
        setCampaign(campaignId);
        fetch();
    }, [campaignId, setCampaign, fetch]);

    useEffect(() => {
        fetchAllCharacters();
    }, [fetchAllCharacters]);

    const handleCharacterCreated = async () => {
        await refresh();
    };

    const handleCharacterUpdated = async () => {
        await refresh();
    };

    const handleDelete = (characterId: number, characterName: string) => {
        setDeleteConfirm({ characterId, characterName });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm) return;

        setDeletingId(deleteConfirm.characterId);
        await deleteCharacter(deleteConfirm.characterId);
        await refresh();
        setDeletingId(null);
        setDeleteConfirm(null);
    };

    const handleConfirmEncounter = (participants: EncounterParticipant[]) => {
        setLista(participants);
        setShowEncounterModal(false);
        router.push("/gestorDeIniciativa");
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Gestor de iniciativa</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowEncounterModal(true)}
                        disabled={loading || !hasActiveCharacters}
                    >
                        Abrir gestor
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Agregar PJ/NPC
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Crea personajes para agregar al gestor de iniciativa.
                </p>

                <div className="mt-4">
                    {loading ? (
                        <p className="text-sm text-gray-600">Cargando personajes...</p>
                    ) : items.filter((item) => !item.isDeleted).length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {items
                                .filter((item) => !item.isDeleted)
                                .map((item) => (
                                    <li
                                        key={item.id}
                                        className="border border-gray-200 rounded-lg p-3 bg-white"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {item.characterName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.isNpc ? "NPC" : "Jugador"}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditCharacterId(item.characterId)}
                                                    disabled={loading || characterLoading}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(item.characterId, item.characterName)
                                                    }
                                                    disabled={
                                                        loading ||
                                                        characterLoading ||
                                                        deletingId === item.characterId
                                                    }
                                                >
                                                    {deletingId === item.characterId
                                                        ? "Borrando..."
                                                        : "Borrar"}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Aun no hay personajes en la campana.
                        </p>
                    )}

                    {(error || characterError) && (
                        <p className="text-xs text-red-600 mt-2">
                            {error || characterError}
                        </p>
                    )}
                </div>
            </div>

            {showCreateModal && (
                <CreateCharacterModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCharacterCreated}
                    campaignId={campaignId}
                    members={members}
                />
            )}

            {editCharacterId !== null && (
                <EditCharacterModal
                    characterId={editCharacterId}
                    members={members}
                    onClose={() => setEditCharacterId(null)}
                    onSuccess={handleCharacterUpdated}
                />
            )}

            {deleteConfirm && (
                <DeleteConfirmationModal
                    title="Eliminar Personaje"
                    message={`¿Eliminar el personaje "${deleteConfirm.characterName}"? Esta acción usa borrado lógico.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    isLoading={deletingId === deleteConfirm.characterId}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}

            {showEncounterModal && (
                <SeleccionarParticipantesModal
                    items={items}
                    characterDefaults={characterDefaults}
                    onConfirm={handleConfirmEncounter}
                    onCancel={() => setShowEncounterModal(false)}
                />
            )}
        </>
    );
};
