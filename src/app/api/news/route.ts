import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  category: "Education" | "Press" | "Studio" | "Media";
  tags: string[];
  topic?: "none" | "wayfinding" | "placemaking" | "environmental-graphics";
  content: string; // HTML
  status: "draft" | "published";
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
};

const storePath = path.join(process.cwd(), "src", "data", "news.store.json");

function isAuthed(req: Request) {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  const header = req.headers.get("cookie") ?? "";
  return header.split(";").some((part) => {
    const [name, value] = part.trim().split("=");
    return name === "admin_auth" && value === "ok";
  });
}

async function readStore(): Promise<NewsItem[]> {
  try {
    const raw = await readFile(storePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeStore(items: NewsItem[]) {
  await writeFile(storePath, JSON.stringify(items, null, 2), "utf-8");
}

export async function GET() {
  const items = await readStore();
  return NextResponse.json({ ok: true, items });
}

export async function DELETE(req: Request) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "ID is required" }, { status: 400 });

    const items = await readStore();
    const filtered = items.filter((i) => i.id !== id);
    if (items.length === filtered.length) {
      return NextResponse.json({ ok: false, error: "Item not found" }, { status: 404 });
    }

    await writeStore(filtered);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const body = await req.json();
    const { id, title, slug, excerpt, cover, category, tags, topic, content, status, featured } = body ?? {};
    if (!id || !title || !slug || !excerpt || !cover || !category || !content) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    const items = await readStore();
    const now = new Date().toISOString();
    const exists = items.find((i) => i.id === id || i.slug === slug);
    if (exists) {
      exists.title = title;
      exists.slug = slug;
      exists.excerpt = excerpt;
      exists.cover = cover;
      exists.category = category;
      exists.tags = Array.isArray(tags) ? tags : [];
      exists.topic = topic || "none";
      exists.content = content;
      exists.status = status === "draft" || status === "published" ? status : (exists.status ?? "published");
      exists.featured = Boolean(featured);
      exists.updatedAt = now;
      await writeStore(items);
      return NextResponse.json({ ok: true, item: exists });
    }
    const item: NewsItem = {
      id,
      title,
      slug,
      excerpt,
      cover,
      category,
      tags: Array.isArray(tags) ? tags : [],
      topic: topic || "none",
      content,
      status: status === "draft" || status === "published" ? status : "published",
      featured: Boolean(featured),
      createdAt: now,
      updatedAt: now,
    };
    items.unshift(item);
    await writeStore(items);
    return NextResponse.json({ ok: true, item });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
