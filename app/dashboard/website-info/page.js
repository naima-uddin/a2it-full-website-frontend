"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Globe, Save } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const EMPTY = {
  siteName: "",
  tagline: "",
  description: "",
  siteUrl: "",
  logo: "",
  favicon: "",
  email: "",
  phone: "",
  address: "",
  latitude: "",
  longitude: "",
  social: { facebook: "", twitter: "", linkedin: "", instagram: "", youtube: "" },
};

export default function WebsiteInfoPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canEdit = isAdmin || isModerator;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/site-settings`,
        );
        if (res.ok) {
          const data = await res.json();
          if (active && data.settings) {
            setForm({ ...EMPTY, ...data.settings, social: { ...EMPTY.social, ...(data.settings.social || {}) } });
          }
        }
      } catch (err) {
        console.error("Failed to load site settings:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const setSocial = (field, value) =>
    setForm((f) => ({ ...f, social: { ...f.social, [field]: value } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/site-settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("Website info saved successfully!");
      } else {
        setError(data.message || "Failed to save");
      }
    } catch (err) {
      setError("Failed to save website info");
    } finally {
      setSaving(false);
    }
  };

  if (!canEdit) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">Access Denied. Admin or Moderator only.</p>
        </div>
      </DashboardLayout>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <DashboardLayout>
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-[#0066ff]" />
            <h1 className="text-4xl font-bold text-slate-900">Website Info</h1>
          </div>
          <p className="text-slate-600">
            Manage your site name, logo, favicon, contact details and social
            links. Changes appear across the public website.
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-600 text-sm">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : (
          <>
            {/* Identity */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Identity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Website Name</label>
                  <input
                    className={inputClass}
                    value={form.siteName}
                    onChange={(e) => set("siteName", e.target.value)}
                    placeholder="A2IT Ltd"
                  />
                </div>
                <div>
                  <label className={labelClass}>Website Address (URL)</label>
                  <input
                    className={inputClass}
                    value={form.siteUrl}
                    onChange={(e) => set("siteUrl", e.target.value)}
                    placeholder="https://a2itltd.com"
                  />
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input
                    className={inputClass}
                    value={form.tagline}
                    onChange={(e) => set("tagline", e.target.value)}
                    placeholder="Build Your Dreams"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Transforming ideas into digital reality."
                  />
                </div>
              </div>
            </section>

            {/* Branding */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Branding</h2>
              <div className="flex flex-wrap gap-8">
                <div>
                  <ImageUploadFactory
                    type="settings"
                    label="Logo"
                    currentImage={form.logo || null}
                    onImageUploaded={(url) => set("logo", url || "")}
                  />
                </div>
                <div>
                  <ImageUploadFactory
                    type="settings"
                    label="Favicon"
                    currentImage={form.favicon || null}
                    onImageUploaded={(url) => set("favicon", url || "")}
                  />
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="info@a2itltd.com"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+880 1846-937397"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Address</label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="Plot No 470&#10;Road No 06&#10;DOHS Mirpur, Dhaka"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Use separate lines — they are shown as-is on the site.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Map Latitude</label>
                  <input
                    className={inputClass}
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => set("latitude", e.target.value)}
                    placeholder="23.836236"
                  />
                </div>
                <div>
                  <label className={labelClass}>Map Longitude</label>
                  <input
                    className={inputClass}
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => set("longitude", e.target.value)}
                    placeholder="90.358672"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Contact page map pin. Copy from Google Maps (right-click →
                    coordinates).
                  </p>
                </div>
              </div>
            </section>

            {/* Social */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Social Links</h2>
              <p className="text-xs text-slate-500 -mt-2">
                Leave blank to hide an icon from the site.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["facebook", "twitter", "linkedin", "instagram", "youtube"].map(
                  (key) => (
                    <div key={key}>
                      <label className={`${labelClass} capitalize`}>{key}</label>
                      <input
                        className={inputClass}
                        value={form.social?.[key] || ""}
                        onChange={(e) => setSocial(key, e.target.value)}
                        placeholder={`https://${key}.com/...`}
                      />
                    </div>
                  ),
                )}
              </div>
            </section>

            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </>
        )}
      </form>
    </DashboardLayout>
  );
}
