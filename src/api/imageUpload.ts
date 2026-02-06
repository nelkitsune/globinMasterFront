/**
 * Funciones para subida de imágenes a través del backend
 * Utiliza authApi que incluye token JWT automáticamente
 */
import { authApi } from "@/lib/authApiClient";

// Configuración de validación
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Valida el archivo antes de enviar
 * @throws Error si el archivo no es válido
 */
function validateFile(file: File): void {
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(
            `El archivo es demasiado grande. Máximo 5MB, tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`
        );
    }

    // Validar tipo MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
            `Tipo de archivo no permitido. Solo se aceptan: JPEG, PNG, WebP`
        );
    }

    // Validar extensión (seguridad adicional)
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
        fileName.endsWith(ext)
    );
    if (!hasValidExtension) {
        throw new Error(
            `Extensión de archivo no válida. Solo se aceptan: .jpg, .jpeg, .png, .webp`
        );
    }
}

/**
 * Sube el avatar del usuario logueado
 * @param file - Archivo de imagen
 * @returns Promise con { avatarUrl: string }
 * @throws Error si falla la validación o la subida
 */
export async function uploadMyAvatar(
    file: File
): Promise<{ avatarUrl: string }> {
    validateFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await authApi.post("/api/users/me/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (!response.data || !response.data.avatarUrl) {
            throw new Error("Respuesta inválida del servidor");
        }

        return { avatarUrl: response.data.avatarUrl };
    } catch (error) {
        // Si es un AxiosError con respuesta del servidor, usar el mensaje
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Error desconocido al subir el avatar");
    }
}

/**
 * Sube la imagen (cover) de una campaña
 * @param campaignId - ID de la campaña
 * @param file - Archivo de imagen
 * @returns Promise con { imageUrl: string }
 * @throws Error si falla la validación o la subida
 */
export async function uploadCampaignImage(
    campaignId: number,
    file: File
): Promise<{ imageUrl: string }> {
    validateFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await authApi.post(
            `/api/campaigns/${campaignId}/image`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (!response.data || !response.data.imageUrl) {
            throw new Error("Respuesta inválida del servidor");
        }

        return { imageUrl: response.data.imageUrl };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Error desconocido al subir la imagen de campaña");
    }
}
