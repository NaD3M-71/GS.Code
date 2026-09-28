import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Galeria from "@/components/Galeria";
import { getProyecto } from "@/lib/proyectos";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

// Título y descripción de la pestaña / al compartir el link
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);

  if (!proyecto) return { title: "Proyecto no encontrado" };

  return {
    title: proyecto.titulo,
    description: proyecto.resumen,
    openGraph: proyecto.portada ? { images: [proyecto.portada] } : undefined,
  };
}

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);

  if (!proyecto) notFound();

  return (
    <article className="mx-auto max-w-6xl px-4 py-16">
      <Link href="/proyectos" className="font-mono text-sm text-suave hover:text-neon">
        ← cd ../proyectos
      </Link>

      <header className="mt-6 mb-10">
        <span className="font-mono text-xs text-neon">
          {proyecto.tipo === "propio" ? "// proyecto propio" : "// cliente"}
        </span>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">{proyecto.titulo}</h1>
        <p className="mt-4 text-lg text-suave max-w-3xl">{proyecto.resumen}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        {/* Columna izquierda: imágenes y descripción */}
        <div className="flex flex-col gap-10">
          {proyecto.imagenes.length > 0 ? (
            <Galeria imagenes={proyecto.imagenes} />
          ) : (
            <div className="aspect-video rounded-xl border border-borde bg-panel flex items-center justify-center">
              <Image src="/logo.png" alt="" width={90} height={104} className="opacity-20" />
            </div>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-4">Sobre el proyecto</h2>
            <p className="text-claro/90 leading-relaxed whitespace-pre-line">
              {proyecto.descripcion}
            </p>
          </section>
        </div>

        {/* Columna derecha: ficha técnica */}
        <aside className="h-fit rounded-xl border border-borde bg-panel p-6 flex flex-col gap-6 lg:sticky lg:top-24">
          {proyecto.tecnologias.length > 0 && (
            <div>
              <h2 className="font-mono text-sm text-neon mb-3">stack</h2>
              <ul className="flex flex-wrap gap-2">
                {proyecto.tecnologias.map((tec) => (
                  <li
                    key={tec}
                    className="rounded border border-borde px-2 py-1 font-mono text-xs text-claro"
                  >
                    {tec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(proyecto.url || proyecto.github) && (
            <div className="flex flex-col gap-3">
              {proyecto.url && (
                <a
                  href={proyecto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-neon px-4 py-2 text-center font-bold text-black transition hover:glow-box"
                >
                  Ver sitio
                </a>
              )}
              {proyecto.github && (
                <a
                  href={proyecto.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-neon px-4 py-2 text-center font-bold text-neon transition hover:bg-neon/10"
                >
                  Ver código
                </a>
              )}
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
