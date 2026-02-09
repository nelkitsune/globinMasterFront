import { api } from './axiosInstance';

export interface Spell {
    id?: number;
    name: string;
    originalName?: string;
    castingTime: string;
    rangeText: string;
    areaText?: string;
    durationText: string;
    savingThrow?: string;
    spellResistance?: string;
    componentsV: boolean;
    componentsS: boolean;
    componentsM: boolean;
    materialDesc?: string;
    description: string;
    summary?: string;
    source?: string;
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
    nombre: string;
    code: string;
}




export const getSpells = async (): Promise<Spell[]> => {
    const response = await api.get('/magic/spells');
    return response.data;
};

export const getSpellById = async (id: number): Promise<Spell> => {
    const response = await api.get(`/magic/spells/${id}`);
    return response.data;
};

export const getSpellClasses = async (): Promise<SpellClass[]> => {
    const response = await api.get('/magic/spell-classes');
    return response.data;
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

// ===== Homebrew Spells Functions =====

export const listMyHomebrewSpells = async (): Promise<Spell[]> => {
    const response = await api.get<Spell[]>('/magic/spells/mine');
    return response.data;
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
    const response = await api.get<Spell[]>(
        `/magic/spells/campaigns/${campaignId}/homebrew`
    );
    return response.data;
};

export const removeHomebrewSpellFromCampaign = async (
    campaignId: number,
    spellId: number
): Promise<void> => {
    await api.delete(
        `/magic/spells/campaigns/${campaignId}/${spellId}`
    );
};