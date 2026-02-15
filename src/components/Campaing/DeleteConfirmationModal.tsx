"use client";
import React from "react";

interface DeleteConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    onConfirm,
    onCancel,
    title = "Confirmar eliminación",
    message,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    isLoading = false,
}) => {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
                <p className="text-sm text-gray-700 mb-4">{message}</p>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Eliminando..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
