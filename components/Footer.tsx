import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-emerald text-brand-earth py-16 px-6 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        {/* Branding con el Logo Integrado */}
        <div className="flex items-center gap-3 font-heading font-bold text-2xl">
          <img
            src="/logo.png"
            alt="Logo TurismoActivo"
            className="w-16 h-16 object-contain rounded-full shadow-md border-2 border-white/10"
          />
          <span>TurismoActivo</span>
        </div>

        <p className="opacity-80 text-sm max-w-md">
          © 2026 Experiencias de Viaje. Todos los derechos reservados. <br />
          Descubre experiencias únicas y conecta con la naturaleza.
        </p>

        {/* Enlace Discreto para el Administrador */}
        <div className="pt-4 border-t border-brand-earth/10 w-full flex justify-center">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-brand-earth/40 hover:text-brand-orange transition-colors font-medium"
          >
            <Lock className="w-3.5 h-3.5" />
            Acceso Administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
}
