import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: "Aventuras y Turismo Activo",
  description:
    "Descubre experiencias únicas, conecta con la naturaleza y reserva tu próxima aventura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${syne.variable} font-sans bg-brand-earth text-gray-900 antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
