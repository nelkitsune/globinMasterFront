"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Feat, listMyHomebrewFeats } from "@/api/featsApi";
import { Spell, listMyHomebrewSpells } from "@/api/spellsApi";
import { listMyRules } from "@/api/rulesApi";
import { RuleResponse } from "@/types/rules";
import {
    addCampaignHomebrewFeat,
    addCampaignHomebrewRule,
    addCampaignHomebrewSpell,
    getCampaignHomebrew,
    removeCampaignHomebrewFeat,
    removeCampaignHomebrewRule,
    removeCampaignHomebrewSpell,
} from "@/api/campaignHomebrewApi";

interface HomebrewCampaignSectionProps {
    campaignId: number;
    isOwner: boolean;
}

type ModalType = "spells" | "feats" | "rules" | null;

type BusyState = {
    type: Exclude<ModalType, null> | null;
    id: number | null;
};

export default function HomebrewCampaignSection({
    campaignId,
    isOwner,
}: HomebrewCampaignSectionProps) {
    const [campaignSpells, setCampaignSpells] = useState<Spell[]>([]);
    const [campaignFeats, setCampaignFeats] = useState<Feat[]>([]);
    const [campaignRules, setCampaignRules] = useState<RuleResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [modalType, setModalType] = useState<ModalType>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    const [mySpells, setMySpells] = useState<Spell[]>([]);
    const [myFeats, setMyFeats] = useState<Feat[]>([]);
    const [myRules, setMyRules] = useState<RuleResponse[]>([]);

    const [busy, setBusy] = useState<BusyState>({ type: null, id: null });

    const loadCampaignHomebrew = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCampaignHomebrew(campaignId);
            setCampaignSpells(data.spells || []);
            setCampaignFeats(data.feats || []);
            setCampaignRules(data.rules || []);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Error al cargar homebrew de la campana"
            );
        } finally {
            setLoading(false);
        }
    };

    const loadMyHomebrew = async (type: Exclude<ModalType, null>) => {
        setModalLoading(true);
        setModalError(null);
        try {
            if (type === "spells") {
                const data = await listMyHomebrewSpells();
                setMySpells(data);
            }
            if (type === "feats") {
                const data = await listMyHomebrewFeats();
                setMyFeats(data);
            }
            if (type === "rules") {
                const data = await listMyRules();
                setMyRules(data);
            }
        } catch (err: any) {
            setModalError(
                err?.response?.data?.message ||
                err?.message ||
                "Error al cargar tus homebrew"
            );
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        if (!campaignId) return;
        loadCampaignHomebrew();
    }, [campaignId]);

    const openModal = (type: Exclude<ModalType, null>) => {
        setModalType(type);
        loadMyHomebrew(type);
    };

    const closeModal = () => {
        setModalType(null);
        setModalError(null);
        setBusy({ type: null, id: null });
    };

    const availableSpells = useMemo(
        () =>
            mySpells.filter(
                (spell) =>
                    spell.id != null &&
                    !campaignSpells.some((item) => item.id === spell.id)
            ),
        [mySpells, campaignSpells]
    );

    const availableFeats = useMemo(
        () =>
            myFeats.filter(
                (feat) =>
                    feat.id != null &&
                    !campaignFeats.some((item) => item.id === feat.id)
            ),
        [myFeats, campaignFeats]
    );

    const availableRules = useMemo(
        () =>
            myRules.filter(
                (rule) =>
                    rule.id != null &&
                    !campaignRules.some((item) => item.id === rule.id)
            ),
        [myRules, campaignRules]
    );

    const handleAddSpell = async (spellId: number) => {
        setBusy({ type: "spells", id: spellId });
        try {
            await addCampaignHomebrewSpell(campaignId, spellId);
            await loadCampaignHomebrew();
            await loadMyHomebrew("spells");
        } finally {
            setBusy({ type: null, id: null });
        }
    };

    const handleRemoveSpell = async (spellId: number) => {
        setBusy({ type: "spells", id: spellId });
        try {
            await removeCampaignHomebrewSpell(campaignId, spellId);
            await loadCampaignHomebrew();
            await loadMyHomebrew("spells");
        } finally {
            setBusy({ type: null, id: null });
        }
    };

    const handleAddFeat = async (featId: number) => {
        setBusy({ type: "feats", id: featId });
        try {
            await addCampaignHomebrewFeat(campaignId, featId);
            await loadCampaignHomebrew();
            await loadMyHomebrew("feats");
        } finally {
            setBusy({ type: null, id: null });
        }
    };

    const handleRemoveFeat = async (featId: number) => {
        setBusy({ type: "feats", id: featId });
        try {
            await removeCampaignHomebrewFeat(campaignId, featId);
            await loadCampaignHomebrew();
            await loadMyHomebrew("feats");
        } finally {
            setBusy({ type: null, id: null });
        }
    };

    const handleAddRule = async (ruleId: number) => {
        setBusy({ type: "rules", id: ruleId });
        try {
            await addCampaignHomebrewRule(campaignId, ruleId);
            await loadCampaignHomebrew();
            await loadMyHomebrew("rules");
        } finally {
            setBusy({ type: null, id: null });
        }
    };

    const handleRemoveRule = async (ruleId: number) => {
        setBusy({ type: "rules", id: ruleId });
        try {
            await removeCampaignHomebrewRule(campaignId, ruleId);
            await loadCampaignHomebrew();
            await loadMyHomebrew("rules");
        } finally {
            setBusy({ type: null, id: null });
        }
    };

    const renderEmpty = (label: string) => (
        <p className="text-sm muted">No hay {label} en la campana.</p>
    );

    return (
        <section
            className="rounded-2xl p-6"
            style={{ backgroundColor: "var(--card)" }}
        >
            <div className="flex flex-col gap-1 mb-4">
                <h2 className="sectionTitle mb-0">Homebrew de la campana</h2>
                <p className="text-sm muted">
                    Gestiona y revisa reglas, dotes y conjuros personalizados.
                </p>
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
                <p className="text-sm muted">Cargando homebrew...</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-black/10 bg-[color:var(--olive-100)]/40 p-4">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <h3 className="font-bold text-base">Reglas</h3>
                            {isOwner && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => openModal("rules")}
                                >
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
                                                <div className="font-semibold text-sm">
                                                    {rule.name}
                                                </div>
                                                {rule.description && (
                                                    <p className="text-xs muted line-clamp-2">
                                                        {rule.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Link
                                                href={`/rules/${rule.id}`}
                                                className="btn btn-outline btn-sm"
                                            >
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
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => openModal("feats")}
                                >
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
                                                <div className="font-semibold text-sm">
                                                    {feat.name}
                                                </div>
                                                {feat.benefit && (
                                                    <p className="text-xs muted line-clamp-2">
                                                        {feat.benefit}
                                                    </p>
                                                )}
                                            </div>
                                            {feat.id && (
                                                <Link
                                                    href={`/feats/${feat.id}`}
                                                    className="btn btn-outline btn-sm"
                                                >
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
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => openModal("spells")}
                                >
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
                                                <div className="font-semibold text-sm">
                                                    {spell.name}
                                                </div>
                                                <p className="text-xs muted line-clamp-2">
                                                    {spell.summary || spell.description || ""}
                                                </p>
                                            </div>
                                            {spell.id && (
                                                <Link
                                                    href={`/spells/${spell.id}`}
                                                    className="btn btn-outline btn-sm"
                                                >
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
            )}

            {!isOwner && (
                <p className="text-xs muted mt-4">
                    Solo el owner puede gestionar homebrew en esta campana.
                </p>
            )}

            {modalType && (
                <div className="modal-overlay" onClick={closeModal}>
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
                                    <button
                                        onClick={() => setModalError(null)}
                                        className="ml-2 text-xs underline"
                                    >
                                        Descartar
                                    </button>
                                </div>
                            )}

                            {modalLoading ? (
                                <p className="px-6 text-sm muted">Cargando...</p>
                            ) : (
                                <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="rounded-lg border border-black/10 bg-white/60 p-3">
                                        <h5 className="font-semibold text-sm mb-2">
                                            Disponibles
                                        </h5>
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
                                                                    <div className="text-sm font-semibold">
                                                                        {rule.name}
                                                                    </div>
                                                                    {rule.description && (
                                                                        <p className="text-xs muted line-clamp-2">
                                                                            {rule.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => handleAddRule(rule.id)}
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
                                                                    <div className="text-sm font-semibold">
                                                                        {feat.name}
                                                                    </div>
                                                                    {feat.benefit && (
                                                                        <p className="text-xs muted line-clamp-2">
                                                                            {feat.benefit}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {feat.id && (
                                                                    <button
                                                                        className="btn btn-primary btn-sm"
                                                                        onClick={() => handleAddFeat(feat.id!)}
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
                                                                    <div className="text-sm font-semibold">
                                                                        {spell.name}
                                                                    </div>
                                                                    <p className="text-xs muted line-clamp-2">
                                                                        {spell.summary || spell.description || ""}
                                                                    </p>
                                                                </div>
                                                                {spell.id && (
                                                                    <button
                                                                        className="btn btn-primary btn-sm"
                                                                        onClick={() => handleAddSpell(spell.id!)}
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
                                                                    <div className="text-sm font-semibold">
                                                                        {rule.name}
                                                                    </div>
                                                                    {rule.description && (
                                                                        <p className="text-xs muted line-clamp-2">
                                                                            {rule.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleRemoveRule(rule.id)}
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
                                                                    <div className="text-sm font-semibold">
                                                                        {feat.name}
                                                                    </div>
                                                                    {feat.benefit && (
                                                                        <p className="text-xs muted line-clamp-2">
                                                                            {feat.benefit}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {feat.id && (
                                                                    <button
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() => handleRemoveFeat(feat.id!)}
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
                                                                    <div className="text-sm font-semibold">
                                                                        {spell.name}
                                                                    </div>
                                                                    <p className="text-xs muted line-clamp-2">
                                                                        {spell.summary || spell.description || ""}
                                                                    </p>
                                                                </div>
                                                                {spell.id && (
                                                                    <button
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() => handleRemoveSpell(spell.id!)}
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
                                <button className="btn btn-secondary" onClick={closeModal}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
