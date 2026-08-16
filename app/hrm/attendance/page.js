"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
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
  FileText,
  CalendarDays,
  AlertTriangle,
  Clock4,
  BarChart3,
  TrendingUp,
  Zap,
  Settings,
  Layers,
  ClipboardList,
  AlertOctagon,
  Info,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_HRM_API_URL;

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
  "Paid Leave": {
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },
  "Sick Leave": {
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
    dot: "bg-pink-500",
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

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.09)]">
      <div className="absolute inset-0 bg-linear-to-br from-white via-white to-slate-50 opacity-80" />
      <div className="relative flex items-center gap-3 md:gap-4">
        <div
          className={`w-11 h-11 md:w-12 md:h-12 ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}
        >
          <Icon className="text-white h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl md:text-[1.7rem] font-black tracking-tight text-gray-900 leading-none">
            {value}
          </p>
          <p className="text-xs font-semibold text-gray-500 truncate mt-1">
            {label}
          </p>
          {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function Skeleton({ rows = 5 }) {
  return (
    <div className="divide-y divide-gray-50 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-4 sm:px-5">
          <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3 bg-gray-100 rounded w-2/3 sm:w-1/3" />
            <div className="h-2 bg-gray-100 rounded w-1/2 sm:w-1/5" />
          </div>
          <div className="hidden sm:block h-6 bg-gray-100 rounded-full w-20" />
          <div className="hidden sm:block h-3 bg-gray-100 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function Modal({ show, onClose, title, subtitle, children, footer, size = "max-w-lg" }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${size} max-h-[92vh] flex flex-col`}>
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
const BD = { timeZone: "Asia/Dhaka" };
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
const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString("en-BD", {
        ...BD,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "--";
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-BD", {
        ...BD,
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "--";
const fmtDay = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-BD", { ...BD, weekday: "short" })
    : "--";
const fmtHours = (h) => {
  if (!h || h <= 0) return "--";
  const f = Math.floor(h),
    m = Math.round((h - f) * 60);
  return m > 0 ? f + "h " + m + "m" : f + "h";
};
const isoDate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const toTStr = (dt) =>
  dt
    ? new Date(dt).toLocaleTimeString("en", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

function dt2iso(dateStr, timeStr) {
  const d = new Date(dateStr);
  const [h, m] = timeStr.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
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
const HOLIDAY_STATUSES = new Set([
  "Weekly Off",
  "Govt Holiday",
  "Company Holiday",
]);

// Status options offered when an admin edits an attendance record.
const EDIT_STATUS_OPTIONS = [
  "Present",
  "Absent",
  "Late",
  "Early",
  "Half Day",
  "Paid Leave",
  "Unpaid Leave",
  "Half Paid Leave",
  "Sick Leave",
  "Govt Holiday",
  "Company Holiday",
  "Weekly Off",
];

// Statuses shown verbatim on the admin roster (admin-set, not derived from the
// clock-in time). Present/Late/Early are still derived from clock-in.
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

// Returns late threshold in decimal hours from a record's shift start.
// Late grace is a FIXED 10 minutes: clocking in up to (shift start + 10min)
// is on-time (Present); only AFTER that is Late. e.g. 09:00 start → on-time
// through 09:10, late from 09:11. shift.start is "HH:MM" e.g. "09:00".
const LATE_GRACE_MIN = 10;
function getLateThreshold(rec) {
  const start = rec?.shift?.start;
  if (start) {
    const [sh, sm] = start.split(":").map(Number);
    return (sh * 60 + sm + LATE_GRACE_MIN) / 60; // decimal hours, e.g. 9.1667 for 9:10
  }
  return 9 + LATE_GRACE_MIN / 60; // 09:10 AM default
}

// Compute late minutes from clock-in time (works even when DB lateMinutes is 0/wrong)
function computeLateMinutes(rec) {
  if (!rec?.clockIn) return 0;
  const dt = new Date(rec.clockIn);
  const clockH = dt.getHours() + dt.getMinutes() / 60;
  const threshold = getLateThreshold(rec);
  if (clockH <= threshold) return 0;
  return Math.round((clockH - threshold) * 60);
}

// Classify a record by clock-in time: "present" | "late" | "miss"
function classifyRec(rec) {
  const status = rec?.status || "";
  // The stored status is authoritative — the backend sets Present/Late on
  // clock-in and an admin can override it. Honor it directly so every view
  // (today card, monthly badge, summary counts) agrees, instead of re-deriving
  // a different result from the clock-in time (which made an admin-set "Absent"
  // day with clock times show as "Present").
  if (status.toLowerCase().includes("leave")) return "leave";
  if (status === "Half Day") return "halfday";
  if (status === "Absent") return "miss";
  if (status === "Late") return "late";
  if (status === "Present" || status === "Early") {
    // Rule: clocking in AFTER the grace threshold (shift start + 10 min, e.g.
    // 09:10) is Late — even if the record is stored as Present/Early.
    if (rec?.clockIn) {
      const dt = new Date(rec.clockIn);
      const hours = dt.getHours() + dt.getMinutes() / 60;
      if (hours < 12 && hours > getLateThreshold(rec) + 1e-9) return "late";
    }
    return "present";
  }
  // Fallback for generic/unknown statuses (e.g. "Clocked In"): derive from
  // the clock-in time.
  if (!rec?.clockIn) return "miss";
  const dt = new Date(rec.clockIn);
  const hours = dt.getHours() + dt.getMinutes() / 60;
  if (hours >= 12) return "miss";
  // strictly AFTER the grace threshold → late (exactly 09:10 stays on-time;
  // epsilon absorbs floating-point noise at the boundary)
  if (hours > getLateThreshold(rec) + 1e-9) return "late";
  return "present";
}

function EmployeeMonthView({
  records,
  employees,
  empFilter,
  empInfo,
  filterMonth,
  filterYear,
  loading,
  weeklyOffDays,
  holidays,
  onClearFilter,
  onEdit,
  onDelete,
}) {
  const emp =
    empInfo ||
    (employees && empFilter
      ? employees.find((e) => e._id === empFilter)
      : null);
  const empName = emp
    ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim()
    : "Employee";
  const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const offDayNums = new Set(
    (weeklyOffDays || [])
      .map((name) => DAY_NAMES.indexOf(name))
      .filter((n) => n >= 0),
  );

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // Index records by day-of-month (BD timezone). Working-attendance records go
  // into recsByDay; office holiday / weekly-off records (Govt/Company Holiday,
  // Weekly Off — created by the backend per OfficeSchedule & Holiday) go into
  // holidayByDay so those days are treated as non-working, never "Absent".
  // Duplicate records can exist for the same logical day (mixed UTC/Dhaka
  // midnight date encodings in the DB) — resolve them DETERMINISTICALLY, not
  // by array order: an admin-corrected record beats an auto one, then the
  // most recently updated wins. The payroll calculation (backend) uses the
  // exact same rule, so both pages always pick the same record.
  const pickBetterRec = (a, b) => {
    if (!b) return a;
    if (!a) return b;
    const aCorr = a.correctedByAdmin === true;
    const bCorr = b.correctedByAdmin === true;
    if (aCorr !== bCorr) return aCorr ? a : b;
    return new Date(a.updatedAt || 0) >= new Date(b.updatedAt || 0) ? a : b;
  };
  const recsByDay = {};
  const holidayByDay = {};
  records.forEach((r) => {
    if (!r.date) return;
    const day = Number(
      new Date(r.date).toLocaleDateString("en-BD", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
      }),
    );
    if (HOLIDAY_STATUSES.has(r.status))
      holidayByDay[day] = pickBetterRec(r, holidayByDay[day]);
    else recsByDay[day] = pickBetterRec(r, recsByDay[day]);
  });

  // Also build holiday map directly from the HolidayModel list (holidays prop).
  // This covers holidays that exist in the DB but don't have an attendance record
  // yet (e.g. retroactively added holidays, or cron didn't run for that day).
  (holidays || []).forEach((h) => {
    if (!h.date) return;
    const day = Number(
      new Date(h.date).toLocaleDateString("en-BD", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
      }),
    );
    if (!holidayByDay[day]) {
      holidayByDay[day] = {
        status: h.type === "GOVT" ? "Govt Holiday" : "Company Holiday",
        reason: h.title,
        _fromHolidayModel: true,
      };
    }
  });

  // Compute stats from ACTUAL records (not calendar position): a day with a
  // record is counted even if the calendar says it's "future" (e.g. imported
  // ahead); a working day with NO record counts as absent only if it's not in
  // the future. This keeps the header in sync with the list below.
  let presentCount = 0,
    lateCount = 0,
    officeMissCount = 0,
    leaveCount = 0,
    paidLeaveCount = 0,
    unpaidLeaveCount = 0,
    halfDayCount = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(filterYear, filterMonth - 1, d);
    if (offDayNums.has(dateObj.getDay())) continue; // recurring weekly off
    if (holidayByDay[d]) continue; // govt/company holiday or override off-day
    const r = recsByDay[d];
    if (!r) {
      if (dateObj <= todayDate) officeMissCount++; // past working day, no record
      continue; // future day with no record → not counted yet
    }
    const cls = classifyRec(r);
    if (cls === "present") presentCount++;
    else if (cls === "late") lateCount++;
    else if (cls === "miss") officeMissCount++;
    else if (cls === "leave") {
      // Business rule: Paid/Sick leave counts as a PRESENT day; Unpaid leave
      // counts as an ABSENT day. Half-paid splits 0.5/0.5. The payroll page
      // and backend payroll calculation apply the identical rule.
      leaveCount++;
      if (r.status === "Unpaid Leave") unpaidLeaveCount++;
      else if (r.status === "Half Paid Leave") {
        paidLeaveCount += 0.5;
        unpaidLeaveCount += 0.5;
      } else paidLeaveCount++;
    } else if (cls === "halfday") halfDayCount++;
  }
  const lateDeductionDays = Math.floor(lateCount / 3);

  // Descending render: separator before a Thursday whose next working day is a Sunday
  const weekSeparatorDays = new Set();
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(filterYear, filterMonth - 1, d);
    if (!offDayNums.has(dt.getDay())) {
      let next = d + 1;
      while (
        next <= daysInMonth &&
        offDayNums.has(new Date(filterYear, filterMonth - 1, next).getDay())
      )
        next++;
      if (
        next <= daysInMonth &&
        new Date(filterYear, filterMonth - 1, next).getDay() === 0
      ) {
        weekSeparatorDays.add(d);
      }
    }
  }

  const COMPUTED_BADGE = {
    present: {
      label: "Present",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    late: {
      label: "Late",
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    miss: {
      label: "Absent",
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    leave: {
      label: "Leave",
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    halfday: {
      label: "Half Day",
      bg: "bg-lime-100",
      text: "text-lime-700",
      border: "border-lime-200",
      dot: "bg-lime-500",
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 bg-[#113F67] text-white flex items-center gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">
            {empName.charAt(0) || "?"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{empName}</p>
          <p className="text-xs text-white/70">
            {emp?.employeeId || "--"}
            {emp?.department ? " · " + emp.department : ""}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold">
            {MONTHS[filterMonth - 1]} {filterYear}
          </p>
          <p className="text-xs text-white/70">Monthly Attendance</p>
        </div>
        {onClearFilter && (
          <button
            onClick={onClearFilter}
            className="ml-2 p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title="Back"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 divide-x divide-gray-100 border-b border-gray-100">
        {[
          {
            l: "Present",
            v: presentCount + lateCount + paidLeaveCount,
            c: "text-emerald-600",
            bg: "bg-emerald-50",
            title: "Total attendance days (on-time + late + paid/sick leave)",
          },
          {
            l: "Absent",
            v: officeMissCount + unpaidLeaveCount,
            c: "text-red-600",
            bg: "bg-red-50",
            title: "No record, clocked in after 12pm, or unpaid leave",
          },
          {
            l: "Late (×days)",
            v: lateCount,
            c: "text-amber-600",
            bg: "bg-amber-50",
            title: "Clocked in after shift start, before 12pm",
          },
          {
            l: "Late Deduction",
            v: lateDeductionDays,
            c: "text-orange-600",
            bg: "bg-orange-50",
            title: "floor(late days ÷ 3) = days deducted",
          },
          {
            l: "Leave / Half",
            v: leaveCount + halfDayCount,
            c: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((s) => (
          <div
            key={s.l}
            className={`p-3 text-center ${s.bg}`}
            title={s.title || ""}
          >
            <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-2.5 bg-gray-50/30 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
        <div className="col-span-2">Day</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Clock In</div>
        <div className="col-span-2">Clock Out</div>
        <div className="col-span-2">Worked Hours</div>
        <div className="col-span-2">Notes</div>
      </div>

      {loading ? (
        <Skeleton rows={10} />
      ) : (
        <div>
          {Array.from({ length: daysInMonth }, (_, i) => daysInMonth - i).map(
            (day) => {
              const dateObj = new Date(filterYear, filterMonth - 1, day);
              const dayName = weekdays[dateObj.getDay()];
              const isOffDay = offDayNums.has(dateObj.getDay());
              const isFuture = dateObj > todayDate;

              let holRec = holidayByDay[day];
              const rec = recsByDay[day];

              // Show recurring weekly-off days as their own "Weekly Off" row
              // (regular calendar view) instead of hiding them.
              if (isOffDay && !holRec && !rec) {
                holRec = { status: "Weekly Off" };
              }
              // Future WORKING days are hidden unless a record exists (e.g.
              // imported ahead of time). Off-days/holidays always show.
              if (isFuture && !rec && !holRec) return null;
              const cls = rec ? classifyRec(rec) : "miss";
              const badge = COMPUTED_BADGE[cls];
              const holCfg = holRec ? scfg(holRec.status) : null;
              // Admin-set/definitive statuses are shown verbatim (exact label
              // and colour) so the employee sees what the admin actually set.
              const verbatimCfg =
                rec && VERBATIM_STATUSES.has(rec.status)
                  ? scfg(rec.status)
                  : null;

              return (
                <div
                  key={day}
                  className={`grid grid-cols-12 gap-2 px-5 py-3 items-center ${weekSeparatorDays.has(day) ? "border-t-2 border-emerald-400" : ""}`}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 bg-gray-100">
                      <span className="text-xs font-bold text-gray-700 leading-none">
                        {String(day).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-gray-400 leading-none mt-0.5">
                        {dayName}
                      </span>
                    </div>
                  </div>

                  {/* Computed status badge */}
                  <div className="col-span-2">
                    {holRec && !rec ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${holCfg.bg} ${holCfg.text} ${holCfg.border}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${holCfg.dot}`}
                        />
                        {holRec.status}
                      </span>
                    ) : verbatimCfg ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${verbatimCfg.bg} ${verbatimCfg.text} ${verbatimCfg.border}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${verbatimCfg.dot}`}
                        />
                        {rec.status}
                      </span>
                    ) : badge ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                        />
                        {badge.label}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300 italic">
                        upcoming
                      </span>
                    )}
                  </div>

                  {rec ? (
                    <>
                      <div className="col-span-2">
                        <p className="text-sm font-mono text-gray-700">
                          {fmtTime(rec.clockIn)}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-mono text-gray-700">
                          {fmtTime(rec.clockOut)}
                        </p>
                        {rec.autoClockOut && (
                          <p className="text-[10px] text-amber-500 font-semibold">
                            Auto
                          </p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-bold text-[#113F67]">
                          {fmtHours(rec.totalHours)}
                        </p>
                      </div>
                      <div className="col-span-2 text-xs flex items-center justify-between gap-1">
                        <div className="flex flex-wrap gap-1">
                          {cls === "late" && computeLateMinutes(rec) > 0 && (
                            <span className="text-amber-500 font-semibold">
                              {computeLateMinutes(rec)}m late
                            </span>
                          )}
                          {cls === "miss" && rec.clockIn && (
                            <span className="text-red-400 font-semibold">
                              After 12pm
                            </span>
                          )}
                          {rec.correctedByAdmin && (
                            <span className="text-purple-500">Corrected</span>
                          )}
                        </div>
                        {(onEdit || onDelete) && (
                          <div className="flex items-center gap-1 shrink-0 ml-auto">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(rec)}
                                title="Edit record"
                                className="p-1 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              >
                                <Edit2 size={12} />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(rec)}
                                title="Delete record"
                                className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : holRec ? (
                    <div className="col-span-10 text-xs text-gray-400 italic pl-1">
                      {holRec.reason || holRec.status}
                    </div>
                  ) : (
                    <div className="col-span-10 text-xs text-gray-400 italic pl-1">
                      No record
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

export default function AttendancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dashStats, setDashStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [weeklyOffDays, setWeeklyOffDays] = useState(["Friday", "Saturday"]);
  const [monthHolidays, setMonthHolidays] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [total, setTotal] = useState(0);
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
  });
  const [ipAddr, setIpAddr] = useState("--");
  const [geoLoc, setGeoLoc] = useState({
    address: "Office",
    lat: null,
    lng: null,
  });
  const [devInfo, setDevInfo] = useState({ type: "Desktop", browser: "--" });
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [dateRange, setDateRange] = useState(() => {
    const t = new Date();
    return { start: isoDate(t), end: isoDate(t) };
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [empFilter, setEmpFilter] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [now, setNow] = useState(new Date());
  const [expanded, setExpanded] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importEmp, setImportEmp] = useState("");
  const [importMonth, setImportMonth] = useState(new Date().getMonth() + 1);
  const [importYear, setImportYear] = useState(new Date().getFullYear());
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [importStep, setImportStep] = useState("select"); // "select" | "review"
  const [importDays, setImportDays] = useState([]); // full-month preview rows
  const [importSkip, setImportSkip] = useState(() => new Set()); // date strings to skip
  const [showEdit, setShowEdit] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [selRec, setSelRec] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const PER = 30;
  const freshM = () => ({
    employeeId: "",
    date: isoDate(),
    clockIn: "09:00",
    clockOut: "18:00",
    status: "Present",
    shiftStart: "09:00",
    shiftEnd: "18:00",
    remarks: "Created by admin",
  });
  const [mForm, setMForm] = useState(freshM());
  const [eForm, setEForm] = useState({
    clockIn: "",
    clockOut: "",
    status: "",
    totalHours: "",
    remarks: "",
    correctionReason: "",
  });
  const [bForm, setBForm] = useState({
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

  const getToken = () => {
    if (typeof window === "undefined") return null;
    const a = localStorage.getItem("adminToken"),
      e = localStorage.getItem("employeeToken");
    return a
      ? { token: a, type: "admin" }
      : e
        ? { token: e, type: "employee" }
        : null;
  };
  const H = (t) => ({
    Authorization: "Bearer " + t,
    "Content-Type": "application/json",
  });

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
          ? API + "/admin/getAdminProfile"
          : API + "/users/getProfile";
      const r = await fetch(ep, { headers: H(ti.token) });
      if (!r.ok) {
        router.push("/hrm");
        return;
      }
      const profile = await r.json();
      setUserInfo(profile?.user || profile?.data || profile);
      setUserRole(ti.type);
      setIsAdmin(ti.type === "admin");
      const nowM = new Date().getMonth() + 1;
      const nowY = new Date().getFullYear();
      if (ti.type === "admin") {
        // Admin records view defaults to today only.
        await loadEmployees(ti.token);
        await loadDashStats(ti.token);
        await loadWeeklyOff(ti.token);
        await loadMonthHolidays(nowM, nowY, ti.token);
      } else {
        // Employee view defaults to the full current month (EmployeeMonthView
        // renders whenever dateRange spans more than a single day).
        setDateRange({
          start: isoDate(new Date(nowY, nowM - 1, 1)),
          end: isoDate(new Date(nowY, nowM, 0)),
        });
        await loadTodayStatus(ti.token);
        await loadSummary(ti.token);
        await loadWeeklyOff(ti.token);
        await loadMonthHolidays(nowM, nowY, ti.token);
      }
    } catch {
      router.push("/hrm");
    } finally {
      setLoading(false);
    }
  };

  const loadTodayStatus = async (tok) => {
    try {
      const t = tok || getToken()?.token;
      const r = await fetch(API + "/today-status", { headers: H(t) });
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
      const r = await fetch(API + "/summary?" + p, { headers: H(t) });
      if (!r.ok) return;
      const d = await r.json();
      if (d.summary) setSummary(d.summary);
    } catch {}
  };

  const loadDashStats = async (tok) => {
    try {
      const t = tok || getToken()?.token;
      const r = await fetch(API + "/admin/summary", { headers: H(t) });
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
        // Single-employee month view needs every day of the month, so request
        // a full month's worth instead of the paginated roster page size.
        limit: String(empFilter ? 100 : PER),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(empFilter && { employeeId: empFilter }),
        ...(searchQ && { search: searchQ }),
      });
      const ep = isAdmin
        ? API + "/admin/all-records?" + params
        : API + "/records?" + params;
      const r = await fetch(ep, { headers: H(ti.token), cache: "no-cache" });
      if (!r.ok) throw new Error();
      const d = await r.json();
      const recs = d.records || d.attendance || d.data?.records || [];
      setRecords(recs);
      setTotal(d.total || recs.length);
      if (!isAdmin) await loadSummary(ti.token);
      else await loadDashStats(ti.token);
    } catch {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async (tok) => {
    try {
      const t = tok || getToken()?.token;
      // Only load role=employee users — the attendance page (roster, filters,
      // manual entry) is for employees, not admins/moderators.
      const r = await fetch(API + "/admin/getAll-user?role=employee", {
        headers: H(t),
      });
      if (!r.ok) return;
      const d = await r.json();
      setEmployees(
        (Array.isArray(d) ? d : d.users || d.data || []).filter(
          (e) => e?._id && e.role === "employee",
        ),
      );
    } catch {}
  };

  const loadWeeklyOff = async (tok) => {
    try {
      const t = tok || getToken()?.token;
      const r = await fetch(API + "/weekly-off", { headers: H(t) });
      if (!r.ok) return;
      const d = await r.json();
      const days = d?.weeklyOffDays ||
        d?.data?.weeklyOffDays || ["Friday", "Saturday"];
      setWeeklyOffDays(Array.isArray(days) ? days : ["Friday", "Saturday"]);
    } catch {}
  };

  const loadMonthHolidays = async (month, year, tok) => {
    try {
      const t = tok || getToken()?.token;
      const r = await fetch(`${API}/holiday?year=${year}`, { headers: H(t) });
      if (!r.ok) return;
      const d = await r.json();
      const all = d.holidays || [];
      setMonthHolidays(
        all.filter((h) => {
          if (!h.isActive) return false;
          const hd = new Date(h.date);
          return (
            hd.getMonth() + 1 === Number(month) &&
            hd.getFullYear() === Number(year)
          );
        }),
      );
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

  const detectDevice = () => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;
    setDevInfo({
      type: /Mobile|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop",
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
            "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
              latitude +
              "&lon=" +
              longitude,
          );
          const d = await r.json();
          setGeoLoc({
            address:
              d.display_name ||
              latitude.toFixed(4) + ", " + longitude.toFixed(4),
            lat: latitude,
            lng: longitude,
          });
        } catch {
          setGeoLoc({
            address: latitude.toFixed(4) + ", " + longitude.toFixed(4),
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

  const handleClockIn = async () => {
    if (todayInfo.isMarkedAbsent) {
      toast.error("You are marked absent today. Contact admin.");
      return;
    }
    if (!todayInfo.isWorkingDay) {
      toast.error(
        "Today is " +
          (todayInfo.dayStatus?.status || "a non-working day") +
          ".",
      );
      return;
    }
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(API + "/clock-in", {
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
        setTodayInfo((prev) => ({
          ...prev,
          clockedIn: true,
          clockedOut: false,
          clockInTime: d.attendance?.clockIn || new Date().toISOString(),
          status: d.attendance?.status || "Present",
        }));
        toast.success(
          d.attendance?.isLate
            ? "Clocked in - " + d.attendance.lateMinutes + "m late"
            : "Clocked in - On time",
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
      toast.error("You have not clocked in yet.");
      return;
    }
    if (todayInfo.clockedOut) {
      toast.error("Already clocked out.");
      return;
    }
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(API + "/clock-out", {
        method: "POST",
        headers: H(ti.token),
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          location: geoLoc.address,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        setTodayInfo((prev) => ({
          ...prev,
          clockedOut: true,
          clockOutTime: d.attendance?.clockOut || new Date().toISOString(),
          status: d.attendance?.status || "Present",
        }));
        toast.success(
          "Clocked out - " + fmtHours(d.attendance?.totalHours) + " worked",
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

  const handleCreateManual = async () => {
    if (!mForm.employeeId) {
      toast.error("Please select an employee.");
      return;
    }
    setBusy(true);
    try {
      const ti = getToken();
      const body = {
        ...mForm,
        ...(mForm.clockIn && { clockIn: dt2iso(mForm.date, mForm.clockIn) }),
        ...(mForm.clockOut && { clockOut: dt2iso(mForm.date, mForm.clockOut) }),
      };
      const r = await fetch(API + "/admin/manual", {
        method: "POST",
        headers: H(ti.token),
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success(d.message || "Attendance record saved");
        setShowManual(false);
        setMForm(freshM());
        await fetchRecords();
      } else toast.error(d.message || "Failed to create");
    } catch {
      toast.error("Failed to create record.");
    } finally {
      setBusy(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!bForm.employeeId) {
      toast.error("Please select an employee.");
      return;
    }
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(API + "/admin/bulk-v2", {
        method: "POST",
        headers: H(ti.token),
        body: JSON.stringify(bForm),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success((d.results?.created || 0) + " records created");
        setShowBulk(false);
        await fetchRecords();
      } else toast.error(d.message || "Failed");
    } catch {
      toast.error("Bulk create failed.");
    } finally {
      setBusy(false);
    }
  };

  // Step 1: parse the file and show the full month, day-by-day, for selection.
  const handlePreview = async () => {
    if (!importEmp) {
      toast.error("Please select an employee.");
      return;
    }
    if (!importFile) {
      toast.error("Please choose an Excel or PDF file.");
      return;
    }
    setBusy(true);
    setImportResult(null);
    try {
      const ti = getToken();
      const fd = new FormData();
      fd.append("employeeId", importEmp);
      fd.append("month", String(importMonth));
      fd.append("year", String(importYear));
      fd.append("file", importFile);
      const r = await fetch(API + "/admin/import-attendance-preview", {
        method: "POST",
        headers: { Authorization: "Bearer " + ti.token },
        body: fd,
      });
      const d = await r.json();
      if (r.ok) {
        const days = d.days || [];
        setImportDays(days);
        // Default: pre-select (skip) any day that already has a record.
        setImportSkip(
          new Set(days.filter((x) => x.existing).map((x) => x.date)),
        );
        setImportStep("review");
      } else {
        toast.error(d.message || "Could not read the file");
      }
    } catch {
      toast.error("Preview failed.");
    } finally {
      setBusy(false);
    }
  };

  // Step 2: import only the days the admin kept (not skipped) that have data.
  const handleImportApply = async () => {
    const rows = importDays
      .filter((day) => day.file && !importSkip.has(day.date))
      .map((day) => ({
        date: day.date,
        inStr: day.file.inStr,
        outStr: day.file.outStr,
        status: day.file.status,
      }));
    if (rows.length === 0) {
      toast.error("No days selected to import.");
      return;
    }
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(API + "/admin/import-attendance-apply", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + ti.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId: importEmp, rows }),
      });
      const d = await r.json();
      if (r.ok) {
        setImportResult(d.results || null);
        toast.success(d.message || "Import complete");
        setImportStep("select");
        setImportDays([]);
        setImportFile(null);
        // Show the imported employee + month so results are visible.
        setEmpFilter(importEmp);
        selectMonth(importMonth, importYear);
      } else {
        toast.error(d.message || "Import failed");
      }
    } catch {
      toast.error("Import failed.");
    } finally {
      setBusy(false);
    }
  };

  const toggleImportSkip = (date) =>
    setImportSkip((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });

  // Days that will actually be imported (have file data and not skipped)
  const importSelectedCount = importDays.filter(
    (d) => d.file && !importSkip.has(d.date),
  ).length;
  const importFileDayCount = importDays.filter((d) => d.file).length;
  // Breakdown of what will happen on import, for the preview summary
  const importNewCount = importDays.filter(
    (d) => d.file && !importSkip.has(d.date) && !d.existing,
  ).length;
  const importOverwriteCount = importDays.filter(
    (d) => d.file && !importSkip.has(d.date) && d.existing,
  ).length;
  const importSkipCount = importDays.filter(
    (d) => d.file && importSkip.has(d.date),
  ).length;
  const importNoDataCount = importDays.filter((d) => !d.file).length;

  // What the import will do to a single preview row (drives colour + badge)
  const importRowOutcome = (day) => {
    if (!day.file) return "nodata";
    if (importSkip.has(day.date)) return "skip";
    return day.existing ? "overwrite" : "new";
  };

  const closeImport = () => {
    setShowImport(false);
    setImportFile(null);
    setImportResult(null);
    setImportStep("select");
    setImportDays([]);
    setImportSkip(new Set());
  };

  const downloadImportTemplate = async () => {
    try {
      const ExcelJS = (await import("exceljs")).default;
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Attendance");
      ws.columns = [
        { header: "Date", key: "date", width: 14 },
        { header: "Clock In", key: "in", width: 12 },
        { header: "Clock Out", key: "out", width: 12 },
        { header: "Status", key: "status", width: 14 },
      ];
      ws.getRow(1).font = { bold: true };
      // Example rows for the selected month (Date: YYYY-MM-DD, time: HH:mm). Status optional.
      const y = importYear;
      const m = String(importMonth).padStart(2, "0");
      ws.addRow({
        date: `${y}-${m}-01`,
        in: "09:05",
        out: "18:02",
        status: "",
      });
      ws.addRow({
        date: `${y}-${m}-02`,
        in: "09:45",
        out: "18:00",
        status: "",
      });
      ws.addRow({ date: `${y}-${m}-03`, in: "", out: "", status: "Absent" });
      // Force all cells to be plain text so Excel does not reformat dates/times
      ws.eachRow((row) =>
        row.eachCell((cell) => {
          cell.numFmt = "@";
        }),
      );
      const buf = await wb.xlsx.writeBuffer();
      const url = window.URL.createObjectURL(
        new Blob([buf], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_import_template.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not generate template.");
    }
  };

  const handleUpdate = async () => {
    if (!selRec) return;
    setBusy(true);
    try {
      const ti = getToken();
      const rd = new Date(selRec.date);
      // Only send totalHours when the admin actually changed the Hours field.
      // Sending it always makes the server treat it as a manual override, which
      // would stop hours from recalculating after clock in/out edits.
      const origHours =
        selRec.totalHours != null ? String(selRec.totalHours) : "";
      const hoursChanged =
        eForm.totalHours !== "" &&
        eForm.totalHours != null &&
        String(eForm.totalHours) !== origHours;
      const body = {
        status: eForm.status,
        remarks: eForm.remarks,
        correctionReason: eForm.correctionReason,
        ...(eForm.clockIn && { clockIn: dt2iso(isoDate(rd), eForm.clockIn) }),
        ...(eForm.clockOut && {
          clockOut: dt2iso(isoDate(rd), eForm.clockOut),
        }),
        ...(hoursChanged && { totalHours: parseFloat(eForm.totalHours) }),
      };
      const r = await fetch(API + "/admin/correct/" + selRec._id, {
        method: "PUT",
        headers: H(ti.token),
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success("Record corrected");
        setShowEdit(false);
        setSelRec(null);
        await fetchRecords();
      } else toast.error(d.message || "Failed to update");
    } catch {
      toast.error("Failed to update.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selRec) return;
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(API + "/admin/delete/" + selRec._id, {
        method: "DELETE",
        headers: H(ti.token),
        body: JSON.stringify({ reason: "Deleted by admin" }),
      });
      if (r.ok) {
        toast.success("Record deleted");
        setShowDel(false);
        setSelRec(null);
        await fetchRecords();
      } else {
        const d = await r.json();
        toast.error(d.message || "Failed");
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
      const r = await fetch(API + "/admin/trigger-absent-marking", {
        method: "POST",
        headers: H(ti.token),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success("Marked " + (d.results?.markedAbsent || 0) + " absent");
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
      const r = await fetch(API + "/admin/trigger-auto-clockout", {
        method: "POST",
        headers: H(ti.token),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success("Auto clocked out " + (d.results?.autoClockOuts || 0));
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
      const r = await fetch(API + "/admin/trigger-tomorrow-records", {
        method: "POST",
        headers: H(ti.token),
      });
      const d = await r.json();
      if (r.ok)
        toast.success(
          "Generated " + (d.results?.recordsCreated || 0) + " records",
        );
      else toast.error(d.message || "Failed");
    } catch {
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };

  const cleanupDups = async () => {
    setBusy(true);
    try {
      const ti = getToken();
      const r = await fetch(API + "/admin/cleanup-duplicates", {
        method: "POST",
        headers: H(ti.token),
        body: JSON.stringify({
          startDate: dateRange.start,
          endDate: dateRange.end,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        toast.success("Cleaned " + (d.cleaned || 0) + " duplicates");
        await fetchRecords();
      } else toast.error(d.message || "Failed");
    } catch {
      toast.error("Failed");
    } finally {
      setBusy(false);
    }
  };

  // Computed status label for export — same classification used on screen,
  // but keeps real holiday/off-day statuses intact.
  const exportStatusLabel = (rec) => {
    if (HOLIDAY_STATUSES.has(rec.status)) return rec.status;
    const cls = classifyRec(rec);
    return (
      {
        present: "Present",
        late: "Late",
        miss: "Absent",
        leave: "Leave",
        halfday: "Half Day",
      }[cls] ||
      rec.status ||
      "--"
    );
  };

  // Build a real .xlsx on the client (exceljs) from ALL records in the
  // current date range + filters. Works for both employee (own records via
  // /records) and admin (filtered records via /admin/all-records).
  const exportData = async () => {
    setExportLoading(true);
    try {
      const ti = getToken();
      if (!ti) return;
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        page: "1",
        limit: "10000",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(empFilter && { employeeId: empFilter }),
        ...(searchQ && { search: searchQ }),
      });
      const ep = isAdmin
        ? API + "/admin/all-records?" + params
        : API + "/records?" + params;
      const r = await fetch(ep, { headers: H(ti.token), cache: "no-cache" });
      if (!r.ok) {
        toast.error("Export failed");
        return;
      }
      const d = await r.json();
      const recs = (d.records || d.attendance || d.data?.records || [])
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (recs.length === 0) {
        toast.error("No records to export for this period");
        return;
      }

      const ExcelJSmod = await import("exceljs");
      const ExcelJS = ExcelJSmod.default || ExcelJSmod;
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Attendance");

      const empCols = isAdmin
        ? [
            { header: "Employee", key: "empName", width: 22 },
            { header: "Emp ID", key: "empId", width: 16 },
            { header: "Department", key: "dept", width: 16 },
          ]
        : [];
      ws.columns = [
        ...empCols,
        { header: "Date", key: "date", width: 14 },
        { header: "Day", key: "day", width: 8 },
        { header: "Status", key: "status", width: 14 },
        { header: "Clock In", key: "clockIn", width: 12 },
        { header: "Clock Out", key: "clockOut", width: 12 },
        { header: "Total Hours", key: "hours", width: 12 },
        { header: "Late (min)", key: "late", width: 10 },
        { header: "Remarks", key: "remarks", width: 30 },
      ];

      // Header styling
      ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      ws.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF113F67" },
      };
      ws.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

      let present = 0,
        miss = 0,
        late = 0,
        leaveHalf = 0,
        totalHours = 0;
      recs.forEach((rec) => {
        const label = exportStatusLabel(rec);
        if (label === "Present") present++;
        else if (label === "Late") {
          present++;
          late++;
        } else if (label === "Absent") miss++;
        else if (label === "Leave" || label === "Half Day") {
          // Paid/Sick leave counts as present; Unpaid leave counts as absent
          // (same rule as the month-view header and payroll).
          leaveHalf++;
          if (rec.status === "Unpaid Leave") miss++;
          else if (rec.status === "Half Paid Leave") {
            present += 0.5;
            miss += 0.5;
          } else if (label === "Leave") present++;
        }
        totalHours += rec.totalHours || 0;
        const e = rec.employee || {};
        ws.addRow({
          empName:
            `${e.firstName || ""} ${e.lastName || ""}`.trim() ||
            rec.employeeName ||
            "--",
          empId: e.employeeId || rec.employeeId || "--",
          dept: e.department || rec.department || "--",
          date: fmtDate(rec.date),
          day: fmtDay(rec.date),
          status: label,
          clockIn: rec.clockIn ? fmtTime(rec.clockIn) : "--",
          clockOut: rec.clockOut ? fmtTime(rec.clockOut) : "--",
          hours: rec.totalHours ? Number(rec.totalHours).toFixed(2) : "0.00",
          late: computeLateMinutes(rec) || 0,
          remarks: rec.remarks || "",
        });
      });

      // Summary block
      ws.addRow({});
      const summary = [
        ["Total Records", recs.length],
        ["Present (incl. late)", present],
        ["Late days", late],
        ["Absent", miss],
        ["Leave / Half", leaveHalf],
        ["Total Hours", totalHours.toFixed(2)],
      ];
      summary.forEach(([k, v]) => {
        const row = ws.addRow({ date: k, day: v });
        row.getCell("date").font = { bold: true };
      });

      const buf = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const who =
        isAdmin && empFilter
          ? employees.find((x) => x._id === empFilter)?.firstName || "employee"
          : !isAdmin
            ? `${userInfo?.firstName || "my"}`
            : "all";
      a.href = url;
      a.download = `attendance-${who}-${dateRange.start}-to-${dateRange.end}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Excel downloaded");
    } catch (err) {
      toast.error("Export failed");
    } finally {
      setExportLoading(false);
    }
  };

  // Download a single employee's FULL-MONTH attendance as a PDF (react-pdf).
  // Employee → own month. Admin → the employee picked in the filter dropdown.
  const exportPDF = async () => {
    if (isAdmin && !empFilter) {
      toast.error("Select an employee first to download a PDF");
      return;
    }
    setExportLoading(true);
    try {
      const ti = getToken();
      if (!ti) return;
      // Always use the full selected month so the PDF is a complete month even
      // when the admin table is in single-day (roster) mode.
      const mStart = isoDate(new Date(filterYear, filterMonth - 1, 1));
      const mEnd = isoDate(new Date(filterYear, filterMonth, 0));
      const params = new URLSearchParams({
        startDate: mStart,
        endDate: mEnd,
        page: "1",
        limit: "10000",
        ...(empFilter && { employeeId: empFilter }),
      });
      const ep = isAdmin
        ? API + "/admin/all-records?" + params
        : API + "/records?" + params;
      const r = await fetch(ep, { headers: H(ti.token), cache: "no-cache" });
      if (!r.ok) {
        toast.error("PDF export failed");
        return;
      }
      const d = await r.json();
      const recs = (d.records || d.attendance || d.data?.records || [])
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      if (recs.length === 0) {
        toast.error("No records to export for this month");
        return;
      }

      const emp = isAdmin
        ? employees.find((x) => x._id === empFilter)
        : userInfo;
      const fullName = emp
        ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim()
        : "Employee";
      const userData = {
        name: fullName,
        fullName,
        firstName: emp?.firstName || "",
        lastName: emp?.lastName || "",
        employeeId: emp?.employeeId || "",
        department: emp?.department || "",
      };

      const [pdfRendererMod, pdfDocMod] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/hrm/AttendanceReportPDF"),
      ]);
      const { pdf } = pdfRendererMod;
      const AttendanceReportPDF = pdfDocMod.default;

      const blob = await pdf(
        <AttendanceReportPDF
          attendance={recs}
          dateRange={{ startDate: mStart, endDate: mEnd }}
          isAdmin={false}
          userData={userData}
          selectedEmployeeName={fullName}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${(fullName || "employee").replace(/\s+/g, "_")}-${MONTHS[filterMonth - 1]}-${filterYear}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error("PDF export failed");
    } finally {
      setExportLoading(false);
    }
  };

  const quickDate = (type) => {
    const t = new Date();
    let range;
    const s = (d) => isoDate(d);
    if (type === "today") range = { start: s(t), end: s(t) };
    else if (type === "yesterday") {
      const y = new Date(t);
      y.setDate(y.getDate() - 1);
      range = { start: s(y), end: s(y) };
    } else if (type === "this-week") {
      const m = new Date(t);
      m.setDate(t.getDate() - t.getDay() + 1);
      range = { start: s(m), end: s(t) };
    } else if (type === "this-month")
      range = {
        start: isoDate(new Date(t.getFullYear(), t.getMonth(), 1)),
        end: isoDate(new Date(t.getFullYear(), t.getMonth() + 1, 0)),
      };
    else if (type === "last-month")
      range = {
        start: isoDate(new Date(t.getFullYear(), t.getMonth() - 1, 1)),
        end: isoDate(new Date(t.getFullYear(), t.getMonth(), 0)),
      };
    else if (type === "7d") {
      const w = new Date(t);
      w.setDate(w.getDate() - 6);
      range = { start: s(w), end: s(t) };
    }
    if (range) {
      setDateRange(range);
      setPage(1);
    }
  };

  const selectMonth = (m, y) => {
    const month = Number(m);
    const year = Number(y);
    setFilterMonth(month);
    setFilterYear(year);
    setDateRange({
      start: isoDate(new Date(year, month - 1, 1)),
      end: isoDate(new Date(year, month, 0)),
    });
    setPage(1);
    loadMonthHolidays(month, year);
  };

  const totalPages = Math.ceil(total / PER);

  // Admin single-day roster: when viewing ONE day (e.g. today) with no employee
  // filter, show a row for EVERY employee. Employees without an attendance record
  // for that day appear as "Not Clocked In" placeholders, so the admin always
  // sees the full team instead of "No records found" when nobody has clocked in.
  const adminRosterMode =
    isAdmin &&
    !empFilter &&
    dateRange.start === dateRange.end &&
    employees.length > 0;
  // Set of role=employee user IDs — used to drop any admin/moderator attendance
  // rows from the admin table so only employee records are shown.
  const employeeIdSet = new Set(employees.map((e) => String(e._id)));
  const adminDisplayRecords = adminRosterMode
    ? employees.map((emp) => {
        const rec = records.find(
          (r) => String(r.employee?._id || r.employee) === String(emp._id),
        );
        return (
          rec || {
            _id: "ph-" + emp._id,
            employee: emp,
            employeeId: emp.employeeId,
            date: dateRange.start,
            status: "Not Clocked In",
            clockIn: null,
            clockOut: null,
            totalHours: 0,
            _placeholder: true,
          }
        );
      })
    : isAdmin && employees.length > 0
      ? records.filter((r) =>
          employeeIdSet.has(String(r.employee?._id || r.employee)),
        )
      : records;

  const clockStr = now.toLocaleTimeString("en-BD", {
    ...BD,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-BD", {
    ...BD,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading && !userRole)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#113F67] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Clock size={34} className="text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-600">
            Loading Attendance...
          </p>
        </div>
      </div>
    );

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
    const workedH = workedMs / 3600000;
    const hBg = todayInfo.clockedOut
      ? "from-emerald-600 to-emerald-500"
      : todayInfo.clockedIn
        ? "from-blue-600 to-blue-500"
        : todayInfo.isMarkedAbsent
          ? "from-red-600 to-red-500"
          : !todayInfo.isWorkingDay
            ? "from-slate-500 to-slate-600"
            : "from-[#113F67] to-[#1a5c9a]";
    const sLabel = todayInfo.clockedOut
      ? "Shift Complete"
      : todayInfo.clockedIn
        ? "Currently Working"
        : todayInfo.isMarkedAbsent
          ? "Marked Absent"
          : !todayInfo.isWorkingDay
            ? todayInfo.dayStatus?.status || "Day Off"
            : "Not Clocked In Yet";
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-sky-50 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-5rem] h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />
          <div className="absolute top-[20rem] left-[-6rem] h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />
        </div>
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 shadow-sm backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <p className="text-base font-mono font-bold text-[#113F67] hidden sm:block">
                {clockStr}
              </p>
              <button
                onClick={exportData}
                disabled={exportLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-60"
              >
                {exportLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Download size={13} />
                )}
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                onClick={refresh}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </header>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-5 md:py-6 space-y-4 md:space-y-5">
          {!todayInfo.isWorkingDay && (
            <div className="flex items-start gap-3 bg-amber-50/90 border border-amber-200 rounded-2xl p-4 shadow-sm">
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
            <div className="flex items-start gap-3 bg-red-50/90 border border-red-200 rounded-2xl p-4 shadow-sm">
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
          <div className="rounded-3xl overflow-hidden border border-white/70 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <div className={`bg-linear-to-r ${hBg} p-5 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Today
                  </p>
                  <p className="text-xl font-bold">{sLabel}</p>
                  {todayInfo.status && (
                    <div className="mt-1">
                      <StatusBadge status={todayInfo.status} />
                    </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { label: "Clock In", val: fmtTime(todayInfo.clockInTime) },
                  {
                    label: "Worked",
                    val: workedMs > 0 ? fmtHours(workedH) : "--",
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
            <div className="bg-white p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleClockIn}
                  disabled={!canIn || busy}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${canIn && !busy ? "bg-[#113F67] text-white hover:bg-[#0d3155] shadow-md" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  {busy && canIn ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogIn size={16} />
                  )}{" "}
                  Clock In
                </button>
                <button
                  onClick={handleClockOut}
                  disabled={!canOut || busy}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${canOut && !busy ? "bg-rose-500 text-white hover:bg-rose-600 shadow-md" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  {busy && canOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}{" "}
                  Clock Out
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Clock4 size={12} className="text-[#113F67] shrink-0" />
                  {shift ? (
                    <>
                      <strong className="text-gray-700">
                        {shift.start} - {shift.end}
                      </strong>
                      {shift.isNightShift && (
                        <span className="text-indigo-500 ml-1">Night</span>
                      )}
                    </>
                  ) : (
                    "--"
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
                  {devInfo.type} - {devInfo.browser} - {ipAddr}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
            {/* Month / Year primary filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#113F67]/5 border border-[#113F67]/20 rounded-xl px-3 py-2">
                <CalendarDays size={14} className="text-[#113F67] shrink-0" />
                <select
                  value={filterMonth}
                  onChange={(e) => selectMonth(e.target.value, filterYear)}
                  className="text-xs font-semibold text-[#113F67] bg-transparent focus:outline-none cursor-pointer"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={filterYear}
                  onChange={(e) => selectMonth(filterMonth, e.target.value)}
                  className="text-xs font-semibold text-[#113F67] bg-transparent focus:outline-none cursor-pointer"
                >
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - 2 + i,
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#113F67] text-gray-600"
              >
                <option value="all">All Status</option>
                {Object.keys(STATUS_CFG).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={exportData}
                disabled={exportLoading}
                className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#113F67] border border-[#113F67]/30 rounded-lg hover:bg-[#113F67]/5 transition-colors"
              >
                {exportLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Download size={12} />
                )}{" "}
                Export
              </button>
              <button
                onClick={exportPDF}
                disabled={exportLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
              >
                {exportLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <FileText size={12} />
                )}{" "}
                PDF
              </button>
            </div>
          </div>
          {dateRange.start !== dateRange.end ? (
            <EmployeeMonthView
              records={records}
              empInfo={userInfo}
              filterMonth={filterMonth}
              filterYear={filterYear}
              loading={loading}
              weeklyOffDays={weeklyOffDays}
              holidays={monthHolidays}
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CalendarDays size={15} className="text-[#113F67]" />
                  <span className="text-sm font-bold text-gray-700">
                    Today&apos;s Record
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {total} {total === 1 ? "entry" : "entries"}
                </span>
              </div>
              {loading ? (
                <Skeleton rows={3} />
              ) : records.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDays
                    size={36}
                    className="text-gray-200 mx-auto mb-3"
                  />
                  <p className="text-sm font-medium text-gray-500">
                    No record for today
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {records
                    .filter((r) => !HOLIDAY_STATUSES.has(r.status))
                    .map((rec) => {
                      const cls = classifyRec(rec);
                      const BADGE = {
                        present: {
                          label: "Present",
                          bg: "bg-emerald-100",
                          text: "text-emerald-700",
                          border: "border-emerald-200",
                          dot: "bg-emerald-500",
                        },
                        late: {
                          label: "Late",
                          bg: "bg-amber-100",
                          text: "text-amber-700",
                          border: "border-amber-200",
                          dot: "bg-amber-500",
                        },
                        miss: {
                          label: "Absent",
                          bg: "bg-red-100",
                          text: "text-red-700",
                          border: "border-red-200",
                          dot: "bg-red-500",
                        },
                        leave: {
                          label: "Leave",
                          bg: "bg-purple-100",
                          text: "text-purple-700",
                          border: "border-purple-200",
                          dot: "bg-purple-500",
                        },
                        halfday: {
                          label: "Half Day",
                          bg: "bg-lime-100",
                          text: "text-lime-700",
                          border: "border-lime-200",
                          dot: "bg-lime-500",
                        },
                      };
                      const badge = BADGE[cls];
                      const isExp = expanded === rec._id;
                      return (
                        <div key={rec._id}>
                          <div
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 cursor-pointer transition-colors"
                            onClick={() => setExpanded(isExp ? null : rec._id)}
                          >
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
                            <div className="flex-1 min-w-0">
                              {badge ? (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                                  />
                                  {badge.label}
                                </span>
                              ) : (
                                <StatusBadge status={rec.status} />
                              )}
                              {cls === "late" &&
                                computeLateMinutes(rec) > 0 && (
                                  <p className="text-xs mt-1 font-semibold text-amber-500">
                                    {computeLateMinutes(rec)}m late
                                  </p>
                                )}
                              {cls === "miss" && rec.clockIn && (
                                <p className="text-xs mt-1 font-semibold text-red-400">
                                  After 12pm
                                </p>
                              )}
                            </div>
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
                            <div className="bg-slate-50 px-4 sm:px-5 py-4 border-t border-gray-100">
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
                                <div>
                                  <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                    Shift
                                  </p>
                                  <p className="text-gray-600">
                                    {rec.shift?.name || "--"} {rec.shift?.start}
                                    -{rec.shift?.end}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                    Hours
                                  </p>
                                  <p className="text-gray-600 font-bold">
                                    {fmtHours(rec.totalHours)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                    Location
                                  </p>
                                  <p className="text-gray-600 truncate">
                                    {rec.location || "--"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                    IP
                                  </p>
                                  <p className="text-gray-600">
                                    {rec.ipAddress || "--"}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1.5">
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
                                  </div>
                                </div>
                                {rec.remarks && (
                                  <div className="sm:col-span-2 xl:col-span-4">
                                    <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                      Remarks
                                    </p>
                                    <p className="text-gray-600">
                                      {rec.remarks}
                                    </p>
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
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white transition-colors"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-5rem] h-60 w-60 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="absolute top-[22rem] right-[-6rem] h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      </div>
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
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
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Refresh — subtle icon button */}
            <button
              onClick={refresh}
              disabled={loading}
              title="Refresh"
              className="flex items-center justify-center w-9 h-9 text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>

            {/* Export group — Excel + PDF share one pill */}
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={exportData}
                disabled={exportLoading}
                title="Export records to Excel"
                className="flex items-center gap-1.5 px-3 h-9 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {exportLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Download size={13} />
                )}
                Excel
              </button>
              <span className="w-px h-5 bg-gray-200" />
              <button
                onClick={exportPDF}
                disabled={exportLoading}
                title="Download one employee's full-month attendance as PDF (select an employee first)"
                className="flex items-center gap-1.5 px-3 h-9 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <FileText size={13} />
                PDF
              </button>
            </div>

            {/* Add-data group — Bulk + Import share one pill */}
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowBulk(true)}
                title="Mark many days present at once"
                className="hidden sm:flex items-center gap-1.5 px-3 h-9 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Layers size={13} /> Bulk
              </button>
              <span className="hidden sm:block w-px h-5 bg-gray-200" />
              <button
                onClick={() => setShowImport(true)}
                title="Upload one employee's full-month attendance (RAMS PDF report or Excel/CSV)"
                className="flex items-center gap-1.5 px-3 h-9 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
              >
                <FileSpreadsheet size={13} /> Import
              </button>
            </div>

            {/* Primary action */}
            <button
              onClick={() => setShowManual(true)}
              className="flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold bg-[#113F67] text-white rounded-xl hover:bg-[#0d3155] transition-colors shadow-sm"
            >
              <Plus size={14} /> Manual Entry
            </button>
          </div>
        </div>
      </header>
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-5 md:py-6 space-y-5 md:space-y-6">
        {dashStats && (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              icon={Users}
              label="Total Employees"
              value={dashStats.totalEmployees || employees.length}
              sub="Active"
              color="bg-blue-600"
            />
            <StatCard
              icon={CheckCircle}
              label="Present Today"
              value={dashStats.presentToday || 0}
              sub={
                (dashStats.totalEmployees
                  ? Math.round(
                      (dashStats.presentToday / dashStats.totalEmployees) * 100,
                    )
                  : 0) + "% of total"
              }
              color="bg-emerald-500"
            />
            <StatCard
              icon={XCircle}
              label="Absent Today"
              value={dashStats.absentToday || 0}
              sub="Not clocked in"
              color="bg-red-500"
            />
            <StatCard
              icon={Timer}
              label="Pending Clockout"
              value={dashStats.pendingClockOut || 0}
              sub="Clocked in only"
              color="bg-amber-500"
            />
          </div>
        )}
        <div className="rounded-3xl border border-white/70 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)] p-4 md:p-5 space-y-4 backdrop-blur-sm">
          {/* Primary filter: Month + Year + Employee + Status + Search */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1.5 bg-[#113F67]/5 border border-[#113F67]/20 rounded-2xl px-3 py-2 shrink-0 shadow-sm">
              <CalendarDays size={14} className="text-[#113F67] shrink-0" />
              <select
                value={filterMonth}
                onChange={(e) => selectMonth(e.target.value, filterYear)}
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
                onChange={(e) => selectMonth(filterMonth, e.target.value)}
                className="text-sm font-semibold text-[#113F67] bg-transparent focus:outline-none cursor-pointer"
              >
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() - 2 + i,
                ).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative min-w-0 w-full sm:w-auto sm:flex-1">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQ}
                onChange={(e) => {
                  setSearchQ(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#113F67] focus:bg-white transition-colors"
              />
            </div>
            <select
              value={empFilter}
              onChange={(e) => {
                const val = e.target.value;
                setEmpFilter(val);
                setPage(1);
                if (val) {
                  setDateRange({
                    start: isoDate(new Date(filterYear, filterMonth - 1, 1)),
                    end: isoDate(new Date(filterYear, filterMonth, 0)),
                  });
                }
              }}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:border-[#113F67] min-w-0 w-full sm:w-auto sm:min-w-40"
            >
              <option value="">All Employees</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.firstName} {e.lastName}
                </option>
              ))}
            </select>
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
        </div>
        {empFilter ? (
          <EmployeeMonthView
            records={records}
            employees={employees}
            empFilter={empFilter}
            filterMonth={filterMonth}
            filterYear={filterYear}
            loading={loading}
            weeklyOffDays={weeklyOffDays}
            holidays={monthHolidays}
            onClearFilter={() => {
              setEmpFilter("");
              setPage(1);
              const t = new Date();
              setDateRange({ start: isoDate(t), end: isoDate(t) });
            }}
            onEdit={(rec) => {
              setSelRec(rec);
              setEForm({
                clockIn: toTStr(rec.clockIn),
                clockOut: toTStr(rec.clockOut),
                status: rec.status,
                totalHours:
                  rec.totalHours != null ? String(rec.totalHours) : "",
                remarks: rec.remarks || "",
                correctionReason: rec.correctionReason || "",
              });
              setShowEdit(true);
            }}
            onDelete={(rec) => {
              setSelRec(rec);
              setShowDel(true);
            }}
          />
        ) : (
          <div className="rounded-3xl border border-white/70 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)] overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-[#113F67]" />
                <span className="text-sm font-bold text-gray-700">
                  Attendance Records
                </span>
                <span className="px-2 py-0.5 bg-[#113F67]/10 text-[#113F67] text-xs rounded-full font-bold">
                  {adminRosterMode ? adminDisplayRecords.length : total}
                </span>
              </div>
              {loading && (
                <Loader2 size={14} className="animate-spin text-gray-400" />
              )}
            </div>
            {!loading && adminDisplayRecords.length > 0 && (
              <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-2.5 bg-gray-50/40 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
                <div className="col-span-3">Employee</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Clock In</div>
                <div className="col-span-1">Clock Out</div>
                <div className="col-span-1">Worked Hours</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
            )}
            {loading ? (
              <Skeleton rows={8} />
            ) : adminDisplayRecords.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Database size={30} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500">
                  No records found
                </p>
              </div>
            ) : (
              <div>
                {adminDisplayRecords.map((rec, idx) => {
                  const emp = rec.employee;
                  const name = emp
                    ? (
                        (emp.firstName || "") +
                        " " +
                        (emp.lastName || "")
                      ).trim()
                    : "--";
                  const eid = emp?.employeeId || "--";
                  const cls = classifyRec(rec);
                  // Use computed late minutes (handles old records where DB lateMinutes=0)
                  const lateMin = cls === "late" ? computeLateMinutes(rec) : 0;
                  const li =
                    cls === "late" && lateMin > 0
                      ? { t: "late", m: lateMin }
                      : null;
                  const ADMIN_BADGE = {
                    present: {
                      label: "Present",
                      bg: "bg-emerald-100",
                      text: "text-emerald-700",
                      border: "border-emerald-200",
                      dot: "bg-emerald-500",
                    },
                    late: {
                      label: "Late",
                      bg: "bg-amber-100",
                      text: "text-amber-700",
                      border: "border-amber-200",
                      dot: "bg-amber-500",
                    },
                    miss: {
                      label: "Absent",
                      bg: "bg-red-100",
                      text: "text-red-700",
                      border: "border-red-200",
                      dot: "bg-red-500",
                    },
                    leave: {
                      label: "Leave",
                      bg: "bg-purple-100",
                      text: "text-purple-700",
                      border: "border-purple-200",
                      dot: "bg-purple-500",
                    },
                    halfday: {
                      label: "Half Day",
                      bg: "bg-lime-100",
                      text: "text-lime-700",
                      border: "border-lime-200",
                      dot: "bg-lime-500",
                    },
                  };
                  const adminBadge = ADMIN_BADGE[cls];
                  const prevRec = idx > 0 ? adminDisplayRecords[idx - 1] : null;
                  const currIso = rec.date
                    ? new Date(rec.date).toISOString().split("T")[0]
                    : null;
                  const prevIso = prevRec?.date
                    ? new Date(prevRec.date).toISOString().split("T")[0]
                    : null;
                  const dateChanged = idx > 0 && currIso !== prevIso;
                  const isExp = expanded === rec._id;
                  return (
                    <React.Fragment key={rec._id}>
                      {dateChanged && (
                        <div className="h-px bg-emerald-400 mx-5" />
                      )}
                      <div className="border-b border-gray-50 last:border-b-0 hover:bg-slate-50/60 transition-colors">
                        <div className="grid grid-cols-12 gap-3 px-4 sm:px-5 py-4 items-center">
                          <div className="col-span-12 lg:col-span-3 flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-[#113F67]/10 flex items-center justify-center ring-2 ring-white shadow-sm">
                              {emp?.picture ? (
                                <img
                                  src={emp.picture}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[#113F67] text-sm font-bold">
                                  {name.charAt(0) || "?"}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {eid}
                                {emp?.department ? " - " + emp.department : ""}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-5 lg:col-span-2">
                            <p className="text-sm font-semibold text-gray-800">
                              {fmtDate(rec.date)}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {fmtDay(rec.date)}
                            </p>
                          </div>
                          <div className="col-span-7 lg:col-span-2">
                            {rec._placeholder ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-gray-100 text-gray-500 border-gray-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                Not Clocked In
                              </span>
                            ) : VERBATIM_STATUSES.has(rec.status) ? (
                              <StatusBadge status={rec.status} />
                            ) : adminBadge ? (
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${adminBadge.bg} ${adminBadge.text} ${adminBadge.border}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${adminBadge.dot}`}
                                />
                                {adminBadge.label}
                              </span>
                            ) : (
                              <StatusBadge status={rec.status} />
                            )}
                            {li && (
                              <p
                                className={`text-xs mt-1 font-semibold ${li.t === "late" ? "text-amber-500" : "text-blue-500"}`}
                              >
                                {li.m}m {li.t}
                              </p>
                            )}
                          </div>
                          <div className="col-span-3 lg:col-span-1">
                            <p className="text-xs text-gray-400">In</p>
                            <p className="text-sm font-mono font-semibold text-gray-800">
                              {fmtTime(rec.clockIn)}
                            </p>
                          </div>
                          <div className="col-span-3 lg:col-span-1">
                            <p className="text-xs text-gray-400">Out</p>
                            <p className="text-sm font-mono font-semibold text-gray-800">
                              {fmtTime(rec.clockOut)}
                            </p>
                            {rec.autoClockOut && (
                              <p className="text-xs text-amber-500">Auto</p>
                            )}
                          </div>
                          <div className="col-span-3 lg:col-span-1">
                            <p className="text-xs text-gray-400">Hours</p>
                            <p className="text-sm font-bold text-[#113F67]">
                              {fmtHours(rec.totalHours)}
                            </p>
                          </div>
                          <div className="col-span-3 lg:col-span-2 flex items-center justify-end gap-1">
                            {rec._placeholder ? (
                              <button
                                onClick={() => {
                                  setMForm({
                                    ...freshM(),
                                    employeeId: emp._id,
                                    date: isoDate(new Date(rec.date)),
                                  });
                                  setShowManual(true);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#113F67] hover:bg-blue-50 rounded-lg transition-colors"
                                title="Add attendance entry"
                              >
                                <Plus size={13} /> Add
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    setExpanded(isExp ? null : rec._id)
                                  }
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#113F67] hover:bg-blue-50 transition-colors"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelRec(rec);
                                    setEForm({
                                      clockIn: toTStr(rec.clockIn),
                                      clockOut: toTStr(rec.clockOut),
                                      status: rec.status,
                                      totalHours:
                                        rec.totalHours != null
                                          ? String(rec.totalHours)
                                          : "",
                                      remarks: rec.remarks || "",
                                      correctionReason:
                                        rec.correctionReason || "",
                                    });
                                    setShowEdit(true);
                                  }}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelRec(rec);
                                    setShowDel(true);
                                  }}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {isExp && (
                          <div className="bg-slate-50 border-t border-gray-100 px-4 sm:px-5 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
                              <div>
                                <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                  Shift
                                </p>
                                <p className="text-gray-700">
                                  {rec.shift?.name || "--"} {rec.shift?.start}-
                                  {rec.shift?.end}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                  Location
                                </p>
                                <p className="text-gray-700 truncate">
                                  {rec.location || "--"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                  Device
                                </p>
                                <p className="text-gray-700">
                                  {rec.device?.type || "--"} /{" "}
                                  {rec.device?.os || "--"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-bold uppercase tracking-wide mb-1">
                                  IP
                                </p>
                                <p className="text-gray-700">
                                  {rec.ipAddress || "--"}
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
                    </React.Fragment>
                  );
                })}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
                <p className="text-xs text-gray-500">
                  Showing {(page - 1) * PER + 1}-{Math.min(page * PER, total)}{" "}
                  of {total}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white"
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
                        className={`w-8 h-8 text-xs rounded-lg font-semibold ${page === pg ? "bg-[#113F67] text-white" : "border border-gray-200 text-gray-600 hover:bg-white"}`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white"
                  >
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        show={showManual}
        onClose={() => setShowManual(false)}
        title="Create Manual Attendance"
        subtitle="Add attendance record for any employee"
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
              disabled={busy || !mForm.employeeId}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#113F67] text-white text-sm font-bold hover:bg-[#0d3155] disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}{" "}
              Create
            </button>
          </div>
        }
      >
        <FormField label="Employee" required>
          <select
            value={mForm.employeeId}
            onChange={(e) =>
              setMForm((p) => ({ ...p, employeeId: e.target.value }))
            }
            className={sel}
          >
            <option value="">Select an employee...</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.firstName} {e.lastName}
              </option>
            ))}
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date" required>
            <input
              type="date"
              value={mForm.date}
              onChange={(e) =>
                setMForm((p) => ({ ...p, date: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Status" required>
            <select
              value={mForm.status}
              onChange={(e) =>
                setMForm((p) => ({ ...p, status: e.target.value }))
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
              value={mForm.clockIn}
              onChange={(e) =>
                setMForm((p) => ({ ...p, clockIn: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Clock Out">
            <input
              type="time"
              value={mForm.clockOut}
              onChange={(e) =>
                setMForm((p) => ({ ...p, clockOut: e.target.value }))
              }
              className={inp}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Shift Start">
            <input
              type="time"
              value={mForm.shiftStart}
              onChange={(e) =>
                setMForm((p) => ({ ...p, shiftStart: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Shift End">
            <input
              type="time"
              value={mForm.shiftEnd}
              onChange={(e) =>
                setMForm((p) => ({ ...p, shiftEnd: e.target.value }))
              }
              className={inp}
            />
          </FormField>
        </div>
        <FormField label="Remarks">
          <textarea
            rows={2}
            value={mForm.remarks}
            onChange={(e) =>
              setMForm((p) => ({ ...p, remarks: e.target.value }))
            }
            placeholder="Optional note..."
            className={inp + " resize-none"}
          />
        </FormField>
      </Modal>

      <Modal
        show={showBulk}
        onClose={() => setShowBulk(false)}
        title="Bulk Attendance"
        subtitle="Generate records for a full month"
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
              disabled={busy || !bForm.employeeId}
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
            value={bForm.employeeId}
            onChange={(e) =>
              setBForm((p) => ({ ...p, employeeId: e.target.value }))
            }
            className={sel}
          >
            <option value="">Select an employee...</option>
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
              value={bForm.month}
              onChange={(e) =>
                setBForm((p) => ({ ...p, month: Number(e.target.value) }))
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
              value={bForm.year}
              onChange={(e) =>
                setBForm((p) => ({ ...p, year: Number(e.target.value) }))
              }
              className={inp}
              min="2020"
              max="2030"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Clock In">
            <input
              type="time"
              value={bForm.defaultClockIn}
              onChange={(e) =>
                setBForm((p) => ({ ...p, defaultClockIn: e.target.value }))
              }
              className={inp}
            />
          </FormField>
          <FormField label="Clock Out">
            <input
              type="time"
              value={bForm.defaultClockOut}
              onChange={(e) =>
                setBForm((p) => ({ ...p, defaultClockOut: e.target.value }))
              }
              className={inp}
            />
          </FormField>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={bForm.skipWeekends}
              onChange={(e) =>
                setBForm((p) => ({ ...p, skipWeekends: e.target.checked }))
              }
              className="w-4 h-4 accent-[#113F67]"
            />
            <span className="text-sm text-gray-700">Skip Weekends</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={bForm.markAllPresent}
              onChange={(e) =>
                setBForm((p) => ({ ...p, markAllPresent: e.target.checked }))
              }
              className="w-4 h-4 accent-[#113F67]"
            />
            <span className="text-sm text-gray-700">Mark All Present</span>
          </label>
        </div>
      </Modal>

      <Modal
        show={showImport}
        onClose={closeImport}
        size={importStep === "review" ? "max-w-3xl" : "max-w-lg"}
        title="Import Attendance (PDF / Excel)"
        subtitle={
          importStep === "review"
            ? "Tick the days to import — days already recorded are overwritten"
            : "Upload one employee's full-month report"
        }
        footer={
          importStep === "review" ? (
            <div className="flex gap-3">
              <button
                onClick={() => setImportStep("select")}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleImportApply}
                disabled={busy || importSelectedCount === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}{" "}
                Import {importSelectedCount} day
                {importSelectedCount === 1 ? "" : "s"}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={closeImport}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePreview}
                disabled={busy || !importEmp || !importFile}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Eye size={15} />
                )}{" "}
                Preview
              </button>
            </div>
          )
        }
      >
        {importStep === "select" ? (
          <>
            <FormField label="Employee" required>
              <select
                value={importEmp}
                onChange={(e) => setImportEmp(e.target.value)}
                className={sel}
              >
                <option value="">Select an employee...</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Month" required>
                <select
                  value={importMonth}
                  onChange={(e) => setImportMonth(Number(e.target.value))}
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
              <FormField label="Year" required>
                <input
                  type="number"
                  value={importYear}
                  onChange={(e) => setImportYear(Number(e.target.value))}
                  className={inp}
                  min="2020"
                  max="2030"
                />
              </FormField>
            </div>

            <FormField label="File (PDF report or Excel/CSV)" required>
              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.csv"
                onChange={(e) => {
                  setImportFile(e.target.files?.[0] || null);
                  setImportResult(null);
                }}
                className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              {importFile && (
                <p className="mt-1 text-xs text-gray-500">
                  Selected: {importFile.name}
                </p>
              )}
            </FormField>

            <div className="rounded-xl bg-teal-50 border border-teal-100 p-3 text-xs text-teal-800">
              Click <b>Preview</b> to see every day of the month, then choose
              which days to skip (e.g. days the employee already recorded)
              before anything is saved.
              <button
                onClick={downloadImportTemplate}
                className="ml-1 inline-flex items-center gap-1 text-teal-700 font-semibold hover:underline"
              >
                <Download size={12} /> Excel template
              </button>
            </div>

            {importResult && (
              <div className="rounded-xl border border-gray-200 p-3 text-xs grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-emerald-600">
                    {importResult.created || 0}
                  </div>
                  <div className="text-gray-500">Created</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {importResult.updated || 0}
                  </div>
                  <div className="text-gray-500">Updated</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-500">
                    {importResult.skipped || 0}
                  </div>
                  <div className="text-gray-500">Skipped</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {importResult.failed || 0}
                  </div>
                  <div className="text-gray-500">Failed</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Summary bar — one clear line */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-teal-50 border border-teal-100 px-4 py-3">
              <div className="text-sm text-teal-900">
                <span className="text-xl font-bold text-teal-700">
                  {importSelectedCount}
                </span>{" "}
                of <b>{importFileDayCount}</b> day(s) will be saved
                <span className="ml-2 text-xs text-teal-700">
                  ({importNewCount} new, {importOverwriteCount} overwrite)
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setImportSkip(new Set())}
                  className="px-3 py-1.5 rounded-lg bg-white border border-teal-200 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                >
                  Select all
                </button>
                <button
                  onClick={() =>
                    setImportSkip(new Set(importDays.map((d) => d.date)))
                  }
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Clear all
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {/* Column headers */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                <span className="w-4 shrink-0" />
                <span className="w-28 shrink-0">Date</span>
                <span className="flex-1 min-w-0">Clock in → out</span>
                <span className="w-24 shrink-0 text-right">Action</span>
              </div>
              <div className="max-h-96 overflow-auto divide-y divide-gray-100">
                {importDays.map((day) => {
                  const outcome = importRowOutcome(day);
                  const noData = outcome === "nodata";
                  const willImport =
                    outcome === "new" || outcome === "overwrite";
                  const badge =
                    outcome === "new"
                      ? { text: "New", cls: "bg-emerald-100 text-emerald-700" }
                      : outcome === "overwrite"
                        ? { text: "Overwrite", cls: "bg-amber-100 text-amber-700" }
                        : outcome === "skip"
                          ? { text: "Kept", cls: "bg-gray-100 text-gray-500" }
                          : { text: "No data", cls: "bg-gray-50 text-gray-400" };
                  return (
                    <label
                      key={day.date}
                      className={`flex items-center gap-3 px-4 py-3 text-sm ${
                        noData
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={noData}
                        checked={willImport}
                        onChange={() => toggleImportSkip(day.date)}
                        className="w-4 h-4 accent-teal-600 shrink-0"
                      />
                      <span className="w-28 shrink-0">
                        <span className="font-mono font-semibold text-gray-700">
                          {day.date.slice(5)}
                        </span>{" "}
                        <span className="text-gray-400">
                          {day.dayName?.slice(0, 3)}
                        </span>
                      </span>
                      <span className="flex-1 min-w-0 truncate text-gray-600">
                        {day.file
                          ? `${day.file.inStr || "--"} → ${day.file.outStr || "--"}`
                          : "—"}
                      </span>
                      <span className="w-24 shrink-0 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge.cls}`}
                        >
                          {badge.text}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-xs text-gray-600 space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 shrink-0">
                  New
                </span>
                <span>
                  This day has no record yet — ticking it{" "}
                  <b className="text-gray-700">adds a new one</b>.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 shrink-0">
                  Overwrite
                </span>
                <span>
                  A record already exists — ticking it{" "}
                  <b className="text-gray-700">replaces the saved one</b>. Untick
                  to keep what you already have.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 shrink-0">
                  Kept / No data
                </span>
                <span>
                  Nothing changes — the day is either unticked or has no data in
                  the file.
                </span>
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal
        show={showEdit}
        onClose={() => {
          setShowEdit(false);
          setSelRec(null);
        }}
        title="Edit and Correct Attendance"
        subtitle={
          selRec
            ? (selRec.employee?.firstName || "") +
              " " +
              (selRec.employee?.lastName || "") +
              " - " +
              fmtDate(selRec?.date)
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
              Save
            </button>
          </div>
        }
      >
        {/* Clock In / Clock Out */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Clock In">
            <input
              type="time"
              value={eForm.clockIn || ""}
              onChange={(e) => {
                const ci = e.target.value;
                setEForm((p) => {
                  const co = p.clockOut;
                  let hrs = p.totalHours;
                  if (ci && co) {
                    const [ch, cm] = ci.split(":").map(Number);
                    const [oh, om] = co.split(":").map(Number);
                    let diff = oh * 60 + om - (ch * 60 + cm);
                    if (diff < 0) diff += 24 * 60;
                    hrs = (diff / 60).toFixed(2);
                  }
                  return { ...p, clockIn: ci, totalHours: hrs };
                });
              }}
              className={inp}
            />
          </FormField>
          <FormField label="Clock Out">
            <input
              type="time"
              value={eForm.clockOut || ""}
              onChange={(e) => {
                const co = e.target.value;
                setEForm((p) => {
                  const ci = p.clockIn;
                  let hrs = p.totalHours;
                  if (ci && co) {
                    const [ch, cm] = ci.split(":").map(Number);
                    const [oh, om] = co.split(":").map(Number);
                    let diff = oh * 60 + om - (ch * 60 + cm);
                    if (diff < 0) diff += 24 * 60;
                    hrs = (diff / 60).toFixed(2);
                  }
                  return { ...p, clockOut: co, totalHours: hrs };
                });
              }}
              className={inp}
            />
          </FormField>
        </div>

        {/* Status + Worked Hours */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Status">
            <select
              value={eForm.status || ""}
              onChange={(e) =>
                setEForm((p) => ({ ...p, status: e.target.value }))
              }
              className={sel}
            >
              {eForm.status && !EDIT_STATUS_OPTIONS.includes(eForm.status) && (
                <option value={eForm.status}>{eForm.status}</option>
              )}
              {EDIT_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Worked Hours">
            <input
              type="number"
              min="0"
              max="24"
              step="0.25"
              value={eForm.totalHours || ""}
              onChange={(e) =>
                setEForm((p) => ({ ...p, totalHours: e.target.value }))
              }
              placeholder="e.g. 8.5"
              className={inp}
            />
          </FormField>
        </div>

        {/* Correction Reason */}
        <FormField label="Correction Reason" required>
          <textarea
            rows={2}
            value={eForm.correctionReason || ""}
            onChange={(e) =>
              setEForm((p) => ({ ...p, correctionReason: e.target.value }))
            }
            placeholder="Why is this being corrected?"
            className={inp + " resize-none"}
          />
        </FormField>

        {/* Remarks / Notes */}
        <FormField label="Notes / Remarks">
          <input
            value={eForm.remarks || ""}
            onChange={(e) =>
              setEForm((p) => ({ ...p, remarks: e.target.value }))
            }
            placeholder="Additional notes..."
            className={inp}
          />
        </FormField>

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          <Info size={13} className="shrink-0 mt-0.5" />
          <span>All corrections are logged in the audit trail.</span>
        </div>
      </Modal>

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
            {fmtDate(selRec?.date)} - {selRec?.status}
          </p>
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 text-left">
            <strong>Warning:</strong> This action cannot be undone.
          </div>
        </div>
      </Modal>
    </div>
  );
}
