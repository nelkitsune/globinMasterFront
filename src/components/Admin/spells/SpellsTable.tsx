import { Spell } from "@/api/spellsApi";

interface SpellsTableProps {
    items: Spell[];
    onEdit: (spell: Spell) => void;
    onDelete: (spell: Spell) => void;
}

export default function SpellsTable({ items, onEdit, onDelete }: SpellsTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--olive-300)" }}>
            <table className="w-full">
                <thead style={{ backgroundColor: "var(--olive-100)" }}>
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                        <th className="px-4 py-3 text-left font-semibold">Escuela</th>
                        <th className="px-4 py-3 text-left font-semibold">Subescuela</th>
                        <th className="px-4 py-3 text-left font-semibold">Objetivo</th>
                        <th className="px-4 py-3 text-left font-semibold">Clases</th>
                        <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((spell) => (
                        <tr key={spell.id} style={{ borderBottom: "1px solid var(--olive-200)" }}>
                            <td className="px-4 py-3 font-semibold">{spell.name}</td>
                            <td className="px-4 py-3 text-sm">{spell.schoolName || spell.schoolCode || spell.escuela || "N/A"}</td>
                            <td className="px-4 py-3 text-sm">{spell.subschoolName || "N/A"}</td>
                            <td className="px-4 py-3 text-sm">{spell.objetivo || spell.target || "N/A"}</td>
                            <td className="px-4 py-3 text-sm">
                                {spell.classLevels && Object.keys(spell.classLevels).length > 0
                                    ? Object.keys(spell.classLevels).join(", ")
                                    : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-center flex justify-center gap-2">
                                <button
                                    onClick={() => onEdit(spell)}
                                    className="px-3 py-1 text-sm rounded-md font-semibold transition-colors"
                                    style={{ backgroundColor: "var(--olive-400)", color: "white" }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(spell)}
                                    className="px-3 py-1 text-sm rounded-md font-semibold transition-colors"
                                    style={{ backgroundColor: "#ef4444", color: "white" }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
