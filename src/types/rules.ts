export type RuleCreateRequest = {
    name: string;
    originalName?: string | null;
    description: string;
    pages?: string | null;
    books?: string | null;
};

export type RuleResponse = {
    id: number;
    name: string;
    originalName?: string | null;
    description: string;
    pages?: string | null;
    books?: string | null;
    isCustom: boolean;
    ownerUserId?: number | null;
};
