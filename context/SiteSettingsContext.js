"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_SITE_SETTINGS,
  withSiteDefaults,
} from "@/lib/api/siteSettings";

const SiteSettingsContext = createContext(DEFAULT_SITE_SETTINGS);

/**
 * Provides site-wide settings (logo, favicon, contact info, social links) to
 * client components. Seeds with `initial` (fetched on the server in the root
 * layout) so there is no flash of default content, then refreshes on mount.
 */
export const SiteSettingsProvider = ({ children, initial }) => {
  const [settings, setSettings] = useState(
    initial ? withSiteDefaults(initial) : DEFAULT_SITE_SETTINGS,
  );

  useEffect(() => {
    let active = true;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.settings) {
          setSettings(withSiteDefaults(data.settings));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
