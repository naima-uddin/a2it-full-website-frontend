"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Search } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { promotionalPackages } from "@/components/promotion/package";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const defaultFormData = {
  name: "",
  oldPrice: "",
  newPrice: "",
  badge: "",
  color: "green",
  customColor: "",
  description: "",
  features: "",
};

export default function SolutionsPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const url = isAdmin
          ? `${API_BASE}/api/promotional-packages/admin/all`
          : `${API_BASE}/api/promotional-packages`;
        const opts = isAdmin
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const response = await fetch(url, opts);

        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }

        const data = await response.json();
        if (data.packages?.length) {
          setItems(data.packages);
        } else {
          setItems(promotionalPackages);
          await Promise.all(
            promotionalPackages.map((pkg) =>
              fetch(`${API_BASE}/api/promotional-packages`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(pkg),
              }),
            ),
          );
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        setItems(promotionalPackages);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPackages();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const computeBadgeColor = (color) => {
      const normalize = (c) => String(c || "").trim();
      const c = normalize(color);

      // hex -> lighten
      const hexMatch = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (hexMatch) {
        let hex = hexMatch[1];
        if (hex.length === 3) {
          hex = hex
            .split("")
            .map((h) => h + h)
            .join("");
        }
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const mix = (v) => Math.round(v + (255 - v) * 0.38);
        const hr = mix(r).toString(16).padStart(2, "0");
        const hg = mix(g).toString(16).padStart(2, "0");
        const hb = mix(b).toString(16).padStart(2, "0");
        return `#${hr}${hg}${hb}`;
      }

      // rgb(a) -> lighten
      const rgbMatch = c.match(/rgba?\(([^)]+)\)/i);
      if (rgbMatch) {
        const parts = rgbMatch[1].split(",").map((p) => p.trim());
        const r = parseInt(parts[0], 10) || 0;
        const g = parseInt(parts[1], 10) || 0;
        const b = parseInt(parts[2], 10) || 0;
        const mix = (v) => Math.round(v + (255 - v) * 0.38);
        return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
      }

      // fallback to original (resolveTheme will provide light fallback)
      return c;
    };

    const payload = {
      ...formData,
      color:
        formData.color === "custom"
          ? formData.customColor.trim() || "custom"
          : formData.color,
      badgeColor: computeBadgeColor(
        formData.color === "custom" ? formData.customColor : formData.color,
      ),
      features: formData.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
      id: editing ? editing.id : Date.now(),
    };

    const url = editing
      ? `${API_BASE}/api/promotional-packages/${editing._id || editing.id}`
      : `${API_BASE}/api/promotional-packages`;

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
          ? `${API_BASE}/api/promotional-packages/admin/all`
          : `${API_BASE}/api/promotional-packages`;
        const refreshedOpts = isAdmin
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const refreshed = await fetch(refreshedUrl, refreshedOpts);
        const data = await refreshed.json();
        setItems(data.packages || []);
        setShowForm(false);
        setEditing(null);
        setFormData(defaultFormData);
      }
    } catch (error) {
      console.error("Error saving package:", error);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({
      name: item.name || "",
      oldPrice: item.oldPrice || "",
      newPrice: item.newPrice || "",
      badge: item.badge || "",
      color:
        item.color === "green" ||
        item.color === "silver" ||
        item.color === "gold"
          ? item.color
          : "custom",
      customColor:
        item.color &&
        item.color !== "green" &&
        item.color !== "silver" &&
        item.color !== "gold"
          ? item.color
          : "",
      description: item.description || "",
      features: (item.features || []).join("\n"),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this package?")) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/promotional-packages/${id}`,
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
      console.error("Error deleting package:", error);
    }
  };

  const filtered = items.filter((item) =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
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
          className="flex justify-between items-center gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Manage Packages
            </h1>
            <p className="text-slate-600">Choose Your Perfect Package</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages..."
                className="pl-10 pr-3 py-2 border rounded-lg"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            </div>
            <button
              onClick={() => {
                setEditing(null);
                setFormData(defaultFormData);
                setShowForm(!showForm);
              }}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Package
            </button>
          </div>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editing ? "Edit Package" : "Create New Package"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Package Name"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={formData.oldPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, oldPrice: e.target.value })
                  }
                  placeholder="Old Price"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  value={formData.newPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, newPrice: e.target.value })
                  }
                  placeholder="New Price"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData({ ...formData, badge: e.target.value })
                  }
                  placeholder="Badge"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <select
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      color: e.target.value,
                      customColor:
                        e.target.value === "custom" ? formData.customColor : "",
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                >
                  <option value="green">Green</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              {formData.color === "custom" && (
                <input
                  value={formData.customColor}
                  onChange={(e) =>
                    setFormData({ ...formData, customColor: e.target.value })
                  }
                  placeholder="Custom color/theme name"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              )}
              {formData.badgeColor === "custom" && (
                <input
                  value={formData.customBadgeColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customBadgeColor: e.target.value,
                    })
                  }
                  placeholder="Custom badge color (hex, rgb or name)"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              )}
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
                rows="3"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <textarea
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                placeholder="Features (one per line)"
                rows="4"
                className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              />

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

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {item.badge} • {item.oldPrice} → {item.newPrice}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-slate-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(item._id || item.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-700 mt-3">{item.description}</p>

              {item.features && item.features.length > 0 && (
                <ul className="text-sm text-slate-600 mt-3 list-disc ml-5 space-y-1">
                  {item.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-slate-600">
              No packages found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
