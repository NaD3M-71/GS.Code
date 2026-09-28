import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-sm px-4 py-24">
      <p className="font-mono text-neon text-sm mb-2">&gt; sudo login</p>
      <h1 className="text-3xl font-extrabold mb-8">Panel de administración</h1>
      <div className="rounded-xl border border-borde bg-panel p-6">
        <LoginForm />
      </div>
    </section>
  );
}
