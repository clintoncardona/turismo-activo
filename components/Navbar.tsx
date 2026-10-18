"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColorClass = isScrolled ? "text-brand-emerald" : "text-white";
  const logoColorClass = isScrolled ? "text-brand-emerald" : "text-white";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-brand-earth/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo personalizado de la marca */}
        <Link
          href="/"
          className={`flex items-center gap-3 font-heading font-bold text-2xl transition-colors ${logoColorClass}`}
        >
          <img
            src="/logo.png"
            alt="Logo TurismoActivo"
            className="w-14 h-14 object-contain rounded-full shadow-sm"
          />
          <span>TurismoActivo</span>
        </Link>

        {/* Menú Escritorio */}
        <div
          className={`hidden md:flex gap-8 items-center font-sans font-medium transition-colors ${textColorClass}`}
        >
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
          <a
            href="#contacto"
            className="bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors shadow-md"
          >
            Consultar
          </a>
        </div>

        <button
          className={`md:hidden ${textColorClass}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Menú Móvil */}
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
          <a
            href="#contacto"
            className="text-brand-orange font-bold"
            onClick={() => setIsOpen(false)}
          >
            Consultar Ahora
          </a>
        </div>
      )}
    </nav>
  );
}
