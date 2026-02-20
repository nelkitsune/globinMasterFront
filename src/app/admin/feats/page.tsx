"use client";

import { useState, useEffect, useMemo } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { adminApi, FeatAdminDTO, handleAdminError } from "@/api/adminApi";
import { getFeats, Feat } from "@/api/featsApi";
import Link from "next/link";

const PREREQ_KINDS = [
    "FEAT",
    "RACE",
    "CLASS",
    "ALIGNMENT",
    "CHAR_LEVEL",
    "CLASS_LEVEL",
    "CASTER_LEVEL",
    "CAN_CAST",
    "KNOWN_SPELL",
    "ABILITY_SCORE",
    "BAB",
    "SKILL_RANKS",
    "SIZE",
    "DEITY",
    "TAG",
] as const;

type PrereqKind = (typeof PREREQ_KINDS)[number];

type PrereqConditionInput = {
    kind: PrereqKind;
    featId?: number | null;
    target?: string;
    intValue?: string;
    featSearch?: string;
};

type PrereqGroupInput = {
    groupIndex: number;
    conditions: PrereqConditionInput[];
};

interface FeatFormInput {
    name: string;
    originalName: string;
    code: string;
    tipo: string;
    descripcion: string;
    benefit: string;
    special: string;
    source: string;
    normal: string;
}

const EMPTY_FORM: FeatFormInput = {
    name: "",
    originalName: "",
    code: "",
    tipo: "",
    descripcion: "",
    benefit: "",
    special: "",
    source: "Core",
    normal: "",
};

const FEAT_TYPE_OPTIONS = ["COMBATE", "GENERAL", "RACIAL", "MAGIA", "METAMAGIA"];
const ABILITY_OPTIONS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
const ALIGNMENT_OPTIONS = ["LG", "NG", "CG", "LN", "N", "CN", "LE", "NE", "CE"];
const SIZE_OPTIONS = ["FINE", "DIMINUTO", "MINUSCULO", "PEQUENO", "MEDIANO", "GRANDE", "ENORME", "GIGANTE", "COLOSAL"];

const createEmptyCondition = (): PrereqConditionInput => ({
    kind: "FEAT",
    featId: null,
    target: "",
    intValue: "",
    featSearch: "",
});

const createEmptyGroup = (groupIndex: number): PrereqGroupInput => ({
    groupIndex,
    conditions: [createEmptyCondition()],
});

const needsIntValue = (kind: PrereqKind) => ["CHAR_LEVEL", "CLASS_LEVEL", "CASTER_LEVEL", "BAB", "ABILITY_SCORE", "SKILL_RANKS", "CAN_CAST"].includes(kind);
const needsTarget = (kind: PrereqKind) => ["RACE", "CLASS", "ALIGNMENT", "KNOWN_SPELL", "SIZE", "DEITY", "TAG", "ABILITY_SCORE", "SKILL_RANKS"].includes(kind);

