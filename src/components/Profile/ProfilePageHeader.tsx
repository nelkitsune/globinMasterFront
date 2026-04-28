type ProfilePageHeaderProps = {
    title: string;
    subtitle: string;
};

export default function ProfilePageHeader({ title, subtitle }: ProfilePageHeaderProps) {
    return (
        <div className="text-center mb-8">
            <h1 className="brand text-4xl mb-2" style={{ color: "var(--olive-900)" }}>
                {title}
            </h1>
            <p className="muted text-lg">{subtitle}</p>
        </div>
    );
}
