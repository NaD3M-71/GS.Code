import Image from "next/image";
import Link from "next/link";
import type { ProyectoResumen } from "@/lib/proyectos";

export default function ProyectoCard({ proyecto }: { proyecto: ProyectoResumen }) {
  return (
    <article className="group rounded-xl border border-borde bg-panel overflow-hidden flex flex-col transition hover:border-neon hover:glow-box">
      <div className="relative aspect-video bg-negro">
        {proyecto.portada ? (
          <Image
            src={proyecto.portada}
            alt={`Captura de ${proyecto.titulo}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <Image src="/logo.png" alt="" width={60} height={70} className="opacity-30" />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <span className="font-mono text-xs text-neon">
          {proyecto.tipo === "propio" ? "// proyecto propio" : "// cliente"}
        </span>
        <h2 className="text-xl font-bold">{proyecto.titulo}</h2>
        <p className="text-suave text-sm line-clamp-3 flex-1">{proyecto.resumen}</p>

        {proyecto.tecnologias.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {proyecto.tecnologias.map((tec) => (
              <li
                key={tec}
                className="rounded border border-borde px-2 py-0.5 font-mono text-xs text-suave"
              >
                {tec}
              </li>
            ))}
          </ul>
        )}

        <Link
          href={`/proyectos/${proyecto.slug}`}
          className="mt-2 font-bold text-neon hover:underline"
        >
          Ver proyecto →
        </Link>
      </div>
    </article>
  );
}
