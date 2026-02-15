"use client";
import { create } from "zustand";
import { Spell } from "@/api/spellsApi";
import {
    listMyHomebrewSpells,
    addHomebrewSpellToCampaign,
    listHomebrewSpellsByCampaign,
    removeHomebrewSpellFromCampaign,
} from "@/api/spellsApi";

interface HomebrewSpellsState {
    mine: Spell[];
    campaignItems: Spell[];
    loading: boolean;
    error?: string | null;

    // Actions
    fetchMine: () => Promise<void>;
    fetchByCampaign: (campaignId: number) => Promise<void>;
    addToCampaign: (spellId: number, campaignId: number) => Promise<void>;
    removeFromCampaign: (spellId: number, campaignId: number) => Promise<void>;
    clearError: () => void;
    resetStore: () => void;
}

export const useHomebrewSpellsStore = create<HomebrewSpellsState>(
    (set, get) => ({
        mine: [],
        campaignItems: [],
        loading: false,
        error: null,

        // Fetch my homebrew spells
        fetchMine: async () => {
            set({ loading: true, error: null });
            try {
                const mine = await listMyHomebrewSpells();
                set({ mine, loading: false });
            } catch (error: any) {
                console.error("Error fetching homebrew spells:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al cargar conjuros caseros";
                set({ error: message, loading: false });
            }
        },

        // Fetch campaign homebrew spells
        fetchByCampaign: async (campaignId: number) => {
            set({ loading: true, error: null });
            try {
                const campaignItems = await listHomebrewSpellsByCampaign(campaignId);
                set({ campaignItems, loading: false });
            } catch (error: any) {
                console.error("Error fetching campaign homebrew spells:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al cargar conjuros caseros de la campaña";
                set({ error: message, loading: false });
            }
        },

        // Add spell to campaign
        addToCampaign: async (spellId: number, campaignId: number) => {
            set({ loading: true, error: null });
            try {
                await addHomebrewSpellToCampaign(spellId, campaignId);
                // Refresh campaign spells after adding
                const campaignItems = await listHomebrewSpellsByCampaign(campaignId);
                set({ campaignItems, loading: false });
            } catch (error: any) {
                console.error("Error adding spell to campaign:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al agregar conjuro a la campaña";
                set({ error: message, loading: false });
            }
        },

        // Remove spell from campaign
        removeFromCampaign: async (spellId: number, campaignId: number) => {
            set({ loading: true, error: null });
            try {
                await removeHomebrewSpellFromCampaign(campaignId, spellId);
                // Filter locally for instant UI update
                set((state) => ({
                    campaignItems: state.campaignItems.filter(
                        (spell) => spell.id !== spellId
                    ),
                    loading: false,
                }));
            } catch (error: any) {
                console.error("Error removing spell from campaign:", error);
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al remover conjuro de la campaña";
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
