import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log("POST request received at /api/contact");
    const body = await req.json();
    console.log("Request body:", body);
    const {
      name,
      email,
      phone,
      countryCode,
      category,
      subCategory,
      subject,
      message,
    } = body ?? {};

    if (!name || !email || !phone || !countryCode || !category || !subCategory || !message) {
      console.log("Missing fields error");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Creating database record...");
    const created = await (prisma as any).contactSubmission.create({
      data: {
        name,
        email,
        phone,
        countryCode,
        category,
        subCategory,
        subject,
        message,
      },
    });
    console.log("Record created:", created.id);

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err: unknown) {
    console.error("Error in contact API:", err);
    return NextResponse.json({ error: `Server Error: ${(err as Error).message}` }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const takeParam = url.searchParams.get("take");
    const take = Math.min(Math.max(Number(takeParam || 5), 1), 100);
    const latest = await (prisma as any).contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take,
    });
    return NextResponse.json({ ok: true, latest, count: latest.length });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    let { id, contacted } = body ?? {};
    
    // Convert ID to number if it's a string
    if (typeof id === "string") id = Number(id);

    if (typeof id !== "number" || isNaN(id) || typeof contacted !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const updated = await (prisma as any).contactSubmission.update({
      where: { id },
      data: { contacted },
    });
    return NextResponse.json({ ok: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
