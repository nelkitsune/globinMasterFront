import { api } from "@/api/axiosInstance";
import { RuleCreateRequest, RuleResponse } from "@/types/rules";

const RULES_API = "/rules";

export const createRule = async (req: RuleCreateRequest): Promise<RuleResponse> => {
    const response = await api.post<RuleResponse>(RULES_API, req);
    return response.data;
};

export const listMyRules = async (): Promise<RuleResponse[]> => {
    const response = await api.get<RuleResponse[]>(`${RULES_API}/mine`);
    return response.data;
};

export const listRules = async (): Promise<RuleResponse[]> => {
    const response = await api.get<RuleResponse[]>(RULES_API);
    return response.data;
};

export const getRule = async (id: number): Promise<RuleResponse> => {
    const response = await api.get<RuleResponse>(`${RULES_API}/${id}`);
    return response.data;
};

export const updateRule = async (
    id: number,
    req: RuleCreateRequest
): Promise<RuleResponse> => {
    const response = await api.patch<RuleResponse>(
        `${RULES_API}/${id}`,
        req
    );
    return response.data;
};

export const deleteRule = async (id: number): Promise<void> => {
    await api.delete(`${RULES_API}/${id}`);
};
