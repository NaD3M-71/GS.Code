import Link from "next/link";
import ProyectoForm from "@/components/admin/ProyectoForm";
import { listarTecnologias, type DatosProyecto } from "@/lib/admin-proyectos";
import { verificarAdmin } from "@/lib/sesion";

const vacio: DatosProyecto = {
  titulo: "",
  slug: "",
  resumen: "",
  descripcion: "",
  url: null,
  github: null,
  tipo: "propio",
  destacado: false,
  publicado: false,
  orden: 0,
  tecnologias: [],
  nuevasTecnologias: [],
};

export default async function NuevoProyectoPage() {
  await verificarAdmin();
  const tecnologias = await listarTecnologias();

  return (
    <section>
      <Link href="/admin/proyectos" className="font-mono text-sm text-suave hover:text-neon">
        ← volver
      </Link>
      <h1 className="mt-4 mb-8 text-3xl font-extrabold">Nuevo proyecto</h1>
      <ProyectoForm inicial={vacio} tecnologias={tecnologias} />
      <p className="mt-6 text-sm text-suave">
        Las imágenes se cargan después de crear el proyecto.
      </p>
    </section>
  );
}
