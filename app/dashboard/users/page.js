"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, Search } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

export default function UsersPage() {
  const { token, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "moderator" });

  if (!isAdmin) {
    return <DashboardLayout><div className="text-center py-12"><p className="text-slate-600">Access Denied. Admin only.</p></div></DashboardLayout>;
  }

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingUser
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/${editingUser._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users/create`;

      const method = editingUser ? "PUT" : "POST";
      const body = editingUser
        ? { name: formData.name, email: formData.email, role: formData.role }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchUsers();
        setShowForm(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "", role: "moderator" });
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage Users</h1>
            <p className="text-slate-600">Create and manage admin and moderator accounts</p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({ name: "", email: "", password: "", role: "moderator" });
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">{editingUser ? "Edit User" : "Create New User"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              {!editingUser && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              )}
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-2 rounded-lg"
                >
                  {editingUser ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>

        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">Role</th>
                    <th className="px-6 py-3 text-left text-slate-600 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900">{user.name}</td>
                      <td className="px-6 py-4 text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === "admin" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setFormData({ name: user.name, email: user.email, password: "", role: user.role });
                            setShowForm(true);
                          }}
                          className="p-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
