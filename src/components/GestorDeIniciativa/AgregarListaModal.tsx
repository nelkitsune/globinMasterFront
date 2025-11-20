import React from 'react'
import { useIniciativaStore } from '../../store/useIniciativaStore';

type AgregarListaModalProps = {
    onClose: () => void;
};

export const AgregarListaModal = ({ onClose }: AgregarListaModalProps) => {
    const agregarALista = useIniciativaStore((state) => state.agregarALista);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value;
        const hp = parseInt((form.elements.namedItem('hp') as HTMLInputElement).value);
        const iniciativa = parseInt((form.elements.namedItem('iniciativa') as HTMLInputElement).value);
        const tipo = (form.elements.namedItem('tipo') as HTMLSelectElement).value as 'pj' | 'npc';
        agregarALista({ id: Date.now(), nombre, hp, iniciativa, tipo, estados: [] });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-close" onClick={onClose}>X</div>
                <div className="modal-tabs"><h2>Agregar PJ o NPC a la lista</h2></div>
                <div>
                    <form onSubmit={handleSubmit} className="modal-form">
                        <div>
                            <label htmlFor="nombre">Nombre:</label>
                            <input type="text" id="nombre" name="nombre" required className="modal-input" />
                        </div>
                        <div>
                            <label htmlFor="hp">Puntos de vida:</label>
                            <input type="number" id="hp" name="hp" required className="modal-input" />
                        </div>
                        <div>
                            <label htmlFor="iniciativa">Iniciativa:</label>
                            <input type="number" id="iniciativa" name="iniciativa" required className="modal-input" />
                        </div>
                        <div>
                            <label htmlFor="tipo">Tipo:</label>
                            <select id="tipo" name="tipo" required className="modal-input">
                                <option value="pj">PJ</option>
                                <option value="npc">NPC</option>
                            </select>
                        </div>
                        <div>
                            <button type="submit" className='btn btn-primary btn-primary:focus btn-primary:hover mr-2 mb-2'>Agregar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
