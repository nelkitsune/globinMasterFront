"use client";

import React, { useEffect, useMemo, useState } from 'react'
import { useCampaignStore } from '@/store/useCampaignStore'
import { useAuthStore } from '@/store/useAuthStore'
import type { CampaignFilterStatus } from '@/api/campaignsApi'

export const FiltrosAndBarra = () => {
    const { fetchMyCampaigns, loading } = useCampaignStore();
    const { isAuthenticated } = useAuthStore();
    const [status, setStatus] = useState<CampaignFilterStatus>('active');
    const [name, setName] = useState('');

    const trimmedName = useMemo(() => name.trim(), [name]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const handler = setTimeout(() => {
            fetchMyCampaigns({ status, name: trimmedName || undefined });
        }, 300);

        return () => clearTimeout(handler);
    }, [status, trimmedName, isAuthenticated, fetchMyCampaigns]);

    const handleSearch = () => {
        if (!isAuthenticated) return;
        fetchMyCampaigns({ status, name: trimmedName || undefined });
    };

    const buttonClass = (value: CampaignFilterStatus) => (
        "cursor-pointer rounded w-30 text-center p-2 " +
        (status === value ? "bg-gray-200 font-semibold" : "hover:bg-gray-200")
    );

    return (
        <div className='flex items-center justify-between mb-4 bg-gray-100 p-4 rounded shadow mt-6'>
            <div className='flex gap-8'>
                <button
                    type="button"
                    className={buttonClass('all')}
                    onClick={() => setStatus('all')}
                >
                    Todas
                </button>
                <button
                    type="button"
                    className={buttonClass('active')}
                    onClick={() => setStatus('active')}
                >
                    Activas
                </button>
                <button
                    type="button"
                    className={buttonClass('archived')}
                    onClick={() => setStatus('archived')}
                >
                    Archivadas
                </button>
                {loading && (
                    <div
                        className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700"
                        aria-label="Cargando"
                    />
                )}
            </div>
            <div className='flex items-center gap-4'>
                <input
                    type="search"
                    placeholder='Buscar campaña...'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                    className='border rounded px-2 py-1 bg-white'
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="border bg-white hover:bg-gray-200 cursor-pointer border rounded px-2"
                    aria-label="Buscar"
                >
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=search" />
                    <span className="material-symbols-outlined">search</span>
                </button>
            </div>
        </div>
    )
}
