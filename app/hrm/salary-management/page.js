"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  DollarSign,
  Edit2,
  Search,
  RefreshCw,
  X,
  Loader2,
  Users,
  TrendingUp,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Building,
  Briefcase,
  Download,
  Filter,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = process.env.NEXT_PUBLIC_HRM_API_URL;

const SALARY_TYPES = ["monthly", "hourly", "daily"];
const WORK_ARRANGEMENTS = [
  "full-time",
  "part-time",
  "contractual",
  "intern",
  "freelancer",
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

function formatCurrency(amount) {
  return `BDT ${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

const INP =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] focus:border-transparent";

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ====================== EDIT SALARY MODAL ======================
function EditSalaryModal({ open, onClose, user, onSaved }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && user) {
      setForm({
        salary: user.salary?.toString() || "",
        basicSalary: user.basicSalary?.toString() || "",
        salaryType: user.salaryType || "monthly",
        rate: user.rate?.toString() || "",
        workArrangement: user.workArrangement || "full-time",
        bankName: user.bankDetails?.bankName || "",
        accountNumber: user.bankDetails?.accountNumber || "",
        accountHolderName: user.bankDetails?.accountHolderName || "",
        branchName: user.bankDetails?.branchName || "",
        routingNumber: user.bankDetails?.routingNumber || "",
      });
    }
  }, [open, user]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.salary) {
      toast.error("Salary is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        salary: parseFloat(form.salary),
        salaryType: form.salaryType,
        workArrangement: form.workArrangement,
      };
      if (form.basicSalary) payload.basicSalary = parseFloat(form.basicSalary);
      if (form.rate) payload.rate = parseFloat(form.rate);
      if (form.bankName || form.accountNumber || form.accountHolderName) {
        payload.bankDetails = {
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          accountHolderName: form.accountHolderName,
          branchName: form.branchName,
          routingNumber: form.routingNumber,
        };
      }

      const res = await fetch(`${API_URL}/admin/update-user/${user._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Salary updated successfully");
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
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit Salary — ${user?.firstName} ${user?.lastName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Monthly Salary (BDT) *
            </label>
            <input
              type="number"
              className={INP}
              value={form.salary || ""}
              onChange={set("salary")}
              placeholder="0"
              min="0"
              onWheel={(e) => e.currentTarget.blur()}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Basic Salary (BDT)
            </label>
            <input
              type="number"
              className={INP}
              value={form.basicSalary || ""}
              onChange={set("basicSalary")}
              placeholder="0"
              min="0"
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Salary Type
            </label>
            <select
              className={INP}
              value={form.salaryType || "monthly"}
              onChange={set("salaryType")}
            >
              {SALARY_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Rate (hourly/daily)
            </label>
            <input
              type="number"
              className={INP}
              value={form.rate || ""}
              onChange={set("rate")}
              placeholder="0"
              min="0"
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Work Arrangement
          </label>
          <select
            className={INP}
            value={form.workArrangement || "full-time"}
            onChange={set("workArrangement")}
          >
            {WORK_ARRANGEMENTS.map((a) => (
              <option key={a} value={a} className="capitalize">
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Bank Details (Optional)
          </p>
          <div className="space-y-3">
            <input
              className={INP}
              placeholder="Bank Name"
              value={form.bankName || ""}
              onChange={set("bankName")}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className={INP}
                placeholder="Account Number"
                value={form.accountNumber || ""}
                onChange={set("accountNumber")}
              />
              <input
                className={INP}
                placeholder="Account Holder"
                value={form.accountHolderName || ""}
                onChange={set("accountHolderName")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className={INP}
                placeholder="Branch Name"
                value={form.branchName || ""}
                onChange={set("branchName")}
              />
              <input
                className={INP}
                placeholder="Routing Number"
                value={form.routingNumber || ""}
                onChange={set("routingNumber")}
              />
            </div>
          </div>
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
            disabled={saving}
            className="flex-1 bg-[#113F67] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0d3254] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Update Salary
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ====================== MAIN PAGE ======================
const ITEMS_PER_PAGE = 15;

export default function SalaryManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterArrangement, setFilterArrangement] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/getAll-user`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        const emps = (data.users || data.data || []).filter(
          (u) => u.role === "employee" && !u.isDeleted,
        );
        setEmployees(emps);
      } else {
        toast.error(data.message || "Failed to load employees");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const departments = useMemo(
    () =>
      [...new Set(employees.map((e) => e.department).filter(Boolean))].sort(),
    [employees],
  );

  const stats = useMemo(() => {
    const totalPayout = employees.reduce((s, e) => s + (e.salary || 0), 0);
    const avg = employees.length
      ? Math.round(totalPayout / employees.length)
      : 0;
    return { count: employees.length, totalPayout, avg };
  }, [employees]);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (filterDept !== "all" && e.department !== filterDept) return false;
      if (
        filterArrangement !== "all" &&
        e.workArrangement !== filterArrangement
      )
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !`${e.firstName} ${e.lastName}`.toLowerCase().includes(q) &&
          !e.email?.toLowerCase().includes(q) &&
          !e.employeeId?.toLowerCase().includes(q) &&
          !e.designation?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [employees, filterDept, filterArrangement, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterDept, filterArrangement]);

  const generatePDF = () => {
    if (!filtered.length) {
      toast.error("No data to export");
      return;
    }
    const doc = new jsPDF("landscape");
    const pw = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 63, 103);
    doc.text("Employee Salary Report", pw / 2, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}   Total Payout: ${formatCurrency(filtered.reduce((s, e) => s + e.salary, 0))}`,
      14,
      28,
    );
    autoTable(doc, {
      startY: 35,
      head: [
        [
          "#",
          "Employee ID",
          "Name",
          "Department",
          "Designation",
          "Arrangement",
          "Salary Type",
          "Monthly Salary (BDT)",
          "Basic Salary (BDT)",
        ],
      ],
      body: filtered.map((e, i) => [
        i + 1,
        e.employeeId || "-",
        `${e.firstName} ${e.lastName}`,
        e.department || "-",
        e.designation || "-",
        e.workArrangement || "-",
        e.salaryType || "monthly",
        (e.salary || 0).toLocaleString(),
        (e.basicSalary || 0).toLocaleString(),
      ]),
      headStyles: {
        fillColor: [17, 63, 103],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });
    doc.save(`salary_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF downloaded");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#113F67] rounded-lg flex items-center justify-center shrink-0">
            <DollarSign size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Salary Management
            </h1>
            <p className="text-xs text-gray-400">
              View and update employee salary details
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 px-2 py-6 space-y-6">
        {/* Stat Cards */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Total Employees",
                value: stats.count,
                type: "count",
                color: "bg-[#113F67]",
                Icon: Users,
              },
              {
                label: "Total Monthly Payout",
                value: stats.totalPayout,
                type: "currency",
                color: "bg-emerald-500",
                Icon: Wallet,
              },
              {
                label: "Average Salary",
                value: stats.avg,
                type: "currency",
                color: "bg-indigo-500",
                Icon: TrendingUp,
              },
            ].map(({ label, value, type, color, Icon }) => (
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
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  {type === "count" ? (
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
        )}

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
                  placeholder="Search by name, ID, email, designation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] bg-white"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#113F67] bg-white"
                value={filterArrangement}
                onChange={(e) => setFilterArrangement(e.target.value)}
              >
                <option value="all">All Arrangements</option>
                {WORK_ARRANGEMENTS.map((a) => (
                  <option key={a} value={a} className="capitalize">
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchEmployees}
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

          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-gray-100 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Users size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">
                {employees.length === 0
                  ? "No employees found."
                  : "No employees match your filters."}
              </p>
              {employees.length > 0 && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterDept("all");
                    setFilterArrangement("all");
                  }}
                  className="mt-3 text-sm text-[#113F67] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wide">
                      <th className="px-5 py-3 text-left font-medium">#</th>
                      <th className="px-5 py-3 text-left font-medium">
                        Employee
                      </th>
                      <th className="px-5 py-3 text-left font-medium">
                        Department
                      </th>
                      <th className="px-5 py-3 text-left font-medium">
                        Designation
                      </th>
                      <th className="px-5 py-3 text-left font-medium">
                        Arrangement
                      </th>
                      <th className="px-5 py-3 text-left font-medium">Type</th>
                      <th className="px-5 py-3 text-left font-medium">
                        Monthly Salary
                      </th>
                      <th className="px-5 py-3 text-left font-medium">
                        Basic Salary
                      </th>
                      <th className="px-5 py-3 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((emp, idx) => (
                      <tr
                        key={emp._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {emp.picture ? (
                              <img
                                src={emp.picture}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-[#113F67]/10 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-[#113F67]">
                                  {emp.firstName?.[0]?.toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-800">
                                {emp.firstName} {emp.lastName}
                              </div>
                              <div className="text-xs text-gray-400">
                                {emp.employeeId || emp.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Building
                              size={13}
                              className="text-gray-400 shrink-0"
                            />
                            {emp.department || (
                              <span className="text-gray-300">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {emp.designation || (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100 capitalize">
                            {emp.workArrangement || "full-time"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs text-gray-500 capitalize">
                            {emp.salaryType || "monthly"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {emp.salary ? (
                            <span className="font-semibold text-gray-800">
                              {formatCurrency(emp.salary)}
                            </span>
                          ) : (
                            <span className="text-xs text-amber-500 font-medium">
                              Not set
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">
                          {emp.basicSalary ? (
                            formatCurrency(emp.basicSalary)
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end">
                            <button
                              onClick={() => setEditTarget(emp)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#113F67]/10 text-[#113F67] rounded-lg text-xs font-medium hover:bg-[#113F67] hover:text-white transition-colors"
                            >
                              <Edit2 size={12} />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-600">
                    {paginated.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-600">
                    {filtered.length}
                  </span>{" "}
                  employees
                </p>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - currentPage) <= 1,
                      )
                      .reduce((acc, p, i, arr) => {
                        if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "..." ? (
                          <span
                            key={`dot-${i}`}
                            className="px-2 text-gray-400 text-sm"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === p
                                ? "bg-[#113F67] text-white"
                                : "border border-gray-200 hover:bg-gray-100 text-gray-600"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}

                <div className="text-right">
                  <p className="text-xs text-gray-400">Filtered Total Payout</p>
                  <p className="text-lg font-bold text-[#113F67]">
                    {formatCurrency(
                      filtered.reduce((s, e) => s + (e.salary || 0), 0),
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <EditSalaryModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        user={editTarget}
        onSaved={fetchEmployees}
      />
    </div>
  );
}
