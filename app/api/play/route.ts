import CuraJam from "@/app/lib/music";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) throw new Error("No ID found.");

    const stream = await CuraJam.stream(id);
    return new NextResponse(stream);
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
