"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Search,
  Trash2,
  RefreshCw,
  Check,
  X,
  Eye,
  Utensils,
  Package,
  Coffee,
  Pizza,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const BASE =
  process.env.NEXT_PUBLIC_HRM_API_URL || "http://localhost:5000/api/v1";

// ── field labels for profile notifications ─────────────────────────────────
const FIELD_LABELS = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  phone: "Phone",
  department: "Department",
  designation: "Designation",
  joiningDate: "Joining Date",
  salary: "Salary",
  basicSalary: "Basic Salary",
  rate: "Rate",
  salaryType: "Salary Type",
  workLocationType: "Work Location",
  workArrangement: "Work Arrangement",
  status: "Status",
  address: "Address",
  contractType: "Contract Type",
  shiftTiming: "Shift Timing",
  bankDetails: "Bank Details",
  gender: "Gender",
  bloodGroup: "Blood Group",
  maritalStatus: "Marital Status",
  nid: "NID",
};

const DISPLAY_FIELDS = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "department", label: "Department" },
  { key: "designation", label: "Designation" },
  { key: "workLocationType", label: "Work Location" },
  { key: "workArrangement", label: "Work Arrangement" },
  { key: "salary", label: "Salary" },
  { key: "salaryType", label: "Salary Type" },
  { key: "joiningDate", label: "Joining Date" },
  { key: "shiftTiming", label: "Shift Timing" },
  { key: "bankDetails", label: "Bank Details" },
  { key: "address", label: "Address" },
  { key: "gender", label: "Gender" },
  { key: "bloodGroup", label: "Blood Group" },
  { key: "maritalStatus", label: "Marital Status" },
  { key: "nid", label: "NID" },
];

function renderVal(field, val) {
  if (val === null || val === undefined || val === "")
    return <span className="opacity-40 text-sm">—</span>;
  if (field === "bankDetails" && typeof val === "object") {
    const rows = [
      { label: "Bank", value: val.bankName },
      { label: "Account No.", value: val.accountNumber },
      { label: "Holder", value: val.accountHolderName },
      { label: "Branch", value: val.branchName },
      { label: "Routing", value: val.routingNumber },
      { label: "Type", value: val.accountType },
    ].filter((r) => r.value);
    return (
      <div className="space-y-0.5">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2 text-xs">
            <span className="opacity-60 w-20 shrink-0">{r.label}:</span>
            <span className="font-medium">{r.value}</span>
          </div>
        ))}
      </div>
    );
  }
  if (field === "shiftTiming" && typeof val === "object") {
    const shift = val.defaultShift || val.assignedShift || val;
    const start = shift.start || val.start,
      end = shift.end || val.end;
    if (start || end)
      return (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-mono bg-black/10 px-2 py-0.5 rounded">
            {start || "—"}
          </span>
          <span className="opacity-50">→</span>
          <span className="font-mono bg-black/10 px-2 py-0.5 rounded">
            {end || "—"}
          </span>
        </div>
      );
  }
  if (field === "address" && typeof val === "object") {
    return (
      <span className="text-sm">
        {[val.street, val.city, val.state, val.zip, val.country]
          .filter(Boolean)
          .join(", ") || "—"}
      </span>
    );
  }
  if (typeof val === "object" && !Array.isArray(val)) {
    const entries = Object.entries(val).filter(
      ([, v]) => v !== null && v !== undefined && v !== "",
    );
    if (!entries.length) return <span className="opacity-40 text-sm">—</span>;
    return (
      <div className="space-y-0.5">
        {entries.map(([k, v]) => (
          <div key={k} className="flex gap-2 text-xs">
            <span className="opacity-60 capitalize w-24 shrink-0">{k}:</span>
            <span>{String(v)}</span>
          </div>
        ))}
      </div>
    );
  }
  if (Array.isArray(val))
    return <span className="text-sm">{val.join(", ") || "—"}</span>;
  const dateFields = ["joiningDate", "dateOfBirth", "createdAt", "updatedAt"];
  if (dateFields.includes(field) && val) {
    const d = new Date(val);
    if (!isNaN(d))
      return (
        <span className="text-sm">
          {d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
        </span>
      );
  }
  return <span className="text-sm">{String(val)}</span>;
}

