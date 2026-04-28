import { ChangeEvent } from "react";
import { SpellClass, SpellSubschool, SpellSchool } from "@/api/spellsApi";
import { SpellFormState } from "./spellFormTypes";

interface SpellFormModalProps {
    isOpen: boolean;
    editing: boolean;
    loading: boolean;
    formState: SpellFormState;
    spellClasses: SpellClass[];
    spellSchools: SpellSchool[];
    availableSubschools: SpellSubschool[];
    onClose: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onCheckbox: (e: ChangeEvent<HTMLInputElement>) => void;
    onSetFormState: React.Dispatch<React.SetStateAction<SpellFormState>>;
    onAddClassLevel: () => void;
    onRemoveClassLevel: (classCode: string) => void;
    onSubmit: () => Promise<void>;
}

export default function SpellFormModal({
    isOpen,
    editing,
    loading,
    formState,
    spellClasses,
    spellSchools,
    availableSubschools,
    onClose,
    onChange,
    onCheckbox,
    onSetFormState,
    onAddClassLevel,
    onRemoveClassLevel,
    onSubmit,
}: SpellFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
                <div className="sticky top-0 border-b p-6 flex justify-between items-center" style={{ backgroundColor: "var(--olive-500)", color: "white", borderColor: "var(--olive-700)" }}>
                    <h2 className="text-2xl font-bold">{editing ? "Editar Conjuro" : "Crear Conjuro"}</h2>
                    <button onClick={onClose} className="text-white hover:opacity-80 text-2xl font-bold">×</button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Nombre *</label>
                        <input type="text" name="name" value={formState.name} onChange={onChange} placeholder="Ej: Bola de Fuego" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Nombre Original</label>
                        <input type="text" name="originalName" value={formState.originalName} onChange={onChange} placeholder="Ej: Fireball (opcional)" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Escuela de Magia *</label>
                        <select name="schoolCode" value={formState.schoolCode} onChange={onChange} className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}>
                            <option value="">Selecciona una escuela</option>
                            {spellSchools.map((school) => (
                                <option key={school.id} value={school.code}>{school.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Subescuela</label>
                        <select
                            name="subschoolId"
                            value={formState.subschoolId}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded-md"
                            style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                            disabled={!formState.schoolCode || availableSubschools.length === 0}
                        >
                            <option value="">Sin subescuela</option>
                            {availableSubschools.map((subschool) => (
                                <option key={subschool.id} value={subschool.id}>{subschool.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Tiempo de Lanzamiento *</label>
                        <input type="text" name="castingTime" value={formState.castingTime} onChange={onChange} placeholder="Ej: 1 accion" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Rango *</label>
                        <input type="text" name="rangeText" value={formState.rangeText} onChange={onChange} placeholder="Ej: 60 pies" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Area</label>
                        <input type="text" name="areaText" value={formState.areaText} onChange={onChange} placeholder="Ej: Esfera de 20 pies" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Objetivo</label>
                        <input type="text" name="target" value={formState.target} onChange={onChange} placeholder="Ej: una criatura" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Duracion *</label>
                        <input type="text" name="durationText" value={formState.durationText} onChange={onChange} placeholder="Ej: Instantanea" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div className="border-t pt-4" style={{ borderColor: "var(--olive-300)" }}>
                        <label className="block text-sm font-semibold mb-3" style={{ color: "var(--olive-900)" }}>Componentes</label>
                        <div className="space-y-2">
                            <label className="flex items-center"><input type="checkbox" name="componentsV" checked={formState.componentsV} onChange={onCheckbox} className="mr-2" /><span style={{ color: "var(--olive-900)" }}>Verbal (V)</span></label>
                            <label className="flex items-center"><input type="checkbox" name="componentsS" checked={formState.componentsS} onChange={onCheckbox} className="mr-2" /><span style={{ color: "var(--olive-900)" }}>Somatico (S)</span></label>
                            <label className="flex items-center"><input type="checkbox" name="componentsM" checked={formState.componentsM} onChange={onCheckbox} className="mr-2" /><span style={{ color: "var(--olive-900)" }}>Material (M)</span></label>
                            <label className="flex items-center"><input type="checkbox" name="componentsF" checked={formState.componentsF} onChange={onCheckbox} className="mr-2" /><span style={{ color: "var(--olive-900)" }}>Foco (F)</span></label>
                            <label className="flex items-center"><input type="checkbox" name="componentsDf" checked={formState.componentsDf} onChange={onCheckbox} className="mr-2" /><span style={{ color: "var(--olive-900)" }}>Foco Divino (DF)</span></label>
                        </div>
                    </div>

                    {formState.componentsM && (
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Descripcion Material</label>
                            <input type="text" name="materialDesc" value={formState.materialDesc} onChange={onChange} placeholder="Ej: una pluma de fenix" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                        </div>
                    )}

                    {formState.componentsF && (
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Descripcion de Foco</label>
                            <input type="text" name="focusDesc" value={formState.focusDesc} onChange={onChange} placeholder="Ej: una esfera de cristal" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                        </div>
                    )}

                    {formState.componentsDf && (
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Descripcion de Foco Divino</label>
                            <input type="text" name="divineFocusDesc" value={formState.divineFocusDesc} onChange={onChange} placeholder="Ej: simbolo sagrado" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                        </div>
                    )}

                    <div className="border-t pt-4" style={{ borderColor: "var(--olive-300)" }}>
                        <label className="flex items-center">
                            <input type="checkbox" name="savingThrow" checked={formState.savingThrow} onChange={onCheckbox} className="mr-2" />
                            <span className="text-sm font-semibold" style={{ color: "var(--olive-900)" }}>Requiere Tirada de Salvacion</span>
                        </label>
                    </div>

                    {formState.savingThrow && (
                        <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Tipo de Salvacion *</label>
                            <input type="text" name="savingThrowType" value={formState.savingThrowType} onChange={onChange} placeholder="Ej: Destreza (mitad dano)" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                        </div>
                    )}

                    <div>
                        <label className="flex items-center">
                            <input type="checkbox" name="spellResistance" checked={formState.spellResistance} onChange={onCheckbox} className="mr-2" />
                            <span className="text-sm font-semibold" style={{ color: "var(--olive-900)" }}>Puede ser resistido por Resistencia de Magia</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Resumen Breve</label>
                        <textarea name="summary" value={formState.summary} onChange={onChange} placeholder="Breve descripcion del efecto..." rows={2} className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Descripcion Completa *</label>
                        <textarea name="description" value={formState.description} onChange={onChange} placeholder="Descripcion detallada del conjuro..." rows={4} className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--olive-900)" }}>Fuente (Libro y Pagina)</label>
                        <input type="text" name="source" value={formState.source || ""} onChange={onChange} placeholder="Ej: Manual del Jugador, pag. 215" className="w-full px-3 py-2 border rounded-md" style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }} />
                    </div>

                    <div className="border-t pt-4" style={{ borderColor: "var(--olive-300)" }}>
                        <label className="block text-sm font-semibold mb-3" style={{ color: "var(--olive-900)" }}>Clases que pueden lanzar este conjuro *</label>

                        <div className="flex gap-2 mb-4">
                            <select
                                value={formState.selectedClassCode}
                                onChange={(e) => onSetFormState((prev) => ({ ...prev, selectedClassCode: e.target.value }))}
                                className="flex-1 px-3 py-2 border rounded-md"
                                style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                            >
                                <option value="">Selecciona una clase</option>
                                {spellClasses.map((cls) => (
                                    <option key={cls.id} value={cls.code}>{cls.name}</option>
                                ))}
                            </select>

                            <select
                                value={formState.selectedLevel}
                                onChange={(e) => onSetFormState((prev) => ({ ...prev, selectedLevel: e.target.value }))}
                                className="w-24 px-3 py-2 border rounded-md"
                                style={{ borderColor: "var(--olive-500)", backgroundColor: "var(--olive-100)" }}
                            >
                                <option value="">Nivel</option>
                                {Array.from({ length: 10 }, (_, i) => (
                                    <option key={i} value={i}>Nivel {i}</option>
                                ))}
                            </select>

                            <button onClick={onAddClassLevel} className="px-4 py-2 rounded-md font-semibold text-white" style={{ backgroundColor: "var(--olive-700)" }}>
                                Agregar
                            </button>
                        </div>

                        {formState.classLevels.length > 0 && (
                            <div className="space-y-2">
                                {formState.classLevels.map((cl) => (
                                    <div key={cl.classCode} className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: "var(--olive-100)" }}>
                                        <span className="text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                            {spellClasses.find((c) => c.code === cl.classCode)?.name || cl.classCode} - Nivel {cl.level}
                                        </span>
                                        <button onClick={() => onRemoveClassLevel(cl.classCode)} className="font-semibold" style={{ color: "var(--olive-900)" }}>
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="sticky bottom-0 border-t p-6 flex justify-end gap-2" style={{ backgroundColor: "var(--card)", borderColor: "var(--olive-300)" }}>
                    <button onClick={onClose} className="px-4 py-2 rounded-md font-semibold" style={{ backgroundColor: "var(--olive-300)", color: "var(--olive-900)" }}>
                        Cancelar
                    </button>
                    <button onClick={onSubmit} disabled={loading} className="px-4 py-2 rounded-md font-semibold text-white" style={{ backgroundColor: "var(--olive-700)" }}>
                        {editing ? "Guardar Cambios" : "Crear Conjuro"}
                    </button>
                </div>
            </div>
        </div>
    );
}
