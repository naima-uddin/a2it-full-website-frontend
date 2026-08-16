"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  ChevronDown,
  CalendarDays,
  Globe,
  Building2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Star,
  Download,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_HRM_API_URL;

const MONTHS = [
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
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("employeeToken") ||
    localStorage.getItem("token")
  );
}

function getRole() {
  if (typeof window === "undefined") return null;
  try {
    const ad = localStorage.getItem("adminData");
    if (ad) return JSON.parse(ad).role;
    const ed = localStorage.getItem("employeeData");
    if (ed) return JSON.parse(ed).role;
  } catch (_) {}
  return null;
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

const INP =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] focus:border-transparent";
const SEL =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] focus:border-transparent bg-white";

function typeBadge(type) {
  if (type === "GOVT" || type === "Govt Holiday")
    return "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200";
  return "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-700 border border-cyan-200";
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

function HolidayForm({
  form,
  setForm,
  onSubmit,
  loading,
  submitLabel,
  showModeToggle = false,
}) {
  const isRange = form.mode === "range";

  const dayCount = React.useMemo(() => {
    if (!isRange || !form.fromDate || !form.toDate) return 0;
    const diff = new Date(form.toDate) - new Date(form.fromDate);
    return diff >= 0 ? Math.floor(diff / 86400000) + 1 : 0;
  }, [isRange, form.fromDate, form.toDate]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {showModeToggle && (
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, mode: "single" }))}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              !isRange
                ? "bg-[#113F67] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Single Date
          </button>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, mode: "range" }))}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              isRange
                ? "bg-[#113F67] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Date Range
          </button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Holiday Title
        </label>
        <input
          className={INP}
          placeholder="e.g. Eid ul-Fitr"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
      </div>

      {isRange ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                className={INP}
                value={form.fromDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fromDate: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                className={INP}
                value={form.toDate}
                min={form.fromDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, toDate: e.target.value }))
                }
                required
              />
            </div>
          </div>
          {dayCount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 font-medium">
              {dayCount} day{dayCount > 1 ? "s" : ""} will be added as separate
              holiday entries
            </div>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            className={INP}
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          className={SEL}
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="GOVT">Government Holiday</option>
          <option value="COMPANY">Company Holiday</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#113F67] text-white py-2 rounded-lg font-medium hover:bg-[#0d3254] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {isRange && dayCount > 0 ? `Add ${dayCount} Days` : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default function HolidayPage() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedForce, setSeedForce] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    fromDate: "",
    toDate: "",
    type: "GOVT",
    mode: "single",
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const years = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() - 2 + i,
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const role = getRole();
    setIsAdmin(role === "admin" || role === "superAdmin");
  }, []);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const [bdRes, dbRes] = await Promise.all([
        fetch(`${API}/holiday/bangladesh?year=${selectedYear}`, {
          headers: authHeaders(),
        }),
        fetch(`${API}/holiday?year=${selectedYear}`, {
          headers: authHeaders(),
        }),
      ]);

      const bdData = await bdRes.json();
      const dbData = await dbRes.json();

      const bdHolidays = Array.isArray(bdData?.holidays) ? bdData.holidays : [];
      const dbHolidays = Array.isArray(dbData?.holidays) ? dbData.holidays : [];

      // Merge: DB holidays first, then BD API holidays not already in DB
      const seen = new Set(
        dbHolidays.map(
          (h) => `${h.title?.toLowerCase()}|${h.date?.toString().slice(0, 10)}`,
        ),
      );
      const merged = [...dbHolidays];
      for (const h of bdHolidays) {
        const key = `${h.title?.toLowerCase()}|${h.date?.toString().slice(0, 10)}`;
        if (!seen.has(key)) {
          merged.push(h);
          seen.add(key);
        }
      }

      setHolidays(merged);
    } catch (e) {
      toast.error("Failed to load holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [selectedYear]);

  const filtered = useMemo(() => {
    return holidays.filter((h) => {
      const matchSearch = h.title?.toLowerCase().includes(search.toLowerCase());
      const matchType =
        typeFilter === "all" ||
        h.type === typeFilter ||
        (typeFilter === "GOVT" && h.type === "Govt Holiday") ||
        (typeFilter === "COMPANY" && h.type === "Company Holiday");
      const matchUpcoming = !upcomingOnly || isUpcoming(h);
      return matchSearch && matchType && matchUpcoming;
    });
  }, [holidays, search, typeFilter, upcomingOnly]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((h) => {
      const d = new Date(h.date);
      const m = d.getMonth();
      if (!map[m]) map[m] = [];
      map[m].push(h);
    });
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => new Date(a.date) - new Date(b.date)),
    );
    return map;
  }, [filtered]);

  const stats = useMemo(() => {
    const total = holidays.length;
    const govt = holidays.filter(
      (h) => h.type === "GOVT" || h.type === "Govt Holiday",
    ).length;
    const company = holidays.filter(
      (h) => h.type === "COMPANY" || h.type === "Company Holiday",
    ).length;
    const upcoming = holidays.filter((h) => new Date(h.date) >= today).length;
    return { total, govt, company, upcoming };
  }, [holidays]);

  const openAdd = () => {
    setForm({
      title: "",
      date: "",
      fromDate: "",
      toDate: "",
      type: "GOVT",
      mode: "single",
    });
    setShowAdd(true);
  };

  const openEdit = (h) => {
    setSelected(h);
    const d = new Date(h.date);
    const dateStr = d.toISOString().split("T")[0];
    setForm({
      title: h.title,
      date: dateStr,
      fromDate: "",
      toDate: "",
      type:
        h.type === "Govt Holiday"
          ? "GOVT"
          : h.type === "Company Holiday"
            ? "COMPANY"
            : h.type,
      mode: "single",
    });
    setShowEdit(true);
  };

  const openDelete = (h) => {
    setSelected(h);
    setShowDelete(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (form.mode === "range") {
        const start = new Date(form.fromDate);
        const end = new Date(form.toDate);
        if (!form.fromDate || !form.toDate) {
          toast.error("Please select both From and To dates");
          setFormLoading(false);
          return;
        }
        if (end < start) {
          toast.error("End date must be after start date");
          setFormLoading(false);
          return;
        }
        const dates = [];
        const curr = new Date(start);
        while (curr <= end) {
          dates.push(curr.toISOString().split("T")[0]);
          curr.setDate(curr.getDate() + 1);
        }
        const holidays = dates.map((date) => ({
          title: form.title,
          date,
          type: form.type,
        }));
        const res = await fetch(`${API}/import`, {
          method: "POST",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ holidays }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(`${data.imported} holiday entries added`);
          setShowAdd(false);
          fetchHolidays();
        } else {
          toast.error(data?.message || "Failed to add holidays");
        }
      } else {
        const res = await fetch(`${API}/addHoliday`, {
          method: "POST",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            date: form.date,
            type: form.type,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("Holiday added successfully");
          setShowAdd(false);
          fetchHolidays();
        } else {
          toast.error(data?.message || "Failed to add holiday");
        }
      }
    } catch {
      toast.error("Network error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setFormLoading(true);
    try {
      const res = await fetch(`${API}/updateHoliday/${selected._id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Holiday updated");
        setShowEdit(false);
        fetchHolidays();
      } else {
        toast.error(data?.message || "Failed to update");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setFormLoading(true);
    try {
      const res = await fetch(`${API}/deleteHoliday/${selected._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        toast.success("Holiday deleted");
        setShowDelete(false);
        fetchHolidays();
      } else {
        toast.error("Failed to delete");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSeedBangladesh = async () => {
    setSeedLoading(true);
    try {
      const url = `${API}/holiday/seed-bangladesh?year=${selectedYear}${seedForce ? "&force=true" : ""}`;
      const res = await fetch(url, { method: "POST", headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        const parts = [];
        if (data.inserted) parts.push(`${data.inserted} added`);
        if (data.updated) parts.push(`${data.updated} updated`);
        if (data.skipped) parts.push(`${data.skipped} unchanged`);
        toast.success(parts.join(", ") || "Done");
        setShowSeedConfirm(false);
        setSeedForce(false);
        fetchHolidays();
      } else {
        toast.error(data?.message || "Failed to seed holidays");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSeedLoading(false);
    }
  };

  function isUpcoming(h) {
    return new Date(h.date) >= today;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  }

  function getDayName(dateStr) {
    return DAYS[new Date(dateStr).getDay()];
  }

  const sortedMonths = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#113F67] rounded-lg flex items-center justify-center">
                <CalendarDays size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Holidays</h1>
                <p className="text-xs text-gray-500">
                  Bangladesh public &amp; company holidays
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#113F67] cursor-pointer"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              <button
                onClick={fetchHolidays}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                title="Refresh"
              >
                <RefreshCw size={15} />
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => setShowSeedConfirm(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    title={`Populate Bangladesh ${selectedYear} public holidays`}
                  >
                    <Download size={15} />
                    BD Holidays
                  </button>
                  <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-[#113F67] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0d3254] transition-colors"
                  >
                    <Plus size={15} />
                    Add Holiday
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 px-2 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={CalendarDays}
            label="Total Holidays"
            value={stats.total}
            color="bg-[#113F67]"
            active={typeFilter === "all" && !upcomingOnly}
            onClick={() => {
              setTypeFilter("all");
              setUpcomingOnly(false);
            }}
          />
          <StatCard
            icon={Globe}
            label="Govt Holidays"
            value={stats.govt}
            color="bg-indigo-500"
            active={typeFilter === "GOVT" && !upcomingOnly}
            onClick={() => {
              setTypeFilter("GOVT");
              setUpcomingOnly(false);
            }}
          />
          <StatCard
            icon={Building2}
            label="Company Holidays"
            value={stats.company}
            color="bg-cyan-500"
            active={typeFilter === "COMPANY" && !upcomingOnly}
            onClick={() => {
              setTypeFilter("COMPANY");
              setUpcomingOnly(false);
            }}
          />
          <StatCard
            icon={Star}
            label="Upcoming"
            value={stats.upcoming}
            color="bg-emerald-500"
            active={upcomingOnly}
            onClick={() => {
              setTypeFilter("all");
              setUpcomingOnly(true);
            }}
          />
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
              placeholder="Search holidays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={SEL + " min-w-[160px]"}
            >
              <option value="all">All Types</option>
              <option value="GOVT">Government</option>
              <option value="COMPANY">Company</option>
            </select>
          </div>
          {(search || typeFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
              }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Holiday List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="space-y-2">
                  {[1, 2].map((j) => (
                    <Skeleton key={j} className="h-14 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : sortedMonths.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <CalendarDays size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No holidays found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || typeFilter !== "all"
                ? "Try adjusting your filters"
                : `No holidays recorded for ${selectedYear}`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedMonths.map((monthIdx) => (
              <div
                key={monthIdx}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                  <Calendar size={15} className="text-[#113F67]" />
                  <h2 className="text-sm font-semibold text-gray-700">
                    {MONTHS[monthIdx]}
                  </h2>
                  <span className="ml-auto text-xs text-gray-400">
                    {grouped[monthIdx].length} holiday
                    {grouped[monthIdx].length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="divide-y divide-gray-50">
                  {grouped[monthIdx].map((h) => {
                    const upcoming = isUpcoming(h);
                    const isGovt =
                      h.type === "GOVT" || h.type === "Govt Holiday";
                    return (
                      <div
                        key={h._id}
                        className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${upcoming ? "border-l-4 border-l-emerald-400" : "border-l-4 border-l-transparent"}`}
                      >
                        <div className="text-center shrink-0 w-12">
                          <p className="text-lg font-bold text-[#113F67] leading-none">
                            {new Date(h.date).getDate()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {getDayName(h.date).slice(0, 3)}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-800 text-sm">
                              {h.title}
                            </p>
                            {upcoming && (
                              <span className="text-xs bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">
                                Upcoming
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={typeBadge(h.type)}>
                              {isGovt ? (
                                <Globe size={10} />
                              ) : (
                                <Building2 size={10} />
                              )}
                              {isGovt ? "Government" : "Company"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(h.date)}
                            </span>
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => openEdit(h)}
                              className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => openDelete(h)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Holiday"
      >
        <HolidayForm
          form={form}
          setForm={setForm}
          onSubmit={handleAdd}
          loading={formLoading}
          submitLabel="Add Holiday"
          showModeToggle={true}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Holiday"
      >
        <HolidayForm
          form={form}
          setForm={setForm}
          onSubmit={handleEdit}
          loading={formLoading}
          submitLabel="Save Changes"
        />
      </Modal>

      {/* Seed Bangladesh Holidays Modal */}
      <Modal
        open={showSeedConfirm}
        onClose={() => setShowSeedConfirm(false)}
        title="Populate Bangladesh Holidays"
      >
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-emerald-800 mb-2">
              Bangladesh Public Holidays {selectedYear}
            </p>
            <p className="text-xs text-emerald-700">
              This will add all official Bangladesh government holidays for{" "}
              {selectedYear} including: national days, Eid ul-Fitr, Eid ul-Adha,
              Independence Day, Victory Day, and more. Existing holidays with
              the same date and title will be skipped.
            </p>
          </div>
          {/* Clear & Reseed option */}
          <label
            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${seedForce ? "border-red-300 bg-red-50" : "border-gray-200 hover:bg-gray-50"}`}
          >
            <input
              type="checkbox"
              checked={seedForce}
              onChange={(e) => setSeedForce(e.target.checked)}
              className="mt-0.5 accent-red-500"
            />
            <div>
              <p
                className={`text-sm font-medium ${seedForce ? "text-red-700" : "text-gray-700"}`}
              >
                Clear &amp; Reseed {selectedYear}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Deletes ALL existing {selectedYear} holidays (including wrong or
                duplicate entries) and fetches fresh correct data from the API.
                Use this to fix wrong dates.
              </p>
            </div>
          </label>
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => {
                setShowSeedConfirm(false);
                setSeedForce(false);
              }}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSeedBangladesh}
              disabled={seedLoading}
              className={`flex-1 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${seedForce ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {seedLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {seedLoading
                ? seedForce
                  ? "Clearing & Reseeding..."
                  : "Adding..."
                : seedForce
                  ? `Clear & Reseed ${selectedYear}`
                  : `Add ${selectedYear} Holidays`}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Holiday"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              Delete &quot;{selected?.title}&quot;?
            </p>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDelete(false)}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={formLoading}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {formLoading && <Loader2 size={14} className="animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
