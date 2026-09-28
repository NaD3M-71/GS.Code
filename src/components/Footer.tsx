import Link from "next/link";

const redes = [
  { href: "https://github.com/NaD3M-71", label: "GitHub" },
  { href: "https://www.linkedin.com/in/giuliano-scaglioni/", label: "LinkedIn" },
  { href: "https://wa.me/5492945553077", label: "WhatsApp" },
  { href: "mailto:scaglioni96@gmail.com", label: "Email" },
];

export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="border-t border-borde mt-24">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div>
          <p className="text-lg font-extrabold">
            GS<span className="font-normal text-neon">.Code</span>
          </p>
          <p className="text-sm text-suave">
            © {anio} Giuliano Scaglioni · Desarrollo web
          </p>
        </div>

        <nav className="flex flex-wrap gap-6 font-mono text-sm">
          {redes.map((red) => (
            <Link
              key={red.label}
              href={red.href}
              target={red.href.startsWith("http") ? "_blank" : undefined}
              rel={red.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-suave hover:text-neon transition-colors"
            >
              {red.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}