import "server-only";
import path from "node:path";
import { mkdir, rename, unlink, readFile } from "node:fs/promises";
import sharp from "sharp";
import type { RowDataPacket } from "mysql2";
import { pool } from "./db";
import { urlImagen, type Imagen } from "./proyectos";

export const MAX_IMAGENES = 5;
export const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

// Carpeta donde se guardan (en Docker va a ser un volumen)
const CARPETA = path.join(process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads"), "proyectos");

// Solo nombres generados por nosotros: evita que alguien pida "../../.env"
export const ARCHIVO_VALIDO = /^[a-z0-9-]+-img[1-5]\.webp$/;

export const nombreArchivo = (slug: string, numero: number) => `${slug}-img${numero}.webp`;

const rutaArchivo = (archivo: string) => path.join(CARPETA, archivo);

// Borra un archivo sin fallar si ya no existe
async function borrarArchivo(archivo: string) {
  try {
    await unlink(rutaArchivo(archivo));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export async function leerArchivoImagen(archivo: string) {
  if (!ARCHIVO_VALIDO.test(archivo)) return null;
  try {
    return await readFile(rutaArchivo(archivo));
  } catch {
    return null;
  }
}

export function validarArchivo(archivo: File): string | null {
  if (archivo.size === 0) return "Elegí una imagen.";
  if (archivo.size > MAX_BYTES) return "La imagen supera los 8 MB.";
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) return "Formato no permitido (JPG, PNG, WebP, AVIF o GIF).";
  return null;
}

// Convierte a WebP (máx. 1600px), guarda como slug-imgN.webp y registra en la base
export async function guardarImagen(
  proyectoId: number,
  slug: string,
  numero: number,
  archivo: File,
  alt: string | null
) {
  await mkdir(CARPETA, { recursive: true });

  const nombre = nombreArchivo(slug, numero);
  const temporal = rutaArchivo(`${nombre}.${Date.now()}.tmp`);

  // sharp falla si el archivo no es realmente una imagen (aunque diga .jpg)
  await sharp(Buffer.from(await archivo.arrayBuffer()))
    .rotate() // respeta la orientación de fotos de celular
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(temporal);

  // Escribimos en un temporal y renombramos: nunca queda un archivo a medio escribir
  await rename(temporal, rutaArchivo(nombre));

  // Si ya había imagen en ese número, se actualiza (y cambia updated_at → nuevo ?v=)
  await pool.query(
    `INSERT INTO proyecto_imagenes (proyecto_id, numero, archivo, alt)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE archivo = VALUES(archivo), alt = VALUES(alt), updated_at = CURRENT_TIMESTAMP`,
    [proyectoId, numero, nombre, alt]
  );
}

type FilaImagen = RowDataPacket & { numero: number; archivo: string; alt: string | null; updated_at: Date };

export async function listarImagenes(proyectoId: number): Promise<Imagen[]> {
  const [filas] = await pool.query<FilaImagen[]>(
    `SELECT numero, archivo, alt, updated_at FROM proyecto_imagenes WHERE proyecto_id = ? ORDER BY numero`,
    [proyectoId]
  );
  return filas.map((fila) => ({
    numero: fila.numero,
    url: urlImagen(fila.archivo, fila.updated_at),
    alt: fila.alt ?? "",
  }));
}

export async function borrarImagen(proyectoId: number, numero: number) {
  const [filas] = await pool.query<FilaImagen[]>(
    `SELECT archivo FROM proyecto_imagenes WHERE proyecto_id = ? AND numero = ?`,
    [proyectoId, numero]
  );
  if (!filas[0]) return;

  await pool.query(`DELETE FROM proyecto_imagenes WHERE proyecto_id = ? AND numero = ?`, [proyectoId, numero]);
  await borrarArchivo(filas[0].archivo);
}

// Antes de eliminar un proyecto: borra sus archivos del disco
export async function borrarImagenesDeProyecto(proyectoId: number) {
  const [filas] = await pool.query<FilaImagen[]>(
    `SELECT archivo FROM proyecto_imagenes WHERE proyecto_id = ?`,
    [proyectoId]
  );
  await Promise.all(filas.map((fila) => borrarArchivo(fila.archivo)));
}

// Si cambia el slug, renombra los archivos para que sigan siendo slug-imgN.webp
export async function renombrarImagenes(proyectoId: number, slugNuevo: string) {
  const [filas] = await pool.query<FilaImagen[]>(
    `SELECT numero, archivo FROM proyecto_imagenes WHERE proyecto_id = ?`,
    [proyectoId]
  );

  for (const fila of filas) {
    const nuevo = nombreArchivo(slugNuevo, fila.numero);
    if (nuevo === fila.archivo) continue;

    await rename(rutaArchivo(fila.archivo), rutaArchivo(nuevo));
    await pool.query(
      `UPDATE proyecto_imagenes SET archivo = ?, updated_at = CURRENT_TIMESTAMP
       WHERE proyecto_id = ? AND numero = ?`,
      [nuevo, proyectoId, fila.numero]
    );
  }
}
