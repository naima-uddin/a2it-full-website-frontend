"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Copy, RefreshCw, Search, Upload, X } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function MediaPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");

  const canAccess = isAdmin || isModerator;

  const filteredResources = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return resources.filter((resource) => {
      const parts = String(resource.public_id || "").split("/");
      const folder = parts.length >= 2 ? parts[1] : "general";
      const publicId = String(resource.public_id || "").toLowerCase();
      const secureUrl = String(resource.secure_url || "").toLowerCase();
      const matchesSearch =
        publicId.includes(query) || secureUrl.includes(query);
      const matchesFolder =
        selectedFolder === "all" || folder === selectedFolder;
      return matchesSearch && matchesFolder;
    });
  }, [resources, searchQuery, selectedFolder]);

  const groupedResources = useMemo(
    () =>
      filteredResources.reduce((grouped, resource) => {
        const parts = String(resource.public_id || "").split("/");
        const folder = parts.length >= 2 ? parts[1] : "general";
        if (!grouped[folder]) grouped[folder] = [];
        grouped[folder].push(resource);
        return grouped;
      }, {}),
    [filteredResources],
  );

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/upload/media/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.error("Error fetching media resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchResources();
  }, [token]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);
      const uploadTargetFolder =
        selectedFolder === "all" ? "portfolio" : selectedFolder;

      const response = await fetch(
        `${API_BASE}/api/upload/image/${uploadTargetFolder}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      if (response.ok && data?.success) {
        setSelectedFile(null);
        setPreviewUrl("");
        await fetchResources();
      } else {
        alert(data?.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId) => {
    if (!window.confirm("Delete this image from Cloudinary?")) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/upload/portfolio?publicId=${encodeURIComponent(publicId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setResources((prev) =>
          prev.filter((resource) => resource.public_id !== publicId),
        );
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed");
    }
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this URL", url);
    }
  };

  if (!canAccess) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">
            Access Denied. Admin or Moderator only.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Media(Cloudinary Images)
            </h1>
            <p className="text-slate-600">
              Manage Cloudinary images used across this project, grouped by
              folder under <span className="font-semibold">a2it/</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search public ID or URL..."
                className="w-full sm:w-80 pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white"
              />
            </div>
            <button
              onClick={fetchResources}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Upload New Image
              </h2>
              <p className="text-sm text-slate-600">
                Upload to the Cloudinary portfolio folder.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold"
              >
                <option value="all">All Folders</option>
                <option value="portfolio">Portfolio</option>
                <option value="employees">Employees</option>
                <option value="services">Services</option>
                <option value="blogs">Blogs</option>
                <option value="users">Users</option>
                <option value="general">General</option>
              </select>

              <label className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 bg-white cursor-pointer text-slate-700 font-semibold">
                <Plus className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                    setPreviewUrl(file ? URL.createObjectURL(file) : "");
                  }}
                />
                Choose Image
              </label>

              {selectedFile && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }}
                  className="inline-flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-500 hover:text-red-600 hover:border-red-200"
                  aria-label="Cancel selected image"
                  title="Cancel selected image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          {previewUrl && (
            <div className="mt-6 grid gap-4 sm:grid-cols-[180px_1fr] items-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl border border-slate-200"
              />
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-900 mb-1">
                  Preview ready
                </p>
                <p>You can upload this image to Cloudinary now.</p>
              </div>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Loading images...
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white">
            No media found.
          </div>
        ) : searchQuery.trim() ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Search Results
                </h3>
                <p className="text-sm text-slate-600">
                  Showing {filteredResources.length} matching image(s)
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wide">
                Filtered view
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredResources.map((resource) => (
                <motion.div
                  key={resource.public_id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl"
                >
                  <div className="aspect-[16/10] bg-slate-100">
                    <img
                      src={resource.secure_url}
                      alt={resource.public_id}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Public ID
                      </p>
                      <p className="text-sm font-mono text-slate-800 break-all">
                        {resource.public_id}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(resource.secure_url)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold"
                      >
                        <Copy className="w-4 h-4" />
                        Copy URL
                      </button>
                      <a
                        href={resource.secure_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(resource.public_id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedResources)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([folder, folderResources]) => (
                <section key={folder} className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 capitalize">
                        {folder}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {folderResources.length} image(s)
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wide">
                      a2it/{folder}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-5">
                    {folderResources.map((resource) => (
                      <motion.div
                        key={resource.public_id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                      >
                        <div className="aspect-[16/10] bg-slate-100">
                          <img
                            src={resource.secure_url}
                            alt={resource.public_id}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                              Public ID
                            </p>
                            <p className="text-sm font-mono text-slate-800 break-all">
                              {resource.public_id}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(resource.secure_url)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold"
                            >
                              <Copy className="w-4 h-4" />
                              Copy URL
                            </button>
                            <a
                              href={resource.secure_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
                            >
                              Open
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDelete(resource.public_id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
