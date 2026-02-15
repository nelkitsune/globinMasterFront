"use client";
import { create } from "zustand";
import { CampaignCharacterResponse } from "@/types/characters";
import {
    listCampaignCharacters,
    removeCharacterFromCampaign,
} from "@/api/campaignCharacterApi";

interface CampaignCharactersState {
    campaignId?: number;
    items: CampaignCharacterResponse[];
    loading: boolean;
    error?: string | null;

    // Actions
    setCampaign: (campaignId: number) => void;
    fetch: () => Promise<void>;
    removeCharacter: (characterId: number) => Promise<void>;
    refresh: () => Promise<void>;
    clearError: () => void;
    resetStore: () => void;
}

export const useCampaignCharactersStore = create<CampaignCharactersState>(
    (set, get) => ({
        campaignId: undefined,
        items: [],
        loading: false,
        error: null,

        // Set campaign and clear items
        setCampaign: (campaignId: number) => {
            set({ campaignId, items: [], error: null });
        },

        // Fetch campaign characters
        fetch: async () => {
            const { campaignId } = get();
            if (!campaignId) {
                console.warn("No campaignId set, skipping fetch");
                return;
            }

            set({ loading: true, error: null });
            try {
                const items = await listCampaignCharacters(campaignId);

                // Only update if campaignId hasn't changed
                const currentCampaignId = get().campaignId;
                if (currentCampaignId === campaignId) {
                    set({ items, loading: false });
                } else {
                    console.warn("Campaign changed during fetch, discarding results");
                    set({ loading: false });
                }
            } catch (error: any) {
                console.error("Error fetching campaign characters:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al cargar personajes de la campaña";
                set({ error: message, loading: false });
            }
        },

        // Remove character from campaign
        removeCharacter: async (characterId: number) => {
            const { campaignId, items } = get();
            if (!campaignId) {
                console.error("No campaignId set");
                return;
            }

            set({ loading: true, error: null });
            try {
                await removeCharacterFromCampaign(campaignId, characterId);

                // Optimistic update - filter by characterId
                set({
                    items: items.filter((item) => item.characterId !== characterId),
                    loading: false,
                });
            } catch (error: any) {
                console.error("Error removing character from campaign:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al eliminar personaje de la campaña";
                set({ error: message, loading: false });
            }
        },

        // Refresh (alias of fetch)
        refresh: async () => {
            await get().fetch();
        },

        // Clear error
        clearError: () => set({ error: null }),

        // Reset store
        resetStore: () =>
            set({
                campaignId: undefined,
                items: [],
                loading: false,
                error: null,
            }),
    })
);
