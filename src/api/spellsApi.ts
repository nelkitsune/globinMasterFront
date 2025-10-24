import {api} from './axiosInstance';

export interface Spell {
    id?: number;
    nombre: string;
    originalName?: string;
    cstingTime: string;
    range: string;
    areaOfEffect?: string;
    duration: string;
    savingThrow?: string;
    spellResistance?: string;
    componentsVerbal: boolean;
    componentsSomatic: boolean;
    componentsMaterial: boolean;
    materialComponents?: string;
    description: string;
    source?: string;
}

export interface SpellClass {
    id?: number;
    nombre: string;
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




export const getSpells = async ():Promise<Spell[]> => {
  const response = await api.get('/spells');
  return response.data;
};

export const getSpellById = async (id: number):Promise<Spell> => {
  const response = await api.get(`/spells/${id}`);
  return response.data;
};