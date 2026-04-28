import Link from "next/link";
import { useState } from "react";

interface AdminFeatureCardProps {
    href: string;
    title: string;
    description: string;
    ctaText: string;
    icon: string;
}

export default function AdminFeatureCard({
    href,
    title,
    description,
    ctaText,
    icon,
}: AdminFeatureCardProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <Link href={href}>
            <div
                className="p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
                style={{
                    backgroundColor: "var(--card)",
                    border: "2px solid var(--olive-500)",
                }}
            >
                <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--olive-900)" }}>
                    {icon} {title}
                </h3>
                <p className="muted mb-4 text-sm">{description}</p>
                <button
                    className="w-full py-2 rounded-md font-semibold transition-colors"
                    style={{
                        backgroundColor: hovered ? "var(--olive-700)" : "var(--olive-600)",
                        color: "white",
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {ctaText}
                </button>
            </div>
        </Link>
    );
}
