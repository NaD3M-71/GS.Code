"use client";

// Botón de un <form> que pide confirmación antes de enviar
export default function BotonConfirmar({
  mensaje,
  children,
  className,
}: {
  mensaje: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(evento) => {
        if (!window.confirm(mensaje)) evento.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
