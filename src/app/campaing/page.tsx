"use client"


import { BotoneraCrearUnirse } from '@/components/Campaing/BotoneraCrearUnirse'
import { CrearCampaniaModal } from '@/components/Campaing/CrearCampaniaModal'
import { FiltrosAndBarra } from '@/components/Campaing/FiltrosAndBarra'
import { SeccionCampanias } from '@/components/Campaing/SeccionCampanias'
import React, { useState } from 'react'


export default function Campaing() {


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