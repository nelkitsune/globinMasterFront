interface Rule {
    id?: number;
    nombre: string;
    categoria?: string;
    descripcion: string;
}

interface RulesTableProps {
    rules: Rule[];
    onEdit: (rule: Rule) => void;
    onDelete: (id: number) => void;
}

export default function RulesTable({ rules, onEdit, onDelete }: RulesTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--olive-300)" }}>
            <table className="w-full">
                <thead style={{ backgroundColor: "var(--olive-100)" }}>
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                        <th className="px-4 py-3 text-left font-semibold">Categoria</th>
                        <th className="px-4 py-3 text-left font-semibold">Descripcion</th>
                        <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {rules.map((rule) => (
                        <tr key={rule.id} style={{ borderBottom: "1px solid var(--olive-200)" }}>
                            <td className="px-4 py-3 font-semibold">{rule.nombre}</td>
                            <td className="px-4 py-3 text-sm muted">{rule.categoria || "-"}</td>
                            <td className="px-4 py-3 text-sm">
                                {rule.descripcion?.length > 100
                                    ? `${rule.descripcion.substring(0, 100)}...`
                                    : rule.descripcion || "-"}
                            </td>
                            <td className="px-4 py-3 text-center flex justify-center gap-2">
                                <button
                                    onClick={() => onEdit(rule)}
                                    className="px-3 py-1 text-sm rounded-md font-semibold transition-colors"
                                    style={{ backgroundColor: "var(--olive-400)", color: "white" }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => rule.id && onDelete(rule.id)}
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
