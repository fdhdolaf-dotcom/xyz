"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Project } from "@/lib/types";

interface NewProjectInput {
  title: string;
  author: string;
  category: Project["category"];
  description: string;
  version?: string;
  gameVersion?: string;
  loaders?: string[];
  size?: string;
  url?: string;
  fileName?: string;
  fileSize?: number;
}

interface ProjectsContextValue {
  projects: Project[];
  hydrated: boolean;
  addProject: (input: NewProjectInput) => Promise<void>;
  recordDownload: (projectId: string, versionId?: string) => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data as Project[]);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addProject = useCallback(async (input: NewProjectInput) => {
    const now = new Date().toISOString().slice(0, 10);
    const versionNumber = input.version?.trim() || "1.0.0";
    const gameVersion = input.gameVersion?.trim() || "—";
    const loaders = (input.loaders ?? []).map((l) => l.trim()).filter(Boolean);
    const size =
      input.size?.trim() ||
      (input.fileSize
        ? input.fileSize >= 1024 * 1024
          ? `${(input.fileSize / (1024 * 1024)).toFixed(2)} MB`
          : `${(input.fileSize / 1024).toFixed(1)} KB`
        : "—");
    const url = input.url?.trim() || "";
    const fileName = input.fileName?.trim() || undefined;
    const fileSize = input.fileSize;

    const slugBase = (input.title || "projekt")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "projekt";

    const newProject: Project = {
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      slug: `${slugBase}-${Date.now().toString(36)}`,
      title: input.title.trim(),
      author: input.author.trim() || "Anonim",
      shortDescription: input.description.trim(),
      description: input.description.trim(),
      features: [],
      category: input.category,
      tags: loaders,
      environments: ["Klient"],
      minecraftVersions: gameVersion !== "—" ? [gameVersion] : [],
      license: "MIT",
      coverColor: "#4a4a4a",
      screenshots: [],
      versions: [
        {
          id: `v-${Date.now()}`,
          version: versionNumber,
          gameVersion,
          loaders,
          date: now,
          size,
          downloads: 0,
          url,
          fileName,
          fileSize,
        },
      ],
      downloads: 0,
      followers: 0,
      updatedAt: now,
      createdAt: now,
      links: [],
      compatibility: [],
      scanStatus: "scanning",
      fileName,
      fileSize,
    };

    // optimistic update
    setProjects((prev) => [newProject, ...prev]);

    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
    } catch {
      /* ignore */
    }

    // simulated antivirus scan
    window.setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === newProject.id
            ? { ...p, scanStatus: "clean" as const, scannedAt: new Date().toISOString().slice(0, 10) }
            : p
        )
      );
    }, 2000);
  }, []);

  const recordDownload = useCallback((projectId: string, versionId?: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const versions = p.versions.map((v) =>
          !versionId || v.id === versionId ? { ...v, downloads: v.downloads + 1 } : v
        );
        return { ...p, downloads: p.downloads + 1, versions };
      })
    );
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects, hydrated, addProject, recordDownload }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
}
