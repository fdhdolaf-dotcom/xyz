"use client";

const CARS = ["🚗", "🏎️", "🚙", "🚕", "🚓", "🛻"];

export default function AnimatedBackground() {
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    car: CARS[i % CARS.length],
    top: 5 + (i * 9) % 85,
    duration: 14 + (i % 5) * 4,
    delay: (i % 6) * 2,
    size: 1.2 + (i % 4) * 0.4,
  }));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
    >
      {items.map((c) => (
        <span
          key={c.id}
          className="absolute animate-car-drift whitespace-nowrap opacity-20"
          style={{
            top: `${c.top}%`,
            fontSize: `${c.size}rem`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          {c.car}
        </span>
      ))}
    </div>
  );
}
