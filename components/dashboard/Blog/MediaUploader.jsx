"use client";

import React, { useState } from "react";
import { authFetch } from "@/lib/api/authFetch";
import BlogMediaLibrary from "./BlogMediaLibrary";

export default function MediaUploader({
  onUploadComplete,
  folder = "a2it/blog/images",
  accept = "image/*,video/*",
  multiple = true,
  label = "Upload Media",
  currentMedia = [],
  showMediaLibrary = true,
}) {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedAssets = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);

      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);

        const r = await authFetch(`${API}/api/blog/admin/upload`, {
          method: "POST",
          body: fd,
        });

        const b = await r.json();
        if (!r.ok) throw new Error(b.error || "Upload failed");

        uploadedAssets.push(b.asset);
      } catch (err) {
        console.error("Upload error:", err);
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    setUploading(false);
    setUploadProgress("");

    if (uploadedAssets.length > 0) {
      // For multiple uploads, add to existing assets; for single uploads, replace
      if (multiple) {
        onUploadComplete([...currentMedia, ...uploadedAssets]);
      } else {
        onUploadComplete(uploadedAssets);
      }
    }

    // Reset input
    e.target.value = "";
  };

  const handleLibrarySelect = (item) => {
    // Convert cloudinary item to our asset format
    const asset = {
      url: item.url || item.secure_url, // Use 'url' from the API response
      publicId: item.public_id,
      width: item.width,
      height: item.height,
      format: item.format,
      resourceType: item.resource_type || "image",
    };

    if (multiple) {
      onUploadComplete([...currentMedia, asset]);
    } else {
      onUploadComplete([asset]);
    }

    setShowLibrary(false);
  };

  const handleRemove = (indexToRemove) => {
    const updated = currentMedia.filter((_, idx) => idx !== indexToRemove);
    onUploadComplete(updated);
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDrop = (targetIndex) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }

    const updated = [...currentMedia];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(targetIndex, 0, moved);
    onUploadComplete(updated);
    setDragIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition">
          {uploading ? uploadProgress : label}
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {showMediaLibrary && (
          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Select from A2IT Media
          </button>
        )}
      </div>

      {currentMedia && currentMedia.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentMedia.map((asset, idx) => (
            <div
              key={`${asset.publicId || asset.url || "media"}-${idx}`}
              className={`relative group border rounded overflow-hidden bg-gray-50 ${dragIndex === idx ? "opacity-60" : ""}`}
              draggable={multiple}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
            >
              {asset.resourceType === "video" ? (
                <video
                  src={asset.url}
                  className="w-full h-32 object-cover"
                  controls
                />
              ) : (
                <img
                  src={asset.url}
                  alt=""
                  className="w-full h-32 object-cover"
                />
              )}
              <button
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
              <div className="p-1 text-xs text-gray-600 truncate">
                {asset.resourceType === "video" ? "🎥" : "🖼️"} {asset.format}
              </div>
              {multiple && (
                <div className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">
                  Drag to reorder
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Media Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Select from Media Library
              </h2>
              <button
                onClick={() => setShowLibrary(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
              <BlogMediaLibrary
                onSelect={handleLibrarySelect}
                showSelection={false}
                defaultFolder={
                  folder.startsWith("a2it/blog") ? folder : "a2it/blog"
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
