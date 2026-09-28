import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera una versión mínima para Docker (.next/standalone)
  output: "standalone",
  images: {
    // Rutas locales que <Image> puede optimizar
    localPatterns: [
      // Imágenes subidas desde el admin (llevan ?v= para romper la caché)
      { pathname: "/uploads/proyectos/**" },
      // Resto de archivos de /public, sin query string
      { pathname: "/**", search: "" },
    ],
  },
  experimental: {
    serverActions: {
      // Imágenes de hasta 8 MB + margen del multipart
      bodySizeLimit: "9mb",
    },
  },
};

export default nextConfig;
