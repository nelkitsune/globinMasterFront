import { ChangeEvent } from "react";
import { AvatarMessage, ProfileData } from "./types";
import ProfileEditForm from "./ProfileEditForm";
import ProfileViewInfo from "./ProfileViewInfo";

type ProfileInfoSectionProps = {
    isEditing: boolean;
    userData: ProfileData;
    editForm: ProfileData;
    avatarPreview: string | null;
    selectedAvatar: File | null;
    avatarLoading: boolean;
    savingProfile: boolean;
    avatarMessage: AvatarMessage | null;
    onEdit: () => void;
    onAvatarFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
    onAvatarUpload: () => Promise<void>;
    onFormChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onCancel: () => void;
    onSave: () => void;
};

export default function ProfileInfoSection({
    isEditing,
    userData,
    editForm,
    avatarPreview,
    selectedAvatar,
    avatarLoading,
    savingProfile,
    avatarMessage,
    onEdit,
    onAvatarFileSelect,
    onAvatarUpload,
    onFormChange,
    onCancel,
    onSave,
}: ProfileInfoSectionProps) {
    return (
        <div className="p-6 rounded-2xl mb-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="sectionTitle mb-0">Información Personal</h3>
                {!isEditing && (
                    <button onClick={onEdit} className="btn btn-primary">
                        Editar Perfil
                    </button>
                )}
            </div>

            {isEditing ? (
                <ProfileEditForm
                    editForm={editForm}
                    avatarPreview={avatarPreview}
                    selectedAvatar={selectedAvatar}
                    avatarLoading={avatarLoading}
                    savingProfile={savingProfile}
                    avatarMessage={avatarMessage}
                    onAvatarFileSelect={onAvatarFileSelect}
                    onAvatarUpload={onAvatarUpload}
                    onChange={onFormChange}
                    onCancel={onCancel}
                    onSave={onSave}
                />
            ) : (
                <ProfileViewInfo userData={userData} />
            )}
        </div>
    );
}
