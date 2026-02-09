import { authApi } from "@/lib/authApiClient";
import { RuleCreateRequest, RuleResponse } from "@/types/rules";

const RULES_API = "/api/rules";

export const createRule = async (req: RuleCreateRequest): Promise<RuleResponse> => {
    const response = await authApi.post<RuleResponse>(RULES_API, req);
    return response.data;
};

export const listMyRules = async (): Promise<RuleResponse[]> => {
    const response = await authApi.get<RuleResponse[]>(`${RULES_API}/mine`);
    return response.data;
};

export const getRule = async (id: number): Promise<RuleResponse> => {
    const response = await authApi.get<RuleResponse>(`${RULES_API}/${id}`);
    return response.data;
};

export const updateRule = async (
    id: number,
    req: RuleCreateRequest
): Promise<RuleResponse> => {
    const response = await authApi.patch<RuleResponse>(
        `${RULES_API}/${id}`,
        req
    );
    return response.data;
};

export const deleteRule = async (id: number): Promise<void> => {
    await authApi.delete(`${RULES_API}/${id}`);
};
