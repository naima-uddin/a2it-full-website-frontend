"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  ServiceIcon,
  SERVICE_ICON_NAMES,
  DEFAULT_SERVICE_ICON,
} from "@/lib/serviceIcons";

const emptyForm = {
  title: "",
  description: "",
  icon: DEFAULT_SERVICE_ICON,
  features: "",
  category: "development",
  path: "",
  color: "bg-[#0066ff]",
  image: "",
  order: 0,
  isActive: true,
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const formatCategoryLabel = (value) =>
  String(value || "")
    .trim()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Reusable create/edit form for a service.
 * Pass `service` to edit an existing one; omit it to create.
 * Navigates back to the services list on save or cancel.
 */
export default function ServiceForm({ service = null }) {
  const router = useRouter();
  const { token, isAdmin } = useAuth();
  const isEditing = Boolean(service);

  const [formData, setFormData] = useState(() =>
    service
      ? {
          title: service.title || "",
          description: service.description || "",
          icon: service.icon || DEFAULT_SERVICE_ICON,
          features: (service.features || []).join("\n"),
          category: service.category || "development",
          path: service.path || "",
          color: service.color || "bg-[#0066ff]",
          image: service.image || "",
          order: service.order ?? 0,
          isActive: service.isActive ?? true,
        }
      : emptyForm,
  );
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        if (!isEditing && !formData.category && data.categories?.length) {
          setFormData((prev) => ({ ...prev, category: data.categories[0].name }));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const saveCategory = async () => {
    const val = (newCategory || "").trim();
    if (!val) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: val,
            displayName: formatCategoryLabel(val),
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        await fetchCategories();
        setFormData((prev) => ({ ...prev, category: data.category.name }));
        setNewCategory("");
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${encodeURIComponent(
          categoryName,
        )}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const remaining = categories.filter((c) => c.name !== categoryName);
        setCategories(remaining);
        setFormData((prev) => ({
          ...prev,
          category:
            prev.category === categoryName
              ? remaining[0]?.name || ""
              : prev.category,
        }));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const body = new FormData();
      body.append("image", file);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/services`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body,
        },
      );
      const data = await response.json();
      if (response.ok) {
        const url = data.url || data.imageUrl || data.secure_url || data.image;
        if (url) setFormData((prev) => ({ ...prev, image: url }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/services/${service._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/services`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.split("\n").filter((f) => f.trim()),
        }),
      });

      if (response.ok) {
        router.push("/dashboard/services");
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/dashboard/services"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0066ff] mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">
          {isEditing ? "Edit Service" : "Create New Service"}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <input
              type="text"
              placeholder="Service Title"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  title,
                  path:
                    !isEditing &&
                    (!prev.path || prev.path === `/services/${slugify(prev.title)}`)
                      ? `/services/${slugify(title)}`
                      : prev.path,
                }));
              }}
              required
              className={inputClass}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Service Path (e.g., /services/web-development)"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="3"
              className={inputClass}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              disabled={categoriesLoading}
              className={`${inputClass} disabled:opacity-60`}
            >
              {categories.map((c) => (
                <option value={c.name} key={c.name}>
                  {c.displayName}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">
              Choose one category saved in the database.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Add / Remove Categories
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
              />
              <button
                type="button"
                onClick={saveCategory}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold shadow-sm"
              >
                Save
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category.name}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <span>{category.displayName}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.name)}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                      aria-label={`Delete ${category.displayName}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <textarea
              placeholder="Features (one per line)"
              value={formData.features}
              onChange={(e) =>
                setFormData({ ...formData, features: e.target.value })
              }
              rows="4"
              className={`${inputClass} font-mono text-sm`}
            />
          </div>

          {/* ICON PICKER */}
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Icon{" "}
              <span className="font-normal text-slate-400">
                (shown in navbar, homepage &amp; service page)
              </span>
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {SERVICE_ICON_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => setFormData({ ...formData, icon: name })}
                  className={`flex items-center justify-center aspect-square rounded-lg border text-lg transition ${
                    formData.icon === name
                      ? "border-[#0066ff] bg-[#0066ff] text-white shadow-md"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#0066ff]/50"
                  }`}
                >
                  <ServiceIcon name={name} />
                </button>
              ))}
            </div>
          </div>

          {/* IMAGE */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Cover Image{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              {formData.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.image}
                  alt="preview"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                  <ServiceIcon name={formData.icon} />
                </div>
              )}
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-[#0066ff] transition text-sm">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload image"}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            {formData.image && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: "" })}
                className="mt-2 text-xs text-red-500 hover:underline"
              >
                Remove image
              </button>
            )}
          </div>

          {/* ORDER + ACTIVE */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value })
                }
                className={inputClass}
              />
              <p className="text-xs text-slate-500 mt-1">
                Lower number shows first in the navbar.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 accent-[#0066ff]"
              />
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                {formData.isActive ? (
                  "Active"
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" /> Hidden
                  </>
                )}
              </span>
              <span className="text-xs text-slate-400">
                (uncheck to hide from the public site)
              </span>
            </label>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-3 rounded-xl shadow-lg shadow-cyan-200/40 disabled:opacity-60"
            >
              {saving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/services")}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
