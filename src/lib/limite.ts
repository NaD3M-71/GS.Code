import "server-only";

// Limitador simple de intentos por clave (ej: IP), en memoria.
// Alcanza para un solo servidor; se reinicia si se reinicia la app.
function crearLimitador(maximo: number, ventanaMs: number) {
  const registros = new Map<string, { cantidad: number; desde: number }>();

  return {
    // Devuelve false si ya se superó el límite
    registrar(clave: string) {
      const ahora = Date.now();
      const registro = registros.get(clave);

      if (!registro || ahora - registro.desde > ventanaMs) {
        registros.set(clave, { cantidad: 1, desde: ahora });
        return true;
      }

      registro.cantidad++;
      return registro.cantidad <= maximo;
    },
    limpiar(clave: string) {
      registros.delete(clave);
    },
  };
}

export const limiteLogin = crearLimitador(5, 15 * 60 * 1000); // 5 intentos cada 15 min
export const limiteContacto = crearLimitador(3, 10 * 60 * 1000); // 3 mensajes cada 10 min
