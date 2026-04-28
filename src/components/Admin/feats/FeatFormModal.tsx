import { Feat } from "@/api/featsApi";
import {
    ABILITY_OPTIONS,
    ALIGNMENT_OPTIONS,
    FEAT_TYPE_OPTIONS,
    PREREQ_KINDS,
    SIZE_OPTIONS,
    FeatFormInput,
    PrereqGroupInput,
    PrereqKind,
    needsIntValue,
    needsTarget,
} from "./featFormTypes";

interface FeatFormModalProps {
    isOpen: boolean;
    editingFeat: Feat | null;
    modalError: string | null;
    submitting: boolean;
    formData: FeatFormInput;
    prereqGroups: PrereqGroupInput[];
    availableFeats: Feat[];
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onAddGroup: () => void;
    onRemoveGroup: (groupIndex: number) => void;
    onAddCondition: (groupIndex: number) => void;
    onRemoveCondition: (groupIndex: number, conditionIndex: number) => void;
    onSetConditionAt: (
        groupIndex: number,
        conditionIndex: number,
        updater: (prev: any) => any
    ) => void;
    onSetFormData: React.Dispatch<React.SetStateAction<FeatFormInput>>;
}

export default function FeatFormModal({
    isOpen,
    editingFeat,
    modalError,
    submitting,
    formData,
    prereqGroups,
    availableFeats,
    onClose,
    onSubmit,
    onAddGroup,
    onRemoveGroup,
    onAddCondition,
    onRemoveCondition,
    onSetConditionAt,
    onSetFormData,
}: FeatFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 p-4 overflow-y-auto" onClick={onClose}>
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

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                Nombre*
                            </label>
                            <input
                                value={formData.name}
                                onChange={(e) => onSetFormData((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full p-2 rounded-md border"
                                style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                placeholder="Ej: Ataque Especial"
                            />

                            <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                Original Name*
                            </label>
                            <input
                                value={formData.originalName}
                                onChange={(e) => onSetFormData((prev) => ({ ...prev, originalName: e.target.value }))}
                                className="w-full p-2 rounded-md border"
                                style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                placeholder="Ej: Power Attack"
                            />

                            <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                Codigo*
                            </label>
                            <input
                                value={formData.code}
                                onChange={(e) => onSetFormData((prev) => ({ ...prev, code: e.target.value }))}
                                className="w-full p-2 rounded-md border"
                                style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                placeholder="Ej: SPECIAL_ATK"
                            />

                            <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                Tipo*
                            </label>
                            <select
                                value={formData.tipo}
                                onChange={(e) => onSetFormData((prev) => ({ ...prev, tipo: e.target.value }))}
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
                                onChange={(e) => onSetFormData((prev) => ({ ...prev, source: e.target.value }))}
                                className="w-full p-2 rounded-md border"
                                style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                placeholder="Core"
                            />

                            <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                Descripcion*
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => onSetFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                                rows={4}
                                className="w-full p-2 rounded-md border"
                                style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                placeholder="Descripcion breve..."
                            />

                            <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                Beneficio*
                            </label>
                            <textarea
                                value={formData.benefit}
                                onChange={(e) => onSetFormData((prev) => ({ ...prev, benefit: e.target.value }))}
                                rows={4}
                                className="w-full p-2 rounded-md border"
                                style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                placeholder="Que ganas con esta dote?"
                            />

                            <label className="block text-sm font-semibold" style={{ color: "var(--olive-900)" }}>
                                Especial
                            </label>
                            <textarea
                                value={formData.special}
                                onChange={(e) => onSetFormData((prev) => ({ ...prev, special: e.target.value }))}
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
                                onChange={(e) => onSetFormData((prev) => ({ ...prev, normal: e.target.value }))}
                                rows={4}
                                className="w-full p-2 rounded-md border"
                                style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                placeholder="Texto largo opcional..."
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold" style={{ color: "var(--olive-900)" }}>Pre requisitos</h3>
                                <button type="button" className="btn btn-secondary btn-sm" onClick={onAddGroup}>
                                    + Grupo OR
                                </button>
                            </div>

                            <p className="text-sm muted">Condiciones del mismo grupo = AND. Grupos distintos = OR.</p>

                            {prereqGroups.map((group) => (
                                <div key={group.groupIndex} className="rounded-lg border p-3 space-y-3" style={{ borderColor: "var(--olive-300)", backgroundColor: "var(--olive-100)" }}>
                                    <div className="flex items-center justify-between">
                                        <strong>Grupo OR #{group.groupIndex + 1}</strong>
                                        <div className="flex gap-2">
                                            <button type="button" className="btn btn-outline btn-sm" onClick={() => onAddCondition(group.groupIndex)}>+ Condicion</button>
                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => onRemoveGroup(group.groupIndex)}>Eliminar grupo</button>
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
                                                    <span className="text-sm font-semibold">Condicion #{conditionIndex + 1}</span>
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => onRemoveCondition(group.groupIndex, conditionIndex)}>Quitar</button>
                                                </div>

                                                <label className="text-sm font-semibold">Tipo (kind)</label>
                                                <select
                                                    value={condition.kind}
                                                    onChange={(e) => {
                                                        const nextKind = e.target.value as PrereqKind;
                                                        onSetConditionAt(group.groupIndex, conditionIndex, () => ({
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
                                                            onChange={(e) => onSetConditionAt(group.groupIndex, conditionIndex, (prev: any) => ({ ...prev, featSearch: e.target.value }))}
                                                            className="w-full p-2 rounded-md border"
                                                            style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                            placeholder="Escribe nombre o codigo"
                                                        />
                                                        <label className="text-sm font-semibold">Dote requerida</label>
                                                        <select
                                                            value={condition.featId || ""}
                                                            onChange={(e) => onSetConditionAt(group.groupIndex, conditionIndex, (prev: any) => ({
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
                                                            <label className="text-sm font-semibold">Caracteristica</label>
                                                            <select
                                                                value={condition.target || ""}
                                                                onChange={(e) => onSetConditionAt(group.groupIndex, conditionIndex, (prev: any) => ({ ...prev, target: e.target.value }))}
                                                                className="w-full p-2 rounded-md border"
                                                                style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                            >
                                                                <option value="">-- Selecciona --</option>
                                                                {ABILITY_OPTIONS.map((ability) => <option key={ability} value={ability}>{ability}</option>)}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-semibold">Valor minimo</label>
                                                            <input
                                                                type="number"
                                                                value={condition.intValue || ""}
                                                                onChange={(e) => onSetConditionAt(group.groupIndex, conditionIndex, (prev: any) => ({ ...prev, intValue: e.target.value }))}
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
                                                            onChange={(e) => onSetConditionAt(group.groupIndex, conditionIndex, (prev: any) => ({ ...prev, target: e.target.value }))}
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
                                                        <label className="text-sm font-semibold">Tamano</label>
                                                        <select
                                                            value={condition.target || ""}
                                                            onChange={(e) => onSetConditionAt(group.groupIndex, conditionIndex, (prev: any) => ({ ...prev, target: e.target.value }))}
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
                                                        <label className="text-sm font-semibold">Puede lanzar conjuros?</label>
                                                        <select
                                                            value={condition.intValue || "1"}
                                                            onChange={(e) => onSetConditionAt(group.groupIndex, conditionIndex, (prev: any) => ({ ...prev, intValue: e.target.value }))}
                                                            className="w-full p-2 rounded-md border"
                                                            style={{ borderColor: "var(--olive-300)", backgroundColor: "#ffffff", color: "var(--fg)" }}
                                                        >
                                                            <option value="1">Si</option>
                                                            <option value="0">No</option>
                                                        </select>
                                                    </>
                                                )}

                                                {needsTarget(condition.kind) && !["ABILITY_SCORE", "ALIGNMENT", "SIZE"].includes(condition.kind) && (
                                                    <>
                                                        <label className="text-sm font-semibold">Target</label>
                                                        <input
                                                            value={condition.target || ""}
                                                            onChange={(e) => onSetConditionAt(group.groupIndex, conditionIndex, (prev: any) => ({ ...prev, target: e.target.value }))}
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
                                                            onChange={(e) => onSetConditionAt(group.groupIndex, conditionIndex, (prev: any) => ({ ...prev, intValue: e.target.value }))}
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
                            onClick={onClose}
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
    );
}
