"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { MessageSquare, Check, MailOpen, Reply, Send } from "lucide-react";

type Mensaje = {
  id: string;
  nombre: string;
  correo: string;
  mensaje: string;
  leido: boolean;
  creado_en: string;
};

export default function MensajesPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el sistema de respuesta
  const [respondiendoA, setRespondiendoA] = useState<string | null>(null);
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetchMensajes();
  }, []);

  const fetchMensajes = async () => {
    const { data, error } = await supabase
      .from("contactos")
      .select("*")
      .order("creado_en", { ascending: false });
    if (!error && data) setMensajes(data);
    setLoading(false);
  };

  const marcarComoLeido = async (id: string) => {
    const { error } = await supabase
      .from("contactos")
      .update({ leido: true })
      .eq("id", id);
    if (!error) fetchMensajes();
  };

  const enviarRespuesta = async (
    correoDestino: string,
    nombreCliente: string,
    idMensaje: string,
  ) => {
    if (!respuestaTexto.trim())
      return alert("Por favor escribe una respuesta.");
    setEnviando(true);

    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correoDestino,
          nombreCliente,
          mensajeRespuesta: respuestaTexto,
        }),
      });

      if (res.ok) {
        alert("¡Respuesta enviada exitosamente al correo del cliente!");
        setRespuestaTexto("");
        setRespondiendoA(null);
        marcarComoLeido(idMensaje); // Lo marcamos como leído automáticamente
      } else {
        alert(
          "Error al enviar el correo. Verifica las credenciales en .env.local",
        );
      }
    } catch (error) {
      alert("Error de conexión.");
    }
    setEnviando(false);
  };

  if (loading)
    return (
      <div className="text-gray-500 font-medium">
        Cargando bandeja de entrada...
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-brand-emerald mb-8 flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-brand-orange" />
        Bandeja de Mensajes
      </h1>

      <div className="flex flex-col gap-6 pb-12">
        {mensajes.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-gray-500 border border-gray-100">
            No tienes mensajes nuevos.
          </div>
        ) : (
          mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white p-6 rounded-2xl shadow-sm border transition-all duration-300 ${msg.leido ? "border-gray-100 opacity-70 bg-gray-50/50" : "border-l-4 border-l-brand-orange border-y-gray-100 border-r-gray-100 hover:shadow-md"}`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">
                    {msg.nombre}
                  </h3>
                  <p className="text-brand-emerald font-medium text-sm mt-1">
                    {msg.correo}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 font-medium px-2">
                    {new Date(msg.creado_en).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {!msg.leido ? (
                    <button
                      onClick={() => marcarComoLeido(msg.id)}
                      className="flex items-center gap-1.5 text-sm bg-brand-emerald/10 text-brand-emerald px-4 py-2 rounded-xl font-bold hover:bg-brand-emerald hover:text-white transition-colors"
                    >
                      <Check className="w-4 h-4" /> Marcar Leído
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm bg-gray-100 text-gray-500 px-4 py-2 rounded-xl font-bold">
                      <MailOpen className="w-4 h-4" /> Leído
                    </span>
                  )}
                </div>
              </div>

              <div className="text-gray-700 bg-gray-50 p-5 rounded-xl border border-gray-100 whitespace-pre-wrap text-base leading-relaxed mb-4">
                {msg.mensaje}
              </div>

              {/* Botón para abrir caja de respuesta web */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setRespondiendoA(msg.id === respondiendoA ? null : msg.id);
                    setRespuestaTexto("");
                  }}
                  className="flex items-center gap-2 text-brand-orange font-bold hover:text-orange-600 transition-colors text-sm px-2 py-1"
                >
                  <Reply className="w-4 h-4" />{" "}
                  {respondiendoA === msg.id
                    ? "Cancelar Respuesta"
                    : "Responder aquí"}
                </button>
              </div>

              {/* Caja de respuesta interactiva */}
              {respondiendoA === msg.id && (
                <div className="mt-4 bg-white p-5 rounded-xl border border-brand-emerald/20 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Respuesta para {msg.nombre}
                  </label>
                  <textarea
                    rows={4}
                    value={respuestaTexto}
                    onChange={(e) => setRespuestaTexto(e.target.value)}
                    placeholder="Escribe tu respuesta. Le llegará directamente a su correo..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-emerald resize-none mb-4"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        enviarRespuesta(msg.correo, msg.nombre, msg.id)
                      }
                      disabled={enviando}
                      className="bg-brand-emerald text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-jungle transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
                    >
                      {enviando ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Enviar Respuesta por
                          Correo
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
