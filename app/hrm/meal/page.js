"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Utensils,
  Coffee,
  Pizza,
  Package,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  X,
  RefreshCw,
  Download,
  Check,
  Trash2,
  Edit,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Inbox,
  TrendingUp,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const BASE =
  process.env.NEXT_PUBLIC_HRM_API_URL || "http://localhost:5000/api/v1";

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmtMonth = (s) => {
  if (!s) return "";
  const [y, m] = s.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

const nowMonth = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
};

const months7 = () => {
  const out = [],
    n = new Date();
  for (let i = -3; i < 4; i++) {
    const d = new Date(n.getFullYear(), n.getMonth() + i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
};

const statusColor = {
  active: "bg-emerald-100 text-emerald-700",
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100   text-amber-700",
  rejected: "bg-red-100     text-red-600",
  cancelled: "bg-gray-100    text-gray-500",
  paused: "bg-blue-100    text-blue-700",
  served: "bg-teal-100    text-teal-700",
};

// ─── tiny ui ──────────────────────────────────────────────────────────────────

const Chip = ({ label, s }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[s] || "bg-gray-100 text-gray-500"}`}
  >
    {label || s?.toUpperCase()}
  </span>
);

const Loader = () => (
  <div className="w-5 h-5 border-2 border-[#113F67]/20 border-t-[#113F67] rounded-full animate-spin inline-block" />
);

const PageSpin = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center space-y-3">
      <div className="w-14 h-14 bg-[#113F67] rounded-2xl mx-auto flex items-center justify-center">
        <Utensils className="text-white" size={24} />
      </div>
      <Loader />
      <p className="text-sm text-gray-400">Loading…</p>
    </div>
  </div>
);

const Empty = ({ icon: Icon, msg, sub, cta }) => (
  <div className="py-14 flex flex-col items-center text-center gap-3">
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <Icon size={22} className="text-gray-400" />
    </div>
    <div>
      <p className="font-medium text-gray-700">{msg}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
    {cta}
  </div>
);

const Toggle = ({ on, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!on)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${on ? "bg-[#113F67]" : "bg-gray-300"}`}
  >
    <span
      className={`my-1 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);

// Preference picker: office or outside
const PrefPicker = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-3">
    {[
      {
        k: "office",
        Icon: Coffee,
        label: "Office Meal",
        sub: "Kitchen prepared",
      },
      {
        k: "outside",
        Icon: Pizza,
        label: "Outside Food",
        sub: "Partner restaurant",
      },
    ].map(({ k, Icon, label, sub }) => (
      <button
        key={k}
        type="button"
        onClick={() => onChange(k)}
        className={`p-4 rounded-xl border-2 text-center transition-all ${
          value === k
            ? "border-[#113F67] bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <Icon
          size={22}
          className={`mx-auto mb-1.5 ${value === k ? "text-[#113F67]" : "text-gray-400"}`}
        />
        <p
          className={`text-sm font-semibold ${value === k ? "text-[#113F67]" : "text-gray-700"}`}
        >
          {label}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </button>
    ))}
  </div>
);

