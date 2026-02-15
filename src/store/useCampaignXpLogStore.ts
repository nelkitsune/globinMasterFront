'use client';

import { create } from 'zustand';
import { createXpLog, listXpLogs, SessionXpLogResponse, CreateXpLogPayload, XpLogPage } from '@/api/campaignXpLogApi';

interface XpLogStore {
    logs: SessionXpLogResponse[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    campaignId: number | null;

    // Actions
    fetchLogs: (campaignId: number, page?: number) => Promise<void>;
    createLog: (campaignId: number, userId: number, payload: CreateXpLogPayload) => Promise<void>;
    addLog: (log: SessionXpLogResponse) => void;
    clearError: () => void;
    resetStore: () => void;
}

export const useCampaignXpLogStore = create<XpLogStore>((set) => ({
    logs: [],
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 0,
    campaignId: null,

    fetchLogs: async (campaignId: number, page: number = 0) => {
        set({ loading: true, error: null });
        try {
            const data: XpLogPage = await listXpLogs(campaignId, page);
            set({
                logs: data.content,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                campaignId,
                loading: false,
            });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Error al cargar los logs de XP',
                loading: false,
            });
        }
    },

    createLog: async (campaignId: number, userId: number, payload: CreateXpLogPayload) => {
        set({ loading: true, error: null });
        try {
            const newLog = await createXpLog(campaignId, userId, payload);
            set((state) => ({
                logs: [newLog, ...state.logs],
                loading: false,
            }));
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Error al crear el log de XP',
                loading: false,
            });
            throw err;
        }
    },

    addLog: (log: SessionXpLogResponse) => {
        set((state) => ({
            logs: [log, ...state.logs],
        }));
    },

    clearError: () => {
        set({ error: null });
    },

    resetStore: () => {
        set({
            logs: [],
            loading: false,
            error: null,
            totalPages: 0,
            currentPage: 0,
            campaignId: null,
        });
    },
}));
