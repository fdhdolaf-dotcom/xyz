"use client";

import Link from "next/link";
import { Grid3X3, LayoutList, PackagePlus } from "lucide-react";
import { useApp } from "@/components/AppContext";

export default function Navbar() {
  const { viewMode, setViewMode, openAddModal } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-text">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black">
            <PackagePlus size={18} />
          </span>
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            XYZ
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          <NavLink href="/" label="Odkrywaj" />
          <NavLink href="/collections" label="Kolekcje" />
          <NavLink href="/about" label="O nas" />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center rounded-lg border border-border bg-bg p-1">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Widok siatki"
              className={`rounded-md p-1.5 transition ${
                viewMode === "grid"
                  ? "bg-accent text-black"
                  : "text-muted hover:text-text"
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="Widok listy"
              className={`rounded-md p-1.5 transition ${
                viewMode === "list"
                  ? "bg-accent text-black"
                  : "text-muted hover:text-text"
              }`}
            >
              <LayoutList size={16} />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-black transition hover:bg-accent-hover"
          >
            <PackagePlus size={16} />
            <span className="hidden sm:inline">Dodaj projekt</span>
          </button>
        </div>
      </div>

      <nav className="flex md:hidden items-center gap-1 border-t border-border px-4 py-2">
        <NavLink href="/" label="Odkrywaj" />
        <NavLink href="/collections" label="Kolekcje" />
        <NavLink href="/about" label="O nas" />
      </nav>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-1.5 text-sm text-muted transition hover:bg-card hover:text-text"
    >
      {label}
    </Link>
  );
}
