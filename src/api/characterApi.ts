import { authApi } from "@/lib/authApiClient";
import {
    CharacterCreateRequest,
    CharacterResponse,
} from "@/types/characters";

const CHARACTERS_API = "/api/characters";

// POST - Create character
export const createCharacter = async (
    req: CharacterCreateRequest
): Promise<CharacterResponse> => {
    const response = await authApi.post<CharacterResponse>(CHARACTERS_API, req);
    return response.data;
};

// GET - List all characters
export const listCharacters = async (): Promise<CharacterResponse[]> => {
    const response = await authApi.get<CharacterResponse[]>(CHARACTERS_API);
    return response.data;
};

// GET - Get character by id
export const getCharacter = async (id: number): Promise<CharacterResponse> => {
    const response = await authApi.get<CharacterResponse>(
        `${CHARACTERS_API}/${id}`
    );
    return response.data;
};

// PATCH - Update character
export const updateCharacter = async (
    id: number,
    req: CharacterCreateRequest
): Promise<CharacterResponse> => {
    const response = await authApi.patch<CharacterResponse>(
        `${CHARACTERS_API}/${id}`,
        req
    );
    return response.data;
};

// DELETE - Delete character
export const deleteCharacter = async (id: number): Promise<void> => {
    await authApi.delete(`${CHARACTERS_API}/${id}`);
};

// POST - Add character to campaign
export const addCharacterToCampaign = async (
    characterId: number,
    campaignId: number
): Promise<void> => {
    await authApi.post(
        `${CHARACTERS_API}/${characterId}/campaigns/${campaignId}`
    );
};
