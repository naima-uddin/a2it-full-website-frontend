const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch the stored editable content for a section (e.g. "amazon-marketing").
 * Returns {} on any failure so callers fall back to their hardcoded defaults.
 */
export async function fetchSectionContent(key, options = {}) {
  try {
    const res = await fetch(`${API_URL}/api/service-content/${key}`, {
      next: { revalidate: 30 },
      ...options,
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data && typeof json.data === "object" ? json.data : {};
  } catch (error) {
    console.error(`Failed to fetch content "${key}":`, error);
    return {};
  }
}

/**
 * Save (upsert) the content for a section. Requires an auth token.
 */
export async function saveSectionContent(key, data, token) {
  const res = await fetch(`${API_URL}/api/service-content/${key}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to save content");
  }
  return res.json();
}
