import { leerArchivoImagen } from "@/lib/imagenes";

// Sirve las imágenes subidas desde la carpeta uploads/ (fuera de public/)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ archivo: string }> }
) {
  const { archivo } = await params;
  const contenido = await leerArchivoImagen(archivo);

  if (!contenido) {
    return new Response("No encontrada", { status: 404 });
  }

  return new Response(new Uint8Array(contenido), {
    headers: {
      "Content-Type": "image/webp",
      // El ?v= cambia al reemplazarla, así que se puede cachear "para siempre"
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
