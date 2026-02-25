import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pass = body?.password ?? "";
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";
    
    if (pass !== adminPass) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: "admin_auth",
      value: "ok",
      httpOnly: true,
    secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
