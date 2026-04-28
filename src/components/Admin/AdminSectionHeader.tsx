import Link from "next/link";

interface AdminSectionHeaderProps {
    title: string;
    subtitle: string;
    backHref?: string;
    createLabel?: string;
    onCreate?: () => void;
}

export default function AdminSectionHeader({
    title,
    subtitle,
    backHref,
    createLabel,
    onCreate,
}: AdminSectionHeaderProps) {
    return (
        <div className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="brand text-4xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                    {title}
                </h1>
                <p className="muted text-lg">{subtitle}</p>
            </div>
            {(backHref || (createLabel && onCreate)) && (
                <div className="flex gap-2">
                    {backHref && (
                        <Link
                            href={backHref}
                            className="px-4 py-2 rounded-md font-semibold"
                            style={{ backgroundColor: "var(--olive-200)", color: "var(--olive-900)" }}
                        >
                            ← Volver
                        </Link>
                    )}
                    {createLabel && onCreate && (
                        <button
                            onClick={onCreate}
                            className="px-4 py-2 rounded-md font-semibold transition-colors"
                            style={{ backgroundColor: "var(--olive-600)", color: "white" }}
                        >
                            {createLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
