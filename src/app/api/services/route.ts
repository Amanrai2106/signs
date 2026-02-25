import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { services as staticServices } from "@/data/services";

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
    const items = await (prisma as any)["service"].findMany({
      orderBy: { id: "asc" },
      include: { subCategories: true },
    });
    
    if (items && items.length > 0) {
      return NextResponse.json({ ok: true, items });
    }
    
    // Fallback if DB is empty
    throw new Error("Empty DB");
  } catch {
    const fallback = staticServices.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      details: s.details ? JSON.stringify(s.details) : null,
      relatedProjectIds: s.relatedProjectIds ? JSON.stringify(s.relatedProjectIds) : null,
      subCategories: (s.subCategories || []).map((sc) => ({
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
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const body = await req.json();
    const { title, description, details, relatedProjectIds } = body ?? {};
    if (!title || !description) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    const created = await (prisma as any)["service"].create({
      data: {
        title,
        description,
        details: details ? JSON.stringify(details) : null,
        relatedProjectIds: relatedProjectIds ? JSON.stringify(relatedProjectIds) : null,
      },
    });
    return NextResponse.json({ ok: true, item: created });
  } catch {
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
