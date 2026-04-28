import { Feat } from "@/api/featsApi";

interface FeatsTableProps {
    feats: Feat[];
    onEdit: (feat: Feat) => void;
    onDelete: (id: number) => void;
}

export default function FeatsTable({ feats, onEdit, onDelete }: FeatsTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--olive-300)" }}>
            <table className="w-full">
                <thead style={{ backgroundColor: "var(--olive-100)" }}>
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                        <th className="px-4 py-3 text-left font-semibold">Codigo</th>
                        <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                        <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {feats.map((feat) => (
                        <tr key={feat.id} style={{ borderBottom: "1px solid var(--olive-200)" }}>
                            <td className="px-4 py-3 font-semibold">{feat.name}</td>
                            <td className="px-4 py-3 text-sm muted">{feat.code}</td>
                            <td className="px-4 py-3 text-sm">{Array.isArray(feat.tipo) ? feat.tipo.join(", ") : feat.tipo}</td>
                            <td className="px-4 py-3 text-center flex justify-center gap-2">
                                <button
                                    onClick={() => onEdit(feat)}
                                    className="px-3 py-1 text-sm rounded-md font-semibold transition-colors"
                                    style={{ backgroundColor: "var(--olive-400)", color: "white" }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => feat.id && onDelete(feat.id)}
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
