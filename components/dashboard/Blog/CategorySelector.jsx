"use client";

import React, { useState, useEffect } from "react";
import { authFetch } from "@/lib/api/authFetch";

export default function CategorySelector({
  selectedCategories = [],
  onChange,
}) {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState("");

  const fetchCategories = async () => {
    try {
      const r = await authFetch(`${API}/api/blog/admin/categories`);
      const b = await r.json();
      if (r.ok) {
        setCategories(b.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleCategory = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      onChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setCreating(true);
    try {
      const r = await authFetch(`${API}/api/blog/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDesc,
        }),
      });

      const b = await r.json();
      if (r.ok) {
        setCategories([...categories, b.category]);
        onChange([...selectedCategories, b.category._id]);
        setNewCategoryName("");
        setNewCategoryDesc("");
        setShowCreateModal(false);
      } else {
        alert(b.error || "Failed to create category");
      }
    } catch (err) {
      console.error("Error creating category:", err);
      alert("Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const shouldDelete = window.confirm(`Delete category "${categoryName}"?`);
    if (!shouldDelete) return;

    setDeletingCategoryId(categoryId);
    try {
      const r = await authFetch(
        `${API}/api/blog/admin/categories/${categoryId}`,
        {
          method: "DELETE",
        },
      );
      const b = await r.json();

      if (!r.ok) {
        if (r.status === 409 && b.hasAssignedBlogs) {
          alert(
            b.message ||
              "This category has assigned blogs. Remove category from those blogs first.",
          );
          return;
        }
        alert(b.message || b.error || "Failed to delete category");
        return;
      }

      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      onChange(selectedCategories.filter((id) => id !== categoryId));
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    } finally {
      setDeletingCategoryId("");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading categories...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Categories
        </label>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          + Create New
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          No categories available. Create one!
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat._id);
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => handleToggleCategory(cat._id)}
                className={`px-3 py-1.5 text-sm rounded-full border transition ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{cat.name}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat._id, cat.name);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteCategory(cat._id, cat.name);
                      }
                    }}
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full "
                    aria-label={`Delete ${cat.name}`}
                  >
                    {deletingCategoryId === cat._id ? "..." : "×"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-200/50  bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Create New Category</h3>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Technology, Lifestyle"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Brief description of this category"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewCategoryName("");
                    setNewCategoryDesc("");
                  }}
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
