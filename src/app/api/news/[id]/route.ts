import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const storePath = path.join(process.cwd(), "src", "data", "news.store.json");

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const raw = await readFile(storePath, "utf-8").catch(() => "[]");
    const items = JSON.parse(raw || "[]") as any[];
    const found = items.find((i) => i.id === id || i.slug === id);
    if (!found) return NextResponse.json({ ok: false }, { status: 404 });
    return NextResponse.json({ ok: true, item: found });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const body = await req.json();
    const raw = await readFile(storePath, "utf-8").catch(() => "[]");
    const items = JSON.parse(raw || "[]") as any[];
    const idx = items.findIndex((i) => i.id === id || i.slug === id);
    if (idx === -1) return NextResponse.json({ ok: false }, { status: 404 });
    const now = new Date().toISOString();
    items[idx] = { ...items[idx], ...body, updatedAt: now };
    await writeFile(storePath, JSON.stringify(items, null, 2), "utf-8");
    return NextResponse.json({ ok: true, item: items[idx] });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const raw = await readFile(storePath, "utf-8").catch(() => "[]");
    const items = JSON.parse(raw || "[]") as any[];
    const filtered = items.filter((i: any) => !(i.id === id || i.slug === id));
    await writeFile(storePath, JSON.stringify(filtered, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
