import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (token === process.env.MASTER_TOKEN) {
    return NextResponse.json({
      role: "master",
    });
  }
  return NextResponse.json({
    role: "nobody",
  });
}
