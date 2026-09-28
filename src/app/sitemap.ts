import type { MetadataRoute } from "next";
import { getSlugsPublicados } from "@/lib/proyectos";
import { SITIO_URL } from "@/lib/sitio";

// Se genera en cada pedido: así incluye los proyectos nuevos sin rebuild
export const dynamic = "force-dynamic";

// Genera /sitemap.xml
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginas = ["", "/proyectos", "/servicios", "/sobre-mi", "/contacto"].map((ruta) => ({
    url: `${SITIO_URL}${ruta}`,
    changeFrequency: "monthly" as const,
    priority: ruta === "" ? 1 : 0.8,
  }));

  const proyectos = (await getSlugsPublicados()).map((proyecto) => ({
    url: `${SITIO_URL}/proyectos/${proyecto.slug}`,
    lastModified: proyecto.actualizado,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...paginas, ...proyectos];
}