// Modal shell
const Modal = ({ open, title, sub, onClose, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-xl" : "max-w-md"} max-h-[92vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={17} className="text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

// Confirm dialog
const Confirm = ({
  open,
  title,
  msg,
  onOk,
  onCancel,
  okLabel = "Confirm",
  danger,
  loading,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full shrink-0 ${danger ? "bg-red-100" : "bg-blue-100"}`}
          >
            <AlertCircle
              size={18}
              className={danger ? "text-red-600" : "text-[#113F67]"}
            />
          </div>
          <div>
            <p className="font-bold text-gray-900">{title}</p>
            <p className="text-sm text-gray-500 mt-1">{msg}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onOk}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
              danger
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-[#113F67] hover:bg-[#0d3050] text-white"
            }`}
          >
            {loading ? <Loader /> : okLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// Section card wrapper
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHead = ({ title, icon: Icon, right, sub }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
    <div className="flex items-center gap-2.5">
      {Icon && <Icon size={16} className="text-[#113F67]" />}
      <div>
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
    {right}
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function MealPage() {
  const router = useRouter();

  // auth
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const [eligible, setEligible] = useState(false);

  // shared state
  const [month, setMonth] = useState(nowMonth);
  const [depts, setDepts] = useState([]);

  // admin data
  const [allSubs, setAllSubs] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [inboxSubs, setInboxSubs] = useState([]); // all pending subs for inbox (separate from paginated allSubs)
  const [report, setReport] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [dashStats, setDashStats] = useState({});
  const [foodCostSummary, setFoodCostSummary] = useState(null);
  const [subsPage, setSubsPage] = useState(1);
  const [subsTotalPages, setSubsTotalPages] = useState(1);
  const [subsTotalItems, setSubsTotalItems] = useState(0);
  const SUBS_PER = 15;

  // employee data
  const [mySub, setMySub] = useState(null);
  const [myMeals, setMyMeals] = useState([]);

  // ui
  const [tab, setTab] = useState("inbox");
  const [busy, setBusy] = useState(false);
  const [acting, setActing] = useState(false);

  // subscription list filters
  const [subSearch, setSubSearch] = useState("");
  const [subDept, setSubDept] = useState("all");
  const [subStatus, setSubStatus] = useState("all");

  // modal / confirm
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [modal, setModal] = useState(null);
  const [selSub, setSelSub] = useState(null);
  const [selMeal, setSelMeal] = useState(null);
  const [confirmCfg, setConfirmCfg] = useState(null);

  // unified review modal (approve/reject with required reason)
  const [reviewItem, setReviewItem] = useState(null); // { type: "meal"|"sub", item }
  const [reviewReason, setReviewReason] = useState("");

  // forms
  const [reqF, setReqF] = useState({
    mealPreference: "office",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [subF, setSubF] = useState({
    mealPreference: "office",
    autoRenew: true,
  });
  const [editSubF, setEditSubF] = useState({
    preference: "office",
    autoRenew: true,
    status: "active",
    isPaused: false,
    pauseReason: "",
  });
  const [aSubF, setASubF] = useState({
    userId: "",
    preference: "office",
    autoRenew: true,
    note: "",
  });
  const [aMealF, setAMealF] = useState({
    userId: "",
    date: new Date().toISOString().split("T")[0],
    mealPreference: "office",
    note: "",
  });

  // ── token helper ────────────────────────────────────────────────────────────
  const tok = useCallback(
    () =>
      localStorage.getItem("adminToken") ||
      localStorage.getItem("employeeToken") ||
      localStorage.getItem("moderatorToken"),
    [],
  );

  const api = useCallback(
    async (path, method = "GET", body = null) => {
      const t = tok();
      if (!t) {
        router.push("/hrm");
        return null;
      }
      const res = await fetch(`${BASE}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      return data;
    },
    [tok, router],
  );

  // ── fetchers ────────────────────────────────────────────────────────────────
  const loadProfile = useCallback(async () => {
    const t = tok();
    if (!t) {
      router.push("/hrm");
      return;
    }
    try {
      const res = await fetch(`${BASE}/users/getProfile`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.status === 401) {
        localStorage.clear();
        router.push("/hrm");
        return;
      }
      const data = await res.json();
      const u = data.user || data;
      setUser(u);
      const admin = u.role === "admin" || u.role === "superAdmin";
      const mod = u.role === "moderator";
      setIsAdmin(admin);
      setIsMod(mod);
      setEligible(u.workLocationType === "onsite");
      if (!admin && !mod) setTab("employee");
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setReady(true);
    }
  }, [tok, router]);

  const loadDashStats = useCallback(async () => {
    try {
      const d = await api("/dashboard/stats");
      if (d?.data) setDashStats(d.data);
    } catch {}
  }, [api]);

  const loadDepts = useCallback(async () => {
    try {
      const d = await api("/departments");
      if (d?.data) setDepts(d.data);
    } catch {}
  }, [api]);

  const loadAllUsers = useCallback(async () => {
    try {
      const d = await api("/admin/getAll-user");
      if (d?.users) setAllUsers(d.users);
    } catch {}
  }, [api]);

  // Load ALL subscriptions with no page limit for inbox — derive pending from currentMonthStatus
  const loadInboxSubs = useCallback(async () => {
    try {
      const p = new URLSearchParams({ page: 1, limit: 200, month });
      const d = await api(`/admin/subscriptions/all?${p}`);
      setInboxSubs(d?.subscriptions || []);
    } catch {}
  }, [api, month]);

  const loadAllSubs = useCallback(async () => {
    setBusy(true);
    try {
      const p = new URLSearchParams({ page: subsPage, limit: SUBS_PER });
      if (subStatus !== "all") p.append("status", subStatus);
      if (subDept !== "all") p.append("department", subDept);
      if (month) p.append("month", month);
      if (subSearch) p.append("search", subSearch);
      const d = await api(`/admin/subscriptions/all?${p}`);
      if (d) {
        setAllSubs(d.subscriptions || []);
        setSubsTotalPages(d.pagination?.pages || 1);
        setSubsTotalItems(d.pagination?.total || 0);
      }
    } catch {
      toast.error("Failed to load subscriptions");
    } finally {
      setBusy(false);
    }
  }, [api, subsPage, subStatus, subDept, month, subSearch]);

  const loadAllMeals = useCallback(async () => {
    try {
      const [y, m] = month.split("-");
      const start = new Date(Number(y), Number(m) - 1, 1).toISOString();
      const end = new Date(Number(y), Number(m), 0, 23, 59, 59).toISOString();
      const d = await api(`/admin/meals/all?startDate=${start}&endDate=${end}`);
      setAllMeals(d?.meals || d?.data || []);
    } catch {}
  }, [api, month]);

  const loadFoodCostSummary = useCallback(async () => {
    try {
      const d = await api(`/meal/food-cost-per-person?month=${month}`);
      if (d?.data) setFoodCostSummary(d.data);
    } catch {}
  }, [api, month]);

  const loadReport = useCallback(async () => {
    setBusy(true);
    try {
      const p = new URLSearchParams({
        ...(month && { month }),
        ...(subDept !== "all" && { department: subDept }),
      });
      const d = await api(`/admin/monthly-report?${p}`);
      setReport(d || null);
    } catch {
      toast.error("Failed to load report");
    } finally {
      setBusy(false);
    }
  }, [api, month, subDept]);

  const loadMySub = useCallback(async () => {
    try {
      const d = await api("/subscription/my-details");
      setMySub(d || null);
    } catch {}
  }, [api]);

  const loadMyMeals = useCallback(async () => {
    try {
      const p = new URLSearchParams({
        page: 1,
        limit: 50,
        ...(month && { month }),
      });
      const d = await api(`/daily/my-meals?${p}`);
      setMyMeals(d?.data || []);
    } catch {}
  }, [api, month]);

  // ── initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // mark meal notifications as seen when admin/mod visits this page
  useEffect(() => {
    const role = localStorage.getItem("adminToken")
      ? "admin"
      : localStorage.getItem("moderatorToken")
        ? "moderator"
        : null;
    if (role) {
      localStorage.setItem("notifSeenCount", "9999");
      window.dispatchEvent(new Event("notifSeen"));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    loadDepts();
    loadDashStats();
    const adm = user.role === "admin" || user.role === "superAdmin";
    const mod = user.role === "moderator";
    if (adm || mod) {
      loadAllUsers();
      loadInboxSubs();
      loadAllSubs();
      loadAllMeals();
      loadFoodCostSummary();
    } else {
      loadMySub();
      loadMyMeals();
      loadFoodCostSummary();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // refresh on month / filter change
  useEffect(() => {
    if (!user) return;
    const adm = user.role === "admin" || user.role === "superAdmin";
    const mod = user.role === "moderator";
    if (adm || mod) {
      loadInboxSubs();
      loadAllSubs();
      loadAllMeals();
      loadDashStats();
      loadFoodCostSummary();
    } else {
      loadMyMeals();
      loadFoodCostSummary();
    }
  }, [month]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user && (isAdmin || isMod)) loadAllSubs();
  }, [subsPage, subStatus, subDept, subSearch]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user && (isAdmin || isMod) && tab === "reports") loadFoodCostSummary();
  }, [tab, month]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── close modal helper ───────────────────────────────────────────────────────
  const close = () => {
    setModal(null);
    setSelSub(null);
    setSelMeal(null);
  };

  // ── actions ─────────────────────────────────────────────────────────────────

  // Employee: request daily meal
  const doRequest = async () => {
    setActing(true);
    try {
      await api("/daily/request", "POST", reqF);
      toast.success("Meal request sent! Admin will review it shortly.");
      close();
      setReqF({
        mealPreference: "office",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });
      loadMyMeals();
    } catch (e) {
      const raw = e.message || "";
      const msg =
        raw.includes("duplicate") || raw.includes("E11000")
          ? "You already have a meal request for this date. Please choose a different date."
          : raw || "Request failed. Please try again.";
      toast.error(msg, { duration: 5000 });
      alert(msg);
    } finally {
      setActing(false);
    }
  };

  // Employee: setup subscription
  const doSetupSub = async () => {
    setActing(true);
    try {
      await api("/subscription/setup", "POST", {
        preference: subF.mealPreference,
        autoRenew: subF.autoRenew,
      });
      toast.success("Subscription request sent!");
      close();
      loadMySub();
    } catch (e) {
      toast.error(e.message || "Failed to subscribe");
    } finally {
      setActing(false);
    }
  };

  // Employee: cancel subscription
  const doCancelSub = async () => {
    setActing(true);
    try {
      await api("/subscription/cancel", "POST", {
        reason: "Cancelled by employee",
      });
      toast.success("Subscription cancelled");
      setConfirmCfg(null);
      setMySub(null);
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setActing(false);
    }
  };

  // Employee: cancel meal
  const doCancelMeal = async (meal) => {
    setActing(true);
    try {
      await api("/daily/cancel", "POST", {
        mealId: meal._id,
        reason: "Cancelled by employee",
      });
      toast.success("Request cancelled");
      setConfirmCfg(null);
      loadMyMeals();
    } catch (e) {
      toast.error(e.message || "Failed to cancel");
    } finally {
      setActing(false);
    }
  };

  // open review modal
  const openReview = (type, item) => {
    setReviewItem({ type, item });
    setReviewReason("");
  };
  const closeReview = () => {
    setReviewItem(null);
    setReviewReason("");
  };

  // Unified approve/reject with required reason
  const submitReview = async (action) => {
    if (!reviewReason.trim()) {
      toast.error("Please provide a reason before proceeding");
      return;
    }
    setActing(true);
    try {
      if (reviewItem.type === "meal") {
        const ep =
          action === "approve" ? "/admin/meal/approve" : "/admin/meal/reject";
        await api(ep, "PUT", {
          mealId: reviewItem.item._id,
          note: reviewReason.trim(),
        });
        toast.success(`Meal request ${action}d`);
        loadAllMeals();
        loadDashStats();
      } else {
        await api("/admin/subscription/approve", "PUT", {
          subscriptionId: reviewItem.item._id,
          month,
          action,
          note: reviewReason.trim(),
        });
        toast.success(`Subscription ${action}d`);
        loadInboxSubs();
        loadAllSubs();
        loadDashStats();
      }
      closeReview();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setActing(false);
    }
  };

  // Admin: edit subscription
  const doEditSub = async () => {
    setActing(true);
    try {
      await api(`/admin/subscription/update/${selSub?._id}`, "PUT", {
        preference: editSubF.preference,
        autoRenew: editSubF.autoRenew,
        status: editSubF.status,
        isPaused: editSubF.isPaused,
        pauseReason: editSubF.isPaused ? editSubF.pauseReason : "",
      });
      toast.success("Subscription updated");
      close();
      loadAllSubs();
      loadDashStats();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setActing(false);
    }
  };

  // Admin: delete subscription
  const doDeleteSub = async (sub) => {
    const target = sub || selSub;
    setActing(true);
    try {
      await api(`/admin/subscription/${target?._id}`, "DELETE");
      toast.success("Subscription deleted");
      setConfirmCfg(null);
      loadAllSubs();
      loadDashStats();
      loadInboxSubs();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setActing(false);
    }
  };

  // Admin: delete meal request
  const doDeleteMeal = async (meal) => {
    setActing(true);
    try {
      await api(`/admin/meal/${meal._id}`, "DELETE");
      toast.success("Meal request deleted");
      setConfirmCfg(null);
      loadAllMeals();
      loadDashStats();
      loadInboxSubs();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setActing(false);
    }
  };

  // Admin: create subscription for employee
  const doCreateSub = async () => {
    if (!aSubF.userId) {
      toast.error("Select an employee");
      return;
    }
    setActing(true);
    try {
      await api("/admin/subscription/create", "POST", aSubF);
      toast.success("Subscription created");
      close();
      setASubF({ userId: "", preference: "office", autoRenew: true, note: "" });
      loadAllSubs();
      loadDashStats();
      loadInboxSubs();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setActing(false);
    }
  };

  // Admin: create meal for employee (auto-approved)
  const doCreateMeal = async () => {
    if (!aMealF.userId) {
      toast.error("Select an employee");
      return;
    }
    setActing(true);
    try {
      await api("/admin/create-meal", "POST", aMealF);
      toast.success("Meal created & auto-approved");
      close();
      setAMealF({
        userId: "",
        date: new Date().toISOString().split("T")[0],
        mealPreference: "office",
        note: "",
      });
      loadAllMeals();
      loadDashStats();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setActing(false);
    }
  };

  // Export CSV (reports)
  const exportCSV = () => {
    if (!report?.data?.length) {
      toast.error("No data to export");
      return;
    }
    const rows = [
      [
        "Emp ID",
        "Name",
        "Department",
        "Designation",
        "Subscription",
        "Preference",
        "Meal Days",
      ],
      ...report.data.map((r) => [
        r.employeeId,
        r.name,
        r.department,
        r.designation,
        r.subscription,
        r.preference,
        r.approvedMeals,
      ]),
    ];
    const a = document.createElement("a");
    a.href =
      "data:text/csv;charset=utf-8," +
      encodeURI(rows.map((r) => r.join(",")).join("\n"));
    a.download = `meal-report-${month}.csv`;
    a.click();
  };

  // ── derived ──────────────────────────────────────────────────────────────────
  const canManage = isAdmin || isMod;
  const hasSub = mySub?.hasSubscription;
  const subData = mySub?.data;

  // Inbox — ALL meals & ALL subs that have any monthly activity for selected month
  const pendingMeals = allMeals.filter((m) => m.status === "pending");
  const pendingSubs = inboxSubs.filter(
    (s) => s.currentMonthStatus === "pending",
  );
  const inboxCount = pendingMeals.length + pendingSubs.length;

  // All meals sorted newest first (for full inbox view)
  const allMealsSorted = [...allMeals].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  // All subs that have any monthly approval record for selected month
  const allSubsWithMonth = inboxSubs.filter(
    (s) => s.currentMonthStatus && s.currentMonthStatus !== "none",
  );

  const onsiteUsers = allUsers.filter((u) => u.workLocationType === "onsite");

  const focusMealSummary = (kind) => {
    if (kind === "pending") {
      setTab("inbox");
      return;
    }

    if (kind === "today") {
      setTab("inbox");
      return;
    }

    if (kind === "subscriptions") {
      setTab("subscriptions");
      setSubStatus("active");
      setSubsPage(1);
      return;
    }

    if (kind === "approved") {
      setTab("subscriptions");
      setSubStatus("active");
      setSubsPage(1);
    }
  };

  // ── tabs config ──────────────────────────────────────────────────────────────
  const ADMIN_TABS = [
    { id: "inbox", label: "Inbox", Icon: Inbox, badge: inboxCount },
    { id: "subscriptions", label: "Subscriptions", Icon: Package },
    { id: "reports", label: "Reports", Icon: FileText },
  ];

  if (!ready) return <PageSpin />;

  // ════════════════════════════════════════════════════════════════════════════
  // EMPLOYEE VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (!canManage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
          {/* header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#113F67] rounded-xl flex items-center justify-center">
                <Utensils className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">My Meal</h1>
                <p className="text-xs text-gray-500">{fmtMonth(month)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
              >
                {months7().map((m) => (
                  <option key={m} value={m}>
                    {fmtMonth(m)}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  loadMySub();
                  loadMyMeals();
                }}
                className="p-2 border border-gray-300 bg-white rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* not eligible notice */}
          {!eligible && (
            <Card>
              <div className="p-5 flex items-start gap-3">
                <AlertCircle
                  className="text-amber-500 shrink-0 mt-0.5"
                  size={18}
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Meal benefits not available
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Only onsite employees can access meals. Your work type:{" "}
                    <span className="font-medium">
                      {user?.workLocationType || "not set"}
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Food cost summary — visible to all employees */}
          {foodCostSummary && (
            <div className="bg-linear-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={15} className="text-emerald-200" />
                  <p className="text-sm font-semibold text-emerald-100">
                    Food Cost — {fmtMonth(month)}
                  </p>
                </div>
                <button
                  onClick={() => setShowCostBreakdown((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold text-white transition-colors"
                >
                  <FileText size={12} />
                  {showCostBreakdown ? "Hide" : "View Details"}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-200">Total Cost</p>
                  <p className="text-xl font-bold mt-0.5">
                    ৳{foodCostSummary.totalFoodCost.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    {foodCostSummary.foodCostEntries} days
                  </p>
                </div>
                <div className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-200">Subscribers</p>
                  <p className="text-xl font-bold mt-0.5">
                    {foodCostSummary.activeSubscriptions}
                  </p>
                  <p className="text-xs text-emerald-300 mt-0.5">total</p>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-200">Your Deduction</p>
                  <p className="text-xl font-bold mt-0.5">
                    {foodCostSummary.activeSubscriptions > 0
                      ? `৳${foodCostSummary.perPersonCost.toLocaleString()}`
                      : "—"}
                  </p>
                  <p className="text-xs text-emerald-300 mt-0.5">per person</p>
                </div>
              </div>
            </div>
          )}

          {/* Daily food cost breakdown (toggle) */}
          {foodCostSummary && showCostBreakdown && (
            <Card>
              <CardHead
                title={`Daily Food Cost — ${fmtMonth(month)}`}
                icon={FileText}
                right={
                  <button
                    onClick={() => setShowCostBreakdown(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={15} className="text-gray-400" />
                  </button>
                }
              />
              {foodCostSummary.dailyBreakdown.length === 0 ? (
                <Empty
                  icon={FileText}
                  msg="No entries yet"
                  sub={`No food cost data for ${fmtMonth(month)}`}
                />
              ) : (
                <>
                  <div className="divide-y divide-gray-50">
                    {foodCostSummary.dailyBreakdown.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(r.date).toLocaleDateString("en-BD", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          {r.note && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {r.note}
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          ৳{r.cost.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-5 py-3.5 bg-emerald-50 border-t-2 border-emerald-200">
                    <p className="text-sm font-bold text-emerald-800">Total</p>
                    <p className="text-sm font-bold text-emerald-800">
                      ৳{foodCostSummary.totalFoodCost.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </Card>
          )}

          {eligible && (
            <>
              {/* Subscription card */}
              <Card>
                <div className="bg-[#113F67] px-5 py-4 rounded-t-xl flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-xs text-blue-200 font-semibold uppercase tracking-wide">
                      Monthly Subscription
                    </p>
                    <p className="font-bold text-base mt-0.5">
                      {hasSub ? fmtMonth(month) : "No active plan"}
                    </p>
                  </div>
                  {hasSub ? (
                    <Chip
                      label={subData?.status?.toUpperCase()}
                      s={subData?.status}
                    />
                  ) : (
                    <button
                      onClick={() => setModal("subscribe")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#113F67] text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      <Plus size={14} /> Subscribe
                    </button>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {hasSub ? (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { l: "Preference", v: subData?.preference },
                          {
                            l: "This Month",
                            v: subData?.currentStatus || "none",
                          },
                          {
                            l: "Auto Renew",
                            v: subData?.autoRenew ? "On" : "Off",
                          },
                        ].map(({ l, v }) => (
                          <div
                            key={l}
                            className="bg-gray-50 rounded-xl p-3 text-center"
                          >
                            <p className="text-xs text-gray-400">{l}</p>
                            <p className="font-semibold text-sm text-gray-900 mt-0.5 capitalize">
                              {v || "—"}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Toggle auto-renew */}
                      <div className="flex items-center justify-between py-3 border-t border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Auto Renew
                          </p>
                          <p className="text-xs text-gray-400">
                            Automatically request next month
                          </p>
                        </div>
                        <Toggle
                          on={!!subData?.autoRenew}
                          onChange={async (v) => {
                            try {
                              await api(
                                "/subscription/update-auto-renew",
                                "PUT",
                                { autoRenew: v },
                              );
                              toast.success(
                                `Auto-renew ${v ? "enabled" : "disabled"}`,
                              );
                              loadMySub();
                            } catch (e) {
                              toast.error(e.message);
                            }
                          }}
                        />
                      </div>

                      {subData?.status === "active" && (
                        <button
                          onClick={() =>
                            setConfirmCfg({
                              title: "Cancel Subscription",
                              msg: "You will need admin approval to re-subscribe.",
                              onOk: doCancelSub,
                              danger: true,
                              okLabel: "Cancel Subscription",
                            })
                          }
                          className="w-full py-2.5 mt-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                          Cancel Subscription
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">
                      Subscribe to get meals every month without requesting
                      individually.
                    </p>
                  )}
                </div>
              </Card>

              {/* Request meal quick action */}
              <Card>
                <CardHead
                  title="Daily Meal Request"
                  sub="Request a meal for a specific date"
                  icon={Utensils}
                  right={
                    <button
                      onClick={() => setModal("request")}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#113F67] text-white text-xs font-semibold rounded-xl hover:bg-[#0d3050] transition-colors"
                    >
                      <Plus size={13} /> Request
                    </button>
                  }
                />
                {myMeals.length === 0 ? (
                  <Empty
                    icon={Utensils}
                    msg="No meal requests"
                    sub="Tap Request to get started"
                  />
                ) : (
                  <div className="divide-y divide-gray-50">
                    {myMeals.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              m.status === "approved"
                                ? "bg-emerald-100"
                                : m.status === "pending"
                                  ? "bg-amber-100"
                                  : "bg-gray-100"
                            }`}
                          >
                            {m.status === "approved" ? (
                              <CheckCircle
                                className="text-emerald-600"
                                size={17}
                              />
                            ) : m.status === "pending" ? (
                              <Clock className="text-amber-600" size={17} />
                            ) : (
                              <XCircle className="text-gray-400" size={17} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {fmtDate(m.date)}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {m.preference} · {m.status}
                            </p>
                          </div>
                        </div>
                        {m.status === "pending" && (
                          <button
                            onClick={() =>
                              setConfirmCfg({
                                title: "Cancel this request?",
                                msg: "This cannot be undone.",
                                onOk: () => doCancelMeal(m),
                                danger: true,
                                okLabel: "Cancel Request",
                              })
                            }
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="text-red-400" size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>

        {/* Employee modals */}
        <Modal
          open={modal === "request"}
          title="Request Meal"
          sub="For a specific date"
          onClose={close}
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meal Preference
              </label>
              <PrefPicker
                value={reqF.mealPreference}
                onChange={(v) => setReqF((f) => ({ ...f, mealPreference: v }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={reqF.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setReqF((f) => ({ ...f, date: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Note{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={reqF.note}
                onChange={(e) =>
                  setReqF((f) => ({ ...f, note: e.target.value }))
                }
                rows={2}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
                placeholder="Dietary requirements, allergies…"
              />
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={close}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doRequest}
                disabled={acting}
                className="flex-1 py-2.5 bg-[#113F67] text-white rounded-xl text-sm font-semibold hover:bg-[#0d3050] transition-colors disabled:opacity-50"
              >
                {acting ? <Loader /> : "Send Request"}
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          open={modal === "subscribe"}
          title="Monthly Subscription"
          sub="Subscribe to regular office meals"
          onClose={close}
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preference
              </label>
              <PrefPicker
                value={subF.mealPreference}
                onChange={(v) => setSubF((f) => ({ ...f, mealPreference: v }))}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Auto Renew
                </p>
                <p className="text-xs text-gray-500">
                  Next month auto-requested when approved
                </p>
              </div>
              <Toggle
                on={subF.autoRenew}
                onChange={(v) => setSubF((f) => ({ ...f, autoRenew: v }))}
              />
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={close}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doSetupSub}
                disabled={acting}
                className="flex-1 py-2.5 bg-[#113F67] text-white rounded-xl text-sm font-semibold hover:bg-[#0d3050] transition-colors disabled:opacity-50"
              >
                {acting ? <Loader /> : "Subscribe"}
              </button>
            </div>
          </div>
        </Modal>

        <Confirm
          {...confirmCfg}
          open={!!confirmCfg}
          onCancel={() => setConfirmCfg(null)}
          loading={acting}
        />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ADMIN / MODERATOR VIEW
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6 py-8 space-y-6">
        {/* ── page header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-11 h-11 bg-[#113F67] rounded-xl flex items-center justify-center shadow">
              <Utensils className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Meal Management
              </h1>
              <p className="text-xs text-gray-500">
                Office meal subscriptions &amp; requests
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
            >
              {months7().map((m) => (
                <option key={m} value={m}>
                  {fmtMonth(m)}
                </option>
              ))}
            </select>
            <button
              onClick={() => setModal("createSub")}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#113F67] text-white text-sm font-semibold rounded-xl hover:bg-[#0d3050] transition-colors shadow-sm"
            >
              <Plus size={14} /> New Subscription
            </button>
            <button
              onClick={() => setModal("createMeal")}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Plus size={14} /> New Meal
            </button>
            <button
              onClick={() => {
                loadInboxSubs();
                loadAllSubs();
                loadAllMeals();
                loadDashStats();
              }}
              className="p-2 border border-gray-300 bg-white rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* ── 4 stat cards ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {[
            {
              l: "Active Subscriptions",
              v: dashStats.totalSubscriptions,
              Icon: Package,
              bg: "bg-[#113F67]",
              kind: "subscriptions",
              active: tab === "subscriptions" && subStatus === "active",
            },
            {
              l: "Pending Approvals",
              v: inboxCount,
              Icon: Bell,
              bg: "bg-amber-500",
              kind: "pending",
              active: tab === "inbox",
            },
            {
              l: "Today's Meals",
              v: dashStats.todayMeals,
              Icon: Utensils,
              bg: "bg-emerald-600",
              kind: "today",
              active: tab === "inbox",
            },
            {
              l: "Approved This Month",
              v: dashStats.activeSubscriptions,
              Icon: CheckCircle,
              bg: "bg-indigo-600",
              kind: "approved",
              active: tab === "subscriptions" && subStatus === "active",
            },
          ].map(({ l, v, Icon, bg, kind, active }) => (
            <button
              key={l}
              type="button"
              onClick={() => focusMealSummary(kind)}
              className={`bg-white border rounded-xl p-5 shadow-sm text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                active
                  ? "border-[#113F67] ring-2 ring-[#113F67]/15"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    {l}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {v ?? 0}
                  </p>
                </div>
                <div className={`${bg} p-2.5 rounded-xl hidden md:block`}>
                  <Icon className="text-white" size={16} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Food Cost Per Person Summary ─────────────────────────────────────── */}
        {foodCostSummary && (
          <div className="bg-linear-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-emerald-200" />
              <p className="text-sm font-semibold text-emerald-100">
                Food Cost Summary — {fmtMonth(month)}
              </p>
              {foodCostSummary.foodCostEntries === 0 && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  No entries yet
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="bg-white/15 rounded-xl p-2 md:p-4 text-center">
                <p className="text-xs text-emerald-200 font-medium">
                  Total Food Cost
                </p>
                <p className="text-2xl font-bold mt-1">
                  ৳{foodCostSummary.totalFoodCost.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-300 mt-0.5">
                  {foodCostSummary.foodCostEntries} day
                  {foodCostSummary.foodCostEntries !== 1 ? "s" : ""} entered
                </p>
              </div>
              <div className="bg-white/15 rounded-xl p-2 md:p-4 text-center">
                <p className="text-xs text-emerald-200 font-medium">
                  Active Subscribers
                </p>
                <p className="text-2xl font-bold mt-1">
                  {foodCostSummary.activeSubscriptions}
                </p>
                <p className="text-xs text-emerald-300 mt-0.5">
                  total subscribers
                </p>
              </div>
              <div className="bg-white/15 rounded-xl p-2 md:p-4 text-center">
                <p className="text-xs text-emerald-200 font-medium">
                  Per Person Cost
                </p>
                <p className="text-2xl font-bold mt-1">
                  {foodCostSummary.activeSubscriptions > 0
                    ? `৳${foodCostSummary.perPersonCost.toLocaleString()}`
                    : "—"}
                </p>
                <p className="text-xs text-emerald-300 mt-0.5">
                  salary deduction est.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── tabs ─────────────────────────────────────────────────────────────── */}
        <div className="flex gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
          {ADMIN_TABS.map(({ id, label, Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === id
                  ? "bg-[#113F67] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={15} />
              {label}
              {badge > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] font-bold ${
                    tab === id
                      ? "bg-amber-400 text-gray-900"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            INBOX TAB — ALL requests with review + delete
        ════════════════════════════════════════════════════════════════════ */}
        {tab === "inbox" && (
          <div className="space-y-5">
            {/* ── Section A: All Meal Requests ── */}
            <Card>
              <CardHead
                title="Meal Requests"
                icon={Utensils}
                sub={`${allMealsSorted.length} total · ${pendingMeals.length} pending — ${fmtMonth(month)}`}
                right={
                  pendingMeals.length > 0 ? (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                      {pendingMeals.length} pending
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      All clear
                    </span>
                  )
                }
              />
              {allMealsSorted.length === 0 ? (
                <Empty
                  icon={Utensils}
                  msg="No meal requests"
                  sub={`No requests found for ${fmtMonth(month)}`}
                />
              ) : (
                <div className="divide-y divide-gray-50">
                  {allMealsSorted.map((m, i) => {
                    const src =
                      m.userInfo ||
                      (typeof m.user === "object" ? m.user : null) ||
                      {};
                    const name = src.firstName
                      ? `${src.firstName} ${src.lastName || ""}`.trim()
                      : "Employee";
                    const isPending = m.status === "pending";
                    const isApproved = m.status === "approved";
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${isPending ? "border-l-4 border-l-amber-400" : isApproved ? "border-l-4 border-l-emerald-400" : "border-l-4 border-l-red-300"}`}
                      >
                        {/* status icon */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPending ? "bg-amber-100" : isApproved ? "bg-emerald-100" : "bg-red-100"}`}
                        >
                          {isPending ? (
                            <Clock className="text-amber-600" size={16} />
                          ) : isApproved ? (
                            <CheckCircle
                              className="text-emerald-600"
                              size={16}
                            />
                          ) : (
                            <XCircle className="text-red-500" size={16} />
                          )}
                        </div>

                        {/* info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900">
                              {name}
                            </p>
                            <Chip
                              s={m.status}
                              label={m.status?.toUpperCase()}
                            />
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-gray-500">
                            <span>{src.employeeId || "—"}</span>
                            {src.department && <span>· {src.department}</span>}
                            <span>· {fmtDate(m.date)}</span>
                            <span className="flex items-center gap-0.5 capitalize">
                              ·{" "}
                              {m.preference === "office" ? (
                                <Coffee size={11} />
                              ) : (
                                <Pizza size={11} />
                              )}{" "}
                              {m.preference}
                            </span>
                          </div>
                          {m.notes && (
                            <p className="text-xs text-gray-400 mt-0.5 italic">
                              "{m.notes}"
                            </p>
                          )}
                          {(m.adminNote || m.note) && !isPending && (
                            <p className="text-xs text-blue-500 mt-0.5">
                              Note: "{m.adminNote || m.note}"
                            </p>
                          )}
                        </div>

                        {/* actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isPending && (
                            <button
                              onClick={() => openReview("meal", m)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#113F67] hover:bg-[#0d3050] text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                              Review
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setConfirmCfg({
                                title: "Delete meal request?",
                                msg: `Delete ${name}'s request for ${fmtDate(m.date)}? This cannot be undone.`,
                                onOk: () => doDeleteMeal(m),
                                danger: true,
                                okLabel: "Delete",
                              })
                            }
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* ── Section B: All Subscription Approvals for selected month ── */}
            <Card>
              <CardHead
                title="Subscription Requests"
                icon={Package}
                sub={`${allSubsWithMonth.length} records · ${pendingSubs.length} pending — ${fmtMonth(month)}`}
                right={
                  pendingSubs.length > 0 ? (
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {pendingSubs.length} pending
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      All clear
                    </span>
                  )
                }
              />
              {allSubsWithMonth.length === 0 ? (
                <Empty
                  icon={Package}
                  msg="No subscription records"
                  sub={`No subscription activity for ${fmtMonth(month)}`}
                />
              ) : (
                <div className="divide-y divide-gray-50">
                  {allSubsWithMonth.map((s, i) => {
                    const name =
                      `${s.userInfo?.firstName || ""} ${s.userInfo?.lastName || ""}`.trim() ||
                      "Employee";
                    const pref = s.currentMonthPreference || s.preference;
                    const status = s.currentMonthStatus;
                    const isPending = status === "pending";
                    const isApproved = status === "approved";
                    const approval = s.monthlyApprovals?.find(
                      (a) => a.month === month,
                    );
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${isPending ? "border-l-4 border-l-blue-400" : isApproved ? "border-l-4 border-l-emerald-400" : "border-l-4 border-l-red-300"}`}
                      >
                        {/* status icon */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPending ? "bg-blue-100" : isApproved ? "bg-emerald-100" : "bg-red-100"}`}
                        >
                          {isPending ? (
                            <Clock className="text-blue-600" size={16} />
                          ) : isApproved ? (
                            <CheckCircle
                              className="text-emerald-600"
                              size={16}
                            />
                          ) : (
                            <XCircle className="text-red-500" size={16} />
                          )}
                        </div>

                        {/* info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900">
                              {name}
                            </p>
                            <Chip s={status} label={status?.toUpperCase()} />
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-gray-500">
                            <span>{s.userInfo?.employeeId || "—"}</span>
                            {s.userInfo?.department && (
                              <span>· {s.userInfo.department}</span>
                            )}
                            <span className="flex items-center gap-0.5 capitalize">
                              ·{" "}
                              {pref === "office" ? (
                                <Coffee size={11} />
                              ) : (
                                <Pizza size={11} />
                              )}{" "}
                              {pref}
                            </span>
                            <span>
                              ·{" "}
                              {s.autoRenew ? "Auto-renew ON" : "Auto-renew OFF"}
                            </span>
                          </div>
                          {approval?.note && !isPending && (
                            <p className="text-xs text-blue-500 mt-0.5">
                              Note: "{approval.note}"
                            </p>
                          )}
                        </div>

                        {/* actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isPending && (
                            <button
                              onClick={() => openReview("sub", s)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#113F67] hover:bg-[#0d3050] text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                              Review
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelSub(s);
                              setConfirmCfg({
                                title: "Delete subscription?",
                                msg: `Delete ${name}'s subscription? This cannot be undone.`,
                                onOk: () => doDeleteSub(s),
                                danger: true,
                                okLabel: "Delete",
                              });
                            }}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            SUBSCRIPTIONS TAB
        ════════════════════════════════════════════════════════════════════ */}
        {tab === "subscriptions" && (
          <div className="space-y-4">
            {/* filter bar */}
            <Card className="overflow-visible">
              <div className="flex flex-wrap gap-3 p-4 items-center">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={14}
                  />
                  <input
                    value={subSearch}
                    onChange={(e) => {
                      setSubSearch(e.target.value);
                      setSubsPage(1);
                    }}
                    placeholder="Search name, ID…"
                    className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113F67]/30 w-48"
                  />
                </div>
                <select
                  value={subDept}
                  onChange={(e) => {
                    setSubDept(e.target.value);
                    setSubsPage(1);
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
                >
                  <option value="all">All Departments</option>
                  {depts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={subStatus}
                  onChange={(e) => {
                    setSubStatus(e.target.value);
                    setSubsPage(1);
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                    {allSubs.filter((s) => s.status === "active").length} active
                  </span>
                  <span className="text-gray-400">{subsTotalItems} total</span>
                </div>
              </div>
            </Card>

            {/* subscriptions list */}
            <Card>
              {busy ? (
                <div className="py-14 flex flex-col items-center gap-3">
                  <Loader />
                  <p className="text-sm text-gray-400">Loading…</p>
                </div>
              ) : allSubs.length === 0 ? (
                <Empty
                  icon={Package}
                  msg="No subscriptions found"
                  sub="Try adjusting your filters"
                />
              ) : (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          {[
                            "Employee",
                            "Preference",
                            "Status",
                            "Month",
                            "Auto Renew",
                            "Actions",
                          ].map((h) => (
                            <th
                              key={h}
                              className="py-3 px-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {allSubs.map((s, i) => (
                          <tr
                            key={i}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            {/* employee */}
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-[#113F67]/10 rounded-xl flex items-center justify-center text-sm font-bold text-[#113F67] shrink-0">
                                  {s.userInfo?.firstName?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {s.userInfo?.firstName}{" "}
                                    {s.userInfo?.lastName}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {s.userInfo?.employeeId} ·{" "}
                                    {s.userInfo?.department}
                                  </p>
                                </div>
                              </div>
                            </td>
                            {/* preference */}
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-1.5">
                                {s.preference === "office" ? (
                                  <Coffee
                                    size={14}
                                    className="text-[#113F67]"
                                  />
                                ) : (
                                  <Pizza
                                    size={14}
                                    className="text-orange-500"
                                  />
                                )}
                                <span className="capitalize text-gray-700">
                                  {s.preference}
                                </span>
                              </div>
                            </td>
                            {/* status */}
                            <td className="py-3.5 px-5">
                              <Chip
                                s={s.isPaused ? "paused" : s.status}
                                label={(s.isPaused
                                  ? "paused"
                                  : s.status
                                )?.toUpperCase()}
                              />
                            </td>
                            {/* month approval */}
                            <td className="py-3.5 px-5">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-gray-700">
                                  {fmtMonth(month)}
                                </span>
                                {s.currentMonthStatus &&
                                  s.currentMonthStatus !== "none" && (
                                    <Chip
                                      s={s.currentMonthStatus}
                                      label={s.currentMonthStatus?.toUpperCase()}
                                    />
                                  )}
                              </div>
                            </td>
                            {/* auto renew */}
                            <td className="py-3.5 px-5">
                              <span
                                className={`text-xs font-semibold ${s.autoRenew ? "text-blue-600" : "text-gray-400"}`}
                              >
                                {s.autoRenew ? "ON" : "OFF"}
                              </span>
                            </td>
                            {/* actions */}
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-1.5">
                                {s.currentMonthStatus === "pending" && (
                                  <button
                                    onClick={() => openReview("sub", s)}
                                    className="px-2.5 py-1 bg-[#113F67] hover:bg-[#0d3050] text-white rounded-lg text-xs font-semibold transition-colors"
                                  >
                                    Review
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setSelSub(s);
                                    setEditSubF({
                                      preference: s.preference,
                                      autoRenew: !!s.autoRenew,
                                      status: s.status,
                                      isPaused: !!s.isPaused,
                                      pauseReason: s.pauseReason || "",
                                    });
                                    setModal("editSub");
                                  }}
                                  className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={14} className="text-blue-500" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelSub(s);
                                    setConfirmCfg({
                                      title: "Delete subscription?",
                                      msg: `This will permanently delete ${s.userInfo?.firstName}'s subscription.`,
                                      onOk: () => doDeleteSub(s),
                                      danger: true,
                                      okLabel: "Delete",
                                    });
                                  }}
                                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={14} className="text-red-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* pagination */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      Page {subsPage} of {subsTotalPages} · {subsTotalItems}{" "}
                      subscriptions
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSubsPage((p) => Math.max(1, p - 1))}
                        disabled={subsPage === 1}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={() =>
                          setSubsPage((p) => Math.min(subsTotalPages, p + 1))
                        }
                        disabled={subsPage >= subsTotalPages}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            REPORTS TAB
        ════════════════════════════════════════════════════════════════════ */}
        {tab === "reports" && (
          <div className="space-y-5">
            {/* export button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!foodCostSummary?.dailyBreakdown?.length) {
                    toast.error("No data to export");
                    return;
                  }
                  const rows = [
                    ["Date", "Cost (BDT)", "Note"],
                    ...foodCostSummary.dailyBreakdown.map((r) => [
                      new Date(r.date).toLocaleDateString("en-BD"),
                      r.cost,
                      r.note || "",
                    ]),
                    [],
                    ["Total Food Cost", foodCostSummary.totalFoodCost, ""],
                    [
                      "Active Subscribers",
                      foodCostSummary.activeSubscriptions,
                      "",
                    ],
                    ["Per Person Cost", foodCostSummary.perPersonCost, ""],
                  ];
                  const a = document.createElement("a");
                  a.href =
                    "data:text/csv;charset=utf-8," +
                    encodeURI(rows.map((r) => r.join(",")).join("\n"));
                  a.download = `meal-food-cost-${month}.csv`;
                  a.click();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#113F67] text-white text-sm font-semibold rounded-xl hover:bg-[#0d3050] transition-colors"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            {/* summary cards */}
            {foodCostSummary ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Total Food Cost
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ৳{foodCostSummary.totalFoodCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {foodCostSummary.foodCostEntries} day
                      {foodCostSummary.foodCostEntries !== 1 ? "s" : ""} entered
                      — {fmtMonth(month)}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Active Subscribers
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {foodCostSummary.activeSubscriptions}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      total meal subscribers
                    </p>
                  </div>
                  <div
                    className={`rounded-xl p-5 shadow-sm border ${foodCostSummary.activeSubscriptions > 0 ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-gray-200"}`}
                  >
                    <p
                      className={`text-xs font-semibold uppercase tracking-wide ${foodCostSummary.activeSubscriptions > 0 ? "text-emerald-100" : "text-gray-500"}`}
                    >
                      Per Person Cost
                    </p>
                    <p
                      className={`text-3xl font-bold mt-2 ${foodCostSummary.activeSubscriptions > 0 ? "text-white" : "text-gray-400"}`}
                    >
                      {foodCostSummary.activeSubscriptions > 0
                        ? `৳${foodCostSummary.perPersonCost.toLocaleString()}`
                        : "—"}
                    </p>
                    <p
                      className={`text-xs mt-1 ${foodCostSummary.activeSubscriptions > 0 ? "text-emerald-200" : "text-gray-400"}`}
                    >
                      {foodCostSummary.activeSubscriptions > 0
                        ? `৳${foodCostSummary.totalFoodCost.toLocaleString()} ÷ ${foodCostSummary.activeSubscriptions} জন`
                        : "কোনো subscriber নেই"}
                    </p>
                  </div>
                </div>

                {/* daily breakdown table */}
                <Card>
                  <CardHead
                    title={`Daily Food Cost — ${fmtMonth(month)}`}
                    icon={FileText}
                    right={
                      <span className="text-xs text-gray-400">
                        {foodCostSummary.foodCostEntries} entries
                      </span>
                    }
                  />
                  {foodCostSummary.dailyBreakdown.length === 0 ? (
                    <Empty
                      icon={FileText}
                      msg="No food cost entries"
                      sub={`No data entered for ${fmtMonth(month)}`}
                    />
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              {["#", "Date", "Cost (BDT)", "Note"].map((h) => (
                                <th
                                  key={h}
                                  className="py-3 px-5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {foodCostSummary.dailyBreakdown.map((r, i) => (
                              <tr
                                key={i}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-3 px-5 text-gray-400 text-xs">
                                  {i + 1}
                                </td>
                                <td className="py-3 px-5 font-medium text-gray-900">
                                  {new Date(r.date).toLocaleDateString(
                                    "en-BD",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </td>
                                <td className="py-3 px-5 font-bold text-gray-900">
                                  ৳{r.cost.toLocaleString()}
                                </td>
                                <td className="py-3 px-5 text-gray-500 text-xs">
                                  {r.note || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-emerald-50 border-t-2 border-emerald-200">
                              <td
                                colSpan={2}
                                className="py-3.5 px-5 text-sm font-bold text-emerald-800"
                              >
                                Total
                              </td>
                              <td className="py-3.5 px-5 text-sm font-bold text-emerald-800">
                                ৳
                                {foodCostSummary.totalFoodCost.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-5 text-xs text-emerald-600">
                                {foodCostSummary.activeSubscriptions > 0
                                  ? `Per person: ৳${foodCostSummary.perPersonCost.toLocaleString()}`
                                  : ""}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </>
                  )}
                </Card>
              </>
            ) : (
              <Card>
                <Empty
                  icon={FileText}
                  msg="No report data"
                  sub={`No food cost data for ${fmtMonth(month)}`}
                />
              </Card>
            )}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          ADMIN MODALS
      ════════════════════════════════════════════════════════════════════════ */}

      {/* ── Unified Review Modal (approve / reject with required reason) ── */}
      {reviewItem &&
        (() => {
          const isMeal = reviewItem.type === "meal";
          const it = reviewItem.item;
          const empName = isMeal
            ? (() => {
                const s =
                  it.userInfo ||
                  (typeof it.user === "object" ? it.user : null) ||
                  {};
                return s.firstName
                  ? `${s.firstName} ${s.lastName || ""}`.trim()
                  : "Employee";
              })()
            : `${it.userInfo?.firstName || ""} ${it.userInfo?.lastName || ""}`.trim() ||
              "Employee";
          const empId = isMeal
            ? it.userInfo?.employeeId || it.employeeId || "—"
            : it.userInfo?.employeeId || "—";
          const dept = isMeal
            ? it.userInfo?.department || "—"
            : it.userInfo?.department || "—";
          const canSubmit = reviewReason.trim().length > 0;
          return (
            <Modal
              open
              title={`Review ${isMeal ? "Meal Request" : "Subscription"}`}
              sub={`${empName} · ${empId}`}
              onClose={closeReview}
            >
              <div className="space-y-5">
                {/* Employee info card */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-10 h-10 bg-[#113F67]/10 rounded-xl flex items-center justify-center text-sm font-bold text-[#113F67] shrink-0">
                    {empName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{empName}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>{empId}</span>
                      {dept && dept !== "—" && <span>· {dept}</span>}
                      {isMeal ? (
                        <span>
                          · {fmtDate(it.date)} ·{" "}
                          <span className="capitalize">{it.preference}</span>
                        </span>
                      ) : (
                        <span>
                          · Subscription · {fmtMonth(month)} ·{" "}
                          <span className="capitalize">
                            {it.currentMonthPreference || it.preference}
                          </span>
                        </span>
                      )}
                    </div>
                    {isMeal && it.notes && (
                      <p className="text-xs text-gray-400 italic mt-1">
                        "{it.notes}"
                      </p>
                    )}
                    {!isMeal && it.autoRenew && (
                      <p className="text-xs text-blue-500 mt-1">
                        Auto-renew is ON — next month pending will be created on
                        approval
                      </p>
                    )}
                  </div>
                </div>

                {/* Required reason */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Reason <span className="text-red-500">*</span>
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      (required to approve or reject)
                    </span>
                  </label>
                  <textarea
                    value={reviewReason}
                    onChange={(e) => setReviewReason(e.target.value)}
                    rows={3}
                    maxLength={300}
                    className={`w-full px-4 py-3 text-sm border rounded-xl resize-none focus:outline-none focus:ring-2 transition-colors ${
                      reviewReason.trim()
                        ? "border-gray-300 focus:ring-[#113F67]/30"
                        : "border-orange-300 focus:ring-orange-400/30 bg-orange-50"
                    }`}
                    placeholder="e.g. Approved for this month, Quota exceeded, Please resubmit…"
                    autoFocus
                  />
                  <div className="flex justify-between mt-1">
                    {!reviewReason.trim() ? (
                      <p className="text-xs text-orange-500">
                        Reason is required
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-600">
                        ✓ Reason provided
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {reviewReason.length}/300
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={closeReview}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitReview("reject")}
                    disabled={acting || !canSubmit}
                    className="flex-1 py-2.5 border border-red-300 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
                  >
                    {acting ? <Loader /> : "Reject"}
                  </button>
                  <button
                    onClick={() => submitReview("approve")}
                    disabled={acting || !canSubmit}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
                  >
                    {acting ? <Loader /> : "Approve"}
                  </button>
                </div>
              </div>
            </Modal>
          );
        })()}

      {/* Edit subscription */}
      <Modal
        open={modal === "editSub"}
        title="Edit Subscription"
        sub={
          selSub
            ? `${selSub.userInfo?.firstName} ${selSub.userInfo?.lastName || ""}`
            : ""
        }
        onClose={close}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meal Preference
            </label>
            <PrefPicker
              value={editSubF.preference}
              onChange={(v) => setEditSubF((f) => ({ ...f, preference: v }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Status
            </label>
            <select
              value={editSubF.status}
              onChange={(e) =>
                setEditSubF((f) => ({ ...f, status: e.target.value }))
              }
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-900">Auto Renew</p>
              <p className="text-xs text-gray-400">
                Auto-create next month on approval
              </p>
            </div>
            <Toggle
              on={editSubF.autoRenew}
              onChange={(v) => setEditSubF((f) => ({ ...f, autoRenew: v }))}
            />
          </div>
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Pause Subscription
              </p>
              <p className="text-xs text-gray-400">
                Temporarily suspend without cancelling
              </p>
            </div>
            <Toggle
              on={editSubF.isPaused}
              onChange={(v) => setEditSubF((f) => ({ ...f, isPaused: v }))}
            />
          </div>
          {editSubF.isPaused && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Pause Reason
              </label>
              <input
                type="text"
                value={editSubF.pauseReason}
                onChange={(e) =>
                  setEditSubF((f) => ({ ...f, pauseReason: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
                placeholder="e.g. Employee on medical leave"
              />
            </div>
          )}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={close}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={doEditSub}
              disabled={acting}
              className="flex-1 py-2.5 bg-[#113F67] text-white rounded-xl text-sm font-semibold hover:bg-[#0d3050] transition-colors disabled:opacity-50"
            >
              {acting ? <Loader /> : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Create subscription */}
      <Modal
        open={modal === "createSub"}
        title="Create Subscription"
        sub="Set up a meal plan for an employee"
        onClose={close}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              value={aSubF.userId}
              onChange={(e) =>
                setASubF((f) => ({ ...f, userId: e.target.value }))
              }
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
            >
              <option value="">Select onsite employee…</option>
              {onsiteUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName} ({u.employeeId})
                  {u.department ? ` — ${u.department}` : ""}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Only onsite employees are eligible
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preference
            </label>
            <PrefPicker
              value={aSubF.preference}
              onChange={(v) => setASubF((f) => ({ ...f, preference: v }))}
            />
          </div>
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-900">Auto Renew</p>
              <p className="text-xs text-gray-400">
                Continue subscription each month automatically
              </p>
            </div>
            <Toggle
              on={aSubF.autoRenew}
              onChange={(v) => setASubF((f) => ({ ...f, autoRenew: v }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={aSubF.note}
              onChange={(e) =>
                setASubF((f) => ({ ...f, note: e.target.value }))
              }
              rows={2}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
              placeholder="Internal note…"
            />
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={close}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={doCreateSub}
              disabled={acting || !aSubF.userId}
              className="flex-1 py-2.5 bg-[#113F67] text-white rounded-xl text-sm font-semibold hover:bg-[#0d3050] transition-colors disabled:opacity-50"
            >
              {acting ? <Loader /> : "Create Subscription"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Create meal */}
      <Modal
        open={modal === "createMeal"}
        title="Create Meal"
        sub="For an employee — auto-approved"
        onClose={close}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              value={aMealF.userId}
              onChange={(e) =>
                setAMealF((f) => ({ ...f, userId: e.target.value }))
              }
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
            >
              <option value="">Select onsite employee…</option>
              {onsiteUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName} ({u.employeeId})
                  {u.department ? ` — ${u.department}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preference
            </label>
            <PrefPicker
              value={aMealF.mealPreference}
              onChange={(v) => setAMealF((f) => ({ ...f, mealPreference: v }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={aMealF.date}
              onChange={(e) =>
                setAMealF((f) => ({ ...f, date: e.target.value }))
              }
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={aMealF.note}
              onChange={(e) =>
                setAMealF((f) => ({ ...f, note: e.target.value }))
              }
              rows={2}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
              placeholder="Special requirements…"
            />
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={close}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={doCreateMeal}
              disabled={acting || !aMealF.userId}
              className="flex-1 py-2.5 bg-[#113F67] text-white rounded-xl text-sm font-semibold hover:bg-[#0d3050] transition-colors disabled:opacity-50"
            >
              {acting ? <Loader /> : "Create Meal"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Global confirm dialog */}
      <Confirm
        {...confirmCfg}
        open={!!confirmCfg}
        onCancel={() => setConfirmCfg(null)}
        loading={acting}
      />
    </div>
  );
}
