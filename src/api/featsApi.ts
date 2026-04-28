import { api } from "./axiosInstance";

// ==== Tipos de respuesta paginada ====
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}

// ==== Enums de tipos de dotes (alineados con backend) ====
export type FeatType =
  | "ARTISTICAS"
  | "COOPERATIVAS"
  | "AGALLAS"
  | "COMBATE"
  | "ESTILO"
  | "CREACION_DE_OBJETOS"
  | "CRITICO"
  | "METAMAGICAS"
  | "RACIAL";

// ==== Modelo UI preexistente ====

export interface PrereqUI {
  tipo: string;
  atributo?: string;
  valor?: number;
  nombre?: string;
  href?: string;
  featId?: number;
}

export interface Feat {
  id?: number;
  name: string;
  code: string;
  originalName?: string;
  descripcion: string;
  benefit: string;
  special?: string;
  source?: string;
  tipo: string[];
  normal?: string;
  prereqGroups?: PrereqUI[];
  ownerUserId?: number | null;
  ownerUsername?: string | null;
  ownerUserCode?: string | null;
}

// ==== Tipos de API (del punto 1) ====

export type PrereqKind =
  | "FEAT"
  | "RACE"
  | "CLASS"
  | "ALIGNMENT"
  | "CHAR_LEVEL"
  | "CLASS_LEVEL"
  | "CASTER_LEVEL"
  | "CAN_CAST"
  | "KNOWN_SPELL"
  | "ABILITY_SCORE"
  | "BAB"
  | "SKILL_RANKS"
  | "SIZE"
  | "DEITY"
  | "TAG";

export interface ApiPrereqCondition {
  kind: PrereqKind;
  target: string | null;
  intValue: number | null;
  featId: number | null;
}

export interface ApiPrereqGroup {
  groupIndex: number;
  conditions: ApiPrereqCondition[];
}

export interface ApiFeat {
  id: number;
  name: string;
  originalName?: string;
  original_name?: string;
  code: string;
  descripcion: string;
  description?: string;
  source?: string | null;
  benefit: string;
  beneficio?: string;
  special?: string | null;
  especial?: string | null;
  normal?: string | null;
  tipo: string[];
  prereqGroups: ApiPrereqGroup[];
  ownerUserId?: number | null;
  owner_user_id?: number | null;
  userId?: number | null;
  user_id?: number | null;
  ownerUsername?: string | null;
  owner_username?: string | null;
  username?: string | null;
  ownerUserCode?: string | null;
  owner_user_code?: string | null;
  user_code?: string | null;
  createdBy?: {
    id?: number | null;
    username?: string | null;
    user_code?: string | null;
  } | null;
  creator?: {
    id?: number | null;
    username?: string | null;
    user_code?: string | null;
  } | null;
}

const buildFeatHref = (id: number) => `/feats/${id}`;

const mapConditionToUI = (c: ApiPrereqCondition, idToName?: Record<number, string>): PrereqUI => {
  switch (c.kind) {
    case "ABILITY_SCORE":
      return {
        tipo: "ABILITY_SCORE",
        atributo: c.target ?? undefined,
        valor: c.intValue ?? undefined,
      };

    case "BAB":
      return {
        tipo: "BAB",
        valor: c.intValue ?? undefined,
      };

    case "FEAT": {
      const id = c.featId ?? undefined;
      return {
        tipo: "FEAT",
        nombre: id != null ? idToName?.[id] : c.target ?? undefined,
        href: id != null ? buildFeatHref(id) : undefined,
        featId: id,
      };
    }

    case "CHAR_LEVEL":
    case "CLASS_LEVEL":
    case "CASTER_LEVEL":
    case "SKILL_RANKS":
      return {
        tipo: c.kind,
        valor: c.intValue ?? undefined,
        nombre: c.target ?? undefined,
      };

    case "RACE":
    case "CLASS":
    case "ALIGNMENT":
    case "SIZE":
    case "DEITY":
    case "TAG":
    case "KNOWN_SPELL":
    case "CAN_CAST":
      return {
        tipo: c.kind,
        nombre: c.target ?? undefined,
        valor: c.intValue ?? undefined,
      };

    default:
      return {
        tipo: c.kind ?? "UNKNOWN",
        nombre: c.target ?? undefined,
        valor: c.intValue ?? undefined,
      };
  }
};
const flattenPrereqs = (groups: ApiPrereqGroup[] | undefined, idToName?: Record<number, string>): PrereqUI[] => {
  if (!groups || groups.length === 0) return [];
  const ordered = [...groups].sort((a, b) => a.groupIndex - b.groupIndex);
  return ordered.flatMap(g => (g.conditions ?? []).map(c => mapConditionToUI(c, idToName)));
};
export const mapApiFeatToUI = (f: ApiFeat, idToName?: Record<number, string>): Feat => ({
  id: f.id,
  name: f.name,
  code: f.code,
  originalName: f.originalName ?? f.original_name,
  descripcion: f.descripcion ?? f.description ?? "",
  benefit: f.benefit ?? f.beneficio ?? "",
  special: f.special ?? f.especial ?? undefined,
  normal: f.normal ?? undefined,
  source: f.source ?? undefined,
  tipo: Array.isArray(f.tipo) ? f.tipo : (f.tipo ? [f.tipo] : []),
  prereqGroups: flattenPrereqs(f.prereqGroups, idToName),
  ownerUserId: f.ownerUserId ?? f.owner_user_id ?? f.userId ?? f.user_id ?? f.createdBy?.id ?? f.creator?.id ?? null,
  ownerUsername: f.ownerUsername ?? f.owner_username ?? f.username ?? f.createdBy?.username ?? f.creator?.username ?? null,
  ownerUserCode: f.ownerUserCode ?? f.owner_user_code ?? f.user_code ?? f.createdBy?.user_code ?? f.creator?.user_code ?? null,
});

