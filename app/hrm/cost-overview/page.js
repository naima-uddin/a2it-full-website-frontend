"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LayoutDashboard,
  Download,
  RefreshCw,
  Loader2,
  Building2,
  FileText,
  Briefcase,
  Cloud,
  Utensils,
  Car,
  TrendingUp,
  Wallet,
  Calendar,
  ChevronDown,
  Users,
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
  return { Authorization: `Bearer ${getToken()}` };
}

function formatCurrency(amount) {
  return `BDT ${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatShort(amount) {
  const n = Number(amount || 0);
  if (n >= 1_000_000) return `BDT ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `BDT ${(n / 1_000).toFixed(1)}K`;
  return `BDT ${n.toFixed(0)}`;
}

// Each category config: name, icon, color, endpoint, dateField, amountField
const CATEGORIES = [
  {
    key: "officeRent",
    name: "Office Rent",
    icon: Building2,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    endpoint: "/office-rents",
    listKey: "data",
    dateField: (item) =>
      item.month
        ? `${item.year}-${String(item.month).padStart(2, "0")}-01`
        : item.date,
    amountField: (item) => item.amount || item.totalAmount || item.rent || 0,
  },
  {
    key: "utilityBills",
    name: "Utility Bills",
    icon: FileText,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    endpoint: "/bills",
    listKey: "data",
    dateField: (item) =>
      item.date ||
      (item.month
        ? `${item.year}-${String(item.month).padStart(2, "0")}-01`
        : null),
    amountField: (item) => item.amount || item.totalAmount || 0,
  },
  {
    key: "officeSupplies",
    name: "Office Supplies",
    icon: Briefcase,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    endpoint: "/office-supplies",
    listKey: "data",
    dateField: (item) => item.date || item.purchaseDate,
    amountField: (item) => item.price || item.totalAmount || item.amount || 0,
  },
  {
    key: "softwareSubscriptions",
    name: "Software Subscriptions",
    icon: Cloud,
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
    endpoint: "/software-subscriptions",
    listKey: "data",
    dateField: (item) => item.date || item.startDate,
    amountField: (item) => item.amount || item.cost || 0,
  },
  {
    key: "foodCost",
    name: "Food Cost",
    icon: Utensils,
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    endpoint: "/food-costs",
    listKey: "data",
    dateField: (item) => item.date,
    amountField: (item) => item.cost || item.amount || 0,
  },
  {
    key: "transport",
    name: "Transport",
    icon: Car,
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    endpoint: "/transport-expenses",
    listKey: "data",
    dateField: (item) => item.date,
    amountField: (item) => item.cost || item.amount || 0,
  },
  {
    key: "salary",
    name: "Employee Salaries",
    icon: Users,
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    endpoint: "/admin/getAll-user",
    listKey: "users",
    itemFilter: (item) => item.role === "employee" && !item.isDeleted,
    // Salary is a monthly recurring cost — date each record to current month
    // so filters work naturally (shows when current month/year selected)
    dateField: () => {
      const n = new Date();
      return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-01`;
    },
    amountField: (item) => item.salary || 0,
  },
];

function computeTotals(items, cat, filterYear, filterMonth) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let total = 0;
  let monthly = 0;
  let filtered = 0;

  items.forEach((item) => {
    const rawDate = cat.dateField(item);
    const amount = cat.amountField(item);
    total += amount;

    const d = rawDate ? new Date(rawDate) : null;
    if (d && !isNaN(d)) {
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      if (y === currentYear && m === currentMonth) monthly += amount;

      const matchYear = filterYear === "all" || y.toString() === filterYear;
      const matchMonth = filterMonth === "all" || m.toString() === filterMonth;
      if (matchYear && matchMonth) filtered += amount;
    } else {
      // no date — count in totals only
      if (filterYear === "all" && filterMonth === "all") filtered += amount;
    }
  });

  return { total, monthly, filtered };
}

export default function CostOverviewPage() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [filterMonth, setFilterMonth] = useState(
    (new Date().getMonth() + 1).toString(),
  );

  useEffect(() => {
    fetchAll();
  }, []);
  useEffect(() => {
    if (filterYear === "all") setFilterMonth("all");
  }, [filterYear]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        CATEGORIES.map((cat) =>
          fetch(`${API_URL}${cat.endpoint}`, { headers: authHeaders() })
            .then((r) => r.json())
            .then((json) => ({
              key: cat.key,
              items:
                json[cat.listKey] ||
                json.bills ||
                json.supplies ||
                json.subscriptions ||
                json.users ||
                [],
            })),
        ),
      );
      const map = {};
      results.forEach((r) => {
        if (r.status === "fulfilled") map[r.value.key] = r.value.items;
      });
      setData(map);
    } catch {
      toast.error("Failed to load some data");
    } finally {
      setLoading(false);
    }
  };

  // Collect all years across all categories
  const allYears = useMemo(() => {
    const yearSet = new Set();
    CATEGORIES.forEach((cat) => {
      (data[cat.key] || []).forEach((item) => {
        const raw = cat.dateField(item);
        if (raw) {
          const y = new Date(raw).getFullYear();
          if (!isNaN(y)) yearSet.add(y);
        }
      });
    });
    return [...yearSet].sort((a, b) => b - a);
  }, [data]);

  const rows = useMemo(
    () =>
      CATEGORIES.map((cat) => {
        const rawItems = data[cat.key] || [];
        const items = cat.itemFilter
          ? rawItems.filter(cat.itemFilter)
          : rawItems;
        const { total, monthly, filtered } = computeTotals(
          items,
          cat,
          filterYear,
          filterMonth,
        );
        return { cat, total, monthly, filtered, count: items.length };
      }),
    [data, filterYear, filterMonth],
  );

  const grandTotal = rows.reduce((s, r) => s + r.total, 0);
  const grandMonthly = rows.reduce((s, r) => s + r.monthly, 0);
  const grandFiltered = rows.reduce((s, r) => s + r.filtered, 0);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const periodLabel = useMemo(() => {
    if (filterYear === "all") return "All Time";
    if (filterMonth === "all") return filterYear;
    return `${MONTH_NAMES[parseInt(filterMonth) - 1]} ${filterYear}`;
  }, [filterYear, filterMonth]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 63, 103);
    doc.text("Cost Overview Report", pw / 2, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(
      `Period: ${periodLabel}   |   Generated: ${new Date().toLocaleDateString()}`,
      14,
      28,
    );

    autoTable(doc, {
      startY: 36,
      head: [
        [
          "Category",
          "Records",
          `${periodLabel} Spend (BDT)`,
          `${MONTH_NAMES[currentMonth - 1]} ${currentYear} (BDT)`,
          "All Time Total (BDT)",
        ],
      ],
      body: [
        ...rows.map((r) => [
          r.cat.name,
          r.count,
          r.filtered.toFixed(2),
          r.monthly.toFixed(2),
          r.total.toFixed(2),
        ]),
        ["", "", "", "", ""],
        [
          "GRAND TOTAL",
          rows.reduce((s, r) => s + r.count, 0),
          grandFiltered.toFixed(2),
          grandMonthly.toFixed(2),
          grandTotal.toFixed(2),
        ],
      ],
      headStyles: {
        fillColor: [17, 63, 103],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      styles: { cellPadding: 3 },
      didParseCell: (hookData) => {
        if (hookData.row.index === rows.length + 1) {
          hookData.cell.styles.fontStyle = "bold";
          hookData.cell.styles.fillColor = [240, 245, 255];
        }
      },
    });

    doc.save(`cost_overview_${periodLabel.replace(/\s/g, "_")}.pdf`);
    toast.success("PDF downloaded");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-linear-to-br from-[#113F67] to-[#1a5c96] rounded-xl flex items-center justify-center shrink-0 shadow-md">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Cost Overview
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Total expenditure across all categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAll}
              className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            {!loading && (
              <button
                onClick={generatePDF}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-linear-to-r from-[#113F67] to-[#1a5c96] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-900/20 transition-all"
              >
                <Download size={14} />
                Export PDF
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-6 space-y-5">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm px-5 py-3.5 flex flex-wrap gap-3 items-center">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Period
          </span>
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <select
              className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#113F67]/30 bg-gray-50 text-gray-700 cursor-pointer"
              value={filterYear}
              onChange={(e) => {
                setFilterYear(e.target.value);
                setFilterMonth("all");
              }}
            >
              <option value="all">All Years</option>
              {allYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              className="px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#113F67]/30 bg-gray-50 text-gray-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              disabled={filterYear === "all"}
            >
              <option value="all">All Months</option>
              {MONTH_NAMES.map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            {(filterYear !== new Date().getFullYear().toString() ||
              filterMonth !== (new Date().getMonth() + 1).toString()) && (
              <button
                onClick={() => {
                  setFilterYear(currentYear.toString());
                  setFilterMonth(currentMonth.toString());
                }}
                className="text-xs text-[#113F67] font-semibold hover:underline px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 bg-[#113F67]/5 border border-[#113F67]/10 px-4 py-2 rounded-full">
            <Calendar size={13} className="text-[#113F67]" />
            <span className="text-sm font-semibold text-[#113F67]">
              {periodLabel}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 bg-white rounded-2xl border border-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-linear-to-br from-[#113F67] to-[#1a5c96] rounded-2xl p-5 shadow-lg shadow-blue-900/15">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">
                    {periodLabel}
                  </p>
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                    <Wallet size={15} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatShort(grandFiltered)}
                </p>
                <p className="text-blue-200 text-xs mt-1">
                  Selected period total
                </p>
              </div>
              <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 shadow-lg shadow-emerald-900/15">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">
                    This Month
                  </p>
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                    <Calendar size={15} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatShort(grandMonthly)}
                </p>
                <p className="text-emerald-100 text-xs mt-1">
                  {MONTH_NAMES[currentMonth - 1]} {currentYear}
                </p>
              </div>
              <div className="bg-linear-to-br from-violet-500 to-purple-700 rounded-2xl p-5 shadow-lg shadow-purple-900/15">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-violet-100 text-xs font-semibold uppercase tracking-wider">
                    All Time
                  </p>
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                    <TrendingUp size={15} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatShort(grandTotal)}
                </p>
                <p className="text-violet-100 text-xs mt-1">Cumulative total</p>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">
                    Breakdown by Category
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {rows.length} categories ·{" "}
                    {rows.reduce((s, r) => s + r.count, 0)} records
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {periodLabel}
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {MONTH_NAMES[currentMonth - 1]} {currentYear}
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        All Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.map(({ cat, total, monthly, filtered, count }) => {
                      const Icon = cat.icon;
                      return (
                        <tr
                          key={cat.key}
                          className="hover:bg-gray-50/60 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 ${cat.color} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}
                              >
                                <Icon size={15} className="text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                  {cat.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {count} record{count !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-gray-900">
                              {formatCurrency(filtered)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-gray-600 font-medium">
                              {formatCurrency(monthly)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-gray-500">
                              {formatCurrency(total)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-linear-to-r from-[#113F67]/8 to-[#113F67]/4 border-t-2 border-[#113F67]/15">
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#113F67] text-sm">
                          Grand Total
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-[#113F67] text-base">
                          {formatCurrency(grandFiltered)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-[#113F67]">
                          {formatCurrency(grandMonthly)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-[#113F67]">
                          {formatCurrency(grandTotal)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rows.map(({ cat, total, monthly, filtered, count }) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.key}
                    className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        <Icon size={17} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {cat.name}
                        </p>
                        <p className={`text-xs font-medium ${cat.textColor}`}>
                          {count} record{count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div
                        className={`${cat.lightColor} rounded-xl px-3 py-2.5`}
                      >
                        <p className="text-xs text-gray-500 mb-0.5">
                          {periodLabel}
                        </p>
                        <p className={`text-base font-bold ${cat.textColor}`}>
                          {formatCurrency(filtered)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <div>
                          <p className="text-xs text-gray-400">This Month</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {formatCurrency(monthly)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">All Time</p>
                          <p className="text-sm font-medium text-gray-500">
                            {formatCurrency(total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
