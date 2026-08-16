"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Search, Upload, X } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { promotionalProjects } from "@/components/promotion/project";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ProjectsPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: [],
    description: "",
    image: "",
    client: "",
    date: "",
    technologies: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDisplay, setNewCategoryDisplay] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cloudinaryList, setCloudinaryList] = useState([]);
  const [showCloudinaryPicker, setShowCloudinaryPicker] = useState(false);
  const [formError, setFormError] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  const formatCategoryLabel = (value) =>
    String(value || "")
      .trim()
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const groupedMediaResources = useMemo(
    () =>
      cloudinaryList.reduce((grouped, resource) => {
        const parts = String(resource.public_id || "").split("/");
        const folder = parts.length >= 2 ? parts[1] : "general";
        if (!grouped[folder]) grouped[folder] = [];
        grouped[folder].push(resource);
        return grouped;
      }, {}),
    [cloudinaryList],
  );

  useEffect(() => {
    fetchCategories();
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const url = isAdmin
          ? `${API_BASE}/api/promotional-projects/admin/all`
          : `${API_BASE}/api/promotional-projects`;
        const opts = isAdmin
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const response = await fetch(url, opts);

        if (!response.ok) {
          throw new Error("Failed to fetch projects All data.");
        }

        const data = await response.json();
        if (data.projects?.length) {
          setItems(
            data.projects.map((project, index) => ({
              ...project,
              image: project.image || project.img || "",
              order: project.order !== undefined ? project.order : index,
            })),
          );
        } else {
          setItems(
            promotionalProjects.map((project) => ({
              ...project,
              image: project.image || project.img || "",
            })),
          );
          await Promise.all(
            promotionalProjects.map((project) =>
              fetch(`${API_BASE}/api/promotional-projects`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...project,
                  image: project.image || project.img || "",
                  category: project.category,
                  technologies: project.technologies,
                }),
              }),
            ),
          );
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setItems(
          promotionalProjects.map((project) => ({
            ...project,
            image: project.image || project.img || "",
          })),
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProjects();
  }, [token, isAdmin, isModerator]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(
        `${API_BASE}/api/promotional-project-categories`,
      );

      if (response.ok) {
        const data = await response.json();
        const loadedCategories = data.categories || [];
        setCategories(loadedCategories);
        if (!selectedCategory && loadedCategories.length > 0) {
          setSelectedCategory(loadedCategories[0].name);
        }
      }
    } catch (error) {
      console.error("Error fetching project categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleAddCategory = async () => {
    const name = (newCategoryName || "").trim();
    const displayName = (newCategoryDisplay || "").trim();

    if (!name || !displayName) {
      alert("Please provide both category name and display name");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/promotional-project-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, displayName }),
        },
      );

      if (response.ok) {
        setNewCategoryName("");
        setNewCategoryDisplay("");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error adding project category:", error);
    }
  };

  const handleDeleteCategory = async (name) => {
    if (!confirm("Delete this category?")) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/promotional-project-categories/${encodeURIComponent(name)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setCategories((prev) =>
          prev.filter((category) => category.name !== name),
        );
        setFormData((prev) => ({
          ...prev,
          category: prev.category.filter((category) => category !== name),
        }));
        if (selectedCategory === name) {
          setSelectedCategory("");
        }
      }
    } catch (error) {
      console.error("Error deleting project category:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    let imageUrl = formData.image.trim();

    if (!imageUrl && selectedFile) {
      try {
        setUploading(true);
        const uploadForm = new FormData();
        uploadForm.append("image", selectedFile);

        const uploadResponse = await fetch(`${API_BASE}/api/upload/portfolio`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadForm,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadData?.success || !uploadData?.url) {
          throw new Error(uploadData?.error || "Image upload failed");
        }

        imageUrl = uploadData.url;
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        setSelectedFile(null);
        setPreviewUrl("");
      } catch (uploadError) {
        console.error("Error uploading image before save:", uploadError);
        setFormError(uploadError.message || "Please upload an image first.");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    if (!imageUrl) {
      setFormError(
        "Please provide an image URL or upload an image before saving.",
      );
      return;
    }

    const payload = {
      ...formData,
      image: imageUrl,
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category: formData.category,
    };

    const url = editing
      ? `${API_BASE}/api/promotional-projects/${editing._id || editing.id}`
      : `${API_BASE}/api/promotional-projects`;

    const method = editing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const refreshedUrl = isAdmin
          ? `${API_BASE}/api/promotional-projects/admin/all`
          : `${API_BASE}/api/promotional-projects`;
        const refreshedOpts = isAdmin
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const refreshed = await fetch(refreshedUrl, refreshedOpts);
        const data = await refreshed.json();
        setItems(
          (data.projects || []).map((project) => ({
            ...project,
            image: project.image || project.img || "",
          })),
        );
        setShowForm(false);
        setEditing(null);
        setShowCategoryManager(false);
        setSelectedCategory(categories[0]?.name || "");
        setNewCategoryName("");
        setNewCategoryDisplay("");
        setFormData({
          title: "",
          subtitle: "",
          category: [],
          description: "",
          image: "",
          client: "",
          date: "",
          technologies: "",
        });
        setSelectedCategory("");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      setFormError(error.message || "Failed to save project.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const uploadImageToCloudinary = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", selectedFile);

      const resp = await fetch(`${API_BASE}/api/upload/portfolio`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await resp.json();
      if (data?.success && data.url) {
        setFormData({ ...formData, image: data.url });
        setSelectedFile(null);
        setShowCloudinaryPicker(false);
      } else {
        console.error("Upload failed", data);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  const fetchCloudinaryList = async () => {
    try {
      const resp = await fetch(`${API_BASE}/api/upload/media/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (data?.success) {
        setCloudinaryList(data.resources || []);
        setShowCloudinaryPicker(true);
      }
    } catch (err) {
      console.error("Failed to list Cloudinary resources", err);
    }
  };

  const selectCloudinaryImage = (url) => {
    setFormData({ ...formData, image: url });
    setShowCloudinaryPicker(false);
  };

  const handleEdit = (it) => {
    setEditing(it);
    const nextCategories = Array.isArray(it.category)
      ? it.category
      : it.category
        ? [it.category]
        : [];
    setFormData({
      title: it.title || "",
      subtitle: it.subtitle || "",
      category: nextCategories,
      description: it.description || "",
      image: it.image || "",
      client: it.client || "",
      date: it.date || "",
      technologies: (it.technologies || []).join(", "),
    });
    setSelectedCategory(nextCategories[0] || categories[0]?.name || "");
    setShowCategoryManager(false);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/promotional-projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDragStart = (e, project) => {
    setDraggedItem(project);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetProject) => {
    e.preventDefault();
    if (
      !draggedItem ||
      (draggedItem._id || draggedItem.id) ===
        (targetProject._id || targetProject.id)
    ) {
      setDraggedItem(null);
      return;
    }

    // Work with the full items list, not filtered
    const draggedIdx = items.findIndex(
      (p) => (p._id || p.id) === (draggedItem._id || draggedItem.id),
    );
    const targetIdx = items.findIndex(
      (p) => (p._id || p.id) === (targetProject._id || targetProject.id),
    );

    if (draggedIdx === -1 || targetIdx === -1) {
      setDraggedItem(null);
      return;
    }

    // Reorder the full items list
    const newList = [...items];
    const [movedItem] = newList.splice(draggedIdx, 1);
    newList.splice(targetIdx, 0, movedItem);

    setItems(newList);
    setDraggedItem(null);

    // Persist to backend immediately
    try {
      await fetch(`${API_BASE}/api/promotional-projects/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projects: newList }),
      });
    } catch (error) {
      console.error("Error saving reorder:", error);
      // If error, fetch fresh data from backend
      const response = await fetch(
        isAdmin
          ? `${API_BASE}/api/promotional-projects/admin/all`
          : `${API_BASE}/api/promotional-projects`,
        isAdmin ? { headers: { Authorization: `Bearer ${token}` } } : {},
      );
      const data = await response.json();
      setItems(
        (data.projects || []).map((project) => ({
          ...project,
          image: project.image || project.img || "",
        })),
      );
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const filtered = items.filter((p) =>
    (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isAdmin && !isModerator) {
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
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Manage Projects
            </h1>
            <p className="text-slate-600">
              Experience Our Award-Winning Web Projects
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 pr-3 py-2 border rounded-lg"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            </div>
            <button
              onClick={() => {
                setEditing(null);
                setFormData({
                  title: "",
                  subtitle: "",
                  category: [],
                  description: "",
                  image: "",
                  client: "",
                  date: "",
                  technologies: "",
                });
                setSelectedCategory(categories[0]?.name || "");
                setShowCategoryManager(false);
                setShowForm(!showForm);
              }}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-gray-600 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editing ? "Edit Project" : "Create New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Title"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="Subtitle"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Project Categories
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCategoryManager(!showCategoryManager)}
                    className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                  >
                    {showCategoryManager ? "Hide Manager" : "Manage Categories"}
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={categoriesLoading}
                    className="w-full md:flex-1 px-4 py-2 border rounded-lg bg-white"
                  >
                    <option value="">Select an existing category</option>
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.displayName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedCategory) return;
                      setFormData((prev) => {
                        if (prev.category.includes(selectedCategory))
                          return prev;
                        return {
                          ...prev,
                          category: [...prev.category, selectedCategory],
                        };
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold"
                  >
                    Add Category
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-10">
                  {formData.category.length > 0 ? (
                    formData.category.map((categoryName) => {
                      const category = categories.find(
                        (item) => item.name === categoryName,
                      );
                      return (
                        <span
                          key={categoryName}
                          className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-700"
                        >
                          {category?.displayName ||
                            formatCategoryLabel(categoryName)}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                category: prev.category.filter(
                                  (value) => value !== categoryName,
                                ),
                              }))
                            }
                            className="text-slate-400 hover:text-slate-700"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm text-slate-500">
                      No category selected yet.
                    </span>
                  )}
                </div>

                {showCategoryManager && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 mb-3">
                        Add New Project Category
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Category name e.g. ai-ml"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          value={newCategoryDisplay}
                          onChange={(e) =>
                            setNewCategoryDisplay(e.target.value)
                          }
                          placeholder="Display name e.g. AI/ML"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="mt-3 px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
                      >
                        Save Category
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 mb-3">
                        Existing Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <span
                            key={category.name}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                          >
                            {category.displayName}
                            {isAdmin ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCategory(category.name)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            ) : (
                              <span className="text-slate-300">×</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
                rows="3"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Project Image
                    </label>
                    <p className="text-sm text-slate-500">
                      Paste a URL, upload a new image, or choose from Media.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={fetchCloudinaryList}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Choose from Media
                  </button>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                  <div className="space-y-3">
                    <input
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="Paste image URL here"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white"
                    />

                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Upload a new image
                          </p>
                          <p className="text-xs text-slate-500">
                            Select a file, then upload it to Cloudinary.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50">
                            <Plus className="w-4 h-4" />
                            <input
                              type="file"
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                            Choose file
                          </label>
                          {selectedFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                setPreviewUrl("");
                              }}
                              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-500 hover:border-red-200 hover:text-red-600"
                              aria-label="Cancel selected file"
                              title="Cancel selected file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={uploadImageToCloudinary}
                            disabled={!selectedFile || uploading}
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0066ff] px-4 py-2 font-semibold text-[#0a0a12] disabled:opacity-50"
                          >
                            <Upload className="w-4 h-4" />
                            {uploading ? "Uploading..." : "Upload"}
                          </button>
                        </div>
                      </div>

                      {selectedFile && previewUrl && (
                        <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3 border border-slate-200">
                          <img
                            src={previewUrl}
                            alt="Selected preview"
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-700 truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Ready to upload to Cloudinary
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                      Current image
                    </p>
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="preview"
                        className="h-40 w-full rounded-lg object-cover border border-slate-200 bg-white"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                        No image selected yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  placeholder="Client"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  placeholder="Year"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  placeholder="Technologies (comma separated)"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-2 rounded-lg"
                >
                  {editing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-4 mt-8">
          {filtered.map((p) => (
            <div
              key={p._id || p.id}
              draggable
              onDragStart={(e) => handleDragStart(e, p)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, p)}
              onDragEnd={handleDragEnd}
              onClick={() => setViewingProject(p)}
              className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm cursor-move transition-all ${
                (draggedItem?._id || draggedItem?.id) === (p._id || p.id)
                  ? "opacity-50 border-slate-400"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 cursor-pointer hover:text-blue-600">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-slate-600">{p.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(p);
                    }}
                    className="p-2 bg-slate-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p._id || p.id);
                      }}
                      className="p-2 bg-red-50 text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-3">{p.description}</p>
              <p className="text-xs text-slate-500 mt-3">
                Client: {p.client} • {p.date}
              </p>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-slate-600">
              No projects found.
            </div>
          )}
        </div>

        {/* Project detail modal */}
        {viewingProject && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setViewingProject(null)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {viewingProject.title}
                </h2>
                <button
                  onClick={() => setViewingProject(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              {viewingProject.image && (
                <img
                  src={viewingProject.image}
                  alt={viewingProject.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-3">
                {viewingProject.subtitle && (
                  <p className="text-slate-600">
                    <strong>Subtitle:</strong> {viewingProject.subtitle}
                  </p>
                )}
                {viewingProject.description && (
                  <p className="text-slate-700">
                    <strong>Description:</strong> {viewingProject.description}
                  </p>
                )}
                {viewingProject.client && (
                  <p className="text-slate-600">
                    <strong>Client:</strong> {viewingProject.client}
                  </p>
                )}
                {viewingProject.date && (
                  <p className="text-slate-600">
                    <strong>Date:</strong> {viewingProject.date}
                  </p>
                )}
                {viewingProject.category &&
                  viewingProject.category.length > 0 && (
                    <p className="text-slate-600">
                      <strong>Category:</strong>{" "}
                      {Array.isArray(viewingProject.category)
                        ? viewingProject.category.join(", ")
                        : viewingProject.category}
                    </p>
                  )}
                {viewingProject.technologies &&
                  viewingProject.technologies.length > 0 && (
                    <p className="text-slate-600">
                      <strong>Technologies:</strong>{" "}
                      {Array.isArray(viewingProject.technologies)
                        ? viewingProject.technologies.join(", ")
                        : viewingProject.technologies}
                    </p>
                  )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    handleEdit(viewingProject);
                    setViewingProject(null);
                  }}
                  className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewingProject(null)}
                  className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cloudinary picker modal */}
        {showCloudinaryPicker && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold">Select image from Media</h3>
                  <p className="text-sm text-slate-500">
                    Images are grouped by Cloudinary folder under a2it/.
                  </p>
                </div>
                <button
                  onClick={() => setShowCloudinaryPicker(false)}
                  className="text-sm text-slate-500"
                >
                  Close
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-1">
                {cloudinaryList.length === 0 && (
                  <p className="text-sm text-slate-500">No images found.</p>
                )}
                {Object.entries(groupedMediaResources)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([folder, folderResources]) => (
                    <section key={folder} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 capitalize">
                            {folder}
                          </h4>
                          <p className="text-xs text-slate-500">
                            a2it/{folder}
                          </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          {folderResources.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {folderResources.map((r) => (
                          <button
                            key={r.public_id}
                            onClick={() => selectCloudinaryImage(r.secure_url)}
                            className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <img
                              src={r.secure_url}
                              alt={r.public_id}
                              className="h-24 w-full object-cover"
                            />
                            <div className="p-2">
                              <p className="truncate text-xs text-slate-600">
                                {r.public_id.split("/").pop()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
