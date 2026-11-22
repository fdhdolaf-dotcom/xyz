# XYZ — Katalog projektów

Nowoczesny katalog projektów/modów (inspirowany Modrinth) z uploadem plików i pobieraniem.

## Lokalnie
```bash
npm install
npm run dev
```
Otwórz http://localhost:3000

## Build produkcyjny
```bash
npm run build
npm start
```

## Wdrożenie na Netlify (zalecane)
1. Połącz repo z Netlify (lub przeciągnij folder).
2. Netlify automatycznie wykryje Next.js.
3. Build command: `npm run build`, publish dir: `.next`.
4. Pliki i projekty będą przechowywane w **Netlify Blobs** (automatycznie).

## Wdrożenie na VPS / Render / Railway
1. `npm run build && npm start`.
2. Projekty zapisywane w `data/projects.json`, pliki w `public/uploads/`.
3. Upewnij się, że katalogi są trwałe (persistent disk).

## Ograniczenia
- Maksymalny rozmiar pliku: 5 MB (darmowy plan Netlify).
- Na serverless (Vercel) pliki nie są trwałe — użyj Supabase/S3.

## Zmienne środowiskowe
Brak wymaganych. Opcjonalnie:
- `NETLIFY_SITE_ID` — ustawiane automatycznie na Netlify.
