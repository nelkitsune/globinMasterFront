"use client"

import { BotoneraDeIniciativa } from '@/components/GestorDeIniciativa/BotoneraDeIniciativa'
import { TablaDeIniciativa } from '@/components/GestorDeIniciativa/TablaDeIniciativa'
import React, { useState } from 'react'


export default function GestorDeIniciativa() {

  return (
    <>
      <div className='brand underline'>
        <h1>Gestor de Iniciativa</h1>
      </div>
      <BotoneraDeIniciativa />
      <div>
        <TablaDeIniciativa />
      </div>
    </>
  )
}
