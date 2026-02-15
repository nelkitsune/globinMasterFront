"use client";
import { create } from "zustand";
import {
    Campaign,
    CampaignCreate,
    CampaignUpdate,
    AddMemberRequest,
    MemberResponse,
    createCampaign,
    getMyCampaignsFiltered,
    addMemberToCampaign,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    getCampaignMembers,
    removeMemberFromCampaign,
    transferCampaignOwnership,
    listMyCampaigns,
    joinCampaignByCode,
    CampaignFilterStatus,
} from "@/api/campaignsApi";

interface CampaignState {
    campaigns: Campaign[];
    currentCampaign: Campaign | null;
    members: MemberResponse[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchMyCampaigns: (filters?: { status?: CampaignFilterStatus; name?: string }) => Promise<void>;
    fetchCampaignById: (id: number) => Promise<void>;
    createCampaign: (data: CampaignCreate) => Promise<Campaign | null>;
    updateCampaign: (id: number, data: CampaignUpdate) => Promise<Campaign | null>;
    deleteCampaign: (id: number) => Promise<boolean>;
    addMember: (id: number, data: AddMemberRequest) => Promise<boolean>;
    fetchMembers: (id: number) => Promise<void>;
    removeMember: (campaignId: number, userId: number) => Promise<boolean>;
    transferOwnership: (campaignId: number, toUserId: number) => Promise<boolean>;
    joinCampaign: (code: string) => Promise<Campaign | null>;
    clearError: () => void;
    clearCurrentCampaign: () => void;
    resetStore: () => void;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
    campaigns: [],
    currentCampaign: null,
    members: [],
    loading: false,
    error: null,

    // Fetch my campaigns
    fetchMyCampaigns: async (filters) => {
        set({ loading: true, error: null });
        try {
            const status = filters?.status ?? "all";
            const name = filters?.name;
            const campaigns = await getMyCampaignsFiltered(status, name);
            const normalized = campaigns.map((campaign) => ({
                ...campaign,
                membersCount: typeof campaign.membersCount === "number" ? campaign.membersCount : 0,
            }));
            set({ campaigns: normalized, loading: false });
        } catch (error: any) {
            console.error("Error fetching campaigns:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al cargar campañas";
            set({ error: message, loading: false });
        }
    },

    // Fetch campaign by ID
    fetchCampaignById: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const campaign = await getCampaignById(id);
            set({ currentCampaign: campaign, loading: false });
        } catch (error: any) {
            console.error("Error fetching campaign:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al cargar la campaña";
            set({ error: message, loading: false, currentCampaign: null });
        }
    },

    // Create campaign
    createCampaign: async (data: CampaignCreate) => {
        set({ loading: true, error: null });
        try {
            const newCampaign = await createCampaign(data);
            set((state) => ({
                campaigns: [...state.campaigns, newCampaign],
                loading: false,
            }));
            return newCampaign;
        } catch (error: any) {
            console.error("Error creating campaign:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al crear la campaña";
            set({ error: message, loading: false });
            return null;
        }
    },

    // Update campaign
    updateCampaign: async (id: number, data: CampaignUpdate) => {
        set({ loading: true, error: null });
        try {
            const updatedCampaign = await updateCampaign(id, data);
            set((state) => ({
                campaigns: state.campaigns.map((c) =>
                    c.id === id ? updatedCampaign : c
                ),
                currentCampaign:
                    state.currentCampaign?.id === id
                        ? updatedCampaign
                        : state.currentCampaign,
                loading: false,
            }));
            return updatedCampaign;
        } catch (error: any) {
            console.error("Error updating campaign:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al actualizar la campaña";
            set({ error: message, loading: false });
            return null;
        }
    },

    // Delete campaign
    deleteCampaign: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await deleteCampaign(id);
            set((state) => ({
                campaigns: state.campaigns.filter((c) => c.id !== id),
                currentCampaign:
                    state.currentCampaign?.id === id ? null : state.currentCampaign,
                loading: false,
            }));
            return true;
        } catch (error: any) {
            console.error("Error deleting campaign:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al eliminar la campaña";
            set({ error: message, loading: false });
            return false;
        }
    },

    // Add member to campaign
    addMember: async (id: number, data: AddMemberRequest) => {
        set({ loading: true, error: null });
        try {
            await addMemberToCampaign(id, data);
            set({ loading: false });
            // Refresh members list
            await get().fetchMembers(id);
            return true;
        } catch (error: any) {
            console.error("Error adding member:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al agregar miembro";
            set({ error: message, loading: false });
            return false;
        }
    },

    // Fetch campaign members
    fetchMembers: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const members = await getCampaignMembers(id);
            set({ members, loading: false });
        } catch (error: any) {
            console.error("Error fetching members:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al cargar miembros";
            set({ error: message, loading: false });
        }
    },

    // Remove member from campaign
    removeMember: async (campaignId: number, userId: number) => {
        set({ loading: true, error: null });
        try {
            await removeMemberFromCampaign(campaignId, userId);
            set((state) => ({
                members: state.members.filter((m) => m.id !== userId),
                loading: false,
            }));
            return true;
        } catch (error: any) {
            console.error("Error removing member:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al eliminar miembro";
            set({ error: message, loading: false });
            return false;
        }
    },

    // Transfer campaign ownership
    transferOwnership: async (campaignId: number, toUserId: number) => {
        set({ loading: true, error: null });
        try {
            await transferCampaignOwnership(campaignId, toUserId);
            set({ loading: false });
            // Refresh campaign data
            await get().fetchCampaignById(campaignId);
            return true;
        } catch (error: any) {
            console.error("Error transferring ownership:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al transferir propiedad";
            set({ error: message, loading: false });
            return false;
        }
    },

    // Join campaign by code
    joinCampaign: async (code: string) => {
        set({ loading: true, error: null });
        try {
            const campaign = await joinCampaignByCode(code);
            set((state) => ({
                campaigns: [...state.campaigns, campaign],
                loading: false,
            }));
            return campaign;
        } catch (error: any) {
            console.error("Error joining campaign:", error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Error al unirse a la campaña";
            set({ error: message, loading: false });
            return null;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Clear current campaign
    clearCurrentCampaign: () => set({ currentCampaign: null, members: [] }),

    // Reset store on logout
    resetStore: () => set({
        campaigns: [],
        currentCampaign: null,
        members: [],
        loading: false,
        error: null,
    }),
}));
