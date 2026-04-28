import { Feat } from "@/api/featsApi";
import { Spell } from "@/api/spellsApi";
import { RuleResponse } from "@/types/rules";

type ModalType = "spells" | "feats" | "rules" | null;

type BusyState = {
    type: Exclude<ModalType, null> | null;
    id: number | null;
};

interface HomebrewCampaignManageModalProps {
    modalType: Exclude<ModalType, null>;
    modalLoading: boolean;
    modalError: string | null;
    busy: BusyState;
    availableRules: RuleResponse[];
    availableFeats: Feat[];
    availableSpells: Spell[];
    campaignRules: RuleResponse[];
    campaignFeats: Feat[];
    campaignSpells: Spell[];
    onClose: () => void;
    onDismissError: () => void;
    onAddRule: (ruleId: number) => Promise<void>;
    onAddFeat: (featId: number) => Promise<void>;
    onAddSpell: (spellId: number) => Promise<void>;
    onRemoveRule: (ruleId: number) => Promise<void>;
    onRemoveFeat: (featId: number) => Promise<void>;
    onRemoveSpell: (spellId: number) => Promise<void>;
}

const formatSpellMeta = (spell: Spell) =>
    [spell.schoolName || spell.schoolCode, spell.subschoolName]
        .filter(Boolean)
        .join(" · ") || "Sin escuela";

