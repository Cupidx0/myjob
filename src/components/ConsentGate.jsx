import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db } from "../utils/firebase.js";
import { useAuth } from "../pages/AuthContext.jsx";
import { hasCurrentConsent, recordConsent } from "../legal/consent.js";
import { LEGAL } from "../legal/config.js";
import ConsentChecks from "./ConsentChecks.jsx";

// Blocks the app for any signed-in user who hasn't accepted the current Terms:
// Google/GitHub sign-ups, accounts made before consent existed, and everyone
// after LEGAL.version is bumped. Listens live so the email sign-up's own
// consent write closes it straight away.
function ConsentGate() {
  const { user } = useAuth();
  const [needsConsent, setNeedsConsent] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [ageOk, setAgeOk] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setNeedsConsent(false);
      return;
    }
    return onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        // Skip local pending writes so the gate doesn't flash during sign-up
        if (snap.metadata.hasPendingWrites) return;
        const data = snap.data();
        setNeedsConsent(!hasCurrentConsent(data));
        setIsUpdate(Boolean(data?.consent));
      },
      (err) => console.error("Error checking consent:", err)
    );
  }, [user]);

  if (!user || !needsConsent) return null;

  const accept = async () => {
    setSaving(true);
    try {
      await recordConsent(user.uid, isUpdate ? "terms-update" : "first-sign-in");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save your answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const decline = async () => {
    await signOut(auth);
    toast.info(`You need to be ${LEGAL.minimumAge} or older and accept the Terms to use Job Swipr.`);
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-4" role="dialog" aria-modal="true" aria-labelledby="consent-title">
      <div className="glass w-full max-w-md p-6">
        <h2 id="consent-title" className="text-lg font-semibold text-ink">
          {isUpdate ? "We've updated our Terms" : "Before you continue"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isUpdate
            ? `Our Terms of Use and Privacy Policy changed on ${LEGAL.effectiveDate}. Please review and accept them to keep using Job Swipr.`
            : `Job Swipr is for people aged ${LEGAL.minimumAge} and over. Please confirm the following to finish setting up your account.`}
        </p>
        <div className="mt-5">
          <ConsentChecks ageOk={ageOk} setAgeOk={setAgeOk} termsOk={termsOk} setTermsOk={setTermsOk}/>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button className="btn-primary" disabled={!ageOk || !termsOk || saving} onClick={accept}>
            {saving ? "Saving..." : "Accept and continue"}
          </button>
          <button className="btn-secondary" onClick={decline}>Decline and sign out</button>
        </div>
      </div>
    </div>
  );
}

export default ConsentGate;
