"use client";

import { useEffect, useState } from "react";
import { fetchSectionContent } from "@/lib/api/serviceContent";

/**
 * Deep-merge stored content over the hardcoded defaults. Missing keys keep
 * their default, so a page never renders blank even before it's edited.
 * Arrays from the DB replace the default array entirely (so removing a card
 * in the editor actually removes it on the page).
 */
export function mergeContent(defaults, stored) {
  if (Array.isArray(defaults)) {
    return Array.isArray(stored) ? stored : defaults;
  }
  if (defaults && typeof defaults === "object") {
    const out = { ...defaults };
    if (stored && typeof stored === "object") {
      for (const key of Object.keys(stored)) {
        out[key] = mergeContent(defaults[key], stored[key]);
      }
    }
    return out;
  }
  // primitive: stored wins when provided (including empty string)
  return stored === undefined || stored === null ? defaults : stored;
}

/**
 * Client hook: returns content merged with defaults for a section key.
 * Renders defaults immediately, then swaps in stored content once loaded.
 */
export function useSectionContent(key, defaults) {
  const [content, setContent] = useState(defaults);

  useEffect(() => {
    let active = true;
    fetchSectionContent(key).then((stored) => {
      if (active) setContent(mergeContent(defaults, stored));
    });
    return () => {
      active = false;
    };
    // defaults is a module-level constant per section, safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return content;
}
