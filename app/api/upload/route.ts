import { NextResponse } from "next/server";
import { simpanGambar } from "@/lib/upload";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("gambar") as File;

  const url = await simpanGambar(file);

  if (!url) {
    return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
  }

  return NextResponse.json({ url });
}