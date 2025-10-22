import React from 'react'

interface PreRequisito {
  tipo: string;
  atributo?: string;
  valor?: number;
  nombre?: string;
}

interface CardDatosDoteProps {
  nombre: string;
  code: string;
  nombreOriginal?: string;
  fuente?: string;
  preRequisitos?: PreRequisito[];
}

export default function CardDatosDote({
  nombre,
  code,
  nombreOriginal,
  fuente,
  preRequisitos = [],
}: CardDatosDoteProps) {
  return (
    <article className="border rounded-xl p-4 bg-olive-100/40">
      <div className='container mb-2 bg-[color:var(--olive-500)] rounded-md text-center'>
        <h2 className="text-2xl font-bold text-olive-900">{nombre}</h2>
      </div>
      <p>
        <strong>Código:</strong> {code}
        <br />
        <strong>Original:</strong> {nombreOriginal}
        <br />
      </p>
      <p>
        <strong>Prerrequisitos:</strong>
      </p>
      {preRequisitos.length > 0 && (
        <ul>
          {preRequisitos.map((p, i) => (
            <li key={i}>
              {p.tipo === "estadistica" || p.tipo === "atributo"
                ? `${p.atributo} ${p.valor}`
                : p.nombre ?? p.tipo}
            </li>
          ))}
        </ul>
      )}
      <p>
        <strong>Fuente:</strong> {fuente}
      </p>
    </article>
  )
}