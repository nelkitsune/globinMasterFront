"use client";

import { useState, useEffect, useMemo } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { adminApi, FeatAdminDTO, handleAdminError } from "@/api/adminApi";
import { getFeats, Feat } from "@/api/featsApi";
import AdminSectionHeader from "@/components/Admin/AdminSectionHeader";
import AdminErrorBanner from "@/components/Admin/AdminErrorBanner";
import FeatsTable from "@/components/Admin/feats/FeatsTable";
import FeatsPagination from "@/components/Admin/feats/FeatsPagination";
import FeatFormModal from "@/components/Admin/feats/FeatFormModal";
import {
    EMPTY_FORM,
    FeatFormInput,
    PrereqConditionInput,
    PrereqGroupInput,
    PrereqKind,
    createEmptyCondition,
    createEmptyGroup,
    isEmptyCondition,
    mapFlattenedToSingleGroup,
    needsIntValue,
    needsTarget,
} from "@/components/Admin/feats/featFormTypes";

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
                    .filter((condition) => !isEmptyCondition(condition))
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
                <AdminSectionHeader
                    title="Gestionar Dotes"
                    subtitle="CRUD de dotes disponibles"
                    backHref="/admin"
                    createLabel="+ Crear Dote"
                    onCreate={openCreateModal}
                />

                {error && (
                    <AdminErrorBanner message={error} />
                )}

                {loading ? (
                    <p className="text-center py-8">Cargando dotes...</p>
                ) : feats.length === 0 ? (
                    <p className="text-center py-8 muted">No hay dotes disponibles.</p>
                ) : (
                    <>
                        <FeatsTable
                            feats={feats}
                            onEdit={openEditModal}
                            onDelete={handleDeleteFeat}
                        />
                        <FeatsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrevious={() => loadFeats(currentPage - 1)}
                            onNext={() => loadFeats(currentPage + 1)}
                        />
                    </>
                )}
            </div>

            <FeatFormModal
                isOpen={showModal}
                editingFeat={editingFeat}
                modalError={modalError}
                submitting={submitting}
                formData={formData}
                prereqGroups={prereqGroups}
                availableFeats={availableFeats}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
                onAddGroup={addGroup}
                onRemoveGroup={removeGroup}
                onAddCondition={addCondition}
                onRemoveCondition={removeCondition}
                onSetConditionAt={setConditionAt}
                onSetFormData={setFormData}
            />
        </AdminGuard>
    );
}
