import React from "react";

// Adzuna's API terms require every displayed advert to carry "Jobs by Adzuna",
// at least 116x23px, linking to adzuna.co.uk. Swap the wordmark for the
// official logo from https://www.adzuna.co.uk/press.html if you have it.
function AdzunaAttribution({ className = "" }) {
  return (
    <a
      href="https://www.adzuna.co.uk"
      target="_blank"
      rel="noopener noreferrer"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className={`inline-flex h-[23px] min-w-[116px] items-center gap-1 text-xs text-muted hover:text-ink ${className}`}
    >
      Jobs by <span className="font-bold text-ink">Adzuna</span>
    </a>
  );
}

export default AdzunaAttribution;
