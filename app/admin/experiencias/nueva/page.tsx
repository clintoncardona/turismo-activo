"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { Save, ArrowLeft, Upload, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function NuevaExperiencia() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    duracion_dias: "",
    categoria: "Trekking",
    imagen_url: "",
  });
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [modoImagen, setModoImagen] = useState<"archivo" | "url">("archivo");
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let urlFinalImagen = formData.imagen_url;

    // Subida al Storage de Supabase
    if (modoImagen === "archivo" && imagenArchivo) {
      const fileExt = imagenArchivo.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("experiencias")
        .upload(fileName, imagenArchivo);

      if (uploadError) {
        alert("Error al subir la imagen. Verifica las políticas de Supabase.");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("experiencias")
        .getPublicUrl(fileName);
      urlFinalImagen = data.publicUrl;
    }

    // Determinar la categoría final a guardar
    const categoriaFinal =
      formData.categoria === "Otra" ? nuevaCategoria : formData.categoria;

    // Inserción en la base de datos
    const { error } = await supabase.from("experiencias").insert([
      {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        duracion_dias: Number(formData.duracion_dias),
        categoria: categoriaFinal, // Usamos la variable evaluada
        imagen_url: urlFinalImagen,
      },
    ]);

    if (!error) {
      // Limpiar el formulario
      setFormData({
        titulo: "",
        descripcion: "",
        precio: "",
        duracion_dias: "",
        categoria: "Trekking",
        imagen_url: "",
      });
      setImagenArchivo(null);
      setLoading(false);

      // Redirigir al catálogo interno
      router.push("/admin/experiencias");
    } else {
      alert("Hubo un error al guardar la experiencia.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Link
        href="/admin/experiencias"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-emerald font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Volver al catálogo
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-heading font-bold text-brand-emerald mb-8">
          Añadir Nueva Aventura
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título de la Expedición
              </label>
              <input
                required
                type="text"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-emerald"
                placeholder="Ej: Cumbre Nevado del Ruiz"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-emerald"
              >
                <option value="Trekking">Trekking</option>
                <option value="Aventura">Aventura</option>
                <option value="Relajación">Relajación</option>
                <option value="Cultura">Cultura</option>
                <option value="Otra">Otra (Nueva categoría)...</option>
              </select>

              {formData.categoria === "Otra" && (
                <input
                  required
                  type="text"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  className="w-full mt-3 px-4 py-3 bg-white border border-brand-emerald/40 rounded-xl outline-none focus:ring-2 focus:ring-brand-emerald"
                  placeholder="Escribe la nueva categoría"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (COP)
              </label>
              <input
                required
                type="number"
                min="0"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-emerald"
                placeholder="Ej: 450000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (Días)
              </label>
              <input
                required
                type="number"
                min="1"
                value={formData.duracion_dias}
                onChange={(e) =>
                  setFormData({ ...formData, duracion_dias: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-emerald"
                placeholder="Ej: 3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción Breve
            </label>
            <textarea
              required
              rows={3}
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-emerald resize-none"
              placeholder="Describe lo que hace única a esta aventura..."
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-gray-700">
                Imagen de Portada
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModoImagen("archivo")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${modoImagen === "archivo" ? "bg-brand-emerald text-white" : "bg-white text-gray-500 border border-gray-200"}`}
                >
                  <Upload className="w-4 h-4" /> Subir PC
                </button>
                <button
                  type="button"
                  onClick={() => setModoImagen("url")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${modoImagen === "url" ? "bg-brand-emerald text-white" : "bg-white text-gray-500 border border-gray-200"}`}
                >
                  <LinkIcon className="w-4 h-4" /> Usar Link
                </button>
              </div>
            </div>

            {modoImagen === "archivo" ? (
              <input
                required={!imagenArchivo}
                type="file"
                accept="image/*"
                onChange={(e) => setImagenArchivo(e.target.files?.[0] || null)}
                className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand-emerald/10 file:text-brand-emerald hover:file:bg-brand-emerald/20 transition-all cursor-pointer text-gray-500"
              />
            ) : (
              <input
                required
                type="url"
                value={formData.imagen_url}
                onChange={(e) =>
                  setFormData({ ...formData, imagen_url: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-emerald"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors mt-2 shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Guardando en la base de datos..."
            ) : (
              <>
                <Save className="w-6 h-6" /> Publicar Aventura
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
