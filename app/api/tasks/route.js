export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getFirestore, getAuth } from "@/lib/firebaseAdmin";

async function verifySession(req) {
  const cookieName = process.env.SESSION_COOKIE_NAME || "app_session";
  const sessionCookie = req.cookies.get(cookieName)?.value;

  if (!sessionCookie) throw new Error("Unauthorized");

  const auth = getAuth();
  return auth.verifySessionCookie(sessionCookie, true);
}

export async function GET(req) {
  try {
    const decoded = await verifySession(req);
    const db = getFirestore();

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const snapshot = await db
      .collection("tasks")
      .where("uid", "==", decoded.uid)
      .where("projectId", "==", projectId)
      .orderBy("createdAt", "desc")
      .get();

    const tasks = [];
    snapshot.forEach((doc) => tasks.push({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("GET /tasks error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req) {
  try {
    const decoded = await verifySession(req);
    const body = await req.json();

    const { projectId, title, status, dueDate } = body;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: "projectId and title are required" },
        { status: 400 }
      );
    }

    const db = getFirestore();

    const newTask = {
      projectId,
      title,
      status: status || "Todo",
      dueDate: dueDate || null,
      uid: decoded.uid,
      createdAt: Date.now(),
    };

    const docRef = await db.collection("tasks").add(newTask);

    return NextResponse.json({
      ok: true,
      id: docRef.id,
      task: newTask,
    });
  } catch (err) {
    console.error("POST /tasks error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const decoded = await verifySession(req);
    const body = await req.json();

    const { taskId, status } = body;

    if (!taskId || !status) {
      return NextResponse.json(
        { error: "taskId and status are required" },
        { status: 400 }
      );
    }

    const db = getFirestore();

    const taskRef = db.collection("tasks").doc(taskId);
    const taskSnap = await taskRef.get();

    if (!taskSnap.exists) {
      return NextResponse.json(
        { error: "Task does not exist" },
        { status: 404 }
      );
    }

    if (taskSnap.data().uid !== decoded.uid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await taskRef.update({ status });

    return NextResponse.json({ ok: true, id: taskId, status });
  } catch (err) {
    console.error("PUT /tasks error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req) {
  try {
    const decoded = await verifySession(req);
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const taskRef = db.collection("tasks").doc(taskId);
    const taskSnap = await taskRef.get();

    if (!taskSnap.exists) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    if (taskSnap.data().uid !== decoded.uid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await taskRef.delete();

    return NextResponse.json({ ok: true, id: taskId });
  } catch (err) {
    console.error("DELETE /tasks error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
