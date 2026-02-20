"use client";

import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { FormModal, FormField } from "@/components/FormModal";
import { adminApi, SpellAdminDTO, handleAdminError } from "@/api/adminApi";
import Link from "next/link";

const SPELL_FIELDS: FormField[] = [
    {
        name: "name",
        label: "Nombre",
        type: "text",
        required: true,
        placeholder: "Ej: Proyectil Mágico",
        minLength: 3,
        maxLength: 100,
    },
    {
        name: "nivel",
        label: "Nivel",
        type: "number",
        required: true,
        placeholder: "0-9",
    },
    {
        name: "escuela",
        label: "Escuela",
        type: "select",
        required: true,
        options: [
            { value: "Abjuracion", label: "Abjuración" },
            { value: "Adivinacion", label: "Adivinación" },
            { value: "Conjuracion", label: "Conjuración" },
            { value: "Encantamiento", label: "Encantamiento" },
            { value: "Evocacion", label: "Evocación" },
            { value: "Invocacion", label: "Invocación" },
            { value: "Necromancia", label: "Necromancia" },
            { value: "Transmutacion", label: "Transmutación" },
        ],
    },
    {
        name: "tiempoIncantacion",
        label: "Tiempo de Incantación",
        type: "text",
        required: true,
        placeholder: "Ej: 1 acción",
    },
    {
        name: "rango",
        label: "Rango",
        type: "text",
        required: true,
        placeholder: "Ej: 60 pies",
    },
    {
        name: "componentes",
        label: "Componentes",
        type: "text",
        required: true,
        placeholder: "Ej: V, S, M",
    },
    {
        name: "duracion",
        label: "Duración",
        type: "text",
        required: true,
        placeholder: "Ej: Instantánea",
    },
    {
        name: "descripcion",
        label: "Descripción",
        type: "textarea",
        required: true,
        placeholder: "Descripción completa del conjuro...",
    },
];

interface Spell {
    id?: number;
    name: string;
    nivel: number;
    escuela: string;
    tiempoIncantacion: string;
}

export default function AdminSpellsPage() {
    const [spells, setSpells] = useState<Spell[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSpell, setEditingSpell] = useState<Spell | null>(null);

    const loadSpells = async () => {
        try {
            setLoading(true);
            // TODO: Reemplazar con endpoint real para obtener conjuros (admin)
            // const response = await api.get("/admin/spells");
            // setSpells(response.data);
            setSpells([]);
        } catch (err) {
            setError(handleAdminError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSpells();
    }, []);

    const handleCreateSpell = async (data: SpellAdminDTO) => {
        try {
            await adminApi.createSpell(data);
            await loadSpells();
            setShowModal(false);
        } catch (err) {
            throw new Error(handleAdminError(err));
        }
    };

    const handleUpdateSpell = async (data: SpellAdminDTO) => {
        if (!editingSpell?.id) return;
        try {
            await adminApi.updateSpell(editingSpell.id, data);
            await loadSpells();
            setEditingSpell(null);
            setShowModal(false);
        } catch (err) {
            throw new Error(handleAdminError(err));
        }
    };

    const handleDeleteSpell = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este conjuro?")) return;
        try {
            await adminApi.deleteSpell(id);
            await loadSpells();
        } catch (err) {
            setError(handleAdminError(err));
        }
    };

    const openCreateModal = () => {
        setEditingSpell(null);
        setShowModal(true);
    };

    const openEditModal = (spell: Spell) => {
        setEditingSpell(spell);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSpell(null);
    };

    return (
        <AdminGuard>
            <div className="container">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="brand text-4xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                            Gestionar Conjuros
                        </h1>
                        <p className="muted text-lg">CRUD de conjuros disponibles</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin" className="px-4 py-2 rounded-md font-semibold" style={{ backgroundColor: "var(--olive-200)", color: "var(--olive-900)" }}>
                            ← Volver
                        </Link>
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 rounded-md font-semibold transition-colors"
                            style={{
                                backgroundColor: "var(--olive-600)",
                                color: "white",
                            }}
                        >
                            + Crear Conjuro
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-center py-8">Cargando conjuros...</p>
                ) : spells.length === 0 ? (
                    <p className="text-center py-8 muted">No hay conjuros disponibles.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--olive-300)" }}>
                        <table className="w-full">
                            <thead style={{ backgroundColor: "var(--olive-100)" }}>
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                                    <th className="px-4 py-3 text-left font-semibold">Nivel</th>
                                    <th className="px-4 py-3 text-left font-semibold">Escuela</th>
                                    <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spells.map((spell) => (
                                    <tr key={spell.id} style={{ borderBottom: "1px solid var(--olive-200)" }}>
                                        <td className="px-4 py-3 font-semibold">{spell.name}</td>
                                        <td className="px-4 py-3 text-sm muted">{spell.nivel}</td>
                                        <td className="px-4 py-3 text-sm">{spell.escuela}</td>
                                        <td className="px-4 py-3 text-center flex justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(spell)}
                                                className="px-3 py-1 text-sm rounded-md font-semibold transition-colors"
                                                style={{
                                                    backgroundColor: "var(--olive-400)",
                                                    color: "white",
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => spell.id && handleDeleteSpell(spell.id)}
                                                className="px-3 py-1 text-sm rounded-md font-semibold transition-colors"
                                                style={{
                                                    backgroundColor: "#ef4444",
                                                    color: "white",
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <FormModal
                isOpen={showModal}
                title={editingSpell ? "Editar Conjuro" : "Crear Conjuro"}
                onClose={closeModal}
                onSubmit={editingSpell ? handleUpdateSpell : handleCreateSpell}
                fields={SPELL_FIELDS}
                initialData={editingSpell || {}}
                submitButtonText={editingSpell ? "Actualizar" : "Crear"}
            />
        </AdminGuard>
    );
}
