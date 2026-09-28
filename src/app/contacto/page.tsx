import type { Metadata } from "next";
import ContactoForm from "./ContactoForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contame sobre tu proyecto y te respondo a la brevedad.",
};

const canales = [
  { nombre: "WhatsApp", valor: "+54 9 2945 55-3077", href: "https://wa.me/5492945553077" },
  { nombre: "Email", valor: "scaglioni96@gmail.com", href: "mailto:scaglioni96@gmail.com" },
  { nombre: "LinkedIn", valor: "giuliano-scaglioni", href: "https://www.linkedin.com/in/giuliano-scaglioni/" },
  { nombre: "GitHub", valor: "NaD3M-71", href: "https://github.com/NaD3M-71" },
];

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-mono text-neon text-sm mb-2">&gt; ./contacto --nuevo</p>
      <h1 className="text-4xl md:text-5xl font-extrabold">Contacto</h1>
      <p className="mt-4 max-w-2xl text-lg text-suave">
        ¿Tenés un proyecto, una idea o una consulta? Escribime y te respondo a la brevedad.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="relative rounded-xl border border-borde bg-panel p-6 md:p-8">
          <ContactoForm />
        </div>

        <aside className="flex flex-col gap-4">
          <h2 className="font-mono text-sm text-neon">otros canales</h2>
          {canales.map((canal) => (
            <a
              key={canal.nombre}
              href={canal.href}
              target={canal.href.startsWith("http") ? "_blank" : undefined}
              rel={canal.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="rounded-xl border border-borde p-4 transition hover:border-neon"
            >
              <p className="text-sm text-suave">{canal.nombre}</p>
              <p className="font-bold break-all">{canal.valor}</p>
            </a>
          ))}
        </aside>
      </div>
    </div>
  );
}
