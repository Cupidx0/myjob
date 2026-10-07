import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase.js";
import { LEGAL } from "./config.js";

// True when a users/{uid} doc holds an acceptance of the current Terms version.
export const hasCurrentConsent = (userData) =>
  userData?.consent?.version === LEGAL.version && userData?.consent?.ageConfirmed === true;

// Keep a record of what was accepted and when, so we can show it later if asked.
export const recordConsent = (uid, method) =>
  setDoc(
    doc(db, "users", uid),
    {
      consent: {
        version: LEGAL.version,
        ageConfirmed: true,
        minimumAge: LEGAL.minimumAge,
        acceptedAt: serverTimestamp(),
        method,
      },
    },
    { merge: true }
  );
