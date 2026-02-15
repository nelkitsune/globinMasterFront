"use client"


import { BotoneraCrearUnirse } from '@/components/Campaing/BotoneraCrearUnirse'
import { CrearCampaniaModal } from '@/components/Campaing/CrearCampaniaModal'
import { FiltrosAndBarra } from '@/components/Campaing/FiltrosAndBarra'
import { SeccionCampanias } from '@/components/Campaing/SeccionCampanias'
import ProtectedRoute from '@/components/ProtectedRoute'
import React, { useState } from 'react'


function CampaingContent() {
    return (
        <>
            <BotoneraCrearUnirse />
            <div>
                <section>
                    <FiltrosAndBarra />
                </section>
                <section >
                    <SeccionCampanias />
                </section>
            </div>


        </>
    )
}

export default function Campaing() {
    return (
        <ProtectedRoute>
            <CampaingContent />
        </ProtectedRoute>
    )
}