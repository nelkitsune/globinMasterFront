"use client";
import { create } from "zustand";
import {
    CharacterCreateRequest,
    CharacterResponse,
} from "@/types/characters";
import {
    createCharacter,
    listCharacters,
    getCharacter,
    updateCharacter,
    deleteCharacter,
    addCharacterToCampaign,
} from "@/api/characterApi";

interface CharactersState {
    items: CharacterResponse[];
    selected?: CharacterResponse;
    loading: boolean;
    error?: string | null;

    // Actions
    fetchAll: () => Promise<void>;
    fetchOne: (id: number) => Promise<void>;
    create: (req: CharacterCreateRequest) => Promise<CharacterResponse | null>;
    update: (
        id: number,
        req: CharacterCreateRequest
    ) => Promise<CharacterResponse | null>;
    remove: (id: number) => Promise<void>;
    addToCampaign: (characterId: number, campaignId: number) => Promise<void>;
    clearError: () => void;
    clearSelected: () => void;
    resetStore: () => void;
}

export const useCharactersStore = create<CharactersState>((set, get) => ({
    items: [],
    selected: undefined,
    loading: false,
    error: null,

    // Fetch all characters
    fetchAll: async () => {
        set({ loading: true, error: null });
        try {
            const items = await listCharacters();
            set({ items, loading: false });
        } catch (error: any) {
            console.error("Error fetching characters:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al cargar personajes";
            set({ error: message, loading: false });
        }
    },

    // Fetch one character
    fetchOne: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const character = await getCharacter(id);
            set({ selected: character, loading: false });
        } catch (error: any) {
            console.error("Error fetching character:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al cargar personaje";
            set({ error: message, loading: false, selected: undefined });
        }
    },

    // Create character
    create: async (req: CharacterCreateRequest) => {
        set({ loading: true, error: null });
        try {
            const newCharacter = await createCharacter(req);
            set((state) => ({
                items: [...state.items, newCharacter],
                selected: newCharacter,
                loading: false,
            }));
            return newCharacter;
        } catch (error: any) {
            console.error("Error creating character:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al crear personaje";
            set({ error: message, loading: false });
            return null;
        }
    },

    // Update character
    update: async (id: number, req: CharacterCreateRequest) => {
        set({ loading: true, error: null });
        try {
            const updatedCharacter = await updateCharacter(id, req);
            set((state) => ({
                items: state.items.map((item) =>
                    item.id === id ? updatedCharacter : item
                ),
                selected:
                    state.selected?.id === id ? updatedCharacter : state.selected,
                loading: false,
            }));
            return updatedCharacter;
        } catch (error: any) {
            console.error("Error updating character:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al actualizar personaje";
            set({ error: message, loading: false });
            return null;
        }
    },

    // Remove character
    remove: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await deleteCharacter(id);
            set((state) => ({
                items: state.items.filter((item) => item.id !== id),
                selected: state.selected?.id === id ? undefined : state.selected,
                loading: false,
            }));
        } catch (error: any) {
            console.error("Error deleting character:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al eliminar personaje";
            set({ error: message, loading: false });
        }
    },

    // Add character to campaign
    addToCampaign: async (characterId: number, campaignId: number) => {
        set({ loading: true, error: null });
        try {
            await addCharacterToCampaign(characterId, campaignId);
            set({ loading: false });
        } catch (error: any) {
            console.error("Error adding character to campaign:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al agregar personaje a la campaña";
            set({ error: message, loading: false });
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Clear selected
    clearSelected: () => set({ selected: undefined }),

    // Reset store on logout
    resetStore: () =>
        set({
            items: [],
            selected: undefined,
            loading: false,
            error: null,
        }),
}));
