import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/components/AppContext";
import { ProjectsProvider } from "@/components/ProjectsContext";
import Navbar from "@/components/Navbar";
import AddProjectModal from "@/components/AddProjectModal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "XYZ — Katalog projektów",
  description: "Przeglądaj, filtruj i pobieraj projekty oraz paczki zasobów.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        <AppProvider>
          <ProjectsProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <AddProjectModal />
          </ProjectsProvider>
        </AppProvider>
      </body>
    </html>
  );
}
