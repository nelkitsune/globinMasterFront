"use client";

import { uploadMyAvatar } from "@/api/imageUpload";
import HomebrewFeatsManager from "@/components/Homebrew/HomebrewFeatsManager";
import HomebrewRulesManager from "@/components/Homebrew/HomebrewRulesManager";
import HomebrewSpellsManager from "@/components/Homebrew/HomebrewSpellsManager";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

type ProfileData = {
    email: string;
    username: string;
    avatarUrl: string | null;
    campanasCreadas: number;
    campanasJugadas: number;
};

const DEFAULT_PROFILE: ProfileData = {
    email: "aventurero@goblinmaster.com",
    username: "dungeon_master_01",
    avatarUrl: null,
    campanasCreadas: 12,
    campanasJugadas: 28,
};

export default function MiPerfilPage() {
    const { user, hydrate, setUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<ProfileData>(DEFAULT_PROFILE);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarMessage, setAvatarMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [editForm, setEditForm] = useState(userData);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (!user) return;

        const mappedProfile: ProfileData = {
            ...DEFAULT_PROFILE,
            username: user.username || DEFAULT_PROFILE.username,
            email: user.email || DEFAULT_PROFILE.email,
            avatarUrl: user.avatar_url || null,
        };

        setUserData(mappedProfile);
        setEditForm(mappedProfile);
    }, [user]);

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm(userData);
        setAvatarMessage(null);
    };

    const handleSave = () => {
        setUserData(editForm);

        if (user) {
            setUser({
                ...user,
                username: editForm.username,
                email: editForm.email,
                avatar_url: editForm.avatarUrl,
            });
        }

        setIsEditing(false);
        setSelectedAvatar(null);
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
        }
    };

    const handleCancel = () => {
        setEditForm(userData);
        setIsEditing(false);
        setSelectedAvatar(null);
        setAvatarMessage(null);

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }

        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
        setSelectedAvatar(file);
        setAvatarMessage(null);
    };

    const handleAvatarUpload = async () => {
        if (!selectedAvatar) {
            setAvatarMessage({ type: "error", text: "Seleccioná una imagen antes de actualizar la foto." });
            return;
        }

        setAvatarLoading(true);
        setAvatarMessage(null);

        try {
            const result = await uploadMyAvatar(selectedAvatar);

            setUserData((prev) => ({ ...prev, avatarUrl: result.avatarUrl }));
            setEditForm((prev) => ({ ...prev, avatarUrl: result.avatarUrl }));

            if (user) {
                setUser({
                    ...user,
                    avatar_url: result.avatarUrl,
                });
            }

            setSelectedAvatar(null);
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
                setAvatarPreview(null);
            }

            setAvatarMessage({ type: "success", text: "Foto de perfil actualizada correctamente." });
        } catch (error) {
            setAvatarMessage({
                type: "error",
                text: error instanceof Error ? error.message : "No se pudo actualizar la foto de perfil.",
            });
        } finally {
            setAvatarLoading(false);
        }
    };

    const fallbackInitial = (userData.username || "?").charAt(0).toUpperCase();

    return (
        <div className="container">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="brand text-4xl mb-2" style={{ color: "var(--olive-900)" }}>
                    Mi Perfil
                </h1>
                <p className="muted text-lg">Gestiona tu información personal</p>
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8 p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
                    {userData.avatarUrl ? (
                        <img
                            src={userData.avatarUrl}
                            alt="Avatar de usuario"
                            className="w-32 h-32 rounded-full mb-4 object-cover border-4"
                            style={{ borderColor: "var(--olive-700)" }}
                        />
                    ) : (
                        <div
                            className="w-32 h-32 rounded-full mb-4 flex items-center justify-center text-6xl font-bold"
                            style={{
                                backgroundColor: "var(--olive-700)",
                                color: "white",
                            }}
                        >
                            {fallbackInitial}
                        </div>
                    )}
                    <h2 className="text-2xl font-bold mb-1">{userData.username}</h2>
                    <p className="text-sm muted mb-2">@{userData.username}</p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div
                        className="p-6 rounded-2xl text-center"
                        style={{ backgroundColor: "var(--card)" }}
                    >
                        <div className="text-4xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                            {userData.campanasCreadas}
                        </div>
                        <div className="text-sm font-semibold">Campañas Creadas</div>
                    </div>
                    <div
                        className="p-6 rounded-2xl text-center"
                        style={{ backgroundColor: "var(--card)" }}
                    >
                        <div className="text-4xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                            {userData.campanasJugadas}
                        </div>
                        <div className="text-sm font-semibold">Campañas Jugadas</div>
                    </div>
                </div>

                {/* Information Section */}
                <div
                    className="p-6 rounded-2xl mb-6"
                    style={{ backgroundColor: "var(--card)" }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="sectionTitle mb-0">Información Personal</h3>
                        {!isEditing && (
                            <button onClick={handleEdit} className="btn btn-primary">
                                Editar Perfil
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form className="space-y-4">
                            <div className="modal-field">
                                <label className="font-semibold">Foto de perfil</label>

                                {(avatarPreview || editForm.avatarUrl) && (
                                    <div className="mb-3">
                                        <img
                                            src={avatarPreview || editForm.avatarUrl || ""}
                                            alt="Preview avatar"
                                            className="w-24 h-24 rounded-full object-cover border-2"
                                            style={{ borderColor: "var(--olive-700)" }}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleAvatarFileSelect}
                                        disabled={avatarLoading}
                                        className="modal-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAvatarUpload}
                                        disabled={!selectedAvatar || avatarLoading}
                                        className="btn btn-primary"
                                    >
                                        {avatarLoading ? "Subiendo..." : "Actualizar Foto"}
                                    </button>
                                </div>

                                <p className="text-xs muted mt-2">Máximo 5MB • Formatos: JPEG, PNG, WebP</p>

                                {avatarMessage && (
                                    <p
                                        className="text-sm mt-2"
                                        style={{ color: avatarMessage.type === "success" ? "#15803d" : "#dc2626" }}
                                    >
                                        {avatarMessage.text}
                                    </p>
                                )}
                            </div>

                            <div className="modal-field">
                                <label className="font-semibold">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={editForm.username}
                                    onChange={handleChange}
                                    className="modal-input"
                                />
                            </div>

                            <div className="modal-field">
                                <label className="font-semibold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleChange}
                                    className="modal-input"
                                />
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="btn btn-primary"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-semibold mb-1" style={{ color: "var(--olive-900)" }}>
                                    Nombre
                                </div>
                                <div className="text-base">{userData.username}</div>
                            </div>

                            <div>
                                <div className="text-sm font-semibold mb-1" style={{ color: "var(--olive-900)" }}>
                                    Nombre de Usuario
                                </div>
                                <div className="text-base">@{userData.username}</div>
                            </div>

                            <div>
                                <div className="text-sm font-semibold mb-1" style={{ color: "var(--olive-900)" }}>
                                    Email
                                </div>
                                <div className="text-base">{userData.email}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Homebrew Section */}
                <div className="mb-6">
                    <div className="mb-4">
                        <h3 className="sectionTitle">Homerules</h3>
                        <p className="text-sm muted">
                            Gestiona reglas, dotes y conjuros personalizados.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <HomebrewRulesManager />
                        <HomebrewFeatsManager />
                        <HomebrewSpellsManager />
                    </div>
                </div>
            </div>
        </div>
    );
}
