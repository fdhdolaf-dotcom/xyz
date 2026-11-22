"use client";

import { ArrowUpDown, Search } from "lucide-react";

const SORT_OPTIONS = [
  { value: "relevance", label: "Trafność" },
  { value: "downloads", label: "Liczba pobrań" },
  { value: "followers", label: "Liczba polubień" },
  { value: "updated", label: "Ostatnio zaktualizowane" },
];

export default function CatalogToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  count,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  count: number;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Szukaj projektów po nazwie i opisie..."
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-muted outline-none transition focus:border-accent"
        />
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown size={16} className="text-muted" />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="whitespace-nowrap text-sm text-muted">
          {count} projektów
        </span>
      </div>
    </div>
  );
}
