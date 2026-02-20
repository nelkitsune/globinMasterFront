"use client";

import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { FormModal, FormField } from "@/components/FormModal";
import { adminApi, RuleAdminDTO, handleAdminError } from "@/api/adminApi";
import Link from "next/link";

const RULE_FIELDS: FormField[] = [
    {
        name: "nombre",
        label: "Nombre",
        type: "text",
        required: true,
        placeholder: "Ej: Regla de Crítico",
        minLength: 3,
        maxLength: 100,
    },
    {
        name: "categoria",
        label: "Categoría",
        type: "text",
        placeholder: "Ej: Combate",
        maxLength: 50,
    },
    {
        name: "descripcion",
        label: "Descripción Breve",
        type: "textarea",
        required: true,
        placeholder: "Descripción corta de la regla...",
    },
    {
        name: "contenido",
        label: "Contenido Detallado",
        type: "textarea",
        required: true,
        placeholder: "Explicación completa de la regla...",
    },
];

interface Rule {
    id?: number;
    nombre: string;
    categoria?: string;
    descripcion: string;
}

export default function AdminRulesPage() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);

    const loadRules = async () => {
        try {
            setLoading(true);
            // TODO: Reemplazar con endpoint real para obtener reglas (admin)
            // const response = await api.get("/admin/rules");
            // setRules(response.data);
            setRules([]);
        } catch (err) {
            setError(handleAdminError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRules();
    }, []);

    const handleCreateRule = async (data: RuleAdminDTO) => {
        try {
            await adminApi.createRule(data);
            await loadRules();
            setShowModal(false);
        } catch (err) {
            throw new Error(handleAdminError(err));
        }
    };

    const handleUpdateRule = async (data: RuleAdminDTO) => {
        if (!editingRule?.id) return;
        try {
            await adminApi.updateRule(editingRule.id, data);
            await loadRules();
            setEditingRule(null);
            setShowModal(false);
        } catch (err) {
            throw new Error(handleAdminError(err));
        }
    };

    const handleDeleteRule = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta regla?")) return;
        try {
            await adminApi.deleteRule(id);
            await loadRules();
        } catch (err) {
            setError(handleAdminError(err));
        }
    };

    const openCreateModal = () => {
        setEditingRule(null);
        setShowModal(true);
    };

    const openEditModal = (rule: Rule) => {
        setEditingRule(rule);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRule(null);
    };

    return (
        <AdminGuard>
            <div className="container">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="brand text-4xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                            Gestionar Normas
                        </h1>
                        <p className="muted text-lg">CRUD de reglas personalizadas</p>
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
                            + Crear Norma
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-center py-8">Cargando normas...</p>
                ) : rules.length === 0 ? (
                    <p className="text-center py-8 muted">No hay normas disponibles.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--olive-300)" }}>
                        <table className="w-full">
                            <thead style={{ backgroundColor: "var(--olive-100)" }}>
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                                    <th className="px-4 py-3 text-left font-semibold">Categoría</th>
                                    <th className="px-4 py-3 text-left font-semibold">Descripción</th>
                                    <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map((rule) => (
                                    <tr key={rule.id} style={{ borderBottom: "1px solid var(--olive-200)" }}>
                                        <td className="px-4 py-3 font-semibold">{rule.nombre}</td>
                                        <td className="px-4 py-3 text-sm muted">{rule.categoria || "-"}</td>
                                        <td className="px-4 py-3 text-sm">{rule.descripcion}</td>
                                        <td className="px-4 py-3 text-center flex justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(rule)}
                                                className="px-3 py-1 text-sm rounded-md font-semibold transition-colors"
                                                style={{
                                                    backgroundColor: "var(--olive-400)",
                                                    color: "white",
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => rule.id && handleDeleteRule(rule.id)}
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
                title={editingRule ? "Editar Norma" : "Crear Norma"}
                onClose={closeModal}
                onSubmit={editingRule ? handleUpdateRule : handleCreateRule}
                fields={RULE_FIELDS}
                initialData={editingRule || {}}
                submitButtonText={editingRule ? "Actualizar" : "Crear"}
            />
        </AdminGuard>
    );
}
