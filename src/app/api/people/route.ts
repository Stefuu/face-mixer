import axios from "axios";
import { NextResponse } from "next/server";
import { createErrorResponse } from "../../../../utils";

export async function GET() {
  try {
    const { data } = await axios.get("https://people.ae.studio/api/users", {
      headers: {
        Authorization: `Bearer ${process.env.PEOPLE_API_KEY}`,
      },
    });

    return NextResponse.json(
      data.users.map((e: any) => ({
        email: e.email,
        name: e.name,
        picture: e.picture,
      }))
    );
  } catch (e) {
    console.log(e);
    return createErrorResponse("Error generating images", 500);
  }
}
