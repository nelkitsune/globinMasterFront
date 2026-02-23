"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Spell,
    SpellClass,
    SpellSubschool,
    createSpell,
    deleteSpell,
    listMyHomebrewSpells,
    updateSpell,
    getSpellClasses,
    getSpellSchools,
    SpellSchool,
} from "@/api/spellsApi";
import { DeleteConfirmationModal } from "@/components/Campaing/DeleteConfirmationModal";

const SAVING_THROW_TYPES = ["Voluntad", "Reflejos", "Fortaleza"];

interface ClassLevel {
    classCode: string;
    level: number;
}

interface SpellFormState {
    name: string;
    castingTime: string;
    rangeText: string;
    areaText: string;
    durationText: string;
    schoolCode: string;
    subschoolId: string;
    target: string;
    savingThrow: boolean;
    savingThrowType: string;
    spellResistance: boolean;
    componentsV: boolean;
    componentsS: boolean;
    componentsM: boolean;
    componentsF: boolean;
    componentsDf: boolean;
    materialDesc: string;
    focusDesc: string;
    divineFocusDesc: string;
    description: string;
    summary: string;
    classLevels: ClassLevel[];
    selectedClassCode: string;
    selectedLevel: string;
}

const emptySpellForm: SpellFormState = {
    name: "",
    castingTime: "",
    rangeText: "",
    areaText: "",
    durationText: "",
    schoolCode: "",
    subschoolId: "",
    target: "",
    savingThrow: false,
    savingThrowType: "",
    spellResistance: false,
    componentsV: false,
    componentsS: false,
    componentsM: false,
    componentsF: false,
    componentsDf: false,
    materialDesc: "",
    focusDesc: "",
    divineFocusDesc: "",
    description: "",
    summary: "",
    classLevels: [],
    selectedClassCode: "",
    selectedLevel: "",
};

const toSpellPayload = (form: SpellFormState, id?: number): any => {
    const subschoolId = form.subschoolId ? Number(form.subschoolId) : null;
    const payload: any = {
        id,
        name: form.name.trim(),
        originalName: form.name.trim(),
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
        source: "homerule",
        classLevels: Object.fromEntries(form.classLevels.map(cl => [cl.classCode, cl.level])),
    };

    // Agregar campos opcionales solo si tienen valor
    if (form.areaText?.trim()) payload.areaText = form.areaText.trim();
    if (form.target?.trim()) payload.target = form.target.trim();
    if (form.materialDesc?.trim()) payload.materialDesc = form.materialDesc.trim();
    if (form.focusDesc?.trim()) payload.focusDesc = form.focusDesc.trim();
    if (form.divineFocusDesc?.trim()) payload.divineFocusDesc = form.divineFocusDesc.trim();
    if (form.summary?.trim()) payload.summary = form.summary.trim();

    return payload;
};

