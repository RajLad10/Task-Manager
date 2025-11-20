import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword as firebaseSignIn } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
};

const app = initializeApp(firebaseConfig);
export const authClient = getAuth(app);

export async function signInWithEmailAndPassword(email, password) {
  const userCred = await firebaseSignIn(authClient, email, password);

  const user = userCred.user;
  const idToken = await user.getIdToken(true);

  return {
    idToken,
    localId: user.uid,
    email: user.email,
  };
}

export async function signUpWithEmailAndPassword(email, password) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    return res.json();
}