export default function AdminFeatsPage() {
    const [feats, setFeats] = useState<Feat[]>([]);
    const [featOptions, setFeatOptions] = useState<Feat[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingFeat, setEditingFeat] = useState<Feat | null>(null);
    const [formData, setFormData] = useState<FeatFormInput>(EMPTY_FORM);
    const [prereqGroups, setPrereqGroups] = useState<PrereqGroupInput[]>([createEmptyGroup(0)]);

    const PAGE_SIZE = 10;
    const availableFeats = useMemo(() => {
        return featOptions.length > 0 ? featOptions : feats;
    }, [featOptions, feats]);

    const loadFeats = async (page: number) => {
        try {
            setLoading(true);
            const response = await getFeats(page, PAGE_SIZE);
            setFeats(response.content);
            setTotalPages(response.totalPages);
            setCurrentPage(page);
        } catch (err) {
            setError(handleAdminError(err));
        } finally {
            setLoading(false);
        }
    };

    const loadFeatOptions = async () => {
        try {
            const collected: Feat[] = [];
            let page = 0;
            let lastPage = false;

            while (!lastPage && page < 6) {
                const response = await getFeats(page, 100);
                collected.push(...response.content);
                lastPage = response.last;
                page += 1;
            }

            const deduped = Array.from(new Map(collected.map((feat) => [feat.id, feat])).values())
                .filter((feat) => feat.id)
                .sort((a, b) => a.name.localeCompare(b.name));

            setFeatOptions(deduped);
        } catch (err) {
            console.error("[loadFeatOptions] Error cargando dotes:", err);
            setFeatOptions([]);
        }
    };

    useEffect(() => {
        loadFeats(0);
        loadFeatOptions();
    }, []);

    const setConditionAt = (groupIndex: number, conditionIndex: number, updater: (prev: PrereqConditionInput) => PrereqConditionInput) => {
        setPrereqGroups((prev) =>
            prev.map((group) => {
                if (group.groupIndex !== groupIndex) return group;
                return {
                    ...group,
                    conditions: group.conditions.map((condition, index) =>
                        index === conditionIndex ? updater(condition) : condition
                    ),
                };
            })
        );
    };

    const addGroup = () => {
        setPrereqGroups((prev) => [...prev, createEmptyGroup(prev.length)]);
    };

    const removeGroup = (groupIndex: number) => {
        setPrereqGroups((prev) => {
            const filtered = prev.filter((group) => group.groupIndex !== groupIndex);
            if (filtered.length === 0) return [createEmptyGroup(0)];
            return filtered.map((group, index) => ({ ...group, groupIndex: index }));
        });
    };

    const addCondition = (groupIndex: number) => {
        setPrereqGroups((prev) =>
            prev.map((group) =>
                group.groupIndex === groupIndex
                    ? { ...group, conditions: [...group.conditions, createEmptyCondition()] }
                    : group
            )
        );
    };

    const removeCondition = (groupIndex: number, conditionIndex: number) => {
        setPrereqGroups((prev) =>
            prev.map((group) => {
                if (group.groupIndex !== groupIndex) return group;
                const nextConditions = group.conditions.filter((_, index) => index !== conditionIndex);
                return {
                    ...group,
                    conditions: nextConditions.length > 0 ? nextConditions : [createEmptyCondition()],
                };
            })
        );
    };

    const buildPrereqGroupsPayload = () => {
        return prereqGroups
            .map((group, groupIndex) => {
                const conditions = group.conditions
                    .map((condition, conditionIndex) => {
                        const trimmedTarget = (condition.target || "").trim();
                        const parsedInt = condition.intValue !== undefined && condition.intValue !== ""
                            ? Number(condition.intValue)
                            : undefined;

                        if (condition.kind === "FEAT") {
                            if (!condition.featId) {
                                throw new Error(`Selecciona una dote en grupo ${groupIndex + 1}, condición ${conditionIndex + 1}.`);
                            }
                            return { kind: condition.kind, featId: condition.featId };
                        }

                        if (condition.kind === "CAN_CAST") {
                            return { kind: condition.kind, intValue: parsedInt === 1 ? 1 : 0 };
                        }

                        if (needsTarget(condition.kind) && !trimmedTarget) {
                            throw new Error(`Falta target en grupo ${groupIndex + 1}, condición ${conditionIndex + 1}.`);
                        }

                        if (needsIntValue(condition.kind) && (parsedInt === undefined || Number.isNaN(parsedInt))) {
                            throw new Error(`Falta intValue válido en grupo ${groupIndex + 1}, condición ${conditionIndex + 1}.`);
                        }

                        return {
                            kind: condition.kind,
                            ...(trimmedTarget ? { target: trimmedTarget } : {}),
                            ...(parsedInt !== undefined && !Number.isNaN(parsedInt) ? { intValue: parsedInt } : {}),
                        };
                    });

                return {
                    groupIndex,
                    conditions,
                };
            })
            .filter((group) => group.conditions.length > 0);
    };

    const buildPayload = (official: boolean): FeatAdminDTO => {
        return {
            name: formData.name.trim(),
            originalName: formData.originalName.trim() || formData.name.trim(),
            code: formData.code.trim(),
            descripcion: formData.descripcion.trim(),
            benefit: formData.benefit.trim(),
            special: formData.special.trim() || undefined,
            source: formData.source.trim() || "Core",
            tipo: formData.tipo ? [formData.tipo] : [],
            normal: formData.normal.trim() || undefined,
            official,
            prereqGroups: buildPrereqGroupsPayload(),
        };
    };

    const handleCreateFeat = async () => {
        try {
            const payload = buildPayload(true);

            await adminApi.createFeat(payload);
            await loadFeats(0);
            setShowModal(false);
            setModalError(null);
        } catch (err) {
            if (err instanceof Error && !((err as any)?.response)) {
                throw err;
            }
            throw new Error(handleAdminError(err));
        }
    };

    const handleUpdateFeat = async () => {
        if (!editingFeat?.id) return;
        try {
            const updatePayload = buildPayload(false);

            await adminApi.updateFeat(editingFeat.id, updatePayload);
            await loadFeats(currentPage);
            setEditingFeat(null);
            setShowModal(false);
            setModalError(null);
        } catch (err) {
            if (err instanceof Error && !((err as any)?.response)) {
                throw err;
            }
            throw new Error(handleAdminError(err));
        }
    };

    const handleSubmitModal = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError(null);

        if (!formData.name.trim() || !formData.code.trim() || !formData.tipo || !formData.descripcion.trim() || !formData.benefit.trim()) {
            setModalError("Completa los campos obligatorios del formulario.");
            return;
        }

        setSubmitting(true);
        try {
            if (editingFeat) {
                await handleUpdateFeat();
            } else {
                await handleCreateFeat();
            }
        } catch (err: any) {
            setModalError(err?.message || "No se pudo guardar la dote.");
        } finally {
            setSubmitting(false);
        }
    };

    const mapFlattenedToSingleGroup = (feat: Feat): PrereqGroupInput[] => {
        const flattened = feat.prereqGroups || [];
        if (!flattened.length) {
            return [createEmptyGroup(0)];
        }

        return [{
            groupIndex: 0,
            conditions: flattened.map((item) => ({
                kind: (item.tipo as PrereqKind) || "TAG",
                featId: item.featId || null,
                target: item.atributo || item.nombre || "",
                intValue: item.valor !== undefined ? String(item.valor) : "",
                featSearch: item.nombre || "",
            })),
        }];
    };

    const handleDeleteFeat = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta dote?")) return;
        try {
            await adminApi.deleteFeat(id);
            await loadFeats(currentPage);
        } catch (err) {
            setError(handleAdminError(err));
        }
    };

    const openCreateModal = () => {
        setEditingFeat(null);
        setFormData(EMPTY_FORM);
        setPrereqGroups([createEmptyGroup(0)]);
        setModalError(null);
        setShowModal(true);
    };

    const openEditModal = (feat: Feat) => {
        setEditingFeat(feat);
        setFormData({
            name: feat.name || "",
            originalName: feat.originalName || feat.name || "",
            code: feat.code || "",
            tipo: Array.isArray(feat.tipo) ? feat.tipo[0] || "" : "",
            descripcion: feat.descripcion || "",
            benefit: feat.benefit || "",
            special: feat.special || "",
            source: feat.source || "Core",
            normal: feat.normal || "",
        });
        setPrereqGroups(mapFlattenedToSingleGroup(feat));
        setModalError(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingFeat(null);
        setModalError(null);
    };

    return (
        <AdminGuard>
            <div className="container">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="brand text-4xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                            Gestionar Dotes
                        </h1>
                        <p className="muted text-lg">CRUD de dotes disponibles</p>
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
                            + Crear Dote
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-center py-8">Cargando dotes...</p>
                ) : feats.length === 0 ? (
                    <p className="text-center py-8 muted">No hay dotes disponibles.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--olive-300)" }}>
                            <table className="w-full">
                                <thead style={{ backgroundColor: "var(--olive-100)" }}>
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                                        <th className="px-4 py-3 text-left font-semibold">Código</th>
                                        <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                                        <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feats.map((feat) => (
                                        <tr key={feat.id} style={{ borderBottom: "1px solid var(--olive-200)" }}>
                                            <td className="px-4 py-3 font-semibold">{feat.name}</td>
                                            <td className="px-4 py-3 text-sm muted">{feat.code}</td>
                                            <td className="px-4 py-3 text-sm">{Array.isArray(feat.tipo) ? feat.tipo.join(", ") : feat.tipo}</td>
                                            <td className="px-4 py-3 text-center flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(feat)}
                                                    className="px-3 py-1 text-sm rounded-md font-semibold transition-colors"
                                                    style={{
                                                        backgroundColor: "var(--olive-400)",
                                                        color: "white",
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => feat.id && handleDeleteFeat(feat.id)}
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

                        {/* Paginación */}
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => loadFeats(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="px-4 py-2 rounded-md font-semibold disabled:opacity-50"
                                style={{
                                    backgroundColor: currentPage === 0 ? "var(--olive-200)" : "var(--olive-600)",
                                    color: currentPage === 0 ? "var(--olive-700)" : "white",
                                }}
                            >
                                ← Anterior
                            </button>
                            <span className="muted">
                                Página {currentPage + 1} de {totalPages}
                            </span>
                            <button
                                onClick={() => loadFeats(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="px-4 py-2 rounded-md font-semibold disabled:opacity-50"
                                style={{
                                    backgroundColor: currentPage >= totalPages - 1 ? "var(--olive-200)" : "var(--olive-600)",
                                    color: currentPage >= totalPages - 1 ? "var(--olive-700)" : "white",
                                }}
                            >
                                Siguiente →
                            </button>
                        </div>
                    </>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 p-4 overflow-y-auto" onClick={closeModal}>
                    <div
                        className="w-full max-w-5xl rounded-2xl p-6 shadow-2xl my-auto mx-auto max-h-[calc(100dvh-2rem)] overflow-y-auto"
                        style={{ backgroundColor: "var(--card)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--olive-900)" }}>
                            {editingFeat ? "Editar Dote" : "Crear Dote"}
                        </h2>

                        {modalError && (
                            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleSubmitModal} className="space-y-5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                        Nombre*
                                    </label>
                                    <input
                                        value={formData.name}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-2 rounded-md border"
                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                        placeholder="Ej: Ataque Especial"
                                    />

                                    <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                        Original Name*
                                    </label>
                                    <input
                                        value={formData.originalName}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, originalName: e.target.value }))}
                                        className="w-full p-2 rounded-md border"
                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                        placeholder="Ej: Power Attack"
                                    />

                                    <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                        Código*
                                    </label>
                                    <input
                                        value={formData.code}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                                        className="w-full p-2 rounded-md border"
                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                        placeholder="Ej: SPECIAL_ATK"
                                    />

                                    <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                        Tipo*
                                    </label>
                                    <select
                                        value={formData.tipo}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, tipo: e.target.value }))}
                                        className="w-full p-2 rounded-md border"
                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                    >
                                        <option value="">-- Selecciona --</option>
                                        {FEAT_TYPE_OPTIONS.map((tipo) => (
                                            <option key={tipo} value={tipo}>{tipo}</option>
                                        ))}
                                    </select>

                                    <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                        Fuente*
                                    </label>
                                    <input
                                        value={formData.source}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
                                        className="w-full p-2 rounded-md border"
                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                        placeholder="Core"
                                    />

                                    <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                        Descripción*
                                    </label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                                        rows={4}
                                        className="w-full p-2 rounded-md border"
                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                        placeholder="Descripción breve..."
                                    />

                                    <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                        Beneficio*
                                    </label>
                                    <textarea
                                        value={formData.benefit}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, benefit: e.target.value }))}
                                        rows={4}
                                        className="w-full p-2 rounded-md border"
                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                        placeholder="¿Qué ganas con esta dote?"
                                    />

                                    <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                        Especial
                                    </label>
                                    <textarea
                                        value={formData.special}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, special: e.target.value }))}
                                        rows={3}
                                        className="w-full p-2 rounded-md border"
                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                        placeholder="(Opcional) notas especiales"
                                    />

                                    <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                        Normal (texto opcional)
                                    </label>
                                    <textarea
                                        value={formData.normal}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, normal: e.target.value }))}
                                        rows={4}
                                        className="w-full p-2 rounded-md border"
                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                        placeholder="Texto largo opcional..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold" style={{ color: "var(--olive-900)" }}>Pre requisitos</h3>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={addGroup}
                                        >
                                            + Grupo OR
                                        </button>
                                    </div>

                                    <p className="text-sm muted">Condiciones del mismo grupo = AND. Grupos distintos = OR.</p>

                                    {prereqGroups.map((group) => (
                                        <div key={group.groupIndex} className="rounded-lg border p-3 space-y-3" style={{ borderColor: "var(--olive-300)", backgroundColor: "var(--olive-100)" }}>
                                            <div className="flex items-center justify-between">
                                                <strong>Grupo OR #{group.groupIndex + 1}</strong>
                                                <div className="flex gap-2">
                                                    <button type="button" className="btn btn-outline btn-sm" onClick={() => addCondition(group.groupIndex)}>+ Condición</button>
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeGroup(group.groupIndex)}>Eliminar grupo</button>
                                                </div>
                                            </div>

                                            {group.conditions.map((condition, conditionIndex) => {
                                                const query = (condition.featSearch || "").trim().toLowerCase();
                                                const filteredFeats = availableFeats
                                                    .filter((feat) => {
                                                        if (!query) return true;
                                                        return feat.name.toLowerCase().includes(query) || feat.code.toLowerCase().includes(query);
                                                    })
                                                    .slice(0, 50);

                                                return (
                                                    <div key={`${group.groupIndex}-${conditionIndex}`} className="rounded-md border p-3 space-y-2" style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff" }}>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold">Condición #{conditionIndex + 1}</span>
                                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCondition(group.groupIndex, conditionIndex)}>Quitar</button>
                                                        </div>

                                                        <label className="text-sm font-semibold">Tipo (kind)</label>
                                                        <select
                                                            value={condition.kind}
                                                            onChange={(e) => {
                                                                const nextKind = e.target.value as PrereqKind;
                                                                setConditionAt(group.groupIndex, conditionIndex, () => ({
                                                                    kind: nextKind,
                                                                    featId: null,
                                                                    target: "",
                                                                    intValue: nextKind === "CAN_CAST" ? "1" : "",
                                                                    featSearch: "",
                                                                }));
                                                            }}
                                                            className="w-full p-2 rounded-md border"
                                                            style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                        >
                                                            {PREREQ_KINDS.map((kind) => (
                                                                <option key={kind} value={kind}>{kind}</option>
                                                            ))}
                                                        </select>

                                                        {condition.kind === "FEAT" && (
                                                            <>
                                                                <label className="text-sm font-semibold">Buscar dote</label>
                                                                <input
                                                                    value={condition.featSearch || ""}
                                                                    onChange={(e) => setConditionAt(group.groupIndex, conditionIndex, (prev) => ({ ...prev, featSearch: e.target.value }))}
                                                                    className="w-full p-2 rounded-md border"
                                                                    style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                                    placeholder="Escribe nombre o código"
                                                                />
                                                                <label className="text-sm font-semibold">Dote requerida</label>
                                                                <select
                                                                    value={condition.featId || ""}
                                                                    onChange={(e) => setConditionAt(group.groupIndex, conditionIndex, (prev) => ({
                                                                        ...prev,
                                                                        featId: e.target.value ? Number(e.target.value) : null,
                                                                    }))}
                                                                    className="w-full p-2 rounded-md border"
                                                                    style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                                >
                                                                    <option value="">-- Selecciona dote --</option>
                                                                    {filteredFeats.map((feat) => (
                                                                        <option key={feat.id} value={feat.id}>{feat.name} ({feat.code})</option>
                                                                    ))}
                                                                </select>
                                                            </>
                                                        )}

                                                        {condition.kind === "ABILITY_SCORE" && (
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <label className="text-sm font-semibold">Característica</label>
                                                                    <select
                                                                        value={condition.target || ""}
                                                                        onChange={(e) => setConditionAt(group.groupIndex, conditionIndex, (prev) => ({ ...prev, target: e.target.value }))}
                                                                        className="w-full p-2 rounded-md border"
                                                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                                    >
                                                                        <option value="">-- Selecciona --</option>
                                                                        {ABILITY_OPTIONS.map((ability) => <option key={ability} value={ability}>{ability}</option>)}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="text-sm font-semibold">Valor mínimo</label>
                                                                    <input
                                                                        type="number"
                                                                        value={condition.intValue || ""}
                                                                        onChange={(e) => setConditionAt(group.groupIndex, conditionIndex, (prev) => ({ ...prev, intValue: e.target.value }))}
                                                                        className="w-full p-2 rounded-md border"
                                                                        style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {condition.kind === "ALIGNMENT" && (
                                                            <>
                                                                <label className="text-sm font-semibold">Alineamiento</label>
                                                                <select
                                                                    value={condition.target || ""}
                                                                    onChange={(e) => setConditionAt(group.groupIndex, conditionIndex, (prev) => ({ ...prev, target: e.target.value }))}
                                                                    className="w-full p-2 rounded-md border"
                                                                    style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                                >
                                                                    <option value="">-- Selecciona --</option>
                                                                    {ALIGNMENT_OPTIONS.map((alignment) => <option key={alignment} value={alignment}>{alignment}</option>)}
                                                                </select>
                                                            </>
                                                        )}

                                                        {condition.kind === "SIZE" && (
                                                            <>
                                                                <label className="text-sm font-semibold">Tamaño</label>
                                                                <select
                                                                    value={condition.target || ""}
                                                                    onChange={(e) => setConditionAt(group.groupIndex, conditionIndex, (prev) => ({ ...prev, target: e.target.value }))}
                                                                    className="w-full p-2 rounded-md border"
                                                                    style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                                >
                                                                    <option value="">-- Selecciona --</option>
                                                                    {SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}
                                                                </select>
                                                            </>
                                                        )}

                                                        {condition.kind === "CAN_CAST" && (
                                                            <>
                                                                <label className="text-sm font-semibold">¿Puede lanzar conjuros?</label>
                                                                <select
                                                                    value={condition.intValue || "1"}
                                                                    onChange={(e) => setConditionAt(group.groupIndex, conditionIndex, (prev) => ({ ...prev, intValue: e.target.value }))}
                                                                    className="w-full p-2 rounded-md border"
                                                                    style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                                >
                                                                    <option value="1">Sí</option>
                                                                    <option value="0">No</option>
                                                                </select>
                                                            </>
                                                        )}

                                                        {needsTarget(condition.kind) && !["ABILITY_SCORE", "ALIGNMENT", "SIZE"].includes(condition.kind) && (
                                                            <>
                                                                <label className="text-sm font-semibold">Target</label>
                                                                <input
                                                                    value={condition.target || ""}
                                                                    onChange={(e) => setConditionAt(group.groupIndex, conditionIndex, (prev) => ({ ...prev, target: e.target.value }))}
                                                                    className="w-full p-2 rounded-md border"
                                                                    style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                                    placeholder="Ej: Fighter, Human, Acrobatics..."
                                                                />
                                                            </>
                                                        )}

                                                        {needsIntValue(condition.kind) && !["ABILITY_SCORE", "CAN_CAST"].includes(condition.kind) && (
                                                            <>
                                                                <label className="text-sm font-semibold">intValue</label>
                                                                <input
                                                                    type="number"
                                                                    value={condition.intValue || ""}
                                                                    onChange={(e) => setConditionAt(group.groupIndex, conditionIndex, (prev) => ({ ...prev, intValue: e.target.value }))}
                                                                    className="w-full p-2 rounded-md border"
                                                                    style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                                    placeholder="Ej: 5"
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2 rounded-md font-semibold transition-opacity disabled:opacity-50"
                                    style={{ backgroundColor: "var(--olive-600)", color: "white" }}
                                >
                                    {submitting ? "Guardando..." : editingFeat ? "Actualizar" : "Crear"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="flex-1 py-2 rounded-md font-semibold border"
                                    style={{ borderColor: "var(--olive-300)", color: "var(--olive-700)" }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminGuard>
    );
}
