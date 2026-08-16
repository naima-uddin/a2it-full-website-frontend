"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical, Power } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

export default function ClientShowcasePage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingImageUrl, setPendingImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    fetchLogos();
  }, [token]);

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        setLogos(data.logos || []);
      }
    } catch (err) {
      console.error("Error fetching client logos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLogo = async () => {
    if (!pendingImageUrl) {
      setError("Please upload a logo image first");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: pendingImageUrl,
            name,
            order: logos.length,
          }),
        },
      );

      if (response.ok) {
        setPendingImageUrl(null);
        setName("");
        fetchLogos();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save logo");
      }
    } catch (err) {
      console.error("Error saving client logo:", err);
      setError("Failed to save logo");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (logo) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos/${logo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !logo.isActive }),
        },
      );

      if (response.ok) fetchLogos();
    } catch (err) {
      console.error("Error updating client logo:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client logo?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) fetchLogos();
    } catch (err) {
      console.error("Error deleting client logo:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Client Showcase
          </h1>
          <p className="text-slate-600">
            Upload and manage the client logos shown on the homepage.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
        >
          <h2 className="text-xl font-bold text-slate-900">Add New Logo</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <ImageUploadFactory
              type="clients"
              label="Logo Image"
              onImageUploaded={(url) => setPendingImageUrl(url)}
              currentImage={pendingImageUrl}
            />

            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Client Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <button
              type="button"
              onClick={handleAddLogo}
              disabled={saving || !pendingImageUrl}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-fit"
            >
              <Plus className="w-5 h-5" />
              {saving ? "Saving..." : "Add Logo"}
            </button>
          </div>
        </motion.div>

        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Current Logos ({logos.length})
            </h2>

            {logos.length === 0 ? (
              <p className="text-slate-500 text-sm">No client logos yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {logos.map((logo) => (
                  <div
                    key={logo._id}
                    className={`relative group border rounded-lg p-3 flex flex-col items-center gap-2 ${
                      logo.isActive
                        ? "border-slate-200"
                        : "border-slate-200 opacity-50"
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-slate-300 absolute top-2 left-2" />
                    <img
                      src={logo.image}
                      alt={logo.name || "Client logo"}
                      className="w-full h-16 object-contain"
                    />
                    <p className="text-xs text-slate-600 truncate w-full text-center">
                      {logo.name || "—"}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(logo)}
                        title={logo.isActive ? "Hide from site" : "Show on site"}
                        className={`p-2 rounded ${
                          logo.isActive
                            ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(logo._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
