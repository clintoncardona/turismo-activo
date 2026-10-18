"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  Map as MapIcon,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // El "Guardián": verifica si hay una sesión activa
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login"); // Si no eres tú, te expulsa al login
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-brand-emerald font-medium">
        Verificando credenciales de seguridad...
      </div>
    );
  }

  const menuItems = [
    { name: "Reservas", path: "/admin/reservas", icon: Calendar },
    { name: "Mensajes", path: "/admin/mensajes", icon: MessageSquare },
    { name: "Experiencias", path: "/admin/experiencias", icon: MapIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 text-brand-emerald font-heading font-bold text-xl">
          <LayoutDashboard className="text-brand-orange w-6 h-6" />
          <span>Backoffice</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-brand-emerald text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-brand-emerald"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal (donde irán las tablas) */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
