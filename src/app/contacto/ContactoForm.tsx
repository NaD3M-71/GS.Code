"use client";

import { useActionState } from "react";
import { enviarMensaje, type EstadoContacto } from "./actions";

const claseInput =
  "w-full rounded-md border border-borde bg-negro px-4 py-3 outline-none focus:border-neon";

export default function ContactoForm() {
  const [estado, accion, enviando] = useActionState<EstadoContacto, FormData>(enviarMensaje, undefined);

  if (estado?.ok) {
    return (
      <div role="status" className="rounded-xl border border-neon/50 bg-neon/5 p-8 text-center">
        <p className="font-mono text-neon text-sm">&gt; mensaje enviado ✓</p>
        <h2 className="mt-3 text-2xl font-bold">¡Gracias por escribir!</h2>
        <p className="mt-2 text-suave">Te respondo al email que dejaste lo antes posible.</p>
      </div>
    );
  }

  const v = estado?.valores;
  const e = estado?.errores ?? {};

  return (
    <form action={accion} className="flex flex-col gap-5" noValidate>
      {/* Honeypot: invisible para personas */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          No completar
          <input name="sitio" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-sm text-suave">nombre</span>
        <input name="nombre" defaultValue={v?.nombre} autoComplete="name" maxLength={120} className={claseInput} />
        {e.nombre && <span className="text-sm text-red-400">{e.nombre}</span>}
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-sm text-suave">email</span>
        <input name="email" type="email" defaultValue={v?.email} autoComplete="email" maxLength={180} className={claseInput} />
        {e.email && <span className="text-sm text-red-400">{e.email}</span>}
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-sm text-suave">mensaje</span>
        <textarea
          name="mensaje"
          defaultValue={v?.mensaje}
          rows={6}
          maxLength={5000}
          placeholder="Contame sobre tu proyecto: qué necesitás, para cuándo, si ya tenés algo hecho..."
          className={claseInput}
        />
        {e.mensaje && <span className="text-sm text-red-400">{e.mensaje}</span>}
      </label>

      {estado?.error && (
        <p role="alert" className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="self-start rounded-md bg-neon px-8 py-3 font-bold text-black transition hover:glow-box disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
