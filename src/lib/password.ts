import "server-only";
import { scrypt, timingSafeEqual } from "node:crypto";

const scryptAsync = (password: string, salt: Buffer, largo: number) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, largo, (error, hash) => (error ? reject(error) : resolve(hash)))
  );

// "guardado" tiene el formato salt:hash (hex), generado con scripts/hash-password.mjs
export async function verificarPassword(password: string, guardado: string) {
  const [saltHex, hashHex] = guardado.split(":");
  if (!saltHex || !hashHex) return false;

  const hashGuardado = Buffer.from(hashHex, "hex");
  const hashCalculado = await scryptAsync(password, Buffer.from(saltHex, "hex"), hashGuardado.length);

  // Comparación en tiempo constante (evita ataques por tiempo de respuesta)
  return timingSafeEqual(hashGuardado, hashCalculado);
}
