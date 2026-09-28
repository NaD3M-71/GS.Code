import type { Metadata } from "next";
import { Rubik, Kode_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITIO_URL } from "@/lib/sitio";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });
const kode = Kode_Mono({ subsets: ["latin"], variable: "--font-kode" });

const descripcion =
  "Giuliano Scaglioni — desarrollador full-stack. Sitios web, sistemas de gestión y bases de datos a medida.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL), // convierte rutas relativas (imágenes OG) en absolutas
  title: {
    default: "GS.Code | Desarrollo web",
    template: "%s | GS.Code",
  },
  description: descripcion,
  authors: [{ name: "Giuliano Scaglioni" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "GS.Code",
    title: "GS.Code | Desarrollo web",
    description: descripcion,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${rubik.variable} ${kode.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
