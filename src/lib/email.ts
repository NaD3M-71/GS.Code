import "server-only";
import nodemailer from "nodemailer";

// Gmail con "contraseña de aplicación" (no la contraseña normal de la cuenta)
const transporte = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Evita que el texto del visitante se interprete como HTML en el mail
const escapar = (texto: string) =>
  texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

type DatosContacto = { nombre: string; email: string; mensaje: string };

export async function avisarNuevoMensaje({ nombre, email, mensaje }: DatosContacto) {
  await transporte.sendMail({
    from: `"GS.Code Web" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACTO_DESTINO ?? process.env.SMTP_USER,
    replyTo: `"${nombre.replaceAll('"', "")}" <${email}>`, // "Responder" le contesta al visitante
    subject: `Nuevo mensaje de ${nombre} desde la web`,
    text: `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px">
        <h2 style="color:#0a0a0a">Nuevo mensaje desde gscode</h2>
        <p><strong>Nombre:</strong> ${escapar(nombre)}</p>
        <p><strong>Email:</strong> ${escapar(email)}</p>
        <div style="border-left: 4px solid #00ff00; padding: 8px 16px; background:#f5f5f5; white-space: pre-line">
          ${escapar(mensaje)}
        </div>
        <p style="color:#666; font-size: 12px">Respondé este mail para contestarle directamente.</p>
      </div>
    `,
  });
}
