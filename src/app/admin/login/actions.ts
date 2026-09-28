"use server";

import { redirect } from "next/navigation";
import { verificarPassword } from "@/lib/password";
import { crearSesion, borrarSesion } from "@/lib/sesion";
import { limiteLogin } from "@/lib/limite";
import { obtenerIp } from "@/lib/ip";

export type EstadoLogin = { error: string } | undefined;

export async function login(_estado: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const usuario = String(formData.get("usuario") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!usuario || !password) {
    return { error: "Completá usuario y contraseña." };
  }

  const ip = await obtenerIp();
  if (!limiteLogin.registrar(ip)) {
    return { error: "Demasiados intentos. Probá de nuevo en 15 minutos." };
  }

  // Verificamos las dos cosas siempre, para no revelar cuál falló
  const usuarioOk = usuario === process.env.ADMIN_USER;
  const passwordOk = await verificarPassword(password, process.env.ADMIN_PASS_HASH ?? "");

  if (!usuarioOk || !passwordOk) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  limiteLogin.limpiar(ip);
  await crearSesion(usuario);
  redirect("/admin");
}

export async function logout() {
  await borrarSesion();
  redirect("/admin/login");
}
