"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { DeleteConfirmationModal } from "@/components/Campaing/DeleteConfirmationModal";
import AdminSectionHeader from "@/components/Admin/AdminSectionHeader";
import AdminErrorBanner from "@/components/Admin/AdminErrorBanner";
import SpellsTable from "@/components/Admin/spells/SpellsTable";
import SpellFormModal from "@/components/Admin/spells/SpellFormModal";
import { ClassLevel, SpellFormState, emptySpellForm } from "@/components/Admin/spells/spellFormTypes";
import {
    Spell,
    SpellClass,
    SpellSubschool,
    createSpell,
    deleteSpell,
    getSpells,
    updateSpell,
    getSpellClasses,
    getSpellSchools,
    SpellSchool,
} from "@/api/spellsApi";

const toSpellPayload = (form: SpellFormState, id?: number): Spell => {
    const subschoolId = form.subschoolId ? Number(form.subschoolId) : null;
    const payload: any = {
        id,
        name: form.name.trim(),
        originalName: form.originalName.trim() || form.name.trim(),
        schoolCode: form.schoolCode,
        subschoolId: Number.isFinite(subschoolId) ? subschoolId : null,
        castingTime: form.castingTime.trim(),
        rangeText: form.rangeText.trim(),
        durationText: form.durationText.trim(),
        savingThrow: form.savingThrow ? form.savingThrowType : undefined,
        spellResistance: form.spellResistance,
        componentsV: form.componentsV,
        componentsS: form.componentsS,
        componentsM: form.componentsM,
        componentsF: form.componentsF,
        componentsDf: form.componentsDf,
        description: form.description.trim(),
        classLevels: Object.fromEntries(form.classLevels.map(cl => [cl.classCode, cl.level])),
        // NO incluir ownerUserId - dejar que el backend lo maneje
    };

    // Agregar campos opcionales solo si tienen valor
    if (form.areaText?.trim()) payload.areaText = form.areaText.trim();
    if (form.target?.trim()) payload.target = form.target.trim();
    if (form.materialDesc?.trim()) payload.materialDesc = form.materialDesc.trim();
    if (form.focusDesc?.trim()) payload.focusDesc = form.focusDesc.trim();
    if (form.divineFocusDesc?.trim()) payload.divineFocusDesc = form.divineFocusDesc.trim();
    if (form.summary?.trim()) payload.summary = form.summary.trim();
    if (form.source?.trim()) payload.source = form.source.trim();

    return payload;
}


