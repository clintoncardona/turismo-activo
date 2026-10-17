import { Map } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-emerald text-brand-earth py-12 px-6 text-center">
      <div className="flex items-center justify-center gap-2 font-heading font-bold text-2xl mb-4">
        <Map className="w-8 h-8 text-brand-orange" />
        <span>TurismoActivo</span>
      </div>
      <p className="opacity-80 text-sm">
        © {new Date().getFullYear()} Proyecto Universitario. Todos los derechos
        reservados.
      </p>
    </footer>
  );
}
