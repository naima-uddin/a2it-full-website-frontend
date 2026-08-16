"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const BlogForm = ({ blog, onSuccess, onCancel }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    image: blog?.image || "",
    category: blog?.category || "All",
    tags: blog?.tags?.join(",") || "",
    published: blog?.published || false,
  });

  const categories = [
    "All",
    "Web & Mobile App Designing & Development",
    "eCommerce Development Solutions",
    "ERP System Development",
    "SEO / SEM / PPC / Social Media Marketing",
    "Server and Hosting Services",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const uploadImageFile = async (file) => {
    if (!file) return;
    setFileError("");
    setFileUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/blogs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        },
      );

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || d.message || "Upload failed");
      }

      const data = await res.json();
      if (data && data.url) {
        setFormData((p) => ({ ...p, image: data.url }));
      }
    } catch (err) {
      console.error("Upload error", err);
      setFileError(String(err.message || err));
    } finally {
      setFileUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) await uploadImageFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = blog
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blog._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`;

      const method = blog ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {blog ? "Edit Blog" : "Create New Blog"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 text-sm font-medium mb-2">
            Image
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
            <div className="flex-1">
              {fileUploading ? (
                <div className="text-slate-500 text-sm">Uploading image...</div>
              ) : (
                formData.image && (
                  <img
                    src={formData.image}
                    alt="preview"
                    className="max-h-24 rounded-md"
                  />
                )
              )}
              {fileError && (
                <div className="text-red-500 text-sm mt-1">{fileError}</div>
              )}
              <div className="mt-2">
                <label className="block text-slate-700 text-sm font-medium mb-1">
                  Or Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 text-sm font-medium mb-2">
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows="2"
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 text-sm font-medium mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="8"
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-slate-700 text-sm font-medium mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="web, development, tutorial"
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4 accent-[#00f0ff]"
          />
          <label className="text-slate-700 text-sm">Publish immediately</label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:shadow-lg hover:shadow-[#00f0ff]/20 text-[#0a0a12] font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : blog ? "Update Blog" : "Create Blog"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BlogForm;
