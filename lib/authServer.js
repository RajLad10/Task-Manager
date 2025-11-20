import admin from "./firebaseAdmin";

export async function verifyIdToken(idToken) {
  if (!idToken) return null;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded; // contains uid, email, etc.
  } catch (err) {
    return null;
  }
}
