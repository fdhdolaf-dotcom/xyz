import fs from "fs/promises";
import path from "path";

const PROJECTS_FILE = path.join(process.cwd(), "data", "projects.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function hasVercelBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function hasR2(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

function isNetlify(): boolean {
  return (
    process.env.NETLIFY === "true" ||
    process.env.NETLIFY_DEV === "true" ||
    !!process.env.NETLIFY_SITE_ID
  );
}

async function tryNetlifyStore(name: string) {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore(name);
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<unknown[]> {
  // Vercel Blob
  if (hasVercelBlob()) {
    try {
      const { list, get } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "projects.json" });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url);
        if (res.ok) return await res.json();
      }
    } catch {
      /* fall through */
    }
  }
  // Netlify Blobs
  if (isNetlify() && !hasR2()) {
    const store = await tryNetlifyStore("projects");
    if (store) {
      try {
        const data = await store.get("all", { type: "json" });
        if (Array.isArray(data)) return data;
      } catch {
        /* fall through */
      }
    }
  }
  // File system fallback
  try {
    const raw = await fs.readFile(PROJECTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveProjects(projects: unknown): Promise<void> {
  // Vercel Blob
  if (hasVercelBlob()) {
    try {
      const { put } = await import("@vercel/blob");
      await put("projects.json", JSON.stringify(projects), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      });
      return;
    } catch {
      /* fall through */
    }
  }
  // Netlify Blobs
  if (isNetlify() && !hasR2()) {
    const store = await tryNetlifyStore("projects");
    if (store) {
      try {
        await store.setJSON("all", projects);
        return;
      } catch {
        /* fall through */
      }
    }
  }
  await fs.mkdir(path.dirname(PROJECTS_FILE), { recursive: true });
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

export async function uploadFile(
  file: File
): Promise<{ url: string; fileName: string; fileSize: number }> {
  // Cloudflare R2
  if (hasR2()) {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const bytes = await file.arrayBuffer();
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: safeName,
        Body: Buffer.from(bytes),
        ContentType: file.type || "application/octet-stream",
      })
    );
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${safeName}`
      : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev/${safeName}`;
    return { url: publicUrl, fileName: file.name, fileSize: file.size };
  }

  // Vercel Blob (server-side, max ~4.5 MB per request)
  if (hasVercelBlob()) {
    try {
      const { put } = await import("@vercel/blob");
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const blob = await put(safeName, file, { access: "public" });
      return { url: blob.url, fileName: file.name, fileSize: file.size };
    } catch {
      /* fall through */
    }
  }

  // Netlify Blobs
  if (isNetlify()) {
    const store = await tryNetlifyStore("uploads");
    if (store) {
      try {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const bytes = await file.arrayBuffer();
        await store.set(safeName, bytes, { metadata: { contentType: file.type || "application/octet-stream" } });
        return { url: `/api/files/${safeName}`, fileName: file.name, fileSize: file.size };
      } catch {
        /* fall through */
      }
    }
  }

  // File system fallback (local dev / VPS)
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = path.join(UPLOADS_DIR, safeName);
  const bytes = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(bytes));
  return { url: `/uploads/${safeName}`, fileName: file.name, fileSize: file.size };
}

export async function getFile(key: string): Promise<{ data: Buffer; contentType: string } | null> {
  // Netlify Blobs
  if (isNetlify() && !hasR2() && !hasVercelBlob()) {
    const store = await tryNetlifyStore("uploads");
    if (store) {
      try {
        const blob = await store.get(key, { type: "blob" });
        if (blob) {
          const buf = Buffer.from(await blob.arrayBuffer());
          const contentType = (blob as Blob).type || "application/octet-stream";
          return { data: buf, contentType };
        }
      } catch {
        /* fall through */
      }
    }
  }

  try {
    const filePath = path.join(UPLOADS_DIR, key);
    const data = await fs.readFile(filePath);
    return { data, contentType: "application/octet-stream" };
  } catch {
    return null;
  }
}
