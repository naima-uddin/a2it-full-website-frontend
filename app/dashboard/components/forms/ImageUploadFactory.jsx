"use client";
import { useState } from "react";
import { Upload, X, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Reusable image upload component factory
 * Usage: <ImageUploadFactory type="blogs" currentImage={...} onImageUploaded={...} />
 *
 * Supported types:
 * - employees (default)
 * - blogs
 * - portfolio
 * - services
 * - users
 * - general
 */
export default function ImageUploadFactory({
  type = "employees",
  onImageUploaded,
  currentImage = null,
  label = "Upload Image",
  accept = "image/*",
  maxSizeMB = 10,
}) {
  const { token } = useAuth();
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Image must be less than ${maxSizeMB}MB`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPreview(evt.target?.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const endpoint = `/api/upload/${type}`;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        onImageUploaded(data.url);
        setError(null);
      } else {
        setError(data.error || "Upload failed");
        setPreview(currentImage);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-slate-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <Loader className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-xs text-slate-500 text-center">
              Click to upload
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-500">Max {maxSizeMB}MB •</p>
    </div>
  );
}