export default function HomebrewSpellsManager() {
    const [items, setItems] = useState<Spell[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSpell, setEditingSpell] = useState<Spell | null>(null);
    const [formState, setFormState] = useState<SpellFormState>(emptySpellForm);
    const [deleteTarget, setDeleteTarget] = useState<Spell | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [spellClasses, setSpellClasses] = useState<SpellClass[]>([]);
    const [classesLoading, setClassesLoading] = useState(false);

    const [spellSchools, setSpellSchools] = useState<SpellSchool[]>([]);
    const [schoolsLoading, setSchoolsLoading] = useState(false);

    const availableSubschools = useMemo<SpellSubschool[]>(() => {
        if (!formState.schoolCode) return [];
        const selectedSchool = spellSchools.find((school) => school.code === formState.schoolCode);
        return selectedSchool?.subschools || [];
    }, [spellSchools, formState.schoolCode]);

    const isEditMode = useMemo(() => Boolean(editingSpell), [editingSpell]);

    const loadSpells = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listMyHomebrewSpells();
            console.log("Conjuros cargados del servidor:", data);
            if (data && data.length > 0) {
                console.log("Primer conjuro (estructura completa):", JSON.stringify(data[0], null, 2));
            }
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
        setClassesLoading(true);
        try {
            const data = await getSpellClasses();
            setSpellClasses(data);
        } catch (err: any) {
            console.error("Error cargando lanzadores:", err);
        } finally {
            setClassesLoading(false);
        }
    };

    const loadSpellSchools = async () => {
        setSchoolsLoading(true);
        try {
            const data = await getSpellSchools();
            console.log("Escuelas de magia cargadas:", data);
            setSpellSchools(data || []);
        } catch (err: any) {
            console.error("Error cargando escuelas de magia:", err);
            setSpellSchools([]);
        } finally {
            setSchoolsLoading(false);
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
            castingTime: spell.castingTime ?? "",
            rangeText: spell.rangeText ?? "",
            areaText: spell.areaText ?? "",
            durationText: spell.durationText ?? "",
            schoolCode: spell.schoolCode ?? "",
            subschoolId: spell.subschoolId ? String(spell.subschoolId) : "",
            target: spell.target ?? "",
            savingThrow: Boolean(spell.savingThrow),
            savingThrowType: spell.savingThrow ?? "",
            spellResistance: Boolean(spell.spellResistance),
            componentsV: Boolean(spell.componentsV),
            componentsS: Boolean(spell.componentsS),
            componentsM: Boolean(spell.componentsM),
            componentsF: Boolean(spell.componentsF),
            componentsDf: Boolean(spell.componentsDf),
            materialDesc: spell.materialDesc ?? "",
            focusDesc: spell.focusDesc ?? "",
            divineFocusDesc: spell.divineFocusDesc ?? "",
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
        // Evitar duplicados
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
        console.log("Enviando payload al servidor:", JSON.stringify(payload, null, 2));
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
            return;
        }
        setLoading(true);
        try {
            if (editingSpell?.id) {
                const updated = await updateSpell(editingSpell.id, payload);
                console.log("Respuesta del servidor (update):", JSON.stringify(updated, null, 2));
                await loadSpells();
            } else {
                const created = await createSpell(payload);
                console.log("Respuesta del servidor (create):", JSON.stringify(created, null, 2));
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
        <section
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--card)" }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h3 className="sectionTitle mb-1">Conjuros Caseros</h3>
                    <p className="text-sm muted">
                        Administra conjuros propios para tus campanas.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>
                    Crear Conjuro
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
                <p className="text-sm muted">Cargando conjuros...</p>
            ) : items.length === 0 ? (
                <p className="text-sm muted">
                    Aun no tienes conjuros caseros creados.
                </p>
            ) : (
                <ul className="space-y-3">
                    {items.map((spell) => (
                        <li
                            key={spell.id}
                            className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-bold text-base">{spell.name}</h4>
                                        {spell.schoolName && (
                                            <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">
                                                {spell.schoolName}
                                            </span>
                                        )}
                                        {spell.subschoolName && (
                                            <span className="text-xs bg-indigo-200 text-indigo-900 px-2 py-1 rounded">
                                                {spell.subschoolName}
                                            </span>
                                        )}
                                    </div>
                                    {spell.originalName && (
                                        <p className="text-xs muted mb-2">{spell.originalName}</p>
                                    )}
                                    <p className="text-sm mt-2 mb-2 text-gray-700 line-clamp-2">
                                        {spell.summary || spell.description}
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-2">
                                        <div>
                                            <span className="font-semibold">Lanzamiento:</span>
                                            <p className="text-gray-700">{spell.castingTime || "—"}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Alcance:</span>
                                            <p className="text-gray-700">{spell.rangeText || "—"}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Duración:</span>
                                            <p className="text-gray-700">{spell.durationText || "—"}</p>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Componentes:</span>
                                            <p className="text-gray-700">
                                                {[
                                                    spell.componentsV && "V",
                                                    spell.componentsS && "S",
                                                    spell.componentsM && "M",
                                                    spell.componentsF && "F",
                                                    spell.componentsDf && "DF",
                                                ].filter(Boolean).join(", ") || "—"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Objetivo:</span>
                                            <p className="text-gray-700">{spell.target || "—"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {spell.id && (
                                        <Link
                                            href={`/spells/${spell.id}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            Ver
                                        </Link>
                                    )}
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => openEdit(spell)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => setDeleteTarget(spell)}
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
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxHeight: "90vh",
                            overflowY: "auto",
                            maxWidth: "95vw",
                            width: "100%",
                        }}
                    >
                        <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
                            <h4 className="text-lg font-bold mb-3">
                                {isEditMode ? "Editar conjuro" : "Crear conjuro"}
                            </h4>
                            <div className="modal-form" style={{ flex: 1, overflowY: "auto" }}>
                                <div className="modal-field">
                                    <label className="font-semibold">Nombre *</label>
                                    <input
                                        name="name"
                                        value={formState.name}
                                        onChange={handleChange}
                                        className="modal-input"
                                        placeholder="Ej: Bola de Fuego"
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="font-semibold">Escuela de Magia *</label>
                                    <select
                                        name="schoolCode"
                                        value={formState.schoolCode}
                                        onChange={handleChange}
                                        className="modal-input"
                                        disabled={schoolsLoading}
                                    >
                                        <option value="">-- Selecciona una escuela --</option>
                                        {spellSchools.map((school) => (
                                            <option key={school.code} value={school.code}>
                                                {school.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="modal-field">
                                    <label className="font-semibold">Subescuela</label>
                                    <select
                                        name="subschoolId"
                                        value={formState.subschoolId}
                                        onChange={handleChange}
                                        className="modal-input"
                                        disabled={!formState.schoolCode || availableSubschools.length === 0}
                                    >
                                        <option value="">-- Sin subescuela --</option>
                                        {availableSubschools.map((subschool) => (
                                            <option key={subschool.id} value={subschool.id}>
                                                {subschool.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="modal-field">
                                        <label className="font-semibold">Tiempo de lanzamiento *</label>
                                        <input
                                            name="castingTime"
                                            value={formState.castingTime}
                                            onChange={handleChange}
                                            className="modal-input"
                                            placeholder="Ej: 1 accion"
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label className="font-semibold">Alcance *</label>
                                        <input
                                            name="rangeText"
                                            value={formState.rangeText}
                                            onChange={handleChange}
                                            className="modal-input"
                                            placeholder="Ej: 30 pies"
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label className="font-semibold">Area</label>
                                        <input
                                            name="areaText"
                                            value={formState.areaText}
                                            onChange={handleChange}
                                            className="modal-input"
                                            placeholder="Opcional"
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label className="font-semibold">Objetivo</label>
                                        <input
                                            name="target"
                                            value={formState.target}
                                            onChange={handleChange}
                                            className="modal-input"
                                            placeholder="Ej: una criatura"
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label className="font-semibold">Duracion *</label>
                                        <input
                                            name="durationText"
                                            value={formState.durationText}
                                            onChange={handleChange}
                                            className="modal-input"
                                            placeholder="Ej: 10 minutos"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm mb-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="savingThrow"
                                            checked={formState.savingThrow}
                                            onChange={handleCheckbox}
                                        />
                                        <span className="font-semibold">Tirada de salvacion</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="spellResistance"
                                            checked={formState.spellResistance}
                                            onChange={handleCheckbox}
                                        />
                                        <span className="font-semibold">Resistencia a conjuros</span>
                                    </label>
                                </div>
                                {formState.savingThrow && (
                                    <div className="modal-field">
                                        <label className="font-semibold">Tipo de Tirada *</label>
                                        <select
                                            name="savingThrowType"
                                            value={formState.savingThrowType}
                                            onChange={handleChange}
                                            className="modal-input"
                                        >
                                            <option value="">-- Selecciona un tipo --</option>
                                            {SAVING_THROW_TYPES.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className="modal-field">
                                    <label className="font-semibold">Componentes</label>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="componentsV"
                                                checked={formState.componentsV}
                                                onChange={handleCheckbox}
                                            />
                                            Verbal
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="componentsS"
                                                checked={formState.componentsS}
                                                onChange={handleCheckbox}
                                            />
                                            Somatico
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="componentsM"
                                                checked={formState.componentsM}
                                                onChange={handleCheckbox}
                                            />
                                            Material
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="componentsF"
                                                checked={formState.componentsF}
                                                onChange={handleCheckbox}
                                            />
                                            Foco
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="componentsDf"
                                                checked={formState.componentsDf}
                                                onChange={handleCheckbox}
                                            />
                                            Foco Divino
                                        </label>
                                    </div>
                                </div>
                                {formState.componentsM && (
                                    <div className="modal-field">
                                        <label className="font-semibold">Materiales</label>
                                        <input
                                            name="materialDesc"
                                            value={formState.materialDesc}
                                            onChange={handleChange}
                                            className="modal-input"
                                            placeholder="Describe los materiales necesarios"
                                        />
                                    </div>
                                )}
                                {formState.componentsF && (
                                    <div className="modal-field">
                                        <label className="font-semibold">Foco</label>
                                        <input
                                            name="focusDesc"
                                            value={formState.focusDesc}
                                            onChange={handleChange}
                                            className="modal-input"
                                            placeholder="Ej: una esfera de cristal"
                                        />
                                    </div>
                                )}
                                {formState.componentsDf && (
                                    <div className="modal-field">
                                        <label className="font-semibold">Foco Divino</label>
                                        <input
                                            name="divineFocusDesc"
                                            value={formState.divineFocusDesc}
                                            onChange={handleChange}
                                            className="modal-input"
                                            placeholder="Ej: símbolo sagrado"
                                        />
                                    </div>
                                )}
                                <div className="modal-field">
                                    <label className="font-semibold">Lanzadores *</label>
                                    <p className="text-xs muted mb-2">Selecciona las clases que pueden lanzar este conjuro</p>
                                    <div className="flex flex-col gap-2 mb-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                name="selectedClassCode"
                                                value={formState.selectedClassCode}
                                                onChange={handleChange}
                                                className="modal-input"
                                                disabled={classesLoading}
                                            >
                                                <option value="">-- Selecciona clase --</option>
                                                {spellClasses.map((sc) => (
                                                    <option key={sc.code} value={sc.code}>
                                                        {sc.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                name="selectedLevel"
                                                value={formState.selectedLevel}
                                                onChange={handleChange}
                                                min="0"
                                                max="9"
                                                className="modal-input"
                                                placeholder="Nivel (0-9)"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={addClassLevel}
                                            disabled={!formState.selectedClassCode || !formState.selectedLevel}
                                        >
                                            Agregar lanzador
                                        </button>
                                    </div>
                                    {formState.classLevels.length > 0 && (
                                        <ul className="space-y-1">
                                            {formState.classLevels.map((cl) => {
                                                const cls = spellClasses.find(s => s.code === cl.classCode);
                                                return (
                                                    <li key={cl.classCode} className="flex justify-between items-center bg-olive-50 p-2 rounded text-sm">
                                                        <span>{cls?.name ?? cl.classCode} - Nivel {cl.level}</span>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-xs"
                                                            onClick={() => removeClassLevel(cl.classCode)}
                                                        >
                                                            Quitar
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                                <div className="modal-field">
                                    <label className="font-semibold">Descripcion *</label>
                                    <textarea
                                        name="description"
                                        value={formState.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="modal-input resize-none"
                                        placeholder="Describe los efectos del conjuro"
                                    />
                                </div>
                                <div className="modal-field">
                                    <label className="font-semibold">Resumen</label>
                                    <textarea
                                        name="summary"
                                        value={formState.summary}
                                        onChange={handleChange}
                                        rows={2}
                                        className="modal-input resize-none"
                                        placeholder="Opcional"
                                    />
                                </div>
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
                                    !formState.schoolCode ||
                                    !formState.castingTime ||
                                    !formState.rangeText ||
                                    !formState.durationText ||
                                    !formState.description ||
                                    (formState.savingThrow && !formState.savingThrowType) ||
                                    formState.classLevels.length === 0
                                }
                            >
                                {isEditMode ? "Guardar" : "Crear"}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {
                deleteTarget && (
                    <DeleteConfirmationModal
                        title="Eliminar conjuro"
                        message={`Estas seguro de eliminar el conjuro "${deleteTarget.name}"?`}
                        onCancel={() => setDeleteTarget(null)}
                        onConfirm={confirmDelete}
                        isLoading={isDeleting}
                    />
                )
            }
        </section >
    );
}
