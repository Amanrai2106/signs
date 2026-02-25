import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

export async function POST(req: Request) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false }, { status: 401 });
    const body = await req.json();
    const { filename, data } = body ?? {};
    if (!filename || !data) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const filePath = path.join(uploadDir, safeName);
    const buffer = Buffer.from(data.split(",")[1] || data, "base64");
    await writeFile(filePath, buffer);
    return NextResponse.json({ ok: true, url: `/uploads/${safeName}` });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
