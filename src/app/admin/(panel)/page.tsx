import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { verificarAdmin } from "@/lib/sesion";

export const dynamic = "force-dynamic";

type Conteos = RowDataPacket & {
  proyectos: number;
  publicados: number;
  sin_leer: number;
};

export default async function AdminPage() {
  await verificarAdmin();

  const [[conteos]] = await pool.query<Conteos[]>(
    `SELECT
       (SELECT COUNT(*) FROM proyectos)                   AS proyectos,
       (SELECT COUNT(*) FROM proyectos WHERE publicado)   AS publicados,
       (SELECT COUNT(*) FROM mensajes WHERE NOT leido)    AS sin_leer`
  );

  const tarjetas = [
    { titulo: "Proyectos", valor: conteos.proyectos, detalle: `${conteos.publicados} publicados`, href: "/admin/proyectos" },
    { titulo: "Mensajes sin leer", valor: conteos.sin_leer, detalle: "del formulario de contacto", href: "/admin/mensajes" },
  ];

  return (
    <section>
      <h1 className="text-3xl font-extrabold mb-8">Panel</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {tarjetas.map((tarjeta) => (
          <Link
            key={tarjeta.titulo}
            href={tarjeta.href}
            className="rounded-xl border border-borde bg-panel p-6 transition hover:border-neon hover:glow-box"
          >
            <p className="text-suave">{tarjeta.titulo}</p>
            <p className="mt-2 text-5xl font-extrabold text-neon">{tarjeta.valor}</p>
            <p className="mt-2 font-mono text-xs text-suave">{tarjeta.detalle}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
