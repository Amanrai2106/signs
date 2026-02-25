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

export async function GET(_: Request, { params }: { params: any }) {
  try {
    const { id } = await params;
    const item = await (prisma as any)["post"].findUnique({ where: { id } });
    if (!item) return NextResponse.json({ ok: false }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const { 
      title, description, image, categoryId, subCategoryId, type,
      client, location, year, scope, 
      challengeTitle, challengeDescription, challengeItems,
      solutionTitle, solutionDescription, solutionItems,
      galleryImages
    } = body ?? {};
    const updated = await (prisma as any)["post"].update({
      where: { id },
      data: { 
        title, description, image, categoryId, subCategoryId, type,
        client, location, year, scope, 
        challengeTitle, challengeDescription, challengeItems,
        solutionTitle, solutionDescription, solutionItems,
        galleryImages
      },
    });
    return NextResponse.json({ ok: true, item: updated });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    
    // Ensure params are awaited if needed (Next.js 15+ requirement)
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID is required" }, { status: 400 });
    }

    await (prisma as any).post.delete({
      where: { id: id },
    });
    
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE post error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