// ==== Lecturas (devuelven UI) ====
export const getFeats = async (
  page: number = 0,
  size: number = 20,
  types?: FeatType[],
  official: boolean = true
): Promise<PaginatedResponse<Feat>> => {
  const buildParams = (safeSize: number): URLSearchParams => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("size", String(safeSize));
    params.append("sort", "name,asc");
    params.append("official", String(official));

    const selectedTypes = (types ?? []).filter(Boolean);
    if (selectedTypes.length === 1) {
      params.append("tipo", selectedTypes[0]);
    } else if (selectedTypes.length > 1) {
      params.append("tipos", selectedTypes.join(","));
    }

    return params;
  };

  const normalizeSize = (value: number): number => {
    if (!Number.isFinite(value)) return 20;
    const rounded = Math.floor(value);
    return Math.min(Math.max(rounded, 1), 100);
  };

  const extractMaxSizeFrom400 = (error: unknown): number | null => {
    const data = (error as { response?: { status?: number; data?: unknown } })?.response;
    if (!data || data.status !== 400) return null;

    const payload = data.data;
    const text =
      typeof payload === "string"
        ? payload
        : payload && typeof payload === "object"
          ? JSON.stringify(payload)
          : "";

    if (!text) return null;

    const match = text.match(/(less than or equal to|max(?:imum)?|<=)\s*(\d{1,3})/i);
    if (!match) return null;

    const parsed = Number(match[2]);
    if (!Number.isFinite(parsed) || parsed < 1) return null;
    return Math.min(parsed, 100);
  };

  const initialSize = normalizeSize(size);
  const attempted = new Set<number>();
  const candidateSizes = [initialSize, 4, 1].map(normalizeSize);

  let lastError: unknown;

  for (const candidate of candidateSizes) {
    if (attempted.has(candidate)) continue;
    attempted.add(candidate);

    try {
      const params = buildParams(candidate);
      const res = await api.get<PaginatedResponse<ApiFeat>>(`/feats?${params.toString()}`);

      const idToName: Record<number, string> = Object.fromEntries(
        (res.data.content ?? []).map(f => [f.id, f.name])
      );

      return {
        ...res.data,
        content: (res.data.content ?? []).map(f => mapApiFeatToUI(f, idToName)),
      };
    } catch (error) {
      lastError = error;
      const maxFromBackend = extractMaxSizeFrom400(error);
      if (maxFromBackend != null && !attempted.has(maxFromBackend)) {
        candidateSizes.push(maxFromBackend);
      }
    }
  }

  throw lastError;
};

const fetchFeatNamesByIds = async (ids: number[]): Promise<Record<number, string>> => {
  const uniq = Array.from(new Set(ids.filter(Boolean)));
  if (uniq.length === 0) return {};
  const pairs = await Promise.all(
    uniq.map(async id => {
      try {
        const r = await api.get<ApiFeat>(`/feats/${id}`);
        return [id, r.data.name] as [number, string];
      } catch {
        return [id, undefined] as [number, string | undefined];
      }
    })
  );
  return Object.fromEntries(pairs.filter(([, name]) => typeof name === "string")) as Record<number, string>;
};

export const getFeatById = async (id: number): Promise<Feat> => {
  const res = await api.get<ApiFeat>(`/feats/${id}`);
  const apiFeat = res.data;
  const referencedIds: number[] = (apiFeat.prereqGroups ?? [])
    .flatMap(g => (g.conditions ?? []).map(c => c.featId).filter((v): v is number => v != null));
  const idToName = await fetchFeatNamesByIds(referencedIds);
  return mapApiFeatToUI(apiFeat, idToName);
};



const mapUIToApiFeat = (feat: Feat): ApiFeat => {
  return {
    id: feat.id ?? 0,
    name: feat.name,
    code: feat.code,
    originalName: feat.originalName,
    descripcion: feat.descripcion,
    benefit: feat.benefit,
    special: feat.special ?? null,
    source: feat.source ?? null,
    tipo: feat.tipo ?? [],
    prereqGroups: [],
  };
};

export const createFeat = async (feat: Feat): Promise<Feat> => {
  const payload = mapUIToApiFeat(feat);
  const res = await api.post<ApiFeat>("/feats", payload);
  return mapApiFeatToUI(res.data);
};

export const updateFeat = async (id: number, feat: Feat): Promise<Feat> => {
  const payload = mapUIToApiFeat(feat);
  const res = await api.put<ApiFeat>(`/feats/${id}`, payload);
  return mapApiFeatToUI(res.data);
};

export const deleteFeat = async (id: number): Promise<void> => {
  await api.delete(`/feats/${id}`);
};

// ===== Homebrew Feats Functions =====

export const listMyHomebrewFeats = async (): Promise<Feat[]> => {
  const response = await api.get<ApiFeat[]>("/feats/mine");
  return response.data.map((f) => mapApiFeatToUI(f));
};

export const addHomebrewFeatToCampaign = async (
  featId: number,
  campaignId: number
): Promise<void> => {
  await api.post(`/feats/${featId}/campaigns/${campaignId}`);
};

export const listHomebrewFeatsByCampaign = async (
  campaignId: number
): Promise<Feat[]> => {
  const response = await api.get<ApiFeat[]>(
    `/feats/campaigns/${campaignId}/homebrew`
  );
  return response.data.map((f) => mapApiFeatToUI(f));
};

export const removeHomebrewFeatFromCampaign = async (
  campaignId: number,
  featId: number
): Promise<void> => {
  await api.delete(`/feats/campaigns/${campaignId}/${featId}`);
};

