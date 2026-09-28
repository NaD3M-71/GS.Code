import { SignJWT, jwtVerify } from "jose";

// Este archivo lo usan tanto el proxy como el servidor,
// por eso no importa nada exclusivo de Next (cookies, headers...).

export const NOMBRE_COOKIE = "gscode_sesion";

export type Sesion = { usuario: string };

const clave = () => {
  const secreto = process.env.SESSION_SECRET;
  if (!secreto) throw new Error("Falta SESSION_SECRET en las variables de entorno");
  return new TextEncoder().encode(secreto);
};

export async function firmarSesion(sesion: Sesion, expira: Date) {
  return new SignJWT(sesion)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expira)
    .sign(clave());
}

// Devuelve la sesión si el token es válido y no venció; si no, null
export async function leerSesion(token: string | undefined): Promise<Sesion | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<Sesion>(token, clave(), { algorithms: ["HS256"] });
    return { usuario: payload.usuario };
  } catch {
    return null;
  }
}
