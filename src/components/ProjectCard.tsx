"use client";

import Link from "next/link";
import { Download, Heart, ShieldCheck } from "lucide-react";
import { formatNumber, relativeDays, downloadBase64File } from "@/lib/utils";
import type { Project } from "@/lib/types";
import ProjectIcon from "@/components/ProjectIcon";
import { useProjects } from "@/components/ProjectsContext";

export default function ProjectCard({
  project,
  viewMode,
}: {
  project: Project;
  viewMode: "grid" | "list";
}) {
  const { recordDownload } = useProjects();
  const latest = project.versions[0];

  if (viewMode === "list") {
    return (
      <article className="group flex items-center gap-2 border border-border bg-card p-2 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-white/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]">
        <ProjectIcon project={project} size={32} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/project/${project.slug}`}
              className="truncate font-semibold text-text hover:text-accent"
            >
              {project.title}
            </Link>
            <span className="text-xs text-muted">by {project.author}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {project.shortDescription}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md bg-bg px-2 py-0.5 text-xs text-muted"
              >
                {t}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 rounded-md bg-bg px-2 py-0.5 text-xs text-muted">
              <ShieldCheck size={11} />
              {project.scanStatus === "clean"
                ? "Antywirus: czysty"
                : project.scanStatus === "scanning"
                ? "Skanowanie..."
                : "Wykryto zagrozenie"}
            </span>
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-1 text-right sm:flex">
          <Stat icon={<Download size={13} />} value={formatNumber(project.downloads)} />
          <Stat icon={<Heart size={13} />} value={formatNumber(project.followers)} />
          <span className="text-xs text-muted">{relativeDays(project.updatedAt)}</span>
        </div>

        <a
          href={latest?.url ?? "#"}
          onClick={(e) => {
            if (latest?.fileData && latest?.fileName) {
              e.preventDefault();
              downloadBase64File(latest.fileData, latest.fileName);
            }
            recordDownload(project.id, latest?.id);
          }}
          className={`shrink-0 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-black transition hover:bg-accent-hover ${
            !latest?.fileData && (!latest?.url || latest.url === "#" || latest.url === "") ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Pobierz
        </a>
      </article>
    );
  }

  return (
    <article className="group flex flex-col border border-border bg-card p-2 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-white/60 hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]">
      <div className="flex items-start gap-3">
        <ProjectIcon project={project} size={32} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/project/${project.slug}`}
            className="block truncate font-semibold text-text hover:text-accent"
          >
            {project.title}
          </Link>
          <p className="text-xs text-muted">by {project.author}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted">
        {project.shortDescription}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-md bg-bg px-2 py-0.5 text-xs text-muted"
          >
            {t}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 rounded-md bg-bg px-2 py-0.5 text-xs text-muted">
          <ShieldCheck size={11} />
          {project.scanStatus === "clean"
            ? "Antywirus: czysty"
            : project.scanStatus === "scanning"
            ? "Skanowanie..."
            : "Wykryto zagrozenie"}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Download size={12} /> {formatNumber(project.downloads)}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} /> {formatNumber(project.followers)}
          </span>
          <span>{relativeDays(project.updatedAt)}</span>
        </div>
        <a
          href={latest?.url ?? "#"}
          onClick={(e) => {
            if (latest?.fileData && latest?.fileName) {
              e.preventDefault();
              downloadBase64File(latest.fileData, latest.fileName);
            }
            recordDownload(project.id, latest?.id);
          }}
          className={`rounded-lg bg-accent px-2.5 py-1.5 text-xs font-semibold text-black transition hover:bg-accent-hover ${
            !latest?.fileData && (!latest?.url || latest.url === "#" || latest.url === "") ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Pobierz
        </a>
      </div>
    </article>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-muted">
      {icon} {value}
    </span>
  );
}
