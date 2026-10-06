"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

const compactQuery = "(max-width: 899px)";
function subscribe(callback: () => void) {
  const query = window.matchMedia(compactQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** Keep the complete introduction available, without requiring it on phones. */
export function LandingDetails({ children }: { children: ReactNode }) {
  const compact = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(compactQuery).matches,
    () => false,
  );
  const [expanded, setExpanded] = useState(false);

  return (
    <details
      className="landing-details"
      open={!compact || expanded}
      onToggle={(event) => {
        if (compact) setExpanded(event.currentTarget.open);
      }}
    >
      <summary>
        <span>Discover more about MEMORA</span>
        <ChevronDown size={20} aria-hidden="true" />
      </summary>
      <div>{children}</div>
    </details>
  );
}
