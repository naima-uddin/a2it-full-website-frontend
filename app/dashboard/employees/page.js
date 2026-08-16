"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Search, Users } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import EmployeeForm from "../components/forms/EmployeeForm";

export default function EmployeesPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  if (!isAdmin && !isModerator) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">
            Access Denied. Admin or Moderator only.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const url = isAdmin
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/employees/admin/all`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/employees`;
      const opts = isAdmin
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await fetch(url, opts);

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.position || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Employees
            </h1>
            <p className="text-slate-500 mt-1">
              Add, edit, and manage team members{" "}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingEmployee(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
          >
            <Plus className="w-5 h-5" />
            Add Employee
          </motion.button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md border border-slate-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingEmployee ? "Edit Employee" : "New Employee"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingEmployee(null);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <EmployeeForm
              employee={editingEmployee}
              onSaved={() => {
                setShowForm(false);
                setEditingEmployee(null);
                fetchEmployees();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingEmployee(null);
              }}
            />
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Employees List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-slate-500">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-slate-500">No employees found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <motion.div
                key={emp._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow border border-slate-200 hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={emp.image}
                    alt={emp.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{emp.name}</h3>
                    <p className="text-sm text-slate-600">{emp.position}</p>
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded mt-2 ${
                        emp.role === "developer"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {emp.role}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {emp.description}
                </p>

                {emp.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {emp.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {emp.skills.length > 3 && (
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          +{emp.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditingEmployee(emp);
                      setShowForm(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded font-semibold text-sm transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </motion.button>
                  {isAdmin && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(emp._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded font-semibold text-sm transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
