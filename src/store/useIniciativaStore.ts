import { create } from 'zustand';

type IniciativaState = {
    lista: Array<{
        id: number;
        nombre: string;
        hp: number;
        iniciativa: number;
        iniciativaResultado?: number;
        tipo: 'pj' | 'npc-enemigo' | 'npc-aliado' | 'npc-neutral';
        estados: string | string[];
        actualmenteTurno?: boolean;
    }>;
    asalto: number;
    agregarALista: (personaje: { id: number; nombre: string; hp: number; iniciativa: number; iniciativaResultado?: number; tipo: 'pj' | 'npc-enemigo' | 'npc-aliado' | 'npc-neutral'; estados: string | string[]; }) => void;
    eliminarDeLista: (id: number) => void;
    limpiarLista: () => void;
    ordenarLista: () => void;
    lanzarIniciativa: () => void;
    ponerTurnoActual: () => void;
    sacarTurnoActual: () => void;
    avanzarTurno: () => void;
    editarVida: (id: number, nuevaVida: number) => void; // <-- agregado al tipo
    moverDespuesDe: (idMover: number, idObjetivo: number) => void; // <-- nuevo método
    moverArriba: (id: number) => void; // <-- nuevo método
    moverAbajo: (id: number) => void;  // <-- nuevo método
};

export const useIniciativaStore = create<IniciativaState>((set, get) => ({
    lista: [],
    asalto: 1,
    agregarALista: (personaje: { id: number; nombre: string; hp: number; iniciativa: number; iniciativaResultado?: number; tipo: 'pj' | 'npc-enemigo' | 'npc-aliado' | 'npc-neutral'; estados: string | string[]; }) => set((state: IniciativaState) => ({ lista: [...state.lista, personaje] })),
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
    moverDespuesDe: (idMover: number, idObjetivo: number) => set((state: IniciativaState) => {
        if (idMover === idObjetivo) return { lista: state.lista };
        const idxMover = state.lista.findIndex(p => p.id === idMover);
        const idxObjetivo = state.lista.findIndex(p => p.id === idObjetivo);
        if (idxMover === -1 || idxObjetivo === -1) return { lista: state.lista };
        const item = state.lista[idxMover];
        const nuevaLista = state.lista.filter(p => p.id !== idMover);
        const insertIndex = nuevaLista.findIndex(p => p.id === idObjetivo) + 1;
        nuevaLista.splice(insertIndex, 0, item);
        // Asegurar que no queden múltiples 'actualmenteTurno'
        const turnosTrue = nuevaLista.filter(p => p.actualmenteTurno).length;
        if (turnosTrue > 1) {
            let seen = false;
            return {
                lista: nuevaLista.map(p => {
                    if (p.actualmenteTurno && !seen) { seen = true; return p; }
                    return { ...p, actualmenteTurno: false };
                })
            };
        }
        return { lista: nuevaLista };
    }),
    // nuevo: mover un elemento una posición hacia arriba (índice menor)
    moverArriba: (id: number) => set((state: IniciativaState) => {
        const idx = state.lista.findIndex(p => p.id === id);
        if (idx <= 0) return { lista: state.lista };
        const nueva = [...state.lista];
        const [item] = nueva.splice(idx, 1);
        nueva.splice(idx - 1, 0, item);

        // Normalizar actualmenteTurno: si el item movido tenía el turno, conservarlo en su nueva posición;
        // si no, sólo asegurarse de no tener múltiples true.
        if (item.actualmenteTurno) {
            return {
                lista: nueva.map(p => ({ ...p, actualmenteTurno: p.id === id }))
            };
        }

        const turnosTrue = nueva.filter(p => p.actualmenteTurno).length;
        if (turnosTrue > 1) {
            let seen = false;
            return {
                lista: nueva.map(p => {
                    if (p.actualmenteTurno && !seen) { seen = true; return p; }
                    return { ...p, actualmenteTurno: false };
                })
            };
        }

        return { lista: nueva };
    }),
    // nuevo: mover un elemento una posición hacia abajo (índice mayor)
    moverAbajo: (id: number) => set((state: IniciativaState) => {
        const idx = state.lista.findIndex(p => p.id === id);
        if (idx === -1 || idx >= state.lista.length - 1) return { lista: state.lista };
        const nueva = [...state.lista];
        const [item] = nueva.splice(idx, 1);
        nueva.splice(idx + 1, 0, item);

        // Igual lógica que en moverArriba para mantener correctamente el turno
        if (item.actualmenteTurno) {
            return {
                lista: nueva.map(p => ({ ...p, actualmenteTurno: p.id === id }))
            };
        }

        const turnosTrue = nueva.filter(p => p.actualmenteTurno).length;
        if (turnosTrue > 1) {
            let seen = false;
            return {
                lista: nueva.map(p => {
                    if (p.actualmenteTurno && !seen) { seen = true; return p; }
                    return { ...p, actualmenteTurno: false };
                })
            };
        }

        return { lista: nueva };
    }),
}));
