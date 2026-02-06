import { authApi } from "@/lib/authApiClient";
import { CampaignCharacterResponse } from "@/types/characters";

const CAMPAIGNS_API = "/api/campaigns";

// GET - List campaign characters
export const listCampaignCharacters = async (
    campaignId: number
): Promise<CampaignCharacterResponse[]> => {
    const response = await authApi.get<CampaignCharacterResponse[]>(
        `${CAMPAIGNS_API}/${campaignId}/characters`
    );
    return response.data;
};

// DELETE - Remove character from campaign
export const removeCharacterFromCampaign = async (
    campaignId: number,
    characterId: number
): Promise<void> => {
    await authApi.delete(
        `${CAMPAIGNS_API}/${campaignId}/characters/${characterId}`
    );
};
