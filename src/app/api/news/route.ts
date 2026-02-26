import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

export async function GET() {
  try {
    const items = await (prisma as any).news.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, items });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "ID is required" }, { status: 400 });

    await (prisma as any).news.delete({
      where: { id },
    });
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

    const data = {
      title,
      slug,
      excerpt,
      cover,
      category,
      tags: Array.isArray(tags) ? JSON.stringify(tags) : "[]",
      topic: topic || "none",
      content,
      status: status || "published",
      featured: Boolean(featured),
    };

    const updated = await (prisma as any).news.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (error: any) {
    console.error("POST news error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
