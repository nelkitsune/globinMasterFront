"use client";

import { AvatarUploader } from "@/components/AvatarUploader";
import HomebrewFeatsManager from "@/components/Homebrew/HomebrewFeatsManager";
import HomebrewRulesManager from "@/components/Homebrew/HomebrewRulesManager";
import HomebrewSpellsManager from "@/components/Homebrew/HomebrewSpellsManager";
import { useState } from "react";

export default function MiPerfilPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        nombre: "Aventurero",
        email: "aventurero@goblinmaster.com",
        username: "dungeon_master_01",
        bio: "Amante de las aventuras épicas y las batallas estratégicas. Game Master desde hace 5 años.",
        nivel: "Master Experimentado",
        campanasCreadas: 12,
        campanasJugadas: 28,
    });

    const [editForm, setEditForm] = useState(userData);

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm(userData);
    };

    const handleSave = () => {
        setUserData(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm(userData);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    };

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
                    <div
                        className="w-32 h-32 rounded-full mb-4 flex items-center justify-center text-6xl font-bold"
                        style={{
                            backgroundColor: "var(--olive-700)",
                            color: "white",
                        }}
                    >
                        {userData.nombre.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{userData.nombre}</h2>
                    <p className="text-sm muted mb-2">@{userData.username}</p>
                    <span
                        className="px-4 py-1 rounded-full text-sm font-semibold"
                        style={{
                            backgroundColor: "var(--olive-500)",
                            color: "var(--fg)",
                        }}
                    >
                        {userData.nivel}
                    </span>
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
                                <label className="font-semibold">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={editForm.nombre}
                                    onChange={handleChange}
                                    className="modal-input"
                                />
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

                            <div className="modal-field">
                                <label className="font-semibold">Biografía</label>
                                <textarea
                                    name="bio"
                                    value={editForm.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="modal-input resize-none"
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
                                <div className="text-base">{userData.nombre}</div>
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

                            <div>
                                <div className="text-sm font-semibold mb-1" style={{ color: "var(--olive-900)" }}>
                                    Biografía
                                </div>
                                <div className="text-base">{userData.bio}</div>
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

                {/* Danger Zone */}
                <div
                    className="p-6 rounded-2xl border-2"
                    style={{
                        backgroundColor: "var(--card)",
                        borderColor: "#dc2626",
                    }}
                >
                    <h3 className="sectionTitle text-red-600">Zona de Peligro</h3>
                    <p className="text-sm mb-4 muted">
                        Las siguientes acciones son permanentes y no se pueden deshacer.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="btn btn-outline" style={{ borderColor: "#dc2626", color: "#dc2626" }}>
                            Cambiar Contraseña
                        </button>
                        <button className="btn btn-danger">
                            Eliminar Cuenta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
