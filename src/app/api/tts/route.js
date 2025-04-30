import { NextResponse } from 'next/server';

export async function POST(req) {
  const { text, voice = 'nova' } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1', // or 'tts-1-hd' if you want higher quality
      input: text,
      voice: voice,
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 });
  }

  const audioArrayBuffer = await response.arrayBuffer();
  const audioBuffer = Buffer.from(audioArrayBuffer);

  return new NextResponse(audioBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
    },
  });
}
