"use client";
import { useState } from "react";
import { uploadCampaignImage } from "@/api/imageUpload";

interface CampaignImageUploaderProps {
    campaignId: number;
    onImageUploadSuccess?: (imageUrl: string) => void;
}

/**
 * Componente ejemplo para subir imagen (cover) de una campaña
 * Incluye:
 * - Input file con validación
 * - Preview de imagen
 * - Botón subir deshabilitado mientras se carga
 * - Mensajes de estado y error
 * - Callback opcional cuando se sube exitosamente
 */
export function CampaignImageUploader({
    campaignId,
    onImageUploadSuccess,
}: CampaignImageUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

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
            const result = await uploadCampaignImage(campaignId, selectedFile);
            setCurrentImageUrl(result.imageUrl);
            setMessage({
                type: "success",
                text: "Imagen de campaña subida exitosamente",
            });
            setSelectedFile(null);
            setPreview(null);

            // Llamar callback si existe
            if (onImageUploadSuccess) {
                onImageUploadSuccess(result.imageUrl);
            }
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
            <h2>Cambiar Portada de Campaña</h2>

            {/* Preview de la nueva imagen */}
            {preview && (
                <div style={{ marginBottom: "15px" }}>
                    <p style={{ color: "#666", marginBottom: "10px", fontSize: "14px" }}>
                        Vista previa:
                    </p>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            borderRadius: "4px",
                            objectFit: "cover",
                        }}
                    />
                </div>
            )}

            {/* Imagen actual */}
            {currentImageUrl && !preview && (
                <div style={{ marginBottom: "15px" }}>
                    <p style={{ color: "#666", marginBottom: "10px", fontSize: "14px" }}>
                        Portada actual:
                    </p>
                    <img
                        src={currentImageUrl}
                        alt="Portada actual"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            borderRadius: "4px",
                            objectFit: "cover",
                            border: "2px solid #4caf50",
                        }}
                    />
                </div>
            )}

            {/* Input file */}
            <div style={{ marginBottom: "15px" }}>
                <label
                    style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                        color: "#333",
                    }}
                >
                    Seleccionar imagen
                </label>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    disabled={isLoading}
                    style={{
                        padding: "8px",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.6 : 1,
                        width: "100%",
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
                    fontWeight: "500",
                }}
            >
                {isLoading ? "Subiendo..." : "Subir Portada"}
            </button>

            {/* Mensajes */}
            {message && (
                <div
                    style={{
                        marginTop: "15px",
                        padding: "12px",
                        borderRadius: "4px",
                        backgroundColor: message.type === "success" ? "#e8f5e9" : "#ffebee",
                        color: message.type === "success" ? "#2e7d32" : "#c62828",
                        border: `1px solid ${message.type === "success" ? "#4caf50" : "#f44336"
                            }`,
                        fontSize: "14px",
                    }}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
}
