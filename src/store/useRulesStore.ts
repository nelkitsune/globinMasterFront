"use client";
import { create } from "zustand";
import {
    RuleCreateRequest,
    RuleResponse,
} from "@/types/rules";
import {
    createRule,
    listMyRules,
    getRule,
    updateRule,
    deleteRule,
} from "@/api/rulesApi";

interface RulesState {
    items: RuleResponse[];
    selected?: RuleResponse;
    loading: boolean;
    error?: string | null;

    // Actions
    fetchMine: () => Promise<void>;
    fetchOne: (id: number) => Promise<void>;
    create: (req: RuleCreateRequest) => Promise<RuleResponse | null>;
    update: (id: number, req: RuleCreateRequest) => Promise<RuleResponse | null>;
    remove: (id: number) => Promise<void>;
    clearSelected: () => void;
    clearError: () => void;
    resetStore: () => void;
}

export const useRulesStore = create<RulesState>((set, get) => ({
    items: [],
    selected: undefined,
    loading: false,
    error: null,

    // Fetch my rules
    fetchMine: async () => {
        set({ loading: true, error: null });
        try {
            const items = await listMyRules();
            set({ items, loading: false });
        } catch (error: any) {
            console.error("Error fetching rules:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al cargar reglas";
            set({ error: message, loading: false });
        }
    },

    // Fetch one rule
    fetchOne: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const rule = await getRule(id);
            set({ selected: rule, loading: false });
        } catch (error: any) {
            console.error("Error fetching rule:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al cargar la regla";
            set({ error: message, loading: false, selected: undefined });
        }
    },

    // Create rule
    create: async (req: RuleCreateRequest) => {
        set({ loading: true, error: null });
        try {
            const rule = await createRule(req);
            set((state) => ({
                items: [...state.items, rule],
                selected: rule,
                loading: false,
            }));
            return rule;
        } catch (error: any) {
            console.error("Error creating rule:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al crear la regla";
            set({ error: message, loading: false });
            return null;
        }
    },

    // Update rule
    update: async (id: number, req: RuleCreateRequest) => {
        set({ loading: true, error: null });
        try {
            const updated = await updateRule(id, req);
            set((state) => ({
                items: state.items.map((item) =>
                    item.id === id ? updated : item
                ),
                selected:
                    state.selected?.id === id
                        ? updated
                        : state.selected,
                loading: false,
            }));
            return updated;
        } catch (error: any) {
            console.error("Error updating rule:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al actualizar la regla";
            set({ error: message, loading: false });
            return null;
        }
    },

    // Remove rule
    remove: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await deleteRule(id);
            set((state) => {
                const filtered = state.items.filter((item) => item.id !== id);
                return {
                    items: filtered,
                    selected:
                        state.selected?.id === id
                            ? undefined
                            : state.selected,
                    loading: false,
                };
            });
        } catch (error: any) {
            console.error("Error deleting rule:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al eliminar la regla";
            set({ error: message, loading: false });
        }
    },

    // Clear selected
    clearSelected: () => {
        set({ selected: undefined });
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },

    // Reset store
    resetStore: () => {
        set({
            items: [],
            selected: undefined,
            loading: false,
            error: null,
        });
    },
}));
