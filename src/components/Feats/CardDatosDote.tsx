import React from 'react'

const clsx = (...args: Array<string | false | null | undefined>) =>
  args.filter(Boolean).join(' ')



interface PreRequisito {
  tipo: string;
  atributo?: string;
  valor?: number;
  nombre?: string;
  href?: string;
}

interface CardDatosDoteProps {
  nombre: string;
  code: string;
  nombreOriginal?: string;
  fuente?: string;
  preRequisitos?: PreRequisito[];
  className?: string;
}

export default function CardDatosDote({
  nombre,
  code,
  nombreOriginal,
  fuente,
  preRequisitos = [],
  className,
}: CardDatosDoteProps) {
  return (
    <article
      className={clsx(
        "w-full max-w-xl md:max-w-2xl rounded-2xl border p-4",
        "bg-[color:var(--olive-100)]/40 shadow-sm ring-1 ring-black/5",
        className
      )}
    >
      {/* Título */}
      <section className="mb-3 rounded-md bg-[color:var(--olive-500)] px-3 py-2 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-olive-900">{nombre}</h2>
        <p className="text-[10px] tracking-widest opacity-70">{code}</p>
      </section>

      {/* Original */}
      {nombreOriginal && (
        <section className="mb-3 rounded-md bg-[color:var(--olive-300)] px-3 py-2">
          <p className="text-sm">
            <strong>Original:</strong> {nombreOriginal}
          </p>
        </section>
      )}

      {/* Prerrequisitos */}
      <section className="mb-3 rounded-md bg-[color:var(--olive-300)] px-3 py-2">
        <p className="mb-2 text-sm font-semibold">Prerrequisitos:</p>

        {preRequisitos.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {preRequisitos.map((p, i) => {
              const texto =
                p.tipo === 'estadistica' || p.tipo === 'atributo'
                  ? `${p.atributo} ${p.valor}`
                  : p.nombre ?? p.tipo;

              const chipClasses =
                "inline-flex items-center rounded-full border border-black/10 " +
                "bg-[color:var(--olive-100)]/60 px-2 py-0.5 text-xs whitespace-nowrap " +
                "transition hover:scale-105";

              return (
                <li key={i}>
                  {p.href ? (
                    <a
                      href={p.href}
                      className={`${chipClasses} hover:bg-[color:var(--olive-500)]/30 hover:underline`}
                    >
                      {texto}
                    </a>
                  ) : (
                    <span className={chipClasses}>{texto}</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm opacity-70">—</p>
        )}
      </section>

      {/* Fuente */}
      {fuente && (
        <section className="rounded-md bg-[color:var(--olive-300)] px-3 py-2">
          <p className="text-sm">
            <strong>Fuente:</strong> {fuente}
          </p>
        </section>
      )}
    </article>
  );
}
