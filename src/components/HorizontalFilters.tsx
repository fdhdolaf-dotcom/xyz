"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["Optymalizacja", "Światy", "Narzędzia", "Grafika", "Rozgrywka"];
const ENVIRONMENTS = ["Klient", "Serwer"];
const LICENSES = ["MIT", "GPL", "Apache"];

export default function HorizontalFilters({
  selectedCategories,
  toggleCategory,
  selectedEnvironments,
  toggleEnvironment,
  selectedVersions,
  toggleVersion,
  selectedLicenses,
  toggleLicense,
  availableVersions,
  onClear,
}: {
  selectedCategories: string[];
  toggleCategory: (v: string) => void;
  selectedEnvironments: string[];
  toggleEnvironment: (v: string) => void;
  selectedVersions: string[];
  toggleVersion: (v: string) => void;
  selectedLicenses: string[];
  toggleLicense: (v: string) => void;
  availableVersions: string[];
  onClear: () => void;
}) {
  const [open, setOpen] = useState({
    categories: true,
    environments: true,
    versions: true,
    licenses: true,
  });

  const hasFilters =
    selectedCategories.length ||
    selectedEnvironments.length ||
    selectedVersions.length ||
    selectedLicenses.length;

  return (
    <div className="rounded-xl border border-border bg-card p-2 backdrop-blur">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-text">Filtry</h3>
        <button
          onClick={onClear}
          disabled={!hasFilters}
          className="text-xs text-muted transition hover:text-accent disabled:opacity-40"
        >
          Wyczyść filtry
        </button>
      </div>
      <div className="flex flex-wrap gap-6">
        <FilterGroup title="Kategoria" open={open.categories} onToggle={() => setOpen((s) => ({ ...s, categories: !s.categories }))}>
          {CATEGORIES.map((c) => (
            <Checkbox key={c} label={c} checked={selectedCategories.includes(c)} onChange={() => toggleCategory(c)} />
          ))}
        </FilterGroup>
        <FilterGroup title="Środowisko" open={open.environments} onToggle={() => setOpen((s) => ({ ...s, environments: !s.environments }))}>
          {ENVIRONMENTS.map((e) => (
            <Checkbox key={e} label={e} checked={selectedEnvironments.includes(e)} onChange={() => toggleEnvironment(e)} />
          ))}
        </FilterGroup>
        {availableVersions.length > 0 && (
          <FilterGroup title="Wersja" open={open.versions} onToggle={() => setOpen((s) => ({ ...s, versions: !s.versions }))}>
            {availableVersions.map((v) => (
              <Checkbox key={v} label={v} checked={selectedVersions.includes(v)} onChange={() => toggleVersion(v)} />
            ))}
          </FilterGroup>
        )}
        <FilterGroup title="Licencja" open={open.licenses} onToggle={() => setOpen((s) => ({ ...s, licenses: !s.licenses }))}>
          {LICENSES.map((l) => (
            <Checkbox key={l} label={l} checked={selectedLicenses.includes(l)} onChange={() => toggleLicense(l)} />
          ))}
        </FilterGroup>
      </div>
    </div>
  );
}

function FilterGroup({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="min-w-[140px]">
      <button onClick={onToggle} className="mb-2 flex w-full items-center justify-between text-sm font-medium text-text">
        {title}
        <ChevronDown size={14} className={`text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="flex flex-col gap-1">{children}</div>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted transition hover:text-text">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-3.5 w-3.5 rounded border-border bg-bg accent-white" />
      {label}
    </label>
  );
}