export default function AdminSpellsPage() {
    const [items, setItems] = useState<Spell[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSpell, setEditingSpell] = useState<Spell | null>(null);
    const [formState, setFormState] = useState<SpellFormState>(emptySpellForm);
    const [deleteTarget, setDeleteTarget] = useState<Spell | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [spellClasses, setSpellClasses] = useState<SpellClass[]>([]);

    const [spellSchools, setSpellSchools] = useState<SpellSchool[]>([]);

    const availableSubschools = useMemo<SpellSubschool[]>(() => {
        if (!formState.schoolCode) return [];
        const selectedSchool = spellSchools.find((school) => school.code === formState.schoolCode);
        return selectedSchool?.subschools || [];
    }, [spellSchools, formState.schoolCode]);

    const loadSpells = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSpells(true);
            setItems(data);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Error al cargar conjuros"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSpells();
        loadSpellClasses();
        loadSpellSchools();
    }, []);

    const loadSpellClasses = async () => {
        try {
            const data = await getSpellClasses();
            setSpellClasses(data);
        } catch (err: any) {
            console.error("Error cargando lanzadores:", err);
        }
    };

    const loadSpellSchools = async () => {
        try {
            const data = await getSpellSchools();
            setSpellSchools(data || []);
        } catch (err: any) {
            console.error("Error cargando escuelas de magia:", err);
            setSpellSchools([]);
        }
    };

    const openCreate = () => {
        setEditingSpell(null);
        setFormState(emptySpellForm);
        setIsFormOpen(true);
    };

    const openEdit = (spell: Spell) => {
        setEditingSpell(spell);

        // Convertir classLevels del objeto mapa a array
        const classLevelsArray = spell.classLevels
            ? Object.entries(spell.classLevels).map(([classCode, level]) => ({
                classCode,
                level: typeof level === 'number' ? level : parseInt(String(level), 10),
            }))
            : [];

        setFormState({
            name: spell.name ?? "",
            originalName: spell.originalName ?? "",
            castingTime: spell.tiempoIncantacion || spell.castingTime || "",
            rangeText: spell.rango || spell.rangeText || "",
            areaText: spell.area || spell.areaText || "",
            durationText: spell.duracion || spell.durationText || "",
            schoolCode: spell.schoolCode || spell.escuela || "",
            subschoolId: spell.subschoolId ? String(spell.subschoolId) : "",
            target: spell.objetivo || spell.target || "",
            savingThrow: Boolean(spell.salvacion || spell.savingThrow),
            savingThrowType: spell.salvacion || spell.savingThrow || "",
            spellResistance: typeof spell.resistenciaConjuros === 'string'
                ? spell.resistenciaConjuros === 'Sí' || spell.resistenciaConjuros === 'Si' || spell.resistenciaConjuros === 'Yes'
                : Boolean(spell.spellResistance || spell.resistenciaConjuros),
            componentsV: Boolean(spell.componentsV),
            componentsS: Boolean(spell.componentsS),
            componentsM: Boolean(spell.componentsM),
            componentsF: Boolean(spell.componentsF),
            componentsDf: Boolean(spell.componentsDf),
            materialDesc: spell.materialDesc ?? "",
            focusDesc: spell.focusDesc ?? "",
            divineFocusDesc: spell.divineFocusDesc ?? "",
            source: spell.source ?? "",
            description: spell.description ?? "",
            summary: spell.summary ?? "",
            classLevels: classLevelsArray,
            selectedClassCode: "",
            selectedLevel: "",
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingSpell(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => {
            if (name === "schoolCode") {
                return { ...prev, schoolCode: value, subschoolId: "" };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormState((prev) => ({ ...prev, [name]: checked }));
    };

    const addClassLevel = () => {
        if (!formState.selectedClassCode || !formState.selectedLevel) {
            return;
        }
        const level = parseInt(formState.selectedLevel, 10);
        if (isNaN(level) || level < 0 || level > 9) {
            return;
        }
        if (formState.classLevels.some(cl => cl.classCode === formState.selectedClassCode)) {
            return;
        }
        setFormState((prev) => ({
            ...prev,
            classLevels: [...prev.classLevels, { classCode: formState.selectedClassCode, level }],
            selectedClassCode: "",
            selectedLevel: "",
        }));
    };

    const removeClassLevel = (classCode: string) => {
        setFormState((prev) => ({
            ...prev,
            classLevels: prev.classLevels.filter(cl => cl.classCode !== classCode),
        }));
    };

    const handleSubmit = async () => {
        const payload = toSpellPayload(formState, editingSpell?.id);

        if (
            !payload.name ||
            !payload.schoolCode ||
            !payload.castingTime ||
            !payload.rangeText ||
            !payload.durationText ||
            !payload.description ||
            (formState.savingThrow && !formState.savingThrowType) ||
            formState.classLevels.length === 0
        ) {
            setError("Por favor completa todos los campos requeridos");
            return;
        }
        setLoading(true);
        try {
            if (editingSpell?.id) {
                await updateSpell(editingSpell.id, payload);
                await loadSpells();
            } else {
                await createSpell(payload);
                await loadSpells();
            }
            closeForm();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Error al guardar el conjuro"
            );
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget?.id) return;
        setIsDeleting(true);
        try {
            await deleteSpell(deleteTarget.id);
            setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
            setDeleteTarget(null);
            setError(null);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Error al eliminar el conjuro"
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AdminGuard>
            <div className="container">
                <AdminSectionHeader
                    title="Gestionar Conjuros Oficiales"
                    subtitle="Crear y editar conjuros para toda la aplicacion"
                    backHref="/admin"
                    createLabel="+ Nuevo Conjuro"
                    onCreate={openCreate}
                />

                {error && (
                    <AdminErrorBanner message={error} />
                )}

                {loading ? (
                    <p className="text-center py-8">Cargando conjuros...</p>
                ) : items.length === 0 ? (
                    <p className="text-center py-8 muted">No hay conjuros oficiales. Crea uno para empezar.</p>
                ) : (
                    <SpellsTable
                        items={items}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                    />
                )}
            </div>

            <SpellFormModal
                isOpen={isFormOpen}
                editing={Boolean(editingSpell)}
                loading={loading}
                formState={formState}
                spellClasses={spellClasses}
                spellSchools={spellSchools}
                availableSubschools={availableSubschools}
                onClose={closeForm}
                onChange={handleChange}
                onCheckbox={handleCheckbox}
                onSetFormState={setFormState}
                onAddClassLevel={addClassLevel}
                onRemoveClassLevel={removeClassLevel}
                onSubmit={handleSubmit}
            />

            {/* Modal de Confirmación de Eliminación */}
            {deleteTarget && (
                <DeleteConfirmationModal
                    title={`Eliminar "${deleteTarget?.name || 'Conjuro'}"`}
                    message="¿Estás seguro de que deseas eliminar este conjuro? Esta acción no se puede deshacer."
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                    isLoading={isDeleting}
                />
            )}
        </AdminGuard>
    );
}
