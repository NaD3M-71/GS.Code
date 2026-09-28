import { cache } from "react";
import type { RowDataPacket } from "mysql2";
import { pool } from "./db";

export type TipoProyecto = "propio" | "cliente";

export type Imagen = {
  numero: number;
  url: string;
  alt: string;
};

// Lo que muestra la card del listado
export type ProyectoResumen = {
  id: number;
  slug: string;
  titulo: string;
  resumen: string;
  tipo: TipoProyecto;
  destacado: boolean;
  portada: string | null;
  tecnologias: string[];
};

// Lo que muestra la página de detalle
export type ProyectoDetalle = ProyectoResumen & {
  descripcion: string;
  url: string | null;
  github: string | null;
  imagenes: Imagen[];
};

// Las imágenes se sirven desde /uploads. El ?v= cambia cada vez que se
// reemplaza una imagen, así el navegador no muestra la versión vieja.
export const urlImagen = (archivo: string, actualizada: Date) =>
  `/uploads/proyectos/${archivo}?v=${actualizada.getTime()}`;

// GROUP_CONCAT devuelve "Next.js,MySQL,Docker" (o null): lo pasamos a array
const aLista = (texto: string | null) => (texto ? texto.split(",") : []);

type FilaResumen = RowDataPacket & {
  id: number;
  slug: string;
  titulo: string;
  resumen: string;
  tipo: TipoProyecto;
  destacado: number;
  portada_archivo: string | null;
  portada_actualizada: Date | null;
  tecnologias: string | null;
};

const aResumen = (fila: FilaResumen): ProyectoResumen => ({
  id: fila.id,
  slug: fila.slug,
  titulo: fila.titulo,
  resumen: fila.resumen,
  tipo: fila.tipo,
  destacado: Boolean(fila.destacado),
  portada:
    fila.portada_archivo && fila.portada_actualizada
      ? urlImagen(fila.portada_archivo, fila.portada_actualizada)
      : null,
  tecnologias: aLista(fila.tecnologias),
});

// Listado público: solo publicados, ordenados por "orden" y luego los más nuevos
export async function getProyectos(): Promise<ProyectoResumen[]> {
  const [filas] = await pool.query<FilaResumen[]>(
    `SELECT p.id, p.slug, p.titulo, p.resumen, p.tipo, p.destacado,
            i.archivo    AS portada_archivo,
            i.updated_at AS portada_actualizada,
            GROUP_CONCAT(t.nombre ORDER BY t.nombre SEPARATOR ',') AS tecnologias
     FROM proyectos p
     LEFT JOIN proyecto_imagenes i     ON i.proyecto_id = p.id AND i.numero = 1
     LEFT JOIN proyecto_tecnologias pt ON pt.proyecto_id = p.id
     LEFT JOIN tecnologias t           ON t.id = pt.tecnologia_id
     WHERE p.publicado = TRUE
     GROUP BY p.id, i.archivo, i.updated_at
     ORDER BY p.orden ASC, p.created_at DESC`
  );
  return filas.map((fila) => aResumen(fila));
}

type FilaDetalle = FilaResumen & {
  descripcion: string;
  url: string | null;
  github: string | null;
};

type FilaImagen = RowDataPacket & {
  numero: number;
  archivo: string;
  alt: string | null;
  updated_at: Date;
};

// Detalle público por slug (null si no existe o no está publicado).
// cache() evita consultar dos veces en la misma visita (metadata + página).
export const getProyecto = cache(async (slug: string): Promise<ProyectoDetalle | null> => {
  const [filas] = await pool.query<FilaDetalle[]>(
    `SELECT p.id, p.slug, p.titulo, p.resumen, p.descripcion, p.url, p.github,
            p.tipo, p.destacado,
            i.archivo    AS portada_archivo,
            i.updated_at AS portada_actualizada,
            GROUP_CONCAT(t.nombre ORDER BY t.nombre SEPARATOR ',') AS tecnologias
     FROM proyectos p
     LEFT JOIN proyecto_imagenes i     ON i.proyecto_id = p.id AND i.numero = 1
     LEFT JOIN proyecto_tecnologias pt ON pt.proyecto_id = p.id
     LEFT JOIN tecnologias t           ON t.id = pt.tecnologia_id
     WHERE p.slug = ? AND p.publicado = TRUE
     GROUP BY p.id, i.archivo, i.updated_at`,
    [slug]
  );

  const fila = filas[0];
  if (!fila) return null;

  const [imagenes] = await pool.query<FilaImagen[]>(
    `SELECT numero, archivo, alt, updated_at
     FROM proyecto_imagenes
     WHERE proyecto_id = ?
     ORDER BY numero`,
    [fila.id]
  );

  return {
    ...aResumen(fila),
    descripcion: fila.descripcion,
    url: fila.url,
    github: fila.github,
    imagenes: imagenes.map((img) => ({
      numero: img.numero,
      url: urlImagen(img.archivo, img.updated_at),
      alt: img.alt ?? `${fila.titulo} - imagen ${img.numero}`,
    })),
  };
});

// Para el sitemap: slug y última modificación de cada proyecto publicado
export async function getSlugsPublicados(): Promise<{ slug: string; actualizado: Date }[]> {
  const [filas] = await pool.query<(RowDataPacket & { slug: string; updated_at: Date })[]>(
    `SELECT slug, updated_at FROM proyectos WHERE publicado = TRUE ORDER BY orden`
  );
  return filas.map((fila) => ({ slug: fila.slug, actualizado: fila.updated_at }));
}
