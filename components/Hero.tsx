"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo con capa de oscurecimiento */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-brand-emerald/80 mix-blend-multiply" />
      </div>

      {/* Contenido animado con whileInView para forzar la carga */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight"
        >
          Descubre Tu Próxima <br className="hidden md:block" />
          <span className="text-brand-orange">Gran Aventura</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-brand-earth/90 mb-10 max-w-2xl mx-auto font-sans"
        >
          Experiencias únicas en la naturaleza diseñadas para desconectar de la
          rutina y reconectar con lo esencial.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#experiencias"
            className="bg-brand-orange text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-orange-600 transition-colors shadow-lg"
          >
            Explorar Viajes
          </a>
          <a
            href="#contacto"
            className="bg-transparent border-2 border-brand-earth text-brand-earth px-8 py-4 rounded-full font-medium text-lg hover:bg-brand-earth hover:text-brand-emerald transition-colors"
          >
            Hablar con un Guía
          </a>
        </motion.div>
      </div>
    </section>
  );
}
