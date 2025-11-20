export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const res = NextResponse.json({ ok: true, message: "Logged out" });

        res.cookies.set({
            name: process.env.SESSION_COOKIE_NAME || "app_session",
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0, 
            path: "/",
        });

        return res;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}