import { api } from "./axiosInstance";

export interface PreRequisito {
  tipo: string;
  atributo?: string;
  valor?: number;
  nombre?: string;
  href?: string;
}

export interface Feat {
  id?: number;
  nombre: string;
  code: string;
  nombreOriginal?: string;
  descripcion: string;
  beneficio: string;
  especial?: string;
  fuente?: string;
  preRequisitos?: PreRequisito[];
}

// 🔹 Obtener todas las feats
export const getFeats = async (): Promise<Feat[]> => {
  const res = await api.get("/feats");
  return res.data;
};

// 🔹 Obtener una feat por ID
export const getFeatById = async (id: number): Promise<Feat> => {
  const res = await api.get(`/feats/${id}`);
  return res.data;
};

// 🔹 Crear una nueva feat
export const createFeat = async (feat: Feat): Promise<Feat> => {
  const res = await api.post("/feats", feat);
  return res.data;
};

// 🔹 Actualizar una feat existente
export const updateFeat = async (id: number, feat: Feat): Promise<Feat> => {
  const res = await api.put(`/feats/${id}`, feat);
  return res.data;
};

// 🔹 Eliminar una feat
export const deleteFeat = async (id: number): Promise<void> => {
  await api.delete(`/feats/${id}`);
};
