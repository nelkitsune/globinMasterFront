"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRulesStore } from "@/store/useRulesStore";
import { RuleCreateRequest, RuleResponse } from "@/types/rules";
import { DeleteConfirmationModal } from "@/components/Campaing/DeleteConfirmationModal";

const emptyRuleForm: RuleCreateRequest = {
    name: "",
    originalName: "",
    description: "",
    pages: "",
    books: "",
};

const normalizeRuleForm = (form: RuleCreateRequest): RuleCreateRequest => {
    const trimmedName = form.name.trim();
    return {
        name: trimmedName,
        originalName: trimmedName ? `${trimmedName} homerule` : null,
        description: form.description.trim(),
        pages: null,
        books: null,
    };
};

export default function HomebrewRulesManager() {
    const {
        items,
        loading,
        error,
        fetchMine,
        create,
        update,
        remove,
        clearError,
    } = useRulesStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<RuleResponse | null>(null);
    const [formState, setFormState] = useState<RuleCreateRequest>(emptyRuleForm);
    const [deleteTarget, setDeleteTarget] = useState<RuleResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchMine();
    }, []);

    const isEditMode = useMemo(() => Boolean(editingRule), [editingRule]);

    const openCreate = () => {
        setEditingRule(null);
        setFormState(emptyRuleForm);
        setIsFormOpen(true);
    };

    const openEdit = (rule: RuleResponse) => {
        setEditingRule(rule);
        setFormState({
            name: rule.name ?? "",
            originalName: rule.originalName ?? "",
            description: rule.description ?? "",
            pages: rule.pages ?? "",
            books: rule.books ?? "",
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingRule(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        const payload = normalizeRuleForm(formState);
        if (!payload.name || !payload.description) return;

        if (editingRule) {
            await update(editingRule.id, payload);
        } else {
            await create(payload);
        }
        closeForm();
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        await remove(deleteTarget.id);
        setIsDeleting(false);
        setDeleteTarget(null);
    };

    return (
        <section
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--card)" }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h3 className="sectionTitle mb-1">Reglas Caseras</h3>
                    <p className="text-sm muted">
                        Crea y edita tus reglas personalizadas.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>
                    Crear Regla
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                    <button
                        onClick={clearError}
                        className="ml-2 text-xs underline"
                    >
                        Descartar
                    </button>
                </div>
            )}

            {loading ? (
                <p className="text-sm muted">Cargando reglas...</p>
            ) : items.length === 0 ? (
                <p className="text-sm muted">
                    Aun no tienes reglas caseras creadas.
                </p>
            ) : (
                <ul className="space-y-3">
                    {items.map((rule) => (
                        <li
                            key={rule.id}
                            className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div>
                                    <h4 className="font-bold text-base">{rule.name}</h4>
                                    {rule.originalName && (
                                        <p className="text-xs muted">{rule.originalName}</p>
                                    )}
                                    <p className="text-sm mt-2 whitespace-pre-line">
                                        {rule.description}
                                    </p>
                                    {(rule.pages || rule.books) && (
                                        <p className="text-xs mt-2 muted">
                                            {[rule.pages, rule.books]
                                                .filter(Boolean)
                                                .join(" | ")}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/rules/${rule.id}`}
                                        className="btn btn-outline btn-sm"
                                    >
                                        Ver
                                    </Link>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => openEdit(rule)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => setDeleteTarget(rule)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isFormOpen && (
                <div className="modal-overlay" onClick={closeForm}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h4 className="text-lg font-bold mb-3">
                            {isEditMode ? "Editar regla" : "Crear regla"}
                        </h4>
                        <div className="modal-form">
                            <div className="modal-field">
                                <label className="font-semibold">Nombre</label>
                                <input
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    className="modal-input"
                                />
                            </div>
                            <div className="modal-field">
                                <label className="font-semibold">Descripcion</label>
                                <textarea
                                    name="description"
                                    value={formState.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="modal-input resize-none"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={closeForm}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={!formState.name || !formState.description}
                            >
                                {isEditMode ? "Guardar" : "Crear"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <DeleteConfirmationModal
                    title="Eliminar regla"
                    message={`Estas seguro de eliminar la regla "${deleteTarget.name}"?`}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                    isLoading={isDeleting}
                />
            )}
        </section>
    );
}
