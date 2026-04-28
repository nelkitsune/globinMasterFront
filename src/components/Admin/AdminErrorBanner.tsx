interface AdminErrorBannerProps {
    message: string;
}

export default function AdminErrorBanner({ message }: AdminErrorBannerProps) {
    return (
        <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
            {message}
        </div>
    );
}
