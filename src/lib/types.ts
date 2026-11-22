export type Category =
  | "Optymalizacja"
  | "Światy"
  | "Narzędzia"
  | "Grafika"
  | "Rozgrywka";

export type Environment = "Klient" | "Serwer";

export type License = "MIT" | "GPL" | "Apache";

export interface ProjectVersion {
  id: string;
  version: string;
  gameVersion: string;
  loaders: string[];
  date: string;
  size: string;
  downloads: number;
  url: string;
  fileName?: string;
  fileData?: string; // base64
  fileSize?: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  author: string;
  shortDescription: string;
  description: string;
  features: string[];
  category: Category;
  tags: string[];
  environments: Environment[];
  minecraftVersions: string[];
  license: License;
  coverColor: string;
  screenshots: string[];
  versions: ProjectVersion[];
  downloads: number;
  followers: number;
  updatedAt: string;
  createdAt: string;
  links: { label: string; url: string }[];
  compatibility: string[];
  scanStatus: "clean" | "scanning" | "infected";
  scannedAt?: string;
  fileName?: string;
  fileData?: string;
  fileSize?: number;
}
