export async function authFetch(input, init = {}) {
  // Read token using the same key as AuthContext
  let token = null;
  try {
    if (typeof window !== "undefined") {
      token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
    }
  } catch (e) {
    token = null;
  }

  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Do not set Content-Type for FormData bodies
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(input, { ...init, headers });
  return res;
}

export default authFetch;
