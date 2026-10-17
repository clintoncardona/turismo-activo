"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Tag, Filter } from "lucide-react";
import { supabase } from "../lib/supabase";
import ReservationModal from "./ReservationModal";

type Experiencia = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  duracion_dias: number;
  categoria: string;
  imagen_url: string;
};

export default function ExperienceGrid() {
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("Todas");
  const [experienciaSeleccionada, setExperienciaSeleccionada] =
    useState<Experiencia | null>(null);

  useEffect(() => {
    async function fetchExperiencias() {
      const { data, error } = await supabase
        .from("experiencias")
        .select("*")
        .order("creado_en", { ascending: false });

      if (!error && data) {
        setExperiencias(data);
      }
      setLoading(false);
    }
    fetchExperiencias();
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center text-brand-emerald font-medium">
        Cargando expediciones...
      </div>
    );

  // Obtener categorías únicas dinámicamente de la base de datos
  const categoriasUnicas = [
    "Todas",
    ...Array.from(new Set(experiencias.map((exp) => exp.categoria))),
  ];

  // Filtrar el arreglo según el botón seleccionado
  const experienciasFiltradas =
    categoriaFiltro === "Todas"
      ? experiencias
      : experiencias.filter((exp) => exp.categoria === categoriaFiltro);

  return (
    <section id="experiencias" className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-emerald mb-4">
            Catálogo de Aventuras
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elige tu próximo destino. Filtra por nivel de intensidad o tiempo
            disponible.
          </p>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <div className="flex items-center gap-2 text-brand-emerald/70 mr-2">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filtrar por:</span>
          </div>
          {categoriasUnicas.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaFiltro(categoria)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                categoriaFiltro === categoria
                  ? "bg-brand-orange text-white shadow-md"
                  : "bg-brand-earth text-brand-emerald hover:bg-brand-emerald/10 border border-transparent hover:border-brand-emerald/20"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {/* Cuadrícula de Tarjetas Filtradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experienciasFiltradas.map((exp) => (
            <motion.div
              key={exp.id}
              layout // Permite una transición suave al reordenar elementos al filtrar
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-brand-earth rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col"
            >
              <div
                className="h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${exp.imagen_url})` }}
              />

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-brand-emerald font-heading leading-tight pr-2">
                    {exp.titulo}
                  </h3>
                  <span className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                    ${exp.precio.toLocaleString("es-CO")}
                  </span>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-2 flex-grow">
                  {exp.descripcion}
                </p>

                <div className="flex gap-4 mb-6 text-sm font-medium text-brand-emerald/80">
                  <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-md shadow-sm">
                    <Clock className="w-4 h-4" /> {exp.duracion_dias}{" "}
                    {exp.duracion_dias > 1 ? "días" : "día"}
                  </span>
                  <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-md shadow-sm">
                    <Tag className="w-4 h-4" /> {exp.categoria}
                  </span>
                </div>

                <button
                  onClick={() => setExperienciaSeleccionada(exp)}
                  className="w-full bg-brand-emerald text-white py-3 rounded-xl font-medium hover:bg-brand-jungle transition-colors mt-auto shadow-md"
                >
                  Ver Detalles
                </button>
              </div>
            </motion.div>
          ))}

          {experienciasFiltradas.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 font-medium">
              No hay aventuras disponibles para esta categoría en este momento.
            </div>
          )}
        </div>
        {/* Renderizado del Modal */}
        <ReservationModal
          experiencia={experienciaSeleccionada}
          isOpen={!!experienciaSeleccionada}
          onClose={() => setExperienciaSeleccionada(null)}
        />
      </div>
    </section>
  );
}
