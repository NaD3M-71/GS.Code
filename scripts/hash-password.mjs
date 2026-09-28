// Genera el hash de la contraseña del admin.
// Uso: node scripts/hash-password.mjs "tu-contraseña"
import { scryptSync, randomBytes } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Uso: node scripts/hash-password.mjs "tu-contraseña"');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log("Copiá esta línea en tu .env.local:\n");
console.log(`ADMIN_PASS_HASH=${salt.toString("hex")}:${hash.toString("hex")}`);
