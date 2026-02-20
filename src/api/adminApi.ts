import { api } from "./axiosInstance";

// ==== TIPOS PARA ADMIN ====

export interface FeatAdminDTO {
    id?: number;
    name: string;
    originalName?: string;
    code: string;
    descripcion: string;
    benefit: string;
    special?: string;
    tipo?: string | string[];
    source?: string;
    normal?: string;
    official?: boolean;
    prereqGroups?: {
        groupIndex: number;
        conditions: {
            kind: string;
            target?: string | null;
            intValue?: number | null;
            featId?: number | null;
        }[];
    }[];
}

export interface SpellAdminDTO {
    id?: number;
    name: string;
    nivel: number;
    escuela: string;
    tiempoIncantacion: string;
    rango: string;
    componentes: string;
    duracion: string;
    descripcion: string;
    clases?: string[];
}

export interface RuleAdminDTO {
    id?: number;
    nombre: string;
    descripcion: string;
    contenido?: string;
    categoria?: string;
}

// ==== ADMIN API SERVICE ====

export const adminApi = {
    // ===== FEATS =====
    createFeat: async (dto: FeatAdminDTO) => {
        const payload: any = {
            name: dto.name,
            originalName: dto.originalName || dto.name,
            code: dto.code,
            descripcion: dto.descripcion,
            benefit: dto.benefit,
            special: dto.special || undefined,
            source: dto.source || "Core",
            tipo: Array.isArray(dto.tipo) ? dto.tipo.slice(0, 1) : dto.tipo ? [dto.tipo] : [],
            normal: dto.normal?.trim() || undefined,
            official: dto.official ?? true,
            prereqGroups: dto.prereqGroups ?? [],
        };

        const res = await api.post("/feats", payload);
        return res.data;
    },

    updateFeat: async (id: number, dto: FeatAdminDTO) => {
        const payload = {
            ...dto,
            originalName: dto.originalName || dto.name,
            source: dto.source || "Core",
            tipo: Array.isArray(dto.tipo) ? dto.tipo.slice(0, 1) : dto.tipo ? [dto.tipo] : [],
            normal: dto.normal?.trim() || undefined,
            prereqGroups: dto.prereqGroups ?? [],
        };

        const res = await api.put(`/feats/${id}`, payload);
        return res.data;
    },

    deleteFeat: async (id: number) => {
        await api.delete(`/feats/${id}`);
    },

    // ===== SPELLS =====
    createSpell: async (dto: SpellAdminDTO) => {
        const res = await api.post("/admin/spells", dto);
        return res.data;
    },

    updateSpell: async (id: number, dto: SpellAdminDTO) => {
        const res = await api.put(`/admin/spells/${id}`, dto);
        return res.data;
    },

    deleteSpell: async (id: number) => {
        await api.delete(`/admin/spells/${id}`);
    },

    // ===== RULES =====
    createRule: async (dto: RuleAdminDTO) => {
        const res = await api.post("/admin/rules", dto);
        return res.data;
    },

    updateRule: async (id: number, dto: RuleAdminDTO) => {
        const res = await api.put(`/admin/rules/${id}`, dto);
        return res.data;
    },

    deleteRule: async (id: number) => {
        await api.delete(`/admin/rules/${id}`);
    },

    // ===== ANALYTICS/STATS (opcional) =====
    getStats: async () => {
        const res = await api.get("/admin/stats");
        return res.data;
    },
};

// ==== ERROR HANDLING ====
export const handleAdminError = (error: any): string => {
    if (error?.response?.status === 401) {
        return "Sesión expirada. Por favor inicia sesión nuevamente.";
    }
    if (error?.response?.status === 403) {
        return "No tienes permiso para realizar esta acción.";
    }
    if (error?.response?.status === 400) {
        const messages = error?.response?.data?.errors || error?.response?.data?.message;
        return Array.isArray(messages) ? messages.join(", ") : messages || "Error en los datos enviados.";
    }
    if (error?.response?.status === 404) {
        return "Recurso no encontrado.";
    }
    return error?.response?.data?.message || "Error al procesar la solicitud.";
};
