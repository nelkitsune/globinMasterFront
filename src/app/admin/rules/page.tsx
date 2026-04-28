"use client";

import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { FormModal, FormField } from "@/components/FormModal";
import { adminApi, RuleAdminDTO, handleAdminError } from "@/api/adminApi";
import AdminSectionHeader from "@/components/Admin/AdminSectionHeader";
import AdminErrorBanner from "@/components/Admin/AdminErrorBanner";
import RulesTable from "@/components/Admin/rules/RulesTable";

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
        name: "nombreOriginal",
        label: "Nombre Original",
        type: "text",
        placeholder: "Ej: Critical Hit Rule (opcional)",
        maxLength: 200,
    },
    {
        name: "categoria",
        label: "Categoría / Libros",
        type: "text",
        placeholder: "Ej: Core, Advanced Player's Guide",
        maxLength: 200,
    },
    {
        name: "descripcion",
        label: "Descripción",
        type: "textarea",
        required: true,
        placeholder: "Descripción de la regla...",
    },
    {
        name: "contenido",
        label: "Páginas",
        type: "text",
        placeholder: "Ej: 5-6, 120-125",
        maxLength: 100,
    },
];

interface Rule {
    id?: number;
    nombre: string;
    nombreOriginal?: string;
    categoria?: string;
    descripcion: string;
    contenido?: string;
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
            const { listRules } = await import("@/api/rulesApi");
            const data = await listRules(true); // true = solo oficiales
            // Mapear del formato backend al formato del componente
            const mappedRules = data.map((rule: any) => ({
                id: rule.id,
                nombre: rule.name,
                nombreOriginal: rule.originalName,
                categoria: rule.books || rule.categoria || undefined,
                descripcion: rule.description || rule.descripcion,
                contenido: rule.pages || rule.contenido || undefined,
            }));
            setRules(mappedRules);
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
                <AdminSectionHeader
                    title="Gestionar Normas"
                    subtitle="CRUD de reglas personalizadas"
                    backHref="/admin"
                    createLabel="+ Crear Norma"
                    onCreate={openCreateModal}
                />

                {error && (
                    <AdminErrorBanner message={error} />
                )}

                {loading ? (
                    <p className="text-center py-8">Cargando normas...</p>
                ) : rules.length === 0 ? (
                    <p className="text-center py-8 muted">No hay normas disponibles.</p>
                ) : (
                    <RulesTable
                        rules={rules}
                        onEdit={openEditModal}
                        onDelete={handleDeleteRule}
                    />
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
