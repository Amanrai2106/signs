import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { services as svcData } from "@/data/services";
import { projects as projData } from "@/data/projects";
import { posts as postData } from "@/data/posts";

function isAuthed(req: Request) {
  const header = req.headers.get("cookie") ?? "";
  return header.split(";").some((part) => {
    const [name, value] = part.trim().split("=");
    return name === "admin_auth" && value === "ok";
  });
}

export async function POST(req: Request) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const existing = await prisma.post.count();
    if (existing > 0) {
      return NextResponse.json({ ok: true, message: "Already seeded" });
    }

    // Seed Services
    for (const s of svcData as any[]) {
      const created = await prisma.service.create({
        data: {
          title: s.title,
          description: s.description,
          details: s.details ? JSON.stringify(s.details) : null,
          relatedProjectIds: s.relatedProjectIds ? JSON.stringify(s.relatedProjectIds) : null,
        },
      });
      for (const sc of s.subCategories ?? []) {
        await prisma.serviceSubCategory.create({
          data: { key: sc.id, title: sc.title, image: sc.image, serviceId: created.id },
        });
      }
    }

    // Seed Projects
    for (const p of projData as any[]) {
      await prisma.projectCategory.create({
        data: {
          id: p.id,
          title: p.title,
          description: p.description,
          src: p.src,
          color: p.color ?? null,
          relatedServiceIds: p.relatedServiceIds ? JSON.stringify(p.relatedServiceIds) : null,
        },
      });
      for (const sc of p.subCategories ?? []) {
        await prisma.projectSubCategory.create({
          data: { key: sc.id, title: sc.title, image: sc.image, projectId: p.id },
        });
      }
    }

    // Seed Posts
    for (const p of postData as any[]) {
      await prisma.post.create({
        data: {
          id: p.id,
          title: p.title,
          description: p.description,
          image: p.image,
          categoryId: p.categoryId,
          subCategoryId: p.subCategoryId,
          type: p.type,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Seed failed" }, { status: 500 });
  }
}
