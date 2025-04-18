// app/api/reset/route.js
import { resetConversation } from '@/api/openai';
import { NextResponse } from 'next/server';

export async function POST() {
  resetConversation();
  return NextResponse.json({ message: 'Conversación reseteada en el servidor.' });
}