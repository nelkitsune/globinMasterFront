import React, { useEffect, useState } from 'react'
import { useIniciativaStore } from '../../store/useIniciativaStore';

interface Iniciativa {
    id: number; // <-- agregado
    nombre: string;
    hp: number;
    hpMax?: number; // <-- nuevo: valor máximo opcional
    estados: string | string[];
    iniciativaResultado?: number;
    tipo?: 'pj' | 'npc';
    actualmenteTurno?: boolean;
}

type Props = {
    iniciativa: Iniciativa;
}

export const CuerpoTabla: React.FC<Props> = ({ iniciativa }) => {
    const editarVida = useIniciativaStore(state => state.editarVida);

    const [hpInput, setHpInput] = useState<string>(String(iniciativa.hp));

    useEffect(() => {
        setHpInput(String(iniciativa.hp));
    }, [iniciativa.hp]);

    const estados = Array.isArray(iniciativa.estados)
        ? iniciativa.estados.join(', ')
        : iniciativa.estados;

    const highlightClass = iniciativa.actualmenteTurno
        ? 'bg-green-400'            // turno actual
        : iniciativa.tipo === 'npc'
            ? 'bg-yellow-400'       // NPC
            : 'bg-blue-400';      // PJ

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

    return (
        <>
            <style>{`
                .no-spin::-webkit-outer-spin-button,
                .no-spin::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .no-spin {
                    -moz-appearance: textfield;
                }
                .hp-arrow {
                    width: 36px;
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    background: #f3f4f6;
                    border: 1px solid #d1d5db;
                    cursor: pointer;
                    transition: background .12s, transform .08s;
                    user-select: none;
                }
                .hp-arrow:hover { background: #e5e7eb; transform: translateY(-1px); }
                .hp-arrow:active { transform: translateY(0); }
                .hp-input { padding: 6px 8px; border-radius: 6px; border: 1px solid #d1d5db; }
            `}</style>

            <td>
                <div className={`cell ${highlightClass}`}>
                    <div className="text-lg font-semibold truncate">
                        {iniciativa.nombre}
                    </div>
                    <div className="text-center error-message font-bold flex items-center gap-3">
                        <button
                            onClick={incrementHp}
                            aria-label="Subir HP"
                            className="hp-arrow"
                            title="Subir HP"
                        >
                            ↑
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="font-medium">Hp:</span>
                            <input
                                type="number"
                                value={hpInput}
                                onChange={(e) => setHpInput(e.target.value)}
                                onBlur={(e) => commitHp(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitHp((e.target as HTMLInputElement).value);
                                    if (e.key === 'Escape') setHpInput(String(iniciativa.hp));
                                }}
                                className="w-20 text-center no-spin hp-input"
                                inputMode="numeric"
                                pattern="[0-9\-]*"
                                aria-label={`HP de ${iniciativa.nombre}`}
                            />
                            <span className="text-sm text-gray-600">
                                {iniciativa.hpMax !== undefined ? ` / ${iniciativa.hpMax}` : ''}
                            </span>
                        </div>

                        <button
                            onClick={decrementHp}
                            aria-label="Bajar HP"
                            className="hp-arrow"
                            title="Bajar HP"
                        >
                            ↓
                        </button>
                    </div>
                </div>
            </td>
            <td className="actions">
                <div className={`cell ${highlightClass}`}>
                    <div className="flex gap-2">
                        <button className='btn btn-primary'>
                            Agregar Estados
                        </button>
                        <button className='btn btn-danger'>
                            Muerto
                        </button>
                    </div>
                </div>
            </td>
        </>
    )
}
