"use client";

import { useEffect, useState } from "react";

export interface FormModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    fields: FormField[];
    initialData?: Record<string, any>;
    submitButtonText?: string;
}

export interface FormField {
    name: string;
    label: string;
    type: "text" | "textarea" | "number" | "select";
    required?: boolean;
    placeholder?: string;
    options?: { value: string | number; label: string }[];
    minLength?: number;
    maxLength?: number;
}

/**
 * FormModal: Componente reutilizable para crear/editar recursos
 */
export const FormModal: React.FC<FormModalProps> = ({
    isOpen,
    title,
    onClose,
    onSubmit,
    fields,
    initialData = {},
    submitButtonText = "Guardar",
}) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {});
            setError(null);
        }
    }, [isOpen, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await onSubmit(formData);
            setFormData({});
            onClose();
        } catch (err: any) {
            setError(err?.message || "Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 p-4 overflow-y-auto" onClick={onClose}>
            <div
                className="w-full max-w-md rounded-2xl p-6 shadow-2xl my-auto mx-auto max-h-[calc(100dvh-2rem)] overflow-y-auto"
                style={{ backgroundColor: "var(--card)" }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--olive-900)" }}>
                    {title}
                </h2>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm font-semibold mb-1" style={{ color: "var(--olive-900)" }}>
                                {field.label}
                                {field.required && <span className="text-red-500">*</span>}
                            </label>

                            {field.type === "textarea" ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    maxLength={field.maxLength}
                                    rows={4}
                                    className="w-full p-2 rounded-md border"
                                    style={{
                                        borderColor: "var(--olive-300)",
                                        backgroundColor: "#ffffff",
                                        color: "var(--fg)",
                                    }}
                                />
                            ) : field.type === "select" ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    required={field.required}
                                    className="w-full p-2 rounded-md border"
                                    style={{
                                        borderColor: "var(--olive-300)",
                                        backgroundColor: "#ffffff",
                                        color: "var(--fg)",
                                    }}
                                >
                                    <option value="">-- Selecciona --</option>
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    minLength={field.minLength}
                                    maxLength={field.maxLength}
                                    className="w-full p-2 rounded-md border"
                                    style={{
                                        borderColor: "var(--olive-300)",
                                        backgroundColor: "#ffffff",
                                        color: "var(--fg)",
                                    }}
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 rounded-md font-semibold transition-opacity disabled:opacity-50"
                            style={{
                                backgroundColor: "var(--olive-600)",
                                color: "white",
                            }}
                        >
                            {loading ? "Guardando..." : submitButtonText}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2 rounded-md font-semibold border"
                            style={{
                                borderColor: "var(--olive-300)",
                                color: "var(--olive-700)",
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
