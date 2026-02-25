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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await (prisma as any)["projectCategory"].findUnique({
      where: { id },
      include: { subCategories: true },
    });
    if (item) {
      return NextResponse.json({ ok: true, item });
    }
  } catch {
  }

  const { id } = await params;
  const p = staticProjects.find((x) => x.id === id);
  if (!p) return NextResponse.json({ ok: false }, { status: 404 });
  const fallback = {
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
  };
  return NextResponse.json({ ok: true, item: fallback });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const body = await req.json();
    const { title, description, src, color, relatedServiceIds } = body ?? {};
    const updated = await (prisma as any)["projectCategory"].update({
      where: { id },
      data: {
        title,
        description,
        src,
        color,
        relatedServiceIds: relatedServiceIds ? JSON.stringify(relatedServiceIds) : null,
      },
    });
    return NextResponse.json({ ok: true, item: updated });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    await (prisma as any)["projectCategory"].delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
