import BotonConfirmar from "@/components/admin/BotonConfirmar";
import { listarMensajes } from "@/lib/mensajes";
import { verificarAdmin } from "@/lib/sesion";
import { borrarMensaje, cambiarLeido } from "./actions";

export const dynamic = "force-dynamic";

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Argentina/Buenos_Aires",
});

export default async function MensajesPage() {
  await verificarAdmin();
  const mensajes = await listarMensajes();
  const sinLeer = mensajes.filter((m) => !m.leido).length;

  return (
    <section>
      <h1 className="text-3xl font-extrabold">Mensajes</h1>
      <p className="mt-2 mb-8 text-suave">
        {mensajes.length} en total · <span className="text-neon">{sinLeer} sin leer</span>
      </p>

      {mensajes.length === 0 ? (
        <p className="text-suave">Todavía no llegó ningún mensaje.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {mensajes.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl border p-5 ${m.leido ? "border-borde" : "border-neon/60 bg-neon/5"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-bold">
                    {!m.leido && <span className="mr-2 text-neon">●</span>}
                    {m.nombre}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-sm text-suave hover:text-neon">
                    {m.email}
                  </a>
                </div>
                <p className="font-mono text-xs text-suave">{formatoFecha.format(m.fecha)}</p>
              </div>

              <p className="mt-4 whitespace-pre-line text-claro/90">{m.mensaje}</p>

              <div className="mt-5 flex flex-wrap gap-5 text-sm">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: tu consulta en GS.Code")}`}
                  className="font-bold text-neon hover:underline"
                >
                  Responder
                </a>
                <form action={cambiarLeido.bind(null, m.id)}>
                  <button type="submit" className="text-suave hover:text-claro">
                    Marcar como {m.leido ? "no leído" : "leído"}
                  </button>
                </form>
                <form action={borrarMensaje.bind(null, m.id)}>
                  <BotonConfirmar mensaje="¿Eliminar este mensaje?" className="text-suave hover:text-red-400">
                    Eliminar
                  </BotonConfirmar>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
