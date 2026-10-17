"use client";

import { useState, useEffect } from "react";
import { Map, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Detectar el scroll para cambiar el estilo del Navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-brand-earth/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-brand-emerald font-heading font-bold text-2xl"
        >
          <Map className="w-8 h-8 text-brand-orange" />
          <span>TurismoActivo</span>
        </Link>

        {/* Menú de Escritorio */}
        <div className="hidden md:flex gap-8 items-center font-sans font-medium text-brand-emerald">
          <Link
            href="#experiencias"
            className="hover:text-brand-orange transition-colors"
          >
            Experiencias
          </Link>
          <Link
            href="#contacto"
            className="hover:text-brand-orange transition-colors"
          >
            Contacto
          </Link>
          <button className="bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors shadow-md">
            Consultar
          </button>
        </div>

        {/* Botón Menú Móvil */}
        <button
          className="md:hidden text-brand-emerald"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-earth border-t border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-4">
          <Link
            href="#experiencias"
            className="text-brand-emerald font-medium"
            onClick={() => setIsOpen(false)}
          >
            Experiencias
          </Link>
          <Link
            href="#contacto"
            className="text-brand-emerald font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </Link>
        </div>
      )}
    </nav>
  );
}
