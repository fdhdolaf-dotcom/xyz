import { NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/storage";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  try {
    const project = await req.json();
    const projects = await getProjects();
    projects.unshift(project);
    await saveProjects(projects);
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}
