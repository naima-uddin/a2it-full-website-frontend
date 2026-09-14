const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fallback site settings. Used whenever the API is unreachable so the site
 * (and its metadata) never breaks. These mirror the backend model defaults.
 */
export const DEFAULT_SITE_SETTINGS = {
  siteName: "A2IT Ltd",
  tagline: "Build Your Dreams",
  description: "Transforming ideas into digital reality.",
  siteUrl: "https://a2itltd.com",
  logo: "/A2ITLogo.png",
  favicon: "/A2ITLogo.png",
  email: "info@a2itltd.com",
  phone: "+880 1846-937397",
  address: "Plot No 470\nRoad No 06\nDOHS Mirpur, Dhaka",
  latitude: 23.836236,
  longitude: 90.358672,
  social: {
    facebook: "https://www.facebook.com/A2ITLtd",
    twitter: "",
    linkedin: "https://www.linkedin.com/in/a2itlimited/",
    instagram: "",
    youtube: "",
  },
};

/**
 * Merge a partial settings object from the API onto the defaults so callers
 * always get a complete, safe-to-render object (empty strings fall back too).
 */
export function withSiteDefaults(settings) {
  const s = settings || {};
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...Object.fromEntries(
      Object.entries(s).filter(([, v]) => v !== undefined && v !== null && v !== ""),
    ),
    social: {
      ...DEFAULT_SITE_SETTINGS.social,
      ...Object.fromEntries(
        Object.entries(s.social || {}).filter(([, v]) => v),
      ),
    },
  };
}

/**
 * Fetch site settings (works on both server and client). Returns a complete
 * settings object, falling back to defaults on any failure.
 */
export async function fetchSiteSettings(options = {}) {
  try {
    const res = await fetch(`${API_URL}/api/site-settings`, {
      next: { revalidate: 60 },
      ...options,
    });
    if (!res.ok) return { ...DEFAULT_SITE_SETTINGS };
    const data = await res.json();
    return withSiteDefaults(data.settings);
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return { ...DEFAULT_SITE_SETTINGS };
  }
}
