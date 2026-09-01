"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  Menu,
  X,
  FileText,
  Settings,
  Users,
  ShoppingCart,
  Image,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const DashboardNavLink = ({ item, pathname, onClick }) => {
  const Icon = item.icon;
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname?.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        isActive
          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{item.label}</span>
    </Link>
  );
};

const DashboardNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const menuItems = [
    {
      id: "services",
      label: "Manage Services",
      icon: ShoppingCart,
      href: "/dashboard/services",
    },

    {
      id: "portfolio",
      label: "Manage Portfolio",
      icon: Image,
      href: "/dashboard/portfolio",
    },
    {
      id: "employees",
      label: "Manage Employees",
      icon: Users,
      href: "/dashboard/employees",
    },
    {
      id: "blog",
      label: "Manage Blog",
      icon: FileText,
      href: "/dashboard/blog",
    },

    {
      id: "projects",
      label: "Promotional Projects",
      icon: Image,
      href: "/dashboard/projects",
    },

    {
      id: "solutions",
      label: "Promotional Packages",
      icon: TrendingUp,
      href: "/dashboard/solutions",
    },
    {
      id: "media",
      label: "All Media",
      icon: Image,
      href: "/dashboard/media",
    },
    {
      id: "client-showcase",
      label: "Client Showcase",
      icon: Image,
      href: "/dashboard/client-showcase",
    },
    ...(user?.role === "admin"
      ? [
          {
            id: "users",
            label: "Manage Users",
            icon: Users,
            href: "/dashboard/users",
          },
        ]
      : []),

    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile top bar (hamburger + brand) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          className="-ml-2 rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link
          href="/dashboard"
          className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]"
        >
          A2IT Dashboard
        </Link>
      </header>

      {/* Sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:w-64 lg:translate-x-0 lg:shadow-none ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 p-6 pb-4">
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]"
          >
            A2IT Dashboard
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4">
          {menuItems.map((item) => (
            <DashboardNavLink
              key={item.id}
              item={item}
              pathname={pathname}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-slate-200 p-4">
          <div className="mb-4 border-b border-slate-200 pb-4">
            <p className="text-sm text-slate-500">Logged in as</p>
            <p className="truncate font-semibold text-slate-900">
              {user?.name}
            </p>
            <p className="text-xs capitalize text-cyan-600">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

/**
 * Persistent dashboard shell. The sidebar lives here (in the route layout),
 * so it stays mounted and sticky while the inner page content swaps on
 * navigation — no more full-shell remount between routes.
 */
export default function DashboardShell({ children }) {
  return (
    <div className="flex h-screen bg-[#ffffff]">
      <DashboardNav />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-14 lg:ml-64 lg:pt-0">
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
