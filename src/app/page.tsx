"use client";

import { useMemo, useState } from "react";
import { useProjects } from "@/components/ProjectsContext";
import HorizontalFilters from "@/components/HorizontalFilters";
import CatalogToolbar from "@/components/CatalogToolbar";
import ProjectCard from "@/components/ProjectCard";
import { useApp } from "@/components/AppContext";

function toggleIn(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function Home() {
  const { viewMode } = useApp();
  const { projects } = useProjects();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevance");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);

  const availableVersions = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.minecraftVersions.forEach((v) => set.add(v)));
    return [...set].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (
        selectedEnvironments.length &&
        !p.environments.some((e) => selectedEnvironments.includes(e))
      )
        return false;
      if (
        selectedVersions.length &&
        !p.minecraftVersions.some((v) => selectedVersions.includes(v))
      )
        return false;
      if (selectedLicenses.length && !selectedLicenses.includes(p.license)) return false;
      if (q) {
        const hay = `${p.title} ${p.shortDescription} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "downloads") return b.downloads - a.downloads;
      if (sort === "followers") return b.followers - a.followers;
      if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
      if (q) {
        const aTitle = a.title.toLowerCase().includes(q);
        const bTitle = b.title.toLowerCase().includes(q);
        if (aTitle !== bTitle) return aTitle ? -1 : 1;
      }
      return b.downloads - a.downloads;
    });

    return list;
  }, [query, sort, selectedCategories, selectedEnvironments, selectedVersions, selectedLicenses, projects]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedEnvironments([]);
    setSelectedVersions([]);
    setSelectedLicenses([]);
  };

  return (
    <div className="mx-auto max-w-[900px] px-2 pt-3 sm:px-3">
      <div className="mb-3 rounded-2xl border border-border bg-card p-4 shadow-2xl backdrop-blur">
        <h1 className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
          XYZ
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-muted">
          Nowoczesny katalog projektow i modow. Przegladaj, filtruj i dodawaj wlasne projekty.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted">
          <span className="rounded-full border border-border bg-bg/60 px-3 py-1">
            {projects.length} projektow
          </span>
          <span className="rounded-full border border-border bg-bg/60 px-3 py-1">
            {availableVersions.length} wersji gry
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <HorizontalFilters
          selectedCategories={selectedCategories}
          toggleCategory={(v) => setSelectedCategories((s) => toggleIn(s, v))}
          selectedEnvironments={selectedEnvironments}
          toggleEnvironment={(v) => setSelectedEnvironments((s) => toggleIn(s, v))}
          selectedVersions={selectedVersions}
          toggleVersion={(v) => setSelectedVersions((s) => toggleIn(s, v))}
          selectedLicenses={selectedLicenses}
          toggleLicense={(v) => setSelectedLicenses((s) => toggleIn(s, v))}
          availableVersions={availableVersions}
          onClear={clearFilters}
        />

        <main className="min-w-0">
          <CatalogToolbar
            query={query}
            onQueryChange={setQuery}
            sort={sort}
            onSortChange={setSort}
            count={filtered.length}
          />

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <p className="text-lg font-semibold text-text">
                {projects.length === 0 ? "Brak projektow" : "Brak wynikow"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {projects.length === 0
                  ? "Dodaj pierwszy projekt przyciskiem Dodaj projekt."
                  : "Sprobuj zmienic filtry lub wyszukiwanie."}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                  : "flex flex-col gap-1.5"
              }
            >
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} viewMode={viewMode} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
