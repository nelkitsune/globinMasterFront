import Link from "next/link";
import type { SpellClass } from "@/api/spellsApi";

interface SpellClassCardProps {
    spellClass: SpellClass;
}

export function SpellClassCard({ spellClass }: SpellClassCardProps) {
    if (!spellClass.id) {
        return null;
    }

    return (
        <Link href={`/spells/class/${spellClass.id}`} className="block h-full">
            <article
                className="h-full rounded-2xl p-6 transition-transform hover:shadow-lg hover:scale-105"
                style={{
                    backgroundColor: "var(--card)",
                    border: "2px solid var(--olive-500)",
                    cursor: "pointer",
                }}
            >
                <h3 className="text-xl font-bold" style={{ color: "var(--olive-900)" }}>
                    {spellClass.name}
                </h3>
                <p className="text-sm muted mt-2">Toca para ver sus conjuros</p>
            </article>
        </Link>
    );
}
