"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCampaignStore } from "@/store/useCampaignStore";
import { DetalleCampania } from "@/components/Campaing/DetalleCampania";

export default function CampaingDetailPage() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const campaignId = Number(id);

    const { fetchCampaignById, fetchMembers, currentCampaign, members, loading, error } = useCampaignStore();

    useEffect(() => {
        if (!Number.isNaN(campaignId)) {
            fetchCampaignById(campaignId);
            fetchMembers(campaignId);
        }
    }, [campaignId, fetchCampaignById, fetchMembers]);

    if (Number.isNaN(campaignId)) {
        return <div className="p-6">ID de campaña inválido.</div>;
    }

    if (loading && !currentCampaign) {
        return <div className="p-6">Cargando campaña...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    if (!currentCampaign) {
        return <div className="p-6">No se encontró la campaña.</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <DetalleCampania campaign={currentCampaign} members={members} />
        </div>
    );
}
