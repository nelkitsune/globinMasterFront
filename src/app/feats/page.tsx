import React from 'react'
import '../globals.css'
export default function FeatsListPage(){
  return (
    <>
    <div className="conteiner">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
            {Array.from({length:18}).map((_, i) => (
              <div 
              key={i}
                className="
                container
                "
                style={{background:`var(--olive-700)`, padding:16, borderRadius:8, boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)", border:"1px solid var(--olive-800)",textAlign:'center'}}
                >
                  Nombre de la dote
        </div>
            ))}
          </div>
    </div>

    </>

  )
}
