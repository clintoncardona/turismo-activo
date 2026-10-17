import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, correo, mensaje } = body;

    // Inserción segura desde el backend a la tabla contactos
    const { error } = await supabase
      .from("contactos")
      .insert([{ nombre, correo, mensaje }]);

    if (error) throw error;

    return NextResponse.json(
      { message: "Mensaje guardado exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 },
    );
  }
}
