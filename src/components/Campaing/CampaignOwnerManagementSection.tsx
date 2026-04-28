"use client";
import React from "react";

interface CampaignEditForm {
    name: string;
    description: string;
    game_system: string;
    setting: string;
}

interface CampaignOwnerManagementSectionProps {
    loading: boolean;
    error: string | null;
    isEditing: boolean;
    isAddingMember: boolean;
    isRemovingMember: boolean;
    editForm: CampaignEditForm;
    joinCodeInput: string;
    onToggleEditing: () => void;
    onToggleAddingMember: () => void;
    onToggleRemovingMember: () => void;
    onEditChange: (field: keyof CampaignEditForm, value: string) => void;
    onJoinCodeChange: (value: string) => void;
    onSaveEdit: () => void;
    onAddMember: () => void;
}

export const CampaignOwnerManagementSection: React.FC<CampaignOwnerManagementSectionProps> = ({
    loading,
    error,
    isEditing,
    isAddingMember,
    isRemovingMember,
    editForm,
    joinCodeInput,
    onToggleEditing,
    onToggleAddingMember,
    onToggleRemovingMember,
    onEditChange,
    onJoinCodeChange,
    onSaveEdit,
    onAddMember,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Gestión de campaña</h2>
            <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary" onClick={onToggleEditing} disabled={loading}>
                    {isEditing ? "Cancelar edición" : "Editar campaña"}
                </button>
                <button className="btn btn-secondary" onClick={onToggleAddingMember} disabled={loading}>
                    {isAddingMember ? "Cancelar" : "Agregar jugador"}
                </button>
                <button className="btn btn-secondary" onClick={onToggleRemovingMember} disabled={loading}>
                    {isRemovingMember ? "Cancelar" : "Eliminar jugador"}
                </button>
            </div>
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

            {isEditing && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-600">Nombre</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={editForm.name}
                            onChange={(e) => onEditChange("name", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600">Sistema</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={editForm.game_system}
                            onChange={(e) => onEditChange("game_system", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-gray-600">Ambientación</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={editForm.setting}
                            onChange={(e) => onEditChange("setting", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-gray-600">Descripción</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm min-h-[90px]"
                            value={editForm.description}
                            onChange={(e) => onEditChange("description", e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            className="btn btn-primary"
                            onClick={onSaveEdit}
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
                            onChange={(e) => onJoinCodeChange(e.target.value)}
                            placeholder="Ej: ABC123"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            className="btn btn-primary"
                            onClick={onAddMember}
                            disabled={loading || !joinCodeInput.trim()}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
