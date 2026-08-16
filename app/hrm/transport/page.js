"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  X,
  Download,
  RefreshCw,
  Search,
  Loader2,
  Calendar,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_HRM_API_URL;

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Mobile Banking", "Card"];
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
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("moderatorToken") ||
    localStorage.getItem("token")
  );
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
  return new Date(str).toLocaleDateString("en-BD", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount) {
  return `BDT ${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function emptyRow() {
  return {
    id: crypto.randomUUID(),
    transportName: "",
    cost: "",
    date: "",
    paymentMethod: "",
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
function EditModal({ open, onClose, record, onSaved }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && record) {
      setForm({
        transportName: record.transportName || "",
        cost: record.cost?.toString() || "",
        date: new Date(record.date).toISOString().split("T")[0],
        paymentMethod: record.paymentMethod || "",
        note: record.note || "",
      });
    }
  }, [open, record]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.transportName.trim() ||
      !form.cost ||
      !form.date ||
      !form.paymentMethod
    ) {
      toast.error("Fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        `${API_URL}/update-transport-expenses/${record._id}`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({
            transportName: form.transportName.trim(),
            cost: parseFloat(form.cost),
            date: form.date,
            paymentMethod: form.paymentMethod,
            note: form.note,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Updated successfully");
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

  return (
    <Modal open={open} onClose={onClose} title="Edit Transport Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transport Name *
          </label>
          <input
            className={INP}
            value={form.transportName || ""}
            onChange={set("transportName")}
            placeholder="e.g. Bus, Uber, Fuel"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost (BDT) *
            </label>
            <input
              type="number"
              className={INP}
              value={form.cost || ""}
              onChange={set("cost")}
              placeholder="0.00"
              min="0"
              step="0.01"
              onWheel={(e) => e.currentTarget.blur()}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note (optional)
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
export default function TransportPage() {
  const [rows, setRows] = useState([emptyRow()]);
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTransports();
  }, []);
  useEffect(() => {
    if (filterYear === "all") setFilterMonth("all");
  }, [filterYear]);

  const fetchTransports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/transport-expenses`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setTransports(
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

  // Stats
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const stats = useMemo(() => {
    const total = transports.reduce((s, t) => s + t.cost, 0);
    const monthlySpend = transports
      .filter((t) => {
        const d = new Date(t.date);
        return (
          d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth
        );
      })
      .reduce((s, t) => s + t.cost, 0);
    return { total, monthlySpend, count: transports.length };
  }, [transports, currentMonth, currentYear]);

  const years = useMemo(
    () =>
      [...new Set(transports.map((t) => new Date(t.date).getFullYear()))].sort(
        (a, b) => b - a,
      ),
    [transports],
  );

  const months = useMemo(() => {
    if (filterYear === "all") return [];
    return [
      ...new Set(
        transports
          .filter(
            (t) => new Date(t.date).getFullYear().toString() === filterYear,
          )
          .map((t) => new Date(t.date).getMonth() + 1),
      ),
    ].sort((a, b) => a - b);
  }, [transports, filterYear]);

  const filtered = useMemo(() => {
    return transports.filter((t) => {
      const d = new Date(t.date);
      if (filterYear !== "all" && d.getFullYear().toString() !== filterYear)
        return false;
      if (
        filterMonth !== "all" &&
        (d.getMonth() + 1).toString() !== filterMonth
      )
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.transportName?.toLowerCase().includes(q) &&
          !t.paymentMethod?.toLowerCase().includes(q) &&
          !t.note?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [transports, filterYear, filterMonth, search]);

  const filteredTotal = useMemo(
    () => filtered.reduce((s, t) => s + t.cost, 0),
    [filtered],
  );

  // Row helpers
  const updateRow = (id, field, value) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = rows.filter(
      (r) => r.transportName.trim() && r.cost && r.date && r.paymentMethod,
    );
    if (!valid.length) {
      toast.error("Fill at least one complete entry");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/create-transport-expenses`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(
          valid.map((r) => ({
            transportName: r.transportName.trim(),
            cost: parseFloat(r.cost),
            date: r.date,
            paymentMethod: r.paymentMethod,
            note: r.note,
          })),
        ),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${data.data.length} expense(s) saved`);
        setRows([emptyRow()]);
        fetchTransports();
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
    if (!window.confirm("Delete this transport expense?")) return;
    try {
      const res = await fetch(`${API_URL}/delete-transport-expenses/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted");
        fetchTransports();
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
    doc.text("Transport Expenses Report", pw / 2, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(
      `Records: ${filtered.length}  |  Total: ${formatCurrency(filteredTotal)}`,
      14,
      34,
    );
    autoTable(doc, {
      startY: 42,
      head: [["#", "Transport", "Date", "Cost (BDT)", "Method", "Note"]],
      body: filtered.map((t, i) => [
        i + 1,
        t.transportName,
        formatDate(t.date),
        t.cost.toFixed(2),
        t.paymentMethod,
        t.note || "-",
      ]),
      headStyles: {
        fillColor: [17, 63, 103],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    doc.save(`transport_expenses_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF downloaded");
  };

  const formTotal = rows.reduce((s, r) => s + (parseFloat(r.cost) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#113F67] rounded-lg flex items-center justify-center shrink-0">
            <Car size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Transport Expenses
            </h1>
            <p className="text-xs text-gray-400">Track transportation costs</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 px-2 py-6 space-y-6">
        {/* Stat Cards */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Total Records",
                value: stats.count,
                display: "count",
                color: "bg-[#113F67]",
                Icon: Car,
              },
              {
                label: `${MONTH_NAMES[currentMonth - 1]} Spend`,
                value: stats.monthlySpend,
                display: "currency",
                color: "bg-emerald-500",
                Icon: Calendar,
              },
              {
                label: "Total Spent",
                value: stats.total,
                display: "currency",
                color: "bg-indigo-500",
                Icon: Car,
              },
            ].map(({ label, value, display, color, Icon }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3"
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
                  {display === "count" ? (
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                  ) : (
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {formatCurrency(value)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Plus size={16} className="text-[#113F67]" />
            <h2 className="font-semibold text-gray-800">
              Add Transport Expenses
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            {/* Column headers (desktop) */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
              <div className="col-span-3">Transport Name</div>
              <div className="col-span-2">Cost (BDT)</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Pay Method</div>
              <div className="col-span-2">Note</div>
              <div className="col-span-1"></div>
            </div>

            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start"
              >
                <div className="sm:col-span-3">
                  <input
                    className={INP}
                    placeholder="e.g. Bus, Uber, Fuel"
                    value={row.transportName}
                    onChange={(e) =>
                      updateRow(row.id, "transportName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    className={INP}
                    placeholder="Amount"
                    value={row.cost}
                    onChange={(e) => updateRow(row.id, "cost", e.target.value)}
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
                <div className="sm:col-span-2">
                  <input
                    className={INP}
                    placeholder="Note (optional)"
                    value={row.note}
                    onChange={(e) => updateRow(row.id, "note", e.target.value)}
                  />
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
                {saving ? "Saving..." : "Save Expenses"}
              </button>
            </div>
          </form>
        </div>

        {/* Records */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
                  placeholder="Search transport, method, note..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] bg-white"
                value={filterYear}
                onChange={(e) => {
                  setFilterYear(e.target.value);
                  setFilterMonth("all");
                }}
              >
                <option value="all">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                disabled={filterYear === "all"}
              >
                <option value="all">All Months</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {MONTH_NAMES[m - 1]}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchTransports}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                <RefreshCw size={13} />
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
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-gray-100 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : transports.length === 0 ? (
            <div className="py-16 text-center">
              <Car size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">
                No transport expenses yet. Add one above.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Search size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">No records match your filters.</p>
              <button
                onClick={() => {
                  setFilterYear("all");
                  setFilterMonth("all");
                  setSearch("");
                }}
                className="mt-3 text-sm text-[#113F67] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
                      <th className="px-5 py-3 text-left font-medium">#</th>
                      <th className="px-5 py-3 text-left font-medium">
                        Transport
                      </th>
                      <th className="px-5 py-3 text-left font-medium">Date</th>
                      <th className="px-5 py-3 text-left font-medium">Cost</th>
                      <th className="px-5 py-3 text-left font-medium">
                        Method
                      </th>
                      <th className="px-5 py-3 text-left font-medium">Note</th>
                      <th className="px-5 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((t, idx) => {
                      const d = new Date(t.date);
                      const isCurrentMonth =
                        d.getFullYear() === currentYear &&
                        d.getMonth() + 1 === currentMonth;
                      return (
                        <tr
                          key={t._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-5 py-3.5 text-gray-400 text-xs">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-[#113F67]/10 rounded-lg flex items-center justify-center shrink-0">
                                <Car size={13} className="text-[#113F67]" />
                              </div>
                              <span className="font-medium text-gray-800">
                                {t.transportName}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-gray-700">
                              {formatDate(t.date)}
                            </div>
                            {isCurrentMonth && (
                              <span className="text-xs text-emerald-600 font-medium">
                                This month
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-gray-800">
                            {formatCurrency(t.cost)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                              {t.paymentMethod}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 max-w-32 truncate">
                            {t.note || "-"}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditTarget(t)}
                                className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(t._id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-600">
                    {filtered.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-600">
                    {transports.length}
                  </span>{" "}
                  records
                </p>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {filterYear !== "all" || filterMonth !== "all"
                      ? "Filtered Total"
                      : "Total"}
                  </p>
                  <p className="text-lg font-bold text-[#113F67]">
                    {formatCurrency(filteredTotal)}
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
        record={editTarget}
        onSaved={fetchTransports}
      />
    </div>
  );
}
