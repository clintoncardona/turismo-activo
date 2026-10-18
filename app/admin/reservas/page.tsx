"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Calendar } from "lucide-react";

type Reserva = {
  id: string;
  nombre_cliente: string;
  correo_cliente: string;
  fecha_reserva: string;
  estado: string;
};

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    const { data, error } = await supabase
      .from("reservas")
      .select("*")
      .order("creado_en", { ascending: false });

    if (!error && data) {
      setReservas(data);
    }
    setLoading(false);
  };

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase
      .from("reservas")
      .update({ estado: nuevoEstado })
      .eq("id", id);

    if (!error) fetchReservas(); // Recarga la tabla para mostrar el cambio
  };

  if (loading)
    return (
      <div className="text-gray-500 font-medium">Cargando reservas...</div>
    );

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-brand-emerald mb-8 flex items-center gap-3">
        <Calendar className="w-8 h-8 text-brand-orange" />
        Gestión de Reservas
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Cliente</th>
              <th className="p-4 font-semibold text-gray-600">Contacto</th>
              <th className="p-4 font-semibold text-gray-600">
                Fecha de Viaje
              </th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
              <th className="p-4 font-semibold text-gray-600">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No hay reservas en el sistema.
                </td>
              </tr>
            ) : (
              reservas.map((reserva) => (
                <tr
                  key={reserva.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-900">
                    {reserva.nombre_cliente}
                  </td>
                  <td className="p-4 text-gray-600">
                    {reserva.correo_cliente}
                  </td>
                  <td className="p-4 text-gray-600">{reserva.fecha_reserva}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        reserva.estado === "pendiente"
                          ? "bg-brand-orange/10 text-brand-orange"
                          : reserva.estado === "confirmada"
                            ? "bg-brand-emerald/10 text-brand-emerald"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reserva.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    {reserva.estado === "pendiente" && (
                      <button
                        onClick={() =>
                          actualizarEstado(reserva.id, "confirmada")
                        }
                        className="text-sm bg-brand-emerald/10 text-brand-emerald px-3 py-1 rounded-md font-medium hover:bg-brand-emerald hover:text-white transition-colors"
                      >
                        Confirmar
                      </button>
                    )}
                    {reserva.estado !== "cancelada" && (
                      <button
                        onClick={() =>
                          actualizarEstado(reserva.id, "cancelada")
                        }
                        className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-md font-medium hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
