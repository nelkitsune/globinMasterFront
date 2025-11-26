import React, { useEffect, useState } from 'react'
import { useIniciativaStore } from '../../store/useIniciativaStore';

interface Iniciativa {
    id: number;
    nombre: string;
    hp: number;
    hpMax?: number;
    estados: string | string[];
    iniciativaResultado?: number;
    tipo?: 'pj' | 'npc-enemigo' | 'npc-aliado' | 'npc-neutral';
    actualmenteTurno?: boolean;
}

type Props = {
    iniciativa: Iniciativa;
}

export const CuerpoTabla: React.FC<Props> = ({ iniciativa }) => {
    const editarVida = useIniciativaStore(state => state.editarVida);
    const moverArriba = useIniciativaStore(state => state.moverArriba);
    const moverAbajo = useIniciativaStore(state => state.moverAbajo);
    const avanzarTurno = useIniciativaStore(state => state.avanzarTurno);

    const [hpInput, setHpInput] = useState<string>(String(iniciativa.hp));
    const [isDead, setIsDead] = useState<boolean>(false);

    useEffect(() => {
        setHpInput(String(iniciativa.hp));
    }, [iniciativa.hp]);

    const estados = Array.isArray(iniciativa.estados)
        ? iniciativa.estados.join(', ')
        : iniciativa.estados;

    // Tailwind classes según tipo / estado
    const baseBgClass = isDead
        ? "bg-gray-200"
        : iniciativa.tipo === "pj"
            ? "bg-green-300"
            : iniciativa.tipo === "npc-enemigo"
                ? "bg-red-300"
                : iniciativa.tipo === "npc-aliado"
                    ? "bg-blue-300"
                    : iniciativa.tipo === "npc-neutral"
                        ? "bg-amber-200"
                        : "bg-white";


    const turnoRingClass = iniciativa.actualmenteTurno ? 'ring-4 ring-yellow-500 ring-offset-1 ring-offset-white' : '';

    const commitHp = (value: string) => {
        const n = parseInt(value, 10);
        if (!Number.isNaN(n)) {
            editarVida(iniciativa.id, n);
            setHpInput(String(n));
        } else {
            setHpInput(String(iniciativa.hp));
        }
    };

    const incrementHp = () => {
        editarVida(iniciativa.id, iniciativa.hp + 1);
    };

    const decrementHp = () => {
        editarVida(iniciativa.id, iniciativa.hp - 1);
    };

    const onMoveUp = () => {
        if (iniciativa.actualmenteTurno) {
            avanzarTurno();
        }
        moverArriba(iniciativa.id);
    };

    const onMoveDown = () => {
        if (iniciativa.actualmenteTurno) {
            avanzarTurno();
        }
        moverAbajo(iniciativa.id);
    };

    return (
        <>
            <td className="align-top p-0">
                <div className={`h-full w-full p-3 md:p-4 rounded-md ${baseBgClass} ${turnoRingClass} flex  justify-between`}>
                    <div className="font-semibold truncate text-sm md:text-base lg:text-lg">
                        {iniciativa.nombre}
                    </div>

                    <div className="mt-2 flex items-center gap-2 md:gap-3">
                        <button
                            onClick={incrementHp}
                            aria-label="Subir HP"
                            title="Subir HP"
                            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition text-sm"
                        >
                            ↑
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm md:text-base font-medium">Hp:</span>
                            <input
                                type="number"
                                value={hpInput}
                                onChange={(e) => setHpInput(e.target.value)}
                                onBlur={(e) => commitHp(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitHp((e.target as HTMLInputElement).value);
                                    if (e.key === 'Escape') setHpInput(String(iniciativa.hp));
                                }}
                                className="w-14 md:w-20 lg:w-24 text-center no-spin px-2 py-1 rounded-md border border-gray-300 text-sm md:text-base"
                                inputMode="numeric"
                                pattern="[0-9\-]*"
                                aria-label={`HP de ${iniciativa.nombre}`}
                            />
                            <span className="text-xs md:text-sm text-gray-600">
                                {iniciativa.hpMax !== undefined ? ` / ${iniciativa.hpMax}` : ''}
                            </span>
                        </div>

                        <button
                            onClick={decrementHp}
                            aria-label="Bajar HP"
                            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition text-sm"
                            title="Bajar HP"
                        >
                            ↓
                        </button>
                    </div>

                    {estados && (
                        <div className="mt-2 text-xs md:text-sm text-gray-700">
                            {estados}
                        </div>
                    )}
                </div>
            </td>

            <td className="align-top p-0">
                <div className={`h-full w-full p-3 md:p-4 rounded-md ${baseBgClass} ${turnoRingClass} flex flex-col justify-between`}>
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-2 md:gap-3">
                            <button
                                onClick={onMoveUp}
                                aria-label="Mover arriba"
                                title="Mover arriba"
                                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition text-sm"
                            >
                                ↑
                            </button>

                            <button
                                onClick={onMoveDown}
                                aria-label="Mover abajo"
                                title="Mover abajo"
                                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition text-sm"
                            >
                                ↓
                            </button>
                        </div>

                        <button
                            className={`px-2 md:px-3 py-1 rounded-md text-sm md:text-base text-white ${isDead ? 'bg-green-600' : 'bg-red-500'}`}
                            onClick={() => setIsDead(!isDead)}
                            title="Marcar muerto/vivo"
                        >
                            {isDead ? 'Revivir' : 'Muerto'}
                        </button>
                    </div>

                    {/* espacio inferior para balancear altura si hace falta */}
                    <div aria-hidden className="h-0 md:h-0" />
                </div>
            </td>
        </>
    )
}
