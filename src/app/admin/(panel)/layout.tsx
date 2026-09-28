import type { Metadata } from "next";
import Link from "next/link";
import { verificarAdmin } from "@/lib/sesion";
import { logout } from "../login/actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sesion = await verificarAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-borde bg-panel px-5 py-3">
        <nav className="flex gap-6 font-mono text-sm">
          <Link href="/admin" className="text-suave hover:text-neon">panel</Link>
          <Link href="/admin/proyectos" className="text-suave hover:text-neon">proyectos</Link>
          <Link href="/admin/mensajes" className="text-suave hover:text-neon">mensajes</Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-suave">
            <span className="text-neon">●</span> {sesion.usuario}
          </span>
          <form action={logout}>
            <button type="submit" className="font-bold text-suave hover:text-claro">
              Salir
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
