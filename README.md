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
- Maksymalny rozmiar pliku: 20 MB (konfigurowalny przez MAX_FILE_SIZE).
- Na serverless (Vercel) pliki nie są trwałe — użyj Supabase/S3.

## Zmienne środowiskowe
Brak wymaganych dla trybu lokalnego. Opcjonalnie:
- `NETLIFY_SITE_ID` — ustawiane automatycznie na Netlify.
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob (trwałe pliki na Vercel).
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` — Cloudflare R2 (pliki do 5 TB).
- `MAX_FILE_SIZE` — limit rozmiaru pliku w bajtach (domyślnie 20 MB).

## Wdrożenie na Vercel (z trwałymi plikami)
1. Vercel → Project → Storage → Create Blob Store.
2. Skopiuj `BLOB_READ_WRITE_TOKEN` do Environment Variables.
3. Redeploy.
4. Pliki i projekty będą trwałe (Vercel Blob).
