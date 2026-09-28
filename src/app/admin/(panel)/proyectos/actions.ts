"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verificarAdmin } from "@/lib/sesion";
import { slugify } from "@/lib/slug";
import { borrarImagenesDeProyecto, renombrarImagenes } from "@/lib/imagenes";
import {
  actualizarProyecto,
  alternarPublicado,
  crearProyecto,
  eliminarProyecto,
  obtenerProyectoAdmin,
  type DatosProyecto,
} from "@/lib/admin-proyectos";

type Campo = "titulo" | "slug" | "resumen" | "descripcion" | "url" | "github" | "orden";

export type EstadoFormulario =
  | {
      valores: DatosProyecto;
      errores?: Partial<Record<Campo, string>>;
      error?: string;
      ok?: string;
    }
  | undefined;

const texto = (formData: FormData, campo: string) => String(formData.get(campo) ?? "").trim();

const urlValida = (valor: string) => {
  try {
    const url = new URL(valor);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// Lee el formulario, normaliza y valida
function leerFormulario(formData: FormData) {
  const titulo = texto(formData, "titulo");
  const url = texto(formData, "url");
  const github = texto(formData, "github");

  const valores: DatosProyecto = {
    titulo,
    slug: slugify(texto(formData, "slug") || titulo),
    resumen: texto(formData, "resumen"),
    descripcion: texto(formData, "descripcion"),
    url: url || null,
    github: github || null,
    tipo: formData.get("tipo") === "cliente" ? "cliente" : "propio",
    destacado: formData.get("destacado") === "on",
    publicado: formData.get("publicado") === "on",
    orden: Number(texto(formData, "orden") || 0),
    tecnologias: formData.getAll("tecnologias").map((id) => Number(id)).filter((id) => id > 0),
    nuevasTecnologias: texto(formData, "nuevasTecnologias")
      .split(",")
      .map((nombre) => nombre.trim())
      .filter((nombre) => nombre.length > 0 && nombre.length <= 60),
  };

  const errores: Partial<Record<Campo, string>> = {};
  if (!valores.titulo) errores.titulo = "El título es obligatorio.";
  if (valores.titulo.length > 150) errores.titulo = "Máximo 150 caracteres.";
  if (!valores.slug) errores.slug = "No se pudo generar el slug: revisá el título.";
  if (!valores.resumen) errores.resumen = "El resumen es obligatorio.";
  if (valores.resumen.length > 280) errores.resumen = "Máximo 280 caracteres.";
  if (!valores.descripcion) errores.descripcion = "La descripción es obligatoria.";
  if (valores.url && !urlValida(valores.url)) errores.url = "URL inválida (tiene que empezar con http:// o https://).";
  if (valores.github && !urlValida(valores.github)) errores.github = "URL inválida.";
  if (!Number.isInteger(valores.orden)) errores.orden = "Tiene que ser un número entero.";

  return { valores, errores };
}

const esSlugDuplicado = (error: unknown) =>
  typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY";

export async function guardarProyecto(
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  await verificarAdmin();

  const id = Number(formData.get("id")) || null;
  const { valores, errores } = leerFormulario(formData);

  if (Object.keys(errores).length > 0) {
    return { valores, errores, error: "Revisá los campos marcados." };
  }

  let nuevoId: number | null = null;
  try {
    if (id) {
      const anterior = await obtenerProyectoAdmin(id);
      await actualizarProyecto(id, valores);
      // Si cambió el slug, los archivos pasan a llamarse nuevo-slug-imgN.webp
      if (anterior && anterior.slug !== valores.slug) {
        await renombrarImagenes(id, valores.slug);
        revalidatePath(`/proyectos/${anterior.slug}`);
      }
    } else {
      nuevoId = await crearProyecto(valores);
    }
  } catch (error) {
    if (esSlugDuplicado(error)) {
      return { valores, errores: { slug: "Ya existe un proyecto con ese slug." } };
    }
    console.error(error);
    return { valores, error: "No se pudo guardar. Revisá la consola del servidor." };
  }

  revalidatePath("/proyectos");
  revalidatePath("/admin/proyectos");

  // Al crear, vamos a la página de edición (ahí se cargan las imágenes)
  if (nuevoId) redirect(`/admin/proyectos/${nuevoId}`);

  // Releemos de la base para incluir las tecnologías nuevas recién creadas
  const guardado = id ? await obtenerProyectoAdmin(id) : null;
  return {
    valores: guardado ? { ...guardado, nuevasTecnologias: [] } : valores,
    ok: "Cambios guardados.",
  };
}

export async function borrarProyecto(id: number) {
  await verificarAdmin();
  await borrarImagenesDeProyecto(id);
  await eliminarProyecto(id);
  revalidatePath("/proyectos");
  redirect("/admin/proyectos");
}

export async function cambiarPublicado(id: number) {
  await verificarAdmin();
  await alternarPublicado(id);
  revalidatePath("/proyectos");
  revalidatePath("/admin/proyectos");
}
