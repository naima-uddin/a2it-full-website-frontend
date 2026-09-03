"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Upload,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "../../../components/DashboardLayout";
import { getSectionSchema } from "@/lib/serviceContent/registry";
import { mergeContent } from "@/lib/serviceContent/useSectionContent";
import {
  fetchSectionContent,
  saveSectionContent,
} from "@/lib/api/serviceContent";

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const blankItem = (fields) =>
  fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});

export default function ServiceContentEditor() {
  const { key } = useParams();
  const { token, isAdmin, isModerator } = useAuth();
  const schema = getSectionSchema(key);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!schema) {
      setLoading(false);
      return;
    }
    let active = true;
    fetchSectionContent(key).then((stored) => {
      if (active) {
        setContent(mergeContent(schema.defaults, stored));
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!isAdmin && !isModerator) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-slate-600">
          Access Denied. Admin or Moderator only.
        </div>
      </DashboardLayout>
    );
  }

  if (!schema) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">
            No editable section found for &quot;{key}&quot;.
          </p>
          <Link
            href="/dashboard/services/content"
            className="text-[#0066ff] hover:underline"
          >
            Back to content list
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const setField = (fieldKey, value) =>
    setContent((prev) => ({ ...prev, [fieldKey]: value }));

  const setListItem = (fieldKey, idx, subKey, value) =>
    setContent((prev) => {
      const list = [...(prev[fieldKey] || [])];
      list[idx] = { ...list[idx], [subKey]: value };
      return { ...prev, [fieldKey]: list };
    });

  const addListItem = (field) =>
    setContent((prev) => ({
      ...prev,
      [field.key]: [...(prev[field.key] || []), blankItem(field.fields)],
    }));

  const removeListItem = (fieldKey, idx) =>
    setContent((prev) => ({
      ...prev,
      [fieldKey]: (prev[fieldKey] || []).filter((_, i) => i !== idx),
    }));

  const moveListItem = (fieldKey, idx, dir) =>
    setContent((prev) => {
      const list = [...(prev[fieldKey] || [])];
      const target = idx + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[idx], list[target]] = [list[target], list[idx]];
      return { ...prev, [fieldKey]: list };
    });

  const handleUpload = async (fieldKey, file, onDone) => {
    if (!file) return;
    try {
      setUploadingKey(fieldKey);
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/services`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body,
        },
      );
      const data = await res.json();
      if (res.ok && data.url) onDone(data.url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatus("");
      await saveSectionContent(key, content, token);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2500);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all fields back to the original text?")) {
      setContent(clone(schema.defaults));
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition";

  const renderScalar = (field, value, onChange, uploadKey) => {
    if (field.type === "textarea") {
      return (
        <textarea
          rows={3}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      );
    }
    if (field.type === "image") {
      return (
        <div className="flex items-center gap-3">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="preview"
              className="w-20 h-20 rounded-lg object-cover border border-slate-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200" />
          )}
          <div className="flex-1 space-y-2">
            <input
              type="text"
              placeholder="Image URL"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={inputClass}
            />
            <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#0066ff] text-slate-600">
              <Upload className="w-4 h-4" />
              {uploadingKey === uploadKey ? "Uploading..." : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleUpload(uploadKey, e.target.files?.[0], onChange)
                }
              />
            </label>
          </div>
        </div>
      );
    }
    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/dashboard/services/content"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0066ff] mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to content list
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {schema.label}
              </h1>
              <a
                href={schema.route}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#0066ff] hover:underline"
              >
                View live page <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          {status === "saved" && (
            <p className="mt-3 text-sm text-green-600">✓ Saved. Refresh the live page to see it.</p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-red-600">Failed to save. Try again.</p>
          )}
        </motion.div>

        {loading || !content ? (
          <div className="py-12 text-center text-slate-500">Loading…</div>
        ) : (
          <div className="space-y-5">
            {schema.fields.map((field) => (
              <div
                key={field.key}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
              >
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  {field.label}
                </label>

                {field.type === "list" ? (
                  <div className="space-y-4">
                    {(content[field.key] || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {field.itemLabel || "Item"} {idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveListItem(field.key, idx, -1)}
                              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                              title="Move up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveListItem(field.key, idx, 1)}
                              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                              title="Move down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeListItem(field.key, idx)}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {field.fields.map((sub) => (
                            <div key={sub.key}>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                {sub.label}
                              </label>
                              {renderScalar(
                                sub,
                                item[sub.key],
                                (val) =>
                                  setListItem(field.key, idx, sub.key, val),
                                `${field.key}.${idx}.${sub.key}`,
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem(field)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:border-[#0066ff] hover:text-[#0066ff] text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" /> Add {field.itemLabel || "item"}
                    </button>
                  </div>
                ) : (
                  renderScalar(
                    field,
                    content[field.key],
                    (val) => setField(field.key, val),
                    field.key,
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
