"use client";

import { useEffect, useMemo, useState } from "react";
import { Feat, listMyHomebrewFeats } from "@/api/featsApi";
import { Spell, listMyHomebrewSpells } from "@/api/spellsApi";
import { listMyRules } from "@/api/rulesApi";
import { RuleResponse } from "@/types/rules";
import HomebrewCampaignOverviewGrid from "./HomebrewCampaignOverviewGrid";
import HomebrewCampaignManageModal from "./HomebrewCampaignManageModal";
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
                <HomebrewCampaignOverviewGrid
                    isOwner={isOwner}
                    campaignRules={campaignRules}
                    campaignFeats={campaignFeats}
                    campaignSpells={campaignSpells}
                    onOpenModal={openModal}
                />
            )}

            {!isOwner && (
                <p className="text-xs muted mt-4">
                    Solo el owner puede gestionar homebrew en esta campana.
                </p>
            )}

            {modalType && (
                <HomebrewCampaignManageModal
                    modalType={modalType}
                    modalLoading={modalLoading}
                    modalError={modalError}
                    busy={busy}
                    availableRules={availableRules}
                    availableFeats={availableFeats}
                    availableSpells={availableSpells}
                    campaignRules={campaignRules}
                    campaignFeats={campaignFeats}
                    campaignSpells={campaignSpells}
                    onClose={closeModal}
                    onDismissError={() => setModalError(null)}
                    onAddRule={handleAddRule}
                    onAddFeat={handleAddFeat}
                    onAddSpell={handleAddSpell}
                    onRemoveRule={handleRemoveRule}
                    onRemoveFeat={handleRemoveFeat}
                    onRemoveSpell={handleRemoveSpell}
                />
            )}
        </section>
    );
}
