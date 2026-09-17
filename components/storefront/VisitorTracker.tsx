"use client";

import { useEffect } from "react";

export function VisitorTracker() {
  useEffect(() => {
    // Only track once per session
    if (!sessionStorage.getItem("has_visited")) {
      fetch("/api/track-visit", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            sessionStorage.setItem("has_visited", "true");
          }
        })
        .catch(console.error);
    }
  }, []);

  return null;
}
