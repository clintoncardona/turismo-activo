import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { correoDestino, nombreCliente, mensajeRespuesta } =
      await request.json();

    // Configuramos el "transportador" de correo usando Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construimos y enviamos el correo
    await transporter.sendMail({
      from: `"TurismoActivo" <${process.env.EMAIL_USER}>`,
      to: correoDestino,
      subject: `Respuesta a tu consulta - TurismoActivo`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #047857;">¡Hola, ${nombreCliente}!</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            ${mensajeRespuesta.replace(/\n/g, "<br>")}
          </p>
          <br>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 14px;">
            Atentamente,<br>
            <strong>El equipo de TurismoActivo</strong>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json(
      { error: "Error al enviar el correo" },
      { status: 500 },
    );
  }
}
