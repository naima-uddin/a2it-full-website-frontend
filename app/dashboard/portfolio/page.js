"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Search, GripVertical } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

export default function PortfolioPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [detailedMode, setDetailedMode] = useState(true);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDisplay, setNewCategoryDisplay] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: [],
    image: "",
    link: "",
    client: "",
    technologies: "",
    duration: "",
    teamSize: "",
    role: "",
    challenge: "",
    solution: "",
    result: "",
    features: "",
    metrics: "",
  });

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

  useEffect(() => {
    fetchPortfolios();
    fetchCategories();
  }, [token]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const url = isAdmin
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/admin/all`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`;
      const opts = isAdmin
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await fetch(url, opts);

      if (response.ok) {
        const data = await response.json();
        setPortfolios(data.portfolios);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio-categories`,
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategoryDisplay) {
      alert("Please provide both category name and display name");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newCategoryName,
            displayName: newCategoryDisplay,
          }),
        },
      );

      if (response.ok) {
        setNewCategoryName("");
        setNewCategoryDisplay("");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (name) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio-categories/${name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${editingItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`;

      const method = editingItem ? "PUT" : "POST";

      // Parse features (comma separated)
      const features = formData.features
        ? formData.features
            .split("\n")
            .map((f) => f.trim())
            .filter((f) => f)
        : [];

      // Parse metrics (one per line: value|label)
      const metrics = formData.metrics
        ? formData.metrics
            .split("\n")
            .map((m) => {
              const [value, label] = m.split("|").map((s) => s.trim());
              return value && label ? { value, label } : null;
            })
            .filter((m) => m)
        : [];

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.split(",").map((t) => t.trim()),
          features,
          metrics,
        }),
      });

      if (response.ok) {
        fetchPortfolios();
        setShowForm(false);
        setEditingItem(null);
        setDetailedMode(false);
        setFormData({
          title: "",
          description: "",
          category: [],
          image: "",
          link: "",
          client: "",
          technologies: "",
          duration: "",
          teamSize: "",
          role: "",
          challenge: "",
          solution: "",
          result: "",
          features: "",
          metrics: "",
        });
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this portfolio item?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchPortfolios();
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    }
  };

  const filteredPortfolios = portfolios.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Drag-and-drop reordering (only enabled when not searching)
  const isReorderEnabled = searchQuery.trim() === "";

  const persistOrder = async (orderedList) => {
    try {
      setSavingOrder(true);
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/reorder`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderedIds: orderedList.map((p) => p._id) }),
        },
      );
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDragStart = (index) => {
    if (!isReorderEnabled) return;
    setDragIndex(index);
  };

  const handleDragEnterItem = (index) => {
    if (!isReorderEnabled || dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (dropIndex) => {
    if (!isReorderEnabled || dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...portfolios];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);

    setPortfolios(updated);
    setDragIndex(null);
    setDragOverIndex(null);
    persistOrder(updated);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

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
              Manage Portfolio
            </h1>
            <p className="text-slate-600">Showcase your projects and work</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoryManager(!showCategoryManager)}
              className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
            >
              Manage Categories
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setDetailedMode(true);
                setFormData({
                  title: "",
                  description: "",
                  category: [],
                  image: "",
                  link: "",
                  client: "",
                  technologies: "",
                  duration: "",
                  teamSize: "",
                  role: "",
                  challenge: "",
                  solution: "",
                  result: "",
                  features: "",
                  metrics: "",
                });
                // Close category manager and open the form in-place
                setShowCategoryManager(false);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </button>
          </div>
        </motion.div>

        {showCategoryManager && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-8 shadow-lg"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Portfolio Categories
              </h2>
              <p className="text-slate-600 text-sm">
                Manage your portfolio project categories. Add new ones or remove
                existing ones.
              </p>
            </div>

            {/* Add New Category Section */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  +
                </div>
                Add New Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., react-projects"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Lowercase, no spaces (e.g., saas-projects)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., React Projects"
                    value={newCategoryDisplay}
                    onChange={(e) => setNewCategoryDisplay(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    How it appears to users
                  </p>
                </div>
                <div className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleAddCategory}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold rounded-lg hover:shadow-lg transition"
                  >
                    Create Category
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Categories List Section */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 text-sm font-bold">
                  {categories.length}
                </div>
                Existing Categories
              </h3>
              {!loadingCategories && categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat, index) => (
                    <motion.div
                      key={cat._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md hover:border-slate-300 transition group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-xs font-mono text-slate-500 mb-1">
                            {cat.name}
                          </p>
                          <h4 className="text-lg font-bold text-slate-900">
                            {cat.displayName}
                          </h4>
                        </div>
                        {isAdmin ? (
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleDeleteCategory(cat.name)}
                            className="ml-2 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        ) : (
                          <div
                            className="ml-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                            title="Delete disabled"
                          >
                            <span className="text-xs text-slate-400">🔒</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex gap-2">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#00f0ff]/20 to-[#0066ff]/20 text-slate-700 text-xs font-semibold rounded-full">
                          Active
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : !loadingCategories ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <p className="text-slate-500 mb-2">No categories found</p>
                  <p className="text-slate-400 text-sm">
                    Create your first category above
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                  <p className="text-slate-500 mt-4">Loading categories...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-8 shadow-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingItem ? "Edit Project" : "Create New Project"}
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  {editingItem
                    ? "Update project details"
                    : "Add a new project to your portfolio"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailedMode(!detailedMode)}
                className="text-sm px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition"
              >
                {detailedMode ? "→ Simple" : "→ Detailed"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Basic Information
                </h3>

                {/* Title and Client - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., E-Commerce Platform"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., ABC Corporation"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                </div>

                {/* Description - Full width */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Brief description of the project..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows="3"
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Category & Technologies Section */}
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Categories & Technologies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Categories
                    </label>

                    {/* Selected Categories as Chips */}
                    <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-12 flex flex-wrap gap-2 items-center">
                      {formData.category.length > 0 ? (
                        formData.category.map((cat, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] rounded-full text-sm font-semibold"
                          >
                            {cat}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  category: formData.category.filter(
                                    (c) => c !== cat,
                                  ),
                                });
                              }}
                              className="ml-1 hover:opacity-70 transition"
                            >
                              ✕
                            </button>
                          </motion.div>
                        ))
                      ) : (
                        <span className="text-slate-500 text-sm">
                          Select categories...
                        </span>
                      )}
                    </div>

                    {/* Category Dropdown */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 block">
                        Available Categories
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-slate-50 border border-slate-200 rounded-lg p-3">
                        {categories.map((cat) => {
                          const isSelected = formData.category.includes(
                            cat.displayName,
                          );
                          return (
                            <motion.button
                              key={cat._id}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                if (isSelected) {
                                  setFormData({
                                    ...formData,
                                    category: formData.category.filter(
                                      (c) => c !== cat.displayName,
                                    ),
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    category: [
                                      ...formData.category,
                                      cat.displayName,
                                    ],
                                  });
                                }
                              }}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition text-left ${
                                isSelected
                                  ? "bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12]"
                                  : "bg-white border border-slate-300 text-slate-700 hover:border-cyan-500"
                              }`}
                            >
                              {cat.displayName}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Technologies
                    </label>
                    <textarea
                      placeholder="React, Node.js, MongoDB, TypeScript"
                      value={formData.technologies}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          technologies: e.target.value,
                        })
                      }
                      rows="4"
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Media & Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ImageUploadFactory
                      type="portfolio"
                      label="Project Image"
                      currentImage={formData.image}
                      onImageUploaded={(url) =>
                        setFormData({ ...formData, image: url || "" })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Project Link / Live URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Fields - Conditional */}
              {detailedMode && (
                <>
                  {/* Project Details Section */}
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Project Details
                    </h3>

                    {/* Duration, Team Size, Role - Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Duration
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 3 months"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Team Size
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 4 developers"
                          value={formData.teamSize}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              teamSize: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Your Role
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Lead Developer"
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              role: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Challenge, Solution, Result Section */}
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Project Narrative
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Challenge
                        </label>
                        <textarea
                          placeholder="What was the main challenge?"
                          value={formData.challenge}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              challenge: e.target.value,
                            })
                          }
                          rows="4"
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Solution
                        </label>
                        <textarea
                          placeholder="How did you solve it?"
                          value={formData.solution}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              solution: e.target.value,
                            })
                          }
                          rows="4"
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Result
                        </label>
                        <textarea
                          placeholder="What was the outcome?"
                          value={formData.result}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              result: e.target.value,
                            })
                          }
                          rows="4"
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Features and Metrics Section */}
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Features & Metrics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Features
                        </label>
                        <textarea
                          placeholder="One feature per line&#10;e.g. Real-time notifications&#10;Advanced analytics"
                          value={formData.features}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              features: e.target.value,
                            })
                          }
                          rows="5"
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Metrics
                        </label>
                        <textarea
                          placeholder="Format: value|label&#10;e.g. 10K+|Users&#10;99.9%|Uptime"
                          value={formData.metrics}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metrics: e.target.value,
                            })
                          }
                          rows="5"
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 bg-white rounded-lg p-6 border border-slate-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold rounded-lg hover:shadow-lg transition"
                >
                  {editingItem ? "Update Project" : "Create Project"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>

        {isReorderEnabled && filteredPortfolios.length > 1 && (
          <p className="text-sm text-slate-500 flex items-center gap-2 -mt-2">
            <GripVertical className="w-4 h-4" />
            Drag any card to change which project appears first on the public
            portfolio.
            {savingOrder && (
              <span className="text-cyan-600 font-medium">Saving order…</span>
            )}
          </p>
        )}

        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 md:grid-cols-5 gap-6"
          >
            {filteredPortfolios.map((item, index) => (
              <div
                key={item._id}
                draggable={isReorderEnabled}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnterItem(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`relative bg-white border rounded-xl overflow-hidden transition shadow-sm ${
                  isReorderEnabled ? "cursor-move" : ""
                } ${
                  dragOverIndex === index
                    ? "border-cyan-500 ring-2 ring-cyan-400/50"
                    : "border-slate-200 hover:border-cyan-300"
                } ${dragIndex === index ? "opacity-40" : "opacity-100"}`}
              >
                {isReorderEnabled && (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold">
                    <GripVertical className="w-3.5 h-3.5" />
                    {index + 1}
                  </div>
                )}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover pointer-events-none"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setDetailedMode(true);
                        setFormData({
                          title: item.title,
                          description: item.description,
                          category: item.category || [],
                          image: item.image,
                          link: item.link || "",
                          client: item.client || "",
                          technologies: item.technologies?.join(",") || "",
                          duration: item.duration || "",
                          teamSize: item.teamSize || "",
                          role: item.role || "",
                          challenge: item.challenge || "",
                          solution: item.solution || "",
                          result: item.result || "",
                          features: item.features?.join("\n") || "",
                          metrics:
                            item.metrics
                              ?.map((m) => `${m.value}|${m.label}`)
                              .join("\n") || "",
                        });
                        // Close category manager and open form in-place
                        setShowCategoryManager(false);
                        setShowForm(true);
                      }}
                      className="p-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
