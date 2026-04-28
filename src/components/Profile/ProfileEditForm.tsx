import { ChangeEvent } from "react";
import { AvatarMessage, ProfileData } from "./types";

type ProfileEditFormProps = {
    editForm: ProfileData;
    avatarPreview: string | null;
    selectedAvatar: File | null;
    avatarLoading: boolean;
    savingProfile: boolean;
    avatarMessage: AvatarMessage | null;
    onAvatarFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
    onAvatarUpload: () => Promise<void>;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCancel: () => void;
    onSave: () => void;
};

export default function ProfileEditForm({
    editForm,
    avatarPreview,
    selectedAvatar,
    avatarLoading,
    savingProfile,
    avatarMessage,
    onAvatarFileSelect,
    onAvatarUpload,
    onChange,
    onCancel,
    onSave,
}: ProfileEditFormProps) {
    return (
        <form className="space-y-4">
            <div className="modal-field">
                <label className="font-semibold">Foto de perfil</label>

                {(avatarPreview || editForm.avatarUrl) && (
                    <div className="mb-3">
                        <img
                            src={avatarPreview || editForm.avatarUrl || ""}
                            alt="Preview avatar"
                            className="w-24 h-24 rounded-full object-cover border-2"
                            style={{ borderColor: "var(--olive-700)" }}
                        />
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={onAvatarFileSelect}
                        disabled={avatarLoading}
                        className="modal-input"
                    />
                    <button
                        type="button"
                        onClick={onAvatarUpload}
                        disabled={!selectedAvatar || avatarLoading}
                        className="btn btn-primary"
                    >
                        {avatarLoading ? "Subiendo..." : "Actualizar Foto"}
                    </button>
                </div>

                <p className="text-xs muted mt-2">Máximo 5MB • Formatos: JPEG, PNG, WebP</p>

                {avatarMessage && (
                    <p
                        className="text-sm mt-2"
                        style={{ color: avatarMessage.type === "success" ? "#15803d" : "#dc2626" }}
                    >
                        {avatarMessage.text}
                    </p>
                )}
            </div>

            <div className="modal-field">
                <label className="font-semibold">Nombre de Usuario</label>
                <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={onChange}
                    className="modal-input"
                />
            </div>

            <div className="modal-field">
                <label className="font-semibold">Email</label>
                <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    readOnly
                    className="modal-input"
                />
            </div>

            <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                    Cancelar
                </button>
                <button type="button" onClick={onSave} disabled={savingProfile} className="btn btn-primary">
                    {savingProfile ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </form>
    );
}
