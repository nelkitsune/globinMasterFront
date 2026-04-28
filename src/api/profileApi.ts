import { authApi } from "@/lib/authApiClient";

export type UpdateMyProfilePayload = {
    username: string;
};

export type MeUserResponse = {
    id: number;
    username: string;
    email: string;
    avatar_url?: string | null;
    avatarUrl?: string | null;
    role?: string;
    user_code?: string | null;
    active?: number | boolean;
    biography?: string | null;
};

const PROFILE_PATHS = ["/api/users/me", "/users/me"];

export async function getCurrentUserFull(): Promise<MeUserResponse> {
    let lastError: unknown;

    for (const path of PROFILE_PATHS) {
        try {
            const response = await authApi.get(path);
            const rawUser = response.data?.user ?? response.data;
            return rawUser as MeUserResponse;
        } catch (error: any) {
            const status = error?.response?.status;
            const shouldTryNext = status === 404 || status === 405;

            if (shouldTryNext) {
                lastError = error;
                continue;
            }

            throw error;
        }
    }

    throw lastError ?? new Error("No se encontró endpoint para obtener perfil completo.");
}

const UPDATE_PROFILE_PATHS = ["/api/users/me", "/users/me"];

export async function updateMyProfile(payload: UpdateMyProfilePayload): Promise<MeUserResponse> {
    const methods: Array<"patch" | "put"> = ["patch", "put"];
    let lastError: unknown;

    for (const method of methods) {
        for (const path of UPDATE_PROFILE_PATHS) {
            try {
                const response = await authApi.request({
                    method,
                    url: path,
                    data: payload,
                });

                const rawUser = response.data?.user ?? response.data;
                return rawUser as MeUserResponse;
            } catch (error: any) {
                const status = error?.response?.status;
                const shouldTryNext = status === 404 || status === 405;

                if (shouldTryNext) {
                    lastError = error;
                    continue;
                }

                throw error;
            }
        }
    }

    throw lastError ?? new Error("No se encontró endpoint para actualizar perfil.");
}