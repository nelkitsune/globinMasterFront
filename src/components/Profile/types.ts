export type ProfileData = {
    email: string;
    username: string;
    avatarUrl: string | null;
};

export type AvatarMessage = {
    type: "success" | "error";
    text: string;
};
