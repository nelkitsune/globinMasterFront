import { api } from "./axiosInstance";

// ==== Modelo UI preexistente ====

export interface PrereqUI {
  tipo: string;        // 'ABILITY_SCORE' | 'BAB' | 'FEAT' | etc.
  atributo?: string;   // 'STR', 'DEX', ...
  valor?: number;      // 13, 1, ...
  nombre?: string;     // nombre de la feat si tipo === 'FEAT'
  href?: string;       // link a la feat si tipo === 'FEAT'
  featId?: number;     // id de la feat referenciada (útil para búsquedas)
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
  tipo: string[];            // <-- AJUSTADO A ARRAY
  prereqGroups?: PrereqUI[]; // <-- UI "aplanada"
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
  target: string | null;    // texto/identificador dependiente del kind (ej: nombre de clase/raza/spell/tag)
  intValue: number | null;  // valores numéricos (niveles, valores de habilidad, ranks, BAB, etc.)
  featId: number | null;    // para FEAT
}

export interface ApiPrereqGroup {
  groupIndex: number;
  conditions: ApiPrereqCondition[];
}

export interface ApiFeat {
  id: number;
  name: string;
  originalName?: string;
  code: string;
  descripcion: string;
  source?: string | null;
  benefit: string;
  special?: string | null;
  tipo: string[];
  prereqGroups: ApiPrereqGroup[];
}

// ==== Helpers de mapeo ====

/** Construye una ruta interna a la feat (ajusta si tu router usa otro path). */
const buildFeatHref = (id: number) => `/feats/${id}`;

/** Mapea UNA condición de la API a un prerequisito UI "aplanado". 
 *  idToName es opcional y si existe se usa para rellenar el nombre de FEAT.
 */
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
      // fallback genérico
      return {
        tipo: c.kind ?? "UNKNOWN",
        nombre: c.target ?? undefined,
        valor: c.intValue ?? undefined,
      };
  }
};

/** Aplana TODOS los grupos de prereqs en una sola lista (conserva el orden por groupIndex). */
const flattenPrereqs = (groups: ApiPrereqGroup[] | undefined, idToName?: Record<number, string>): PrereqUI[] => {
  if (!groups || groups.length === 0) return [];
  const ordered = [...groups].sort((a, b) => a.groupIndex - b.groupIndex);
  return ordered.flatMap(g => (g.conditions ?? []).map(c => mapConditionToUI(c, idToName)));
};

/** Mapea una ApiFeat a tu Feat de UI. idToName opcional para resolver nombres de FEAT referenciadas. */
export const mapApiFeatToUI = (f: ApiFeat, idToName?: Record<number, string>): Feat => ({
  id: f.id,
  name: f.name,
  code: f.code,
  originalName: f.originalName,
  descripcion: f.descripcion,
  benefit: f.benefit,
  special: f.special ?? undefined,
  source: f.source ?? undefined,
  tipo: f.tipo ?? [],
  prereqGroups: flattenPrereqs(f.prereqGroups, idToName),
});

// ==== Lecturas (devuelven UI) ====

// Obtener todas las feats: descargamos la lista, construimos id->name y mapeamos
export const getFeats = async (): Promise<Feat[]> => {
  const res = await api.get<ApiFeat[]>("/feats");
  const apiFeats = res.data ?? [];
  const idToName: Record<number, string> = Object.fromEntries(apiFeats.map(f => [f.id, f.name]));
  return apiFeats.map(f => mapApiFeatToUI(f, idToName));
};

// Helper: pide nombres de feats por ids (usa peticiones individuales)
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
  // extraer featIds referenciados en sus prereqGroups
  const referencedIds: number[] = (apiFeat.prereqGroups ?? [])
    .flatMap(g => (g.conditions ?? []).map(c => c.featId).filter((v): v is number => v != null));
  const idToName = await fetchFeatNamesByIds(referencedIds);
  return mapApiFeatToUI(apiFeat, idToName);
};

// ==== Escrituras ====
// Si tu backend espera el formato ApiFeat (con grupos y condiciones),
// necesitás un mapeo inverso desde la UI a la API.
// Te dejo el "shape" básico y un TODO para implementarlo según tu formulario de edición.

const mapUIToApiFeat = (feat: Feat): ApiFeat => {
  // TODO: reconstruir prereqGroups a partir de feat.prereqGroups (UI aplanado).
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
    prereqGroups: [], // <-- RECONSTRUIR si tu backend lo requiere al crear/editar
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
