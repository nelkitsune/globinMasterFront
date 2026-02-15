"use client";
import React, { useEffect, useMemo, useState } from "react";
import { CampaignCharacterResponse } from "@/types/characters";

export type EncounterParticipant = {
    id: number;
    nombre: string;
    hp: number;
    iniciativa: number;
    tipo: "pj" | "npc-enemigo" | "npc-aliado" | "npc-neutral";
    estados: string[];
};

type DraftItem = {
    characterId: number;
    name: string;
    isNpc: boolean;
    selected: boolean;
    hp: string;
    initiative: string;
};

interface SeleccionarParticipantesModalProps {
    items: CampaignCharacterResponse[];
    characterDefaults: Record<number, { maxHp: number; baseInitiative: number }>;
    onConfirm: (participants: EncounterParticipant[]) => void;
    onCancel: () => void;
}

export const SeleccionarParticipantesModal: React.FC<
    SeleccionarParticipantesModalProps
> = ({ items, characterDefaults, onConfirm, onCancel }) => {
    const visibleItems = useMemo(
        () => items.filter((item) => !item.isDeleted),
        [items]
    );

    const [drafts, setDrafts] = useState<DraftItem[]>([]);

    useEffect(() => {
        setDrafts(
            visibleItems.map((item) => {
                const defaults = characterDefaults[item.characterId];

                return {
                    characterId: item.characterId,
                    name: item.characterName,
                    isNpc: item.isNpc,
                    selected: false,
                    hp:
                        defaults && Number.isFinite(defaults.maxHp)
                            ? String(defaults.maxHp)
                            : "",
                    initiative:
                        defaults && Number.isFinite(defaults.baseInitiative)
                            ? String(defaults.baseInitiative)
                            : "",
                };
            })
        );
    }, [visibleItems, characterDefaults]);

    const hasSelected = drafts.some((draft) => draft.selected);

    const handleToggle = (characterId: number) => {
        setDrafts((prev) =>
            prev.map((draft) =>
                draft.characterId === characterId
                    ? { ...draft, selected: !draft.selected }
                    : draft
            )
        );
    };

    const handleInputChange = (
        characterId: number,
        field: "hp" | "initiative",
        value: string
    ) => {
        setDrafts((prev) =>
            prev.map((draft) =>
                draft.characterId === characterId
                    ? { ...draft, [field]: value }
                    : draft
            )
        );
    };

    const handleConfirm = () => {
        const participants: EncounterParticipant[] = drafts
            .filter((draft) => draft.selected)
            .map((draft) => {
                const hp = Number(draft.hp);
                const initiative = Number(draft.initiative);

                return {
                    id: draft.characterId,
                    nombre: draft.name,
                    hp: Number.isFinite(hp) ? hp : 0,
                    iniciativa: Number.isFinite(initiative) ? initiative : 0,
                    tipo: draft.isNpc ? "npc-aliado" : "pj",
                    estados: [],
                };
            });

        onConfirm(participants);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Seleccionar participantes
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                    Marca los personajes del encuentro y ajusta vida e iniciativa.
                </p>

                {visibleItems.length === 0 ? (
                    <p className="text-sm text-gray-600">
                        No hay personajes disponibles para este encuentro.
                    </p>
                ) : (
                    <div className="grid gap-3">
                        {drafts.map((draft) => (
                            <div
                                key={draft.characterId}
                                className="border border-gray-200 rounded-lg p-3 bg-white"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                        <input
                                            type="checkbox"
                                            checked={draft.selected}
                                            onChange={() =>
                                                handleToggle(draft.characterId)
                                            }
                                        />
                                        <span>{draft.name}</span>
                                        <span className="text-xs text-gray-500">
                                            {draft.isNpc ? "NPC" : "PJ"}
                                        </span>
                                    </label>

                                    <div className="grid grid-cols-2 gap-2 sm:w-64">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-gray-600">
                                                Vida
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                className="modal-input"
                                                value={draft.hp}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        draft.characterId,
                                                        "hp",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-gray-600">
                                                Iniciativa
                                            </label>
                                            <input
                                                type="number"
                                                className="modal-input"
                                                value={draft.initiative}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        draft.characterId,
                                                        "initiative",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={!hasSelected}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};
