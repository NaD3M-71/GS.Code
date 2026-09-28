"use client";

import Image from "next/image";
import { useState } from "react";
import type { Imagen } from "@/lib/proyectos";

export default function Galeria({ imagenes }: { imagenes: Imagen[] }) {
  const [actual, setActual] = useState(0);

  if (imagenes.length === 0) return null;

  const imagen = imagenes[actual];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-borde bg-panel">
        <Image
          key={imagen.url}
          src={imagen.url}
          alt={imagen.alt}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-contain"
          priority={actual === 0}
        />
      </div>

      {imagenes.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {imagenes.map((img, indice) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActual(indice)}
              aria-label={`Ver imagen ${img.numero}`}
              aria-current={indice === actual}
              className={`relative aspect-video overflow-hidden rounded-md border transition ${
                indice === actual
                  ? "border-neon glow-box"
                  : "border-borde opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
