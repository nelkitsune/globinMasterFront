"use client";

import { AdminGuard } from "@/components/AdminGuard";
import AdminSectionHeader from "@/components/Admin/AdminSectionHeader";
import AdminFeatureCard from "@/components/Admin/AdminFeatureCard";

export default function AdminPage() {
    const modules = [
        {
            href: "/admin/feats",
            title: "Dotes",
            description: "Crear, editar y gestionar dotes disponibles en el sistema.",
            ctaText: "Gestionar Dotes",
            icon: "⚔️",
        },
        {
            href: "/admin/spells",
            title: "Conjuros",
            description: "Crear, editar y gestionar conjuros disponibles en el sistema.",
            ctaText: "Gestionar Conjuros",
            icon: "✨",
        },
        {
            href: "/admin/rules",
            title: "Normas",
            description: "Crear, editar y gestionar normas personalizadas del juego.",
            ctaText: "Gestionar Normas",
            icon: "📜",
        },
    ];

    return (
        <AdminGuard>
            <div className="container">
                <AdminSectionHeader
                    title="Panel de Administración"
                    subtitle="Gestiona dotes, conjuros y normas"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                    {modules.map((module) => (
                        <AdminFeatureCard
                            key={module.href}
                            href={module.href}
                            title={module.title}
                            description={module.description}
                            ctaText={module.ctaText}
                            icon={module.icon}
                        />
                    ))}
                </div>
            </div>
        </AdminGuard>
    );
}
