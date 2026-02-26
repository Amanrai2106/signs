import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

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
    
    let filename: string;
    let content: Buffer | Blob;

    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
      filename = file.name;
      content = file;
    } else {
      // Fallback for old base64 JSON (to avoid breaking existing client code during transition)
      const body = await req.json();
      const { filename: f, data } = body ?? {};
      if (!f || !data) {
        return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
      }
      filename = f;
      content = Buffer.from(data.split(",")[1] || data, "base64");
    }

    // Vercel Blob requires 'access: public' for most operations.
    const blob = await put(filename, content, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
