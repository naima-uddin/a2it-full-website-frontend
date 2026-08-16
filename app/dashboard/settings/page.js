"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Lock, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";

export default function SettingsPage() {
  const { user, logout, changePassword } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const result = await changePassword(currentPassword, newPassword, confirmPassword);

    if (result.success) {
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account and preferences</p>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#0066ff] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded-full text-sm text-[#00f0ff] capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[#00f0ff]" />
            <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-red-400 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6 text-green-400 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:shadow-lg hover:shadow-[#00f0ff]/20 text-[#0a0a12] font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-red-200 rounded-xl p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Logout</h2>
          <p className="text-slate-600 mb-6">
            Click the button below to logout from your account
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
