import React from "react";
import { Link } from "react-router-dom";
import { LEGAL } from "../legal/config.js";

const linkClass = "font-medium text-brand underline hover:text-brand-hover";

// Two separate, unticked boxes: age is a fact we ask the user to confirm,
// Terms acceptance is the agreement itself. Neither may be pre-ticked.
function ConsentChecks({ ageOk, setAgeOk, termsOk, setTermsOk }) {
  return (
    <div className="space-y-3 text-left text-sm text-ink-soft">
      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={ageOk}
          onChange={(e) => setAgeOk(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
        />
        <span>I confirm I am {LEGAL.minimumAge} or older.</span>
      </label>
      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={termsOk}
          onChange={(e) => setTermsOk(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
        />
        <span>
          I agree to the <Link to="/terms" target="_blank" className={linkClass}>Terms of Use</Link> and
          have read the <Link to="/privacy" target="_blank" className={linkClass}>Privacy Policy</Link>.
        </span>
      </label>
    </div>
  );
}

export default ConsentChecks;
