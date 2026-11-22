"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { useApp } from "@/components/AppContext";
import { useProjects } from "@/components/ProjectsContext";
import type { Project } from "@/lib/types";

const CATEGORIES: Project["category"][] = [
  "Optymalizacja",
  "\u015awiaty",
  "Narz\u0119dzia",
  "Grafika",
  "Rozgrywka",
];

export default function AddProjectModal() {
  const { isAddModalOpen, closeAddModal } = useApp();
  const { addProject } = useProjects();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<Project["category"]>("Narz\u0119dzia");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [gameVersion, setGameVersion] = useState("");
  const [loaders, setLoaders] = useState("");
  const [size, setSize] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAddModalOpen) return null;

  const handleFile = (file: File) => {
    setSelectedFile(file);
    if (!size) {
      setSize(
        file.size >= 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    if (!title.trim()) return;

    let uploadedUrl = "";
    let uploadedName = "";
    let uploadedSize: number | undefined;

    if (selectedFile) {
      setUploading(true);
      setUploadProgress(0);
      try {
        const fd = new FormData();
        fd.append("file", selectedFile);
        const data = await new Promise<{ url?: string; fileName?: string; fileSize?: number; error?: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/upload");
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 100));
            }
          };
          xhr.onload = () => {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch {
              resolve({});
            }
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.send(fd);
        });
        if (data.error) {
          setUploadError(data.error);
          setUploading(false);
          return;
        }
        uploadedUrl = data.url || "";
        uploadedName = data.fileName || selectedFile.name;
        uploadedSize = data.fileSize || selectedFile.size;
      } catch {
        setUploadError("Upload failed");
        setUploading(false);
        return;
      }
      setUploading(false);
      setUploadProgress(100);
    }

    await addProject({
      title,
      author,
      category,
      description,
      version,
      gameVersion,
      loaders: loaders.split(",").map((l) => l.trim()).filter(Boolean),
      size,
      url: uploadedUrl,
      fileName: uploadedName || undefined,
      fileSize: uploadedSize,
    });

    setTitle("");
    setAuthor("");
    setCategory("Narz\u0119dzia" as Project["category"]);
    setDescription("");
    setVersion("1.0.0");
    setGameVersion("");
    setLoaders("");
    setSize("");
    setSelectedFile(null);
    closeAddModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeAddModal} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Dodaj projekt</h2>
          <button
            onClick={closeAddModal}
            className="rounded-md p-1 text-muted hover:bg-[#1a1a1a] hover:text-text"
            aria-label="Zamknij"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nazwa projektu" placeholder="np. Moj nowy mod" value={title} onChange={setTitle} required />
          <Field label="Autor" placeholder="Twoja nazwa" value={author} onChange={setAuthor} />
          <div>
            <label className="mb-1 block text-sm text-muted">Kategoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Project["category"])}
              className="w-full rounded-lg border border-border bg-[#1a1a1a] px-3 py-2 text-text outline-none focus:border-accent"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Opis</label>
            <textarea
              rows={3}
              placeholder="Krotki opis projektu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-[#1a1a1a] px-3 py-2 text-text outline-none focus:border-accent"
            />
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-3 text-sm font-semibold text-text">Wersja</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Numer wersji" placeholder="1.0.0" value={version} onChange={setVersion} />
              <Field label="Wersja gry" placeholder="1.21.4" value={gameVersion} onChange={setGameVersion} />
            </div>
            <Field label="Loadery (przecinek)" placeholder="Fabric, Forge" value={loaders} onChange={setLoaders} />
            <div className="grid grid-cols-1 gap-3">
              <Field label="Rozmiar" placeholder="1.2 MB" value={size} onChange={setSize} />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-sm font-semibold text-text">Plik projektu</p>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition ${
                isDragging
                  ? "border-accent bg-accent/10"
                  : "border-border bg-[#1a1a1a]/40 hover:border-accent/60"
              }`}
            >
              <Upload size={24} className="text-muted" />
              {uploading ? (
                <div className="w-full">
                  <p className="text-sm text-muted">Wysylanie pliku... {uploadProgress}%</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-[#1a1a1a]">
                    <div
                      className="h-2 rounded-full bg-accent transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-text">{selectedFile.name}</p>
                  <p className="text-xs text-muted">
                    {selectedFile.size >= 1024 * 1024
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                      : `${(selectedFile.size / 1024).toFixed(1)} KB`}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-1 text-xs text-muted hover:text-accent"
                  >
                    Usun plik
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted">Przeciagnij i upusc plik tutaj</p>
                  <p className="text-xs text-muted">lub kliknij, aby wybrac</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          </div>

          {uploadError && (
            <p className="text-sm text-red-400">{uploadError}</p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeAddModal}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-[#1a1a1a]"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-hover"
            >
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-muted">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-[#1a1a1a] px-3 py-2 text-text outline-none focus:border-accent"
      />
    </div>
  );
}
