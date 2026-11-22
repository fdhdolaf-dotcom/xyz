import type { Project } from "@/lib/types";

export default function ProjectIcon({
  project,
  size = 48,
}: {
  project: Project;
  size?: number;
}) {
  const letter = project.title.charAt(0).toUpperCase();
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-inner"
      style={{
        width: size,
        height: size,
        backgroundColor: project.coverColor,
        fontSize: size * 0.42,
      }}
      aria-hidden
    >
      {letter}
    </div>
  );
}
