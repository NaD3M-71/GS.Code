import Link from "next/link";
import { listarProyectosAdmin } from "@/lib/admin-proyectos";
import { verificarAdmin } from "@/lib/sesion";
import { cambiarPublicado } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProyectosPage() {
  await verificarAdmin();
  const proyectos = await listarProyectosAdmin();

  return (
    <section>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Proyectos</h1>
        <Link
          href="/admin/proyectos/nuevo"
          className="rounded-md bg-neon px-5 py-2.5 font-bold text-black transition hover:glow-box"
        >
          + Nuevo proyecto
        </Link>
      </div>

      {proyectos.length === 0 ? (
        <p className="text-suave">No hay proyectos todavía.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-borde">
          <table className="w-full text-left text-sm">
            <thead className="bg-panel font-mono text-xs text-suave">
              <tr>
                <th className="px-4 py-3">orden</th>
                <th className="px-4 py-3">título</th>
                <th className="px-4 py-3">tipo</th>
                <th className="px-4 py-3">imágenes</th>
                <th className="px-4 py-3">estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {proyectos.map((proyecto) => (
                <tr key={proyecto.id} className="border-t border-borde">
                  <td className="px-4 py-3 font-mono text-suave">{proyecto.orden}</td>
                  <td className="px-4 py-3 font-bold">
                    {proyecto.titulo}
                    {proyecto.destacado && <span className="ml-2 text-neon" title="Destacado">★</span>}
                  </td>
                  <td className="px-4 py-3 text-suave">{proyecto.tipo}</td>
                  <td className="px-4 py-3 font-mono text-suave">{proyecto.imagenes}/5</td>
                  <td className="px-4 py-3">
                    <form action={cambiarPublicado.bind(null, proyecto.id)}>
                      <button
                        type="submit"
                        title="Click para cambiar"
                        className={`rounded px-2 py-1 font-mono text-xs ${
                          proyecto.publicado
                            ? "bg-neon/15 text-neon"
                            : "bg-borde text-suave"
                        }`}
                      >
                        {proyecto.publicado ? "publicado" : "borrador"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      {proyecto.publicado && (
                        <Link href={`/proyectos/${proyecto.slug}`} target="_blank" className="text-suave hover:text-claro">
                          Ver
                        </Link>
                      )}
                      <Link href={`/admin/proyectos/${proyecto.id}`} className="font-bold text-neon hover:underline">
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
