import React from "react";

/**
 * Generic dashboard page skeleton.
 *
 * Rendered as the App Router `loading.js` fallback for the /dashboard segment,
 * so it shows in the main content area (the sidebar stays put) while the next
 * route's content loads. Can also be imported into a page's own loading state.
 */
export default function DashboardSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-live="polite">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-9 w-64 rounded-lg bg-slate-200" />
          <div className="h-4 w-80 rounded bg-slate-100" />
        </div>
        <div className="h-11 w-40 rounded-lg bg-slate-200" />
      </div>

      {/* Cards / rows */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 space-y-4"
          >
            <div className="h-10 w-10 rounded-lg bg-slate-200" />
            <div className="h-5 w-3/4 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-20 rounded bg-slate-100" />
              <div className="h-8 w-20 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
