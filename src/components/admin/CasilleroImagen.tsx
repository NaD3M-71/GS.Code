"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { quitarImagen, subirImagen, type EstadoImagen } from "@/app/admin/(panel)/proyectos/imagenes-actions";
import type { Imagen } from "@/lib/proyectos";

type Props = {
  proyectoId: number;
  numero: number;
  imagen?: Imagen;
};

export default function CasilleroImagen({ proyectoId, numero, imagen }: Props) {
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);

  const [estado, accion, subiendo] = useActionState<EstadoImagen, FormData>(
    async (estadoPrevio, formData) => {
      const resultado = await subirImagen(proyectoId, numero, estadoPrevio, formData);
      // Si se subió bien, sacamos la vista previa local (ya se ve la del servidor)
      if (resultado?.ok) setVistaPrevia(null);
      return resultado;
    },
    undefined
  );

  // Liberar la memoria de la vista previa cuando cambia o se desmonta
  useEffect(() => {
    return () => {
      if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
    };
  }, [vistaPrevia]);

  const origen = vistaPrevia ?? imagen?.url;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-borde bg-panel p-4">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-neon">img{numero}</span>
        {numero === 1 && <span className="text-suave">portada</span>}
      </div>

      <div className="relative aspect-video overflow-hidden rounded-md border border-borde bg-negro">
        {origen ? (
          vistaPrevia ? (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:)
            <img src={vistaPrevia} alt="" className="h-full w-full object-cover opacity-70" />
          ) : (
            <Image src={origen} alt={imagen?.alt ?? ""} fill sizes="300px" className="object-cover" />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-suave">vacío</div>
        )}
      </div>

      <form action={accion} className="flex flex-col gap-2">
        <input
          type="file"
          name="imagen"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          required
          onChange={(evento) => {
            const archivo = evento.target.files?.[0];
            setVistaPrevia(archivo ? URL.createObjectURL(archivo) : null);
          }}
          className="text-xs text-suave file:mr-2 file:rounded file:border-0 file:bg-borde file:px-2 file:py-1 file:text-claro"
        />
        <input
          name="alt"
          defaultValue={imagen?.alt ?? ""}
          placeholder="Texto alternativo (opcional)"
          maxLength={200}
          className="rounded-md border border-borde bg-negro px-3 py-1.5 text-sm outline-none focus:border-neon"
        />
        <button
          type="submit"
          disabled={subiendo}
          className="rounded-md bg-neon px-3 py-1.5 text-sm font-bold text-black disabled:opacity-50"
        >
          {subiendo ? "Subiendo..." : imagen ? "Reemplazar" : "Subir"}
        </button>
      </form>

      {imagen && (
        <form action={quitarImagen.bind(null, proyectoId, numero)}>
          <button
            type="submit"
            className="w-full text-sm text-suave hover:text-red-400"
            onClick={(evento) => {
              if (!window.confirm(`¿Quitar la imagen ${numero}?`)) evento.preventDefault();
            }}
          >
            Quitar
          </button>
        </form>
      )}

      {estado?.error && <p className="text-xs text-red-400">{estado.error}</p>}
      {estado?.ok && <p className="text-xs text-neon">{estado.ok}</p>}
    </div>
  );
}
