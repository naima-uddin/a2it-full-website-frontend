"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  X,
  Download,
  RefreshCw,
  Search,
  Loader2,
  AlertTriangle,
  Calendar,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_HRM_API_URL;

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
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
function EditModal({ open, onClose, record, foodCosts, onSaved }) {
  const [form, setForm] = useState({ date: "", cost: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [dupWarning, setDupWarning] = useState(false);

  useEffect(() => {
    if (open && record) {
      setForm({
        date: new Date(record.date).toISOString().split("T")[0],
        cost: record.cost?.toString() || "",
        note: record.note || "",
      });
      setDupWarning(false);
    }
  }, [open, record]);

  const handleDateChange = (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, date: val }));
    const dup = foodCosts.some(
      (c) =>
        c._id !== record._id &&
        new Date(c.date).toISOString().split("T")[0] === val,
    );
    setDupWarning(dup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dupWarning) {
      toast.error("A record for this date already exists");
      return;
    }
    if (!form.cost || parseFloat(form.cost) <= 0) {
      toast.error("Enter a valid cost");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/update-food-costs/${record._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          date: form.date,
          cost: parseFloat(form.cost),
          note: form.note,
        }),
      });
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
    <Modal open={open} onClose={onClose} title="Edit Food Cost">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            className={`${INP} ${dupWarning ? "border-red-400 bg-red-50" : ""}`}
            value={form.date}
            max={getTodayDate()}
            onChange={handleDateChange}
            required
          />
          {dupWarning && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle size={11} /> A record for this date already exists
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost (BDT) *
          </label>
          <input
            type="number"
            className={INP}
            value={form.cost}
            onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
            placeholder="0.00"
            min="0"
            step="0.01"
            onWheel={(e) => e.currentTarget.blur()}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note (optional)
          </label>
          <textarea
            className={INP}
            rows={3}
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="e.g. Breakfast, Lunch, items purchased..."
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
            disabled={saving || dupWarning}
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
export default function FoodCostPage() {
  const [foodCosts, setFoodCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [search, setSearch] = useState("");

  // Add form
  const [form, setForm] = useState({ date: "", cost: "", note: "" });
  const [dupWarning, setDupWarning] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    fetchFoodCosts();
  }, []);
  useEffect(() => {
    if (filterYear === "all") setFilterMonth("all");
  }, [filterYear]);

  const fetchFoodCosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/food-costs`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setFoodCosts(
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

  // Derived stats
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const stats = useMemo(() => {
    const total = foodCosts.reduce((s, c) => s + c.cost, 0);
    const monthlySpend = foodCosts
      .filter((c) => {
        const d = new Date(c.date);
        return (
          d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth
        );
      })
      .reduce((s, c) => s + c.cost, 0);
    return { total, monthlySpend, count: foodCosts.length };
  }, [foodCosts, currentMonth, currentYear]);

  const years = useMemo(
    () =>
      [...new Set(foodCosts.map((c) => new Date(c.date).getFullYear()))].sort(
        (a, b) => b - a,
      ),
    [foodCosts],
  );

  const months = useMemo(() => {
    if (filterYear === "all") return [];
    return [
      ...new Set(
        foodCosts
          .filter(
            (c) => new Date(c.date).getFullYear().toString() === filterYear,
          )
          .map((c) => new Date(c.date).getMonth() + 1),
      ),
    ].sort((a, b) => a - b);
  }, [foodCosts, filterYear]);

  const filtered = useMemo(() => {
    return foodCosts.filter((c) => {
      const d = new Date(c.date);
      if (filterYear !== "all" && d.getFullYear().toString() !== filterYear)
        return false;
      if (
        filterMonth !== "all" &&
        (d.getMonth() + 1).toString() !== filterMonth
      )
        return false;
      if (
        search &&
        !c.note?.toLowerCase().includes(search.toLowerCase()) &&
        !formatDate(c.date).toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [foodCosts, filterYear, filterMonth, search]);

  const filteredTotal = useMemo(
    () => filtered.reduce((s, c) => s + c.cost, 0),
    [filtered],
  );

  // Duplicate check for add form
  const handleDateChange = (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, date: val }));
    const dup = foodCosts.some(
      (c) => new Date(c.date).toISOString().split("T")[0] === val,
    );
    setDupWarning(dup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dupWarning) {
      toast.error("A record for this date already exists");
      return;
    }
    if (!form.cost || parseFloat(form.cost) <= 0) {
      toast.error("Enter a valid cost");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/add-food-costs`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          date: form.date,
          cost: parseFloat(form.cost),
          note: form.note,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Food cost saved");
        setForm({ date: "", cost: "", note: "" });
        setDupWarning(false);
        fetchFoodCosts();
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
    if (!window.confirm("Delete this food cost record?")) return;
    try {
      const res = await fetch(`${API_URL}/delete-food-costs/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted");
        fetchFoodCosts();
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
    doc.text("Food Cost Report", pw / 2, 18, { align: "center" });
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
      head: [["#", "Date", "Cost (BDT)", "Note"]],
      body: filtered.map((c, i) => [
        i + 1,
        formatDate(c.date),
        c.cost.toFixed(2),
        c.note || "-",
      ]),
      headStyles: {
        fillColor: [17, 63, 103],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    doc.save(`food_cost_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF downloaded");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#113F67] rounded-lg flex items-center justify-center shrink-0">
            <UtensilsCrossed size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Food Cost</h1>
            <p className="text-xs text-gray-400">Track daily food expenses</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 px-2 py-6 space-y-5">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Total Records",
              value: stats.count,
              display: "count",
              color: "bg-[#113F67]",
              Icon: Calendar,
            },
            {
              label: `${MONTH_NAMES[currentMonth - 1]} Spend`,
              value: stats.monthlySpend,
              display: "currency",
              color: "bg-emerald-500",
              Icon: UtensilsCrossed,
            },
            {
              label: "Total Spent",
              value: stats.total,
              display: "currency",
              color: "bg-indigo-500",
              Icon: UtensilsCrossed,
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
                {loading ? (
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1" />
                ) : display === "count" ? (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Add Form */}
          <div
            ref={formRef}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1"
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Plus size={16} className="text-[#113F67]" />
              <h2 className="font-semibold text-gray-800">Add Food Cost</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  className={`${INP} ${dupWarning ? "border-red-400 bg-red-50" : ""}`}
                  value={form.date}
                  max={getTodayDate()}
                  onChange={handleDateChange}
                  required
                />
                {dupWarning && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
                    <AlertTriangle size={11} className="shrink-0" />A record for
                    this date already exists. Edit the existing one.
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  One record per day only
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (BDT) *
                </label>
                <input
                  type="number"
                  className={INP}
                  value={form.cost}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cost: e.target.value }))
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (optional)
                </label>
                <textarea
                  className={INP}
                  rows={3}
                  value={form.note}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, note: e.target.value }))
                  }
                  placeholder="e.g. Breakfast, Lunch, items purchased..."
                />
              </div>
              <button
                type="submit"
                disabled={saving || dupWarning}
                className="w-full bg-[#113F67] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#0d3254] disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Saving..." : "Save Food Cost"}
              </button>
            </form>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-2">
            {/* Toolbar */}
            <div className="px-5 py-4 border-b border-gray-100 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
                    placeholder="Search by note or date..."
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
                  onClick={fetchFoodCosts}
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

            {/* Table */}
            {loading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-gray-100 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : foodCosts.length === 0 ? (
              <div className="py-16 text-center">
                <UtensilsCrossed
                  size={36}
                  className="mx-auto text-gray-300 mb-3"
                />
                <p className="text-gray-400">
                  No food cost records yet. Add one.
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
                          Date
                        </th>
                        <th className="px-5 py-3 text-left font-medium">
                          Cost
                        </th>
                        <th className="px-5 py-3 text-left font-medium">
                          Note
                        </th>
                        <th className="px-5 py-3 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map((c, idx) => {
                        const d = new Date(c.date);
                        const isCurrentMonth =
                          d.getFullYear() === currentYear &&
                          d.getMonth() + 1 === currentMonth;
                        return (
                          <tr
                            key={c._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-5 py-3.5 text-gray-400 text-xs">
                              {idx + 1}
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="font-medium text-gray-800">
                                {formatDate(c.date)}
                              </div>
                              {isCurrentMonth && (
                                <span className="text-xs text-emerald-600 font-medium">
                                  This month
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-gray-800">
                              {formatCurrency(c.cost)}
                            </td>
                            <td className="px-5 py-3.5 text-gray-400 max-w-40 truncate">
                              {c.note || "-"}
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setEditTarget(c)}
                                  className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(c._id)}
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

                {/* Footer summary */}
                <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <p className="text-sm text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-gray-600">
                      {filtered.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-600">
                      {foodCosts.length}
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
      </div>

      <EditModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        record={editTarget}
        foodCosts={foodCosts}
        onSaved={fetchFoodCosts}
      />
    </div>
  );
}
