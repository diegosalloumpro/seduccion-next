// app/api/chat/route.js
import { getOpenAIResponse } from '@/api/openai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    const reply = await getOpenAIResponse(prompt);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error en la API Route:", error);
    return NextResponse.json({ error: "Hubo un error al procesar tu mensaje." }, { status: 500 });
  }
}