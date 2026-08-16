"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  Search,
  X,
  Loader2,
  RefreshCw,
  Eye,
  Trash2,
  ChevronDown,
  FileText,
  TrendingUp,
  Calendar,
  Building,
  Banknote,
  AlertTriangle,
  Shield,
  Check,
  XCircle,
  Plus,
  BarChart3,
  Download,
  Pencil,
  Printer,
} from "lucide-react";
import {
  downloadPayrollFullPDF,
  printPayrollFullPDF,
} from "@/components/hrm/PayrollFullPDF";

const API = process.env.NEXT_PUBLIC_HRM_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("moderatorToken") ||
    localStorage.getItem("employeeToken") ||
    localStorage.getItem("token")
  );
}

function getRole() {
  if (typeof window === "undefined") return null;
  try {
    const ad = localStorage.getItem("adminData");
    if (ad) return JSON.parse(ad).role;
    const md = localStorage.getItem("moderatorData");
    if (md) return JSON.parse(md).role || "moderator";
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
  "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] bg-white";

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

const STATUS_CFG = {
  Draft: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
  Pending: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  Approved: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
  Paid: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
  Rejected: {
    bg: "bg-red-100",
    text: "text-red-600",
    border: "border-red-200",
    dot: "bg-red-400",
  },
  Processing: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-400",
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.Draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// Round money UP to a whole number: any real fractional part (e.g. 20,709.25)
// becomes the next integer (20,710). A tiny epsilon ignores floating-point noise
// so values that are effectively whole (20,709.0000001) are not bumped up.
function ceilAmount(n) {
  const v = Number(n) || 0;
  return v - Math.floor(v) > 1e-6 ? Math.ceil(v) : Math.round(v);
}
function fmt(n) {
  if (!n && n !== 0) return "0";
  return ceilAmount(n).toLocaleString("en-BD");
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function Modal({ open, onClose, title, children, wide, slip }) {
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
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full z-10 max-h-[90vh] flex flex-col ${slip ? "max-w-4xl" : wide ? "max-w-2xl" : "max-w-md"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ====================== PAYROLL SLIP ======================
const STATUS_ROW_BG = {
  Present: "bg-emerald-50",
  Early: "bg-teal-50",
  Late: "bg-amber-50",
  Absent: "bg-red-50",
  Leave: "bg-blue-50",
  "Half Day": "bg-purple-50",
  "Unpaid Leave": "bg-orange-50",
  "Half Paid Leave": "bg-pink-50",
  "Govt Holiday": "bg-indigo-50",
  "Company Holiday": "bg-violet-50",
  "Weekly Off": "bg-gray-50",
};
const STATUS_BADGE_CLS = {
  Present: "bg-emerald-100 text-emerald-700",
  Early: "bg-teal-100 text-teal-700",
  Late: "bg-amber-100 text-amber-700",
  Absent: "bg-red-100 text-red-600",
  Leave: "bg-blue-100 text-blue-600",
  "Half Day": "bg-purple-100 text-purple-700",
  "Unpaid Leave": "bg-orange-100 text-orange-700",
  "Half Paid Leave": "bg-pink-100 text-pink-700",
  "Govt Holiday": "bg-indigo-100 text-indigo-600",
  "Company Holiday": "bg-violet-100 text-violet-600",
  "Weekly Off": "bg-gray-100 text-gray-500",
};

// ── Status display: mirror the attendance route EXACTLY so the payroll slip's
// daily log shows the same status label per day (e.g. an "Early" record shows
// as "Present", just like on the attendance page). ──
const VERBATIM_STATUSES = new Set([
  "Absent",
  "Leave",
  "Paid Leave",
  "Unpaid Leave",
  "Half Paid Leave",
  "Sick Leave",
  "Half Day",
  "Govt Holiday",
  "Company Holiday",
  "Weekly Off",
]);
const LATE_GRACE_MIN = 10;
function getLateThreshold(rec) {
  const start = rec?.shift?.start;
  if (start) {
    const [sh, sm] = start.split(":").map(Number);
    return (sh * 60 + sm + LATE_GRACE_MIN) / 60;
  }
  return 9 + LATE_GRACE_MIN / 60;
}
function computeLateMinutes(rec) {
  if (!rec?.clockIn) return 0;
  const dt = new Date(rec.clockIn);
  const clockH = dt.getHours() + dt.getMinutes() / 60;
  const threshold = getLateThreshold(rec);
  if (clockH <= threshold) return 0;
  return Math.round((clockH - threshold) * 60);
}
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function classifyAttRec(rec) {
  const status = rec?.status || "";
  if (status.toLowerCase().includes("leave")) return "leave";
  if (status === "Half Day") return "halfday";
  if (status === "Absent") return "miss";
  if (status === "Late") return "late";
  if (status === "Present" || status === "Early") {
    // Clock-in after the grace threshold (shift start + 10 min, e.g. 09:10) is
    // Late even if stored as Present/Early.
    if (rec?.clockIn) {
      const dt = new Date(rec.clockIn);
      const hours = dt.getHours() + dt.getMinutes() / 60;
      if (hours < 12 && hours > getLateThreshold(rec) + 1e-9) return "late";
    }
    return "present";
  }
  if (!rec?.clockIn) return "miss";
  const dt = new Date(rec.clockIn);
  const hours = dt.getHours() + dt.getMinutes() / 60;
  if (hours >= 12) return "miss";
  if (hours > getLateThreshold(rec) + 1e-9) return "late";
  return "present";
}
const ATT_CLS_LABEL = {
  present: "Present",
  late: "Late",
  miss: "Absent",
  leave: "Leave",
  halfday: "Half Day",
};
// The status label to show for a record — identical to the attendance route.
function attDisplayStatus(rec) {
  const status = rec?.status || "";
  if (VERBATIM_STATUSES.has(status)) return status;
  return ATT_CLS_LABEL[classifyAttRec(rec)] || status || "—";
}

// Duplicate records can exist for the same logical day (mixed UTC/Dhaka
// midnight date encodings in the DB). Resolve deterministically — corrected
// beats auto, then latest update wins — the SAME rule as the attendance page
// and the backend payroll calculation, so all three always agree.
function pickBetterAttRec(a, b) {
  if (!b) return a;
  if (!a) return b;
  const aCorr = a.correctedByAdmin === true;
  const bCorr = b.correctedByAdmin === true;
  if (aCorr !== bCorr) return aCorr ? a : b;
  return new Date(a.updatedAt || 0) >= new Date(b.updatedAt || 0) ? a : b;
}

function fmtTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  });
}

function PayrollDetail({ payroll }) {
  const [attLogs, setAttLogs] = useState([]);
  const [attLoading, setAttLoading] = useState(false);
  const [liveMeal, setLiveMeal] = useState(null); // { perPersonCost, activeSubscriptions, totalFoodCost }
  const [hasMealSub, setHasMealSub] = useState(null); // null=checking, true/false=resolved
  const [pdfLoading, setPdfLoading] = useState(false);
  const [monthHolidays, setMonthHolidays] = useState([]); // Holiday model rows for this month
  const [weeklyOffDays, setWeeklyOffDays] = useState(["Friday", "Saturday"]);

  useEffect(() => {
    if (!payroll?._id) return;
    const empId = (payroll.employee?._id || payroll.employee)?.toString();
    const m = payroll.month;
    const y = payroll.year;
    if (!empId || !m || !y) return;

    let cancelled = false;
    setAttLoading(true);

    const s = `${y}-${String(m).padStart(2, "0")}-01`;
    const e = `${y}-${String(m).padStart(2, "0")}-${new Date(y, m, 0).getDate()}`;
    const monthStr = `${y}-${String(m).padStart(2, "0")}`;
    const hasAdmin =
      typeof window !== "undefined" && !!localStorage.getItem("adminToken");

    // 1. Attendance logs — cache: "no-cache" is required here (same as the
    // attendance route's own fetch): without it the browser can serve a
    // stale cached response for this exact URL after an admin corrects a
    // record, showing the pre-correction clock-in/out on the payroll slip
    // while the attendance page (which already disables caching) shows the
    // corrected data.
    const url = hasAdmin
      ? `${API}/admin/all-records?employeeId=${empId}&startDate=${s}&endDate=${e}&limit=100`
      : `${API}/records?startDate=${s}&endDate=${e}&limit=100`;
    fetch(url, { headers: authHeaders(), cache: "no-cache" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const recs = Array.isArray(data?.records)
          ? data.records
          : Array.isArray(data?.data?.attendance)
            ? data.data.attendance
            : Array.isArray(data?.attendance)
              ? data.attendance
              : Array.isArray(data?.data?.records)
                ? data.data.records
                : Array.isArray(data?.data)
                  ? data.data
                  : [];
        setAttLogs(
          [...recs].sort((a, b) => new Date(a.date) - new Date(b.date)),
        );
      })
      .catch(() => {
        if (!cancelled) setAttLogs([]);
      })
      .finally(() => {
        if (!cancelled) setAttLoading(false);
      });

    // 2. Live meal food cost per-person for this month
    fetch(`${API}/meal/food-cost-per-person?month=${monthStr}`, {
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.data) setLiveMeal(data.data);
      })
      .catch(() => {});

    // 3. Check if this employee has an active meal subscription
    if (hasAdmin) {
      fetch(`${API}/admin/subscriptions/all?limit=200&status=active`, {
        headers: authHeaders(),
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          const subs = data?.subscriptions || [];
          const found = subs.some((sub) => {
            const subEmpId = (sub.user?._id || sub.user)?.toString();
            return (
              subEmpId === empId && sub.status === "active" && !sub.isDeleted
            );
          });
          setHasMealSub(found);
        })
        .catch(() => {
          if (!cancelled) setHasMealSub(false);
        });
    } else {
      fetch(`${API}/subscription/my-details`, { headers: authHeaders() })
        .then((r) => r.json())
        .then((data) => {
          if (!cancelled)
            setHasMealSub(
              !!(data?.hasSubscription && data?.data?.status === "active"),
            );
        })
        .catch(() => {
          if (!cancelled) setHasMealSub(false);
        });
    }

    // 4. Weekly-off config (to hide off-days, like the attendance route)
    fetch(`${API}/weekly-off`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const days = data?.weeklyOffDays || data?.data?.weeklyOffDays;
        if (Array.isArray(days)) setWeeklyOffDays(days);
      })
      .catch(() => {});

    // 5. Holidays for the month (so holiday days aren't shown as Absent)
    fetch(`${API}/holiday?year=${y}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const all = data?.holidays || [];
        setMonthHolidays(
          all.filter((h) => {
            if (!h.isActive) return false;
            const hd = new Date(h.date);
            return (
              hd.getMonth() + 1 === Number(m) && hd.getFullYear() === Number(y)
            );
          }),
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [payroll?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!payroll) return null;

  const emp = payroll.employee || {};
  const sd = payroll.salaryDetails || {};
  const att = payroll.attendance || {};
  const ded = payroll.deductions || {};

  // Live food deduction takes priority over stale DB value
  const savedFoodDeduction =
    payroll.mealSystemData?.mealDeduction?.amount ||
    ded.mealDeduction ||
    ded.foodCostDeduction ||
    0;
  const liveFoodDeduction =
    hasMealSub === true && (liveMeal?.perPersonCost || 0) > 0
      ? liveMeal.perPersonCost
      : 0;
  const foodDeduction = liveFoodDeduction || savedFoodDeduction;

  const mealCalcNote =
    liveMeal && liveMeal.totalFoodCost > 0
      ? `Total food cost ৳${liveMeal.totalFoodCost.toLocaleString()} ÷ ${liveMeal.activeSubscriptions} subscribers`
      : payroll.mealSystemData?.mealDeduction?.calculationNote ||
        payroll.foodCostDetails?.calculationNote ||
        "Total monthly food cost ÷ active subscribers";
  // Admin free-text slip overrides (any empty value falls back to computed)
  const so = payroll.slipOverrides || {};
  const ov = (v, fallback) =>
    v !== undefined && v !== null && v !== "" ? v : fallback;
  const empName = ov(
    so.employeeName,
    emp.firstName
      ? `${emp.firstName} ${emp.lastName}`.trim()
      : payroll.employeeName || "",
  );
  const empId = ov(so.employeeId, emp.employeeId || payroll.employeeId || "");
  const dept = ov(so.department, emp.department || payroll.department || "");
  const desig = ov(
    so.designation,
    emp.designation || payroll.designation || "",
  );

  // Recompute everything on-the-fly from the correct formula so old DB records display correctly
  const utilityBill = sd.utilityBillDeduction ?? 500;
  const adjustedSalary =
    sd.adjustedSalary ?? Math.max(0, (sd.monthlySalary || 0) - utilityBill);
  // If admin manually edited this payroll, trust the stored values.
  const isEdited = payroll.metadata?.isEdited === true;

  // Live attendance counts — computed the SAME way as the attendance route
  // (record-based, not capped at "today"), so the header + salary match the
  // daily log even before the payroll is recalculated on the server.
  const liveAtt = (() => {
    const y = payroll?.year;
    const m = payroll?.month;
    if (!y || !m) return null;
    // While attendance is still loading, fall back to the stored values.
    if (attLoading || !attLogs || attLogs.length === 0) return null;
    const offDayNums = new Set(
      (weeklyOffDays || [])
        .map((n) => DAY_NAMES.indexOf(n))
        .filter((n) => n >= 0),
    );
    const HOL = new Set(["Govt Holiday", "Company Holiday"]);
    const byDay = {};
    const holByDay = {};
    attLogs.forEach((r) => {
      if (!r?.date) return;
      const d = Number(
        new Date(r.date).toLocaleDateString("en-BD", {
          timeZone: "Asia/Dhaka",
          day: "numeric",
        }),
      );
      if (HOL.has(r.status)) holByDay[d] = pickBetterAttRec(r, holByDay[d]);
      else byDay[d] = pickBetterAttRec(r, byDay[d]);
    });
    (monthHolidays || []).forEach((h) => {
      if (!h.date) return;
      const d = Number(
        new Date(h.date).toLocaleDateString("en-BD", {
          timeZone: "Asia/Dhaka",
          day: "numeric",
        }),
      );
      holByDay[d] = holByDay[d] || { status: "Company Holiday" };
    });
    const daysInMonth = new Date(y, m, 0).getDate();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const isCurr = now.getFullYear() === y && now.getMonth() + 1 === m;
    let present = 0,
      late = 0,
      absent = 0,
      half = 0,
      paidLeave = 0,
      unpaidLeave = 0,
      working = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(y, m - 1, d);
      if (offDayNums.has(dateObj.getDay())) continue; // weekly off
      if (holByDay[d]) continue; // holiday → not a working day
      working++;
      const isFuture = isCurr && d > now.getDate();
      const r = byDay[d];
      if (!r) {
        if (!isFuture) absent++; // past working day, no record
        continue;
      }
      const cls = classifyAttRec(r);
      if (cls === "present") present++;
      else if (cls === "late") late++;
      else if (cls === "miss") absent++;
      else if (cls === "halfday") half++;
      else if (cls === "leave") {
        if (/unpaid/i.test(r.status || "")) unpaidLeave++;
        else paidLeave++;
      }
    }
    return {
      present,
      late,
      paidLeave,
      // Business rule (same as the attendance page header): unpaid leave
      // counts as an absent day.
      absent: absent + unpaidLeave,
      half,
      unpaidLeave,
      // Paid days (backend semantics): present + late + paid leave + half·0.5
      presentDays: present + late + paidLeave + half * 0.5,
      workingDays: working,
    };
  })();

  // For a SAVED payroll the stored numbers are the single source of truth —
  // they were computed server-side by calculatePayroll (the same function
  // that drives the attendance-matching logic), so basicPay/deductions/
  // netPayable are all trusted as-is here instead of being re-derived with a
  // second, separate formula that could drift from the backend's. Only a
  // genuine unsaved PREVIEW row (nothing stored yet) falls back to a live,
  // client-side estimate. Admin can press "Recalculate" to refresh a saved
  // payroll's attendance from the server.
  const preferStored = payroll.isPreview !== true;

  // Day counts used ONLY by the live (preview-row) deduction formulas below.
  const lateDaysCalc = liveAtt ? liveAtt.late : att.lateDays || 0;
  const leaveDaysCalc = liveAtt ? liveAtt.unpaidLeave : att.leaveDays || 0;
  const halfDaysCalc = liveAtt ? liveAtt.half : att.halfDays || 0;

  // Full-month working days (divisor) — stored value is authoritative; fall
  // back to the live count.
  const workDays =
    att.totalWorkingDays || (liveAtt ? liveAtt.workingDays : 0) || 1;
  // Present days — stored for saved payrolls, live for preview rows.
  const presentDays =
    preferStored && att.presentDays != null
      ? att.presentDays
      : liveAtt
        ? liveAtt.presentDays
        : att.presentDays || 0;
  // dailyRate is derived from the FULL monthly salary — utility bill no
  // longer comes off the top before dividing by working days (it is
  // deducted LAST, from net payable, below).
  const dailyRate = ceilAmount((sd.monthlySalary || 0) / workDays);

  // Earned pay — SAME formula as the backend and the list row so every view
  // agrees to the taka: ceil(monthlySalary × presentDays ÷ workingDays), any
  // fractional remainder (even 0.001) rounds UP to the next taka.
  // Capped at the full monthly salary so it never overshoots.
  const earnedPay = Math.min(
    sd.monthlySalary || 0,
    ceilAmount(((sd.monthlySalary || 0) * presentDays) / workDays),
  );

  // Partial (in-progress current) month → pay only for elapsed present days.
  const _now = new Date();
  const _monthEnd = new Date(payroll.year, payroll.month, 0);
  const isPartialMonth =
    payroll.year === _now.getFullYear() &&
    payroll.month === _now.getMonth() + 1 &&
    _now < _monthEnd;

  // Basic pay: trust the stored value for any saved payroll; live estimate
  // (earned-so-far for a partial month, else full monthly salary) otherwise.
  const basicPayShown =
    preferStored && payroll.earnings?.basicPay != null
      ? payroll.earnings.basicPay
      : isPartialMonth
        ? earnedPay
        : sd.monthlySalary || 0;
  // For a partial month PREVIEW, absent/leave/half-day are already excluded
  // by paying only for present days, so those live deductions are 0.
  const absentDeduction = preferStored
    ? ded.absentDeduction || 0
    : isPartialMonth
      ? 0
      : (sd.monthlySalary || 0) - earnedPay;
  const lateDeduction = preferStored
    ? ded.lateDeduction || 0
    : Math.floor(lateDaysCalc / 3) * dailyRate;
  const leaveDeduction = preferStored
    ? ded.leaveDeduction || 0
    : isPartialMonth
      ? 0
      : leaveDaysCalc * dailyRate;
  const halfDayDeduction = preferStored
    ? ded.halfDayDeduction || 0
    : isPartialMonth
      ? 0
      : Math.floor((halfDaysCalc * dailyRate) / 2);

  const totalAttendanceDeductions = Math.min(
    absentDeduction + lateDeduction + leaveDeduction + halfDayDeduction,
    basicPayShown,
  );
  const customEarnings = (so.customEarnings || []).filter(
    (i) => (i.label || "") !== "" || Number(i.amount) !== 0,
  );
  const customDeductions = (so.customDeductions || []).filter(
    (i) => (i.label || "") !== "" || Number(i.amount) !== 0,
  );
  const customEarnTotal = customEarnings.reduce(
    (s, i) => s + (Number(i.amount) || 0),
    0,
  );
  const customDedTotal = customDeductions.reduce(
    (s, i) => s + (Number(i.amount) || 0),
    0,
  );

  // Net = basic − attendance deductions − meal + custom earnings − custom deductions.
  // For any saved payroll, the backend-stored netPayable already includes
  // custom adjustments, so use it as-is (no double counting, no re-derivation
  // that could drift from what the backend actually computed) — EXCEPT the
  // meal deduction shown above is a live figure (food cost can be added after
  // the payroll was generated/saved), so any amount beyond what was already
  // baked into the stored value at save time must still be subtracted here.
  const liveFoodDeductionExtra = Math.max(0, foodDeduction - savedFoodDeduction);
  const netPayable =
    preferStored && payroll.summary?.netPayable != null
      ? Math.max(0, payroll.summary.netPayable - liveFoodDeductionExtra)
      : Math.max(
          0,
          basicPayShown -
            totalAttendanceDeductions -
            utilityBill -
            foodDeduction +
            customEarnTotal -
            customDedTotal,
        );

  // Full-month daily list — built with the SAME rules as the attendance route
  // so both views match: weekly-off days are hidden, holiday days show their
  // holiday status, working days with no record show "Absent", and future days
  // (current month) without a record are left out.
  const dailyRows = (() => {
    const y = payroll?.year;
    const m = payroll?.month; // 1-12
    if (!y || !m) return attLogs;

    const offDayNums = new Set(
      (weeklyOffDays || [])
        .map((name) => DAY_NAMES.indexOf(name))
        .filter((n) => n >= 0),
    );
    const HOLIDAY_REC = new Set(["Govt Holiday", "Company Holiday"]);

    const byDay = {};
    const holByDay = {};
    attLogs.forEach((r) => {
      if (!r?.date) return;
      const d = Number(
        new Date(r.date).toLocaleDateString("en-BD", {
          timeZone: "Asia/Dhaka",
          day: "numeric",
        }),
      );
      if (HOLIDAY_REC.has(r.status))
        holByDay[d] = pickBetterAttRec(r, holByDay[d]);
      else byDay[d] = pickBetterAttRec(r, byDay[d]);
    });
    // Holidays from the Holiday model that have no attendance record
    (monthHolidays || []).forEach((h) => {
      if (!h.date) return;
      const d = Number(
        new Date(h.date).toLocaleDateString("en-BD", {
          timeZone: "Asia/Dhaka",
          day: "numeric",
        }),
      );
      if (!holByDay[d]) {
        holByDay[d] = {
          _id: `hol-${y}-${m}-${d}`,
          date: new Date(y, m - 1, d, 12, 0, 0),
          status: h.type === "GOVT" ? "Govt Holiday" : "Company Holiday",
          clockIn: null,
          clockOut: null,
          totalHours: null,
          __synthetic: true,
        };
      }
    });

    const daysInMonth = new Date(y, m, 0).getDate();
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === y && now.getMonth() + 1 === m;
    const rows = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(y, m - 1, d);
      const isFuture = isCurrentMonth && d > now.getDate();
      if (holByDay[d]) {
        rows.push(holByDay[d]);
      } else if (byDay[d]) {
        rows.push(byDay[d]);
      } else if (offDayNums.has(dateObj.getDay())) {
        // Show recurring weekly-off days as their own row (regular calendar).
        rows.push({
          _id: `off-${y}-${m}-${d}`,
          date: new Date(y, m - 1, d, 12, 0, 0),
          status: "Weekly Off",
          clockIn: null,
          clockOut: null,
          totalHours: null,
          __synthetic: true,
        });
      } else if (!isFuture) {
        rows.push({
          _id: `absent-${y}-${m}-${d}`,
          date: new Date(y, m - 1, d, 12, 0, 0),
          status: "Absent",
          clockIn: null,
          clockOut: null,
          totalHours: null,
          __synthetic: true,
        });
      }
      // future day with no record → skip
    }
    return rows;
  })();

  // Assemble the data for the two-page (front: attendance, back: payroll) PDF
  const buildPdfData = () => ({
    company: {
      name: ov(so.companyName, "A2IT Limited"),
      tagline: ov(so.companyTagline, "Marketing agency"),
    },
    labels: so.labels || {},
    employee: {
      name: ov(so.employeeName, empName),
      employeeId: ov(so.employeeId, empId),
      department: ov(so.department, dept),
      designation: ov(so.designation, desig),
    },
    monthLabel: ov(
      so.periodLabel,
      `${MONTHS[(payroll.month || 1) - 1]} ${payroll.year}`,
    ),
    asOfLabel: `As of today — day ${_now.getDate()} • ${presentDays} present`,
    isPartialMonth,
    attendance: {
      days: [...dailyRows]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((r) => ({
          date: r.date,
          dayName: new Date(r.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          name: empName,
          employeeId: empId,
          department: dept,
          shift:
            r.shift?.start && r.shift?.end
              ? `${r.shift.start} - ${r.shift.end}`
              : "-",
          status: attDisplayStatus(r),
          clockIn: r.clockIn,
          clockOut: r.clockOut,
          isLate: classifyAttRec(r) === "late",
          lateMinutes: classifyAttRec(r) === "late" ? computeLateMinutes(r) : 0,
          isEarly: false,
          earlyMinutes: 0,
          totalHours: r.totalHours || 0,
        })),
      summary: {
        totalWorkingDays: workDays,
        presentDays:
          isEdited || preferStored || !liveAtt
            ? att.presentDays
            : liveAtt.present + liveAtt.late + liveAtt.paidLeave,
        absentDays:
          isEdited || preferStored || !liveAtt
            ? att.absentDays
            : liveAtt.absent,
        lateDays:
          isEdited || preferStored || !liveAtt ? att.lateDays : liveAtt.late,
        leaveDays: att.leaveDays,
        halfDays:
          isEdited || preferStored || !liveAtt ? att.halfDays : liveAtt.half,
        weeklyOffs: att.weeklyOffs,
        holidays: att.holidays,
      },
    },
    payroll: {
      monthlySalary: sd.monthlySalary || 0,
      utilityBill,
      adjustedSalary,
      totalWorkingDays: workDays,
      dailyRate,
      presentDays,
      basicPay: basicPayShown,
      overtime:
        payroll.earnings?.overtime?.amount ?? payroll.earnings?.overtime ?? 0,
      bonus: payroll.earnings?.bonus?.amount ?? payroll.earnings?.bonus ?? 0,
      allowance:
        payroll.earnings?.allowance?.amount ?? payroll.earnings?.allowance ?? 0,
      customEarnings,
      customDeductions,
      deductions: {
        absent: absentDeduction,
        late: lateDeduction,
        leave: leaveDeduction,
        halfDay: halfDayDeduction,
        meal: foodDeduction,
      },
      totalDeductions:
        totalAttendanceDeductions +
        utilityBill +
        foodDeduction +
        customDeductions.reduce((s, i) => s + (Number(i.amount) || 0), 0),
      netPayable,
      status: payroll.status,
    },
  });

  const runPdf = async (fn) => {
    setPdfLoading(true);
    try {
      await fn(buildPdfData());
    } catch (e) {
      toast.error("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };
  const handleDownloadPDF = () => runPdf(downloadPayrollFullPDF);
  // The duplex tip is printed inside the PDF (front page), so no page toast is needed here.
  const handlePrintPDF = () => runPdf(printPayrollFullPDF);

  return (
    <div className="space-y-5">
      {/* PDF actions — front: attendance · back: payroll */}
      <div className="flex gap-2">
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading || attLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-[#113F67] text-white py-2.5 rounded-lg font-medium hover:bg-[#0d3254] disabled:opacity-60 transition-colors"
          title="Download 2-page PDF — front: full month attendance, back: payroll as of today"
        >
          {pdfLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Download size={15} />
          )}
          Download PDF
        </button>
        <button
          onClick={handlePrintPDF}
          disabled={pdfLoading || attLoading}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-[#113F67] text-[#113F67] py-2.5 rounded-lg font-medium hover:bg-[#113F67]/5 disabled:opacity-60 transition-colors"
          title="Print the 2-page payroll PDF"
        >
          {pdfLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Printer size={15} />
          )}
          Print
        </button>
      </div>

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-[#113F67] to-[#1e5c94] rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1.5">
              Salary Slip
            </p>
            <p className="font-bold text-xl leading-tight">{empName}</p>
            <p className="text-white/70 text-sm mt-0.5">{empId}</p>
            <p className="text-white/55 text-xs mt-0.5">
              {dept}
              {desig ? ` • ${desig}` : ""}
            </p>
          </div>
          <div className="text-right shrink-0">
            <StatusBadge status={payroll.status} />
            <p className="text-white/80 text-sm font-bold mt-2">
              {ov(
                so.periodLabel,
                `${MONTHS[payroll.month - 1]} ${payroll.year}`,
              )}
            </p>
            <p className="text-white/45 text-xs">
              {att.totalWorkingDays} working days
            </p>
            {isPartialMonth && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-400/90 text-[#113F67] text-[10px] font-bold">
                As of today · {presentDays} day(s) worked
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-4 gap-2 text-center">
          {[
            {
              label: "Present",
              sub: "incl. late",
              val:
                isEdited || preferStored || !liveAtt
                  ? att.presentDays
                  : liveAtt.present + liveAtt.late + liveAtt.paidLeave,
              cls: "text-emerald-300",
            },
            {
              label: "Late",
              sub: "→ deducted",
              val:
                isEdited || preferStored || !liveAtt
                  ? att.lateDays
                  : liveAtt.late,
              cls: "text-amber-300",
            },
            {
              label: "Absent",
              sub: null,
              val:
                isEdited || preferStored || !liveAtt
                  ? att.absentDays
                  : liveAtt.absent,
              cls: "text-red-300",
            },
            {
              label: "Working Days",
              sub: null,
              val: workDays,
              cls: "text-white",
            },
          ].map(({ label, sub, val, cls }) => (
            <div key={label}>
              <p className={`text-2xl font-bold ${cls}`}>{val ?? "--"}</p>
              <p className="text-white/45 text-[10px] mt-0.5">{label}</p>
              {sub && <p className="text-white/30 text-[9px]">{sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Daily Attendance Log ── */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Calendar size={11} /> Daily Attendance Log
        </h4>
        {attLoading ? (
          <div className="space-y-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : dailyRows.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
            No attendance records found for this period
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[520px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-500 text-[10px] uppercase tracking-wide">
                    <th className="px-3 py-2.5 text-left font-semibold">
                      Date
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold">
                      Status
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold">
                      Clock In
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold">
                      Clock Out
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold">
                      Hours
                    </th>
                    <th className="px-3 py-2.5 text-center font-semibold">
                      Late / Early
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dailyRows.map((rec) => {
                    // Show the SAME computed status label as the attendance route
                    const dispStatus = attDisplayStatus(rec);
                    const rowBg = STATUS_ROW_BG[dispStatus] || "bg-white";
                    const badge =
                      STATUS_BADGE_CLS[dispStatus] ||
                      "bg-gray-100 text-gray-600";
                    // Late minutes computed the same way as the attendance route
                    const late =
                      classifyAttRec(rec) === "late"
                        ? computeLateMinutes(rec)
                        : 0;
                    const early = 0; // attendance route does not show "early"
                    const cin = fmtTime(rec.clockIn);
                    const cout = fmtTime(rec.clockOut);
                    return (
                      <tr key={rec._id} className={rowBg}>
                        <td className="px-3 py-2.5">
                          <span className="font-semibold text-gray-800">
                            {new Date(rec.date).toLocaleDateString("en-BD", {
                              day: "2-digit",
                              month: "short",
                              timeZone: "Asia/Dhaka",
                            })}
                          </span>
                          <span className="text-gray-400 ml-1.5">
                            {new Date(rec.date).toLocaleDateString("en-BD", {
                              weekday: "short",
                              timeZone: "Asia/Dhaka",
                            })}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge}`}
                          >
                            {dispStatus}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-gray-700">
                          {cin || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono text-gray-700">
                          {cout || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 text-center text-gray-600">
                          {rec.totalHours != null ? (
                            `${Number(rec.totalHours).toFixed(1)}h`
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center font-semibold">
                          {late > 0 ? (
                            <span className="text-amber-600">
                              +{late}m late
                            </span>
                          ) : early > 0 ? (
                            <span className="text-teal-600">
                              −{early}m early
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Salary Calculation ── */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <DollarSign size={11} /> Salary Calculation
        </h4>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Step 1: Monthly Salary */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 border-b border-gray-200">
            <div>
              <p className="font-bold text-gray-800">Monthly Salary</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Gross salary before any deduction
              </p>
            </div>
            <p className="font-bold text-gray-800 text-lg">
              BDT {fmt(sd.monthlySalary)}
            </p>
          </div>

          {/* Step 2: Daily Rate (from full monthly salary) */}
          <div className="flex items-center justify-between px-4 py-3.5  border-b border-blue-100">
            <div>
              <p className="font-bold text-blue-800">
                {isPartialMonth
                  ? "Earned so far (as of today)"
                  : "Basic Pay"}
              </p>
              <p className="text-xs text-blue-500 mt-0.5">
                {isPartialMonth ? (
                  <>
                    BDT {fmt(sd.monthlySalary)} ÷ {workDays} working days ×{" "}
                    {presentDays} present day(s) = BDT {fmt(basicPayShown)}
                  </>
                ) : (
                  <>
                    Daily rate: BDT {fmt(sd.monthlySalary)} ÷ {workDays}{" "}
                    working days = BDT {fmt(dailyRate)}
                  </>
                )}
              </p>
            </div>
            <p className="font-bold text-blue-800 text-lg">
              BDT {fmt(basicPayShown)}
            </p>
          </div>

          {/* Step 3: Attendance Deductions */}
          {(absentDeduction > 0 ||
            lateDeduction > 0 ||
            leaveDeduction > 0 ||
            halfDayDeduction > 0) && (
            <div className="px-4 pt-3 pb-4 space-y-3 border-b border-gray-200 bg-red-50/30">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                Attendance Deductions
              </p>

              {absentDeduction > 0 && (
                <div className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">Absent</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {presentDays}/{workDays} days present → earned BDT{" "}
                      {fmt(earnedPay)} → deduction BDT {fmt(sd.monthlySalary)} −
                      BDT {fmt(earnedPay)}
                    </p>
                  </div>
                  <span className="font-semibold text-red-600 shrink-0">
                    − BDT {fmt(absentDeduction)}
                  </span>
                </div>
              )}

              {(lateDaysCalc > 0 || lateDeduction > 0) && (
                <div className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">Late Attendance</p>
                    {lateDaysCalc >= 3 ? (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {lateDaysCalc} late days ÷ 3 ={" "}
                        {Math.floor(lateDaysCalc / 3)} day(s) × BDT{" "}
                        {fmt(dailyRate)}
                      </p>
                    ) : (
                      <p className="text-xs text-amber-500 mt-0.5">
                        {lateDaysCalc} late day(s) — need 3 for a deduction
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-semibold shrink-0 ${lateDeduction > 0 ? "text-red-600" : "text-gray-400"}`}
                  >
                    {lateDeduction > 0
                      ? `− BDT ${fmt(lateDeduction)}`
                      : "BDT 0"}
                  </span>
                </div>
              )}

              {leaveDeduction > 0 && (
                <div className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">Unpaid Leave</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {att.leaveDays} day(s) × BDT {fmt(dailyRate)}
                    </p>
                  </div>
                  <span className="font-semibold text-red-600 shrink-0">
                    − BDT {fmt(leaveDeduction)}
                  </span>
                </div>
              )}

              {halfDayDeduction > 0 && (
                <div className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">Half Day</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {att.halfDays} × BDT {fmt(Math.round(dailyRate / 2))} per
                      half-day
                    </p>
                  </div>
                  <span className="font-semibold text-red-600 shrink-0">
                    − BDT {fmt(halfDayDeduction)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Total Attendance Deductions */}
          <div className="flex items-center justify-between px-4 py-3  border-b border-gray-200">
            <p className="font-bold text-red-700">
              Total Attendance Deductions
            </p>
            <p className="font-bold text-red-700">
              − BDT {fmt(totalAttendanceDeductions)}
            </p>
          </div>

          {/* Step 4: Utility Bill — deducted LAST, after attendance deductions */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-orange-100">
            <div>
              <p className="font-medium text-orange-800 flex items-center gap-1.5">
                Utility Bill (Khala Bill)
              </p>
              <p className="text-xs text-orange-500 mt-0.5">
                Fixed deduction — mandatory for all employees
              </p>
            </div>
            <span className="font-semibold text-orange-700 shrink-0">
              − BDT {fmt(utilityBill)}
            </span>
          </div>

          {/* Step 5: Meal Deduction (separate, after attendance) */}
          {foodDeduction > 0 && (
            <div className="flex items-center justify-between px-4 py-3.5  border-b border-purple-100">
              <div>
                <p className="font-medium text-purple-800 flex items-center gap-1.5">
                  Meal Deduction
                </p>
                <p className="text-xs text-purple-500 mt-0.5">
                  {mealCalcNote ||
                    "Total monthly food cost ÷ active subscribers"}
                </p>
              </div>
              <span className="font-semibold text-purple-700 shrink-0">
                − BDT {fmt(foodDeduction)}
              </span>
            </div>
          )}

          {/* Custom earnings / deductions added by admin */}
          {(customEarnings.length > 0 || customDeductions.length > 0) && (
            <div className="px-4 pt-3 pb-4 space-y-2 border-b border-gray-200">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Custom Adjustments
              </p>
              {customEarnings.map((it, i) => (
                <div
                  key={`ce-${i}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <p className="font-medium text-gray-800">
                    {it.label || "Earning"}
                  </p>
                  <span className="font-semibold text-emerald-600 shrink-0">
                    + BDT {fmt(it.amount)}
                  </span>
                </div>
              ))}
              {customDeductions.map((it, i) => (
                <div
                  key={`cd-${i}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <p className="font-medium text-gray-800">
                    {it.label || "Deduction"}
                  </p>
                  <span className="font-semibold text-red-600 shrink-0">
                    − BDT {fmt(it.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Net Payable */}
          <div className="flex items-center justify-between px-5 py-5 bg-gradient-to-r from-[#113F67] to-[#1e5c94]">
            <div>
              <p className="text-white/55 text-[11px] uppercase tracking-widest">
                Net Payable
              </p>
              {foodDeduction > 0 && (
                <p className="text-white/40 text-[10px] mt-0.5">
                  After meal deduction of BDT {fmt(foodDeduction)}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                BDT {fmt(netPayable)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Deduction Rules ── */}
      <div className=" border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 space-y-1.5">
        <p className="font-bold text-amber-900 mb-1">
          How This Payroll Was Calculated
        </p>
        <p>
          ① Daily rate = monthly salary <strong>BDT {fmt(sd.monthlySalary)}</strong>{" "}
          ÷ {att.totalWorkingDays} working days ={" "}
          <strong>BDT {fmt(dailyRate)}</strong>
        </p>
        <p>
          ② <strong>Late days count as Present.</strong> Every{" "}
          <strong>3 late days</strong> = 1 day salary deduction (BDT{" "}
          {fmt(dailyRate)})
        </p>
        <p>
          ③ Absent deduction = monthly salary − earned pay for present days (
          {att.presentDays}/{att.totalWorkingDays})
        </p>
        {leaveDeduction > 0 && (
          <p>
            ④ <strong>Unpaid leave</strong> deducted at daily rate (paid leave
            is not deducted)
          </p>
        )}
        <p>
          ⑤ Utility bill (Khala Bill) <strong>BDT {fmt(utilityBill)}</strong>{" "}
          is deducted last, after attendance deductions
        </p>
        {foodDeduction > 0 && (
          <p>
            ⑥ <strong>Meal deduction</strong> = total monthly food cost ÷ active
            subscribers
          </p>
        )}
      </div>
    </div>
  );
}

// ====================== BULK GENERATE MODAL ======================
function BulkGenerateModal({ open, onClose, onGenerate, loading }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <Modal open={open} onClose={onClose} title="Bulk Generate Payroll">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Generate payroll for all active employees for the selected period.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              className={INP}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              className={INP}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
          <AlertTriangle size={14} className="inline mr-1" />
          Payrolls already generated for this period will be skipped.
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onGenerate(month, year)}
            disabled={loading}
            className="flex-1 bg-[#113F67] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0d3254] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Generate
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ====================== ADMIN VIEW ======================
// ====================== EDIT PAYROLL MODAL (full override) ======================
// Built-in slip rows whose printed label the admin may rename.
const SLIP_LABEL_FIELDS = [
  ["sheetTitle", "Sheet Title", "MONTHLY ATTENDANCE & PAYROLL SHEET"],
  ["salaryBasis", "Salary Basis (heading)", "Salary Basis"],
  ["monthlySalary", "Monthly Salary (row)", "Monthly Salary"],
  ["utilityBill", "Utility Bill (row)", "Utility Bill (fixed)"],
  ["dailyRate", "Daily Rate (row)", "Daily Rate"],
  ["earnings", "Earnings (heading)", "Earnings"],
  ["basicPay", "Basic Pay (row)", "Basic Pay"],
  ["overtime", "Overtime (row)", "Overtime"],
  ["bonus", "Bonus (row)", "Bonus"],
  ["allowance", "Allowance (row)", "Allowance"],
  ["deductions", "Deductions (heading)", "Deductions"],
  ["absent", "Absent (row)", "Absent"],
  ["late", "Late (row)", "Late (3 lates = 1 day)"],
  ["leave", "Unpaid Leave (row)", "Unpaid Leave"],
  ["halfDay", "Half Day (row)", "Half Day"],
  ["meal", "Meal Deduction (row)", "Meal Deduction"],
  ["totalDeductions", "Total Deductions (row)", "Total Deductions"],
  ["netPayable", "Net Payable (row)", "Net Payable"],
];

function EditPayrollModal({ payroll, onClose, onSaved, initialMealDeduction }) {
  const p = payroll || {};
  const sd = p.salaryDetails || {};
  const e = p.earnings || {};
  const a = p.attendance || {};
  const d = p.deductions || {};
  const so = p.slipOverrides || {};
  const [saving, setSaving] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [tab, setTab] = useState("earnings"); // earnings | deductions | attendance | text

  // Effective current text values (override if set, else computed)
  const computedName = p.employee?.firstName
    ? `${p.employee.firstName} ${p.employee.lastName || ""}`.trim()
    : p.employeeName || "";
  const computedId = p.employee?.employeeId || p.employeeId || "";
  const computedDept = p.employee?.department || p.department || "";
  const computedDesig = p.employee?.designation || p.designation || "";
  const computedPeriod = `${MONTHS[(p.month || 1) - 1]} ${p.year || ""}`.trim();

  const [form, setForm] = useState({
    // Text / identity (slip overrides)
    companyName: so.companyName ?? "A2IT Limited",
    companyTagline: so.companyTagline ?? "Marketing agency",
    employeeName: so.employeeName ?? computedName,
    employeeIdText: so.employeeId ?? computedId,
    department: so.department ?? computedDept,
    designation: so.designation ?? computedDesig,
    periodLabel: so.periodLabel ?? computedPeriod,
    // Salary basis
    monthlySalary: sd.monthlySalary ?? 0,
    utilityBill: sd.utilityBillDeduction ?? 500,
    basicPay: e.basicPay ?? 0,
    status: p.status || "Pending",
    notes: p.notes || "",
    totalWorkingDays: a.totalWorkingDays ?? 0,
    presentDays: a.presentDays ?? 0,
    absentDays: a.absentDays ?? 0,
    lateDays: a.lateDays ?? 0,
    leaveDays: a.leaveDays ?? 0,
    halfDays: a.halfDays ?? 0,
    overtime: e.overtime?.amount ?? 0,
    overtimeHours: e.overtime?.hours ?? 0,
    bonus: e.bonus?.amount ?? 0,
    allowance: e.allowance?.amount ?? 0,
    lateDeduction: d.lateDeduction ?? 0,
    absentDeduction: d.absentDeduction ?? 0,
    leaveDeduction: d.leaveDeduction ?? 0,
    halfDayDeduction: d.halfDayDeduction ?? 0,
    // Prefer the meal deduction the list/cards actually show (live-or-saved,
    // passed from the parent) so the edit modal's net matches the row net.
    mealDeduction:
      initialMealDeduction != null
        ? initialMealDeduction
        : (p.mealDeduction?.totalDeductionAmount ??
          d.mealDeduction ??
          p.mealSystemData?.mealDeduction?.amount ??
          p.foodCostDetails?.totalFoodDeduction ??
          0),
  });

  // Custom line items + label renames
  const [customEarnings, setCustomEarnings] = useState(
    (so.customEarnings || []).map((i) => ({
      label: i.label || "",
      amount: i.amount ?? 0,
    })),
  );
  const [customDeductions, setCustomDeductions] = useState(
    (so.customDeductions || []).map((i) => ({
      label: i.label || "",
      amount: i.amount ?? 0,
    })),
  );
  const [labels, setLabels] = useState({ ...(so.labels || {}) });

  const set = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));
  const nOr0 = (v) =>
    v === "" || v === null || isNaN(Number(v)) ? 0 : Number(v);

  const setLabel = (k) => (ev) =>
    setLabels((l) => ({ ...l, [k]: ev.target.value }));

  // Custom item row helpers
  const addItem = (setter) => () =>
    setter((rows) => [...rows, { label: "", amount: "" }]);
  const removeItem = (setter) => (idx) =>
    setter((rows) => rows.filter((_, i) => i !== idx));
  const updateItem = (setter) => (idx, key, val) =>
    setter((rows) =>
      rows.map((r, i) => (i === idx ? { ...r, [key]: val } : r)),
    );

  const customEarnTotal = customEarnings.reduce(
    (s, i) => s + nOr0(i.amount),
    0,
  );
  const customDedTotal = customDeductions.reduce(
    (s, i) => s + nOr0(i.amount),
    0,
  );

  // Live net preview
  const gross =
    nOr0(form.basicPay) +
    nOr0(form.overtime) +
    nOr0(form.bonus) +
    nOr0(form.allowance) +
    customEarnTotal;
  const totalDed =
    nOr0(form.lateDeduction) +
    nOr0(form.absentDeduction) +
    nOr0(form.leaveDeduction) +
    nOr0(form.halfDayDeduction) +
    nOr0(form.mealDeduction) +
    customDedTotal;
  const net = Math.max(0, gross - totalDed);

  // inline field helpers (functions, NOT components — avoids input focus loss)
  const numField = (label, k) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input type="number" className={INP} value={form[k]} onChange={set(k)} />
    </div>
  );
  const txtField = (label, k, placeholder = "") => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type="text"
        className={INP}
        value={form[k]}
        onChange={set(k)}
        placeholder={placeholder}
      />
    </div>
  );

  // Dynamic custom-item editor block
  const customBlock = (title, rows, setter, sign) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-[#113F67] uppercase tracking-wide">
          {title}
        </p>
        <button
          type="button"
          onClick={addItem(setter)}
          className="text-xs font-medium text-[#113F67] border border-[#113F67] rounded px-2 py-1 hover:bg-[#113F67]/5"
        >
          + Add row
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="text-[11px] text-gray-400">No custom rows.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] focus:border-transparent"
                placeholder="Label (e.g. Festival Bonus)"
                value={r.label}
                onChange={(ev) =>
                  updateItem(setter)(i, "label", ev.target.value)
                }
              />
              <input
                type="number"
                className="w-28 shrink-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] focus:border-transparent"
                placeholder="Amount"
                value={r.amount}
                onChange={(ev) =>
                  updateItem(setter)(i, "amount", ev.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeItem(setter)(i)}
                className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 border border-red-200 rounded"
                title="Remove row"
              >
                ✕
              </button>
            </div>
          ))}
          <p className="text-[11px] text-gray-500">
            Subtotal: {sign} BDT{" "}
            {fmt(sign === "-" ? customDedTotal : customEarnTotal)}
          </p>
        </div>
      )}
    </div>
  );

  const save = async () => {
    setSaving(true);
    try {
      const cleanRows = (rows) =>
        rows
          .map((r) => ({
            label: (r.label || "").trim(),
            amount: nOr0(r.amount),
          }))
          .filter((r) => r.label !== "" || r.amount !== 0);

      const res = await fetch(`${API}/payroll/${p._id}/edit`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlySalary: nOr0(form.monthlySalary),
          basicPay: nOr0(form.basicPay),
          status: form.status,
          notes: form.notes,
          overtime: nOr0(form.overtime),
          overtimeHours: nOr0(form.overtimeHours),
          bonus: nOr0(form.bonus),
          allowance: nOr0(form.allowance),
          mealDeduction: nOr0(form.mealDeduction),
          mealDeductionType: "manual",
          attendance: {
            totalWorkingDays: nOr0(form.totalWorkingDays),
            presentDays: nOr0(form.presentDays),
            absentDays: nOr0(form.absentDays),
            lateDays: nOr0(form.lateDays),
            leaveDays: nOr0(form.leaveDays),
            halfDays: nOr0(form.halfDays),
          },
          deductions: {
            lateDeduction: nOr0(form.lateDeduction),
            absentDeduction: nOr0(form.absentDeduction),
            leaveDeduction: nOr0(form.leaveDeduction),
            halfDayDeduction: nOr0(form.halfDayDeduction),
          },
          // Free-text slip overrides + custom line items
          slipOverrides: {
            companyName: form.companyName,
            companyTagline: form.companyTagline,
            employeeName: form.employeeName,
            employeeId: form.employeeIdText,
            department: form.department,
            designation: form.designation,
            periodLabel: form.periodLabel,
            labels,
            customEarnings: cleanRows(customEarnings),
            customDeductions: cleanRows(customDeductions),
          },
        }),
      });
      const data = await res.json();
      if (res.ok && (data.status === "success" || data.success)) {
        toast.success("Payroll updated");
        onSaved?.();
        onClose?.();
      } else {
        toast.error(data?.message || "Failed to update payroll");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={!!payroll}
      onClose={onClose}
      title={`Edit Payroll — ${p.employee?.firstName || p.employeeName || ""} ${p.employee?.lastName || ""}`.trim()}
      wide
    >
      <div className="space-y-4">
        {/* Always-visible: Status + Notes (most common quick edits) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              className={INP}
              value={form.status}
              onChange={set("status")}
            >
              {[
                "Draft",
                "Pending",
                "Approved",
                "Paid",
                "Rejected",
                "Processing",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Notes
            </label>
            <input
              type="text"
              className={INP}
              value={form.notes}
              onChange={set("notes")}
              placeholder="Reason / remark"
            />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-gray-200">
          {[
            ["earnings", "Earnings"],
            ["deductions", "Deductions"],
            ["attendance", "Attendance"],
            ["text", "Slip Text"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-3.5 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
                tab === key
                  ? "border-[#113F67] text-[#113F67]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[240px] max-h-[46vh] overflow-y-auto pr-1 space-y-5">
          {tab === "earnings" && (
            <>
              <div>
                <p className="text-xs font-bold text-[#113F67] uppercase tracking-wide mb-2">
                  Salary Basis
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {numField("Monthly Salary", "monthlySalary")}
                  {numField("Utility Bill (fixed)", "utilityBill")}
                  {numField("Basic Pay (earned)", "basicPay")}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-[#113F67] uppercase tracking-wide mb-2">
                  Earnings
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {numField("Overtime (BDT)", "overtime")}
                  {numField("Overtime Hours", "overtimeHours")}
                  {numField("Bonus (BDT)", "bonus")}
                  {numField("Allowance (BDT)", "allowance")}
                </div>
              </div>
              {customBlock(
                "Custom Earnings",
                customEarnings,
                setCustomEarnings,
                "+",
              )}
            </>
          )}

          {tab === "deductions" && (
            <>
              <div>
                <p className="text-xs font-bold text-[#113F67] uppercase tracking-wide mb-2">
                  Deductions
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {numField("Late Deduction", "lateDeduction")}
                  {numField("Absent Deduction", "absentDeduction")}
                  {numField("Leave Deduction", "leaveDeduction")}
                  {numField("Half Day Deduction", "halfDayDeduction")}
                  {numField("Meal Deduction", "mealDeduction")}
                </div>
              </div>
              {customBlock(
                "Custom Deductions",
                customDeductions,
                setCustomDeductions,
                "-",
              )}
            </>
          )}

          {tab === "attendance" && (
            <div>
              <p className="text-xs font-bold text-[#113F67] uppercase tracking-wide mb-2">
                Attendance
              </p>
              <div className="grid grid-cols-3 gap-3">
                {numField("Working Days", "totalWorkingDays")}
                {numField("Present", "presentDays")}
                {numField("Absent", "absentDays")}
                {numField("Late", "lateDays")}
                {numField("Leave", "leaveDays")}
                {numField("Half Days", "halfDays")}
              </div>
              <p className="text-[11px] text-gray-400 mt-3">
                These counts are manual overrides — they do not recalculate the
                deductions automatically. Use the Recalculate button on the row
                to re-sync from attendance records.
              </p>
            </div>
          )}

          {tab === "text" && (
            <>
              <div>
                <p className="text-xs font-bold text-[#113F67] uppercase tracking-wide mb-2">
                  Slip Header & Identity
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {txtField("Company Name", "companyName")}
                  {txtField("Company Tagline", "companyTagline")}
                  {txtField("Employee Name", "employeeName")}
                  {txtField("Employee ID", "employeeIdText")}
                  {txtField("Department", "department")}
                  {txtField("Designation", "designation")}
                  {txtField("Period Label", "periodLabel", "e.g. July 2026")}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setShowLabels((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[#113F67] uppercase tracking-wide"
                >
                  Rename Slip Labels
                  <span>{showLabels ? "−" : "+"}</span>
                </button>
                {showLabels && (
                  <div className="grid grid-cols-2 gap-3 p-3 pt-0">
                    {SLIP_LABEL_FIELDS.map(([key, lbl, ph]) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {lbl}
                        </label>
                        <input
                          type="text"
                          className={INP}
                          value={labels[key] ?? ""}
                          onChange={setLabel(key)}
                          placeholder={ph}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Live net preview — always visible */}
        <div className="flex items-center justify-between bg-[#113F67] text-white rounded-lg px-4 py-3">
          <div className="text-xs">
            <span className="text-white/60">Gross</span> BDT {fmt(gross)}
            <span className="text-white/60 ml-3">Deductions</span> - BDT{" "}
            {fmt(totalDed)}
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/60 uppercase">Net Payable</p>
            <p className="text-xl font-bold">BDT {fmt(net)}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 bg-[#113F67] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0d3254] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}

function AdminView() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewPayroll, setViewPayroll] = useState(null);
  const [deletePayroll, setDeletePayroll] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [showBulk, setShowBulk] = useState(false);
  const [liveMealSummary, setLiveMealSummary] = useState(null); // { perPersonCost, ... }
  const [activeSubIds, setActiveSubIds] = useState(new Set()); // Set of employee ID strings with active subscription
  const [previewRows, setPreviewRows] = useState([]); // live "as of today" preview for employees without a saved payroll
  const [previewLoading, setPreviewLoading] = useState(true); // preview-all is slow → gate empty-state on it
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  // Fetch a live "as of today" preview for the selected period (all active employees).
  // Shows the pro-rated current-month payroll even before it has been generated,
  // and works for moderators (who cannot read the saved /payroll/all list).
  useEffect(() => {
    let cancelled = false;
    setPreviewLoading(true);
    setPreviewRows([]); // period changed → drop stale rows (empty-state stays gated by previewLoading)

    // preview-all runs a full payroll calc per employee, so on a cold backend it
    // can 500 / hang. Retry a few times and NEVER blank the list on a transient
    // error — keep the last good rows so the admin list doesn't flicker to empty.
    const load = async (attempt = 0) => {
      try {
        const res = await fetch(
          `${API}/payroll/preview-all?month=${filterMonth}&year=${filterYear}`,
          { headers: authHeaders() },
        );
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && Array.isArray(data?.data?.payrolls)) {
          setPreviewRows(data.data.payrolls);
          setPreviewLoading(false);
        } else {
          throw new Error(data?.message || "preview-all failed");
        }
      } catch (e) {
        if (cancelled) return;
        if (attempt < 3) {
          setTimeout(
            () => !cancelled && load(attempt + 1),
            1200 * (attempt + 1),
          );
        } else {
          // Give up after retries — stop the spinner, keep whatever we had
          setPreviewLoading(false);
        }
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [filterMonth, filterYear]);

  // Fetch live meal cost summary + active subscriber list whenever the filter month changes
  useEffect(() => {
    const monthStr = `${filterYear}-${String(filterMonth).padStart(2, "0")}`;
    let cancelled = false;

    fetch(`${API}/meal/food-cost-per-person?month=${monthStr}`, {
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.data) setLiveMealSummary(data.data);
      })
      .catch(() => {});

    fetch(`${API}/admin/subscriptions/all?limit=300&status=active`, {
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const subs = data?.subscriptions || [];
        const ids = new Set(
          subs.map((s) => (s.user?._id || s.user)?.toString()).filter(Boolean),
        );
        setActiveSubIds(ids);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [filterMonth, filterYear]);

  const fetchPayrolls = useCallback(async (month, year, status) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 500 });
      if (month) params.set("month", month);
      if (year) params.set("year", year);
      if (status && status !== "all") params.set("status", status);

      const res = await fetch(`${API}/payroll/all?${params}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      const raw = Array.isArray(data?.data?.payrolls)
        ? data.data.payrolls
        : Array.isArray(data?.payrolls)
          ? data.payrolls
          : Array.isArray(data?.data)
            ? data.data
            : [];

      // Deduplicate: keep only the latest payroll per employee per month/year
      // Must call .toString() on ObjectId — object identity would always miss
      const seen = new Map();
      for (const p of raw) {
        const empId =
          (p.employee?._id || p.employee || p.employeeId)?.toString() || "";
        const key = `${empId}-${p.month}-${p.year}`;
        const existing = seen.get(key);
        if (!existing || new Date(p.createdAt) > new Date(existing.createdAt)) {
          seen.set(key, p);
        }
      }
      setPayrolls([...seen.values()]);
    } catch (e) {
      toast.error("Failed to load payrolls");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayrolls(filterMonth, filterYear, statusFilter);
  }, [fetchPayrolls, filterMonth, filterYear, statusFilter]);

  // Merge saved payrolls with live preview rows for employees who don't yet
  // have a saved payroll for this period. Saved records always take priority.
  const mergedPayrolls = useMemo(() => {
    const savedIds = new Set(
      payrolls
        .map((p) => (p.employee?._id || p.employee || p.employeeId)?.toString())
        .filter(Boolean),
    );
    const previewOnly = previewRows.filter((pr) => {
      const id = (pr.employee?._id || pr.employee)?.toString();
      return id && !savedIds.has(id);
    });
    // Stable A–Z order by employee name so saved + preview rows don't jumble
    const nameOf = (p) => {
      const e = p.employee || {};
      return `${e.firstName || p.employeeName || ""} ${e.lastName || ""}`
        .trim()
        .toLowerCase();
    };
    return [...payrolls, ...previewOnly].sort((a, b) =>
      nameOf(a).localeCompare(nameOf(b)),
    );
  }, [payrolls, previewRows]);

  const filtered = useMemo(() => {
    if (!search) return mergedPayrolls;
    const q = search.toLowerCase();
    return mergedPayrolls.filter((p) => {
      const emp = p.employee || {};
      const name = (
        (emp.firstName || p.employeeName || "") +
        " " +
        (emp.lastName || "")
      ).toLowerCase();
      return (
        name.includes(q) ||
        (emp.employeeId || p.employeeId || "").toLowerCase().includes(q)
      );
    });
  }, [mergedPayrolls, search]);

  // Single source of truth for a row's money figures. Used by BOTH the table
  // row cells and the footer totals so the total always equals the sum of the
  // rows (partial-month rule, live meal deduction and edit overrides included).
  const computeRowNumbers = (p) => {
    const att = p.attendance || {};
    const sd = p.salaryDetails || {};
    const monthlySal = sd.monthlySalary || p.earnings?.basicPay || 0;
    const utilBill = sd.utilityBillDeduction ?? 500;
    const wDays = att.totalWorkingDays || 1;
    const presDays = att.presentDays || 0;
    // Daily rate / basic pay are derived from the FULL monthly salary —
    // utility bill is deducted LAST, from net payable, below.
    const dRate = ceilAmount(monthlySal / wDays);
    const earnedPay_ = ceilAmount((monthlySal * presDays) / wDays);

    const _now = new Date();
    const _monthEnd = new Date(p.year, p.month, 0);
    const isPartialMonth =
      p.year === _now.getFullYear() &&
      p.month === _now.getMonth() + 1 &&
      _now < _monthEnd;

    // A saved (non-preview) row always has its deductions pre-computed and
    // stored server-side by calculatePayroll — trust those rather than
    // re-deriving from att.leaveDays/att.halfDays, which are DISPLAY buckets
    // (all leave combined, pure Half Day only) and no longer map 1:1 onto
    // what was actually deducted. Only a genuine unsaved preview row (nothing
    // stored yet) falls back to this live estimate.
    const preferStoredRow = p.isPreview !== true;
    const ded = p.deductions || {};

    const basicPayShown = isPartialMonth ? earnedPay_ : monthlySal;
    const absDeduct = preferStoredRow
      ? ded.absentDeduction || 0
      : isPartialMonth
        ? 0
        : monthlySal - earnedPay_;
    const lateDeduct = preferStoredRow
      ? ded.lateDeduction || 0
      : Math.floor((att.lateDays || 0) / 3) * dRate;
    const lvDeduct = preferStoredRow
      ? ded.leaveDeduction || 0
      : isPartialMonth
        ? 0
        : (att.leaveDays || 0) * dRate;
    const hdDeduct = preferStoredRow
      ? ded.halfDayDeduction || 0
      : isPartialMonth
        ? 0
        : Math.floor(((att.halfDays || 0) * dRate) / 2);

    const rowEmpId = (p.employee?._id || p.employee)?.toString();
    const savedFoodD =
      p.mealSystemData?.mealDeduction?.amount ||
      p.deductions?.mealDeduction ||
      p.deductions?.foodCostDeduction ||
      0;
    const liveFoodD =
      activeSubIds.has(rowEmpId) && (liveMealSummary?.perPersonCost || 0) > 0
        ? liveMealSummary.perPersonCost
        : 0;
    const foodDeduct = liveFoodD || savedFoodD;

    const totalDeductCalc =
      Math.min(absDeduct + lateDeduct + lvDeduct + hdDeduct, basicPayShown) +
      utilBill +
      foodDeduct;
    const rowCustEarn = (p.slipOverrides?.customEarnings || []).reduce(
      (s, i) => s + (Number(i.amount) || 0),
      0,
    );
    const rowCustDed = (p.slipOverrides?.customDeductions || []).reduce(
      (s, i) => s + (Number(i.amount) || 0),
      0,
    );
    const netPayCalc = Math.max(
      0,
      basicPayShown - totalDeductCalc + rowCustEarn - rowCustDed,
    );

    // Any saved row: trust the stored values (computed server-side) — EXCEPT
    // the meal deduction, which is a live figure (food cost can be added
    // after the payroll was generated/saved), so any amount beyond what was
    // already baked into the stored totals at save time must still be added.
    const liveFoodDExtra = Math.max(0, foodDeduct - savedFoodD);
    const basic = preferStoredRow
      ? (p.earnings?.basicPay ?? basicPayShown)
      : basicPayShown;
    const deduct = preferStoredRow
      ? (p.summary?.totalDeductions ?? p.deductions?.total ?? totalDeductCalc) +
        liveFoodDExtra
      : totalDeductCalc;
    const net = preferStoredRow
      ? Math.max(0, (p.summary?.netPayable ?? netPayCalc) - liveFoodDExtra)
      : netPayCalc;

    return { basic, deduct, net, isPartialMonth };
  };

  const stats = useMemo(() => {
    const total = payrolls.length;
    const paid = payrolls.filter((p) => p.status === "Paid").length;
    const pending = payrolls.filter(
      (p) => p.status === "Pending" || p.status === "Approved",
    ).length;
    // Use computeRowNumbers().net (same as the table/footer) instead of the
    // raw stored summary.netPayable, so this stays in sync with any live
    // meal/food deduction that hasn't been saved to the payroll record yet.
    const totalAmt = payrolls
      .filter((p) => p.status === "Paid")
      .reduce((s, p) => s + computeRowNumbers(p).net, 0);
    return { total, paid, pending, totalAmt };
  }, [payrolls, activeSubIds, liveMealSummary]);

  const handleStatusChange = async (payroll, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/update-payroll/${payroll._id}/status`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Payroll marked as ${newStatus}`);
        fetchPayrolls(filterMonth, filterYear, statusFilter);
      } else {
        toast.error(data?.message || "Failed to update status");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecalculate = async (payroll) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/payroll/${payroll._id}/recalculate`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        const net = data.data?.summary?.netPayable ?? 0;
        toast.success(`Recalculated — Net: BDT ${fmt(net)}`);
        fetchPayrolls(filterMonth, filterYear, statusFilter);
      } else {
        toast.error(data.message || "Recalculation failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  // Open the slip AND silently refresh it from live attendance/leave data —
  // a saved payroll only reflects whatever was true the last time it was
  // calculated, so without this an admin correcting attendance and then
  // immediately opening the payroll slip would still see the pre-correction
  // numbers. Locked (Approved/Paid/accepted) payrolls are frozen snapshots
  // and are left untouched (the backend also refuses to recalculate those).
  const viewPayrollDetail = async (p) => {
    setViewPayroll(p);
    if (p.isPreview === true) return;
    if (
      p.status === "Paid" ||
      p.status === "Approved" ||
      p.employeeAccepted?.accepted
    )
      return;
    try {
      const res = await fetch(`${API}/payroll/${p._id}/recalculate`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok && data?.data) {
        const fresh = data.data;
        setViewPayroll((prev) =>
          prev && prev._id === fresh._id ? fresh : prev,
        );
        setPayrolls((prev) =>
          prev.map((row) =>
            row._id === fresh._id ? { ...row, ...fresh } : row,
          ),
        );
      }
    } catch {
      // Silent — the slip keeps showing the last-known data.
    }
  };

  const handleDelete = async () => {
    if (!deletePayroll) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/delete-payroll/${deletePayroll._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        toast.success("Payroll deleted");
        setDeletePayroll(null);
        fetchPayrolls(filterMonth, filterYear, statusFilter);
      } else {
        toast.error("Failed to delete");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkGenerate = async (month, year) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/payroll/bulk-generate`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ month, year }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data?.message || "Payrolls generated successfully");
        setShowBulk(false);
        fetchPayrolls(filterMonth, filterYear, statusFilter);
      } else {
        toast.error(data?.message || "Generation failed");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  function getNextAction(payroll) {
    switch (payroll.status) {
      case "Draft":
      case "Pending":
        return {
          label: "Approve",
          status: "Approved",
          icon: Check,
          color: "bg-blue-500 hover:bg-blue-600 text-white",
        };
      case "Approved":
        return {
          label: "Mark Paid",
          status: "Paid",
          icon: Banknote,
          color: "bg-emerald-500 hover:bg-emerald-600 text-white",
        };
      default:
        return null;
    }
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: FileText,
            bg: "bg-[#113F67]",
            active: statusFilter === "all",
            onClick: () => setStatusFilter("all"),
          },
          {
            label: "Paid",
            value: stats.paid,
            icon: CheckCircle,
            bg: "bg-emerald-500",
            active: statusFilter === "Paid",
            onClick: () => setStatusFilter("Paid"),
          },
          {
            label: "Pending / Approved",
            value: stats.pending,
            icon: Clock,
            bg: "bg-amber-500",
            active: statusFilter === "Pending" || statusFilter === "Approved",
            onClick: () => setStatusFilter("Pending"),
          },
          {
            label: "Total Paid Amount",
            value: `BDT ${fmt(stats.totalAmt)}`,
            icon: Banknote,
            bg: "bg-purple-500",
            active: statusFilter === "Paid",
            onClick: () => setStatusFilter("Paid"),
            wide: true,
          },
        ].map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={card.onClick}
            className={`bg-white rounded-xl border p-4 shadow-sm flex items-center gap-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${card.wide ? "md:col-span-3" : ""} ${card.active ? "border-[#113F67] ring-2 ring-[#113F67]/15" : "border-gray-200"}`}
          >
            <div
              className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center shrink-0`}
            >
              <card.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p
                className={`${card.label === "Total Paid Amount" ? "text-lg" : "text-2xl"} font-bold text-gray-800`}
              >
                {card.value}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        {/* Row 1: Month + Year (primary) + Status + Search */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Month/Year picker — primary filter */}
          <div className="flex items-center gap-2 bg-[#113F67]/5 border-2 border-[#113F67]/30 rounded-xl px-4 py-2">
            <Calendar size={15} className="text-[#113F67] shrink-0" />
            <select
              className="text-sm font-bold text-[#113F67] bg-transparent focus:outline-none cursor-pointer"
              value={filterMonth}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className="text-sm font-bold text-[#113F67] bg-transparent focus:outline-none cursor-pointer"
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <select
            className={SEL}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            {Object.keys(STATUS_CFG).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-40">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => fetchPayrolls(filterMonth, filterYear, statusFilter)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => setShowBulk(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            title="Regenerate payroll for a specific period"
          >
            <Plus size={13} /> Regenerate
          </button>
        </div>

        {/* Row 2: info hint */}
        {!loading && payrolls.length > 0 && (
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <TrendingUp size={11} />
            Showing payroll for{" "}
            <strong className="text-gray-600">
              {MONTHS[filterMonth - 1]} {filterYear}
            </strong>{" "}
            — calculated from attendance records. Change month above to view
            another period.
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading || (previewLoading && filtered.length === 0) ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 font-semibold">
              No payrolls for {MONTHS[(filterMonth || 1) - 1]} {filterYear}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {statusFilter !== "all"
                ? `No ${statusFilter} payrolls found. Try "All Status".`
                : "No attendance records found for this period."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide border-b border-gray-100">
                  <th className="px-4 py-3 text-left font-medium">Employee</th>
                  <th className="px-4 py-3 text-left font-medium">Period</th>
                  <th className="px-4 py-3 text-center font-medium hidden md:table-cell">
                    Working
                  </th>
                  <th className="px-4 py-3 text-center font-medium hidden md:table-cell">
                    Present
                  </th>
                  <th className="px-4 py-3 text-right font-medium hidden lg:table-cell">
                    Basic Pay
                  </th>
                  <th className="px-4 py-3 text-right font-medium hidden xl:table-cell">
                    Deductions
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Net Payable
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const emp = p.employee || {};
                  const att = p.attendance || {};
                  const isPreviewRow = p.isPreview === true;
                  const nextAction = isPreviewRow ? null : getNextAction(p);

                  // Single source of truth — same helper the footer totals use.
                  const {
                    basic: basicForCol,
                    deduct: totalDeduct,
                    net: netPay,
                    isPartialMonth,
                  } = computeRowNumbers(p);
                  const _now = new Date();

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-gray-800">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {emp.employeeId || p.employeeId}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-700">
                          {MONTHS[(p.month || 1) - 1]?.slice(0, 3)} {p.year}
                        </p>
                        {isPartialMonth && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-medium">
                            as of today (day {_now.getDate()})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">
                        <span className="text-gray-600">
                          {att.totalWorkingDays ?? "--"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">
                        <span className="font-medium text-emerald-600">
                          {att.presentDays ?? "--"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                        <span className="text-gray-700">
                          BDT {fmt(basicForCol)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right hidden xl:table-cell">
                        {totalDeduct > 0 ? (
                          <span className="text-red-500 font-medium">
                            - BDT {fmt(totalDeduct)}
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-semibold text-gray-800">
                          BDT {fmt(netPay)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {isPreviewRow ? (
                          <span
                            className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium"
                            title="Live preview — not yet generated"
                          >
                            Not generated
                          </span>
                        ) : (
                          <StatusBadge status={p.status} />
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => viewPayrollDetail(p)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                            title="View detail"
                          >
                            <Eye size={15} />
                          </button>
                          {isPreviewRow ? null : (
                            <>
                              {nextAction && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(p, nextAction.status)
                                  }
                                  disabled={actionLoading}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${nextAction.color}`}
                                  title={nextAction.label}
                                >
                                  {nextAction.label}
                                </button>
                              )}
                              {p.status !== "Paid" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(p, "Rejected")
                                  }
                                  disabled={
                                    actionLoading || p.status === "Rejected"
                                  }
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-30"
                                  title="Reject"
                                >
                                  <XCircle size={15} />
                                </button>
                              )}
                              {(() => {
                                // Approved / Paid / employee-accepted payrolls
                                // are locked — no edits, no recalculation.
                                const isLocked =
                                  p.status === "Approved" ||
                                  p.status === "Paid" ||
                                  p.employeeAccepted?.accepted;
                                return (
                                  <>
                                    <button
                                      onClick={() => setEditRow(p)}
                                      disabled={isLocked}
                                      className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                      title={
                                        isLocked
                                          ? "Locked — approved/paid payroll cannot be edited"
                                          : "Edit (everything)"
                                      }
                                    >
                                      <Pencil size={15} />
                                    </button>
                                    <button
                                      onClick={() => handleRecalculate(p)}
                                      disabled={actionLoading || isLocked}
                                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                      title={
                                        isLocked
                                          ? "Locked — approved/paid payroll is frozen"
                                          : "Recalculate (sync with latest attendance)"
                                      }
                                    >
                                      <RefreshCw size={15} />
                                    </button>
                                  </>
                                );
                              })()}
                              <button
                                onClick={() => setDeletePayroll(p)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-50 border-t-2 border-gray-200">
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell"
                    >
                      Total ({filtered.length} payrolls)
                    </td>
                    <td
                      colSpan={2}
                      className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide md:hidden"
                    >
                      Total ({filtered.length})
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <span className="text-sm font-bold text-gray-700">
                        BDT{" "}
                        {fmt(
                          filtered.reduce(
                            (s, p) => s + computeRowNumbers(p).basic,
                            0,
                          ),
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden xl:table-cell">
                      {(() => {
                        const total = filtered.reduce(
                          (s, p) => s + computeRowNumbers(p).deduct,
                          0,
                        );
                        return total > 0 ? (
                          <span className="text-sm font-bold text-red-500">
                            - BDT {fmt(total)}
                          </span>
                        ) : null;
                      })()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-[#113F67]">
                        BDT{" "}
                        {fmt(
                          filtered.reduce(
                            (s, p) => s + computeRowNumbers(p).net,
                            0,
                          ),
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell" />
                    <td className="px-4 py-3" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      <Modal
        open={!!viewPayroll}
        onClose={() => setViewPayroll(null)}
        title="Payroll Slip"
        slip
      >
        <PayrollDetail payroll={viewPayroll} />
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={!!deletePayroll}
        onClose={() => setDeletePayroll(null)}
        title="Delete Payroll"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Delete this payroll?</p>
            {deletePayroll && (
              <p className="text-sm text-gray-500 mt-1">
                {deletePayroll.employee?.firstName}{" "}
                {deletePayroll.employee?.lastName} &bull;{" "}
                {MONTHS[(deletePayroll.month || 1) - 1]} {deletePayroll.year}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletePayroll(null)}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {actionLoading && <Loader2 size={14} className="animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Generate Modal */}
      <BulkGenerateModal
        open={showBulk}
        onClose={() => setShowBulk(false)}
        onGenerate={handleBulkGenerate}
        loading={actionLoading}
      />

      {/* Edit Payroll Modal (full override) */}
      {editRow &&
        (() => {
          // Resolve the same meal deduction the list row shows (live-or-saved)
          // so the modal opens with a matching net.
          const rowEmpId = (
            editRow.employee?._id || editRow.employee
          )?.toString();
          const savedFoodD =
            editRow.mealSystemData?.mealDeduction?.amount ||
            editRow.deductions?.mealDeduction ||
            editRow.deductions?.foodCostDeduction ||
            0;
          const liveFoodD =
            activeSubIds.has(rowEmpId) &&
            (liveMealSummary?.perPersonCost || 0) > 0
              ? liveMealSummary.perPersonCost
              : 0;
          const rowFoodDeduction = liveFoodD || savedFoodD;
          return (
            <EditPayrollModal
              payroll={editRow}
              initialMealDeduction={rowFoodDeduction}
              onClose={() => setEditRow(null)}
              onSaved={() =>
                fetchPayrolls(filterMonth, filterYear, statusFilter)
              }
            />
          );
        })()}
    </div>
  );
}

// ====================== EMPLOYEE VIEW ======================
function EmployeeView() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewPayroll, setViewPayroll] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [hasMealSub, setHasMealSub] = useState(false);
  const [mealCostByMonth, setMealCostByMonth] = useState({}); // { "2025-01": { perPersonCost, totalFoodCost, activeSubscriptions } }
  const [selfPreview, setSelfPreview] = useState(null); // live "as of today" preview for the selected period
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  // Fetch own live preview for the selected period (shows current month before it's generated)
  useEffect(() => {
    let cancelled = false;
    setSelfPreview(null);
    fetch(`${API}/my-payroll-preview?month=${filterMonth}&year=${filterYear}`, {
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setSelfPreview(d?.data?.payroll || null);
      })
      .catch(() => {
        if (!cancelled) setSelfPreview(null);
      });
    return () => {
      cancelled = true;
    };
  }, [filterMonth, filterYear]);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/my-payrolls`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        const raw = Array.isArray(data?.data?.payrolls)
          ? data.data.payrolls
          : Array.isArray(data?.payrolls)
            ? data.payrolls
            : Array.isArray(data?.data)
              ? data.data
              : [];
        const seen = new Map();
        for (const p of [...raw].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )) {
          const key = `${p.month}-${p.year}`;
          if (!seen.has(key)) seen.set(key, p);
        }
        setPayrolls([...seen.values()]);
      } catch (e) {
        toast.error("Failed to load payrolls");
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  // Check own meal subscription status once on mount
  useEffect(() => {
    fetch(`${API}/subscription/my-details`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) =>
        setHasMealSub(!!(d?.hasSubscription && d?.data?.status === "active")),
      )
      .catch(() => {});
  }, []);

  // Fetch live meal cost for the currently viewed month/year when filter changes
  useEffect(() => {
    if (!hasMealSub) return;
    const monthStr = `${filterYear}-${String(filterMonth).padStart(2, "0")}`;
    if (mealCostByMonth[monthStr]) return; // already fetched
    fetch(`${API}/meal/food-cost-per-person?month=${monthStr}`, {
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.data)
          setMealCostByMonth((prev) => ({ ...prev, [monthStr]: d.data }));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterMonth, filterYear, hasMealSub]);

  const handleAccept = async (payroll) => {
    setAcceptLoading(true);
    try {
      const res = await fetch(`${API}/payroll/${payroll._id}/employee-accept`, {
        method: "PUT",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Payroll accepted");
        setPayrolls((prev) =>
          prev.map((p) =>
            p._id === payroll._id
              ? { ...p, employeeAccepted: { accepted: true } }
              : p,
          ),
        );
        if (viewPayroll?._id === payroll._id) {
          setViewPayroll((prev) => ({
            ...prev,
            employeeAccepted: { accepted: true },
          }));
        }
      } else {
        toast.error(data?.message || "Failed to accept");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setAcceptLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  const savedFiltered = payrolls.filter(
    (p) =>
      (!filterMonth || p.month === filterMonth) &&
      (!filterYear || p.year === filterYear),
  );
  // If no saved payroll for this period, show the live "as of today" preview
  const filtered =
    savedFiltered.length === 0 &&
    selfPreview &&
    selfPreview.month === filterMonth &&
    selfPreview.year === filterYear
      ? [selfPreview]
      : savedFiltered;

  return (
    <div className="space-y-5">
      {/* Month / Year filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#113F67]" />
            <span className="text-sm font-semibold text-gray-700">
              Filter by Period
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#113F67]/5 border border-[#113F67]/20 rounded-xl px-3 py-2">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="text-sm font-semibold text-[#113F67] bg-transparent focus:outline-none cursor-pointer"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="text-sm font-semibold text-[#113F67] bg-transparent focus:outline-none cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-500 ml-auto">
            {filtered.length} slip{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            No payroll for {MONTHS[filterMonth - 1]} {filterYear}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Try a different month or wait for payroll to be generated.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const sum = p.summary || {};
            const att = p.attendance || {};
            const accepted = p.employeeAccepted?.accepted;
            // Compute live net payable using fresh meal data when available
            const cardMonthStr = `${p.year}-${String(p.month).padStart(2, "0")}`;
            const cardMeal = mealCostByMonth[cardMonthStr];
            const savedFoodD =
              p.mealSystemData?.mealDeduction?.amount ||
              p.deductions?.mealDeduction ||
              p.deductions?.foodCostDeduction ||
              0;
            const liveFoodD =
              hasMealSub && (cardMeal?.perPersonCost || 0) > 0
                ? cardMeal.perPersonCost
                : 0;
            const cardFoodDeduct = liveFoodD || savedFoodD;
            // Recompute net: base salary - attendance deductions - live meal deduction
            const cardSd = p.salaryDetails || {};
            const cardMonthlySal = cardSd.monthlySalary || 0;
            const cardUtilBill = cardSd.utilityBillDeduction ?? 500;
            const cardAdjSal = Math.max(0, cardMonthlySal - cardUtilBill);
            const cardWDays = att.totalWorkingDays || 1;
            const cardDRate = ceilAmount(cardAdjSal / cardWDays);
            const cardEarned = Math.floor(
              (cardAdjSal * (att.presentDays || 0)) / cardWDays,
            );
            // Partial (current in-progress) month → pay only for elapsed present days
            const _cNow = new Date();
            const _cEnd = new Date(p.year, p.month, 0);
            const cardPartial =
              p.year === _cNow.getFullYear() &&
              p.month === _cNow.getMonth() + 1 &&
              _cNow < _cEnd;
            const cardBasic = cardPartial ? cardEarned : cardAdjSal;
            const cardAttDeduct = cardPartial
              ? Math.floor((att.lateDays || 0) / 3) * cardDRate
              : Math.min(
                  cardAdjSal -
                    cardEarned +
                    Math.floor((att.lateDays || 0) / 3) * cardDRate +
                    (att.leaveDays || 0) * cardDRate +
                    Math.floor(((att.halfDays || 0) * cardDRate) / 2),
                  cardAdjSal,
                );
            const cardCustEarn = (p.slipOverrides?.customEarnings || []).reduce(
              (s, i) => s + (Number(i.amount) || 0),
              0,
            );
            const cardCustDed = (
              p.slipOverrides?.customDeductions || []
            ).reduce((s, i) => s + (Number(i.amount) || 0), 0);
            // Any SAVED payroll: trust the server-computed net (the backend
            // refreshes it from live attendance on every /my-payrolls load),
            // so the employee sees the exact same figure as the admin panel —
            // EXCEPT the meal deduction, which is a live figure (food cost can
            // be added after the payroll was generated/saved), so any amount
            // beyond what was already baked into the stored net at save time
            // must still be subtracted here. Only the unsaved live-preview
            // card falls back fully to client math.
            const cardLiveFoodDExtra = Math.max(0, cardFoodDeduct - savedFoodD);
            const cardNetPay =
              p.isPreview !== true && sum.netPayable != null
                ? Math.max(0, sum.netPayable - cardLiveFoodDExtra)
                : Math.max(
                    0,
                    cardBasic -
                      cardAttDeduct -
                      cardFoodDeduct +
                      cardCustEarn -
                      cardCustDed,
                  );
            return (
              <div
                key={p._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-[#113F67] px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">
                      {MONTHS[(p.month || 1) - 1]} {p.year}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">
                      {p.isPreview
                        ? "Live preview · as of today"
                        : "Payroll Slip"}
                    </p>
                  </div>
                  {p.isPreview ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/90 text-[#113F67] text-[10px] font-bold">
                      Not generated
                    </span>
                  ) : (
                    <StatusBadge status={p.status} />
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">
                        Present / Working
                      </p>
                      <p className="font-semibold text-gray-800">
                        {att.presentDays ?? "--"} /{" "}
                        {att.totalWorkingDays ?? "--"} days
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">
                        Net Payable
                      </p>
                      <p className="font-bold text-[#113F67] text-base">
                        BDT {fmt(cardNetPay)}
                      </p>
                      {cardFoodDeduct > 0 && (
                        <p className="text-purple-500 text-[10px] mt-0.5">
                          incl. meal −{fmt(cardFoodDeduct)}
                        </p>
                      )}
                    </div>
                    {(att.lateDays || 0) > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">
                          Late Days
                        </p>
                        <p className="font-medium text-amber-600">
                          {att.lateDays}
                        </p>
                      </div>
                    )}
                    {(sum.totalDeductions || 0) + cardLiveFoodDExtra > 0 && (
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">
                          Total Deductions
                        </p>
                        <p className="font-medium text-red-500">
                          - BDT{" "}
                          {fmt((sum.totalDeductions || 0) + cardLiveFoodDExtra)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => setViewPayroll(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Eye size={14} /> View Details
                    </button>
                    {p.status === "Approved" && !accepted && (
                      <button
                        onClick={() => handleAccept(p)}
                        disabled={acceptLoading}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-60 transition-colors"
                      >
                        {acceptLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        Accept
                      </button>
                    )}
                    {accepted && (
                      <span className="flex-1 flex items-center justify-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle size={13} /> Accepted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!viewPayroll}
        onClose={() => setViewPayroll(null)}
        title="Payroll Slip"
        slip
      >
        <div className="space-y-4">
          <PayrollDetail payroll={viewPayroll} />
          {viewPayroll?.status === "Approved" &&
            !viewPayroll?.employeeAccepted?.accepted && (
              <button
                onClick={() => handleAccept(viewPayroll)}
                disabled={acceptLoading}
                className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {acceptLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                Accept Payroll
              </button>
            )}
        </div>
      </Modal>
    </div>
  );
}

// ====================== MAIN PAGE ======================
export default function PayrollPage() {
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const r = getRole();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(r);
    setRoleLoading(false);
  }, []);

  const isAdmin = role === "admin" || role === "superAdmin";
  const isModerator = role === "moderator";
  const isAdminOrMod = isAdmin || isModerator;

  const roleBadge = isAdmin
    ? { label: "Admin", cls: "bg-purple-100 text-purple-700 border-purple-200" }
    : isModerator
      ? { label: "Moderator", cls: "bg-teal-100 text-teal-700 border-teal-200" }
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#113F67] rounded-lg flex items-center justify-center">
              <DollarSign size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Payroll</h1>
              <p className="text-xs text-gray-500">
                {isAdminOrMod
                  ? "Manage and process employee payrolls"
                  : "Your salary slips"}
              </p>
            </div>
            {roleBadge && (
              <span
                className={`ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadge.cls}`}
              >
                <Shield size={11} /> {roleBadge.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 px-2 py-6">
        {roleLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-80 rounded-xl" />
          </div>
        ) : isAdminOrMod ? (
          <AdminView />
        ) : (
          <EmployeeView />
        )}
      </div>
    </div>
  );
}
