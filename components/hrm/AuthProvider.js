"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Bell, X, User, Clock, CheckCircle, Utensils } from "lucide-react";
import Sidebar from "@/components/hrm/sidebar";
import Link from "next/link";

const nowMonth = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
};
const NOTIF_SEEN_KEY = "notifSeenCount";

function NotificationBell() {
  const router = useRouter();
  const [canView, setCanView] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileNotifs, setProfileNotifs] = useState([]);
  const [pendingMeals, setPendingMeals] = useState([]);
  const [pendingSubs, setPendingSubs] = useState([]);
  const [totalPending, setTotalPending] = useState(0);
  const [seenCount, setSeenCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const apiUrl = process.env.NEXT_PUBLIC_HRM_API_URL;

  const getToken = () =>
    localStorage.getItem("adminToken") ||
    localStorage.getItem("moderatorToken");
  const getAdminToken = () => localStorage.getItem("adminToken");

  const loadAll = async () => {
    try {
      const token = getToken();
      if (!token) {
        setCanView(false);
        return;
      }
      setCanView(true);
      setIsAdmin(!!getAdminToken());

      const month = nowMonth();
      const [y, m] = month.split("-");
      const start = new Date(Number(y), Number(m) - 1, 1).toISOString();
      const end = new Date(Number(y), Number(m), 0, 23, 59, 59).toISOString();
      const hdr = { Authorization: `Bearer ${token}` };

      // fetch profile notifs (admin only) + meal data (admin + moderator) in parallel
      const mealsP = fetch(
        `${apiUrl}/admin/meals/all?startDate=${start}&endDate=${end}`,
        { headers: hdr },
      )
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
      const subsP = fetch(
        `${apiUrl}/admin/subscriptions/all?limit=200&month=${month}`,
        { headers: hdr },
      )
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
      const profP = getAdminToken()
        ? fetch(`${apiUrl}/notifications?limit=8`, { headers: hdr })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        : Promise.resolve(null);

      const [mealsData, subsData, profData] = await Promise.all([
        mealsP,
        subsP,
        profP,
      ]);

      const meals = mealsData?.meals || mealsData?.data || [];
      const subs = subsData?.subscriptions || [];
      const notifs = profData?.notifications || [];

      const pm = meals.filter((m) => m.status === "pending").slice(0, 5);
      const ps = subs
        .filter((s) => s.currentMonthStatus === "pending")
        .slice(0, 5);
      const pp = notifs.filter((n) => n.status === "pending").length;
      const newTotal = pm.length + ps.length + pp;

      setPendingMeals(pm);
      setPendingSubs(ps);
      setProfileNotifs(notifs);
      setTotalPending(newTotal);
      setSeenCount(parseInt(localStorage.getItem(NOTIF_SEEN_KEY) || "0"));
    } catch {}
  };

  useEffect(() => {
    loadAll();
    const poll = setInterval(loadAll, 30000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  // badge = new items since user last viewed
  const pendingProfileCount = profileNotifs.filter(
    (n) => n.status === "pending",
  ).length;
  const badgeCount = Math.max(0, totalPending - seenCount);
  const hasAny = totalPending > 0 || profileNotifs.length > 0;

  const markSeen = () => {
    setSeenCount(totalPending);
    localStorage.setItem(NOTIF_SEEN_KEY, String(totalPending));
  };

  const handleBellClick = () => {
    const opening = !showDropdown;
    setShowDropdown((v) => !v);
    if (opening) {
      loadAll();
      markSeen();
    }
  };

  if (!canView) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative  rounded-lg hover:bg-gray-100 transition-colors"
        title="Notifications"
      >
        <Bell size={22} className="text-gray-800" />
        {badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {badgeCount > 9 ? "9+" : badgeCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* header */}
          <div className="px-4 py-3 bg-[#113F67] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-white" />
              <span className="text-white font-semibold text-sm">
                Notifications
              </span>
              {totalPending > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {totalPending} pending
                </span>
              )}
            </div>
            <button onClick={() => setShowDropdown(false)}>
              <X size={15} className="text-white/70 hover:text-white" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {/* Pending Meal Requests */}
            {pendingMeals.length > 0 && (
              <>
                <div className="px-4 py-1.5 bg-amber-50 flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    Meal Requests
                  </span>
                  <span className="bg-amber-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">
                    {pendingMeals.length}
                  </span>
                </div>
                {pendingMeals.map((m, i) => {
                  const src =
                    m.userInfo ||
                    (typeof m.user === "object" ? m.user : null) ||
                    {};
                  const name = src.firstName
                    ? `${src.firstName} ${src.lastName || ""}`.trim()
                    : "Employee";
                  const date = m.date
                    ? new Date(m.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "";
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/hrm/meal");
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-amber-50/60 transition-colors bg-amber-50/30"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-amber-700">
                            {name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            {name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {date} · {m.preference} meal
                          </p>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                          pending
                        </span>
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {/* Pending Subscription Requests */}
            {pendingSubs.length > 0 && (
              <>
                <div className="px-4 py-1.5 bg-blue-50 flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                    Subscriptions
                  </span>
                  <span className="bg-blue-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">
                    {pendingSubs.length}
                  </span>
                </div>
                {pendingSubs.map((s, i) => {
                  const name =
                    `${s.userInfo?.firstName || ""} ${s.userInfo?.lastName || ""}`.trim() ||
                    "Employee";
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/hrm/meal");
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50/60 transition-colors bg-blue-50/30"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-blue-700">
                            {name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            {name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Monthly subscription ·{" "}
                            {s.currentMonthPreference || s.preference}
                          </p>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                          pending
                        </span>
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {/* Profile Update Notifications (admin only) */}
            {isAdmin && profileNotifs.length > 0 && (
              <>
                <div className="px-4 py-1.5 bg-gray-50 flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Profile Updates
                  </span>
                  {pendingProfileCount > 0 && (
                    <span className="bg-gray-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">
                      {pendingProfileCount}
                    </span>
                  )}
                </div>
                {profileNotifs.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => {
                      setShowDropdown(false);
                      router.push("/hrm/notification");
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${n.status === "pending" ? "bg-amber-50/30" : ""}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-[#113F67]/10 rounded-full flex items-center justify-center shrink-0">
                        <User size={12} className="text-[#113F67]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {n.userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {formatTime(n.createdAt)}
                        </span>
                      </div>
                      {n.status === "pending" && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                          pending
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}

            {!hasAny &&
              pendingMeals.length === 0 &&
              pendingSubs.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-sm">
                  All clear — no notifications
                </div>
              )}
          </div>

          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button
              onClick={() => {
                setShowDropdown(false);
                router.push("/hrm/notification");
              }}
              className="text-xs text-[#113F67] hover:underline font-medium"
            >
              View all notifications →
            </button>
            {(pendingMeals.length > 0 || pendingSubs.length > 0) && (
              <button
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/hrm/meal");
                }}
                className="text-xs text-amber-600 hover:underline font-medium"
              >
                Go to Meal →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const noSidebarPages = [
    "/hrm",
    "/hrm/administration-login",
    "/hrm/register",
    "/hrm/forgot-password",
    "/hrm/reset-password",
  ];
  // `trailingSlash: true` in next.config.js means pathname can be "/hrm/".
  const cleanPath =
    pathname && pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;
  const showSidebar = !noSidebarPages.includes(cleanPath);

  useEffect(() => {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("employeeToken") ||
      localStorage.getItem("moderatorToken") ||
      localStorage.getItem("token");

    const isAuth = !!token;
    setIsAuthenticated(isAuth);

    if (!isAuth && showSidebar) {
      router.replace("/hrm/administration-login");
      return;
    }

    setIsLoading(false);
  }, [pathname, router, showSidebar]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!showSidebar) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-50">{children}</div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="h-screen shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="shrink-0 bg-white border-b border-gray-200 px-4 md:px-6 py-2 flex items-center justify-between md:justify-end gap-3 shadow-sm">
          {/* Logo — only on small devices (sidebar drawer is hidden there).
              Left margin clears the fixed hamburger button. */}
          <Link href="/hrm/profile" className="flex items-center gap-2">
            <img
              src="/A2ITLogo.png"
              alt="A2IT"
              className="h-5 w-auto ml-8 md:hidden -mt-2"
            />
          </Link>
          <NotificationBell />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 md:p-4 lg:p-6 min-h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
