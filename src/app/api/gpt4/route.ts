import { NextResponse } from "next/server";
import { createErrorResponse } from "../../../../utils";
import OpenAI from "openai";

export async function POST(req: any) {
  const { prompt } = await req.json();
  const openai = new OpenAI({
    apiKey: process.env.GPT4_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
    return createErrorResponse("Error generating text", 500);
  }
}
