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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = Number(paramId);
    const item = await (prisma as any)["service"].findUnique({
      where: { id },
      include: { subCategories: true },
    });
    if (item) {
      return NextResponse.json({ ok: true, item });
    }
  } catch {
  }

  const { id: paramId } = await params;
  const id = Number(paramId);
  const s = staticServices.find((x) => x.id === id);
  if (!s) return NextResponse.json({ ok: false }, { status: 404 });
  const fallback = {
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
  };
  return NextResponse.json({ ok: true, item: fallback });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const id = Number(paramId);
    const body = await req.json();
    const { title, description, details, relatedProjectIds } = body ?? {};
    const updated = await (prisma as any)["service"].update({
      where: { id },
      data: {
        title,
        description,
        details: details ? JSON.stringify(details) : null,
        relatedProjectIds: relatedProjectIds ? JSON.stringify(relatedProjectIds) : null,
      },
    });
    return NextResponse.json({ ok: true, item: updated });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const id = Number(paramId);
    await (prisma as any)["service"].delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
