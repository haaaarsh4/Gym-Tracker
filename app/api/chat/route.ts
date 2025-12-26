// app/api/chat/route.ts
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Workout Tracker AI Assistant",
  }
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free", 
      messages: [
        {
          role: "system",
          content: "You are a helpful fitness assistant for a workout tracking app. Help users with workout advice, exercise form, nutrition tips, and motivation. Keep responses concise and actionable."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}