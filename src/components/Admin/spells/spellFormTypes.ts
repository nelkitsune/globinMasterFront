export interface ClassLevel {
    classCode: string;
    level: number;
}

export interface SpellFormState {
    name: string;
    originalName: string;
    castingTime: string;
    rangeText: string;
    areaText: string;
    durationText: string;
    schoolCode: string;
    subschoolId: string;
    target: string;
    savingThrow: boolean;
    savingThrowType: string;
    spellResistance: boolean;
    componentsV: boolean;
    componentsS: boolean;
    componentsM: boolean;
    componentsF: boolean;
    componentsDf: boolean;
    materialDesc: string;
    focusDesc: string;
    divineFocusDesc: string;
    source: string;
    description: string;
    summary: string;
    classLevels: ClassLevel[];
    selectedClassCode: string;
    selectedLevel: string;
}

export const emptySpellForm: SpellFormState = {
    name: "",
    originalName: "",
    castingTime: "",
    rangeText: "",
    areaText: "",
    durationText: "",
    schoolCode: "",
    subschoolId: "",
    target: "",
    savingThrow: false,
    savingThrowType: "",
    spellResistance: false,
    componentsV: false,
    componentsS: false,
    componentsM: false,
    componentsF: false,
    componentsDf: false,
    materialDesc: "",
    focusDesc: "",
    divineFocusDesc: "",
    source: "",
    description: "",
    summary: "",
    classLevels: [],
    selectedClassCode: "",
    selectedLevel: "",
};
