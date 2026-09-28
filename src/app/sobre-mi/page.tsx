import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Giuliano Scaglioni, desarrollador full-stack de Esquel, Chubut. Experiencia en sistemas de gestión, bases de datos y desarrollo web.",
};

const stack = [
  { area: "Backend", tecnologias: ["Node.js", "Express", "PHP", "Laravel", ".NET / C#"] },
  { area: "Frontend", tecnologias: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { area: "Bases de datos", tecnologias: ["PostgreSQL", "MySQL", "SQL Server", "MongoDB"] },
  { area: "Herramientas", tecnologias: ["Git", "Docker", "Linux / VPS", "Python"] },
];

const experiencia = [
  {
    periodo: "2024 — actualidad",
    titulo: "Desarrollador · Secretaría de Bosques del Chubut",
    descripcion:
      "Desarrollo de sistemas internos de gestión en PHP y administración de bases de datos PostgreSQL. Rediseño y mantenimiento de sitios institucionales.",
  },
  {
    periodo: "2023 — actualidad",
    titulo: "Desarrollador freelance · GS.Code",
    descripcion:
      "Sitios web y sistemas a medida para clientes: landing pages para rent-a-car y cabañas, y proyectos propios como una bolsa de trabajo local, una plataforma para una liga de futsal y una app de bienes raíces con mapa interactivo.",
  },
];

const formacion = [
  {
    periodo: "En curso",
    titulo: "Tecnicatura Universitaria en Programación",
    institucion: "UTN — Universidad Tecnológica Nacional",
  },
  {
    periodo: "2023 — 2024",
    titulo: "Cursos de desarrollo backend: Node.js, Laravel y .NET",
    institucion: "Udemy",
  },
  {
    periodo: "2023",
    titulo: "Análisis de Datos (beca Google)",
    institucion: "Comunidad IT",
  },
  {
    periodo: "2022 — 2023",
    titulo: "Desarrollo Web Full Stack",
    institucion: "UTN — Curso de extensión",
  },
];

export default function SobreMiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="grid gap-12 md:grid-cols-[1fr_2fr] items-start">
        <div className="relative mx-auto w-56 md:w-full max-w-xs">
          <div className="absolute -inset-2 rounded-2xl border border-neon/40" aria-hidden />
          <Image
            src="/foto.jpg"
            alt="Giuliano Scaglioni"
            width={741}
            height={1333}
            priority
            className="relative aspect-[3/4] w-full rounded-xl object-cover object-top"
          />
        </div>

        <div>
          <p className="font-mono text-neon text-sm mb-2">&gt; whoami</p>
          <h1 className="text-4xl md:text-5xl font-extrabold">Giuliano Scaglioni</h1>
          <p className="mt-2 text-lg text-neon">Desarrollador Full Stack · orientado a Backend</p>

          <div className="mt-6 space-y-4 text-claro/90 leading-relaxed">
            <p>
              Soy de Esquel, Chubut, al sur de Argentina. Programar siempre estuvo entre mis
              intereses, pero recién a fines de 2022 me animé a dedicarme de lleno, después de
              dejar la carrera de Bioquímica. Hoy agradezco haber seguido esa corazonada.
            </p>
            <p>
              Me especializo en backend y bases de datos, aunque disfruto del desarrollo completo:
              desde el diseño de la base hasta la interfaz. Trabajo en la Secretaría de Bosques del
              Chubut desarrollando sistemas internos, y con <strong>GS.Code</strong>, mi marca
              personal, hago sitios y sistemas a medida para clientes.
            </p>
            <p>
              Me interesa escribir código ordenado, seguro y fácil de mantener, y sigo formándome
              en la UTN.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="rounded-md bg-neon px-6 py-3 font-bold text-black transition hover:glow-box"
            >
              Contactame
            </Link>
            <a
              href="https://www.linkedin.com/in/giuliano-scaglioni/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-neon px-6 py-3 font-bold text-neon transition hover:bg-neon/10"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <p className="font-mono text-neon text-sm mb-2">&gt; ls ./stack</p>
        <h2 className="text-3xl font-extrabold">Tecnologías</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map((grupo) => (
            <div key={grupo.area} className="rounded-xl border border-borde bg-panel p-6">
              <h3 className="font-mono text-sm text-neon">{grupo.area}</h3>
              <ul className="mt-4 space-y-2">
                {grupo.tecnologias.map((tec) => (
                  <li key={tec}>{tec}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-16 lg:grid-cols-2">
        <div>
          <p className="font-mono text-neon text-sm mb-2">&gt; git log --experiencia</p>
          <h2 className="text-3xl font-extrabold">Experiencia</h2>
          <ol className="mt-8 space-y-8 border-l border-borde pl-6">
            {experiencia.map((item) => (
              <li key={item.titulo} className="relative">
                <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-neon glow-box" />
                <p className="font-mono text-xs text-suave">{item.periodo}</p>
                <h3 className="mt-1 text-lg font-bold">{item.titulo}</h3>
                <p className="mt-2 text-sm text-suave">{item.descripcion}</p>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="font-mono text-neon text-sm mb-2">&gt; git log --formacion</p>
          <h2 className="text-3xl font-extrabold">Formación</h2>
          <ol className="mt-8 space-y-8 border-l border-borde pl-6">
            {formacion.map((item) => (
              <li key={item.titulo} className="relative">
                <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-neon glow-box" />
                <p className="font-mono text-xs text-suave">{item.periodo}</p>
                <h3 className="mt-1 text-lg font-bold">{item.titulo}</h3>
                <p className="mt-2 text-sm text-suave">{item.institucion}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
