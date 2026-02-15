export type CampaignCharacterResponse = {
    id: number;
    campaignId: number;
    characterId: number;
    characterName: string;
    isNpc: boolean;
    isDeleted?: boolean;
    deletedAt?: string | null;
};

export type CharacterCreateRequest = {
    userId?: number | null;
    name: string;
    maxHp: number;
    baseInitiative: number;
    isNpc: boolean;
};

export type CharacterResponse = {
    id: number;
    userId?: number | null;
    name: string;
    maxHp: number;
    baseInitiative: number;
    isNpc: boolean;
};
