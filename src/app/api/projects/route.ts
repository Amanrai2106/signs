import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projects as staticProjects } from "@/data/projects";

export const dynamic = "force-dynamic";

function isAuthed(req: Request) {
  const header = req.headers.get("cookie") ?? "";
  return header.split(";").some((part) => {
    const [name, value] = part.trim().split("=");
    return name === "admin_auth" && value === "ok";
  });
}

export async function GET() {
  try {
    const items = await (prisma as any)["projectCategory"].findMany({
      orderBy: { id: "asc" },
      include: { subCategories: true },
    });
    
    if (items && items.length > 0) {
      return NextResponse.json({ ok: true, items });
    }
    
    // Fallback if DB is empty
    throw new Error("Empty DB");
  } catch {
    const fallback = staticProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      src: p.src,
      color: p.color ?? null,
      relatedServiceIds: p.relatedServiceIds ? JSON.stringify(p.relatedServiceIds) : null,
      subCategories: (p.subCategories || []).map((sc) => ({
        id: sc.id,
        title: sc.title,
        image: sc.image,
      })),
    }));
    return NextResponse.json({ ok: true, items: fallback });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const body = await req.json();
    const { id, title, description, src, color, relatedServiceIds } = body ?? {};
    if (!id || !title || !description || !src) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    const created = await (prisma as any)["projectCategory"].create({
      data: {
        id,
        title,
        description,
        src,
        color,
        relatedServiceIds: relatedServiceIds ? JSON.stringify(relatedServiceIds) : null,
      },
    });
    return NextResponse.json({ ok: true, item: created });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
