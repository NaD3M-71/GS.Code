"use client";

import { useActionState } from "react";
import { guardarProyecto, type EstadoFormulario } from "@/app/admin/(panel)/proyectos/actions";
import type { DatosProyecto, Tecnologia } from "@/lib/admin-proyectos";

type Props = {
  id?: number;
  inicial: DatosProyecto;
  tecnologias: Tecnologia[];
};

const claseInput =
  "w-full rounded-md border border-borde bg-negro px-4 py-2.5 outline-none focus:border-neon";

function Error({ mensaje }: { mensaje?: string }) {
  if (!mensaje) return null;
  return <p className="mt-1 text-sm text-red-400">{mensaje}</p>;
}

export default function ProyectoForm({ id, inicial, tecnologias }: Props) {
  const [estado, accion, guardando] = useActionState<EstadoFormulario, FormData>(
    guardarProyecto,
    undefined
  );

  // Después de enviar, los valores vuelven desde el servidor (así no se pierden si hay error)
  const v = estado?.valores ?? inicial;
  const e = estado?.errores ?? {};

  return (
    <form action={accion} className="flex flex-col gap-6">
      {id && <input type="hidden" name="id" value={id} />}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-sm text-suave">título *</span>
          <input name="titulo" defaultValue={v.titulo} maxLength={150} className={claseInput} />
          <Error mensaje={e.titulo} />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-sm text-suave">slug (vacío = se genera del título)</span>
          <input name="slug" defaultValue={v.slug} maxLength={120} className={claseInput} />
          <Error mensaje={e.slug} />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-sm text-suave">resumen * (máx. 280, se ve en la card)</span>
        <textarea name="resumen" defaultValue={v.resumen} maxLength={280} rows={2} className={claseInput} />
        <Error mensaje={e.resumen} />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-sm text-suave">descripción * (se respetan los saltos de línea)</span>
        <textarea name="descripcion" defaultValue={v.descripcion} rows={8} className={claseInput} />
        <Error mensaje={e.descripcion} />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-sm text-suave">url del sitio</span>
          <input name="url" type="url" defaultValue={v.url ?? ""} placeholder="https://" className={claseInput} />
          <Error mensaje={e.url} />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-sm text-suave">repositorio github</span>
          <input name="github" type="url" defaultValue={v.github ?? ""} placeholder="https://github.com/..." className={claseInput} />
          <Error mensaje={e.github} />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-sm text-suave">tipo</span>
          <select name="tipo" defaultValue={v.tipo} className={claseInput}>
            <option value="propio">Propio</option>
            <option value="cliente">Cliente</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-sm text-suave">orden (menor = primero)</span>
          <input name="orden" type="number" defaultValue={v.orden} className={claseInput} />
          <Error mensaje={e.orden} />
        </label>

        <div className="flex flex-col justify-end gap-3 pb-1">
          <label className="flex items-center gap-3">
            <input name="publicado" type="checkbox" defaultChecked={v.publicado} className="size-4 accent-neon" />
            Publicado
          </label>
          <label className="flex items-center gap-3">
            <input name="destacado" type="checkbox" defaultChecked={v.destacado} className="size-4 accent-neon" />
            Destacado
          </label>
        </div>
      </div>

      <fieldset className="rounded-md border border-borde p-4">
        <legend className="px-2 font-mono text-sm text-suave">tecnologías</legend>
        <div className="flex flex-wrap gap-3">
          {tecnologias.map((tec) => (
            <label
              key={tec.id}
              className="flex items-center gap-2 rounded border border-borde px-3 py-1.5 text-sm has-checked:border-neon has-checked:text-neon"
            >
              <input
                type="checkbox"
                name="tecnologias"
                value={tec.id}
                defaultChecked={v.tecnologias.includes(tec.id)}
                className="accent-neon"
              />
              {tec.nombre}
            </label>
          ))}
        </div>
        <input
          name="nuevasTecnologias"
          placeholder="Otras, separadas por coma (ej: Vue, Redis)"
          className={`${claseInput} mt-4`}
        />
      </fieldset>

      {estado?.error && (
        <p role="alert" className="rounded-md border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {estado.error}
        </p>
      )}
      {estado?.ok && (
        <p role="status" className="rounded-md border border-neon/50 bg-neon/10 px-4 py-2 text-sm text-neon">
          {estado.ok}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="self-start rounded-md bg-neon px-8 py-3 font-bold text-black transition hover:glow-box disabled:opacity-50"
      >
        {guardando ? "Guardando..." : id ? "Guardar cambios" : "Crear proyecto"}
      </button>
    </form>
  );
}
