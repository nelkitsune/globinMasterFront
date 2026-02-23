"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { DeleteConfirmationModal } from "@/components/Campaing/DeleteConfirmationModal";
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
import Link from "next/link";

interface ClassLevel {
    classCode: string;
    level: number;
}

interface SpellFormState {
    name: string;
    originalName: string;
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
    source: string;
    description: string;
    summary: string;
    classLevels: ClassLevel[];
    selectedClassCode: string;
    selectedLevel: string;
}

const emptySpellForm: SpellFormState = {
    name: "",
    originalName: "",
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
    source: "",
    description: "",
    summary: "",
    classLevels: [],
    selectedClassCode: "",
    selectedLevel: "",
};

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
            // Cargar solo conjuros oficiales (sin owner)
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
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="brand text-4xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                            Gestionar Conjuros Oficiales
                        </h1>
                        <p className="muted text-lg">Crear y editar conjuros para toda la aplicación</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin" className="px-4 py-2 rounded-md font-semibold" style={{ backgroundColor: "var(--olive-200)", color: "var(--olive-900)" }}>
                            ← Volver
                        </Link>
                        <button
                            onClick={openCreate}
                            className="px-4 py-2 rounded-md font-semibold transition-colors"
                            style={{
                                backgroundColor: "var(--olive-600)",
                                color: "white",
                            }}
                        >
                            + Nuevo Conjuro
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
                ) : items.length === 0 ? (
                    <p className="text-center py-8 muted">No hay conjuros oficiales. Crea uno para empezar.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--olive-300)" }}>
                        <table className="w-full">
                            <thead style={{ backgroundColor: "var(--olive-100)" }}>
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                                    <th className="px-4 py-3 text-left font-semibold">Escuela</th>
                                    <th className="px-4 py-3 text-left font-semibold">Subescuela</th>
                                    <th className="px-4 py-3 text-left font-semibold">Objetivo</th>
                                    <th className="px-4 py-3 text-left font-semibold">Clases</th>
                                    <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((spell) => (
                                    <tr key={spell.id} style={{ borderBottom: "1px solid var(--olive-200)" }}>
                                        <td className="px-4 py-3 font-semibold">{spell.name}</td>
                                        <td className="px-4 py-3 text-sm">{spell.schoolName || spell.schoolCode || spell.escuela || 'N/A'}</td>
                                        <td className="px-4 py-3 text-sm">{spell.subschoolName || 'N/A'}</td>
                                        <td className="px-4 py-3 text-sm">{spell.objetivo || spell.target || 'N/A'}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {spell.classLevels && Object.keys(spell.classLevels).length > 0
                                                ? Object.keys(spell.classLevels).join(", ")
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-center flex justify-center gap-2">
                                            <button
                                                onClick={() => openEdit(spell)}
                                                className="px-3 py-1 text-sm rounded-md font-semibold transition-colors"
                                                style={{
                                                    backgroundColor: "var(--olive-400)",
                                                    color: "white",
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(spell)}
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

            {/* Formulario Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
                        <div className="sticky top-0 border-b p-6 flex justify-between items-center" style={{ backgroundColor: "var(--olive-500)", color: "white", borderColor: "var(--olive-700)" }}>
                            <h2 className="text-2xl font-bold">{editingSpell ? "Editar Conjuro" : "Crear Conjuro"}</h2>
                            <button onClick={closeForm} className="text-white hover:opacity-80 text-2xl font-bold">×</button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Nombre *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Bola de Fuego"
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Nombre Original */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Nombre Original</label>
                                <input
                                    type="text"
                                    name="originalName"
                                    value={formState.originalName}
                                    onChange={handleChange}
                                    placeholder="Ej: Fireball (opcional)"
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Escuela */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Escuela de Magia *</label>
                                <select
                                    name="schoolCode"
                                    value={formState.schoolCode}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                >
                                    <option value="">Selecciona una escuela</option>
                                    {spellSchools.map((school) => (
                                        <option key={school.id} value={school.code}>
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subescuela */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Subescuela</label>
                                <select
                                    name="subschoolId"
                                    value={formState.subschoolId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                    disabled={!formState.schoolCode || availableSubschools.length === 0}
                                >
                                    <option value="">Sin subescuela</option>
                                    {availableSubschools.map((subschool) => (
                                        <option key={subschool.id} value={subschool.id}>
                                            {subschool.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tiempo de Lanzamiento */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Tiempo de Lanzamiento *</label>
                                <input
                                    type="text"
                                    name="castingTime"
                                    value={formState.castingTime}
                                    onChange={handleChange}
                                    placeholder="Ej: 1 acción"
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Rango */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Rango *</label>
                                <input
                                    type="text"
                                    name="rangeText"
                                    value={formState.rangeText}
                                    onChange={handleChange}
                                    placeholder="Ej: 60 pies"
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Área */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Área</label>
                                <input
                                    type="text"
                                    name="areaText"
                                    value={formState.areaText}
                                    onChange={handleChange}
                                    placeholder="Ej: Esfera de 20 pies"
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Objetivo */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Objetivo</label>
                                <input
                                    type="text"
                                    name="target"
                                    value={formState.target}
                                    onChange={handleChange}
                                    placeholder="Ej: una criatura"
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Duración */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Duración *</label>
                                <input
                                    type="text"
                                    name="durationText"
                                    value={formState.durationText}
                                    onChange={handleChange}
                                    placeholder="Ej: Instantánea"
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Componentes */}
                            <div className="border-t pt-4" style={{ borderColor: "var(--olive-300)" }}>
                                <label className="block text-sm font-semibold mb-3" style={{ color: "var(--olive-900)" }}>Componentes</label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="componentsV"
                                            checked={formState.componentsV}
                                            onChange={handleCheckbox}
                                            className="mr-2"
                                        />
                                        <span style={{ color: "var(--olive-900)" }}>Verbal (V)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="componentsS"
                                            checked={formState.componentsS}
                                            onChange={handleCheckbox}
                                            className="mr-2"
                                        />
                                        <span style={{ color: "var(--olive-900)" }}>Somático (S)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="componentsM"
                                            checked={formState.componentsM}
                                            onChange={handleCheckbox}
                                            className="mr-2"
                                        />
                                        <span style={{ color: "var(--olive-900)" }}>Material (M)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="componentsF"
                                            checked={formState.componentsF}
                                            onChange={handleCheckbox}
                                            className="mr-2"
                                        />
                                        <span style={{ color: "var(--olive-900)" }}>Foco (F)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="componentsDf"
                                            checked={formState.componentsDf}
                                            onChange={handleCheckbox}
                                            className="mr-2"
                                        />
                                        <span style={{ color: "var(--olive-900)" }}>Foco Divino (DF)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Material */}
                            {formState.componentsM && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Descripción Material</label>
                                    <input
                                        type="text"
                                        name="materialDesc"
                                        value={formState.materialDesc}
                                        onChange={handleChange}
                                        placeholder="Ej: una pluma de fénix"
                                        className="w-full px-3 py-2 border rounded-md"
                                        style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                    />
                                </div>
                            )}

                            {/* Focus */}
                            {formState.componentsF && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Descripción de Foco</label>
                                    <input
                                        type="text"
                                        name="focusDesc"
                                        value={formState.focusDesc}
                                        onChange={handleChange}
                                        placeholder="Ej: una esfera de cristal"
                                        className="w-full px-3 py-2 border rounded-md"
                                        style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                    />
                                </div>
                            )}

                            {/* Divine Focus */}
                            {formState.componentsDf && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Descripción de Foco Divino</label>
                                    <input
                                        type="text"
                                        name="divineFocusDesc"
                                        value={formState.divineFocusDesc}
                                        onChange={handleChange}
                                        placeholder="Ej: símbolo sagrado"
                                        className="w-full px-3 py-2 border rounded-md"
                                        style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                    />
                                </div>
                            )}

                            {/* Tirada de Salvación */}
                            <div className="border-t pt-4" style={{ borderColor: "var(--olive-300)" }}>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="savingThrow"
                                        checked={formState.savingThrow}
                                        onChange={handleCheckbox}
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-semibold" style={{ color: "var(--olive-900)" }}>Requiere Tirada de Salvación</span>
                                </label>
                            </div>

                            {formState.savingThrow && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Tipo de Salvación *</label>
                                    <input
                                        type="text"
                                        name="savingThrowType"
                                        value={formState.savingThrowType}
                                        onChange={handleChange}
                                        placeholder="Ej: Destreza (mitad daño)"
                                        className="w-full px-3 py-2 border rounded-md"
                                        style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                    />
                                </div>
                            )}

                            {/* Resistencia a Magia */}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="spellResistance"
                                        checked={formState.spellResistance}
                                        onChange={handleCheckbox}
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-semibold" style={{ color: "var(--olive-900)" }}>Puede ser resistido por Resistencia de Magia</span>
                                </label>
                            </div>

                            {/* Resumen */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Resumen Breve</label>
                                <textarea
                                    name="summary"
                                    value={formState.summary}
                                    onChange={handleChange}
                                    placeholder="Breve descripción del efecto..."
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Descripción Completa */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Descripción Completa *</label>
                                <textarea
                                    name="description"
                                    value={formState.description}
                                    onChange={handleChange}
                                    placeholder="Descripción detallada del conjuro..."
                                    rows={4}
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Source (Libro y Página) */}
                            <div>
                                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Fuente (Libro y Página)</label>
                                <input
                                    type="text"
                                    name="source"
                                    value={formState.source || ""}
                                    onChange={handleChange}
                                    placeholder="Ej: Manual del Jugador, pág. 215"
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                />
                            </div>

                            {/* Clases que pueden lanzar el conjuro */}
                            <div className="border-t pt-4" style={{ borderColor: "var(--olive-300)" }}>
                                <label className="block text-sm font-semibold mb-3" style={{ color: "var(--olive-900)" }}>Clases que pueden lanzar este conjuro *</label>

                                <div className="flex gap-2 mb-4">
                                    <select
                                        value={formState.selectedClassCode}
                                        onChange={(e) => setFormState(prev => ({ ...prev, selectedClassCode: e.target.value }))}
                                        className="flex-1 px-3 py-2 border rounded-md"
                                        style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                    >
                                        <option value="">Selecciona una clase</option>
                                        {spellClasses.map((cls) => (
                                            <option key={cls.id} value={cls.code}>
                                                {cls.name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={formState.selectedLevel}
                                        onChange={(e) => setFormState(prev => ({ ...prev, selectedLevel: e.target.value }))}
                                        className="w-24 px-3 py-2 border rounded-md"
                                        style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                                    >
                                        <option value="">Nivel</option>
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <option key={i} value={i}>
                                                Nivel {i}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={addClassLevel}
                                        className="px-4 py-2 rounded-md font-semibold text-white"
                                        style={{ backgroundColor: "var(--olive-700)" }}
                                    >
                                        Agregar
                                    </button>
                                </div>

                                {formState.classLevels.length > 0 && (
                                    <div className="space-y-2">
                                        {formState.classLevels.map((cl) => (
                                            <div key={cl.classCode} className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: "var(--olive-100)" }}>
                                                <span className="text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                                    {spellClasses.find(c => c.code === cl.classCode)?.name || cl.classCode} - Nivel {cl.level}
                                                </span>
                                                <button
                                                    onClick={() => removeClassLevel(cl.classCode)}
                                                    className="font-semibold"
                                                    style={{ color: "var(--olive-900)" }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 border-t p-6 flex justify-end gap-2" style={{ backgroundColor: "var(--card)", borderColor: "var(--olive-300)" }}>
                            <button
                                onClick={closeForm}
                                className="px-4 py-2 rounded-md font-semibold"
                                style={{ backgroundColor: "var(--olive-300)", color: "var(--olive-900)" }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-4 py-2 rounded-md font-semibold text-white"
                                style={{ backgroundColor: "var(--olive-700)" }}
                            >
                                {editingSpell ? "Guardar Cambios" : "Crear Conjuro"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
