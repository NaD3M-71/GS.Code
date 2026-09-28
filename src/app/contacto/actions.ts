"use server";

import { revalidatePath } from "next/cache";
import { avisarNuevoMensaje } from "@/lib/email";
import { obtenerIp } from "@/lib/ip";
import { limiteContacto } from "@/lib/limite";
import { guardarMensaje } from "@/lib/mensajes";

type Campo = "nombre" | "email" | "mensaje";

export type EstadoContacto =
  | {
      ok?: boolean;
      error?: string;
      errores?: Partial<Record<Campo, string>>;
      valores?: Record<Campo, string>;
    }
  | undefined;

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function enviarMensaje(
  _estado: EstadoContacto,
  formData: FormData
): Promise<EstadoContacto> {
  // Honeypot: campo oculto que solo completan los bots. Fingimos éxito.
  if (String(formData.get("sitio") ?? "") !== "") return { ok: true };

  const valores = {
    nombre: String(formData.get("nombre") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    mensaje: String(formData.get("mensaje") ?? "").trim(),
  };

  const errores: Partial<Record<Campo, string>> = {};
  if (valores.nombre.length < 2) errores.nombre = "Contame tu nombre.";
  if (valores.nombre.length > 120) errores.nombre = "Máximo 120 caracteres.";
  if (!EMAIL_VALIDO.test(valores.email) || valores.email.length > 180) errores.email = "Revisá el email.";
  if (valores.mensaje.length < 10) errores.mensaje = "El mensaje es muy corto.";
  if (valores.mensaje.length > 5000) errores.mensaje = "Máximo 5000 caracteres.";

  if (Object.keys(errores).length > 0) return { errores, valores };

  if (!limiteContacto.registrar(await obtenerIp())) {
    return { error: "Enviaste varios mensajes seguidos. Probá de nuevo en unos minutos.", valores };
  }

  // 1) Guardar en la base (lo importante: no se pierde aunque falle el mail)
  try {
    await guardarMensaje(valores);
  } catch (error) {
    console.error(error);
    return {
      error: "No se pudo enviar el mensaje. Escribime por WhatsApp o email mientras lo soluciono.",
      valores,
    };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/mensajes");

  // 2) Avisarme por mail (si falla, el mensaje igual quedó guardado)
  try {
    await avisarNuevoMensaje(valores);
  } catch (error) {
    console.error("Error enviando aviso por email:", error);
  }

  return { ok: true };
}
