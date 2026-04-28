import { ProfileData } from "./types";

type ProfileSummaryCardProps = {
    userData: ProfileData;
};

export default function ProfileSummaryCard({ userData }: ProfileSummaryCardProps) {
    const fallbackInitial = (userData.username || "?").charAt(0).toUpperCase();

    return (
        <div className="flex flex-col items-center mb-8 p-6 rounded-2xl" style={{ backgroundColor: "var(--card)" }}>
            {userData.avatarUrl ? (
                <img
                    src={userData.avatarUrl}
                    alt="Avatar de usuario"
                    className="w-32 h-32 rounded-full mb-4 object-cover border-4"
                    style={{ borderColor: "var(--olive-700)" }}
                />
            ) : (
                <div
                    className="w-32 h-32 rounded-full mb-4 flex items-center justify-center text-6xl font-bold"
                    style={{
                        backgroundColor: "var(--olive-700)",
                        color: "white",
                    }}
                >
                    {fallbackInitial}
                </div>
            )}
            <h2 className="text-2xl font-bold mb-1">{userData.username}</h2>
            <p className="text-sm muted mb-2">@{userData.username}</p>
        </div>
    );
}
