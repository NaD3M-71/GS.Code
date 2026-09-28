import { NextResponse, type NextRequest } from "next/server";
import { NOMBRE_COOKIE, leerSesion } from "@/lib/jwt";

// Corre ANTES de cada request a /admin: si no hay sesión, al login.
// Es la primera barrera; las páginas y acciones igual verifican con verificarAdmin().
export async function proxy(request: NextRequest) {
  const esLogin = request.nextUrl.pathname === "/admin/login";
  const sesion = await leerSesion(request.cookies.get(NOMBRE_COOKIE)?.value);

  if (!esLogin && !sesion) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (esLogin && sesion) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
