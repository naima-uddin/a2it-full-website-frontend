"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Timer,
  Search,
  MapPin,
  Loader2,
  Moon,
  Activity,
  Database,
  Download,
  CalendarDays,
  Shield,
  AlertTriangle,
  Calendar,
  FileText,
  Clock4,
  BarChart3,
  TrendingUp,
  Zap,
  Settings,
  Filter,
  Layers,
  UserCheck,
  ClipboardList,
  AlertOctagon,
  Info,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_HRM_API_URL;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  STATUS CONFIG
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATUS_CFG = {
  Present: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Late: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Early: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  Absent: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  "Clocked In": {
    bg: "bg-teal-100",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
  "Half Day": {
    bg: "bg-lime-100",
    text: "text-lime-700",
    border: "border-lime-200",
    dot: "bg-lime-500",
  },
  Leave: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  "Unpaid Leave": {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  "Half Paid Leave": {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
  },
  "Govt Holiday": {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  "Company Holiday": {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dot: "bg-cyan-500",
  },
  "Weekly Off": {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const scfg = (s) =>
  STATUS_CFG[s] || {
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  SHARED COMPONENTS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatusBadge({ status }) {
  const c = scfg(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, light }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
      <div
        className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className={`text-2xl font-bold ${light}`}>{value}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function Skeleton({ rows = 5 }) {
  return (
    <div className="divide-y divide-gray-50 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-2 bg-gray-100 rounded w-1/5" />
          </div>
          <div className="h-6 bg-gray-100 rounded-full w-20" />
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-14" />
        </div>
      ))}
    </div>
  );
}

function Modal({ show, onClose, title, subtitle, children, footer }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-800">{title}</h2>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={17} className="text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto space-y-4 flex-1">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inp =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#113F67] focus:bg-white transition-colors";
const sel = inp + " cursor-pointer";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  UTILITIES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BD_LOCALE = { timeZone: "Asia/Dhaka" };
const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString("en-BD", {
        ...BD_LOCALE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "â€”";
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-BD", {
        ...BD_LOCALE,
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "â€”";
const fmtDay = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-BD", {
        ...BD_LOCALE,
        weekday: "short",
      })
    : "â€”";
const fmtHours = (h) => {
  if (!h || h <= 0) return "â€”";
  const f = Math.floor(h),
    m = Math.round((h - f) * 60);
  return m > 0 ? `${f}h ${m}m` : `${f}h`;
};
const isoDate = (d = new Date()) => d.toISOString().split("T")[0];
const toTimeStr = (dt) =>
  dt
    ? new Date(dt).toLocaleTimeString("en", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

function setDateToTime(dateStr, timeStr) {
  const d = new Date(dateStr);
  const [h, m] = timeStr.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  MAIN PAGE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function AttendancePage() {
  const router = useRouter();

  // auth / user
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);

  // data
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dashStats, setDashStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);

  // today status (employee)
  const [todayInfo, setTodayInfo] = useState({
    clockedIn: false,
    clockedOut: false,
    clockInTime: null,
    clockOutTime: null,
    status: null,
    shiftDetails: null,
    dayStatus: null,
    isWorkingDay: true,
    isMarkedAbsent: false,
    totalHours: null,
  });

  // context info
  const [ipAddr, setIpAddr] = useState("â€”");
  const [geoLoc, setGeoLoc] = useState({
    address: "Office",
    lat: null,
    lng: null,
  });
  const [devInfo, setDevInfo] = useState({
    type: "Desktop",
    os: "â€”",
    browser: "â€”",
  });

  // filter / pagination
  const [dateRange, setDateRange] = useState({
    start: isoDate(),
    end: isoDate(),
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [empFilter, setEmpFilter] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const PER = 30;

  // live clock
  const [now, setNow] = useState(new Date());

  // UI
  const [expanded, setExpanded] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [selRec, setSelRec] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  // forms
  const freshManual = () => ({
    employeeId: "",
    date: isoDate(),
    clockIn: "09:00",
    clockOut: "18:00",
    status: "Present",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    remarks: "Created by admin",
  });
  const [manualForm, setManualForm] = useState(freshManual());
  const [editForm, setEditForm] = useState({});
  const [bulkForm, setBulkForm] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    defaultClockIn: "09:00",
    defaultClockOut: "18:00",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    skipWeekends: true,
    markAllPresent: true,
  });

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  AUTH
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const getToken = () => {
    if (typeof window === "undefined") return null;
    const a = localStorage.getItem("adminToken");
    const e = localStorage.getItem("employeeToken");
    return a
      ? { token: a, type: "admin" }
      : e
        ? { token: e, type: "employee" }
        : null;
  };
  const H = (t) => ({
    Authorization: `Bearer ${t}`,
    "Content-Type": "application/json",
  });

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  INIT
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    initPage();
    detectDevice();
    detectLocation();
    detectIp();
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (userRole) fetchRecords();
  }, [userRole, page, dateRange, statusFilter, empFilter, searchQ]);

  const initPage = async () => {
    setLoading(true);
    try {
      const ti = getToken();
      if (!ti) {
        router.push("/hrm");
        return;
      }
      const ep =
        ti.type === "admin"
          ? `${API}/admin/getAdminProfile`
          : `${API}/users/getProfile`;
      const r = await fetch(ep, { headers: H(ti.token) });
      if (!r.ok) {
        router.push("/hrm");
        return;
      }
      const d = await r.json();
      setUserData(d.user || d);
      setUserRole(ti.type);
      setIsAdmin(ti.type === "admin");
      if (ti.type === "admin") {
        await loadEmployees(ti.token);
        await loadDashStats(ti.token);
      } else {
        await loadTodayStatus(ti.token);
        await loadSummary(ti.token);
      }
    } catch {
      router.push("/hrm");
    } finally {
      setLoading(false);
    }
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  DATA LOADERS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const loadTodayStatus = async (tok) => {
    try {
      const t = tok || getToken()?.token;
      const r = await fetch(`${API}/today-status`, { headers: H(t) });
      if (!r.ok) return;
      const d = await r.json();
      setTodayInfo({
        clockedIn: d.clockedIn || false,
        clockedOut: d.clockedOut || false,
        clockInTime: d.attendance?.clockIn || null,
        clockOutTime: d.attendance?.clockOut || null,
        status: d.attendance?.status || null,
        shiftDetails: d.shiftDetails || null,
        dayStatus: d.dayStatus || null,
        isWorkingDay: d.dayStatus?.isWorkingDay ?? true,
        isMarkedAbsent:
          d.attendance?.status === "Absent" && !!d.attendance?.markedAbsent,
        totalHours: d.attendance?.totalHours || null,
      });
    } catch {}
  };

  const loadSummary = async (tok) => {
    try {
      const t = tok || getToken()?.token;
      const p = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
      const r = await fetch(`${API}/summary?${p}`, { headers: H(t) });
      if (!r.ok) return;
      const d = await r.json();
      if (d.summary) setSummary(d.summary);
    } catch {}
  };

  const loadDashStats = async (tok) => {
    try {
      const t = tok || getToken()?.token;
      const r = await fetch(`${API}/admin/summary`, { headers: H(t) });
      if (!r.ok) return;
      const d = await r.json();
      setDashStats(d.dashboard || null);
    } catch {}
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const ti = getToken();
      if (!ti) return;
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        page: String(page),
        limit: String(PER),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(empFilter && { employeeId: empFilter }),
        ...(searchQ && { search: searchQ }),
      });
      const ep = isAdmin
        ? `${API}/admin/all-records?${params}`
        : `${API}/records?${params}`;
      const r = await fetch(ep, { headers: H(ti.token), cache: "no-cache" });
      if (!r.ok) throw new Error();
      const d = await r.json();
      const recs = d.records || d.attendance || d.data?.records || [];
      setRecords(recs);
      setTotal(d.total || recs.length);
      if (!isAdmin) {
        await loadSummary(ti.token);
      } else {
        await loadDashStats(ti.token);
      }
    } catch {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async (tok) => {
    try {
      const t = tok || getToken()?.token;
      const r = await fetch(`${API}/admin/getAll-user`, { headers: H(t) });
      if (!r.ok) return;
      const d = await r.json();
      const list = Array.isArray(d) ? d : d.users || d.data || [];
      setEmployees(list.filter((e) => e?._id));
    } catch {}
  };

  const refresh = async () => {
    await fetchRecords();
    if (isAdmin) await loadDashStats();
    else {
      await loadTodayStatus();
      await loadSummary();
    }
    toast.success("Refreshed");
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  DEVICE / LOCATION / IP
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const detectDevice = () => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;
    setDevInfo({
      type: /Mobile|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop",
      os: ua.includes("Windows")
        ? "Windows"
        : ua.includes("Mac")
          ? "macOS"
          : ua.includes("Android")
            ? "Android"
            : "Linux",
      browser: ua.includes("Edg")
        ? "Edge"
        : ua.includes("Chrome")
          ? "Chrome"
          : ua.includes("Firefox")
            ? "Firefox"
            : "Safari",
    });
  };

  const detectLocation = () => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const d = await r.json();
          setGeoLoc({
            address:
              d.display_name ||
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            lat: latitude,
            lng: longitude,
          });
        } catch {
          setGeoLoc({
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            lat: latitude,
            lng: longitude,
          });
        }
      },
      () =>
        setGeoLoc({ address: "Location unavailable", lat: null, lng: null }),
    );
  };

  const detectIp = async () => {
    try {
      const r = await fetch("https://api.ipify.org?format=json");
      const d = await r.json();
      setIpAddr(d.ip);
    } catch {
      setIpAddr("Unknown");
    }
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  EMPLOYEE ACTIONS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleClockIn = async () => {
    if (todayInfo.isMarkedAbsent) {
      toast.error("You are marked absent today. Contact admin.");
      return;
    }
    if (!todayInfo.isWorkingDay) {
      toast.error(
        `Today is ${todayInfo.dayStatus?.status || "a non-working day"}.`,
      );
      return;
    }
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(`${API}/clock-in`, {
        method: "POST",
        headers: H(ti.token),
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          location: geoLoc,
          ipAddress: ipAddr,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success(
          d.attendance?.isLate
            ? `âœ“ Clocked in â€” ${d.attendance.lateMinutes}m late`
            : "âœ“ Clocked in â€” On time",
        );
        await loadTodayStatus();
        await fetchRecords();
      } else toast.error(d.message || "Clock in failed");
    } catch {
      toast.error("Clock in failed. Check connection.");
    } finally {
      setBusy(false);
    }
  };

  const handleClockOut = async () => {
    if (!todayInfo.clockedIn) {
      toast.error("You haven't clocked in yet.");
      return;
    }
    if (todayInfo.clockedOut) {
      toast.error("Already clocked out.");
      return;
    }
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(`${API}/clock-out`, {
        method: "POST",
        headers: H(ti.token),
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          location: geoLoc.address,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success(
          `âœ“ Clocked out â€” ${fmtHours(d.attendance?.totalHours)} worked`,
        );
        await loadTodayStatus();
        await fetchRecords();
      } else toast.error(d.message || "Clock out failed");
    } catch {
      toast.error("Clock out failed.");
    } finally {
      setBusy(false);
    }
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  ADMIN ACTIONS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleCreateManual = async () => {
    if (!manualForm.employeeId) {
      toast.error("Please select an employee.");
      return;
    }
    setBusy(true);
    try {
      const ti = getToken();
      const body = {
        ...manualForm,
        ...(manualForm.clockIn && {
          clockIn: setDateToTime(manualForm.date, manualForm.clockIn),
        }),
        ...(manualForm.clockOut && {
          clockOut: setDateToTime(manualForm.date, manualForm.clockOut),
        }),
      };
      const r = await fetch(`${API}/admin/manual`, {
        method: "POST",
        headers: H(ti.token),
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success("âœ“ Attendance record created");
        setShowManual(false);
        setManualForm(freshManual());
        await fetchRecords();
      } else toast.error(d.message || "Failed to create");
    } catch {
      toast.error("Failed to create record.");
    } finally {
      setBusy(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!bulkForm.employeeId) {
      toast.error("Please select an employee.");
      return;
    }
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(`${API}/admin/bulk-v2`, {
        method: "POST",
        headers: H(ti.token),
        body: JSON.stringify(bulkForm),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success(`âœ“ ${d.results?.created || 0} records created`);
        setShowBulk(false);
        await fetchRecords();
      } else toast.error(d.message || "Failed to bulk create");
    } catch {
      toast.error("Bulk create failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async () => {
    if (!selRec) return;
    setBusy(true);
    try {
      const ti = getToken();
      const recDate = new Date(selRec.date);
      const body = {
        status: editForm.status,
        remarks: editForm.remarks,
        correctionReason: editForm.correctionReason,
        ...(editForm.clockIn && {
          clockIn: setDateToTime(isoDate(recDate), editForm.clockIn),
        }),
        ...(editForm.clockOut && {
          clockOut: setDateToTime(isoDate(recDate), editForm.clockOut),
        }),
      };
      const r = await fetch(`${API}/admin/correct/${selRec._id}`, {
        method: "PUT",
        headers: H(ti.token),
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success("âœ“ Record corrected");
        setShowEdit(false);
        setSelRec(null);
        await fetchRecords();
      } else toast.error(d.message || "Failed to update");
    } catch {
      toast.error("Failed to update record.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selRec) return;
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(`${API}/admin/delete/${selRec._id}`, {
        method: "DELETE",
        headers: H(ti.token),
        body: JSON.stringify({ reason: "Deleted by admin" }),
      });
      if (r.ok) {
        toast.success("âœ“ Record deleted");
        setShowDel(false);
        setSelRec(null);
        await fetchRecords();
      } else {
        const d = await r.json();
        toast.error(d.message || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setBusy(false);
    }
  };

  const triggerAbsent = async () => {
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(`${API}/admin/trigger-absent-marking`, {
        method: "POST",
        headers: H(ti.token),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success(
          `âœ“ Marked ${d.results?.markedAbsent || 0} employees absent`,
        );
        await fetchRecords();
      } else toast.error(d.message || "Failed");
    } catch {
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };

  const triggerClockOut = async () => {
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(`${API}/admin/trigger-auto-clockout`, {
        method: "POST",
        headers: H(ti.token),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success(`âœ“ Auto clocked out ${d.results?.autoClockOuts || 0}`);
        await fetchRecords();
      } else toast.error(d.message || "Failed");
    } catch {
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };

  const triggerTomorrow = async () => {
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(`${API}/admin/trigger-tomorrow-records`, {
        method: "POST",
        headers: H(ti.token),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success(
          `âœ“ Generated ${d.results?.recordsCreated || 0} tomorrow records`,
        );
      } else toast.error(d.message || "Failed");
    } catch {
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };

  const cleanupDuplicates = async () => {
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(`${API}/admin/cleanup-duplicates`, {
        method: "POST",
        headers: H(ti.token),
        body: JSON.stringify({
          startDate: dateRange.start,
          endDate: dateRange.end,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success(`âœ“ Cleaned ${d.cleaned || 0} duplicates`);
        await fetchRecords();
      } else toast.error(d.message || "Failed");
    } catch {
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };

  const exportData = async () => {
    setExportLoading(true);
    try {
      const ti = getToken();
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(empFilter && { employeeId: empFilter }),
      });
      const ep = isAdmin
        ? `${API}/admin/export?${params}`
        : `${API}/export?${params}`;
      const r = await fetch(ep, {
        headers: { Authorization: `Bearer ${ti.token}` },
      });
      if (!r.ok) {
        toast.error("Export failed");
        return;
      }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${dateRange.start}-to-${dateRange.end}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("âœ“ Export downloaded");
    } catch {
      toast.error("Export failed");
    } finally {
      setExportLoading(false);
    }
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  QUICK DATE HELPERS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const quickDate = (type) => {
    const t = new Date();
    const s = (d) => isoDate(d);
    const ranges = {
      today: { start: s(t), end: s(t) },
      yesterday: () => {
        const y = new Date(t);
        y.setDate(y.getDate() - 1);
        return { start: s(y), end: s(y) };
      },
      "this-week": () => {
        const mon = new Date(t);
        mon.setDate(t.getDate() - t.getDay() + 1);
        return { start: s(mon), end: s(t) };
      },
      "this-month": {
        start: isoDate(new Date(t.getFullYear(), t.getMonth(), 1)),
        end: isoDate(new Date(t.getFullYear(), t.getMonth() + 1, 0)),
      },
      "last-month": {
        start: isoDate(new Date(t.getFullYear(), t.getMonth() - 1, 1)),
        end: isoDate(new Date(t.getFullYear(), t.getMonth(), 0)),
      },
      "7d": () => {
        const w = new Date(t);
        w.setDate(w.getDate() - 6);
        return { start: s(w), end: s(t) };
      },
    };
    const v = ranges[type];
    const range = typeof v === "function" ? v() : v;
    setDateRange(range);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PER);

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  CLOCK STRINGS
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const clockStr = now.toLocaleTimeString("en-BD", {
    ...BD_LOCALE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-BD", {
    ...BD_LOCALE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  LOADING SCREEN
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (loading && !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-2xl bg-[#113F67] opacity-10 animate-ping" />
            <div className="w-20 h-20 bg-[#113F67] rounded-2xl flex items-center justify-center shadow-lg">
              <Clock size={34} className="text-white" />
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-600">
            Loading Attendanceâ€¦
          </p>
          <p className="text-xs text-gray-400 mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  //  EMPLOYEE VIEW
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  if (!isAdmin) {
    const shift = todayInfo.shiftDetails;
    const canIn =
      !todayInfo.clockedIn &&
      !todayInfo.isMarkedAbsent &&
      todayInfo.isWorkingDay;
    const canOut = todayInfo.clockedIn && !todayInfo.clockedOut;
    const workedMs = todayInfo.clockInTime
      ? (todayInfo.clockOutTime
          ? new Date(todayInfo.clockOutTime)
          : new Date()) - new Date(todayInfo.clockInTime)
      : 0;
    const workedH = workedMs / 3_600_000;

    const headerBg = todayInfo.clockedOut
      ? "from-emerald-600 to-emerald-500"
      : todayInfo.clockedIn
        ? "from-blue-600 to-blue-500"
        : todayInfo.isMarkedAbsent
          ? "from-red-600 to-red-500"
          : !todayInfo.isWorkingDay
            ? "from-slate-500 to-slate-600"
            : "from-[#113F67] to-[#1a5c9a]";

    const statusLabel = todayInfo.clockedOut
      ? "Shift Complete âœ“"
      : todayInfo.clockedIn
        ? "Currently Working"
        : todayInfo.isMarkedAbsent
          ? "Marked Absent"
          : !todayInfo.isWorkingDay
            ? todayInfo.dayStatus?.status || "Day Off"
            : "Not Clocked In Yet";

    return (
      <div className="min-h-screen bg-slate-50">

        {/* â”€â”€ Sticky Header â”€â”€ */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#113F67] rounded-lg flex items-center justify-center">
                <ClipboardList size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#113F67] leading-none">
                  My Attendance
                </p>
                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                  {dateStr}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-base font-mono font-bold text-[#113F67]">
                  {clockStr}
                </p>
                {shift && (
                  <p className="text-xs text-gray-400">
                    Shift: {shift.start} â€“ {shift.end}
                  </p>
                )}
              </div>
              <button
                onClick={refresh}
                disabled={loading}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
          {/* Alerts */}
          {!todayInfo.isWorkingDay && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <Moon size={18} className="text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {todayInfo.dayStatus?.status}
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {todayInfo.dayStatus?.reason || "Not a working day"}
                </p>
              </div>
            </div>
          )}
          {todayInfo.isMarkedAbsent && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertOctagon size={18} className="text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Marked Absent Today
                </p>
                <p className="text-xs text-red-500 mt-0.5">
                  Contact your admin if this is incorrect.
                </p>
              </div>
            </div>
          )}

          {/* â”€â”€ Clock Card â”€â”€ */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md">
            {/* colored top */}
            <div className={`bg-linear-to-r ${headerBg} p-5 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Today
                  </p>
                  <p className="text-xl font-bold">{statusLabel}</p>
                  {todayInfo.status && (
                    <StatusBadge status={todayInfo.status} />
                  )}
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${todayInfo.clockedOut ? "bg-white/25" : todayInfo.clockedIn ? "bg-white/20" : "bg-white/10"}`}
                >
                  {todayInfo.clockedOut ? (
                    <CheckCircle size={28} />
                  ) : todayInfo.clockedIn ? (
                    <Activity size={28} className="animate-pulse" />
                  ) : (
                    <Clock size={28} />
                  )}
                </div>
              </div>
              {/* time grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Clock In", val: fmtTime(todayInfo.clockInTime) },
                  {
                    label: "Worked",
                    val: workedMs > 0 ? fmtHours(workedH) : "â€”",
                  },
                  { label: "Clock Out", val: fmtTime(todayInfo.clockOutTime) },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-white/10 rounded-xl py-3 text-center"
                  >
                    <p className="text-white/60 text-xs mb-1">{m.label}</p>
                    <p className="text-white font-bold text-sm font-mono">
                      {m.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* white bottom */}
            <div className="bg-white p-4">
              {/* Clock in / out buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleClockIn}
                  disabled={!canIn || busy}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    canIn && !busy
                      ? "bg-[#113F67] text-white hover:bg-[#0d3155] active:scale-[.98] shadow-md"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {busy && canIn ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogIn size={16} />
                  )}
                  Clock In
                </button>
                <button
                  onClick={handleClockOut}
                  disabled={!canOut || busy}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    canOut && !busy
                      ? "bg-rose-500 text-white hover:bg-rose-600 active:scale-[.98] shadow-md"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {busy && canOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  Clock Out
                </button>
              </div>

              {/* Shift / Location / Device strip */}
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Clock4 size={12} className="text-[#113F67] shrink-0" />
                  {shift ? (
                    <>
                      <strong className="text-gray-700">
                        {shift.start} â€“ {shift.end}
                      </strong>
                      {shift.isNightShift && (
                        <span className="text-indigo-500 ml-1">Night</span>
                      )}
                    </>
                  ) : (
                    "â€”"
                  )}
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin size={12} className="text-rose-400 shrink-0" />
                  <span className="truncate">
                    {geoLoc.address.split(",")[0]}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0" />
                  {devInfo.type} · {devInfo.browser} · {ipAddr}
                </span>
              </div>
            </div>
          </div>

          {/* â”€â”€ Summary Stats â”€â”€ */}
          {summary && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    icon: CheckCircle,
                    label: "Present Days",
                    val: summary.presentDays || 0,
                    color: "bg-emerald-500",
                    light: "text-emerald-600",
                  },
                  {
                    icon: XCircle,
                    label: "Absent Days",
                    val: summary.absentDays || 0,
                    color: "bg-red-500",
                    light: "text-red-600",
                  },
                  {
                    icon: Clock,
                    label: "Late Days",
                    val: summary.lateDays || 0,
                    color: "bg-amber-500",
                    light: "text-amber-600",
                  },
                  {
                    icon: Timer,
                    label: "Total Hours",
                    val: fmtHours(summary.totalHours || 0),
                    color: "bg-blue-600",
                    light: "text-blue-600",
                  },
                ].map((s) => (
                  <StatCard key={s.label} {...s} />
                ))}
              </div>

              {/* Extra stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Early Days", val: summary.earlyDays || 0 },
                  { label: "Leave Days", val: summary.leaveDays || 0 },
                  { label: "Working Days", val: summary.workingDays || 0 },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm"
                  >
                    <p className="text-xl font-bold text-gray-700">{s.val}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Attendance rate */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={15} className="text-[#113F67]" />
                    <span className="text-sm font-semibold text-gray-700">
                      Attendance Rate
                    </span>
                  </div>
                  <span
                    className={`text-xl font-bold ${(summary.attendanceRate || 0) >= 80 ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {summary.attendanceRate || 0}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#113F67] to-blue-400 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, summary.attendanceRate || 0)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>0%</span>
                  <span>{summary.workingDays || 0} working days</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ Filters â”€â”€ */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
            {/* Quick date buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { k: "today", l: "Today" },
                { k: "yesterday", l: "Yesterday" },
                { k: "this-week", l: "This Week" },
                { k: "this-month", l: "This Month" },
                { k: "last-month", l: "Last Month" },
              ].map((d) => (
                <button
                  key={d.k}
                  onClick={() => quickDate(d.k)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-[#113F67] hover:text-white transition-all"
                >
                  {d.l}
                </button>
              ))}
            </div>

            {/* Custom range + status + export */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => {
                  setDateRange((p) => ({ ...p, start: e.target.value }));
                  setPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#113F67] text-gray-600"
              />
              <span className="text-gray-400 text-xs">â€”</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => {
                  setDateRange((p) => ({ ...p, end: e.target.value }));
                  setPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#113F67] text-gray-600"
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#113F67] text-gray-600 ml-auto"
              >
                <option value="all">All Status</option>
                {Object.keys(STATUS_CFG).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={exportData}
                disabled={exportLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#113F67] border border-[#113F67]/30 rounded-lg hover:bg-[#113F67]/5 transition-colors"
              >
                {exportLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Download size={12} />
                )}
                Export
              </button>
            </div>
          </div>

          {/* â”€â”€ Records â”€â”€ */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CalendarDays size={15} className="text-[#113F67]" />
                <span className="text-sm font-bold text-gray-700">
                  Attendance Records
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {total} entries
              </span>
            </div>

            {loading ? (
              <Skeleton rows={6} />
            ) : records.length === 0 ? (
              <div className="text-center py-16">
                <CalendarDays
                  size={40}
                  className="text-gray-200 mx-auto mb-3"
                />
                <p className="text-sm font-medium text-gray-500">
                  No records found
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try changing the date range or filters
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {records.map((rec) => {
                  const isExp = expanded === rec._id;
                  const lateInfo = rec.isLate
                    ? { t: "late", m: rec.lateMinutes }
                    : rec.isEarly
                      ? { t: "early", m: rec.earlyMinutes }
                      : null;
                  return (
                    <div key={rec._id}>
                      <div
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 cursor-pointer transition-colors"
                        onClick={() => setExpanded(isExp ? null : rec._id)}
                      >
                        {/* Date block */}
                        <div className="w-12 text-center shrink-0">
                          <p className="text-sm font-bold text-gray-800">
                            {new Date(rec.date)
                              .getDate()
                              .toString()
                              .padStart(2, "0")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(rec.date).toLocaleDateString("en", {
                              month: "short",
                            })}
                          </p>
                          <p className="text-xs text-gray-400">
                            {fmtDay(rec.date)}
                          </p>
                        </div>
                        {/* Status */}
                        <div className="flex-1 min-w-0">
                          <StatusBadge status={rec.status} />
                          {lateInfo && (
                            <p
                              className={`text-xs mt-1 font-semibold ${lateInfo.t === "late" ? "text-amber-500" : "text-blue-500"}`}
                            >
                              {lateInfo.m}m {lateInfo.t}
                            </p>
                          )}
                        </div>
                        {/* Times */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-center w-14">
                            <p className="text-xs text-gray-400">In</p>
                            <p className="text-xs font-mono font-bold text-gray-700">
                              {fmtTime(rec.clockIn)}
                            </p>
                          </div>
                          <div className="text-center w-14">
                            <p className="text-xs text-gray-400">Out</p>
                            <p className="text-xs font-mono font-bold text-gray-700">
                              {fmtTime(rec.clockOut)}
                            </p>
                          </div>
                          <div className="text-center w-12 hidden sm:block">
                            <p className="text-xs text-gray-400">Hrs</p>
                            <p className="text-xs font-bold text-[#113F67]">
                              {fmtHours(rec.totalHours)}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          size={13}
                          className={`text-gray-300 shrink-0 transition-transform ${isExp ? "rotate-180" : ""}`}
                        />
                      </div>
                      {isExp && (
                        <div className="bg-slate-50 px-4 py-3 border-t border-gray-100">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <p className="text-gray-400 mb-0.5 font-medium">
                                Shift
                              </p>
                              <p className="text-gray-600">
                                {rec.shift?.name || "â€”"} ({rec.shift?.start}
                                â€“{rec.shift?.end})
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-0.5 font-medium">
                                Hours
                              </p>
                              <p className="text-gray-600 font-bold">
                                {fmtHours(rec.totalHours)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-0.5 font-medium">
                                Location
                              </p>
                              <p className="text-gray-600 truncate">
                                {rec.location || "â€”"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-0.5 font-medium">
                                Device / IP
                              </p>
                              <p className="text-gray-600">
                                {rec.device?.type || "â€”"} â€”{" "}
                                {rec.ipAddress || "â€”"}
                              </p>
                            </div>
                            {rec.remarks && (
                              <div className="col-span-2 sm:col-span-4">
                                <p className="text-gray-400 mb-0.5 font-medium">
                                  Remarks
                                </p>
                                <p className="text-gray-600">{rec.remarks}</p>
                              </div>
                            )}
                            {rec.correctedByAdmin && (
                              <div className="col-span-2 sm:col-span-4">
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-xs font-semibold">
                                  Admin Corrected
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/40">
                <p className="text-xs text-gray-500">
                  Page {page} / {totalPages}
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pg =
                      totalPages <= 5
                        ? i + 1
                        : page <= 3
                          ? i + 1
                          : page >= totalPages - 2
                            ? totalPages - 4 + i
                            : page - 2 + i;
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`w-7 h-7 text-xs rounded-lg font-semibold transition-all ${page === pg ? "bg-[#113F67] text-white" : "border border-gray-200 text-gray-600 hover:bg-white"}`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white transition-colors"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  //  ADMIN VIEW
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  return (
    <div className="min-h-screen bg-gray-50">

      {/* â”€â”€ Admin Sticky Header â”€â”€ */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto  h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-[#113F67] rounded-lg flex items-center justify-center">
              <BarChart3 size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-[#113F67] leading-none">
                Attendance Management
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />{" "}
              Refresh
            </button>
            <button
              onClick={triggerAbsent}
              disabled={busy}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <AlertTriangle size={12} /> Mark Absent
            </button>
            <button
              onClick={triggerClockOut}
              disabled={busy}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              <Zap size={12} /> Auto Clockout
            </button>
            <button
              onClick={exportData}
              disabled={exportLoading}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              {exportLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Download size={12} />
              )}{" "}
              Export
            </button>
            <button
              onClick={() => setShowBulk(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Layers size={12} /> Bulk
            </button>
            <button
              onClick={() => setShowManual(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#113F67] text-white rounded-xl hover:bg-[#0d3155] transition-colors shadow-sm"
            >
              <Plus size={13} /> Manual Entry
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-5 space-y-5">
        {/* â”€â”€ Dashboard Stats â”€â”€ */}
        {dashStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Total Employees"
              value={dashStats.totalEmployees || employees.length}
              sub="Active"
              color="bg-blue-600"
              light="text-blue-700"
            />
            <StatCard
              icon={CheckCircle}
              label="Present Today"
              value={dashStats.presentToday || 0}
              sub={`${dashStats.totalEmployees ? Math.round((dashStats.presentToday / dashStats.totalEmployees) * 100) : 0}% of total`}
              color="bg-emerald-500"
              light="text-emerald-600"
            />
            <StatCard
              icon={XCircle}
              label="Absent Today"
              value={dashStats.absentToday || 0}
              sub="Not clocked in"
              color="bg-red-500"
              light="text-red-600"
            />
            <StatCard
              icon={Timer}
              label="Pending Clockout"
              value={dashStats.pendingClockOut || 0}
              sub="Clocked in only"
              color="bg-amber-500"
              light="text-amber-600"
            />
          </div>
        )}

        {/* Mobile quick triggers */}
        <div className="flex sm:hidden gap-2">
          <button
            onClick={triggerAbsent}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <AlertTriangle size={12} /> Mark Absent
          </button>
          <button
            onClick={triggerClockOut}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl"
          >
            <Zap size={12} /> Auto Clockout
          </button>
          <button
            onClick={() => setShowBulk(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl"
          >
            <Layers size={12} /> Bulk
          </button>
        </div>

        {/* â”€â”€ Filter Bar â”€â”€ */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-52 flex-1">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search employee name or IDâ€¦"
                value={searchQ}
                onChange={(e) => {
                  setSearchQ(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#113F67] focus:bg-white transition-colors"
              />
            </div>
            {/* Employee selector */}
            <select
              value={empFilter}
              onChange={(e) => {
                setEmpFilter(e.target.value);
                setPage(1);
              }}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:border-[#113F67] min-w-44"
            >
              <option value="">All Employees</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.firstName} {e.lastName}
                </option>
              ))}
            </select>
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:border-[#113F67]"
            >
              <option value="all">All Status</option>
              {Object.keys(STATUS_CFG).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Quick dates + custom range */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { k: "today", l: "Today" },
              { k: "yesterday", l: "Yesterday" },
              { k: "this-week", l: "This Week" },
              { k: "this-month", l: "This Month" },
              { k: "last-month", l: "Last Month" },
              { k: "7d", l: "Last 7 Days" },
            ].map((d) => (
              <button
                key={d.k}
                onClick={() => quickDate(d.k)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-[#113F67] hover:text-white transition-all"
              >
                {d.l}
              </button>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => {
                  setDateRange((p) => ({ ...p, start: e.target.value }));
                  setPage(1);
                }}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:border-[#113F67]"
              />
              <span className="text-gray-400">â€”</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => {
                  setDateRange((p) => ({ ...p, end: e.target.value }));
                  setPage(1);
                }}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:border-[#113F67]"
              />
            </div>
          </div>

          {/* Advanced actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <button
              onClick={triggerTomorrow}
              disabled={busy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors"
            >
              <CalendarDays size={12} /> Generate Tomorrow
            </button>
            <button
              onClick={cleanupDuplicates}
              disabled={busy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Settings size={12} /> Cleanup Duplicates
            </button>
            <p className="text-xs text-gray-400 ml-auto italic">
              {dateRange.start === dateRange.end
                ? `Date: ${fmtDate(dateRange.start)}`
                : `${fmtDate(dateRange.start)} â€” ${fmtDate(dateRange.end)}`}
            </p>
          </div>
        </div>

        {/* â”€â”€ Records Table â”€â”€ */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table head */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-[#113F67]" />
              <span className="text-sm font-bold text-gray-700">
                Attendance Records
              </span>
              <span className="px-2 py-0.5 bg-[#113F67]/10 text-[#113F67] text-xs rounded-full font-bold">
                {total}
              </span>
            </div>
            {loading && (
              <Loader2 size={14} className="animate-spin text-gray-400" />
            )}
          </div>

          {/* Column headers */}
          {!loading && records.length > 0 && (
            <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-2.5 bg-gray-50/30 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
              <div className="col-span-3">Employee</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Clock In</div>
              <div className="col-span-1">Clock Out</div>
              <div className="col-span-1">Hours</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          )}

          {loading ? (
            <Skeleton rows={8} />
          ) : records.length === 0 ? (
            <div className="text-center py-20">
              <Database size={44} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">
                No records found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try adjusting your filters or date range
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {records.map((rec) => {
                const emp = rec.employee;
                const name = emp
                  ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim()
                  : "â€”";
                const eid = emp?.employeeId || "â€”";
                const lateInfo = rec.isLate
                  ? { t: "late", m: rec.lateMinutes }
                  : rec.isEarly
                    ? { t: "early", m: rec.earlyMinutes }
                    : null;
                const isExp = expanded === rec._id;

                return (
                  <div
                    key={rec._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center">
                      {/* Employee */}
                      <div className="col-span-12 lg:col-span-3 flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-[#113F67]/10 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[#113F67] text-sm font-bold">
                            {name.charAt(0) || "?"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {eid} {emp?.department ? `· ${emp.department}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-span-5 lg:col-span-2">
                        <p className="text-sm font-semibold text-gray-700">
                          {fmtDate(rec.date)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {fmtDay(rec.date)}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="col-span-7 lg:col-span-2">
                        <StatusBadge status={rec.status} />
                        {lateInfo && (
                          <p
                            className={`text-xs mt-1 font-semibold ${lateInfo.t === "late" ? "text-amber-500" : "text-blue-500"}`}
                          >
                            {lateInfo.m}m {lateInfo.t}
                          </p>
                        )}
                      </div>

                      {/* In */}
                      <div className="col-span-3 lg:col-span-1">
                        <p className="text-xs text-gray-400">In</p>
                        <p className="text-sm font-mono font-semibold text-gray-700">
                          {fmtTime(rec.clockIn)}
                        </p>
                      </div>

                      {/* Out */}
                      <div className="col-span-3 lg:col-span-1">
                        <p className="text-xs text-gray-400">Out</p>
                        <p className="text-sm font-mono font-semibold text-gray-700">
                          {fmtTime(rec.clockOut)}
                        </p>
                        {rec.autoClockOut && (
                          <p className="text-xs text-amber-500">Auto</p>
                        )}
                      </div>

                      {/* Hours */}
                      <div className="col-span-3 lg:col-span-1">
                        <p className="text-xs text-gray-400">Hours</p>
                        <p className="text-sm font-bold text-[#113F67]">
                          {fmtHours(rec.totalHours)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="col-span-3 lg:col-span-2 flex items-center justify-end gap-1">
                        <button
                          onClick={() => setExpanded(isExp ? null : rec._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#113F67] hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelRec(rec);
                            setEditForm({
                              clockIn: toTimeStr(rec.clockIn),
                              clockOut: toTimeStr(rec.clockOut),
                              status: rec.status,
                              remarks: rec.remarks || "",
                              correctionReason: "",
                            });
                            setShowEdit(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit / Correct"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelRec(rec);
                            setShowDel(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded detail row */}
                    {isExp && (
                      <div className="bg-slate-50 border-t border-gray-100 px-5 py-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                              Shift
                            </p>
                            <p className="text-gray-700 font-medium">
                              {rec.shift?.name || "â€”"}
                            </p>
                            <p className="text-gray-500">
                              {rec.shift?.start}â€“{rec.shift?.end}
                            </p>
                            {rec.shift?.isNightShift && (
                              <span className="text-indigo-500 font-semibold">
                                Night Shift
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                              Location
                            </p>
                            <p className="text-gray-700 font-medium truncate max-w-44">
                              {rec.location || "â€”"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                              Device
                            </p>
                            <p className="text-gray-700 font-medium">
                              {rec.device?.type || "â€”"} /{" "}
                              {rec.device?.os || "â€”"}
                            </p>
                            <p className="text-gray-500">
                              {rec.device?.browser || ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                              IP & Flags
                            </p>
                            <p className="text-gray-700 font-medium">
                              {rec.ipAddress || "â€”"}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rec.autoMarked && (
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded font-semibold">
                                  Auto Marked
                                </span>
                              )}
                              {rec.autoClockOut && (
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded font-semibold">
                                  Auto Clockout
                                </span>
                              )}
                              {rec.correctedByAdmin && (
                                <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded font-semibold">
                                  Admin Corrected
                                </span>
                              )}
                              {rec.autoGenerated && (
                                <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-600 rounded font-semibold">
                                  Auto Generated
                                </span>
                              )}
                            </div>
                          </div>
                          {rec.remarks && (
                            <div className="col-span-2 sm:col-span-4">
                              <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                Remarks
                              </p>
                              <p className="text-gray-700">{rec.remarks}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
              <p className="text-xs text-gray-500">
                Showing {(page - 1) * PER + 1}â€“{Math.min(page * PER, total)}{" "}
                of {total} records
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
                >
                  <ChevronLeft size={12} /> Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pg =
                    totalPages <= 5
                      ? i + 1
                      : page <= 3
                        ? i + 1
                        : page >= totalPages - 2
                          ? totalPages - 4 + i
                          : page - 2 + i;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-8 h-8 text-xs rounded-lg font-semibold transition-all ${page === pg ? "bg-[#113F67] text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:bg-white"}`}
                    >
                      {pg}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
                >
                  Next <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• MODALS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

      {/* Manual Attendance */}
      <Modal
        show={showManual}
        onClose={() => setShowManual(false)}
        title="Create Manual Attendance"
        subtitle="Add an attendance record for any employee"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowManual(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateManual}
              disabled={busy || !manualForm.employeeId}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#113F67] text-white text-sm font-bold hover:bg-[#0d3155] disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}{" "}
              Create Record
            </button>
          </div>
        }
      >
        <FormField label="Employee" required>
          <select
            value={manualForm.employeeId}
            onChange={(e) =>
              setManualForm((p) => ({ ...p, employeeId: e.target.value }))
            }
            className={sel}
          >
            <option value="">Select an employeeâ€¦</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.firstName} {e.lastName} â€”{" "}
                {e.employeeId || e.department || ""}
              </option>
            ))}
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date" required>
            <input
              type="date"
              value={manualForm.date}
              onChange={(e) =>
                setManualForm((p) => ({ ...p, date: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Status" required>
            <select
              value={manualForm.status}
              onChange={(e) =>
                setManualForm((p) => ({ ...p, status: e.target.value }))
              }
              className={sel}
            >
              {Object.keys(STATUS_CFG).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Clock In">
            <input
              type="time"
              value={manualForm.clockIn}
              onChange={(e) =>
                setManualForm((p) => ({ ...p, clockIn: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Clock Out">
            <input
              type="time"
              value={manualForm.clockOut}
              onChange={(e) =>
                setManualForm((p) => ({ ...p, clockOut: e.target.value }))
              }
              className={inp}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Shift Start">
            <input
              type="time"
              value={manualForm.shiftStart}
              onChange={(e) =>
                setManualForm((p) => ({ ...p, shiftStart: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Shift End">
            <input
              type="time"
              value={manualForm.shiftEnd}
              onChange={(e) =>
                setManualForm((p) => ({ ...p, shiftEnd: e.target.value }))
              }
              className={inp}
            />
          </FormField>
        </div>
        <FormField label="Remarks">
          <textarea
            rows={2}
            value={manualForm.remarks}
            onChange={(e) =>
              setManualForm((p) => ({ ...p, remarks: e.target.value }))
            }
            placeholder="Optional noteâ€¦"
            className={inp + " resize-none"}
          />
        </FormField>
      </Modal>

      {/* Bulk Attendance */}
      <Modal
        show={showBulk}
        onClose={() => setShowBulk(false)}
        title="Bulk Attendance"
        subtitle="Generate attendance records for a full month"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulk(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkCreate}
              disabled={busy || !bulkForm.employeeId}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Layers size={15} />
              )}{" "}
              Generate
            </button>
          </div>
        }
      >
        <FormField label="Employee" required>
          <select
            value={bulkForm.employeeId}
            onChange={(e) =>
              setBulkForm((p) => ({ ...p, employeeId: e.target.value }))
            }
            className={sel}
          >
            <option value="">Select an employeeâ€¦</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.firstName} {e.lastName}
              </option>
            ))}
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Month">
            <select
              value={bulkForm.month}
              onChange={(e) =>
                setBulkForm((p) => ({ ...p, month: Number(e.target.value) }))
              }
              className={sel}
            >
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Year">
            <input
              type="number"
              value={bulkForm.year}
              onChange={(e) =>
                setBulkForm((p) => ({ ...p, year: Number(e.target.value) }))
              }
              className={inp}
              min="2020"
              max="2030"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Default Clock In">
            <input
              type="time"
              value={bulkForm.defaultClockIn}
              onChange={(e) =>
                setBulkForm((p) => ({ ...p, defaultClockIn: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Default Clock Out">
            <input
              type="time"
              value={bulkForm.defaultClockOut}
              onChange={(e) =>
                setBulkForm((p) => ({ ...p, defaultClockOut: e.target.value }))
              }
              className={inp}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Shift Start">
            <input
              type="time"
              value={bulkForm.shiftStart}
              onChange={(e) =>
                setBulkForm((p) => ({ ...p, shiftStart: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Shift End">
            <input
              type="time"
              value={bulkForm.shiftEnd}
              onChange={(e) =>
                setBulkForm((p) => ({ ...p, shiftEnd: e.target.value }))
              }
              className={inp}
            />
          </FormField>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={bulkForm.skipWeekends}
              onChange={(e) =>
                setBulkForm((p) => ({ ...p, skipWeekends: e.target.checked }))
              }
              className="w-4 h-4 accent-[#113F67]"
            />
            <span className="text-sm text-gray-700">Skip Weekends</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={bulkForm.markAllPresent}
              onChange={(e) =>
                setBulkForm((p) => ({ ...p, markAllPresent: e.target.checked }))
              }
              className="w-4 h-4 accent-[#113F67]"
            />
            <span className="text-sm text-gray-700">Mark All Present</span>
          </label>
        </div>
      </Modal>

      {/* Edit / Correct */}
      <Modal
        show={showEdit}
        onClose={() => {
          setShowEdit(false);
          setSelRec(null);
        }}
        title="Edit & Correct Attendance"
        subtitle={
          selRec
            ? `${selRec.employee?.firstName || ""} ${selRec.employee?.lastName || ""} · ${fmtDate(selRec?.date)}`
            : ""
        }
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowEdit(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#113F67] text-white text-sm font-bold hover:bg-[#0d3155] disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}{" "}
              Save Changes
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Clock In">
            <input
              type="time"
              value={editForm.clockIn || ""}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, clockIn: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Clock Out">
            <input
              type="time"
              value={editForm.clockOut || ""}
              onChange={(e) =>
                setEditForm((p) => ({ ...p, clockOut: e.target.value }))
              }
              className={inp}
            />
          </FormField>
        </div>
        <FormField label="Status">
          <select
            value={editForm.status || ""}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, status: e.target.value }))
            }
            className={sel}
          >
            {Object.keys(STATUS_CFG).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Correction Reason" required>
          <textarea
            rows={2}
            value={editForm.correctionReason || ""}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, correctionReason: e.target.value }))
            }
            placeholder="Why is this being corrected?"
            className={inp + " resize-none"}
          />
        </FormField>
        <FormField label="Remarks">
          <input
            value={editForm.remarks || ""}
            onChange={(e) =>
              setEditForm((p) => ({ ...p, remarks: e.target.value }))
            }
            placeholder="Additional notesâ€¦"
            className={inp}
          />
        </FormField>
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          <Info size={13} className="shrink-0 mt-0.5" />
          <span>
            All corrections are logged in the audit trail with admin info and
            timestamp.
          </span>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        show={showDel}
        onClose={() => {
          setShowDel(false);
          setSelRec(null);
        }}
        title="Confirm Delete"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowDel(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}{" "}
              Delete Permanently
            </button>
          </div>
        }
      >
        <div className="text-center py-2">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={26} className="text-red-500" />
          </div>
          <p className="text-sm text-gray-700 font-medium">
            Delete record for{" "}
            <strong>
              {selRec?.employee?.firstName} {selRec?.employee?.lastName}
            </strong>
            ?
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {fmtDate(selRec?.date)} · Status: {selRec?.status}
          </p>
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 text-left">
            <strong>Warning:</strong> This action is permanent and cannot be
            undone. The record will be deleted from the database.
          </div>
        </div>
      </Modal>
    </div>
  );
}
