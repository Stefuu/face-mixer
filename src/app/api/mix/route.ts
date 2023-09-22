import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: any) {
  const { person1, person2 } = await req.json();
  const replicate = new Replicate({
    auth: process.env.REPLICATE_IMAGE_MIXER_KEY!,
  });

  try {
    const output = await replicate.run(
      "lambdal/image-mixer:23d37d119ed3149e1135564d1cb5551c16dac1026e9deb972df42810a0f68c2f",
      {
        input: {
          image1: person1.picture,
          image2: person2.picture,
        },
      }
    );

    return NextResponse.json(output);
  } catch (e) {
    console.log(e);
    return new NextResponse(JSON.stringify(e), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
