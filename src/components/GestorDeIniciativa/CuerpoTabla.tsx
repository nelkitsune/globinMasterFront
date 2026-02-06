import React, { useEffect, useState } from 'react'
import { useIniciativaStore } from '../../store/useIniciativaStore';

interface Iniciativa {
    id: number;
    nombre: string;
    hp: number;
    hpMax?: number;
    iniciativa: number;
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
        ? "bg-gray-300"
        : iniciativa.tipo === "pj"
            ? "bg-green-300"
            : iniciativa.tipo === "npc-enemigo"
                ? "bg-red-300"
                : iniciativa.tipo === "npc-aliado"
                    ? "bg-blue-300"
                    : iniciativa.tipo === "npc-neutral"
                        ? "bg-amber-200"
                        : "bg-white";

    const turnoRingClass = iniciativa.actualmenteTurno
        ? 'ring-4 ring-yellow-500 shadow-lg shadow-yellow-400/50'
        : 'ring-1 ring-gray-300';

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
        <div className={`rounded-xl overflow-hidden ${baseBgClass} ${turnoRingClass} transition-all duration-200`}>
            {/* Mobile y Tablet: Layout vertical */}
            <div className="lg:hidden">
                {/* Header con nombre */}
                <div className="p-4 border-b border-gray-400/30">
                    <h3 className="font-bold text-lg">{iniciativa.nombre}</h3>
                    <p className="text-xs text-gray-700 mt-1">
                        Ini base: {iniciativa.iniciativa}
                    </p>
                    {estados && (
                        <p className="text-sm text-gray-700 mt-1">{estados}</p>
                    )}
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-4">
                    {/* HP Controls */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-sm">HP:</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={decrementHp}
                                aria-label="Bajar HP"
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/80 border border-gray-400 hover:bg-white active:scale-95 transition font-bold text-lg shadow-sm"
                            >
                                −
                            </button>
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={hpInput}
                                    onChange={(e) => setHpInput(e.target.value)}
                                    onBlur={(e) => commitHp(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') commitHp((e.target as HTMLInputElement).value);
                                        if (e.key === 'Escape') setHpInput(String(iniciativa.hp));
                                    }}
                                    className="w-16 text-center px-2 py-2 rounded-lg border border-gray-400 text-base font-semibold bg-white shadow-sm"
                                    inputMode="numeric"
                                    pattern="[0-9\-]*"
                                    aria-label={`HP de ${iniciativa.nombre}`}
                                />
                                {iniciativa.hpMax !== undefined && (
                                    <span className="text-sm text-gray-700 font-medium">/ {iniciativa.hpMax}</span>
                                )}
                            </div>
                            <button
                                onClick={incrementHp}
                                aria-label="Subir HP"
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/80 border border-gray-400 hover:bg-white active:scale-95 transition font-bold text-lg shadow-sm"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-400/30">
                        <div className="flex gap-2">
                            <button
                                onClick={onMoveUp}
                                aria-label="Mover arriba"
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-400 hover:bg-white active:scale-95 transition shadow-sm"
                            >
                                ↑
                            </button>
                            <button
                                onClick={onMoveDown}
                                aria-label="Mover abajo"
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/80 border border-gray-400 hover:bg-white active:scale-95 transition shadow-sm"
                            >
                                ↓
                            </button>
                        </div>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition shadow-sm ${isDead ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                            onClick={() => setIsDead(!isDead)}
                        >
                            {isDead ? 'Revivir' : 'Muerto'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop: Layout horizontal tipo tabla */}
            <div className="hidden lg:grid lg:grid-cols-[2fr_1fr] lg:gap-0">
                {/* Columna izquierda: Info y HP */}
                <div className="p-4 flex flex-col gap-3">
                    <div>
                        <h3 className="font-bold text-xl">{iniciativa.nombre}</h3>
                        <p className="text-xs text-gray-700 mt-1">
                            Ini base: {iniciativa.iniciativa}
                        </p>
                        {estados && (
                            <p className="text-sm text-gray-700 mt-1">{estados}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="font-semibold">HP:</span>
                        <button
                            onClick={decrementHp}
                            aria-label="Bajar HP"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 border border-gray-400 hover:bg-white active:scale-95 transition shadow-sm"
                        >
                            −
                        </button>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={hpInput}
                                onChange={(e) => setHpInput(e.target.value)}
                                onBlur={(e) => commitHp(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitHp((e.target as HTMLInputElement).value);
                                    if (e.key === 'Escape') setHpInput(String(iniciativa.hp));
                                }}
                                className="w-20 text-center px-2 py-1.5 rounded-lg border border-gray-400 font-semibold bg-white shadow-sm"
                                inputMode="numeric"
                                pattern="[0-9\-]*"
                                aria-label={`HP de ${iniciativa.nombre}`}
                            />
                            {iniciativa.hpMax !== undefined && (
                                <span className="text-sm text-gray-700">/ {iniciativa.hpMax}</span>
                            )}
                        </div>
                        <button
                            onClick={incrementHp}
                            aria-label="Subir HP"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 border border-gray-400 hover:bg-white active:scale-95 transition shadow-sm"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Columna derecha: Acciones */}
                <div className="p-4 flex items-center justify-end gap-3 border-l border-gray-400/30">
                    <button
                        onClick={onMoveUp}
                        aria-label="Mover arriba"
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/80 border border-gray-400 hover:bg-white active:scale-95 transition shadow-sm"
                    >
                        ↑
                    </button>
                    <button
                        onClick={onMoveDown}
                        aria-label="Mover abajo"
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/80 border border-gray-400 hover:bg-white active:scale-95 transition shadow-sm"
                    >
                        ↓
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition shadow-sm ${isDead ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        onClick={() => setIsDead(!isDead)}
                    >
                        {isDead ? 'Revivir' : 'Muerto'}
                    </button>
                </div>
            </div>
        </div>
    )
}
