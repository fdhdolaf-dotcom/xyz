import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || "20971520", 10); // default 20 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large (max ${Math.round(maxSize / (1024 * 1024))} MB)` },
        { status: 413 }
      );
    }
    const result = await uploadFile(file);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
