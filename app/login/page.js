"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Website / CMS dashboard login.
 *
 * This form authenticates ONLY against website/CMS accounts and redirects to
 * /dashboard. HRM employees must sign in through /hrm/staff-login instead.
 */
export default function Page() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("Checking your credentials...");

    // Website / CMS dashboard only. HRM accounts must use /hrm/staff-login.
    const websiteResult = await login(email, password);
    if (websiteResult.success) {
      setStatus("Signed in to the Website Dashboard — redirecting...");
      router.push("/dashboard");
      setLoading(false);
      return;
    }

    setStatus("");
    setError(
      websiteResult.message === "Could not reach the server."
        ? "Server unreachable. Please make sure the backend is running."
        : "Invalid email or password for the Website Dashboard.",
    );
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef2ff_45%,_#ffffff_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-3xl border border-slate-200 bg-white/75 p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:block">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            A2IT Ltd
          </p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            One login for the Website Dashboard and the HRM system.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Sign in with your A2IT account — we will take you to the right
            place automatically.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Website Dashboard
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Blogs, services, portfolio, employees and site settings.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-slate-900">
                HRM System
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Attendance, leave, payroll, meals and cost management.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Login to continue
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Sign in with your Website Dashboard account.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="you@a2itltd.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                placeholder="Enter your password"
                required
              />
            </div>

            {status && !error ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {status}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            HRM employee?{" "}
            <Link
              href="/hrm/staff-login"
              className="font-semibold text-slate-900 underline underline-offset-4"
            >
              Use the HRM login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
