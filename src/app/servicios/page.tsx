import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Sitios web, sistemas de gestión a medida y bases de datos para emprendimientos, empresas e instituciones.",
};

const servicios = [
  {
    titulo: "Sitios web y landing pages",
    descripcion:
      "Tu negocio en internet con una web propia, rápida y adaptada al celular. Ideal para cabañas, comercios, profesionales y emprendimientos que quieren llegar a más clientes.",
    items: ["Diseño a medida", "Adaptada a celulares", "Formulario de contacto", "Optimizada para Google"],
  },
  {
    titulo: "Sistemas de gestión",
    descripcion:
      "Aplicaciones web para ordenar tu negocio: stock e inventario, turnos, reservas, alquileres o cualquier proceso que hoy llevás en papel o en planillas.",
    items: ["Usuarios y permisos", "Panel de administración", "Reportes", "Acceso desde cualquier lugar"],
  },
  {
    titulo: "Bases de datos",
    descripcion:
      "Diseño, migración y mantenimiento de bases de datos. Consultas, reportes y optimización para que tu información esté ordenada y segura.",
    items: ["MySQL / PostgreSQL / SQL Server", "Migración de datos", "Backups", "Optimización de consultas"],
  },
  {
    titulo: "Mantenimiento y hosting",
    descripcion:
      "Me encargo de que tu sitio o sistema siga funcionando: actualizaciones, copias de seguridad y cambios, con un costo mensual accesible.",
    items: ["Publicación en servidor", "Dominio y certificado HTTPS", "Actualizaciones", "Soporte"],
  },
];

const pasos = [
  {
    titulo: "Reunión inicial",
    descripcion: "Charlamos sobre tu negocio y lo que necesitás. Sin costo.",
  },
  {
    titulo: "Propuesta y presupuesto",
    descripcion: "Te envío una propuesta con alcance, tiempos y cotización.",
  },
  {
    titulo: "Diseño",
    descripcion: "Con la seña, arranco por el diseño. Avanzamos cuando tenga tu visto bueno.",
  },
  {
    titulo: "Desarrollo y entrega",
    descripcion:
      "Desarrollo, pruebas y publicación en tu hosting o bajo mi mantenimiento. Se abona el saldo al finalizar.",
  },
];

export default function ServiciosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-neon text-sm mb-2">&gt; cat servicios.md</p>
      <h1 className="text-4xl md:text-5xl font-extrabold">Servicios</h1>
      <p className="mt-4 max-w-2xl text-lg text-suave">
        Soluciones web a medida para emprendimientos, empresas e instituciones. Atención personalizada de
        principio a fin.
      </p>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {servicios.map((servicio) => (
          <article
            key={servicio.titulo}
            className="rounded-xl border border-borde bg-panel p-6 transition hover:border-neon hover:glow-box"
          >
            <h2 className="text-2xl font-bold">{servicio.titulo}</h2>
            <p className="mt-3 text-suave">{servicio.descripcion}</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
              {servicio.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-neon">▹</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-24">
        <p className="font-mono text-neon text-sm mb-2">&gt; ./metodologia</p>
        <h2 className="text-3xl font-extrabold">Cómo trabajo</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {pasos.map((paso, indice) => (
            <li key={paso.titulo} className="relative rounded-xl border border-borde p-6">
              <span className="font-mono text-4xl font-bold text-neon glow">
                {String(indice + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-bold">{paso.titulo}</h3>
              <p className="mt-2 text-sm text-suave">{paso.descripcion}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-24 rounded-xl border border-neon/40 bg-neon/5 p-10 text-center">
        <h2 className="text-3xl font-extrabold">¿Tenés un proyecto en mente?</h2>
        <p className="mt-3 text-suave">Contame qué necesitás y te respondo a la brevedad.</p>
        <Link
          href="/contacto"
          className="mt-8 inline-block rounded-md bg-neon px-8 py-3 font-bold text-black transition hover:glow-box"
        >
          Pedir presupuesto
        </Link>
      </section>
    </div>
  );
}
