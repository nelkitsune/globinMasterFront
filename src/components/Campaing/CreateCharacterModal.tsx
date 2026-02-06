"use client";
import React, { useState } from "react";
import { useCharactersStore } from "@/store/useCharactersStore";
import { CharacterCreateRequest } from "@/types/characters";
import { useAuthStore } from "@/store/useAuthStore";
import { MemberResponse } from "@/api/campaignsApi";

interface CreateCharacterModalProps {
    onClose: () => void;
    onSuccess?: () => void;
    campaignId?: number;
    members?: MemberResponse[];
}

export const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({
    onClose,
    onSuccess,
    campaignId,
    members = [],
}) => {
    const { user } = useAuthStore();
    const { create, addToCampaign, loading, error } = useCharactersStore();

    const [formData, setFormData] = useState<CharacterCreateRequest>({
        userId: user?.id || null,
        name: "",
        maxHp: 0,
        baseInitiative: 0,
        isNpc: false,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
                // Si es NPC, eliminar userId
                ...(name === "isNpc" && checked ? { userId: null } : {}),
            }));
        } else if (type === "number") {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleOwnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "npc") {
            setFormData((prev) => ({ ...prev, userId: null, isNpc: true }));
        } else {
            setFormData((prev) => ({
                ...prev,
                userId: Number(value),
                isNpc: false,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("El nombre del personaje es obligatorio");
            return;
        }

        if (formData.maxHp <= 0) {
            alert("Los puntos de vida deben ser mayores a 0");
            return;
        }

        const payload: CharacterCreateRequest = {
            userId: formData.isNpc ? null : formData.userId,
            name: formData.name.trim(),
            maxHp: formData.maxHp,
            baseInitiative: formData.baseInitiative,
            isNpc: formData.isNpc,
        };

        const newCharacter = await create(payload);

        if (newCharacter && campaignId) {
            // Si se proporciona campaignId, agregar el personaje a la campaña
            await addToCampaign(newCharacter.id, campaignId);
        }

        if (newCharacter) {
            if (onSuccess) onSuccess();
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-close" onClick={onClose}>
                    ×
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Crear Personaje
                </h2>

                <form className="modal-form" onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className="modal-field">
                        <label htmlFor="name" className="font-semibold">
                            Nombre *
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="modal-input"
                            placeholder="Ej: Aragorn"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Dueño del personaje */}
                    {members.length > 0 && (
                        <div className="modal-field">
                            <label htmlFor="owner" className="font-semibold">
                                Dueño del Personaje
                            </label>
                            <select
                                id="owner"
                                value={formData.userId === null ? "npc" : formData.userId}
                                onChange={handleOwnerChange}
                                className="modal-input"
                                disabled={loading}
                            >
                                <option value="npc">Ninguno (NPC)</option>
                                {members.map((member) => (
                                    <option key={member.id} value={member.userId}>
                                        {member.username} ({member.email})
                                    </option>
                                ))}
                            </select>
                            <span className="text-xs text-gray-600">
                                {formData.userId === null
                                    ? "Este personaje será un NPC"
                                    : "Este personaje pertenece a un jugador"}
                            </span>
                        </div>
                    )}

                    {/* Puntos de Vida */}
                    <div className="modal-field">
                        <label htmlFor="maxHp" className="font-semibold">
                            Puntos de Vida (HP) *
                        </label>
                        <input
                            id="maxHp"
                            type="number"
                            name="maxHp"
                            value={formData.maxHp}
                            onChange={handleInputChange}
                            className="modal-input"
                            placeholder="Ej: 45"
                            min="1"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Iniciativa Base */}
                    <div className="modal-field">
                        <label htmlFor="baseInitiative" className="font-semibold">
                            Iniciativa Base
                        </label>
                        <input
                            id="baseInitiative"
                            type="number"
                            name="baseInitiative"
                            value={formData.baseInitiative}
                            onChange={handleInputChange}
                            className="modal-input"
                            placeholder="Ej: 3"
                            disabled={loading}
                        />
                        <span className="text-xs text-gray-600">
                            Modificador de Destreza + bonificadores
                        </span>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Botones */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !formData.name.trim() || formData.maxHp <= 0}
                        >
                            {loading ? "Creando..." : "Crear Personaje"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