// ── Profile detail modal ───────────────────────────────────────────────────
function DetailModal({ notif, userProfile, onClose }) {
  if (!notif) return null;
  const updatedSet = new Set(notif.updatedFields || []);
  const updatedData = notif.updatedData || {};
  const extraFields = (notif.updatedFields || [])
    .filter((f) => !DISPLAY_FIELDS.find((d) => d.key === f))
    .map((f) => ({ key: f, label: FIELD_LABELS[f] || f }));
  const allFields = [...DISPLAY_FIELDS, ...extraFields];
  const getProfileVal = (key) => userProfile?.[key];
  const hasValue = (key) => {
    const v = getProfileVal(key);
    if (v === null || v === undefined || v === "") return false;
    if (typeof v === "object") return Object.keys(v).length > 0;
    return true;
  };
  const updatedCount = updatedSet.size;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
        <div className="px-5 py-4 bg-[#113F67] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-base">
                {notif.userName}
              </h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${notif.status === "pending" ? "bg-red-500" : notif.status === "approved" ? "bg-green-500" : "bg-gray-500"} text-white`}
              >
                {notif.status}
              </span>
            </div>
            <p className="text-white/60 text-xs mt-0.5">
              {notif.userEmail} &bull; {updatedCount} field
              {updatedCount !== 1 ? "s" : ""} updated
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-400 inline-block"></span>
            <span className="text-gray-600">Updated (pending)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-400 inline-block"></span>
            <span className="text-gray-600">Current (unchanged)</span>
          </span>
        </div>
        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(85vh - 150px)" }}
        >
          {updatedCount === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No field details recorded.
            </div>
          ) : (
            <table className="w-full min-w-[480px]">
              <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase w-36">
                    Field
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allFields.map(({ key, label }) => {
                  const isUpdated = updatedSet.has(key);
                  const val = isUpdated ? updatedData[key] : getProfileVal(key);
                  if (!isUpdated && !hasValue(key)) return null;
                  return (
                    <tr
                      key={key}
                      className={
                        isUpdated
                          ? "bg-red-50 border-l-4 border-l-red-400"
                          : "bg-green-50 border-l-4 border-l-green-400"
                      }
                    >
                      <td
                        className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap align-top ${isUpdated ? "text-red-700" : "text-green-700"}`}
                      >
                        {label}
                      </td>
                      <td className="px-4 py-2.5 align-top text-gray-900">
                        {renderVal(key, val)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#113F67] text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
};

