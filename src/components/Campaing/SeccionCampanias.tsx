import React, { useEffect } from 'react'
import { CardCampania } from './CardCampania'
import { CrearNuevaCampania } from './CrearNuevaCampania'
import { useCampaignStore } from '@/store/useCampaignStore'
import { useAuthStore } from '@/store/useAuthStore'

export const SeccionCampanias = () => {
    const { fetchMyCampaigns, campaigns } = useCampaignStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyCampaigns();
        }
    }, [isAuthenticated, fetchMyCampaigns]);
    return (
        <div className='mt-6 w-full mx-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
                {campaigns.map((campaign) => (
                    <CardCampania key={campaign.id} campaign={campaign} />

                ))}
                <CrearNuevaCampania />
            </div>
        </div>
    )
}
