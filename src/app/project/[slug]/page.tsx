"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Download,
  ExternalLink,
  Heart,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useProjects } from "@/components/ProjectsContext";
import { formatNumber, formatDate, relativeDays, downloadBase64File } from "@/lib/utils";
import ProjectIcon from "@/components/ProjectIcon";

type Tab = "description" | "versions" | "gallery";

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { projects, hydrated, recordDownload } = useProjects();
  const project = projects.find((p) => p.slug === slug);
  const [tab, setTab] = useState<Tab>("description");

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <p className="text-muted">Ładowanie...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <Link href="/" className="text-sm text-muted hover:text-text">
          ← Powrót do listy
        </Link>
        <div className="mt-6 rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-lg font-semibold text-text">Nie znaleziono projektu</p>
          <p className="mt-1 text-sm text-muted">
            Projekt o podanym adresie nie istnieje.
          </p>
        </div>
      </div>
    );
  }

  const latest = project.versions[0];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-text"
      >
        ← Powrót do listy
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {/* Header */}
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <ProjectIcon project={project} size={48} />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold text-text sm:text-2xl">
                  {project.title}
                </h1>
                <p className="mt-1 text-sm text-muted">
                  by <span className="text-text">{project.author}</span> ·{" "}
                  {project.category}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-bg px-2 py-1 text-xs text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Download size={14} /> {formatNumber(project.downloads)} pobrań
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={14} /> {formatNumber(project.followers)} obserwujących
                  </span>
                  <span>Ostatnia aktualizacja: {formatDate(project.updatedAt)}</span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                <a
                  href={latest?.url ?? "#"}
                  onClick={(e) => {
                    if (latest?.fileData && latest?.fileName) {
                      e.preventDefault();
                      downloadBase64File(latest.fileData, latest.fileName);
                    }
                    recordDownload(project.id, latest?.id);
                  }}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-black transition hover:bg-accent-hover ${
                    !latest?.fileData && (!latest?.url || latest.url === "#" || latest.url === "") ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <Download size={16} />
                  Pobierz v{latest?.version}
                </a>
                <span className="text-xs text-muted">
                  {latest?.size} · {latest?.gameVersion}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-1 rounded-lg border border-border bg-card p-1">
            {(
              [
                { id: "description", label: "Opis" },
                { id: "versions", label: "Wersje" },
                { id: "gallery", label: "Galeria" },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                  tab === t.id
                    ? "bg-accent text-black"
                    : "text-muted hover:text-text"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border bg-card p-6">
            {tab === "description" && (
              <div className="space-y-4">
                <p className="leading-relaxed text-muted">{project.description}</p>
                {project.features.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-semibold text-text">Funkcje</h3>
                    <ul className="space-y-1.5">
                      {project.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-muted"
                        >
                          <Star size={14} className="mt-0.5 shrink-0 text-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {tab === "versions" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted">
                      <th className="py-2 pr-4 font-medium">Wersja</th>
                      <th className="py-2 pr-4 font-medium">Gra</th>
                      <th className="py-2 pr-4 font-medium">Loadery</th>
                      <th className="py-2 pr-4 font-medium">Data</th>
                      <th className="py-2 pr-4 font-medium">Rozmiar</th>
                      <th className="py-2 pr-4 font-medium">Pobrania</th>
                      <th className="py-2 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.versions.map((v) => (
                      <tr key={v.id} className="border-b border-border/60">
                        <td className="py-3 pr-4 font-medium text-text">
                          v{v.version}
                        </td>
                        <td className="py-3 pr-4 text-muted">{v.gameVersion}</td>
                        <td className="py-3 pr-4 text-muted">
                          {v.loaders.join(", ")}
                        </td>
                        <td className="py-3 pr-4 text-muted">{formatDate(v.date)}</td>
                        <td className="py-3 pr-4 text-muted">{v.size}</td>
                        <td className="py-3 pr-4 text-muted">
                          {formatNumber(v.downloads)}
                        </td>
                        <td className="py-3">
                          <a
                            href={v.url}
                            onClick={(e) => {
                              if (v.fileData && v.fileName) {
                                e.preventDefault();
                                downloadBase64File(v.fileData, v.fileName);
                              }
                              recordDownload(project.id, v.id);
                            }}
                            className={`inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1.5 text-xs font-semibold text-black transition hover:bg-accent-hover ${
                              !v.fileData && (!v.url || v.url === "#" || v.url === "") ? "pointer-events-none opacity-40" : ""
                            }`}
                          >
                            <Download size={12} /> Pobierz
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "gallery" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.screenshots.map((c, i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-lg border border-border"
                    style={{
                      background: `linear-gradient(135deg, ${c}, #000)`,
                    }}
                  >
                    <div className="flex h-full items-center justify-center text-sm text-white/70">
                      Zrzut ekranu {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold text-text">Szczegóły techniczne</h3>
            <dl className="space-y-3 text-sm">
              {project.fileName && (
                <DetailRow label="Plik" value={`${project.fileName} (${project.fileSize ? (project.fileSize >= 1024 * 1024 ? (project.fileSize / (1024 * 1024)).toFixed(2) + " MB" : (project.fileSize / 1024).toFixed(1) + " KB") : project.versions[0]?.size})`} />
              )}
              <DetailRow label="Licencja" value={project.license} />
              <DetailRow
                label="Środowisko"
                value={project.environments.join(", ")}
              />
              <DetailRow
                label="Kompatybilność"
                value={project.compatibility.join(", ")}
              />
              <DetailRow
                label="Wersje Minecraft"
                value={project.minecraftVersions.join(", ")}
              />
              <DetailRow label="Utworzono" value={formatDate(project.createdAt)} />
              <DetailRow label="Aktualizacja" value={relativeDays(project.updatedAt)} />
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold text-text">Linki</h3>
            <ul className="space-y-2">
              {project.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted transition hover:text-accent"
                  >
                    <ExternalLink size={14} /> {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold text-text">Autorzy</h3>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">
                {project.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-text">{project.author}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold text-text">Bezpieczeństwo</h3>
            <p className="flex items-center gap-2 text-sm text-muted">
              <ShieldCheck size={16} className="text-accent" />
              {project.scanStatus === "clean"
                ? "Zeskanowano antywirusowo: czysty"
                : project.scanStatus === "scanning"
                ? "Skanowanie antywirusowe w toku..."
                : "Wykryto potencjalne zagrozenie"}
            </p>
            {project.scannedAt && (
              <p className="mt-1 text-xs text-muted">Data skanu: {project.scannedAt}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-text">{value}</dd>
    </div>
  );
}
