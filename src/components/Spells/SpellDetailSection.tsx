import type { ReactNode } from "react";

interface SpellDetailSectionProps {
    title: string;
    children: ReactNode;
}

export function SpellDetailSection({ title, children }: SpellDetailSectionProps) {
    return (
        <div className="mb-4 text-sm">
            <p className="font-semibold">{title}</p>
            <div>{children}</div>
        </div>
    );
}
