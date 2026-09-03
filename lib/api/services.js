const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch active, public-facing services (sorted by order on the backend).
 * Returns [] on any failure so callers can safely fall back to defaults.
 */
export async function fetchPublicServices(options = {}) {
  try {
    const res = await fetch(`${API_URL}/api/services`, {
      // Public site: allow Next.js to cache but revalidate periodically.
      next: { revalidate: 60 },
      ...options,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.services) ? data.services : [];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

/**
 * Find a single active service by its public path, e.g. "/services/web-app".
 */
export async function fetchServiceByPath(path, options = {}) {
  const services = await fetchPublicServices(options);
  return services.find((s) => s.path === path) || null;
}
