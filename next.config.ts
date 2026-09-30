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
  // URLs del sitio viejo (Express) → páginas nuevas. 301 = permanente (Google actualiza su índice)
  async redirects() {
    return [
      { source: "/portfolio", destination: "/proyectos", permanent: true },
      { source: "/proyecto/:id", destination: "/proyectos", permanent: true },
      { source: "/about-me", destination: "/sobre-mi", permanent: true },
      { source: "/admin-login", destination: "/admin/login", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      // Imágenes de hasta 8 MB + margen del multipart
      bodySizeLimit: "9mb",
    },
  },
};

export default nextConfig;
