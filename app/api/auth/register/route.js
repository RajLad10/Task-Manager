export const runtime = "nodejs";

import { signUpWithEmailAndPassword } from "@/lib/firebaseClient";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/firebaseAdmin";


export async function POST(req) {
    try {
        console.log("LOGIN ENV:", {
          FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
          AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        });
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response("Missing email or password field", { status: 400 });
        }

        const registerRes = await signUpWithEmailAndPassword(email, password);
        if (registerRes.error) return NextResponse.json({ error: registerRes.error }, { status: 400 });

        const idToken = registerRes.idToken;

        const auth = getAuth();
        const expiresIn = parseInt(process.env.SESSION_EXPIRES_IN_MS || '2592000000');
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

        const res = NextResponse.json({ ok: true, uid: registerRes.localId });
        res.cookies.set({
            name: process.env.SESSION_COOKIE_NAME || 'app_session',
            value: sessionCookie,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: Math.floor(expiresIn / 1000),
            path: '/',
        });

        return res;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
