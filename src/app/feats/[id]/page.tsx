import { notFound } from "next/navigation";
import CardDatosDote from "@/components/Feats/CardDatosDote";

import { getFeatById } from "@/api/featsApi";



export default async function FeatDetailPage(props: { params: Promise<{ id: number }> }) {
  const { id } = await props.params;
  const feat = await getFeatById(id);
  if (!feat) notFound();

  return (
    <main className="mx-auto max-w-3xxl p-6 space-y-4">
      <a href="/feats" className="text-sm underline opacity-80">← Volver</a>
      <div className="grid gap-6 items-start 
            grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div>
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{feat.name}</h1>
              <span
                className={
                  "text-xs px-3 py-1 rounded-full border " +
                  (feat.source === "homerule"
                    ? "border-emerald-600/40 bg-emerald-100 text-emerald-900"
                    : "border-slate-400/60 bg-white/60 text-slate-700")
                }
              >
                {feat.source === "homerule" ? "Homerule" : "Oficial"}
              </span>
            </div>
            <br />
            <p className="text-xl opacity-70">
              {feat.descripcion}
            </p>
            {!!feat.prereqGroups?.length && (
              <div>
                <h2 className="text-lg font-semibold">Prerequisitos</h2>
                <ul className="list-disc ml-5">
                  {feat.prereqGroups.map((p, i) => (
                    <li key={i}>
                      {p.tipo === "estadistica" || p.tipo === "atributo"
                        ? `${p.atributo} ${p.valor}`
                        : p.nombre ?? p.tipo}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </header>
          <section className="space-y-2">
            <div>
              <h2 className="text-lg font-semibold">Beneficio</h2>
              <p>{feat.benefit}</p>
            </div>
            {feat.special && (
              <div>
                <h2 className="text-lg font-semibold">Especial</h2>
                <p>{feat.special}</p>
              </div>
            )}
          </section>
        </div>
        <CardDatosDote className="self-start"
          nombre={feat.name}
          code={feat.code}
          nombreOriginal={feat.originalName}
          fuente={feat.source}
          prereqGroups={feat.prereqGroups}
        />
      </div>
    </main>
  );
}
