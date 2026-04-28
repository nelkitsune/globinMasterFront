"use client";
import React from "react";
import type { MemberResponse } from "@/api/campaignsApi";

interface CampaignMembersSectionProps {
    members: MemberResponse[];
    isOwner: boolean;
    isRemovingMember: boolean;
    loading: boolean;
    onRemoveMemberClick: (member: MemberResponse) => void;
}

export const CampaignMembersSection: React.FC<CampaignMembersSectionProps> = ({
    members,
    isOwner,
    isRemovingMember,
    loading,
    onRemoveMemberClick,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Miembros</h2>
            {members.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {members.map((m) => (
                        <li key={m.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">{m.username}</div>
                                    <div className="text-xs text-gray-500">{m.email}</div>
                                    <span className="text-xs mt-1 inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                        {m.role}
                                    </span>
                                </div>
                                {isOwner && isRemovingMember && m.role !== "OWNER" && (
                                    <button
                                        className="text-xs text-red-600 hover:text-red-700"
                                        onClick={() => onRemoveMemberClick(m)}
                                        disabled={loading}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">Aún no hay miembros cargados.</p>
            )}
        </div>
    );
};
