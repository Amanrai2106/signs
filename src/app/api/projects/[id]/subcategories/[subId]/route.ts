import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isAuthed(req: Request) {
  const header = req.headers.get("cookie") ?? "";
  return header.split(";").some((part) => {
    const [name, value] = part.trim().split("=");
    return name === "admin_auth" && value === "ok";
  });
}

export async function PUT(req: Request, { params }: { params: { id: string; subId: string } }) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const subId = Number(params.subId);
    const body = await req.json();
    const { key, title, image } = body ?? {};
    const updated = await (prisma as any)["projectSubCategory"].update({
      where: { id: subId },
      data: { key, title, image },
    });
    return NextResponse.json({ ok: true, item: updated });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; subId: string } }) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const subId = Number(params.subId);
    await (prisma as any)["projectSubCategory"].delete({ where: { id: subId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
