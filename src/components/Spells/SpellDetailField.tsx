import type { ReactNode } from "react";

interface SpellDetailFieldProps {
    label: string;
    value: ReactNode;
}

export function SpellDetailField({ label, value }: SpellDetailFieldProps) {
    return (
        <div>
            <p className="font-semibold">{label}</p>
            <p>{value}</p>
        </div>
    );
}