export default function HomebrewCampaignManageModal({
    modalType,
    modalLoading,
    modalError,
    busy,
    availableRules,
    availableFeats,
    availableSpells,
    campaignRules,
    campaignFeats,
    campaignSpells,
    onClose,
    onDismissError,
    onAddRule,
    onAddFeat,
    onAddSpell,
    onRemoveRule,
    onRemoveFeat,
    onRemoveSpell,
}: HomebrewCampaignManageModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: 900,
                    width: "95vw",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: 0,
                }}
            >
                <div className="flex flex-col" style={{ minHeight: "100%" }}>
                    <div
                        className="px-6 pt-6 pb-3"
                        style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "var(--olive-300)",
                            zIndex: 1,
                        }}
                    >
                        <h4 className="text-lg font-bold">
                            {modalType === "rules" && "Gestionar reglas"}
                            {modalType === "feats" && "Gestionar dotes"}
                            {modalType === "spells" && "Gestionar conjuros"}
                        </h4>
                    </div>

                    {modalError && (
                        <div className="mx-6 mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {modalError}
                            <button onClick={onDismissError} className="ml-2 text-xs underline">
                                Descartar
                            </button>
                        </div>
                    )}

                    {modalLoading ? (
                        <p className="px-6 text-sm muted">Cargando...</p>
                    ) : (
                        <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-lg border border-black/10 bg-white/60 p-3">
                                <h5 className="font-semibold text-sm mb-2">Disponibles</h5>
                                {modalType === "rules" && (
                                    <div className="space-y-2">
                                        {availableRules.length === 0 ? (
                                            <p className="text-xs muted">Sin reglas disponibles.</p>
                                        ) : (
                                            availableRules.map((rule) => (
                                                <div
                                                    key={rule.id}
                                                    className="rounded-md border border-black/10 bg-[color:var(--olive-100)]/40 p-2"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="text-sm font-semibold">{rule.name}</div>
                                                            {rule.description && (
                                                                <p className="text-xs muted line-clamp-2">
                                                                    {rule.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => onAddRule(rule.id)}
                                                            disabled={busy.type === "rules" && busy.id === rule.id}
                                                        >
                                                            Agregar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {modalType === "feats" && (
                                    <div className="space-y-2">
                                        {availableFeats.length === 0 ? (
                                            <p className="text-xs muted">Sin dotes disponibles.</p>
                                        ) : (
                                            availableFeats.map((feat) => (
                                                <div
                                                    key={feat.id ?? feat.code}
                                                    className="rounded-md border border-black/10 bg-[color:var(--olive-100)]/40 p-2"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="text-sm font-semibold">{feat.name}</div>
                                                            {feat.benefit && (
                                                                <p className="text-xs muted line-clamp-2">
                                                                    {feat.benefit}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {feat.id && (
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => onAddFeat(feat.id!)}
                                                                disabled={busy.type === "feats" && busy.id === feat.id}
                                                            >
                                                                Agregar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {modalType === "spells" && (
                                    <div className="space-y-2">
                                        {availableSpells.length === 0 ? (
                                            <p className="text-xs muted">Sin conjuros disponibles.</p>
                                        ) : (
                                            availableSpells.map((spell) => (
                                                <div
                                                    key={spell.id ?? spell.name}
                                                    className="rounded-md border border-black/10 bg-[color:var(--olive-100)]/40 p-2"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="text-sm font-semibold">{spell.name}</div>
                                                            <p className="text-xs muted">{formatSpellMeta(spell)}</p>
                                                            {spell.target && (
                                                                <p className="text-xs muted line-clamp-1">
                                                                    Objetivo: {spell.target}
                                                                </p>
                                                            )}
                                                            <p className="text-xs muted line-clamp-2">
                                                                {spell.summary || spell.description || ""}
                                                            </p>
                                                        </div>
                                                        {spell.id && (
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => onAddSpell(spell.id!)}
                                                                disabled={busy.type === "spells" && busy.id === spell.id}
                                                            >
                                                                Agregar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border border-black/10 bg-white/60 p-3">
                                <h5 className="font-semibold text-sm mb-2">En campana</h5>
                                {modalType === "rules" && (
                                    <div className="space-y-2">
                                        {campaignRules.length === 0 ? (
                                            <p className="text-xs muted">No hay reglas agregadas.</p>
                                        ) : (
                                            campaignRules.map((rule) => (
                                                <div
                                                    key={rule.id}
                                                    className="rounded-md border border-black/10 bg-[color:var(--olive-100)]/40 p-2"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="text-sm font-semibold">{rule.name}</div>
                                                            {rule.description && (
                                                                <p className="text-xs muted line-clamp-2">
                                                                    {rule.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => onRemoveRule(rule.id)}
                                                            disabled={busy.type === "rules" && busy.id === rule.id}
                                                        >
                                                            Quitar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {modalType === "feats" && (
                                    <div className="space-y-2">
                                        {campaignFeats.length === 0 ? (
                                            <p className="text-xs muted">No hay dotes agregadas.</p>
                                        ) : (
                                            campaignFeats.map((feat) => (
                                                <div
                                                    key={feat.id ?? feat.code}
                                                    className="rounded-md border border-black/10 bg-[color:var(--olive-100)]/40 p-2"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="text-sm font-semibold">{feat.name}</div>
                                                            {feat.benefit && (
                                                                <p className="text-xs muted line-clamp-2">
                                                                    {feat.benefit}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {feat.id && (
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => onRemoveFeat(feat.id!)}
                                                                disabled={busy.type === "feats" && busy.id === feat.id}
                                                            >
                                                                Quitar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {modalType === "spells" && (
                                    <div className="space-y-2">
                                        {campaignSpells.length === 0 ? (
                                            <p className="text-xs muted">No hay conjuros agregados.</p>
                                        ) : (
                                            campaignSpells.map((spell) => (
                                                <div
                                                    key={spell.id ?? spell.name}
                                                    className="rounded-md border border-black/10 bg-[color:var(--olive-100)]/40 p-2"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <div className="text-sm font-semibold">{spell.name}</div>
                                                            <p className="text-xs muted">{formatSpellMeta(spell)}</p>
                                                            {spell.target && (
                                                                <p className="text-xs muted line-clamp-1">
                                                                    Objetivo: {spell.target}
                                                                </p>
                                                            )}
                                                            <p className="text-xs muted line-clamp-2">
                                                                {spell.summary || spell.description || ""}
                                                            </p>
                                                        </div>
                                                        {spell.id && (
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => onRemoveSpell(spell.id!)}
                                                                disabled={busy.type === "spells" && busy.id === spell.id}
                                                            >
                                                                Quitar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div
                        className="modal-actions px-6 pb-6 pt-3"
                        style={{
                            position: "sticky",
                            bottom: 0,
                            backgroundColor: "var(--olive-300)",
                            zIndex: 1,
                        }}
                    >
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
