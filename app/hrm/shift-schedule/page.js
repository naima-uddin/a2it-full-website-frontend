"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Clock,
  Users,
  Search,
  X,
  Loader2,
  RefreshCw,
  Edit2,
  User,
  Building,
  CheckCircle,
  Shield,
  Home,
  Moon,
  Sun,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_HRM_API_URL;

const SHIFT_STORAGE_KEY = "hrm_shift_presets";

const DEFAULT_PRESETS = {
  office: {
    name: "Office",
    start: "09:00",
    end: "18:00",
    lateThreshold: 10,
    autoClockOutDelay: 60,
    isNightShift: false,
  },
  homeOffice: {
    name: "Home Office",
    start: "09:00",
    end: "00:00",
    lateThreshold: 10,
    autoClockOutDelay: 60,
    isNightShift: true,
  },
};

function loadPresets() {
  if (typeof window === "undefined") return DEFAULT_PRESETS;
  try {
    const raw = localStorage.getItem(SHIFT_STORAGE_KEY);
    if (raw) return { ...DEFAULT_PRESETS, ...JSON.parse(raw) };
  } catch (_) {}
  return DEFAULT_PRESETS;
}

function savePresets(presets) {
  try {
    localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(presets));
  } catch (_) {}
}

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

function formatTime(t) {
  if (!t) return "--";
  const [h, m] = t.split(":").map(Number);
  if (isNaN(h)) return t;
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

function getUserShiftKey(user) {
  const assigned = user.shiftTiming?.assignedShift;
  if (!assigned || typeof assigned === "string") return "office";
  const name = (assigned.name || "").toLowerCase();
  if (name === "home office") return "homeOffice";
  return "office";
}

function getInitials(u) {
  return (
    ((u.firstName?.[0] || "") + (u.lastName?.[0] || "")).toUpperCase() || "?"
  );
}

// ====================== EDIT SHIFT DEF MODAL ======================
function EditShiftDefModal({ open, onClose, shiftKey, preset, onSave }) {
  const [form, setForm] = useState({ ...preset });

  useEffect(() => {
    if (open) setForm({ ...preset });
  }, [open, preset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(shiftKey, form);
  };

  const label = shiftKey === "office" ? "Office Shift" : "Home Office Shift";

  return (
    <Modal open={open} onClose={onClose} title={`Edit ${label}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              className={INP}
              value={form.start}
              onChange={(e) =>
                setForm((f) => ({ ...f, start: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              className={INP}
              value={form.end}
              onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Late Grace Period (minutes)
          </label>
          <input
            type="number"
            min="0"
            max="120"
            className={INP}
            value={form.lateThreshold}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                lateThreshold: parseInt(e.target.value, 10) || 0,
              }))
            }
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#113F67] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0d3254] transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ====================== SHIFT CARD ======================
function ShiftCard({ shiftKey, preset, onEdit, isAdmin }) {
  const isOffice = shiftKey === "office";
  return (
    <div
      className={`bg-white rounded-xl border-2 p-5 shadow-sm flex-1 ${
        isOffice ? "border-[#113F67]" : "border-indigo-400"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isOffice ? "bg-[#113F67]" : "bg-indigo-500"
            }`}
          >
            {isOffice ? (
              <Building size={17} className="text-white" />
            ) : (
              <Home size={17} className="text-white" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {isOffice ? "Office Shift" : "Home Office Shift"}
            </p>
            {isOffice ? (
              <p className="text-xs text-gray-400">Default for all</p>
            ) : (
              <p className="text-xs text-indigo-400">
                Selected for specific users
              </p>
            )}
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => onEdit(shiftKey)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#113F67] transition-colors"
            title="Edit shift times"
          >
            <Edit2 size={15} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Sun size={11} className="text-amber-500" />
            <p className="text-xs text-gray-400">Start</p>
          </div>
          <p className="text-lg font-bold text-gray-800">
            {formatTime(preset.start)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            {isOffice ? (
              <Sun size={11} className="text-orange-400" />
            ) : (
              <Moon size={11} className="text-indigo-400" />
            )}
            <p className="text-xs text-gray-400">End</p>
          </div>
          <p className="text-lg font-bold text-gray-800">
            {isOffice ? formatTime(preset.end) : "12:00 AM"}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Late after {preset.lateThreshold} min of shift starting time
      </p>
    </div>
  );
}

// ====================== ADMIN VIEW ======================
function AdminView() {
  const [presets, setPresets] = useState(loadPresets);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [focusFilter, setFocusFilter] = useState("all");
  const [editingShiftKey, setEditingShiftKey] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/getAll-user`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      const all = Array.isArray(data?.users)
        ? data.users
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
      setUsers(
        all.filter((u) => u.role === "employee" || u.role === "moderator"),
      );
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let filteredUsers = users.filter(
      (u) =>
        (u.firstName + " " + u.lastName).toLowerCase().includes(q) ||
        u.department?.toLowerCase().includes(q) ||
        u.employeeId?.toLowerCase().includes(q),
    );
    if (focusFilter === "office") {
      filteredUsers = filteredUsers.filter(
        (u) => getUserShiftKey(u) !== "homeOffice",
      );
    }
    if (focusFilter === "homeOffice") {
      filteredUsers = filteredUsers.filter(
        (u) => getUserShiftKey(u) === "homeOffice",
      );
    }
    return filteredUsers;
  }, [users, search, focusFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const homeOfficeCount = users.filter(
      (u) => getUserShiftKey(u) === "homeOffice",
    ).length;
    return { total, homeOfficeCount, officeCount: total - homeOfficeCount };
  }, [users]);

  const handleSavePreset = (shiftKey, form) => {
    const updated = {
      ...presets,
      [shiftKey]: { ...presets[shiftKey], ...form },
    };
    setPresets(updated);
    savePresets(updated);
    setEditingShiftKey(null);
    toast.success("Shift updated");
  };

  const handleAssignShift = async (user, shiftKey) => {
    setActionLoading(true);
    const preset = presets[shiftKey];
    try {
      const res = await fetch(`${API}/admin/update-user/${user._id}`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          shiftTiming: {
            assignedShift:
              shiftKey === "office"
                ? null
                : {
                    name: preset.name,
                    start: preset.start,
                    end: preset.end,
                    lateThreshold: preset.lateThreshold,
                    autoClockOutDelay: preset.autoClockOutDelay,
                    isNightShift: preset.isNightShift,
                  },
          },
        }),
      });
      if (res.ok) {
        toast.success(
          `${user.firstName} assigned to ${
            shiftKey === "office" ? "Office" : "Home Office"
          } shift`,
        );
        fetchUsers();
      } else {
        const d = await res.json();
        toast.error(d?.message || "Failed to assign shift");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Shift definition cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        <ShiftCard
          shiftKey="office"
          preset={presets.office}
          onEdit={setEditingShiftKey}
          isAdmin
        />
        <ShiftCard
          shiftKey="homeOffice"
          preset={presets.homeOffice}
          onEdit={setEditingShiftKey}
          isAdmin
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "bg-[#113F67]",
            Icon: Users,
            active: focusFilter === "all",
            onClick: () => setFocusFilter("all"),
          },
          {
            label: "Office",
            value: stats.officeCount,
            color: "bg-emerald-500",
            Icon: Building,
            active: focusFilter === "office",
            onClick: () => setFocusFilter("office"),
          },
          {
            label: "Home Office",
            value: stats.homeOfficeCount,
            color: "bg-indigo-500",
            Icon: Home,
            active: focusFilter === "homeOffice",
            onClick: () => setFocusFilter("homeOffice"),
          },
        ].map(({ label, value, color, Icon, active, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className={`bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm text-left transition-all hover:shadow-md ${active ? "border-[#113F67] ring-2 ring-[#113F67]/15" : "border-gray-200"}`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
            >
              <Icon size={17} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Employee table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
              placeholder="Search by name, department, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 text-gray-600"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-400 text-sm">
              {search ? "No employees match your search" : "No employees found"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-medium">Employee</th>
                  <th className="px-5 py-3 text-left font-medium">
                    Department
                  </th>
                  <th className="px-5 py-3 text-left font-medium">
                    Current Shift
                  </th>
                  <th className="px-5 py-3 text-right font-medium">Assign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => {
                  const currentKey = getUserShiftKey(u);
                  const isHomeOffice = currentKey === "homeOffice";
                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#113F67] rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                            {getInitials(u)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {u.employeeId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {u.department || "--"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            isHomeOffice
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {isHomeOffice ? (
                            <Home size={10} />
                          ) : (
                            <Building size={10} />
                          )}
                          {isHomeOffice ? "Home Office" : "Office"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            disabled={actionLoading || !isHomeOffice}
                            onClick={() => handleAssignShift(u, "office")}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                              !isHomeOffice
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200 cursor-default"
                                : "border-gray-300 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                            }`}
                          >
                            <Building size={11} className="inline mr-1" />
                            Office
                          </button>
                          <button
                            disabled={actionLoading || isHomeOffice}
                            onClick={() => handleAssignShift(u, "homeOffice")}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                              isHomeOffice
                                ? "bg-indigo-100 text-indigo-700 border-indigo-200 cursor-default"
                                : "border-gray-300 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
                            }`}
                          >
                            <Home size={11} className="inline mr-1" />
                            Home
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingShiftKey && (
        <EditShiftDefModal
          open={!!editingShiftKey}
          onClose={() => setEditingShiftKey(null)}
          shiftKey={editingShiftKey}
          preset={presets[editingShiftKey]}
          onSave={handleSavePreset}
        />
      )}
    </div>
  );
}

// ====================== EMPLOYEE VIEW ======================
function EmployeeView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const presets = loadPresets();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/users/getProfile`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        setProfile(data?.data || data?.user || data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 max-w-lg">
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const shiftKey = profile ? getUserShiftKey(profile) : "office";
  const preset = presets[shiftKey];
  const isHomeOffice = shiftKey === "homeOffice";

  return (
    <div className="max-w-sm space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div
          className={`px-6 py-5 ${
            isHomeOffice ? "bg-indigo-500" : "bg-[#113F67]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
              {isHomeOffice ? (
                <Home size={20} className="text-white" />
              ) : (
                <Building size={20} className="text-white" />
              )}
            </div>
            <div>
              <h2 className="text-white font-semibold">
                {isHomeOffice ? "Home Office Shift" : "Office Shift"}
              </h2>
              <p className="text-white/70 text-sm">
                {profile?.firstName} {profile?.lastName}
              </p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Sun size={12} className="text-amber-400" />
                <p className="text-xs text-gray-400">Start</p>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {formatTime(preset.start)}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                {isHomeOffice ? (
                  <Moon size={12} className="text-indigo-400" />
                ) : (
                  <Sun size={12} className="text-orange-400" />
                )}
                <p className="text-xs text-gray-400">End</p>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {isHomeOffice ? "12:00 AM" : formatTime(preset.end)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            Late after {preset.lateThreshold} min of shift starting time
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={14} className="text-blue-600" />
          <p className="text-sm font-semibold text-blue-800">
            Attendance Rules
          </p>
        </div>
        <ul className="space-y-1 text-xs text-blue-700">
          <li className="flex items-start gap-1.5">
            <CheckCircle size={11} className="mt-0.5 shrink-0 text-blue-500" />3
            late days = 1 day salary deduction
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle size={11} className="mt-0.5 shrink-0 text-blue-500" />
            Payroll basis: working days per month
          </li>
        </ul>
      </div>
    </div>
  );
}

// ====================== MAIN PAGE ======================
export default function ShiftSchedulePage() {
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    setRole(getRole());
    setRoleLoading(false);
  }, []);

  const isAdmin = role === "admin" || role === "superAdmin";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#113F67] rounded-lg flex items-center justify-center">
              <Clock size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Shift Schedule
              </h1>
              <p className="text-xs text-gray-400">
                {isAdmin
                  ? "Manage employee shift assignments"
                  : "Your shift information"}
              </p>
            </div>
            {isAdmin && (
              <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold border border-purple-200">
                <Shield size={11} />
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 px-2 py-6">
        {roleLoading ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-36 flex-1 rounded-xl" />
              <Skeleton className="h-36 flex-1 rounded-xl" />
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : isAdmin ? (
          <AdminView />
        ) : (
          <EmployeeView />
        )}
      </div>
    </div>
  );
}
