import { authApi } from '@/lib/authApiClient';

export interface XpLogParticipant {
    participantType: 'GUEST' | 'USER';
    displayName: string;
    userId?: number;
}

export interface SessionXpLogResponse {
    id: number;
    campaignId: number;
    xpGained: number;
    description?: string;
    createdByUserId: number;
    createdAt: string;
    participants: XpLogParticipant[];
}

export interface CreateXpLogPayload {
    xpGained: number;
    description?: string;
    participantsText: string;
}

export interface XpLogPage {
    content: SessionXpLogResponse[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export const createXpLog = async (
    campaignId: number,
    userId: number,
    payload: CreateXpLogPayload
): Promise<SessionXpLogResponse> => {
    const response = await authApi.post<SessionXpLogResponse>(
        `/api/campaigns/${campaignId}/xp-logs?createdByUserId=${userId}`,
        payload
    );
    return response.data;
};

export const listXpLogs = async (
    campaignId: number,
    page: number = 0,
    size: number = 10
): Promise<XpLogPage> => {
    const response = await authApi.get<{
        content: SessionXpLogResponse[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    }>(
        `/api/campaigns/${campaignId}/xp-logs?page=${page}&size=${size}`
    );

    return {
        content: response.data.content,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        currentPage: response.data.number,
        pageSize: response.data.size,
    };
};
