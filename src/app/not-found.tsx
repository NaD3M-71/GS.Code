import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-32 text-center">
      <p className="font-mono text-neon text-sm">&gt; error 404</p>
      <h1 className="mt-4 text-5xl md:text-7xl font-extrabold glow">
        Página no encontrada
      </h1>
      <p className="mt-6 text-suave">
        La ruta que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block rounded-md bg-neon px-6 py-3 font-bold text-black transition hover:glow-box"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
