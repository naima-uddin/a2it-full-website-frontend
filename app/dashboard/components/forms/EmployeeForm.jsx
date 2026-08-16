"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function EmployeeForm({
  employee = null,
  onSaved = () => {},
  onCancel = () => {},
}) {
  const { token, isAdmin } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDisplay, setNewRoleDisplay] = useState("");
  const [form, setForm] = useState({
    name: employee?.name || "",
    number: employee?.number || "",
    position: employee?.position || "",
    image: employee?.image || "",
    description: employee?.description || "",
    achievements: (employee?.achievements || []).join("\n"),
    skills: (employee?.skills || []).join(", "),
    role: employee?.role || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/roles`,
      );

      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles);
        if (!form.role && data.roles.length > 0) {
          setForm((s) => ({ ...s, role: data.roles[0].name }));
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName || !newRoleDisplay) {
      alert("Please provide both role name and display name");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/roles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newRoleName,
            displayName: newRoleDisplay,
          }),
        },
      );

      if (response.ok) {
        setNewRoleName("");
        setNewRoleDisplay("");
        fetchRoles();
      }
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const handleDeleteRole = async (name) => {
    if (!window.confirm("Delete this role?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/roles/${name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        fetchRoles();
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.position || !form.image) {
      alert("Please fill in Name, Position, and Image URL");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      achievements: form.achievements
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = employee
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${employee._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/employees`;
      const method = employee ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        onSaved(json.data);
      } else {
        alert("Failed to save employee");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Manager Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Employee Form</h3>
        <button
          type="button"
          onClick={() => setShowRoleManager(!showRoleManager)}
          className="text-sm px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
        >
          Manage Roles
        </button>
      </div>

      {/* Role Manager */}
      {showRoleManager && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3"
        >
          <h4 className="font-semibold text-slate-900">Manage Roles</h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Role name (e.g., frontend-dev)"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
            />
            <input
              type="text"
              placeholder="Display name (e.g., Frontend Developer)"
              value={newRoleDisplay}
              onChange={(e) => setNewRoleDisplay(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
            />
            <button
              type="button"
              onClick={handleAddRole}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm"
            >
              Add
            </button>
          </div>

          {!loadingRoles && (
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <div
                  key={role._id}
                  className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm"
                >
                  <span className="text-slate-900">{role.displayName}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRole(role.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Serial Number to show in website (optional, e.g. 01, 02, 03)
          </label>
          <input
            value={form.number}
            onChange={(e) => handleChange("number", e.target.value)}
            placeholder="e.g. 01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Position *
          </label>
          <input
            value={form.position}
            onChange={(e) => handleChange("position", e.target.value)}
            placeholder="e.g. Full Stack Developer"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Role
          </label>
          <select
            value={form.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3 */}
      <ImageUpload
        currentImage={form.image}
        onImageUploaded={(url) => handleChange("image", url)}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief description of the employee..."
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows={3}
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Skills (comma separated)
        </label>
        <textarea
          value={form.skills}
          onChange={(e) => handleChange("skills", e.target.value)}
          placeholder="e.g. React, Node.js, MongoDB, TypeScript"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows={2}
        />
      </div>

      {/* Achievements */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Achievements (one per line)
        </label>
        <textarea
          value={form.achievements}
          onChange={(e) => handleChange("achievements", e.target.value)}
          placeholder="e.g. AWS Certified&#10;Led 10+ Projects&#10;Award Winner"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
        >
          {saving ? "Saving..." : employee ? "Update" : "Create"}
        </motion.button>
      </div>
    </form>
  );
}
