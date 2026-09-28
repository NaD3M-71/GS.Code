import "server-only";
import type { RowDataPacket } from "mysql2";
import { pool } from "./db";

export type Mensaje = {
  id: number;
  nombre: string;
  email: string;
  mensaje: string;
  leido: boolean;
  fecha: Date;
};

type FilaMensaje = RowDataPacket & Omit<Mensaje, "leido" | "fecha"> & { leido: number; created_at: Date };

export async function guardarMensaje(datos: { nombre: string; email: string; mensaje: string }) {
  await pool.query(`INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)`, [
    datos.nombre,
    datos.email,
    datos.mensaje,
  ]);
}

export async function listarMensajes(): Promise<Mensaje[]> {
  const [filas] = await pool.query<FilaMensaje[]>(
    `SELECT id, nombre, email, mensaje, leido, created_at
     FROM mensajes
     ORDER BY leido ASC, created_at DESC`
  );
  return filas.map((fila) => ({
    id: fila.id,
    nombre: fila.nombre,
    email: fila.email,
    mensaje: fila.mensaje,
    leido: Boolean(fila.leido),
    fecha: fila.created_at,
  }));
}

export async function alternarLeido(id: number) {
  await pool.query(`UPDATE mensajes SET leido = NOT leido WHERE id = ?`, [id]);
}

export async function eliminarMensaje(id: number) {
  await pool.query(`DELETE FROM mensajes WHERE id = ?`, [id]);
}
