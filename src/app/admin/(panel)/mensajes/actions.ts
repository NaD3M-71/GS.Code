"use server";

import { revalidatePath } from "next/cache";
import { verificarAdmin } from "@/lib/sesion";
import { alternarLeido, eliminarMensaje } from "@/lib/mensajes";

export async function cambiarLeido(id: number) {
  await verificarAdmin();
  await alternarLeido(id);
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin");
}

export async function borrarMensaje(id: number) {
  await verificarAdmin();
  await eliminarMensaje(id);
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin");
}
