"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/api/authFetch";

export default function BlogList() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Check if user is admin
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  const load = async () => {
    setLoading(true);
    try {
      const r = await authFetch(
        `${API}/api/blog/admin/blogs?page=${page}&limit=20`,
      );
      const data = await r.json();
      if (data.success) {
        const filtered = (data.blogs || []).filter(
          (i) => i.status !== "archived",
        );
        setItems(filtered);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const router = useRouter();
  const handleNew = () => router.push("/dashboard/blog?action=create");
  const handleEdit = (post) => router.push(`/dashboard/blog?post=${post._id}`);
  const handleSaved = () => {
    load();
  };
  const handleDelete = async (id, force = true) => {
    // default to permanent removal – backend supports ?force=true like other endpoints
    const msg = force
      ? "Permanently delete this post? This cannot be undone."
      : "Archive this post?";
    if (!confirm(msg)) return;

    const url = `${API}/api/blog/admin/blogs/${id}`;
    const r = await authFetch(url, { method: "DELETE" });
    const b = await r.json();
    console.log("delete response", r.status, b);
    if (!r.ok) return alert(b.error || "Failed");
    load();
  };

  // publishing toggle not needed, remove related UI

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Blog posts</h2>
        <div className="flex gap-2">
          <Link
            href="/dashboard/blog/new"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            New post
          </Link>
          <button onClick={load} className="px-3 py-2 border rounded">
            Refresh
          </button>
        </div>
      </div>

      {/* inline editor removed in favor of dedicated page */}

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    No posts yet
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-gray-500">{p.excerpt}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`px-2 py-1 rounded text-xs ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          Edit
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
