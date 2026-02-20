import { api } from './axiosInstance';

export interface Spell {
    id?: number;
    name: string;
    originalName?: string;
    schoolCode?: string;
    schoolName?: string;
    castingTime?: string;
    rangeText?: string;
    areaText?: string;
    durationText?: string;
    savingThrow?: string;
    spellResistance?: boolean;
    componentsV?: boolean;
    componentsS?: boolean;
    componentsM?: boolean;
    materialDesc?: string;
    description?: string;
    summary?: string;
    source?: string;
    classLevels?: Record<string, number>;
    ownerUserId?: number | null;
    ownerUsername?: string | null;
    ownerUserCode?: string | null;
}

export interface SpellClass {
    id?: number;
    name: string;
    code: string;
}

export interface SpellLevel {
    spellClassLevelId?: number;
    spellClass?: SpellClass;
    level: number;
    spell?: Spell;
}

export interface SpellClassLevelId {
    spellId?: number;
    ClassId: number;
}

export interface SpellSchool {
    id?: number;
    name: string;
    code: string;
}




export const getSpells = async (): Promise<Spell[]> => {
    const response = await api.get('/magic/spells');
    const data = response.data;
    return Array.isArray(data) ? data : (data?.content || data?.data || []);
};

export const getSpellById = async (id: number): Promise<Spell> => {
    const response = await api.get(`/magic/spells/${id}`);
    return response.data;
};

export const getSpellClasses = async (): Promise<SpellClass[]> => {
    const response = await api.get('/magic/spell-classes');
    // Manejar diferentes formatos de respuesta
    const data = response.data;
    return Array.isArray(data) ? data : (data?.content || data?.data || []);
}

export const getSpellSchools = async (): Promise<SpellSchool[]> => {
    const response = await api.get('/magic/spell-schools');
    // Manejar diferentes formatos de respuesta
    const data = response.data;
    return Array.isArray(data) ? data : (data?.content || data?.data || []);
}
export const getSpellLevelsByClassId = async (classId: number): Promise<SpellLevel[]> => {
    const res = await api.get<Spell[] | any>(`/magic/spells/by-class/${classId}`);
    const data = res.data;

    // Esperamos que la API devuelva un array de SpellLevel o de Spell directamente.
    const list: any[] = Array.isArray(data) ? data : [];

    // Normalizar cada elemento a la forma SpellLevel { spell: { name, ... }, level }
    return list.map(item => {
        if (item?.spell) {
            // ya es SpellLevel
            const apiSpell = item.spell;
            const normalizedSpell = {
                ...apiSpell,
                name: apiSpell.name ?? apiSpell.nombre ?? apiSpell.titulo ?? null
            };
            return { ...item, spell: normalizedSpell };
        }

        // viene como Spell suelto -> convertir a SpellLevel-like para la UI
        const apiSpell = item;
        const normalizedSpell = {
            ...apiSpell,
            name: apiSpell.name ?? apiSpell.nombre ?? apiSpell.titulo ?? null
        };
        return { spell: normalizedSpell, level: (apiSpell.level ?? null) };
    }) as SpellLevel[];
};

export const getBySpellClassAndLevel = async (classId: number, level: number): Promise<SpellLevel[]> => {
    const response = await api.get(`/magic/spells/by-class/${classId}/level/${level}`);
    return response.data;
};

export const createSpell = async (spell: Spell): Promise<Spell> => {
    const response = await api.post<Spell>("/magic/spells", spell);
    return response.data;
};

export const updateSpell = async (id: number, spell: Spell): Promise<Spell> => {
    const response = await api.put<Spell>(`/magic/spells/${id}`, spell);
    return response.data;
};

export const deleteSpell = async (id: number): Promise<void> => {
    await api.delete(`/magic/spells/${id}`);
};

// ===== Homebrew Spells Functions =====

export const listMyHomebrewSpells = async (): Promise<Spell[]> => {
    const response = await api.get<Spell[] | { content?: Spell[]; data?: Spell[] }>('/magic/spells/mine');
    const data = response.data;
    const summaryList = Array.isArray(data) ? data : (data?.content || data?.data || []);

    // Si la respuesta es simplificada, obtener los datos completos de cada conjuro
    if (summaryList.length > 0 && !summaryList[0].description) {
        try {
            const fullSpells = await Promise.all(
                summaryList.map((spell: Spell) => spell.id ? getSpellById(spell.id) : Promise.resolve(spell))
            );
            return fullSpells;
        } catch (err) {
            console.error("Error obteniendo datos completos de conjuros:", err);
            return summaryList;
        }
    }

    return summaryList;
};

export const addHomebrewSpellToCampaign = async (
    spellId: number,
    campaignId: number
): Promise<void> => {
    await api.post(`/magic/spells/${spellId}/campaigns/${campaignId}`);
};

export const listHomebrewSpellsByCampaign = async (
    campaignId: number
): Promise<Spell[]> => {
    const response = await api.get<Spell[] | { content?: Spell[]; data?: Spell[] }>(
        `/magic/spells/campaigns/${campaignId}/homebrew`
    );
    const data = response.data;
    const summaryList = Array.isArray(data) ? data : (data?.content || data?.data || []);

    // Si la respuesta es simplificada, obtener los datos completos de cada conjuro
    if (summaryList.length > 0 && !summaryList[0].description) {
        try {
            const fullSpells = await Promise.all(
                summaryList.map((spell: Spell) => spell.id ? getSpellById(spell.id) : Promise.resolve(spell))
            );
            return fullSpells;
        } catch (err) {
            console.error("Error obteniendo datos completos de conjuros de campaña:", err);
            return summaryList;
        }
    }

    return summaryList;
};

export const removeHomebrewSpellFromCampaign = async (
    campaignId: number,
    spellId: number
): Promise<void> => {
    await api.delete(
        `/magic/spells/campaigns/${campaignId}/${spellId}`
    );
};