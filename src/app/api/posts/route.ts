import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { posts as staticPosts } from "@/data/posts";

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
    const dbItems = await (prisma as any)["post"].findMany({ orderBy: { createdAt: "desc" } });
    
    // Merge database items with static items, database items take precedence by ID
    const mergedItems = [...dbItems];
    const dbIds = new Set(dbItems.map((item: any) => item.id));
    
    staticPosts.forEach((staticItem: any) => {
      if (!dbIds.has(staticItem.id)) {
        mergedItems.push(staticItem);
      }
    });

    return NextResponse.json({ ok: true, items: mergedItems });
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json({ ok: true, items: staticPosts });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const body = await req.json();
    const { 
      id, title, description, image, categoryId, subCategoryId, type,
      client, location, year, scope, 
      challengeTitle, challengeDescription, challengeItems,
      solutionTitle, solutionDescription, solutionItems,
      galleryImages
    } = body ?? {};
    
    if (!id || !title || !description || !image || !categoryId || !subCategoryId || !type) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // Check if ID already exists to give a better error
    const existing = await (prisma as any).post.findUnique({ where: { id } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Post ID already exists. Please use a unique ID." }, { status: 400 });
    }

    const created = await (prisma as any).post.create({
      data: { 
        id, title, description, image, categoryId, subCategoryId, type,
        client, location, year, scope, 
        challengeTitle, challengeDescription, challengeItems,
        solutionTitle, solutionDescription, solutionItems,
        galleryImages
      },
    });
    return NextResponse.json({ ok: true, item: created });
  } catch (error: any) {
    console.error("POST post error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
