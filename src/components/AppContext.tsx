"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface AppContextValue {
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const closeAddModal = useCallback(() => setIsAddModalOpen(false), []);

  return (
    <AppContext.Provider
      value={{ viewMode, setViewMode, isAddModalOpen, openAddModal, closeAddModal }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
