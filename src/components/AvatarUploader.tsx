"use client";
import { useState } from "react";
import { uploadMyAvatar } from "@/api/imageUpload";

/**
 * Componente ejemplo para subir avatar del usuario logueado
 * Incluye:
 * - Input file con validación
 * - Preview de imagen
 * - Botón subir deshabilitado mientras se carga
 * - Mensajes de estado y error
 */
export function AvatarUploader() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Maneja la selección de archivo
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Crear preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setSelectedFile(file);
        setMessage(null);

        return () => URL.revokeObjectURL(objectUrl);
    };

    // Maneja la subida
    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await uploadMyAvatar(selectedFile);
            setAvatarUrl(result.avatarUrl);
            setMessage({
                type: "success",
                text: "Avatar subido exitosamente",
            });
            setSelectedFile(null);
            setPreview(null);
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Error desconocido",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2>Cambiar Avatar</h2>

            {/* Preview */}
            {preview && (
                <div style={{ marginBottom: "15px" }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            borderRadius: "4px",
                        }}
                    />
                </div>
            )}

            {/* Avatar subido exitosamente */}
            {avatarUrl && (
                <div style={{ marginBottom: "15px" }}>
                    <p style={{ color: "#666", marginBottom: "10px" }}>
                        Avatar actual:
                    </p>
                    <img
                        src={avatarUrl}
                        alt="Avatar actual"
                        style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            borderRadius: "4px",
                            border: "2px solid #4caf50",
                        }}
                    />
                </div>
            )}

            {/* Input file */}
            <div style={{ marginBottom: "15px" }}>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    disabled={isLoading}
                    style={{
                        padding: "8px",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.6 : 1,
                    }}
                />
                <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                    Máximo 5MB • Formatos: JPEG, PNG, WebP
                </p>
            </div>

            {/* Botón subir */}
            <button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                style={{
                    padding: "10px 20px",
                    backgroundColor: selectedFile && !isLoading ? "#4caf50" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: selectedFile && !isLoading ? "pointer" : "not-allowed",
                    fontSize: "14px",
                }}
            >
                {isLoading ? "Subiendo..." : "Subir Avatar"}
            </button>

            {/* Mensajes */}
            {message && (
                <div
                    style={{
                        marginTop: "15px",
                        padding: "10px",
                        borderRadius: "4px",
                        backgroundColor: message.type === "success" ? "#e8f5e9" : "#ffebee",
                        color: message.type === "success" ? "#2e7d32" : "#c62828",
                        border: `1px solid ${message.type === "success" ? "#4caf50" : "#f44336"
                            }`,
                    }}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
}
