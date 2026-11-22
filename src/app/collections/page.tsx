import Link from "next/link";

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-text">Kolekcje</h1>
      <p className="mt-2 text-muted">
        Kolekcje projektów będą dostępne wkrótce.
      </p>
      <Link href="/" className="mt-4 inline-block text-accent hover:underline">
        ← Wróć do katalogu
      </Link>
    </div>
  );
}
