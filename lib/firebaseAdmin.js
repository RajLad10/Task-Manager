import * as admin from "firebase-admin";

let app;

export function initFirebaseAdmin() {
  if (!app) {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!serviceAccountBase64) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64");
    }

    const serviceAccountJson = Buffer.from(serviceAccountBase64, "base64").toString("utf8");
    const serviceAccount = JSON.parse(serviceAccountJson);

    if (admin.apps.length === 0) {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      app = admin.app();
    }
  }
  return app;
}

export function getAuth() {
  return admin.auth(initFirebaseAdmin());
}

export function getFirestore() {
  return admin.firestore(initFirebaseAdmin());
}

// export async function verifySessionCookie(req) {
//   const cookieName = process.env.SESSION_COOKIE_NAME || "app_session";
//   const sessionCookie = req.cookies.get(cookieName)?.value;

//   if (!sessionCookie) throw new Error("No session");

//   const auth = getAuth();
//   return auth.verifySessionCookie(sessionCookie, true);
// }
