import React from "react";

/**
 * Backwards-compatible passthrough.
 *
 * The sidebar shell now lives in app/dashboard/layout.js (via DashboardShell)
 * so it stays mounted and sticky across navigations. Pages still wrap their
 * content in <DashboardLayout> — that wrapper now simply renders the content
 * without re-drawing the sidebar. New pages don't need this wrapper at all.
 */
export default function DashboardLayout({ children }) {
  return <>{children}</>;
}
