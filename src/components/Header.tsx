"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  const esActivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const claseLink = (href: string) =>
    esActivo(href)
      ? "text-neon glow"
      : "text-suave hover:text-claro transition-colors";

  return (
    <header className="sticky top-0 z-50 border-b border-borde bg-negro/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setAbierto(false)}
        >
          <Image src="/logo.png" alt="" width={28} height={32} />
          <span className="text-xl font-extrabold">
            GS<span className="font-normal text-neon">.Code</span>
          </span>
        </Link>

        {/* Menú escritorio */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={claseLink(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Botón hamburguesa */}
        <button
          type="button"
          className="md:hidden p-2 text-claro"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          onClick={() => setAbierto((prev) => !prev)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {abierto ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menú celular */}
      {abierto && (
        <nav className="md:hidden border-t border-borde bg-negro px-4 py-4 flex flex-col gap-4 font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={claseLink(link.href)}
              onClick={() => setAbierto(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}