"use client";
import React, { useEffect, useMemo, useState } from "react";
import type { Campaign, MemberResponse } from "@/api/campaignsApi";
import { useCampaignStore } from "@/store/useCampaignStore";
import { useAuthStore } from "@/store/useAuthStore";

interface DetalleCampaniaProps {
    campaign: Campaign;
    members?: MemberResponse[];
}

export const DetalleCampania: React.FC<DetalleCampaniaProps> = ({ campaign, members }) => {
    const { user } = useAuthStore();

    // Verificar si es owner: debe tener joinCode Y el usuario actual debe tener rol OWNER
    const isOwner = useMemo(() => {
        if (!campaign.joinCode) return false;
        if (!user || !members) return Boolean(campaign.joinCode);
        const currentUserMember = members.find(m => m.id === user.id);
        return currentUserMember?.role === "OWNER";
    }, [campaign.joinCode, user, members]);

    const statusLabel = campaign.active ? "Activa" : "Inactiva";

    const {
        updateCampaign,
        addMember,
        removeMember,
        fetchMembers,
        loading,
        error,
    } = useCampaignStore();

    const [isEditing, setIsEditing] = useState(false);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [isRemovingMember, setIsRemovingMember] = useState(false);

    const [editForm, setEditForm] = useState({
        name: campaign.name || "",
        description: campaign.description || "",
        game_system: campaign.game_system || "",
        setting: campaign.setting || "",
    });

    const [joinCodeInput, setJoinCodeInput] = useState("");

    const safeMembers = useMemo(() => members || [], [members]);

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
        await updateCampaign(campaign.id, {
            active: !campaign.active,
        });
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
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
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
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${campaign.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                {statusLabel}
                            </span>
                            <span className="text-xs text-gray-500">
                                ID: {campaign.id}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {campaign.name}
                        </h1>
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

            {/* Acciones Owner */}
            {isOwner && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Gestión de campaña</h2>
                    <div className="flex flex-wrap gap-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsEditing((prev) => !prev)}
                            disabled={loading}
                        >
                            {isEditing ? "Cancelar edición" : "Editar campaña"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsAddingMember((prev) => !prev)}
                            disabled={loading}
                        >
                            {isAddingMember ? "Cancelar" : "Agregar jugador"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsRemovingMember((prev) => !prev)}
                            disabled={loading}
                        >
                            {isRemovingMember ? "Cancelar" : "Eliminar jugador"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleToggleStatus}
                            disabled={loading}
                        >
                            Cambiar estado ({campaign.active ? "Inactivar" : "Activar"})
                        </button>
                    </div>
                    {error && (
                        <p className="text-xs text-red-600 mt-2">{error}</p>
                    )}

                    {isEditing && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-600">Nombre</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={editForm.name}
                                    onChange={(e) => handleEditChange("name", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-600">Sistema</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={editForm.game_system}
                                    onChange={(e) => handleEditChange("game_system", e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-600">Ambientación</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={editForm.setting}
                                    onChange={(e) => handleEditChange("setting", e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-600">Descripción</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm min-h-[90px]"
                                    value={editForm.description}
                                    onChange={(e) => handleEditChange("description", e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSaveEdit}
                                    disabled={loading || !editForm.name.trim()}
                                >
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    )}

                    {isAddingMember && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-600">Código de ingreso</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                    value={joinCodeInput}
                                    onChange={(e) => setJoinCodeInput(e.target.value)}
                                    placeholder="Ej: ABC123"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAddMember}
                                    disabled={loading || !joinCodeInput.trim()}
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Miembros */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Miembros</h2>
                {safeMembers.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {safeMembers.map((m) => (
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
                                            onClick={() => handleRemoveMember(m.id)}
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

            {/* Gestor de iniciativa */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Gestor de iniciativa</h2>
                <div className="flex flex-wrap gap-3">
                    <button className="btn btn-primary" disabled>
                        Abrir gestor
                    </button>
                    <button className="btn btn-secondary" disabled>
                        Ver historial
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Funcionalidad en desarrollo.</p>
            </div>

            {/* Reglas y conjuros personalizados */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Reglas y conjuros personalizados</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Sección disponible para reglas y conjuros de la campaña (en desarrollo).
                </p>
                <div className="flex flex-wrap gap-3">
                    {isOwner ? (
                        <>
                            <button className="btn btn-primary" disabled>
                                Agregar regla
                            </button>
                            <button className="btn btn-secondary" disabled>
                                Agregar conjuro
                            </button>
                        </>
                    ) : (
                        <span className="text-xs text-gray-500">Solo lectura para jugadores.</span>
                    )}
                </div>
            </div>

            {/* Registro de XP */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Registro de experiencia</h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="text-xs text-gray-600">XP ganada</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            placeholder="Ej: 250"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600">Participantes</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            placeholder="Ej: Ana, Juan, Marta"
                            disabled
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-gray-600">Descripción</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm min-h-[100px]"
                            placeholder="Describe el evento o sesión"
                            disabled
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button className="btn btn-primary" disabled>
                            Guardar registro
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Funcionalidad en desarrollo.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};
