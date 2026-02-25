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

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const body = await req.json();
    const { key, title, image } = body ?? {};
    if (!key || !title || !image) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    const created = await (prisma as any)["projectSubCategory"].create({
      data: { key, title, image, projectId: params.id },
    });
    return NextResponse.json({ ok: true, item: created });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
