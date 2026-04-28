import Link from "next/link";
import { Feat } from "@/api/featsApi";
import { Spell } from "@/api/spellsApi";
import { RuleResponse } from "@/types/rules";

interface HomebrewCampaignOverviewGridProps {
    isOwner: boolean;
    campaignRules: RuleResponse[];
    campaignFeats: Feat[];
    campaignSpells: Spell[];
    onOpenModal: (type: "spells" | "feats" | "rules") => void;
}

const renderEmpty = (label: string) => (
    <p className="text-sm muted">No hay {label} en la campana.</p>
);

const formatSpellMeta = (spell: Spell) =>
    [spell.schoolName || spell.schoolCode, spell.subschoolName]
        .filter(Boolean)
        .join(" · ") || "Sin escuela";

export default function HomebrewCampaignOverviewGrid({
    isOwner,
    campaignRules,
    campaignFeats,
    campaignSpells,
    onOpenModal,
}: HomebrewCampaignOverviewGridProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-base">Reglas</h3>
                    {isOwner && (
                        <button className="btn btn-primary btn-sm" onClick={() => onOpenModal("rules")}>
                            Agregar
                        </button>
                    )}
                </div>
                {campaignRules.length === 0 ? (
                    renderEmpty("reglas")
                ) : (
                    <ul className="space-y-2">
                        {campaignRules.map((rule) => (
                            <li
                                key={rule.id}
                                className="rounded-lg border border-black/10 bg-white/60 p-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="font-semibold text-sm">{rule.name}</div>
                                        {rule.description && (
                                            <p className="text-xs muted line-clamp-2">{rule.description}</p>
                                        )}
                                    </div>
                                    <Link href={`/rules/${rule.id}`} className="btn btn-outline btn-sm">
                                        Ver
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-base">Dotes</h3>
                    {isOwner && (
                        <button className="btn btn-primary btn-sm" onClick={() => onOpenModal("feats")}>
                            Agregar
                        </button>
                    )}
                </div>
                {campaignFeats.length === 0 ? (
                    renderEmpty("dotes")
                ) : (
                    <ul className="space-y-2">
                        {campaignFeats.map((feat) => (
                            <li
                                key={feat.id ?? feat.code}
                                className="rounded-lg border border-black/10 bg-white/60 p-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="font-semibold text-sm">{feat.name}</div>
                                        {feat.benefit && (
                                            <p className="text-xs muted line-clamp-2">{feat.benefit}</p>
                                        )}
                                    </div>
                                    {feat.id && (
                                        <Link href={`/feats/${feat.id}`} className="btn btn-outline btn-sm">
                                            Ver
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-base">Conjuros</h3>
                    {isOwner && (
                        <button className="btn btn-primary btn-sm" onClick={() => onOpenModal("spells")}>
                            Agregar
                        </button>
                    )}
                </div>
                {campaignSpells.length === 0 ? (
                    renderEmpty("conjuros")
                ) : (
                    <ul className="space-y-2">
                        {campaignSpells.map((spell) => (
                            <li
                                key={spell.id ?? spell.name}
                                className="rounded-lg border border-black/10 bg-white/60 p-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="font-semibold text-sm">{spell.name}</div>
                                        <p className="text-xs muted">{formatSpellMeta(spell)}</p>
                                        {spell.target && (
                                            <p className="text-xs muted line-clamp-1">Objetivo: {spell.target}</p>
                                        )}
                                        <p className="text-xs muted line-clamp-2">
                                            {spell.summary || spell.description || ""}
                                        </p>
                                    </div>
                                    {spell.id && (
                                        <Link href={`/spells/${spell.id}`} className="btn btn-outline btn-sm">
                                            Ver
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
