import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase web config is not secret — it identifies the project, it doesn't authorise anything —
// but it still belongs in .env rather than hardcoded, so each environment can point somewhere else.
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

/**
 * Google sign-in is optional; email and password are not.
 *
 * getAuth() throws auth/invalid-api-key when the key is missing, and because this module is
 * imported at the top of the login page that error took down the entire app — a blank screen with
 * no way to sign in at all. A missing key now only costs you the Google button.
 */
export const isGoogleSignInAvailable = Boolean(firebaseConfig.apiKey);

let auth = null;
let provider = null;

if (isGoogleSignInAvailable) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
} else {
    console.warn(
        "Google sign-in is off: REACT_APP_FIREBASE_API_KEY is not set. " +
        "Add it to .env and restart the dev server — Create React App reads .env only at startup."
    );
}

export { auth, provider };
