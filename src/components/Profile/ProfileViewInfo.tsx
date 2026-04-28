import { ProfileData } from "./types";

type ProfileViewInfoProps = {
    userData: ProfileData;
};

export default function ProfileViewInfo({ userData }: ProfileViewInfoProps) {
    return (
        <div className="space-y-4">
            <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "var(--olive-900)" }}>
                    Nombre
                </div>
                <div className="text-base">{userData.username}</div>
            </div>

            <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "var(--olive-900)" }}>
                    Nombre de Usuario
                </div>
                <div className="text-base">@{userData.username}</div>
            </div>

            <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "var(--olive-900)" }}>
                    Email
                </div>
                <div className="text-base">{userData.email}</div>
            </div>
        </div>
    );
}
