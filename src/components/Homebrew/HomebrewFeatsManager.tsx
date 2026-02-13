"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Feat,
    createFeat,
    deleteFeat,
    listMyHomebrewFeats,
    updateFeat,
} from "@/api/featsApi";
import { DeleteConfirmationModal } from "@/components/Campaing/DeleteConfirmationModal";

const FEAT_TIPOS = [
    "ARTISTICAS",
    "COOPERATIVAS",
    "AGALLAS",
    "COMBATE",
    "ESTILO",
    "CREACION_DE_OBJETOS",
    "CRITICO",
    "METAMAGICAS",
    "RACIAL",
];

interface FeatFormState {
    name: string;
    descripcion: string;
    benefit: string;
    special: string;
    tipo: string;
}

const emptyFeatForm: FeatFormState = {
    name: "",
    descripcion: "",
    benefit: "",
    special: "",
    tipo: "",
};

const toFeatPayload = (form: FeatFormState, id?: number): Feat => ({
    id,
    name: form.name.trim(),
    code: form.name.trim().toUpperCase().replace(/\s+/g, "_"),
    originalName: form.name.trim(),
    descripcion: form.descripcion.trim(),
    benefit: form.benefit.trim(),
    special: form.special.trim() || undefined,
    source: "homerule",
    tipo: form.tipo ? [form.tipo] : [],
    prereqGroups: [],
});

export default function HomebrewFeatsManager() {
    const [items, setItems] = useState<Feat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFeat, setEditingFeat] = useState<Feat | null>(null);
    const [formState, setFormState] = useState<FeatFormState>(emptyFeatForm);
    const [deleteTarget, setDeleteTarget] = useState<Feat | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const isEditMode = useMemo(() => Boolean(editingFeat), [editingFeat]);

    const loadFeats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listMyHomebrewFeats();
            setItems(data);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Error al cargar dotes"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeats();
    }, []);

    const openCreate = () => {
        setEditingFeat(null);
        setFormState(emptyFeatForm);
        setIsFormOpen(true);
    };

    const openEdit = (feat: Feat) => {
        setEditingFeat(feat);
        setFormState({
            name: feat.name ?? "",
            descripcion: feat.descripcion ?? "",
            benefit: feat.benefit ?? "",
            special: feat.special ?? "",
            tipo: feat.tipo?.[0] ?? "",
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingFeat(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        const payload = toFeatPayload(formState, editingFeat?.id);
        if (!payload.name || !payload.descripcion || !payload.benefit || !formState.tipo) {
            return;
        }
        setLoading(true);
        try {
            if (editingFeat?.id) {
                await updateFeat(editingFeat.id, payload);
                await loadFeats();
            } else {
                await createFeat(payload);
                await loadFeats();
            }
            closeForm();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Error al guardar la dote"
            );
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget?.id) return;
        setIsDeleting(true);
        try {
            await deleteFeat(deleteTarget.id);
            setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Error al eliminar la dote"
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--card)" }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h3 className="sectionTitle mb-1">Dotes Caseras</h3>
                    <p className="text-sm muted">
                        Administra tus dotes creadas para compartir en campanas.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>
                    Crear Dote
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 text-xs underline"
                    >
                        Descartar
                    </button>
                </div>
            )}

            {loading ? (
                <p className="text-sm muted">Cargando dotes...</p>
            ) : items.length === 0 ? (
                <p className="text-sm muted">
                    Aun no tienes dotes caseras creadas.
                </p>
            ) : (
                <ul className="space-y-3">
                    {items.map((feat, index) => (
                        <li
                            key={feat.id ?? `${feat.code}-${feat.name}-${index}`}
                            className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div>
                                    <h4 className="font-bold text-base">{feat.name}</h4>
                                    <p className="text-xs muted">{feat.code}</p>
                                    {feat.originalName && (
                                        <p className="text-xs muted">{feat.originalName}</p>
                                    )}
                                    <p className="text-sm mt-2 whitespace-pre-line">
                                        {feat.descripcion}
                                    </p>
                                    <p className="text-sm mt-2">
                                        <span className="font-semibold">Beneficio:</span> {feat.benefit}
                                    </p>
                                    {feat.tipo?.length ? (
                                        <p className="text-xs mt-2 muted">
                                            {feat.tipo.join(" | ")}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="flex gap-2">
                                    {feat.id && (
                                        <Link
                                            href={`/feats/${feat.id}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            Ver
                                        </Link>
                                    )}
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => openEdit(feat)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => setDeleteTarget(feat)}
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
                            {isEditMode ? "Editar dote" : "Crear dote"}
                        </h4>
                        <div className="modal-form">
                            <div className="modal-field">
                                <label className="font-semibold">Nombre *</label>
                                <input
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    className="modal-input"
                                    placeholder="Ej: Ataque Poderoso"
                                />
                            </div>
                            <div className="modal-field">
                                <label className="font-semibold">Descripcion *</label>
                                <textarea
                                    name="descripcion"
                                    value={formState.descripcion}
                                    onChange={handleChange}
                                    rows={3}
                                    className="modal-input resize-none"
                                    placeholder="Describe brevemente esta dote"
                                />
                            </div>
                            <div className="modal-field">
                                <label className="font-semibold">Beneficio *</label>
                                <textarea
                                    name="benefit"
                                    value={formState.benefit}
                                    onChange={handleChange}
                                    rows={2}
                                    className="modal-input resize-none"
                                    placeholder="¿Qué beneficio otorga?"
                                />
                            </div>
                            <div className="modal-field">
                                <label className="font-semibold">Especial</label>
                                <textarea
                                    name="special"
                                    value={formState.special}
                                    onChange={handleChange}
                                    rows={2}
                                    className="modal-input resize-none"
                                />
                            </div>
                            <div className="modal-field">
                                <label className="font-semibold">Tipos * (selecciona al menos uno)</label>
                                <select
                                    name="tipo"
                                    value={formState.tipo}
                                    onChange={handleChange}
                                    className="modal-input"
                                >
                                    <option value="">-- Selecciona un tipo --</option>
                                    {FEAT_TIPOS.map((tipo) => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={closeForm}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={
                                    !formState.name ||
                                    !formState.descripcion ||
                                    !formState.benefit ||
                                    !formState.tipo
                                }
                            >
                                {isEditMode ? "Guardar" : "Crear"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <DeleteConfirmationModal
                    title="Eliminar dote"
                    message={`Estas seguro de eliminar la dote "${deleteTarget.name}"?`}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                    isLoading={isDeleting}
                />
            )}
        </section>
    );
}
