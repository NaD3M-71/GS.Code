import "server-only";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "./db";
import type { TipoProyecto } from "./proyectos";

export type Tecnologia = { id: number; nombre: string };

// Datos que se cargan/editan desde el formulario
export type DatosProyecto = {
  titulo: string;
  slug: string;
  resumen: string;
  descripcion: string;
  url: string | null;
  github: string | null;
  tipo: TipoProyecto;
  destacado: boolean;
  publicado: boolean;
  orden: number;
  tecnologias: number[];
  nuevasTecnologias: string[];
};

export type ProyectoEditable = Omit<DatosProyecto, "nuevasTecnologias"> & { id: number };

// Fila del listado del admin
export type ProyectoAdmin = {
  id: number;
  slug: string;
  titulo: string;
  tipo: TipoProyecto;
  publicado: boolean;
  destacado: boolean;
  orden: number;
  imagenes: number;
};

// ---------- Lectura ----------

type FilaAdmin = RowDataPacket & Omit<ProyectoAdmin, "publicado" | "destacado"> & {
  publicado: number;
  destacado: number;
};

export async function listarProyectosAdmin(): Promise<ProyectoAdmin[]> {
  const [filas] = await pool.query<FilaAdmin[]>(
    `SELECT p.id, p.slug, p.titulo, p.tipo, p.publicado, p.destacado, p.orden,
            COUNT(i.id) AS imagenes
     FROM proyectos p
     LEFT JOIN proyecto_imagenes i ON i.proyecto_id = p.id
     GROUP BY p.id
     ORDER BY p.orden ASC, p.created_at DESC`
  );
  return filas.map((fila) => ({
    id: fila.id,
    slug: fila.slug,
    titulo: fila.titulo,
    tipo: fila.tipo,
    publicado: Boolean(fila.publicado),
    destacado: Boolean(fila.destacado),
    orden: fila.orden,
    imagenes: Number(fila.imagenes),
  }));
}

type FilaEditable = RowDataPacket & Omit<ProyectoEditable, "publicado" | "destacado" | "tecnologias"> & {
  publicado: number;
  destacado: number;
};

export async function obtenerProyectoAdmin(id: number): Promise<ProyectoEditable | null> {
  const [filas] = await pool.query<FilaEditable[]>(
    `SELECT id, titulo, slug, resumen, descripcion, url, github, tipo, destacado, publicado, orden
     FROM proyectos WHERE id = ?`,
    [id]
  );
  const fila = filas[0];
  if (!fila) return null;

  const [tecs] = await pool.query<(RowDataPacket & { tecnologia_id: number })[]>(
    `SELECT tecnologia_id FROM proyecto_tecnologias WHERE proyecto_id = ?`,
    [id]
  );

  return {
    id: fila.id,
    titulo: fila.titulo,
    slug: fila.slug,
    resumen: fila.resumen,
    descripcion: fila.descripcion,
    url: fila.url,
    github: fila.github,
    tipo: fila.tipo,
    destacado: Boolean(fila.destacado),
    publicado: Boolean(fila.publicado),
    orden: fila.orden,
    tecnologias: tecs.map((t) => t.tecnologia_id),
  };
}

export async function listarTecnologias(): Promise<Tecnologia[]> {
  const [filas] = await pool.query<(RowDataPacket & Tecnologia)[]>(
    `SELECT id, nombre FROM tecnologias ORDER BY nombre`
  );
  return filas.map((fila) => ({ id: fila.id, nombre: fila.nombre }));
}

// ---------- Escritura ----------

// Reemplaza las tecnologías del proyecto (y crea las nuevas si no existen)
async function guardarTecnologias(
  conexion: PoolConnection,
  proyectoId: number,
  ids: number[],
  nuevas: string[]
) {
  const todas = new Set(ids);

  for (const nombre of nuevas) {
    await conexion.query(`INSERT IGNORE INTO tecnologias (nombre) VALUES (?)`, [nombre]);
    const [filas] = await conexion.query<(RowDataPacket & { id: number })[]>(
      `SELECT id FROM tecnologias WHERE nombre = ?`,
      [nombre]
    );
    if (filas[0]) todas.add(filas[0].id);
  }

  await conexion.query(`DELETE FROM proyecto_tecnologias WHERE proyecto_id = ?`, [proyectoId]);

  if (todas.size > 0) {
    const valores = [...todas].map((tecId) => [proyectoId, tecId]);
    await conexion.query(
      `INSERT INTO proyecto_tecnologias (proyecto_id, tecnologia_id) VALUES ?`,
      [valores]
    );
  }
}

const columnas = (d: DatosProyecto) => [
  d.titulo, d.slug, d.resumen, d.descripcion, d.url, d.github,
  d.tipo, d.destacado, d.publicado, d.orden,
];

// Todo dentro de una transacción: o se guarda todo, o nada
export async function crearProyecto(datos: DatosProyecto): Promise<number> {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const [resultado] = await conexion.query<ResultSetHeader>(
      `INSERT INTO proyectos
         (titulo, slug, resumen, descripcion, url, github, tipo, destacado, publicado, orden)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      columnas(datos)
    );
    await guardarTecnologias(conexion, resultado.insertId, datos.tecnologias, datos.nuevasTecnologias);
    await conexion.commit();
    return resultado.insertId;
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

export async function actualizarProyecto(id: number, datos: DatosProyecto) {
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    await conexion.query(
      `UPDATE proyectos SET
         titulo = ?, slug = ?, resumen = ?, descripcion = ?, url = ?, github = ?,
         tipo = ?, destacado = ?, publicado = ?, orden = ?
       WHERE id = ?`,
      [...columnas(datos), id]
    );
    await guardarTecnologias(conexion, id, datos.tecnologias, datos.nuevasTecnologias);
    await conexion.commit();
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

export async function eliminarProyecto(id: number) {
  // Las imágenes y tecnologías asociadas se borran por ON DELETE CASCADE
  await pool.query(`DELETE FROM proyectos WHERE id = ?`, [id]);
}

export async function alternarPublicado(id: number) {
  await pool.query(`UPDATE proyectos SET publicado = NOT publicado WHERE id = ?`, [id]);
}
