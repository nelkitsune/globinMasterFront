import type { Spell } from "@/api/spellsApi";
import {
    getSpellCastingTime,
    getSpellComponents,
    getSpellDuration,
    getSpellRange,
    getSpellResistance,
    getSpellSavingThrow,
    getSpellSchoolLabel,
    getSpellSourceLabel,
    getSpellSubschoolLabel,
    getSpellTarget,
} from "./spellDisplay";
import { SpellDetailField } from "./SpellDetailField";
import { SpellDetailSection } from "./SpellDetailSection";

interface SpellDetailCardProps {
    spell: Spell;
}

export function SpellDetailCard({ spell }: SpellDetailCardProps) {
    const sourceLabel = getSpellSourceLabel(spell);
    const schoolLabel = getSpellSchoolLabel(spell);
    const subschoolLabel = getSpellSubschoolLabel(spell);

    return (
        <div className="mt-4 rounded-2xl p-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">{spell.name}</h1>
                <span
                    className={
                        "text-xs px-3 py-1 rounded-full border " +
                        (spell.source === "homerule"
                            ? "border-emerald-600/40 bg-emerald-100 text-emerald-900"
                            : "border-slate-400/60 bg-white/60 text-slate-700")
                    }
                >
                    {sourceLabel}
                </span>
                {schoolLabel && (
                    <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">
                        {schoolLabel}
                    </span>
                )}
                {subschoolLabel && (
                    <span className="text-xs bg-indigo-200 text-indigo-900 px-2 py-1 rounded">
                        {subschoolLabel}
                    </span>
                )}
            </div>

            {spell.originalName && <p className="text-xs muted mb-3">{spell.originalName}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <SpellDetailField label="Casting Time" value={getSpellCastingTime(spell)} />
                <SpellDetailField label="Range" value={getSpellRange(spell)} />
                <SpellDetailField label="Duration" value={getSpellDuration(spell)} />
                <SpellDetailField label="Target" value={getSpellTarget(spell)} />
                <SpellDetailField label="Saving Throw" value={getSpellSavingThrow(spell)} />
                <SpellDetailField label="Spell Resistance" value={getSpellResistance(spell)} />
                <SpellDetailField label="Componentes" value={getSpellComponents(spell)} />
            </div>

            {spell.areaText && (
                <SpellDetailSection title="Area">
                    <p>{spell.areaText}</p>
                </SpellDetailSection>
            )}

            {spell.materialDesc && (
                <SpellDetailSection title="Material">
                    <p>{spell.materialDesc}</p>
                </SpellDetailSection>
            )}

            {spell.focusDesc && (
                <SpellDetailSection title="Foco">
                    <p>{spell.focusDesc}</p>
                </SpellDetailSection>
            )}

            {spell.divineFocusDesc && (
                <SpellDetailSection title="Foco Divino">
                    <p>{spell.divineFocusDesc}</p>
                </SpellDetailSection>
            )}

            {spell.summary && (
                <SpellDetailSection title="Resumen">
                    <p className="whitespace-pre-line">{spell.summary}</p>
                </SpellDetailSection>
            )}

            {spell.source && (
                <SpellDetailSection title="Fuente">
                    <p>{spell.source}</p>
                </SpellDetailSection>
            )}

            <div className="text-sm">
                <h2 className="text-lg font-semibold">Descripcion</h2>
                <p className="whitespace-pre-line">{spell.description || "—"}</p>
            </div>
        </div>
    );
}
