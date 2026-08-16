"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Eye,
  X,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarDays,
  User,
  Shield,
  Send,
  Flag,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_HRM_API_URL;

const STATUSES = ["Pending", "Completed", "Cancelled"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const STATUS_CFG = {
  Pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  Completed: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Cancelled: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

const PRIORITY_CFG = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-blue-50 text-blue-600",
  High: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-700",
};

const INP =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] focus:border-transparent";

export default function TaskPage() {
  const router = useRouter();

  const [role, setRole] = useState(null); // 'admin' | 'superAdmin' | 'moderator' | 'employee'
  const [selfId, setSelfId] = useState(null); // current user's id (for self-created tasks)
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All"); // admin: view one employee's tasks
  const [todayOnly, setTodayOnly] = useState(true); // admin default: only today's tasks
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null); // task being edited (null = create)
  const [viewTask, setViewTask] = useState(null); // task in detail modal
  const [busy, setBusy] = useState(false);

  const privileged =
    role === "admin" || role === "superAdmin" || role === "moderator";
  const canBulkDelete = role === "admin" || role === "superAdmin";

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // ---------- auth helpers ----------
  const parseId = (key) => {
    try {
      const d = JSON.parse(localStorage.getItem(key) || "{}");
      return d?._id || d?.id || null;
    } catch {
      return null;
    }
  };
  const getAuth = () => {
    if (typeof window === "undefined") return null;
    const adminToken = localStorage.getItem("adminToken");
    const moderatorToken = localStorage.getItem("moderatorToken");
    const employeeToken = localStorage.getItem("employeeToken");
    const adminData = localStorage.getItem("adminData");
    if (adminToken) {
      let r = "admin";
      try {
        r =
          JSON.parse(adminData || "{}")?.role === "superAdmin"
            ? "superAdmin"
            : "admin";
      } catch {}
      return { token: adminToken, role: r, id: parseId("adminData") };
    }
    if (moderatorToken)
      return {
        token: moderatorToken,
        role: "moderator",
        id: parseId("moderatorData"),
      };
    if (employeeToken)
      return {
        token: employeeToken,
        role: "employee",
        id: parseId("employeeData"),
      };
    return null;
  };
  const H = (t) => ({
    Authorization: "Bearer " + t,
    "Content-Type": "application/json",
  });

  // ---------- fetchers ----------
  const loadTasks = useCallback(async (auth) => {
    const a = auth || getAuth();
    if (!a) return;
    const priv = ["admin", "superAdmin", "moderator"].includes(a.role);
    try {
      const url = priv ? `${API}/tasks?limit=300` : `${API}/tasks/my`;
      const r = await fetch(url, { headers: H(a.token) });
      const d = await r.json();
      if (r.ok && d.success) setTasks(d.data || []);
      else setTasks([]);
    } catch {
      setTasks([]);
    }
  }, []);

  const loadStats = useCallback(async (auth) => {
    const a = auth || getAuth();
    if (!a) return;
    try {
      const r = await fetch(`${API}/tasks/stats`, { headers: H(a.token) });
      const d = await r.json();
      if (r.ok && d.success) setStats(d.data);
    } catch {}
  }, []);

  const loadEmployees = useCallback(async (auth) => {
    const a = auth || getAuth();
    if (!a) return;
    try {
      const r = await fetch(`${API}/admin/getAll-user?role=employee`, {
        headers: H(a.token),
      });
      const d = await r.json();
      const list = Array.isArray(d) ? d : d.users || d.data || [];
      setEmployees(list.filter((e) => e?._id && e.role === "employee"));
    } catch {}
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    const a = getAuth();
    if (!a) {
      router.replace("/hrm");
      return;
    }
    setRole(a.role);
    setSelfId(a.id);
    const priv = ["admin", "superAdmin", "moderator"].includes(a.role);
    await Promise.all([
      loadTasks(a),
      priv ? loadStats(a) : Promise.resolve(),
      priv ? loadEmployees(a) : Promise.resolve(),
    ]);
    setLoading(false);
  }, [loadTasks, loadStats, loadEmployees, router]);

  useEffect(() => {
    init();
  }, [init]);

  const refresh = async () => {
    const a = getAuth();
    await loadTasks(a);
    if (privileged) await loadStats(a);
    toast.success("Refreshed");
  };

  // ---------- actions ----------
  const saveTask = async (form) => {
    const a = getAuth();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (privileged && !form.assignedTo) {
      toast.error("Please choose who to assign this task to");
      return;
    }
    setBusy(true);
    try {
      const editing = !!editTask;
      const url = editing ? `${API}/tasks/${editTask._id}` : `${API}/tasks`;
      const r = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: H(a.token),
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (r.ok && d.success) {
        toast.success(editing ? "Task updated" : "Task added");
        setShowForm(false);
        setEditTask(null);
        await loadTasks(a);
        if (privileged) await loadStats(a);
      } else {
        toast.error(d.message || "Failed to save task");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (task, status) => {
    const a = getAuth();
    setBusy(true);
    try {
      const r = await fetch(`${API}/tasks/${task._id}/status`, {
        method: "PATCH",
        headers: H(a.token),
        body: JSON.stringify({ status }),
      });
      const d = await r.json();
      if (r.ok && d.success) {
        toast.success(d.message || "Status updated");
        setViewTask((v) => (v && v._id === task._id ? d.data : v));
        await loadTasks(a);
        if (privileged) await loadStats(a);
      } else {
        toast.error(d.message || "Failed to update status");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setBusy(false);
    }
  };

  const addComment = async (task, text) => {
    const a = getAuth();
    setBusy(true);
    try {
      const r = await fetch(`${API}/tasks/${task._id}/comment`, {
        method: "POST",
        headers: H(a.token),
        body: JSON.stringify({ text }),
      });
      const d = await r.json();
      if (r.ok && d.success) {
        setViewTask(d.data);
        await loadTasks(a);
      } else {
        toast.error(d.message || "Failed to add comment");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setBusy(false);
    }
  };

  const removeTask = async (task) => {
    if (!confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
    const a = getAuth();
    try {
      const r = await fetch(`${API}/tasks/${task._id}`, {
        method: "DELETE",
        headers: H(a.token),
      });
      const d = await r.json();
      if (r.ok && d.success) {
        toast.success("Task deleted");
        await loadTasks(a);
        if (privileged) await loadStats(a);
      } else {
        toast.error(d.message || "Failed to delete");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  const toggleSelectAll = (ids) => {
    setSelectedIds((p) => (ids.every((id) => p.includes(id)) ? [] : ids));
  };

  const bulkDeleteTasks = async () => {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Permanently delete ${selectedIds.length} task(s)? This cannot be undone.`
      )
    )
      return;
    const a = getAuth();
    setBulkDeleting(true);
    try {
      const r = await fetch(`${API}/tasks/bulk-delete`, {
        method: "POST",
        headers: H(a.token),
        body: JSON.stringify({ taskIds: selectedIds }),
      });
      const d = await r.json();
      if (r.ok && d.success) {
        toast.success(d.message || "Tasks deleted");
        setSelectedIds([]);
        await loadTasks(a);
        if (privileged) await loadStats(a);
      } else {
        toast.error(d.message || "Failed to delete tasks");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setBulkDeleting(false);
    }
  };

  // ---------- derived ----------
  // A task counts as "active today" when it's current work: it has already
  // started (or has no start) and isn't past its due date. A missing start
  // means no lower bound; a missing due means no upper bound — so a task with
  // only a due date is active from now until it's due, not just on that day.
  // Overdue tasks that are still Pending stay visible, since they need action.
  const isActiveToday = (t) => {
    const dOnly = (d) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    };
    const today = dOnly(new Date());
    const s = t.startDate ? dOnly(t.startDate) : null;
    const e = t.dueDate ? dOnly(t.dueDate) : null;
    if (!s && !e) return true; // undated → ongoing
    if (s && today < s) return false; // hasn't started yet
    if (e && today > e) return t.status === "Pending"; // past due, but still open
    return true;
  };

  // Default admin home = today's tasks across all employees. Picking one
  // employee switches to their full task list (today filter no longer applies).
  const showTodayOnly = privileged && todayOnly && employeeFilter === "All";

  const filtered = tasks.filter((t) => {
    if (showTodayOnly && !isActiveToday(t)) return false;
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    if (overdueOnly && !isOverdue(t)) return false;
    if (
      employeeFilter !== "All" &&
      (t.assignedTo?._id || t.assignedTo)?.toString() !== employeeFilter
    )
      return false;
    if (search) {
      const q = search.toLowerCase();
      const who =
        `${t.assignedTo?.firstName || ""} ${t.assignedTo?.lastName || ""}`.toLowerCase();
      if (
        !t.title.toLowerCase().includes(q) &&
        !(t.description || "").toLowerCase().includes(q) &&
        !who.includes(q)
      )
        return false;
    }
    return true;
  });

  const isOverdue = (t) =>
    t.dueDate && t.status === "Pending" && new Date(t.dueDate) < new Date();

  const selectSummaryFilter = (kind) => {
    setTodayOnly(false);
    setOverdueOnly(false);

    if (kind === "all") {
      setStatusFilter("All");
      return;
    }

    if (kind === "overdue") {
      setStatusFilter("Pending");
      setOverdueOnly(true);
      return;
    }

    setStatusFilter(kind);
  };

  // A task the current user raised themselves (not one an admin assigned)
  const isSelfCreated = (t) =>
    selfId && (t.assignedBy?._id || t.assignedBy)?.toString() === selfId;

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  // "From – To" range, or a single due date, for compact display
  const fmtRange = (t) => {
    if (t.startDate && t.dueDate)
      return `${fmtDate(t.startDate)} → ${fmtDate(t.dueDate)}`;
    if (t.dueDate) return `Due ${fmtDate(t.dueDate)}`;
    if (t.startDate) return `From ${fmtDate(t.startDate)}`;
    return "";
  };

  // ---------- loading ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#113F67] mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#113F67] rounded-xl shadow">
              <ClipboardList className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Task Management
              </h1>
              <p className="text-sm text-gray-500">
                {!privileged
                  ? "Your assigned tasks"
                  : employeeFilter !== "All"
                    ? `All tasks for ${
                        employees.find((e) => e._id === employeeFilter)
                          ?.firstName || "employee"
                      }`
                    : todayOnly
                      ? "Today's tasks — all employees"
                      : "All tasks — all employees"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#113F67]/10 text-[#113F67] flex items-center gap-1.5">
              {privileged ? <Shield size={13} /> : <User size={13} />}
              {(role || "").toUpperCase()}
            </span>
            <button
              onClick={refresh}
              className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw size={17} />
            </button>
            <button
              onClick={() => {
                setEditTask(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700"
            >
              <Plus size={17} /> {privileged ? "New Task" : "Add my task"}
            </button>
          </div>
        </div>

        {/* Stats (privileged) */}
        {privileged && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard
              label="Total"
              value={stats.total}
              icon={ClipboardList}
              color="text-[#113F67]"
              active={statusFilter === "All" && !overdueOnly}
              onClick={() => selectSummaryFilter("all")}
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              icon={Clock}
              color="text-amber-600"
              active={statusFilter === "Pending" && !overdueOnly}
              onClick={() => selectSummaryFilter("Pending")}
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              color="text-emerald-600"
              active={statusFilter === "Completed"}
              onClick={() => selectSummaryFilter("Completed")}
            />
            <StatCard
              label="Overdue"
              value={stats.overdue}
              icon={AlertTriangle}
              color="text-red-600"
              active={overdueOnly}
              onClick={() => selectSummaryFilter("overdue")}
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
          <div className="flex gap-1.5 flex-wrap items-center">
            {privileged && employeeFilter === "All" && (
              <button
                onClick={() => setTodayOnly((v) => !v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  todayOnly
                    ? "bg-teal-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                title="Toggle between today's tasks and all tasks"
              >
                <CalendarDays size={13} />
                {todayOnly ? "Today" : "All dates"}
              </button>
            )}
            {["All", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-[#113F67] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {privileged && (
            <div className="flex flex-col sm:flex-row gap-2 md:ml-auto">
              <div className="relative sm:w-56">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#113F67]"
                >
                  <option value="All">All employees</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.firstName} {e.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative sm:w-56">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title or assignee…"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bulk select / delete bar (admin only) */}
        {canBulkDelete && filtered.length > 0 && (
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={
                  filtered.length > 0 &&
                  filtered.every((t) => selectedIds.includes(t._id))
                }
                onChange={() => toggleSelectAll(filtered.map((t) => t._id))}
                className="w-4 h-4 accent-[#113F67]"
              />
              Select all ({filtered.length})
            </label>
            {selectedIds.length > 0 && (
              <button
                onClick={bulkDeleteTasks}
                disabled={bulkDeleting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {bulkDeleting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
                Delete selected ({selectedIds.length})
              </button>
            )}
          </div>
        )}

        {/* Task list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {showTodayOnly
                ? "No tasks scheduled for today"
                : "No tasks found"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {!privileged
                ? "You have no tasks in this view."
                : showTodayOnly
                  ? "Switch to “All dates” to see upcoming and past tasks."
                  : employeeFilter !== "All"
                    ? "This employee has no tasks matching the filters."
                    : "Create a task to assign work to your team."}
            </p>
            {showTodayOnly && (
              <button
                onClick={() => setTodayOnly(false)}
                className="mt-4 px-4 py-2 rounded-lg bg-[#113F67] text-white text-sm font-semibold hover:bg-[#0d3155]"
              >
                Show all tasks
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((t) => {
              const sc = STATUS_CFG[t.status] || STATUS_CFG.Pending;
              const overdue = isOverdue(t);
              return (
                <div
                  key={t._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-2">
                      {canBulkDelete && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(t._id)}
                          onChange={() => toggleSelect(t._id)}
                          className="w-4 h-4 mt-1 accent-[#113F67] shrink-0"
                        />
                      )}
                      <h3 className="font-bold text-gray-900 leading-snug">
                        {t.title}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${PRIORITY_CFG[t.priority]}`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  {t.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {t.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {privileged
                        ? `${t.assignedTo?.firstName || ""} ${t.assignedTo?.lastName || ""}`.trim() ||
                          "—"
                        : isSelfCreated(t)
                          ? "self-added"
                          : `by ${t.assignedBy?.firstName || "Admin"}`}
                    </span>
                    {(t.startDate || t.dueDate) && (
                      <span
                        className={`flex items-center gap-1 ${overdue ? "text-red-600 font-semibold" : ""}`}
                      >
                        <CalendarDays size={12} />
                        {fmtRange(t)}
                        {overdue && " · overdue"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${sc.bg} ${sc.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {t.status}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Employee quick status action */}
                      {!privileged && t.status === "Pending" && (
                        <button
                          onClick={() => changeStatus(t, "Completed")}
                          disabled={busy}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => setViewTask(t)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>
                      {/* Employee can delete a task they raised themselves */}
                      {!privileged && isSelfCreated(t) && (
                        <button
                          onClick={() => removeTask(t)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                          title="Delete my task"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                      {privileged && (
                        <>
                          <button
                            onClick={() => {
                              setEditTask(t);
                              setShowForm(true);
                            }}
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => removeTask(t)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {showForm && (
        <TaskFormModal
          task={editTask}
          employees={employees}
          privileged={privileged}
          busy={busy}
          onClose={() => {
            setShowForm(false);
            setEditTask(null);
          }}
          onSave={saveTask}
        />
      )}

      {/* Detail modal */}
      {viewTask && (
        <TaskDetailModal
          task={viewTask}
          privileged={privileged}
          busy={busy}
          fmtDate={fmtDate}
          fmtRange={fmtRange}
          onClose={() => setViewTask(null)}
          onStatus={changeStatus}
          onComment={addComment}
        />
      )}
    </>
  );
}

/* ================= Sub components ================= */

function StatCard({ label, value, icon: Icon, color, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left bg-white rounded-2xl border shadow-sm p-4 transition-all ${
        onClick
          ? "hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
          : "cursor-default"
      } ${active ? "border-[#113F67] ring-2 ring-[#113F67]/15" : "border-gray-100"}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? 0}</p>
        </div>
        <Icon className={color} size={22} />
      </div>
    </button>
  );
}

function TaskFormModal({ task, employees, privileged, busy, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignedTo: task?.assignedTo?._id || task?.assignedTo || "",
    priority: task?.priority || "Medium",
    startDate: task?.startDate ? task.startDate.slice(0, 10) : "",
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    status: task?.status || "Pending",
  });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-gray-900">
            {task ? "Edit Task" : privileged ? "New Task" : "Add my task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={set("title")}
              className={INP}
              placeholder="e.g. Prepare monthly report"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              className={INP}
              placeholder="Details, checklist, links…"
            />
          </div>
          {privileged ? (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Assign to <span className="text-red-500">*</span>
              </label>
              <select
                value={form.assignedTo}
                onChange={set("assignedTo")}
                className={INP}
              >
                <option value="">Select an employee…</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.firstName} {e.lastName}
                    {e.department ? ` — ${e.department}` : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="rounded-lg bg-teal-50 border border-teal-100 px-3 py-2 text-xs text-teal-800">
              This task will be added to your own task list.
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={set("priority")}
              className={INP}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Duration{" "}
              <span className="text-gray-400 font-normal">
                (leave From empty for a single-day task)
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] text-gray-400 mb-1">
                  From (start)
                </span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={set("startDate")}
                  max={form.dueDate || undefined}
                  className={INP}
                />
              </div>
              <div>
                <span className="block text-[11px] text-gray-400 mb-1">
                  To (due date)
                </span>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={set("dueDate")}
                  min={form.startDate || undefined}
                  className={INP}
                />
              </div>
            </div>
          </div>
          {task && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={set("status")}
                className={INP}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Flag size={15} />
            )}
            {task ? "Save changes" : "Assign task"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskDetailModal({
  task,
  privileged,
  busy,
  fmtDate,
  fmtRange,
  onClose,
  onStatus,
  onComment,
}) {
  const [comment, setComment] = useState("");
  const sc = STATUS_CFG[task.status] || STATUS_CFG.Pending;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <div className="pr-2">
            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${PRIORITY_CFG[task.priority]}`}
              >
                {task.priority}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${sc.bg} ${sc.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {task.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {task.description && (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {task.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info
              label="Assigned to"
              value={
                `${task.assignedTo?.firstName || ""} ${task.assignedTo?.lastName || ""}`.trim() ||
                "—"
              }
            />
            <Info
              label="Assigned by"
              value={
                task.assignedBy?.firstName
                  ? `${task.assignedBy.firstName} ${task.assignedBy.lastName || ""}`
                  : "—"
              }
            />
            <Info label="From (start)" value={fmtDate(task.startDate)} />
            <Info label="To (due date)" value={fmtDate(task.dueDate)} />
            <Info label="Duration" value={fmtRange(task) || "—"} />
            <Info label="Created" value={fmtDate(task.createdAt)} />
          </div>

          {/* Status update */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Update status
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatus(task, s)}
                  disabled={busy || task.status === s}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    task.status === s
                      ? "bg-[#113F67] text-white cursor-default"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Activity & comments
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
              {(task.comments || []).length === 0 ? (
                <p className="text-xs text-gray-400">No comments yet.</p>
              ) : (
                task.comments.map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">
                        {c.byName || "User"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {fmtDate(c.at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{c.text}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment…"
                className={INP}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && comment.trim()) {
                    onComment(task, comment.trim());
                    setComment("");
                  }
                }}
              />
              <button
                onClick={() => {
                  if (comment.trim()) {
                    onComment(task, comment.trim());
                    setComment("");
                  }
                }}
                disabled={busy || !comment.trim()}
                className="px-3 rounded-lg bg-[#113F67] text-white hover:bg-[#0d3155] disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}
