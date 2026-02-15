import { authApi } from "@/lib/authApiClient";

export type Campaign = {
    id: number;
    name: string;
    description?: string | null;
    game_system?: string | null;
    setting?: string | null;
    active: boolean;
    imageUrl?: string | null;
    membersCount?: number;
    joinCode?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type CampaignCreate = {
    name: string;
    description?: string | null;
    game_system?: string | null;
    setting?: string | null;
};

export type CampaignUpdate = {
    name?: string;
    description?: string | null;
    game_system?: string | null;
    setting?: string | null;
    active?: boolean;
};

export type AddMemberRequest = {
    joinCode: string;
};

export type MemberResponse = {
    id: number;
    userId: number;
    username: string;
    email: string;
    role: string;
    joinedAt?: string;
};


const CAMPAIGNS_API = "/api/campaigns";

// POST - Create campaign
export const createCampaign = async (
    campaignData: CampaignCreate
): Promise<Campaign> => {
    const response = await authApi.post<Campaign>(
        CAMPAIGNS_API,
        campaignData
    );
    return response.data;
};

// GET - Get all my campaigns
export const getMyCampaigns = async (): Promise<Campaign[]> => {
    const response = await authApi.get<Campaign[]>(CAMPAIGNS_API);
    return response.data;
};

// POST - Add member to campaign
export const addMemberToCampaign = async (
    id: number,
    memberData: AddMemberRequest
): Promise<void> => {
    await authApi.post(`${CAMPAIGNS_API}/${id}/members`, memberData);
};

// GET - Get one campaign by id
export const getCampaignById = async (id: number): Promise<Campaign> => {
    const response = await authApi.get<Campaign>(`${CAMPAIGNS_API}/${id}`);
    return response.data;
};

// PATCH - Update campaign
export const updateCampaign = async (
    id: number,
    campaignData: CampaignUpdate
): Promise<Campaign> => {
    const response = await authApi.patch<Campaign>(
        `${CAMPAIGNS_API}/${id}`,
        campaignData
    );
    return response.data;
};

// DELETE - Soft delete campaign
export const deleteCampaign = async (id: number): Promise<void> => {
    await authApi.delete(`${CAMPAIGNS_API}/${id}`);
};

// GET - Get campaign members
export const getCampaignMembers = async (id: number): Promise<MemberResponse[]> => {
    const response = await authApi.get<MemberResponse[]>(
        `${CAMPAIGNS_API}/${id}/members`
    );
    return response.data;
};

// DELETE - Remove member from campaign
export const removeMemberFromCampaign = async (
    id: number,
    userId: number
): Promise<void> => {
    await authApi.delete(`${CAMPAIGNS_API}/${id}/members/${userId}`);
};

// POST - Transfer campaign ownership
export const transferCampaignOwnership = async (
    id: number,
    toUserId: number
): Promise<void> => {
    await authApi.post(`${CAMPAIGNS_API}/${id}/transfer-owner`, null, {
        params: { toUserId },
    });
};

// GET - List my campaigns (alternative endpoint)
export const listMyCampaigns = async (): Promise<Campaign[]> => {
    const response = await authApi.get<Campaign[]>(`${CAMPAIGNS_API}/my`);
    return response.data;
};

// POST - Join campaign by code
export const joinCampaignByCode = async (code: string): Promise<Campaign> => {
    const response = await authApi.post<Campaign>(`${CAMPAIGNS_API}/join`, {
        code,
    });
    return response.data;
};