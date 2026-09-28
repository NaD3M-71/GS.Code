import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Imagen que aparece al compartir el sitio en WhatsApp, LinkedIn, etc.
export const alt = "GS.Code — Desarrollo web y sistemas a medida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = await readFile(join(process.cwd(), "public/logo.png"), "base64");

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 70,
          padding: "0 90px",
          background: "#0a0a0a",
          color: "#e5e5e5",
          borderBottom: "12px solid #00ff00",
        }}
      >
        <img src={`data:image/png;base64,${logo}`} width={260} height={300} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 110, fontWeight: 800 }}>
            GS<span style={{ color: "#00ff00", fontWeight: 400 }}>.Code</span>
          </div>
          <div style={{ fontSize: 40, marginTop: 10 }}>Desarrollo web y sistemas a medida</div>
          <div style={{ fontSize: 30, marginTop: 30, color: "#a3a3a3" }}>
            Giuliano Scaglioni · gscode.com.ar
          </div>
        </div>
      </div>
    ),
    size
  );
}
