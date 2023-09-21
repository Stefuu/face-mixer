import { NextResponse } from "next/server";
import { createErrorResponse } from "../../../../utils";

export async function POST(req: any) {
  const { prompt } = await req.json();

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GPT3_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        max_tokens: 2097,
        prompt,
        n: 1,
      }),
    });

    const data = await response.json();
    const name = data.choices[0].text;
    return NextResponse.json(name);
  } catch (err) {
    console.error(err);
    return createErrorResponse("Error generating text", 500);
  }
}
