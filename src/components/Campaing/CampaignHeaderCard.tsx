"use client";
import React from "react";
import type { Campaign } from "@/api/campaignsApi";

interface CampaignHeaderCardProps {
    campaign: Campaign;
    isOwner: boolean;
    statusLabel: string;
}

export const CampaignHeaderCard: React.FC<CampaignHeaderCardProps> = ({
    campaign,
    isOwner,
    statusLabel,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-5/12">
                    {campaign.imageUrl ? (
                        <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                            <img
                                src={campaign.imageUrl}
                                alt={campaign.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                            Sin imagen
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded ${campaign.active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                        >
                            {statusLabel}
                        </span>
                        <span className="text-xs text-gray-500">ID: {campaign.id}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{campaign.name}</h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        {campaign.description || "Sin descripción"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500">Sistema</div>
                            <div className="font-semibold text-gray-800">
                                {campaign.game_system || "No especificado"}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-gray-500">Ambientación</div>
                            <div className="font-semibold text-gray-800">
                                {campaign.setting || "No especificado"}
                            </div>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="text-xs text-yellow-800 font-semibold">Código de ingreso</div>
                            <div className="text-lg font-bold text-yellow-900 tracking-wide">
                                {campaign.joinCode}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
