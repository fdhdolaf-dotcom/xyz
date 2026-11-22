import Link from "next/link";
import { AtSign, Music2, ShieldCheck, User } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl backdrop-blur">
        <h1 className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-3xl font-extrabold text-transparent">
          O nas
        </h1>
        <p className="mt-2 text-sm text-muted">
          XYZ to katalog projektów i modów. Poniżej znajdziesz informacje o twórcy
          i linki do społeczności.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard icon={<User size={18} />} label="Owner" value="xxrvdx_" />
          <InfoCard icon={<AtSign size={18} />} label="Discord" value="xxrvdx_" />
          <InfoCard
            icon={<Music2 size={18} />}
            label="TikTok"
            value="xxrvdx_"
            href="https://tiktok.com/@xxrvdx_"
          />
          <InfoCard
            icon={<ShieldCheck size={18} />}
            label="Publish Discord"
            value="discord.gg/ThmVn526S"
            href="https://discord.gg/ThmVn526S"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://discord.gg/ThmVn526S"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition hover:bg-accent-hover"
          >
            Dołącz do Discorda
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text transition hover:bg-bg"
          >
            Wróć do katalogu
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg/40 p-4 backdrop-blur transition hover:border-white/30">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-black">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate text-sm font-medium text-text">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
}
