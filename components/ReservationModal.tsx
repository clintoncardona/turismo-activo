"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Mail, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

type Experiencia = {
  id: string;
  titulo: string;
  precio: number;
};

type Props = {
  experiencia: Experiencia | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ReservationModal({
  experiencia,
  isOpen,
  onClose,
}: Props) {
  const [fecha, setFecha] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !experiencia) return null;

  // Acción: Redirección dinámica a WhatsApp
  const handleWhatsApp = () => {
    const mensaje = `Hola, quiero más información sobre la experiencia: ${experiencia.titulo}.`;
    const numeroWhatsApp = "573000000000"; // Reemplaza por el número real del negocio
    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
    );
  };

  // Acción: Guardar reserva en base de datos
  const handleReservar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("reservas").insert([
      {
        experiencia_id: experiencia.id,
        nombre_cliente: nombre,
        correo_cliente: correo,
        fecha_reserva: fecha,
        estado: "pendiente",
      },
    ]);

    setLoading(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNombre("");
        setCorreo("");
        setFecha("");
        onClose();
      }, 3000);
    } else {
      alert("Hubo un error al procesar la reserva. Intenta de nuevo.");
    }
  };

  return (
    <AnimatePresence>
      {/* Fondo oscuro desenfocado */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-brand-emerald/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
        >
          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-brand-orange transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8">
            <h3 className="text-2xl font-heading font-bold text-brand-emerald mb-2">
              Reservar Aventura
            </h3>
            <p className="text-gray-600 mb-6">
              Estás a un paso de vivir:{" "}
              <strong className="text-brand-emerald">
                {experiencia.titulo}
              </strong>
            </p>

            {success ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-brand-jungle/10 text-brand-jungle p-6 rounded-2xl text-center font-medium border border-brand-jungle/20"
              >
                ¡Tu pre-reserva fue enviada exitosamente! Nos contactaremos
                contigo muy pronto para confirmar.
              </motion.div>
            ) : (
              <form onSubmit={handleReservar} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      required
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-brand-earth/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-emerald focus:bg-white outline-none transition-all"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      required
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-brand-earth/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-emerald focus:bg-white outline-none transition-all"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de la Expedición
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      required
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-brand-earth/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-emerald focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-orange text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors mt-2 shadow-md disabled:opacity-50 text-lg"
                >
                  {loading ? "Procesando..." : "Confirmar Pre-Reserva"}
                </button>
              </form>
            )}

            {/* Separador y Botón WhatsApp */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleWhatsApp}
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-md text-lg"
              >
                <MessageCircle className="w-6 h-6" /> Consultar por WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
