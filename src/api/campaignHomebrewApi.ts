import { authApi } from "@/lib/authApiClient";
import { Feat } from "@/api/featsApi";
import { Spell } from "@/api/spellsApi";
import { RuleResponse } from "@/types/rules";

export type CampaignHomebrewResponse = {
    spells: Spell[];
    feats: Feat[];
    rules: RuleResponse[];
};

const CAMPAIGNS_API = "/api/campaigns";

export const getCampaignHomebrew = async (
    campaignId: number
): Promise<CampaignHomebrewResponse> => {
    const response = await authApi.get<CampaignHomebrewResponse>(
        `${CAMPAIGNS_API}/${campaignId}/homebrew`
    );
    return response.data;
};

export const addCampaignHomebrewSpell = async (
    campaignId: number,
    spellId: number
): Promise<void> => {
    await authApi.post(
        `${CAMPAIGNS_API}/${campaignId}/homebrew/spells/${spellId}`
    );
};

export const removeCampaignHomebrewSpell = async (
    campaignId: number,
    spellId: number
): Promise<void> => {
    await authApi.delete(
        `${CAMPAIGNS_API}/${campaignId}/homebrew/spells/${spellId}`
    );
};

export const addCampaignHomebrewFeat = async (
    campaignId: number,
    featId: number
): Promise<void> => {
    await authApi.post(
        `${CAMPAIGNS_API}/${campaignId}/homebrew/feats/${featId}`
    );
};

export const removeCampaignHomebrewFeat = async (
    campaignId: number,
    featId: number
): Promise<void> => {
    await authApi.delete(
        `${CAMPAIGNS_API}/${campaignId}/homebrew/feats/${featId}`
    );
};

export const addCampaignHomebrewRule = async (
    campaignId: number,
    ruleId: number
): Promise<void> => {
    await authApi.post(
        `${CAMPAIGNS_API}/${campaignId}/homebrew/rules/${ruleId}`
    );
};

export const removeCampaignHomebrewRule = async (
    campaignId: number,
    ruleId: number
): Promise<void> => {
    await authApi.delete(
        `${CAMPAIGNS_API}/${campaignId}/homebrew/rules/${ruleId}`
    );
};
