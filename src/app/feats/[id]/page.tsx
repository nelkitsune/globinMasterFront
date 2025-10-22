import { notFound } from "next/navigation";
import CardDatosDote from "@/components/Feats/CardDatosDote";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Feat = {
  id: number;
  nombre: string;
  code: string;
  nombreOriginal?: string;
  descripcion: string;
  beneficio: string;
  especial?: string;
  fuente?: string;
  preRequisitos?: Array<{ tipo: string; atributo?: string; valor?: number; nombre?: string }>;
};

async function getFeat(id: string): Promise<Feat | null> {
  const res = await fetch(`${API_URL}/feats/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al cargar la dote");
  return res.json();
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const feat = await getFeat(id);
  if (!feat) return { title: "Dote no encontrada" };
  return { title: `${feat.nombre} | Dote`, description: feat.descripcion?.slice(0, 150) };
}

export default async function FeatDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const feat = await getFeat(id);
  if (!feat) notFound();

  return (
    <main className="mx-auto max-w-3xxl p-6 space-y-4">
      <a href="/feats" className="text-sm underline opacity-80">← Volver</a>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div>
            <header>
                <h1 className="text-3xl font-bold">{feat.nombre}</h1>
                <br />
                <p className="text-xl opacity-70">
                    {feat.descripcion}
                </p>
                        {!!feat.preRequisitos?.length && (
                <div>
                    <h2 className="text-lg font-semibold">Prerequisitos</h2>
                    <ul className="list-disc ml-5">
                    {feat.preRequisitos.map((p, i) => (
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
                <p>{feat.beneficio}</p>
                </div>
                {feat.especial && (
                <div>
                    <h2 className="text-lg font-semibold">Especial</h2>
                    <p>{feat.especial}</p>
                </div>
                )}
            </section>
        </div>
        <CardDatosDote
            nombre={feat.nombre}
            code={feat.code}
            nombreOriginal={feat.nombreOriginal}
            fuente={feat.fuente}
            preRequisitos={feat.preRequisitos}
        />
      </div>
    </main>
  );
}
