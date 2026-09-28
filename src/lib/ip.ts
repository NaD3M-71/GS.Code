import "server-only";
import { headers } from "next/headers";

// IP del visitante (detrás del proxy del VPS llega en x-forwarded-for)
export async function obtenerIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? "local";
}
