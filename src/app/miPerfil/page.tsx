"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { uploadMyAvatar } from "@/api/imageUpload";
import { updateMyProfile, getCurrentUserFull } from "@/api/profileApi";
import ProfileHomebrewSection from "@/components/Profile/ProfileHomebrewSection";
import ProfileInfoSection from "@/components/Profile/ProfileInfoSection";
import ProfilePageHeader from "@/components/Profile/ProfilePageHeader";
import ProfileSummaryCard from "@/components/Profile/ProfileSummaryCard";
import { AvatarMessage, ProfileData } from "@/components/Profile/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

const DEFAULT_PROFILE: ProfileData = {
    email: "aventurero@goblinmaster.com",
    username: "dungeon_master_01",
    avatarUrl: null,
};

const resolveAvatarUrl = (source: any): string | null => {
    if (!source) return null;

    const candidates = [source.avatar_url, source.avatarUrl, source.avatar, source.photoUrl];
    for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim().length > 0) {
            return candidate;
        }
    }

    return null;
};

export default function MiPerfilPage() {
    const { user, hydrate, setUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<ProfileData>(DEFAULT_PROFILE);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [avatarMessage, setAvatarMessage] = useState<AvatarMessage | null>(null);
    const [syncedCurrentUser, setSyncedCurrentUser] = useState(false);

    const [editForm, setEditForm] = useState(userData);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (!user) return;

        const mappedProfile: ProfileData = {
            ...DEFAULT_PROFILE,
            username: user.username || DEFAULT_PROFILE.username,
            email: user.email || DEFAULT_PROFILE.email,
            avatarUrl: resolveAvatarUrl(user),
        };

        setUserData(mappedProfile);
        setEditForm(mappedProfile);
    }, [user]);

    useEffect(() => {
        if (!user || syncedCurrentUser) return;

        const syncCurrentUser = async () => {
            try {
                const currentUser = await getCurrentUserFull();
                const mergedUser = {
                    ...user,
                    ...currentUser,
                    avatar_url: resolveAvatarUrl(currentUser) ?? resolveAvatarUrl(user),
                };
                setUser(mergedUser);
            } catch (err) {
                // Fallback: intentar /auth/me si /users/me falla
                try {
                    const { getCurrentUser } = await import("@/lib/authApiClient").then(m => ({ getCurrentUser: m.authEndpoints.getCurrentUser }));
                    const currentUser = await getCurrentUser();
                    const mergedUser = {
                        ...user,
                        ...currentUser,
                        avatar_url: resolveAvatarUrl(currentUser) ?? resolveAvatarUrl(user),
                    };
                    setUser(mergedUser);
                } catch (fallbackErr) {
                    // Ambos endpoints fallaron, usar user actual
                }
            } finally {
                setSyncedCurrentUser(true);
            }
        };

        syncCurrentUser();
    }, [user, setUser, syncedCurrentUser]);

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm(userData);
        setAvatarMessage(null);
    };

    const handleSave = async () => {
        const cleanUsername = editForm.username.trim();

        if (!cleanUsername) {
            setAvatarMessage({ type: "error", text: "El nombre de usuario no puede estar vacío." });
            return;
        }

        setSavingProfile(true);
        setAvatarMessage(null);

        try {
            const updatedUser = await updateMyProfile({ username: cleanUsername });

            const nextProfile: ProfileData = {
                username: updatedUser.username || cleanUsername,
                email: updatedUser.email || editForm.email,
                avatarUrl: updatedUser.avatar_url ?? updatedUser.avatarUrl ?? editForm.avatarUrl,
            };

            setUserData(nextProfile);
            setEditForm(nextProfile);

            setUser({
                id: updatedUser.id ?? user?.id ?? 0,
                username: nextProfile.username,
                email: nextProfile.email,
                avatar_url: nextProfile.avatarUrl,
                role: updatedUser.role ?? user?.role,
                user_code: updatedUser.user_code ?? user?.user_code,
                active: updatedUser.active ?? user?.active,
                biography: updatedUser.biography ?? user?.biography,
            });

            setIsEditing(false);
            setSelectedAvatar(null);
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
                setAvatarPreview(null);
            }
        } catch (error) {
            setAvatarMessage({
                type: "error",
                text: error instanceof Error ? error.message : "No se pudo guardar el perfil.",
            });
        } finally {
            setSavingProfile(false);
        }
    };

    const handleCancel = () => {
        setEditForm(userData);
        setIsEditing(false);
        setSelectedAvatar(null);
        setAvatarMessage(null);

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }

        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
        setSelectedAvatar(file);
        setAvatarMessage(null);
    };

    const handleAvatarUpload = async () => {
        if (!selectedAvatar) {
            setAvatarMessage({ type: "error", text: "Seleccioná una imagen antes de actualizar la foto." });
            return;
        }

        setAvatarLoading(true);
        setAvatarMessage(null);

        try {
            const result = await uploadMyAvatar(selectedAvatar);

            setUserData((prev) => ({ ...prev, avatarUrl: result.avatarUrl }));
            setEditForm((prev) => ({ ...prev, avatarUrl: result.avatarUrl }));

            if (user) {
                setUser({
                    ...user,
                    avatar_url: result.avatarUrl,
                });
            }

            setSelectedAvatar(null);
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
                setAvatarPreview(null);
            }

            setAvatarMessage({ type: "success", text: "Foto de perfil actualizada correctamente." });
        } catch (error) {
            setAvatarMessage({
                type: "error",
                text: error instanceof Error ? error.message : "No se pudo actualizar la foto de perfil.",
            });
        } finally {
            setAvatarLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="container">
                <ProfilePageHeader title="Mi Perfil" subtitle="Gestiona tu información personal" />

                <div className="max-w-3xl mx-auto">
                    <ProfileSummaryCard userData={userData} />

                    <ProfileInfoSection
                        isEditing={isEditing}
                        userData={userData}
                        editForm={editForm}
                        avatarPreview={avatarPreview}
                        selectedAvatar={selectedAvatar}
                        avatarLoading={avatarLoading}
                        savingProfile={savingProfile}
                        avatarMessage={avatarMessage}
                        onEdit={handleEdit}
                        onAvatarFileSelect={handleAvatarFileSelect}
                        onAvatarUpload={handleAvatarUpload}
                        onFormChange={handleChange}
                        onCancel={handleCancel}
                        onSave={handleSave}
                    />

                    <ProfileHomebrewSection />
                </div>
            </div>
        </ProtectedRoute>
    );
}
