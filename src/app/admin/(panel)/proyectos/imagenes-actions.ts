"use server";

import { revalidatePath } from "next/cache";
import { verificarAdmin } from "@/lib/sesion";
import { obtenerProyectoAdmin } from "@/lib/admin-proyectos";
import { borrarImagen, guardarImagen, MAX_IMAGENES, validarArchivo } from "@/lib/imagenes";

export type EstadoImagen = { error?: string; ok?: string } | undefined;

const numeroValido = (numero: number) => Number.isInteger(numero) && numero >= 1 && numero <= MAX_IMAGENES;

const revalidar = (proyectoId: number, slug: string) => {
  revalidatePath(`/admin/proyectos/${proyectoId}`);
  revalidatePath("/admin/proyectos");
  revalidatePath("/proyectos");
  revalidatePath(`/proyectos/${slug}`);
};

export async function subirImagen(
  proyectoId: number,
  numero: number,
  _estado: EstadoImagen,
  formData: FormData
): Promise<EstadoImagen> {
  await verificarAdmin();
  if (!numeroValido(numero)) return { error: "Número de imagen inválido." };

  const proyecto = await obtenerProyectoAdmin(proyectoId);
  if (!proyecto) return { error: "El proyecto no existe." };

  const archivo = formData.get("imagen");
  if (!(archivo instanceof File)) return { error: "Elegí una imagen." };

  const errorArchivo = validarArchivo(archivo);
  if (errorArchivo) return { error: errorArchivo };

  const alt = String(formData.get("alt") ?? "").trim().slice(0, 200) || null;

  try {
    await guardarImagen(proyecto.id, proyecto.slug, numero, archivo, alt);
  } catch (error) {
    console.error(error);
    return { error: "No se pudo procesar la imagen. ¿Es un archivo de imagen válido?" };
  }

  revalidar(proyecto.id, proyecto.slug);
  return { ok: "Imagen guardada." };
}

export async function quitarImagen(proyectoId: number, numero: number) {
  await verificarAdmin();
  if (!numeroValido(numero)) return;

  const proyecto = await obtenerProyectoAdmin(proyectoId);
  if (!proyecto) return;

  await borrarImagen(proyecto.id, numero);
  revalidar(proyecto.id, proyecto.slug);
}
