import { Feat } from "@/api/featsApi";

export const PREREQ_KINDS = [
    "FEAT",
    "RACE",
    "CLASS",
    "ALIGNMENT",
    "CHAR_LEVEL",
    "CLASS_LEVEL",
    "CASTER_LEVEL",
    "CAN_CAST",
    "KNOWN_SPELL",
    "ABILITY_SCORE",
    "BAB",
    "SKILL_RANKS",
    "SIZE",
    "DEITY",
    "TAG",
] as const;

export type PrereqKind = (typeof PREREQ_KINDS)[number];

export type PrereqConditionInput = {
    kind: PrereqKind;
    featId?: number | null;
    target?: string;
    intValue?: string;
    featSearch?: string;
};

export type PrereqGroupInput = {
    groupIndex: number;
    conditions: PrereqConditionInput[];
};

export interface FeatFormInput {
    name: string;
    originalName: string;
    code: string;
    tipo: string;
    descripcion: string;
    benefit: string;
    special: string;
    source: string;
    normal: string;
}

export const EMPTY_FORM: FeatFormInput = {
    name: "",
    originalName: "",
    code: "",
    tipo: "",
    descripcion: "",
    benefit: "",
    special: "",
    source: "Core",
    normal: "",
};

export const FEAT_TYPE_OPTIONS = [
    "ARTISTICAS",
    "COOPERATIVAS",
    "AGALLAS",
    "COMBATE",
    "ESTILO",
    "CREACION_DE_OBJETOS",
    "CRITICO",
    "METAMAGICAS",
    "RACIAL",
];

export const ABILITY_OPTIONS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
export const ALIGNMENT_OPTIONS = ["LG", "NG", "CG", "LN", "N", "CN", "LE", "NE", "CE"];
export const SIZE_OPTIONS = ["FINE", "DIMINUTO", "MINUSCULO", "PEQUENO", "MEDIANO", "GRANDE", "ENORME", "GIGANTE", "COLOSAL"];

export const createEmptyCondition = (): PrereqConditionInput => ({
    kind: "FEAT",
    featId: null,
    target: "",
    intValue: "",
    featSearch: "",
});

export const createEmptyGroup = (groupIndex: number): PrereqGroupInput => ({
    groupIndex,
    conditions: [createEmptyCondition()],
});

export const needsIntValue = (kind: PrereqKind) => ["CHAR_LEVEL", "CLASS_LEVEL", "CASTER_LEVEL", "BAB", "ABILITY_SCORE", "SKILL_RANKS", "CAN_CAST"].includes(kind);
export const needsTarget = (kind: PrereqKind) => ["RACE", "CLASS", "ALIGNMENT", "KNOWN_SPELL", "SIZE", "DEITY", "TAG", "ABILITY_SCORE", "SKILL_RANKS"].includes(kind);

export const isEmptyCondition = (condition: PrereqConditionInput) => {
    const target = (condition.target || "").trim();
    const intValue = (condition.intValue || "").trim();
    return !condition.featId && !target && !intValue;
};

export const mapFlattenedToSingleGroup = (feat: Feat): PrereqGroupInput[] => {
    const flattened = feat.prereqGroups || [];
    if (!flattened.length) {
        return [createEmptyGroup(0)];
    }

    return [{
        groupIndex: 0,
        conditions: flattened.map((item) => ({
            kind: (item.tipo as PrereqKind) || "TAG",
            featId: item.featId || null,
            target: item.atributo || item.nombre || "",
            intValue: item.valor !== undefined ? String(item.valor) : "",
            featSearch: item.nombre || "",
        })),
    }];
};
