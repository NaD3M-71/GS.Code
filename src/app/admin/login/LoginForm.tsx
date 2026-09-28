"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [estado, accion, enviando] = useActionState(login, undefined);

  return (
    <form action={accion} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-sm text-suave">usuario</span>
        <input
          name="usuario"
          type="text"
          autoComplete="username"
          required
          className="rounded-md border border-borde bg-negro px-4 py-3 outline-none focus:border-neon"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-sm text-suave">contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-borde bg-negro px-4 py-3 outline-none focus:border-neon"
        />
      </label>

      {estado?.error && (
        <p role="alert" className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-md bg-neon px-6 py-3 font-bold text-black transition hover:glow-box disabled:opacity-50"
      >
        {enviando ? "Verificando..." : "Ingresar"}
      </button>
    </form>
  );
}
