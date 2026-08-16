// app/lib/api.js
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_HRM_API_URL;

// Axios instance with token
const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

// Named exports for fetching users
export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createUser(data) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}
