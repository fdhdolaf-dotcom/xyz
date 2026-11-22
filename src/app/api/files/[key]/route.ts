import { NextResponse } from "next/server";
import { getFile } from "@/lib/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const file = await getFile(key);
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${key}"`,
    },
  });
}
