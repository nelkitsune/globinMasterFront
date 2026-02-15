"use client";
import { create } from "zustand";
import { Feat } from "@/api/featsApi";
import {
    listMyHomebrewFeats,
    addHomebrewFeatToCampaign,
    listHomebrewFeatsByCampaign,
    removeHomebrewFeatFromCampaign,
} from "@/api/featsApi";

interface HomebrewFeatsState {
    mine: Feat[];
    campaignItems: Feat[];
    loading: boolean;
    error?: string | null;

    // Actions
    fetchMine: () => Promise<void>;
    fetchByCampaign: (campaignId: number) => Promise<void>;
    addToCampaign: (featId: number, campaignId: number) => Promise<void>;
    removeFromCampaign: (featId: number, campaignId: number) => Promise<void>;
    clearError: () => void;
    resetStore: () => void;
}

export const useHomebrewFeatsStore = create<HomebrewFeatsState>(
    (set, get) => ({
        mine: [],
        campaignItems: [],
        loading: false,
        error: null,

        // Fetch my homebrew feats
        fetchMine: async () => {
            set({ loading: true, error: null });
            try {
                const mine = await listMyHomebrewFeats();
                set({ mine, loading: false });
            } catch (error: any) {
                console.error("Error fetching homebrew feats:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al cargar dotes caseros";
                set({ error: message, loading: false });
            }
        },

        // Fetch campaign homebrew feats
        fetchByCampaign: async (campaignId: number) => {
            set({ loading: true, error: null });
            try {
                const campaignItems = await listHomebrewFeatsByCampaign(campaignId);
                set({ campaignItems, loading: false });
            } catch (error: any) {
                console.error("Error fetching campaign homebrew feats:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al cargar dotes caseros de la campaña";
                set({ error: message, loading: false });
            }
        },

        // Add feat to campaign
        addToCampaign: async (featId: number, campaignId: number) => {
            set({ loading: true, error: null });
            try {
                await addHomebrewFeatToCampaign(featId, campaignId);
                // Refresh campaign feats after adding
                const campaignItems = await listHomebrewFeatsByCampaign(campaignId);
                set({ campaignItems, loading: false });
            } catch (error: any) {
                console.error("Error adding feat to campaign:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al agregar dote a la campaña";
                set({ error: message, loading: false });
            }
        },

        // Remove feat from campaign
        removeFromCampaign: async (featId: number, campaignId: number) => {
            set({ loading: true, error: null });
            try {
                await removeHomebrewFeatFromCampaign(campaignId, featId);
                // Filter locally for instant UI update
                set((state) => ({
                    campaignItems: state.campaignItems.filter(
                        (feat) => feat.id !== featId
                    ),
                    loading: false,
                }));
            } catch (error: any) {
                console.error("Error removing feat from campaign:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al remover dote de la campaña";
                set({ error: message, loading: false });
            }
        },

        // Clear error
        clearError: () => {
            set({ error: null });
        },

        // Reset store
        resetStore: () => {
            set({
                mine: [],
                campaignItems: [],
                loading: false,
                error: null,
            });
        },
    })
);
