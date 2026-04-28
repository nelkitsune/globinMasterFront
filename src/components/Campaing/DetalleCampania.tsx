"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Campaign, MemberResponse } from "@/api/campaignsApi";
import { useCampaignStore } from "@/store/useCampaignStore";
import { useAuthStore } from "@/store/useAuthStore";
import { GestorIniciativaSection } from "./GestorIniciativaSection";
import HomebrewCampaignSection from "./HomebrewCampaignSection";
import XpLogSection from "./XpLogSection";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { CampaignHeaderCard } from "./CampaignHeaderCard";
import { CampaignOwnerManagementSection } from "./CampaignOwnerManagementSection";
import { CampaignMembersSection } from "./CampaignMembersSection";

interface DetalleCampaniaProps {
    campaign: Campaign;
    members?: MemberResponse[];
}

export const DetalleCampania: React.FC<DetalleCampaniaProps> = ({ campaign, members }) => {
    const { user } = useAuthStore();

    const { updateCampaign, addMember, removeMember, fetchMembers, loading, error } = useCampaignStore();

    // Verificar si es owner: debe tener joinCode Y el usuario actual debe tener rol OWNER
    const isOwner = useMemo(() => {
        if (!campaign.joinCode) {
            return false;
        }
        if (!user || !members) {
            return false;
        }

        const currentUserMember = members.find(m => m.userId === user.id);
        return !!currentUserMember && currentUserMember.role === "OWNER";
    }, [campaign.joinCode, user, members]);

    const [isEditing, setIsEditing] = useState(false);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [isRemovingMember, setIsRemovingMember] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [showStatusConfirm, setShowStatusConfirm] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<MemberResponse | null>(null);

    const [editForm, setEditForm] = useState({
        name: campaign.name || "",
        description: campaign.description || "",
        game_system: campaign.game_system || "",
        setting: campaign.setting || "",
    });

    const [joinCodeInput, setJoinCodeInput] = useState("");

    const safeMembers = useMemo(() => members || [], [members]);

    const statusLabel = campaign.active ? "Activa" : "Inactiva";

    useEffect(() => {
        setEditForm({
            name: campaign.name || "",
            description: campaign.description || "",
            game_system: campaign.game_system || "",
            setting: campaign.setting || "",
        });
    }, [campaign.id, campaign.name, campaign.description, campaign.game_system, campaign.setting]);

    const handleEditChange = (
        field: "name" | "description" | "game_system" | "setting",
        value: string
    ) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = async () => {
        const updated = await updateCampaign(campaign.id, {
            name: editForm.name.trim(),
            description: editForm.description.trim() || null,
            game_system: editForm.game_system.trim() || null,
            setting: editForm.setting.trim() || null,
        });
        if (updated) {
            setIsEditing(false);
        }
    };

    const handleToggleStatus = async () => {
        setIsTogglingStatus(true);
        await updateCampaign(campaign.id, {
            active: !campaign.active,
        });
        setIsTogglingStatus(false);
        setShowStatusConfirm(false);
    };

    const handleAddMember = async () => {
        const code = joinCodeInput.trim();
        if (!code) return;
        const ok = await addMember(campaign.id, { joinCode: code });
        if (ok) {
            setJoinCodeInput("");
            setIsAddingMember(false);
        }
    };

    const handleRemoveMember = async (userId: number) => {
        const ok = await removeMember(campaign.id, userId);
        if (ok) {
            await fetchMembers(campaign.id);
            setMemberToRemove(null);
        }
    };

    return (
        <div className="w-full space-y-6">
            <CampaignHeaderCard campaign={campaign} isOwner={isOwner} statusLabel={statusLabel} />

            {/* Acciones Owner */}
            {isOwner && (
                <CampaignOwnerManagementSection
                    loading={loading}
                    error={error}
                    isEditing={isEditing}
                    isAddingMember={isAddingMember}
                    isRemovingMember={isRemovingMember}
                    editForm={editForm}
                    joinCodeInput={joinCodeInput}
                    onToggleEditing={() => setIsEditing((prev) => !prev)}
                    onToggleAddingMember={() => setIsAddingMember((prev) => !prev)}
                    onToggleRemovingMember={() => setIsRemovingMember((prev) => !prev)}
                    onEditChange={handleEditChange}
                    onJoinCodeChange={setJoinCodeInput}
                    onSaveEdit={handleSaveEdit}
                    onAddMember={handleAddMember}
                />
            )}

            {/* Zona de Peligro - Solo para owners */}
            {isOwner && (
                <div className="bg-white rounded-2xl shadow-md border-2 border-red-200 p-4 sm:p-6">
                    <h2 className="text-lg font-bold text-red-700 mb-2">Zona de Peligro</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        {campaign.active
                            ? "Archivar la campaña la oculta de los listados de campañas activas y evita nuevas sesiones. Puedes reactivarla cuando quieras."
                            : "Esta campaña esta archivada. Puedes volver a activarla para que aparezca en tus campañas activas."}
                    </p>
                    <button
                        className={campaign.active ? "btn btn-danger" : "btn btn-secondary"}
                        onClick={() => setShowStatusConfirm(true)}
                        disabled={loading}
                    >
                        {campaign.active ? "Archivar campaña" : "Reactivar campaña"}
                    </button>
                </div>
            )}

            {isOwner && showStatusConfirm && (
                <DeleteConfirmationModal
                    title={campaign.active ? "Archivar campaña" : "Reactivar campaña"}
                    message={
                        campaign.active
                            ? "Estas seguro de archivar esta campaña? Los jugadores no la veran como activa hasta que la reactives."
                            : "Estas seguro de reactivar esta campaña? Volvera a aparecer en tus campañas activas."
                    }
                    confirmText={campaign.active ? "Archivar" : "Reactivar"}
                    cancelText="Cancelar"
                    onCancel={() => setShowStatusConfirm(false)}
                    onConfirm={handleToggleStatus}
                    isLoading={loading || isTogglingStatus}
                />
            )}

            <CampaignMembersSection
                members={safeMembers}
                isOwner={isOwner}
                isRemovingMember={isRemovingMember}
                loading={loading}
                onRemoveMemberClick={(member) => setMemberToRemove(member)}
            />

            {isOwner && memberToRemove && (
                <DeleteConfirmationModal
                    title="Eliminar jugador"
                    message={`Estas seguro de eliminar a ${memberToRemove.username} de la campaña?`}
                    confirmText="Eliminar jugador"
                    cancelText="Cancelar"
                    onCancel={() => setMemberToRemove(null)}
                    onConfirm={() => handleRemoveMember(memberToRemove.userId)}
                    isLoading={loading}
                />
            )}

            {/* Gestor de iniciativa - Solo para owners */}
            {isOwner && <GestorIniciativaSection campaignId={campaign.id} members={members} />}

            <HomebrewCampaignSection campaignId={campaign.id} isOwner={isOwner} />

            {/* XP Log Section */}
            {user && (
                <XpLogSection
                    campaignId={campaign.id}
                    userId={user.id}
                    isOwner={isOwner}
                    members={safeMembers}
                />
            )}
        </div>
    );
};