const fmtDateTime = (ts) => {
  if (!ts) return "N/A";
  return new Date(ts).toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const nowMonth = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
};
const fmtMonth = (s) => {
  if (!s) return "";
  const [y, m] = s.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const StatusChip = ({ status }) => {
  const cfg = {
    pending: {
      cls: "bg-amber-100 text-amber-700",
      Icon: Clock,
      label: "Pending",
    },
    approved: {
      cls: "bg-emerald-100 text-emerald-700",
      Icon: CheckCircle,
      label: "Approved",
    },
    rejected: {
      cls: "bg-red-100 text-red-600",
      Icon: XCircle,
      label: "Rejected",
    },
    cancelled: {
      cls: "bg-gray-100 text-gray-500",
      Icon: XCircle,
      label: "Cancelled",
    },
  }[status] || {
    cls: "bg-gray-100 text-gray-500",
    Icon: AlertCircle,
    label: status,
  };
  const { cls, Icon, label } = cfg;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}
    >
      <Icon size={10} />
      {label}
    </span>
  );
};

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [activeSection, setActiveSection] = useState("profile"); // "profile" | "leave" | "meal"

  // profile notifications
  const [notifications, setNotifications] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileTab, setProfileTab] = useState("all");
  const [profileSearch, setProfileSearch] = useState("");
  const [detailNotif, setDetailNotif] = useState(null);
  const [detailUserProfile, setDetailUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // meal notifications
  const [allMeals, setAllMeals] = useState([]);
  const [allSubs, setAllSubs] = useState([]);
  const [loadingMeal, setLoadingMeal] = useState(false);
  const [mealMonth, setMealMonth] = useState(nowMonth);
  const [mealTab, setMealTab] = useState("all"); // "all" | "pending" | "approved" | "rejected"
  const [mealSearch, setMealSearch] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [acting, setActing] = useState(false);

  const getToken = useCallback(
    () =>
      localStorage.getItem("adminToken") ||
      localStorage.getItem("moderatorToken"),
    [],
  );

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem("adminToken"));
  }, []);
  useEffect(() => {
    loadProfileNotifs();
    // Mark all as seen when this page is opened — clears the bell badge.
    // We store the *current* total (not a fixed sentinel) so the badge
    // reappears once a new notification pushes the total higher.
    markAllSeen();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const markAllSeen = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const hdr = { Authorization: `Bearer ${token}` };
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const [y, m] = month.split("-");
      const start = new Date(Number(y), Number(m) - 1, 1).toISOString();
      const end = new Date(Number(y), Number(m), 0, 23, 59, 59).toISOString();

      const [mealsRes, subsRes] = await Promise.all([
        fetch(`${BASE}/admin/meals/all?startDate=${start}&endDate=${end}`, {
          headers: hdr,
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch(`${BASE}/admin/subscriptions/all?limit=200&month=${month}`, {
          headers: hdr,
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);

      const pendingMeals = (mealsRes?.meals || mealsRes?.data || []).filter(
        (m) => m.status === "pending",
      ).length;
      const pendingSubs = (subsRes?.subscriptions || []).filter(
        (s) => s.currentMonthStatus === "pending",
      ).length;

      let profilePending = 0;
      if (localStorage.getItem("adminToken")) {
        const countRes = await fetch(`${BASE}/notifications/count`, {
          headers: hdr,
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
        profilePending = countRes?.count || 0;
      }

      localStorage.setItem(
        "notifSeenCount",
        String(pendingMeals + pendingSubs + profilePending),
      );
    } catch {
      localStorage.setItem("notifSeenCount", "0");
    } finally {
      window.dispatchEvent(new Event("notifSeen"));
    }
  };
  useEffect(() => {
    if (activeSection === "meal") loadMealData();
  }, [activeSection, mealMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── profile notifications ───────────────────────────────────────────────
  const loadProfileNotifs = async () => {
    try {
      setLoadingProfile(true);
      const token = getToken();
      if (!token) {
        setLoadingProfile(false);
        return;
      }
      const res = await fetch(`${BASE}/notifications?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
      toast.error("Failed to load profile notifications");
    } finally {
      setLoadingProfile(false);
    }
  };

  const openDetail = async (n) => {
    setDetailNotif(n);
    setDetailUserProfile(null);
    if (!n.userId) return;
    try {
      setProfileLoading(true);
      const token = getToken();
      const res = await fetch(`${BASE}/profile/${n.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setDetailUserProfile(data.user || data);
    } catch {
    } finally {
      setProfileLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = getToken();
      await fetch(`${BASE}/notifications/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile update approved!");
      loadProfileNotifs();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = getToken();
      await fetch(`${BASE}/notifications/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.error("Profile update rejected.");
      loadProfileNotifs();
    } catch {
      toast.error("Failed to reject");
    }
  };

  const handleDeleteNotif = async (id) => {
    try {
      const token = getToken();
      await fetch(`${BASE}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Notification removed.");
      loadProfileNotifs();
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleApproveAll = async () => {
    const pending = notifications.filter((n) => n.status === "pending");
    if (!pending.length) return;
    try {
      const token = getToken();
      await Promise.all(
        pending.map((n) =>
          fetch(`${BASE}/notifications/${n._id}/approve`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );
      toast.success("All pending notifications approved!");
      loadProfileNotifs();
    } catch {
      toast.error("Failed to approve all");
    }
  };

  // ── meal notifications ──────────────────────────────────────────────────
  const loadMealData = async () => {
    const token = getToken();
    if (!token) return;
    setLoadingMeal(true);
    try {
      const [y, m] = mealMonth.split("-");
      const start = new Date(Number(y), Number(m) - 1, 1).toISOString();
      const end = new Date(Number(y), Number(m), 0, 23, 59, 59).toISOString();
      const [mealsRes, subsRes] = await Promise.all([
        fetch(`${BASE}/admin/meals/all?startDate=${start}&endDate=${end}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE}/admin/subscriptions/all?limit=200&month=${mealMonth}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const mealsData = await mealsRes.json();
      const subsData = await subsRes.json();
      setAllMeals(mealsData?.meals || mealsData?.data || []);
      setAllSubs(subsData?.subscriptions || []);
    } catch {
      toast.error("Failed to load meal notifications");
    } finally {
      setLoadingMeal(false);
    }
  };

  const deleteMeal = async (meal) => {
    setActing(true);
    try {
      const token = getToken();
      await fetch(`${BASE}/admin/meal/${meal._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Meal request deleted");
      loadMealData();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setActing(false);
    }
  };

  const deleteSub = async (sub) => {
    setActing(true);
    try {
      const token = getToken();
      await fetch(`${BASE}/admin/subscription/${sub._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Subscription deleted");
      loadMealData();
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setActing(false);
    }
  };

  const approveMeal = async (meal) => {
    setActing(true);
    try {
      const token = getToken();
      await fetch(`${BASE}/admin/meal/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealId: meal._id,
          note: "Approved from notifications",
        }),
      });
      toast.success("Meal approved");
      loadMealData();
    } catch {
      toast.error("Failed to approve");
    } finally {
      setActing(false);
    }
  };

  const rejectMeal = async (meal) => {
    setActing(true);
    try {
      const token = getToken();
      await fetch(`${BASE}/admin/meal/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealId: meal._id,
          note: "Rejected from notifications",
        }),
      });
      toast.success("Meal rejected");
      loadMealData();
    } catch {
      toast.error("Failed to reject");
    } finally {
      setActing(false);
    }
  };

  // ── derived ────────────────────────────────────────────────────────────
  const profileNotifs = notifications.filter((n) => n.type !== "leave_request");
  const leaveNotifs = notifications.filter((n) => n.type === "leave_request");

  const profileStats = {
    total: profileNotifs.length,
    pending: profileNotifs.filter((n) => n.status === "pending").length,
    approved: profileNotifs.filter((n) => n.status === "approved").length,
    rejected: profileNotifs.filter((n) => n.status === "rejected").length,
  };

  const leaveStats = {
    total: leaveNotifs.length,
    pending: leaveNotifs.filter((n) => n.status === "pending").length,
    approved: leaveNotifs.filter((n) => n.status === "approved").length,
    rejected: leaveNotifs.filter((n) => n.status === "rejected").length,
  };

  const filteredNotifs = profileNotifs.filter((n) => {
    const matchTab = profileTab === "all" || n.status === profileTab;
    const matchSearch =
      !profileSearch ||
      n.userName?.toLowerCase().includes(profileSearch.toLowerCase()) ||
      n.userEmail?.toLowerCase().includes(profileSearch.toLowerCase()) ||
      n.message?.toLowerCase().includes(profileSearch.toLowerCase());
    return matchTab && matchSearch;
  });

  const mealsSorted = [...allMeals].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const filteredMeals = mealsSorted.filter((m) => {
    const matchTab = mealTab === "all" || m.status === mealTab;
    const src =
      m.userInfo || (typeof m.user === "object" ? m.user : null) || {};
    const name = `${src.firstName || ""} ${src.lastName || ""}`.trim();
    const matchSearch =
      !mealSearch ||
      name.toLowerCase().includes(mealSearch.toLowerCase()) ||
      (src.employeeId || "").toLowerCase().includes(mealSearch.toLowerCase());
    return matchTab && matchSearch;
  });

  const subsWithMonth = allSubs.filter(
    (s) => s.currentMonthStatus && s.currentMonthStatus !== "none",
  );
  const filteredSubs = subsWithMonth.filter((s) => {
    const matchTab = mealTab === "all" || s.currentMonthStatus === mealTab;
    const name =
      `${s.userInfo?.firstName || ""} ${s.userInfo?.lastName || ""}`.trim();
    const matchSearch =
      !mealSearch ||
      name.toLowerCase().includes(mealSearch.toLowerCase()) ||
      (s.userInfo?.employeeId || "")
        .toLowerCase()
        .includes(mealSearch.toLowerCase());
    return matchTab && matchSearch;
  });

  const pendingMealCount = allMeals.filter(
    (m) => m.status === "pending",
  ).length;
  const pendingSubCount = subsWithMonth.filter(
    (s) => s.currentMonthStatus === "pending",
  ).length;
  const totalMealPending = pendingMealCount + pendingSubCount;

  // ── render ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile detail modal */}
      {detailNotif &&
        (profileLoading ? (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#113F67]" />
              <span className="text-sm text-gray-500">Loading profile...</span>
            </div>
          </div>
        ) : (
          <DetailModal
            notif={detailNotif}
            userProfile={detailUserProfile}
            onClose={() => {
              setDetailNotif(null);
              setDetailUserProfile(null);
            }}
          />
        ))}

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="text-[#113F67]" size={24} />
          Notifications
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Profile update requests & meal notifications
        </p>
      </div>

      {/* Section switcher */}
      <div className="flex gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <button
          onClick={() => setActiveSection("profile")}
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${activeSection === "profile" ? "bg-[#113F67] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <User size={15} /> Profile Updates
          {profileStats.pending > 0 && (
            <span
              className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] font-bold ${activeSection === "profile" ? "bg-amber-400 text-gray-900" : "bg-red-500 text-white"}`}
            >
              {profileStats.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSection("leave")}
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${activeSection === "leave" ? "bg-[#113F67] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <CalendarDays size={15} /> Leave Requests
          {leaveStats.pending > 0 && (
            <span
              className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] font-bold ${activeSection === "leave" ? "bg-amber-400 text-gray-900" : "bg-red-500 text-white"}`}
            >
              {leaveStats.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSection("meal")}
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${activeSection === "meal" ? "bg-[#113F67] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <Utensils size={15} /> Meal Requests
          {totalMealPending > 0 && (
            <span
              className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] font-bold ${activeSection === "meal" ? "bg-amber-400 text-gray-900" : "bg-red-500 text-white"}`}
            >
              {totalMealPending}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PROFILE UPDATES SECTION
      ══════════════════════════════════════════════════════════ */}
      {activeSection === "profile" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: profileStats.total,
                color: "bg-gray-50 border-gray-200",
                textColor: "text-gray-700",
                onClick: () => setProfileTab("all"),
              },
              {
                label: "Pending",
                value: profileStats.pending,
                color: "bg-amber-50 border-amber-200",
                textColor: "text-amber-700",
                onClick: () => setProfileTab("pending"),
              },
              {
                label: "Approved",
                value: profileStats.approved,
                color: "bg-emerald-50 border-emerald-200",
                textColor: "text-emerald-700",
                onClick: () => setProfileTab("approved"),
              },
              {
                label: "Rejected",
                value: profileStats.rejected,
                color: "bg-gray-50 border-gray-200",
                textColor: "text-gray-600",
                onClick: () => setProfileTab("rejected"),
              },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={s.onClick}
                className={`${s.color} border rounded-xl p-4 text-left transition-all hover:shadow-sm ${profileTab === s.label.toLowerCase() || (s.label === "Total" && profileTab === "all") ? "ring-2 ring-[#113F67]/15 border-[#113F67]" : ""}`}
              >
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
            <div className="flex border-b border-gray-200">
              {["all", "pending", "approved", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${profileTab === tab ? "text-[#113F67] border-b-2 border-[#113F67] bg-blue-50/50" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab}
                  {tab === "pending" && profileStats.pending > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {profileStats.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-40">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
                />
              </div>
              <button
                onClick={loadProfileNotifs}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} className="text-gray-500" />
              </button>
              {isAdmin && profileStats.pending > 0 && (
                <button
                  onClick={handleApproveAll}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Check size={14} /> Approve All
                </button>
              )}
            </div>
          </div>

          {loadingProfile ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#113F67]" />
            </div>
          ) : filteredNotifs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Bell size={40} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-500 font-medium">No notifications</h3>
              <p className="text-gray-400 text-sm mt-1">
                {profileTab === "pending"
                  ? "No pending approvals"
                  : "No notifications found"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifs.map((n) => (
                <div
                  key={n._id}
                  className={`bg-white rounded-xl border shadow-sm p-4 transition-all ${n.status === "pending" ? "border-red-300 border-l-4 border-l-red-500" : n.status === "approved" ? "border-green-200 border-l-4 border-l-green-500" : "border-gray-200"}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.status === "pending" ? "bg-red-100" : n.status === "approved" ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      <User
                        size={18}
                        className={
                          n.status === "pending"
                            ? "text-red-600"
                            : n.status === "approved"
                              ? "text-green-600"
                              : "text-gray-500"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {n.userName}
                          </p>
                          {n.userEmail && (
                            <p className="text-xs text-gray-400">
                              {n.userEmail}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.userRole === "moderator" ? "bg-orange-100 text-orange-700" : n.userRole === "employee" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                          >
                            {n.userRole}
                          </span>
                          <StatusChip status={n.status} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      {n.updatedFields?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {n.updatedFields.map((f) => (
                            <span
                              key={f}
                              className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700"
                            >
                              {FIELD_LABELS[f] || f}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} />
                          {fmtDateTime(n.createdAt)}
                        </span>
                        {n.approvedAt && (
                          <span className="text-xs text-green-600">
                            Approved: {fmtDateTime(n.approvedAt)}
                          </span>
                        )}
                      </div>
                      {isAdmin && n.status === "pending" && (
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleApprove(n._id)}
                            className="flex items-center gap-1.5 text-sm bg-emerald-500 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
                          >
                            <Check size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(n._id)}
                            className="flex items-center gap-1.5 text-sm bg-red-50 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      {n.updatedFields?.length > 0 && (
                        <button
                          onClick={() => openDetail(n)}
                          className={`p-1.5 rounded-lg transition-colors ${n.status === "pending" ? "text-red-500 hover:bg-red-50" : n.status === "approved" ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotif(n._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          LEAVE REQUESTS SECTION
      ══════════════════════════════════════════════════════════ */}
      {activeSection === "leave" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: leaveStats.total,
                color: "bg-gray-50 border-gray-200",
                textColor: "text-gray-700",
                onClick: () => setProfileTab("all"),
              },
              {
                label: "Pending",
                value: leaveStats.pending,
                color: "bg-amber-50 border-amber-200",
                textColor: "text-amber-700",
                onClick: () => setProfileTab("pending"),
              },
              {
                label: "Approved",
                value: leaveStats.approved,
                color: "bg-emerald-50 border-emerald-200",
                textColor: "text-emerald-700",
                onClick: () => setProfileTab("approved"),
              },
              {
                label: "Rejected",
                value: leaveStats.rejected,
                color: "bg-red-50 border-red-200",
                textColor: "text-red-700",
                onClick: () => setProfileTab("rejected"),
              },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={s.onClick}
                className={`${s.color} border rounded-xl p-4 text-left transition-all hover:shadow-sm ${profileTab === s.label.toLowerCase() || (s.label === "Total" && profileTab === "all") ? "ring-2 ring-[#113F67]/15 border-[#113F67]" : ""}`}
              >
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
            <div className="flex border-b border-gray-200">
              {["all", "pending", "approved", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${profileTab === tab ? "text-[#113F67] border-b-2 border-[#113F67] bg-blue-50/50" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab}
                  {tab === "pending" && leaveStats.pending > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {leaveStats.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name…"
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
                />
              </div>
              <button
                onClick={loadProfileNotifs}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {loadingProfile ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#113F67]" />
            </div>
          ) : leaveNotifs.filter((n) => {
              const matchTab = profileTab === "all" || n.status === profileTab;
              const matchSearch =
                !profileSearch ||
                n.userName
                  ?.toLowerCase()
                  .includes(profileSearch.toLowerCase()) ||
                n.message?.toLowerCase().includes(profileSearch.toLowerCase());
              return matchTab && matchSearch;
            }).length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <CalendarDays size={40} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-500 font-medium">No leave requests</h3>
              <p className="text-gray-400 text-sm mt-1">
                {profileTab === "pending"
                  ? "No pending leave requests"
                  : "No leave requests found"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaveNotifs
                .filter((n) => {
                  const matchTab =
                    profileTab === "all" || n.status === profileTab;
                  const matchSearch =
                    !profileSearch ||
                    n.userName
                      ?.toLowerCase()
                      .includes(profileSearch.toLowerCase()) ||
                    n.message
                      ?.toLowerCase()
                      .includes(profileSearch.toLowerCase());
                  return matchTab && matchSearch;
                })
                .map((n) => {
                  const d = n.updatedData || {};
                  const leaveTypeColors = {
                    Emergency: "bg-red-100 text-red-700",
                    Sick: "bg-orange-100 text-orange-700",
                    Annual: "bg-yellow-100 text-yellow-700",
                    Casual: "bg-blue-100 text-blue-700",
                    Maternity: "bg-pink-100 text-pink-700",
                    Paternity: "bg-indigo-100 text-indigo-700",
                    Other: "bg-gray-100 text-gray-700",
                  };
                  const typeColor =
                    leaveTypeColors[d.leaveType] || "bg-gray-100 text-gray-700";
                  return (
                    <div
                      key={n._id}
                      className={`bg-white rounded-xl border shadow-sm p-4 transition-all ${n.status === "pending" ? "border-amber-300 border-l-4 border-l-amber-500" : n.status === "approved" ? "border-green-200 border-l-4 border-l-green-500" : "border-red-200 border-l-4 border-l-red-400"}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.status === "pending" ? "bg-amber-100" : n.status === "approved" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          <CalendarDays
                            size={18}
                            className={
                              n.status === "pending"
                                ? "text-amber-600"
                                : n.status === "approved"
                                  ? "text-green-600"
                                  : "text-red-500"
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {n.userName}
                              </p>
                              {n.userEmail && (
                                <p className="text-xs text-gray-400">
                                  {n.userEmail}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {d.leaveType && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColor}`}
                                >
                                  {d.leaveType}
                                </span>
                              )}
                              {d.payStatus && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.payStatus === "Paid" ? "bg-green-100 text-green-700" : d.payStatus === "Unpaid" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                                >
                                  {d.payStatus}
                                </span>
                              )}
                              <StatusChip status={n.status} />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {n.message}
                          </p>
                          {d.reason && (
                            <p className="text-xs text-gray-400 mt-1 italic">
                              Reason: "{d.reason}"
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={10} />
                              {fmtDateTime(n.createdAt)}
                            </span>
                            {d.totalDays && (
                              <span className="text-xs text-blue-600 font-medium">
                                {d.totalDays} day{d.totalDays > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                          {n.status === "pending" && (
                            <div className="mt-3">
                              <a
                                href="/hrm/leave"
                                className="inline-flex items-center gap-1.5 text-sm bg-[#113F67] text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                              >
                                <Eye size={14} /> Review in Leave Page
                              </a>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteNotif(n._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors shrink-0"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          MEAL REQUESTS SECTION
      ══════════════════════════════════════════════════════════ */}
      {activeSection === "meal" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Meals",
                value: allMeals.length,
                color: "bg-gray-50 border-gray-200",
                textColor: "text-gray-700",
                onClick: () => setMealTab("all"),
              },
              {
                label: "Pending",
                value: pendingMealCount + pendingSubCount,
                color: "bg-amber-50 border-amber-200",
                textColor: "text-amber-700",
                onClick: () => setMealTab("pending"),
              },
              {
                label: "Subscriptions",
                value: subsWithMonth.length,
                color: "bg-blue-50 border-blue-200",
                textColor: "text-blue-700",
                onClick: () => setMealTab("all"),
              },
              {
                label: "Approved",
                value: allMeals.filter((m) => m.status === "approved").length,
                color: "bg-emerald-50 border-emerald-200",
                textColor: "text-emerald-700",
                onClick: () => setMealTab("approved"),
              },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={s.onClick}
                className={`${s.color} border rounded-xl p-4 text-left transition-all hover:shadow-sm ${mealTab === s.label.toLowerCase() || (s.label === "Total Meals" && mealTab === "all") ? "ring-2 ring-[#113F67]/15 border-[#113F67]" : ""}`}
              >
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5">
            <div className="flex border-b border-gray-200">
              {["all", "pending", "approved", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMealTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${mealTab === tab ? "text-[#113F67] border-b-2 border-[#113F67] bg-blue-50/50" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab}
                  {tab === "pending" && totalMealPending > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {totalMealPending}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="px-4 py-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-40">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, employee ID…"
                  value={mealSearch}
                  onChange={(e) => setMealSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
                />
              </div>
              <select
                value={mealMonth}
                onChange={(e) => setMealMonth(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#113F67]/30"
              >
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date();
                  d.setMonth(d.getMonth() - 3 + i);
                  const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                  return (
                    <option key={k} value={k}>
                      {fmtMonth(k)}
                    </option>
                  );
                })}
              </select>
              <button
                onClick={loadMealData}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {loadingMeal ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#113F67]" />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Daily Meal Requests */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Utensils size={16} className="text-[#113F67]" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Daily Meal Requests
                      </p>
                      <p className="text-xs text-gray-400">
                        {filteredMeals.length} records · {fmtMonth(mealMonth)}
                      </p>
                    </div>
                  </div>
                  {pendingMealCount > 0 && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                      {pendingMealCount} pending
                    </span>
                  )}
                </div>

                {filteredMeals.length === 0 ? (
                  <div className="py-10 text-center">
                    <Utensils
                      size={32}
                      className="text-gray-200 mx-auto mb-2"
                    />
                    <p className="text-gray-400 text-sm">
                      No meal requests found
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {filteredMeals.map((m, i) => {
                      const src =
                        m.userInfo ||
                        (typeof m.user === "object" ? m.user : null) ||
                        {};
                      const name = src.firstName
                        ? `${src.firstName} ${src.lastName || ""}`.trim()
                        : "Employee";
                      const isPending = m.status === "pending";
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${isPending ? "border-l-4 border-l-amber-400" : m.status === "approved" ? "border-l-4 border-l-emerald-400" : "border-l-4 border-l-red-300"}`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPending ? "bg-amber-100" : m.status === "approved" ? "bg-emerald-100" : "bg-red-100"}`}
                          >
                            {isPending ? (
                              <Clock className="text-amber-600" size={15} />
                            ) : m.status === "approved" ? (
                              <CheckCircle
                                className="text-emerald-600"
                                size={15}
                              />
                            ) : (
                              <XCircle className="text-red-500" size={15} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900">
                                {name}
                              </p>
                              <StatusChip status={m.status} />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-gray-500">
                              <span>{src.employeeId || "—"}</span>
                              {src.department && (
                                <span>· {src.department}</span>
                              )}
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
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => approveMeal(m)}
                                  disabled={acting}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectMeal(m)}
                                  disabled={acting}
                                  className="px-2.5 py-1 border border-red-300 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Delete ${name}'s meal request for ${fmtDate(m.date)}?`,
                                  )
                                )
                                  deleteMeal(m);
                              }}
                              disabled={acting}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
              </div>

              {/* Subscription Requests */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Package size={16} className="text-[#113F67]" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Subscription Requests
                      </p>
                      <p className="text-xs text-gray-400">
                        {filteredSubs.length} records · {fmtMonth(mealMonth)}
                      </p>
                    </div>
                  </div>
                  {pendingSubCount > 0 && (
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {pendingSubCount} pending
                    </span>
                  )}
                </div>

                {filteredSubs.length === 0 ? (
                  <div className="py-10 text-center">
                    <Package size={32} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      No subscription records found
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {filteredSubs.map((s, i) => {
                      const name =
                        `${s.userInfo?.firstName || ""} ${s.userInfo?.lastName || ""}`.trim() ||
                        "Employee";
                      const pref = s.currentMonthPreference || s.preference;
                      const status = s.currentMonthStatus;
                      const isPending = status === "pending";
                      const approval = s.monthlyApprovals?.find(
                        (a) => a.month === mealMonth,
                      );
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors ${isPending ? "border-l-4 border-l-blue-400" : status === "approved" ? "border-l-4 border-l-emerald-400" : "border-l-4 border-l-red-300"}`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isPending ? "bg-blue-100" : status === "approved" ? "bg-emerald-100" : "bg-red-100"}`}
                          >
                            {isPending ? (
                              <Clock className="text-blue-600" size={15} />
                            ) : status === "approved" ? (
                              <CheckCircle
                                className="text-emerald-600"
                                size={15}
                              />
                            ) : (
                              <XCircle className="text-red-500" size={15} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900">
                                {name}
                              </p>
                              <StatusChip status={status} />
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
                                {s.autoRenew
                                  ? "Auto-renew ON"
                                  : "Auto-renew OFF"}
                              </span>
                            </div>
                            {approval?.note && !isPending && (
                              <p className="text-xs text-blue-500 mt-0.5">
                                Note: "{approval.note}"
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isPending && (
                              <a
                                href="/hrm/meal"
                                className="px-2.5 py-1 bg-[#113F67] hover:bg-[#0d3050] text-white rounded-lg text-xs font-semibold transition-colors"
                              >
                                Review
                              </a>
                            )}
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Delete ${name}'s subscription?`,
                                  )
                                )
                                  deleteSub(s);
                              }}
                              disabled={acting}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
