import Link from "next/link";
import { notFound } from "next/navigation";
import ProyectoForm from "@/components/admin/ProyectoForm";
import BotonConfirmar from "@/components/admin/BotonConfirmar";
import CasilleroImagen from "@/components/admin/CasilleroImagen";
import { listarImagenes, MAX_IMAGENES } from "@/lib/imagenes";
import { listarTecnologias, obtenerProyectoAdmin } from "@/lib/admin-proyectos";
import { verificarAdmin } from "@/lib/sesion";
import { borrarProyecto } from "../actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarProyectoPage({ params }: Props) {
  await verificarAdmin();

  const { id } = await params;
  const proyecto = await obtenerProyectoAdmin(Number(id));
  if (!proyecto) notFound();

  const [tecnologias, imagenes] = await Promise.all([
    listarTecnologias(),
    listarImagenes(proyecto.id),
  ]);

  const numeros = Array.from({ length: MAX_IMAGENES }, (_, i) => i + 1);

  return (
    <section className="flex flex-col gap-12">
      <div>
        <Link href="/admin/proyectos" className="font-mono text-sm text-suave hover:text-neon">
          ← volver
        </Link>
        <h1 className="mt-4 mb-8 text-3xl font-extrabold">Editar: {proyecto.titulo}</h1>
        <ProyectoForm
          id={proyecto.id}
          inicial={{ ...proyecto, nuevasTecnologias: [] }}
          tecnologias={tecnologias}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold">Imágenes</h2>
        <p className="mt-2 mb-6 text-sm text-suave">
          Hasta {MAX_IMAGENES}. Se guardan como <span className="font-mono">{proyecto.slug}-imgN.webp</span>. La 1 es la portada.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {numeros.map((numero) => (
            <CasilleroImagen
              key={numero}
              proyectoId={proyecto.id}
              numero={numero}
              imagen={imagenes.find((img) => img.numero === numero)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-red-500/40 p-6">
        <h2 className="text-xl font-bold text-red-400">Zona de peligro</h2>
        <p className="mt-2 mb-4 text-sm text-suave">
          Eliminar el proyecto borra también sus imágenes y tecnologías asociadas.
        </p>
        <form action={borrarProyecto.bind(null, proyecto.id)}>
          <BotonConfirmar
            mensaje={`¿Eliminar "${proyecto.titulo}"? No se puede deshacer.`}
            className="rounded-md border border-red-500 px-5 py-2 font-bold text-red-400 transition hover:bg-red-500/10"
          >
            Eliminar proyecto
          </BotonConfirmar>
        </form>
      </div>
    </section>
  );
}
