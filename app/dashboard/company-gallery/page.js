"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Copy, RefreshCw, Upload, X } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
// New uploads go to a2it/gallery. We also read a2it/general because earlier
// uploads (before the gallery folder existed) landed there.
const GALLERY_FOLDERS = ["a2it/gallery", "a2it/general"];

export default function CompanyGalleryPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState("");

  const canAccess = isAdmin || isModerator;

  // Build object URLs for the selected files so we can preview them, and revoke
  // them on cleanup to avoid leaking memory.
  const previews = React.useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const fetchResources = async () => {
    try {
      setLoading(true);

      const lists = await Promise.all(
        GALLERY_FOLDERS.map(async (folder) => {
          const response = await fetch(
            `${API_BASE}/api/upload/media/list?folder=${encodeURIComponent(folder)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (!response.ok) return [];
          const data = await response.json().catch(() => ({}));
          return data.resources || [];
        }),
      );

      // Merge both folders and drop duplicates by public_id, newest first.
      const byId = new Map();
      lists.flat().forEach((resource) => {
        if (resource?.public_id) byId.set(resource.public_id, resource);
      });
      const merged = Array.from(byId.values()).sort((a, b) => {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return bTime - aTime;
      });

      setResources(merged);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchResources();
  }, [token]);

  const uploadOne = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE}/api/upload/image/gallery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.success) {
      throw new Error(data?.error || `Upload failed for ${file.name}`);
    }
    return data;
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const failed = [];

    try {
      for (let i = 0; i < selectedFiles.length; i += 1) {
        const file = selectedFiles[i];
        setUploadProgress(`Uploading ${i + 1} of ${selectedFiles.length}...`);
        try {
          await uploadOne(file);
        } catch (error) {
          console.error(error);
          failed.push(file.name);
        }
      }

      setSelectedFiles([]);
      await fetchResources();

      if (failed.length > 0) {
        alert(`Failed to upload: ${failed.join(", ")}`);
      }
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  const removeSelected = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (publicId) => {
    if (!window.confirm("Delete this image from the company gallery?")) return;

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
      } else {
        alert("Delete failed");
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
              Company Gallery
            </h1>
            <p className="text-slate-600">
              Upload and manage company gallery images stored under{" "}
              <span className="font-semibold">a2it/gallery</span>
            </p>
          </div>

          <button
            onClick={fetchResources}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold self-start"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </motion.div>

        {/* Upload panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Upload New Images
              </h2>
              <p className="text-sm text-slate-600">
                Add one or more images to the company gallery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <label className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 bg-white cursor-pointer text-slate-700 font-semibold">
                <Plus className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length) {
                      setSelectedFiles((prev) => [...prev, ...files]);
                    }
                    // Reset so selecting the same file again still fires change.
                    e.target.value = "";
                  }}
                />
                Choose Images
              </label>

              {selectedFiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  disabled={uploading}
                  className="inline-flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-500 hover:text-red-600 hover:border-red-200 disabled:opacity-50"
                  aria-label="Clear selected images"
                  title="Clear selected images"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || uploading}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading
                  ? uploadProgress || "Uploading..."
                  : `Upload${selectedFiles.length ? ` (${selectedFiles.length})` : ""}`}
              </button>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="mt-6">
              <p className="font-semibold text-slate-900 mb-3">
                {previews.length} image(s) ready to upload
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
                {previews.map((p, index) => (
                  <div
                    key={p.url}
                    className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={p.url}
                      alt={p.file.name}
                      className="w-full h-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeSelected(index)}
                      disabled={uploading}
                      className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow hover:text-red-600 disabled:opacity-50"
                      aria-label={`Remove ${p.file.name}`}
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Gallery grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Loading images...
          </div>
        ) : resources.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-2xl bg-white">
            No gallery images yet. Upload your first image above.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {resources.map((resource) => (
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
        )}
      </div>
    </DashboardLayout>
  );
}
