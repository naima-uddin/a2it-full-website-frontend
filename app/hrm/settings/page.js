"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Settings,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Calendar,
  CalendarDays,
  Database,
  RefreshCw,
  ShieldAlert,
  Clock,
  CheckSquare,
  Square,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_HRM_API_URL;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Must match the backend REGISTRY keys in dataManagementController.js
const DATA_TYPES = [
  { key: "attendance", label: "Attendance" },
  { key: "payroll", label: "Payroll" },
  { key: "leave", label: "Leave" },
  { key: "meal", label: "Meal" },
  { key: "foodCost", label: "Food Cost" },
  { key: "transport", label: "Transport" },
  { key: "officeSupply", label: "Office Supplies" },
  { key: "utilityBill", label: "Utility Bills" },
  { key: "officeRent", label: "Office Rent" },
  { key: "miscellaneous", label: "Miscellaneous" },
  { key: "softwareSubscription", label: "Software Subscriptions" },
];

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken") || localStorage.getItem("token");
}

function getRole() {
  if (typeof window === "undefined") return null;
  try {
    if (localStorage.getItem("adminData")) return "admin";
    const ud = JSON.parse(localStorage.getItem("userData") || "null");
    return ud?.role || null;
  } catch {
    return null;
  }
}

export default function HrmSettingsPage() {
  const router = useRouter();
  const now = new Date();

  const [authChecked, setAuthChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [tab, setTab] = useState("delete"); // "delete" | "trash"

  // Delete-data state
  const [scope, setScope] = useState("month"); // "month" | "year"
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState([]); // data type keys
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(null); // { totalRecords } while confirming

  // Trash state
  const [trash, setTrash] = useState([]);
  const [loadingTrash, setLoadingTrash] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const years = Array.from({ length: 8 }, (_, i) => now.getFullYear() - 5 + i);

  // ── Auth guard: admin only ──
  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (!token) {
      router.replace("/hrm");
      return;
    }
    if (role !== "admin") {
      setAllowed(false);
      setAuthChecked(true);
      return;
    }
    setAllowed(true);
    setAuthChecked(true);
  }, [router]);

  const authHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    }),
    [],
  );

  // ── Data fetchers ──
  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    setSummary(null);
    try {
      const qs = new URLSearchParams({ scope, year: String(year) });
      if (scope === "month") qs.set("month", String(month));
      const res = await fetch(`${API}/admin/data/summary?${qs.toString()}`, {
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load summary");
      setSummary(json.data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoadingSummary(false);
    }
  }, [scope, month, year, authHeaders]);

  const fetchTrash = useCallback(async () => {
    setLoadingTrash(true);
    try {
      const res = await fetch(`${API}/admin/data/trash`, {
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load trash");
      setTrash(json.data.items || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoadingTrash(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (allowed && tab === "trash") fetchTrash();
  }, [allowed, tab, fetchTrash]);

  // ── Selection helpers ──
  const toggleType = (key) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  const allSelected = selected.length === DATA_TYPES.length;
  const toggleAll = () =>
    setSelected(allSelected ? [] : DATA_TYPES.map((d) => d.key));

  const periodLabel =
    scope === "month" ? `${MONTHS[month - 1]} ${year}` : `Year ${year}`;

  // ── Actions ──
  const startDelete = () => {
    if (selected.length === 0) {
      toast.error("Select at least one data type");
      return;
    }
    const total = summary
      ? summary.summary
          .filter((s) => selected.includes(s.dataType))
          .reduce((a, b) => a + b.count, 0)
      : null;
    setConfirm({ total });
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API}/admin/data/delete`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ scope, month, year, dataTypes: selected }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Delete failed");
      toast.success(json.message);
      setConfirm(null);
      setSummary(null);
      setSelected([]);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const restore = async (id) => {
    setBusyId(id);
    try {
      const res = await fetch(`${API}/admin/data/trash/${id}/restore`, {
        method: "POST",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Restore failed");
      toast.success(json.message);
      fetchTrash();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const purgeOne = async (id) => {
    if (!window.confirm("Permanently delete this data? This cannot be undone."))
      return;
    setBusyId(id);
    try {
      const res = await fetch(`${API}/admin/data/trash/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Delete failed");
      toast.success(json.message);
      fetchTrash();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const emptyTrash = async () => {
    if (
      !window.confirm(
        "Permanently empty the entire trash? This cannot be undone.",
      )
    )
      return;
    try {
      const res = await fetch(`${API}/admin/data/trash`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      toast.success(json.message);
      fetchTrash();
    } catch (e) {
      toast.error(e.message);
    }
  };

  // ── Render guards ──
  if (!authChecked) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#113F67]" size={32} />
      </div>
    );
  }
  if (!allowed) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center px-4">
        <ShieldAlert className="text-red-500 mb-3" size={40} />
        <h2 className="text-lg font-semibold text-gray-800">Access denied</h2>
        <p className="text-gray-500 mt-1">
          Only admins can manage data settings.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[#113F67] p-3 text-white">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">
              Delete HRM data month-wise or for a full year. Deleted data goes
              to Trash and is permanently removed after 10 days.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setTab("delete")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "delete"
                ? "border-b-2 border-[#113F67] text-[#113F67]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Database size={16} /> Delete Data
          </button>
          <button
            onClick={() => setTab("trash")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === "trash"
                ? "border-b-2 border-[#113F67] text-[#113F67]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Trash2 size={16} /> Trash
            {trash.length > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                {trash.length}
              </span>
            )}
          </button>
        </div>

        {/* ─────────── DELETE DATA TAB ─────────── */}
        {tab === "delete" && (
          <div className="space-y-6">
            {/* Scope + period */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setScope("month");
                    setSummary(null);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                    scope === "month"
                      ? "bg-[#113F67] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Calendar size={16} /> Month wise
                </button>
                <button
                  onClick={() => {
                    setScope("year");
                    setSummary(null);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                    scope === "year"
                      ? "bg-[#113F67] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <CalendarDays size={16} /> Full year
                </button>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                {scope === "month" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Month
                    </label>
                    <select
                      value={month}
                      onChange={(e) => {
                        setMonth(Number(e.target.value));
                        setSummary(null);
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#113F67] focus:outline-none"
                    >
                      {MONTHS.map((m, i) => (
                        <option key={m} value={i + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => {
                      setYear(Number(e.target.value));
                      setSummary(null);
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#113F67] focus:outline-none"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={fetchSummary}
                  disabled={loadingSummary}
                  className="flex items-center gap-2 rounded-lg border border-[#113F67] px-4 py-2 text-sm font-medium text-[#113F67] hover:bg-[#113F67]/5 disabled:opacity-50"
                >
                  {loadingSummary ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  Preview counts
                </button>
              </div>
            </div>

            {/* Data type selection */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Data to delete{" "}
                  <span className="text-sm font-normal text-gray-400">
                    ({periodLabel})
                  </span>
                </h3>
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#113F67]"
                >
                  {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                  {allSelected ? "Unselect all" : "Select all"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {DATA_TYPES.map((dt) => {
                  const isSel = selected.includes(dt.key);
                  const count = summary?.summary?.find(
                    (s) => s.dataType === dt.key,
                  )?.count;
                  return (
                    <button
                      key={dt.key}
                      onClick={() => toggleType(dt.key)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                        isSel
                          ? "border-[#113F67] bg-[#113F67]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isSel ? (
                          <CheckSquare size={16} className="text-[#113F67]" />
                        ) : (
                          <Square size={16} className="text-gray-400" />
                        )}
                        <span className="font-medium text-gray-700">
                          {dt.label}
                        </span>
                      </span>
                      {typeof count === "number" && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            count > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500">
                  {selected.length} type(s) selected
                  {summary && (
                    <>
                      {" · "}
                      <span className="font-semibold text-gray-700">
                        {summary.summary
                          .filter((s) => selected.includes(s.dataType))
                          .reduce((a, b) => a + b.count, 0)}
                      </span>{" "}
                      record(s)
                    </>
                  )}
                </p>
                <button
                  onClick={startDelete}
                  disabled={selected.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={16} /> Delete {periodLabel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────── TRASH TAB ─────────── */}
        {tab === "trash" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Items are permanently removed 10 days after deletion.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={fetchTrash}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <RefreshCw size={14} /> Refresh
                </button>
                {trash.length > 0 && (
                  <button
                    onClick={emptyTrash}
                    className="flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Empty trash
                  </button>
                )}
              </div>
            </div>

            {loadingTrash ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="animate-spin text-[#113F67]" size={28} />
              </div>
            ) : trash.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center text-gray-400">
                <Trash2 size={36} className="mb-2" />
                <p>Trash is empty</p>
              </div>
            ) : (
              <div className="space-y-2">
                {trash.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {item.label}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {item.period}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                          {item.recordCount} record(s)
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {item.daysLeft} day(s) left
                        </span>
                        <span>
                          Deleted{" "}
                          {new Date(item.deletedAt).toLocaleDateString()}
                          {item.deletedBy?.name
                            ? ` by ${item.deletedBy.name}`
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => restore(item._id)}
                        disabled={busyId === item._id}
                        className="flex items-center gap-1.5 rounded-lg bg-[#113F67] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0d3252] disabled:opacity-50"
                      >
                        {busyId === item._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <RotateCcw size={14} />
                        )}
                        Restore
                      </button>
                      <button
                        onClick={() => purgeOne(item._id)}
                        disabled={busyId === item._id}
                        className="flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2.5 text-red-600">
                <AlertTriangle size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Confirm deletion
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              You are about to delete{" "}
              <span className="font-semibold">
                {selected.map((k) => DATA_TYPES.find((d) => d.key === k)?.label).join(", ")}
              </span>{" "}
              for <span className="font-semibold">{periodLabel}</span>.
              {confirm.total != null && (
                <>
                  {" "}
                  This affects{" "}
                  <span className="font-semibold text-red-600">
                    {confirm.total}
                  </span>{" "}
                  record(s).
                </>
              )}
            </p>
            <p className="mt-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
              Deleted data moves to Trash and can be restored within 10 days
              before it is permanently removed.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirm(null)}
                disabled={deleting}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
