// src/app/api/chat/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system',
        content: "You are a helpful assistant. Speak casually and naturally. Don't start by saying 'Assistant:'.",
      },
      ...(history || []), // history from frontend, if any
      {
        role: 'user',
        content: message,
      },
    ];

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // or 'gpt-4' or 'gpt-3.5-turbo'
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'No response';

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
