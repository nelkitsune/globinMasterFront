"use client";
import React, { useEffect, useState } from "react";
import { useCharactersStore } from "@/store/useCharactersStore";
import { CharacterCreateRequest } from "@/types/characters";
import { MemberResponse } from "@/api/campaignsApi";
import { getCharacter } from "@/api/characterApi";

interface EditCharacterModalProps {
    characterId: number;
    members?: MemberResponse[];
    onClose: () => void;
    onSuccess?: () => void;
}

export const EditCharacterModal: React.FC<EditCharacterModalProps> = ({
    characterId,
    members = [],
    onClose,
    onSuccess,
}) => {
    const { update, loading, error } = useCharactersStore();
    const [formData, setFormData] = useState<CharacterCreateRequest | null>(null);
    const [loadingCharacter, setLoadingCharacter] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;
        setLoadingCharacter(true);
        setLoadError(null);

        getCharacter(characterId)
            .then((character) => {
                if (!isActive) return;
                setFormData({
                    userId: character.userId ?? null,
                    name: character.name,
                    maxHp: character.maxHp,
                    baseInitiative: character.baseInitiative,
                    isNpc: character.isNpc,
                });
                setLoadingCharacter(false);
            })
            .catch((err) => {
                if (!isActive) return;
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Error al cargar personaje";
                setLoadError(message);
                setLoadingCharacter(false);
            });

        return () => {
            isActive = false;
        };
    }, [characterId]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (!formData) return;
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) =>
                prev
                    ? {
                        ...prev,
                        [name]: checked,
                        ...(name === "isNpc" && checked ? { userId: null } : {}),
                    }
                    : prev
            );
        } else if (type === "number") {
            setFormData((prev) =>
                prev ? { ...prev, [name]: Number(value) } : prev
            );
        } else {
            setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
        }
    };

    const handleOwnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!formData) return;
        const value = e.target.value;
        if (value === "npc") {
            setFormData((prev) => (prev ? { ...prev, userId: null, isNpc: true } : prev));
        } else {
            setFormData((prev) =>
                prev
                    ? {
                        ...prev,
                        userId: Number(value),
                        isNpc: false,
                    }
                    : prev
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

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

        const updated = await update(characterId, payload);
        if (updated) {
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

                <h2 className="text-xl font-bold text-gray-900 mb-4">Editar Personaje</h2>

                {loadingCharacter && (
                    <p className="text-sm text-gray-600">Cargando personaje...</p>
                )}

                {loadError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                        {loadError}
                    </div>
                )}

                {formData && !loadingCharacter && !loadError && (
                    <form className="modal-form" onSubmit={handleSubmit}>
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
                                required
                                disabled={loading}
                            />
                        </div>

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
                                        ? "Este personaje sera un NPC"
                                        : "Este personaje pertenece a un jugador"}
                                </span>
                            </div>
                        )}

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
                                min="1"
                                required
                                disabled={loading}
                            />
                        </div>

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
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}

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
                                {loading ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
