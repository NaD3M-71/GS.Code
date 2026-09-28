import type { Metadata } from "next";
import ProyectoCard from "@/components/ProyectoCard";
import { getProyectos } from "@/lib/proyectos";

export const metadata: Metadata = { title: "Proyectos" };

// Consultar la base en cada visita (así un proyecto nuevo aparece al instante)
export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const proyectos = await getProyectos();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-neon text-sm mb-2">&gt; ls ./proyectos</p>
      <h1 className="text-4xl font-extrabold mb-10">Proyectos</h1>

      {proyectos.length === 0 ? (
        <p className="text-suave">Todavía no hay proyectos cargados.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((proyecto) => (
            <ProyectoCard key={proyecto.id} proyecto={proyecto} />
          ))}
        </div>
      )}
    </section>
  );
}