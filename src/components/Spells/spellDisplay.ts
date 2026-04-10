import type { Spell } from "@/api/spellsApi";

export const getSpellSourceLabel = (spell: Spell) =>
    spell.source === "homerule" ? "Homerule" : "Oficial";

export const getSpellSchoolLabel = (spell: Spell) =>
    spell.schoolName || spell.schoolCode || spell.escuela || "";

export const getSpellSubschoolLabel = (spell: Spell) =>
    spell.subschoolName || "";

export const getSpellCastingTime = (spell: Spell) =>
    spell.tiempoIncantacion || spell.castingTime || "—";

export const getSpellRange = (spell: Spell) =>
    spell.rango || spell.rangeText || "—";

export const getSpellDuration = (spell: Spell) =>
    spell.duracion || spell.durationText || "—";

export const getSpellTarget = (spell: Spell) =>
    spell.objetivo || spell.target || "—";

export const getSpellSavingThrow = (spell: Spell) =>
    spell.salvacion || spell.savingThrow || "—";

export const getSpellResistance = (spell: Spell) => {
    if (typeof spell.resistenciaConjuros === "string") {
        return spell.resistenciaConjuros;
    }

    if (typeof spell.spellResistance === "boolean") {
        return spell.spellResistance ? "Si" : "No";
    }

    return "—";
};

export const getSpellComponents = (spell: Spell) => {
    const components = [
        spell.componentsV && "V",
        spell.componentsS && "S",
        spell.componentsM && "M",
        spell.componentsF && "F",
        spell.componentsDf && "DF",
    ].filter(Boolean);

    return components.length > 0 ? components.join(", ") : "—";
};
