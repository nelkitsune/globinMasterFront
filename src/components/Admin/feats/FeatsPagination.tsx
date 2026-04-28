interface FeatsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}

export default function FeatsPagination({
    currentPage,
    totalPages,
    onPrevious,
    onNext,
}: FeatsPaginationProps) {
    return (
        <div className="flex justify-center items-center gap-4 mt-8">
            <button
                onClick={onPrevious}
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-md font-semibold disabled:opacity-50"
                style={{
                    backgroundColor: currentPage === 0 ? "var(--olive-200)" : "var(--olive-600)",
                    color: currentPage === 0 ? "var(--olive-700)" : "white",
                }}
            >
                ← Anterior
            </button>
            <span className="muted">
                Pagina {currentPage + 1} de {totalPages}
            </span>
            <button
                onClick={onNext}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 rounded-md font-semibold disabled:opacity-50"
                style={{
                    backgroundColor: currentPage >= totalPages - 1 ? "var(--olive-200)" : "var(--olive-600)",
                    color: currentPage >= totalPages - 1 ? "var(--olive-700)" : "white",
                }}
            >
                Siguiente →
            </button>
        </div>
    );
}
