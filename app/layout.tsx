"use client";

import { Inter, Syne } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Lista de rutas donde NO queremos que aparezca el Navbar público
  const isProtectedPath =
    pathname?.startsWith("/login") || pathname?.startsWith("/admin");

  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${syne.variable} font-sans bg-brand-earth text-gray-900 antialiased`}
      >
        {!isProtectedPath && <Navbar />}
        {children}
      </body>
    </html>
  );
}
