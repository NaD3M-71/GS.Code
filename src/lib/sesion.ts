import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NOMBRE_COOKIE, firmarSesion, leerSesion } from "./jwt";

const DURACION_MS = 8 * 60 * 60 * 1000; // 8 horas

export async function crearSesion(usuario: string) {
  const expira = new Date(Date.now() + DURACION_MS);
  const token = await firmarSesion({ usuario }, expira);

  const cookieStore = await cookies();
  cookieStore.set(NOMBRE_COOKIE, token, {
    httpOnly: true, // JavaScript del navegador no puede leerla
    secure: process.env.NODE_ENV === "production", // solo por HTTPS en producción
    sameSite: "lax",
    path: "/",
    expires: expira,
  });
}

export async function borrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete(NOMBRE_COOKIE);
}

// Usar al principio de toda página o acción del admin.
// Si no hay sesión válida, manda al login.
export const verificarAdmin = cache(async () => {
  const cookieStore = await cookies();
  const sesion = await leerSesion(cookieStore.get(NOMBRE_COOKIE)?.value);
  if (!sesion) redirect("/admin/login");
  return sesion;
});
