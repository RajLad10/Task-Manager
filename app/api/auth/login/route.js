export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAuth } from "@/lib/firebaseAdmin";
import { signInWithEmailAndPassword } from "@/lib/firebaseClient";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const loginRes = await signInWithEmailAndPassword(email, password);
    const idToken = loginRes.idToken;

    const auth = getAuth();
    const expiresIn = 1000 * 60 * 60 * 24 * 5;

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const res = NextResponse.json({ ok: true, uid: loginRes.localId });

    res.cookies.set({
      name: process.env.SESSION_COOKIE_NAME || "app_session",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
