import { NextResponse } from "next/server";
import { getAuth, getFirestore } from "@/lib/firebaseAdmin";

async function verifySession(req) {
  const sessionCookie = req.cookies.get("app_session")?.value;
  if (!sessionCookie) throw new Error("Unauthorized");
  const auth = getAuth();
  return auth.verifySessionCookie(sessionCookie, true);
}

export async function GET(req) {
  try {
    const decoded = await verifySession(req);
    const uid = decoded.uid;

    const db = getFirestore();

    const projectsSnapshot = await db
      .collection("projects")
      .where("uid", "==", uid)
      .get();

    const tasksSnapshot = await db
      .collection("tasks")
      .where("uid", "==", uid)
      .get();

    return NextResponse.json({
      projectsCount: projectsSnapshot.size,
      tasksCount: tasksSnapshot.size,
    });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
