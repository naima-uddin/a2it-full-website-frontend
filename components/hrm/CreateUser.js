"use client";

import React, { useState, useEffect } from "react";
import { createUser as createUserAPI, getUsers } from "@/app/hrm/lib/api";

function createUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee",
    salary: "",
  });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      role: form.role,
      salaryType: "monthly",
      rate: Number(form.salary),
    };

    const res = await createUserAPI(payload);

    if (res.message === "User created successfully") {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "employee",
        salary: "",
      });
      fetchUsers();
    } else {
      alert(res.message);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-10 p-6">
      {/* Create User Form */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-purple-700">
          Create User
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="input"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="input"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="input col-span-2"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="input col-span-2"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>

          <input
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            placeholder="Monthly Salary"
            required
            className="input"
          />

          <button
            disabled={loading}
            className="col-span-2 rounded-lg bg-purple-700 py-2 text-white hover:bg-purple-800"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-purple-700">
          User List
        </h2>

        <table className="w-full border">
          <thead className="bg-purple-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td className="border p-2">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2 capitalize">{u.role}</td>
                  <td className="border p-2">{u.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default createUser;
