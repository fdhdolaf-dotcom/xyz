"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const VIDEO_ID = "jfKfPfyJRdk"; // Lofi Girl - beats to relax/study to

export default function BackgroundMusic() {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const src = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0`;

  return (
    <>
      {playing && (
        <iframe
          key={muted ? "muted" : "unmuted"}
          className="pointer-events-none fixed bottom-0 right-0 h-0 w-0 opacity-0"
          src={src}
          title="Background music"
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
      <button
        onClick={() => setMuted((m) => !m)}
        className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-text shadow-lg backdrop-blur transition hover:border-accent/60"
        aria-label={muted ? "Włącz dźwięk" : "Wycisz"}
        title={muted ? "Włącz dźwięk" : "Wycisz"}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <button
        onClick={() => setPlaying((p) => !p)}
        className="fixed bottom-4 right-16 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-xs text-text shadow-lg backdrop-blur transition hover:border-accent/60"
        aria-label={playing ? "Zatrzymaj muzykę" : "Odtwórz muzykę"}
        title={playing ? "Zatrzymaj" : "Odtwórz"}
      >
        {playing ? "⏸" : "▶"}
      </button>
    </>
  );
}
