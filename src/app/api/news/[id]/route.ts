import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await (prisma as any).news.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      }
    });
    if (!item) return NextResponse.json({ ok: false }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
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
    
    const updated = await (prisma as any).news.update({
      where: { id },
      data: body,
    });
    return NextResponse.json({ ok: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    await (prisma as any).news.delete({
      where: { id },
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
