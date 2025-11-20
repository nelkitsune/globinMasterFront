import { create } from 'zustand';

type IniciativaState = {
    lista: Array<{
        id: number;
        nombre: string;
        hp: number;
        iniciativa: number;
        iniciativaResultado?: number;
        tipo: 'pj' | 'npc';
        estados: string | string[];
        actualmenteTurno?: boolean;
    }>;
    asalto: number;
    agregarALista: (personaje: { id: number; nombre: string; hp: number; iniciativa: number; iniciativaResultado?: number; tipo: 'pj' | 'npc'; estados: string | string[]; }) => void;
    eliminarDeLista: (id: number) => void;
    limpiarLista: () => void;
    ordenarLista: () => void;
    lanzarIniciativa: () => void;
    ponerTurnoActual: () => void;
    sacarTurnoActual: () => void;
    avanzarTurno: () => void;
    editarVida: (id: number, nuevaVida: number) => void; // <-- agregado al tipo
};

export const useIniciativaStore = create<IniciativaState>((set) => ({
    lista: [],
    asalto: 1,
    agregarALista: (personaje: { id: number; nombre: string; hp: number; iniciativa: number; iniciativaResultado?: number; tipo: 'pj' | 'npc'; estados: string | string[]; }) => set((state: IniciativaState) => ({ lista: [...state.lista, personaje] })),
    eliminarDeLista: (id: number) => set((state: IniciativaState) => ({ lista: state.lista.filter((p) => p.id !== id) })),
    limpiarLista: () => set({ lista: [], asalto: 1 }),
    ordenarLista: () => set((state: IniciativaState) => ({ lista: [...state.lista].sort((a, b) => (b.iniciativaResultado ?? 0) - (a.iniciativaResultado ?? 0)) })),
    lanzarIniciativa: () => set((state: IniciativaState) => {
        const nuevaLista = state.lista.map(p => ({
            ...p,
            iniciativaResultado: Math.floor(Math.random() * 20) + 1 + (p.iniciativa ?? 0)
        }));
        nuevaLista.sort((a, b) => (b.iniciativaResultado ?? 0) - (a.iniciativaResultado ?? 0));
        const listaConTurno = nuevaLista.map((p, i) => ({
            ...p,
            actualmenteTurno: i === 0
        }));
        return { lista: listaConTurno, asalto: 1 };
    }),
    ponerTurnoActual: () => set((state: IniciativaState) => {
        const nuevaLista = state.lista.map(p => ({
            ...p,
            actualmenteTurno: true
        }));
        return { lista: nuevaLista };
    }),
    sacarTurnoActual: () => set((state: IniciativaState) => {
        const nuevaLista = state.lista.map(p => ({
            ...p,
            actualmenteTurno: false
        }));
        return { lista: nuevaLista };
    }),
    avanzarTurno: () => set((state: IniciativaState) => {
        if (state.lista.length === 0) return { lista: [], asalto: state.asalto };
        const currentIndex = state.lista.findIndex(p => p.actualmenteTurno);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % state.lista.length;
        const wrapped = currentIndex !== -1 && currentIndex === state.lista.length - 1;
        const nuevaAsalto = wrapped ? state.asalto + 1 : state.asalto;
        const nuevaLista = state.lista.map((p, i) => ({
            ...p,
            actualmenteTurno: i === nextIndex
        }));
        return { lista: nuevaLista, asalto: nuevaAsalto };
    }),
    editarVida: (id: number, nuevaVida: number) => set((state: IniciativaState) => ({
        lista: state.lista.map(p => p.id === id ? { ...p, hp: nuevaVida } : p)
    })),
}));
