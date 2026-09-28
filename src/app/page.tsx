import Image from "next/image";
import Link from "next/link";
import ProyectoCard from "@/components/ProyectoCard";
import { getProyectos } from "@/lib/proyectos";

// Lee proyectos de la base en cada visita
export const dynamic = "force-dynamic";

const servicios = [
  { icono: "</>", titulo: "Sitios web", texto: "Landing pages y sitios a medida, rápidos y adaptados al celular." },
  { icono: "[#]", titulo: "Sistemas de gestión", texto: "Stock, turnos, reservas y paneles de administración." },
  { icono: "{db}", titulo: "Bases de datos", texto: "Diseño, migración y optimización en MySQL, PostgreSQL y SQL Server." },
  { icono: ">_", titulo: "Mantenimiento", texto: "Hosting, dominio, HTTPS, backups y soporte mensual." },
];

export default async function Home() {
  const proyectos = await getProyectos();

  // Los destacados primero; si no hay, los más recientes
  const destacados = proyectos.filter((p) => p.destacado);
  const aMostrar = (destacados.length > 0 ? destacados : proyectos).slice(0, 3);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-24 md:py-32 grid gap-12 md:grid-cols-[1.3fr_1fr] items-center">
        <div>
          <p className="font-mono text-neon text-sm mb-4">&gt; hola, soy Giuliano Scaglioni</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Desarrollo web y sistemas <span className="text-neon glow">a medida</span>
          </h1>
          <p className="mt-6 text-suave text-lg max-w-xl">
            Desarrollador full-stack. Sitios, sistemas de gestión y bases de datos para
            emprendimientos, empresas e instituciones.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/proyectos"
              className="rounded-md bg-neon px-6 py-3 font-bold text-black transition hover:glow-box"
            >
              Ver proyectos
            </Link>
            <Link
              href="/contacto"
              className="rounded-md border border-neon px-6 py-3 font-bold text-neon transition hover:bg-neon/10"
            >
              Contacto
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Logo GS.Code"
            width={320}
            height={370}
            priority
            className="w-48 md:w-72 h-auto drop-shadow-[0_0_40px_rgba(0,255,0,0.35)]"
          />
        </div>
      </section>

      {/* ---------- Proyectos destacados ---------- */}
      {aMostrar.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-neon text-sm mb-2">&gt; ls ./proyectos --destacados</p>
              <h2 className="text-3xl md:text-4xl font-extrabold">Proyectos destacados</h2>
            </div>
            <Link href="/proyectos" className="font-bold text-neon hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aMostrar.map((proyecto) => (
              <ProyectoCard key={proyecto.id} proyecto={proyecto} />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Servicios ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-neon text-sm mb-2">&gt; cat servicios.md</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Qué hago</h2>
          </div>
          <Link href="/servicios" className="font-bold text-neon hover:underline">
            Ver servicios →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {servicios.map((servicio) => (
            <div
              key={servicio.titulo}
              className="rounded-xl border border-borde bg-panel p-6 transition hover:border-neon"
            >
              <span className="font-mono text-2xl text-neon">{servicio.icono}</span>
              <h3 className="mt-4 text-lg font-bold">{servicio.titulo}</h3>
              <p className="mt-2 text-sm text-suave">{servicio.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Llamado a la acción ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-xl border border-neon/40 bg-neon/5 p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">¿Arrancamos tu proyecto?</h2>
          <p className="mt-4 text-suave max-w-xl mx-auto">
            La primera reunión es sin costo. Contame qué necesitás y armamos una propuesta a medida.
          </p>
          <Link
            href="/contacto"
            className="mt-8 inline-block rounded-md bg-neon px-8 py-3 font-bold text-black transition hover:glow-box"
          >
            Escribime
          </Link>
        </div>
      </section>
    </>
  );
}
