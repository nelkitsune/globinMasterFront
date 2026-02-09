"use client";
import React, { useEffect } from "react";
import { useHomebrewFeatsStore } from "@/store/useHomebrewFeatsStore";

interface HomebrewFeatsPanelProps {
    campaignId: number;
}

export const HomebrewFeatsPanel: React.FC<HomebrewFeatsPanelProps> = ({
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
    } = useHomebrewFeatsStore();

    useEffect(() => {
        fetchMine();
        fetchByCampaign(campaignId);
    }, [campaignId]);

    const handleAddFeat = async (featId: number) => {
        await addToCampaign(featId, campaignId);
    };

    const handleRemoveFeat = async (featId: number) => {
        await removeFromCampaign(featId, campaignId);
    };

    const unavailableFeats = mine.filter(
        (feat) =>
            !campaignItems.some((campaignFeat) => campaignFeat.id === feat.id)
    );

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                Gestionar Dotes Caseros
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
                {/* Mis Dotes (Disponibles) */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                        Mis Dotes Disponibles ({unavailableFeats.length})
                    </h4>
                    {unavailableFeats.length > 0 ? (
                        <ul className="space-y-2">
                            {unavailableFeats.map((feat) => (
                                <li
                                    key={feat.id}
                                    className="flex items-center justify-between border border-gray-200 rounded p-3 bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{feat.name}</p>
                                        {feat.originalName && (
                                            <p className="text-xs text-gray-500">{feat.originalName}</p>
                                        )}
                                        {feat.benefit && (
                                            <p className="text-xs text-gray-600 line-clamp-1">
                                                {feat.benefit}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleAddFeat(feat.id!)}
                                        disabled={loading}
                                        className="btn btn-primary btn-sm ml-2 flex-shrink-0"
                                    >
                                        Agregar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            Todos tus dotes están agregados a esta campaña.
                        </p>
                    )}
                </div>

                {/* Dotes de la Campaña */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                        Dotes de la Campaña ({campaignItems.length})
                    </h4>
                    {campaignItems.length > 0 ? (
                        <ul className="space-y-2">
                            {campaignItems.map((feat) => (
                                <li
                                    key={feat.id}
                                    className="flex items-center justify-between border border-green-200 rounded p-3 bg-green-50 hover:bg-green-100 transition"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{feat.name}</p>
                                        {feat.originalName && (
                                            <p className="text-xs text-gray-500">{feat.originalName}</p>
                                        )}
                                        {feat.benefit && (
                                            <p className="text-xs text-gray-600 line-clamp-1">
                                                {feat.benefit}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFeat(feat.id!)}
                                        disabled={loading}
                                        className="btn btn-danger btn-sm ml-2 flex-shrink-0"
                                    >
                                        Quitar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No hay dotes caseros en esta campaña.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
