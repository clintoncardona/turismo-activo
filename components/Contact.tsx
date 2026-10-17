"use client";

import { useState } from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ nombre: "", correo: "", mensaje: "" });
        setTimeout(() => setStatus("idle"), 4000); // Vuelve al estado inicial después de 4 seg
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section id="contacto" className="py-24 bg-brand-earth px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Información de contacto */}
        <div>
          <h2 className="text-4xl font-heading font-bold text-brand-emerald mb-6">
            Comienza tu <span className="text-brand-orange">Aventura</span>
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            ¿Tienes dudas sobre alguna expedición o quieres un viaje
            personalizado? Escríbenos y nuestro equipo se pondrá en contacto
            contigo.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-brand-emerald">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <MapPin className="w-6 h-6 text-brand-orange" />
              </div>
              <span className="font-medium">Medellín, Antioquia, Colombia</span>
            </div>
            <div className="flex items-center gap-4 text-brand-emerald">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Phone className="w-6 h-6 text-brand-orange" />
              </div>
              <span className="font-medium">+57 300 000 0000</span>
            </div>
            <div className="flex items-center gap-4 text-brand-emerald">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Mail className="w-6 h-6 text-brand-orange" />
              </div>
              <span className="font-medium">aventura@turismoactivo.com</span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          {status === "success" ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="bg-brand-jungle/10 p-4 rounded-full mb-4">
                <Send className="w-12 h-12 text-brand-jungle" />
              </div>
              <h3 className="text-2xl font-bold text-brand-emerald mb-2">
                ¡Mensaje Enviado!
              </h3>
              <p className="text-gray-600">
                Nos pondremos en contacto contigo muy pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  required
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-brand-earth/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-emerald outline-none transition-all"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  required
                  type="email"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-brand-earth/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-emerald outline-none transition-all"
                  placeholder="tu@correo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.mensaje}
                  onChange={(e) =>
                    setFormData({ ...formData, mensaje: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-brand-earth/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-emerald outline-none resize-none transition-all"
                  placeholder="¿En qué te podemos ayudar?"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-brand-emerald text-white py-3.5 rounded-xl font-bold hover:bg-brand-jungle transition-colors mt-2 shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {status === "loading" ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
