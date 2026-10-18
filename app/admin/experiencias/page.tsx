"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { Map as MapIcon, Plus, Trash2 } from "lucide-react";

type Experiencia = {
  id: string;
  titulo: string;
  precio: number;
  categoria: string;
};

export default function GestionExperiencias() {
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiencias();
  }, []);

  const fetchExperiencias = async () => {
    const { data, error } = await supabase
      .from("experiencias")
      .select("*")
      .order("creado_en", { ascending: false });
    if (!error && data) setExperiencias(data);
    setLoading(false);
  };

  const eliminarExperiencia = async (id: string) => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar esta experiencia del catálogo público?",
      )
    ) {
      await supabase.from("experiencias").delete().eq("id", id);
      fetchExperiencias();
    }
  };

  if (loading)
    return (
      <div className="text-gray-500 font-medium">Cargando catálogo...</div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-brand-emerald flex items-center gap-3">
          <MapIcon className="w-8 h-8 text-brand-orange" />
          Tus Experiencias
        </h1>
        <Link
          href="/admin/experiencias/nueva"
          className="bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" /> Nueva Aventura
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Título</th>
              <th className="p-4 font-semibold text-gray-600">Categoría</th>
              <th className="p-4 font-semibold text-gray-600">Precio</th>
              <th className="p-4 font-semibold text-gray-600">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {experiencias.map((exp) => (
              <tr
                key={exp.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-4 font-medium text-gray-900">{exp.titulo}</td>
                <td className="p-4 text-gray-600">{exp.categoria}</td>
                <td className="p-4 text-brand-emerald font-bold">
                  ${exp.precio.toLocaleString("es-CO")}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => eliminarExperiencia(exp.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
