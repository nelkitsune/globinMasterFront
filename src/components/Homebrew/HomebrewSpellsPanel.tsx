"use client";
import React, { useEffect } from "react";
import { useHomebrewSpellsStore } from "@/store/useHomebrewSpellsStore";

interface HomebrewSpellsPanelProps {
    campaignId: number;
}

export const HomebrewSpellsPanel: React.FC<HomebrewSpellsPanelProps> = ({
    campaignId,
}) => {
    const {
        mine,
        campaignItems,
        loading,
        error,
        fetchMine,
        fetchByCampaign,
        addToCampaign,
        removeFromCampaign,
        clearError,
    } = useHomebrewSpellsStore();

    useEffect(() => {
        fetchMine();
        fetchByCampaign(campaignId);
    }, [campaignId]);

    const handleAddSpell = async (spellId: number) => {
        await addToCampaign(spellId, campaignId);
    };

    const handleRemoveSpell = async (spellId: number) => {
        await removeFromCampaign(spellId, campaignId);
    };

    const unavailableSpells = mine.filter(
        (spell) =>
            !campaignItems.some((campaignSpell) => campaignSpell.id === spell.id)
    );

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                Gestionar Conjuros Caseros
            </h3>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button
                        onClick={clearError}
                        className="ml-2 text-xs underline hover:opacity-70"
                    >
                        Descartar
                    </button>
                </div>
            )}

            {loading && <p className="text-gray-600 mb-4">Cargando...</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mis Conjuros (Disponibles) */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                        Mis Conjuros Disponibles ({unavailableSpells.length})
                    </h4>
                    {unavailableSpells.length > 0 ? (
                        <ul className="space-y-2">
                            {unavailableSpells.map((spell) => (
                                <li
                                    key={spell.id}
                                    className="flex items-center justify-between border border-gray-200 rounded p-3 bg-gray-50"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{spell.name}</p>
                                        {spell.originalName && (
                                            <p className="text-xs text-gray-500">{spell.originalName}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleAddSpell(spell.id!)}
                                        disabled={loading}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Agregar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            Todos tus conjuros están agregados a esta campaña.
                        </p>
                    )}
                </div>

                {/* Conjuros de la Campaña */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                        Conjuros de la Campaña ({campaignItems.length})
                    </h4>
                    {campaignItems.length > 0 ? (
                        <ul className="space-y-2">
                            {campaignItems.map((spell) => (
                                <li
                                    key={spell.id}
                                    className="flex items-center justify-between border border-blue-200 rounded p-3 bg-blue-50"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{spell.name}</p>
                                        {spell.originalName && (
                                            <p className="text-xs text-gray-500">{spell.originalName}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveSpell(spell.id!)}
                                        disabled={loading}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Quitar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No hay conjuros caseros en esta campaña.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
