"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Download,
  RefreshCw,
  Monitor,
  Search,
  ChevronDown,
  Loader2,
  Shield,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_HRM_API_URL;

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Mobile Banking", "Card"];
const DURATION_UNITS = [
  { value: "day", label: "Day(s)" },
  { value: "week", label: "Week(s)" },
  { value: "month", label: "Month(s)" },
  { value: "year", label: "Year(s)" },
];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken") || localStorage.getItem("token");
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  };
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString("en-BD", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount) {
  return `BDT ${Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDuration(num, unit) {
  if (!num || !unit) return "-";
  return `${num} ${unit}${num > 1 ? "s" : ""}`;
}

function emptyRow() {
  return {
    id: crypto.randomUUID(),
    softwareName: "",
    amount: "",
    date: "",
    paymentMethod: "",
    durationNumber: "",
    durationUnit: "month",
    note: "",
  };
}

const INP =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] focus:border-transparent";

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ====================== EDIT MODAL ======================
function EditModal({ open, onClose, subscription, onSaved }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && subscription) {
      setForm({
        softwareName: subscription.softwareName || "",
        amount: subscription.amount?.toString() || "",
        date: new Date(subscription.date).toISOString().split("T")[0],
        paymentMethod: subscription.paymentMethod || "",
        durationNumber: subscription.durationNumber?.toString() || "",
        durationUnit: subscription.durationUnit || "month",
        note: subscription.note || "",
      });
    }
  }, [open, subscription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.softwareName.trim() ||
      !form.amount ||
      !form.date ||
      !form.paymentMethod
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        `${API_URL}/update-software-subscriptions/${subscription._id}`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({
            softwareName: form.softwareName.trim(),
            date: form.date,
            amount: parseFloat(form.amount),
            paymentMethod: form.paymentMethod,
            durationNumber: form.durationNumber
              ? parseInt(form.durationNumber)
              : null,
            durationUnit: form.durationUnit,
            note: form.note,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Subscription updated");
        onSaved();
        onClose();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title="Edit Subscription">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Software Name *
          </label>
          <input
            className={INP}
            value={form.softwareName || ""}
            onChange={set("softwareName")}
            placeholder="e.g. Adobe, Figma, Slack"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (BDT) *
            </label>
            <input
              type="number"
              className={INP}
              value={form.amount || ""}
              onChange={set("amount")}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              className={INP}
              value={form.date || ""}
              max={getTodayDate()}
              onChange={set("date")}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method *
          </label>
          <select
            className={INP}
            value={form.paymentMethod || ""}
            onChange={set("paymentMethod")}
            required
          >
            <option value="">Select</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="number"
              className={INP}
              value={form.durationNumber || ""}
              onChange={set("durationNumber")}
              placeholder="e.g. 1"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              className={INP}
              value={form.durationUnit || "month"}
              onChange={set("durationUnit")}
            >
              {DURATION_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <input
            className={INP}
            value={form.note || ""}
            onChange={set("note")}
            placeholder="Optional"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#113F67] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0d3254] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ====================== MAIN PAGE ======================
export default function SubscriptionsPage() {
  const [rows, setRows] = useState([emptyRow()]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    if (selectedYear === "all") setSelectedMonth("all");
  }, [selectedYear]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/software-subscriptions`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSubscriptions(
          [...data.data].sort((a, b) => new Date(b.date) - new Date(a.date)),
        );
      } else {
        toast.error(data.message || "Failed to load");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const years = useMemo(
    () =>
      [
        ...new Set(subscriptions.map((s) => new Date(s.date).getFullYear())),
      ].sort((a, b) => b - a),
    [subscriptions],
  );

  const months = useMemo(() => {
    if (selectedYear === "all") return [];
    return [
      ...new Set(
        subscriptions
          .filter(
            (s) => new Date(s.date).getFullYear().toString() === selectedYear,
          )
          .map((s) => new Date(s.date).getMonth() + 1),
      ),
    ].sort((a, b) => a - b);
  }, [subscriptions, selectedYear]);

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const d = new Date(s.date);
      if (selectedYear !== "all" && d.getFullYear().toString() !== selectedYear)
        return false;
      if (
        selectedMonth !== "all" &&
        (d.getMonth() + 1).toString() !== selectedMonth
      )
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.softwareName.toLowerCase().includes(q) &&
          !s.paymentMethod?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [subscriptions, selectedYear, selectedMonth, search]);

  const total = useMemo(
    () => filtered.reduce((sum, s) => sum + s.amount, 0),
    [filtered],
  );

  // Row form helpers
  const updateRow = (id, field, value) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = rows.filter(
      (r) => r.softwareName.trim() && r.amount && r.date && r.paymentMethod,
    );
    if (!valid.length) {
      toast.error("Fill at least one complete entry");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/add-software-subscriptions`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(
          valid.map((r) => ({
            softwareName: r.softwareName.trim(),
            amount: parseFloat(r.amount),
            date: r.date,
            paymentMethod: r.paymentMethod,
            durationNumber: r.durationNumber
              ? parseInt(r.durationNumber)
              : null,
            durationUnit: r.durationUnit,
            note: r.note,
          })),
        ),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${data.data.length} subscription(s) saved`);
        setRows([emptyRow()]);
        fetchSubscriptions();
      } else {
        toast.error(data.message || "Save failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscription?")) return;
    try {
      const res = await fetch(
        `${API_URL}/delete-software-subscriptions/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted");
        fetchSubscriptions();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const generatePDF = () => {
    if (!filtered.length) {
      toast.error("No data to export");
      return;
    }
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 63, 103);
    doc.text("Software Subscriptions Report", pw / 2, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(
      `Total Records: ${filtered.length}  |  Total: BDT ${total.toFixed(2)}`,
      14,
      34,
    );

    autoTable(doc, {
      startY: 42,
      head: [
        ["Software", "Date", "Amount (BDT)", "Method", "Duration", "Note"],
      ],
      body: filtered.map((s) => [
        s.softwareName,
        formatDate(s.date),
        s.amount.toFixed(2),
        s.paymentMethod,
        formatDuration(s.durationNumber, s.durationUnit),
        s.note || "-",
      ]),
      headStyles: {
        fillColor: [17, 63, 103],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    doc.save(`subscriptions_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF downloaded");
  };

  const formTotal = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#113F67] rounded-lg flex items-center justify-center shrink-0">
            <Monitor size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Software Subscriptions
            </h1>
            <p className="text-xs text-gray-400">
              Track and manage software subscription expenses
            </p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
            <Shield size={11} />
            Admin Only
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 px-2 py-6 space-y-6">
        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Total Subscriptions",
                value: subscriptions.length,
                icon: Monitor,
                color: "bg-[#113F67]",
              },
              {
                label: "Unique Software",
                value: [...new Set(subscriptions.map((s) => s.softwareName))]
                  .length,
                icon: Search,
                color: "bg-indigo-500",
              },
              {
                label: "Total Spent",
                value: formatCurrency(
                  subscriptions.reduce((s, r) => s + r.amount, 0),
                ),
                icon: Download,
                color: "bg-emerald-500",
                wide: true,
              },
            ].map(({ label, value, icon: Icon, color, wide }) => (
              <div
                key={label}
                className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3 ${wide ? "col-span-1" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
                >
                  <Icon size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium truncate">
                    {label}
                  </p>
                  <p
                    className={`font-bold text-gray-800 ${wide ? "text-base" : "text-2xl"}`}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Plus size={16} className="text-[#113F67]" />
            <h2 className="font-semibold text-gray-800">Add Subscriptions</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            {/* Column headers (desktop) */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
              <div className="col-span-3">Software Name</div>
              <div className="col-span-2">Amount (BDT)</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Pay Method</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-1"></div>
            </div>

            {rows.map((row, idx) => (
              <div
                key={row.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start"
              >
                <div className="sm:col-span-3">
                  <input
                    className={INP}
                    placeholder="e.g. Adobe, Figma"
                    value={row.softwareName}
                    onChange={(e) =>
                      updateRow(row.id, "softwareName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    className={INP}
                    placeholder="Amount"
                    value={row.amount}
                    onChange={(e) =>
                      updateRow(row.id, "amount", e.target.value)
                    }
                    min="0"
                    step="0.01"
                    onWheel={(e) => e.currentTarget.blur()}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="date"
                    className={INP}
                    value={row.date}
                    max={getTodayDate()}
                    onChange={(e) => updateRow(row.id, "date", e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <select
                    className={INP}
                    value={row.paymentMethod}
                    onChange={(e) =>
                      updateRow(row.id, "paymentMethod", e.target.value)
                    }
                    required
                  >
                    <option value="">Method</option>
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 flex gap-1">
                  <input
                    type="number"
                    className={INP}
                    placeholder="No."
                    value={row.durationNumber}
                    onChange={(e) =>
                      updateRow(row.id, "durationNumber", e.target.value)
                    }
                    min="1"
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                  <select
                    className={INP}
                    value={row.durationUnit}
                    onChange={(e) =>
                      updateRow(row.id, "durationUnit", e.target.value)
                    }
                  >
                    {DURATION_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-1 flex items-center">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 text-sm text-[#113F67] border border-dashed border-[#113F67] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus size={14} />
                Add Row
              </button>
              {formTotal > 0 && (
                <span className="text-sm font-semibold text-gray-600 sm:ml-auto">
                  Form Total: {formatCurrency(formTotal)}
                </span>
              )}
              <button
                type="submit"
                disabled={saving}
                className="sm:ml-auto bg-[#113F67] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0d3254] disabled:opacity-60 flex items-center gap-2 transition-colors"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Saving..." : "Save Subscriptions"}
              </button>
            </div>
          </form>
        </div>

        {/* Records */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
                  placeholder="Search software or payment method..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Year filter */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] bg-white"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedMonth("all");
                }}
              >
                <option value="all">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Month filter */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                disabled={selectedYear === "all"}
              >
                <option value="all">All Months</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {MONTH_NAMES[m - 1]}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchSubscriptions}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw size={13} />
                Refresh
              </button>

              {filtered.length > 0 && (
                <button
                  onClick={generatePDF}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#113F67] text-white rounded-lg text-sm hover:bg-[#0d3254]"
                >
                  <Download size={13} />
                  PDF
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="py-16 text-center">
              <Monitor size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">
                No subscriptions yet. Add one above.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Search size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">No results match your filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
                      <th className="px-5 py-3 text-left font-medium">
                        Software
                      </th>
                      <th className="px-5 py-3 text-left font-medium">Date</th>
                      <th className="px-5 py-3 text-left font-medium">
                        Amount
                      </th>
                      <th className="px-5 py-3 text-left font-medium">
                        Method
                      </th>
                      <th className="px-5 py-3 text-left font-medium">
                        Duration
                      </th>
                      <th className="px-5 py-3 text-left font-medium">Note</th>
                      <th className="px-5 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((s) => (
                      <tr
                        key={s._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#113F67]/10 rounded-lg flex items-center justify-center shrink-0">
                              <Monitor size={14} className="text-[#113F67]" />
                            </div>
                            <span className="font-medium text-gray-800">
                              {s.softwareName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">
                          {formatDate(s.date)}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-gray-800">
                          {formatCurrency(s.amount)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                            {s.paymentMethod}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">
                          {formatDuration(s.durationNumber, s.durationUnit)}
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 max-w-35 truncate">
                          {s.note || "-"}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditTarget(s)}
                              className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(s._id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer summary */}
              <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-400">Showing</p>
                    <p className="font-semibold text-gray-800">
                      {filtered.length} of {subscriptions.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Unique Software</p>
                    <p className="font-semibold text-gray-800">
                      {[...new Set(filtered.map((s) => s.softwareName))].length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {selectedYear !== "all" || selectedMonth !== "all"
                      ? "Filtered Total"
                      : "Total"}
                  </p>
                  <p className="text-lg font-bold text-[#113F67]">
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <EditModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        subscription={editTarget}
        onSaved={fetchSubscriptions}
      />
    </div>
  );
}
