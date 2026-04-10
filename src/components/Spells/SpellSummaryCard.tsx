import Link from "next/link";
import type { Spell } from "@/api/spellsApi";
import {
    getSpellCastingTime,
    getSpellSchoolLabel,
    getSpellSubschoolLabel,
    getSpellTarget,
} from "./spellDisplay";

interface SpellSummaryCardProps {
    spell: Spell;
    href: string;
    level: number;
}

export function SpellSummaryCard({ spell, href, level }: SpellSummaryCardProps) {
    const schoolLabel = getSpellSchoolLabel(spell);
    const subschoolLabel = getSpellSubschoolLabel(spell);
    const castingTime = getSpellCastingTime(spell);
    const target = getSpellTarget(spell);
    const summary = spell.summary || spell.descripcion || spell.description;

    return (
        <Link href={href} className="block h-full">
            <article
                className="h-full p-4 rounded-2xl transition-transform hover:shadow-lg hover:-translate-y-1"
                style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--olive-300)",
                }}
            >
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-lg" style={{ color: "var(--olive-900)" }}>
                        {spell.name || "Sin nombre"}
                    </h3>
                    <span className="text-[11px] px-2 py-1 rounded-full border border-olive-500/40 text-olive-900 bg-olive-100 whitespace-nowrap">
                        Nivel {level}
                    </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                    {schoolLabel && (
                        <span className="text-[11px] bg-blue-200 text-blue-900 px-2 py-1 rounded">
                            {schoolLabel}
                        </span>
                    )}
                    {subschoolLabel && (
                        <span className="text-[11px] bg-indigo-200 text-indigo-900 px-2 py-1 rounded">
                            {subschoolLabel}
                        </span>
                    )}
                </div>

                {summary && <p className="text-sm muted mt-2 line-clamp-2">{summary}</p>}

                {castingTime && (
                    <p className="text-xs muted mt-2">
                        <strong>Tiempo:</strong> {castingTime}
                    </p>
                )}

                {target && (
                    <p className="text-xs muted mt-1 line-clamp-1">
                        <strong>Objetivo:</strong> {target}
                    </p>
                )}
            </article>
        </Link>
    );
}
