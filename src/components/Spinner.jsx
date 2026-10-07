import React from "react";

function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand/30 border-t-brand"/>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export default Spinner;
