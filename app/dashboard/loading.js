import DashboardSkeleton from "./components/DashboardSkeleton";

// Shown automatically by the App Router while a /dashboard route segment
// loads. It renders inside the persistent shell, so the sidebar stays visible
// and sticky while only the content area shows the skeleton.
export default function Loading() {
  return <DashboardSkeleton />;
}
