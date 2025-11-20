export const runtime = "nodejs";

import { getAuth, getFirestore } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

async function verifySession(req) {

  const cookieName = process.env.SESSION_COOKIE_NAME || 'app_session';
  const sessionCookie = req.cookies.get(cookieName)?.value;
  if (!sessionCookie) throw new Error('Unauthorized');
  const auth = getAuth();
  const decoded = await auth.verifySessionCookie(sessionCookie, true);
  return decoded;
}

export async function GET(req) {
  try {
    const decoded = await verifySession(req);
    const db = getFirestore();

    const snapshot = await db
      .collection("projects")
      .where("uid", "==", decoded.uid)
      .get();

    const projects = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ projects });
  } catch (err) {
    console.error("projects error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req) {
  try {
    const decoded = await verifySession(req);
    const body = await req.json();

    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const newProject = {
      name,
      description: description || "",
      uid: decoded.uid,
      createdAt: Date.now(),
    };

    const docRef = await db.collection("projects").add(newProject);

    return NextResponse.json({
      ok: true,
      id: docRef.id,
      project: newProject,
    });
  } catch (err) {
    console.error("projects error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
