"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Users,
  Shield,
  UserCog,
  Clock,
  Wallet,
  BarChart3,
  Menu,
  X,
  LogOut,
  Home,
  Settings,
  Calendar,
  Activity,
  CreditCard,
  User,
  Mail,
  Phone,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Building2,
  Briefcase,
  DollarSign,
  Cloud,
  Utensils,
  Car,
  MoreHorizontal,
  Filter,
  FileText,
  Eye,
  Award,
  Lock,
  Key,
  History,
  FileClock,
  TrendingUp,
  Zap,
  PieChart,
  Target,
  FileKey,
  CalendarClock,
  Logs,
  CopyMinus,
  Bell,
  Banknote,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

export default function sidebar() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [activeCollapsedSubmenu, setActiveCollapsedSubmenu] = useState(null);
  const sidebarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);
  // State for user data
  const [userData, setUserData] = useState({
    name: "Loading...",
    role: "employee",
    email: "example.longemailaddress@company.com",
    phone: "+880 1234 567890",
    employeeId: "EMP202400012345",
    picture: null,
    permissions: [],
    isSuperAdmin: false,
    moderatorLevel: "junior",
    canModerateUsers: false,
    canModerateContent: true,
    canViewReports: true,
    canManageReports: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setOpen(false);
        setCollapsed(false);
      } else {
        setOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check localStorage for collapsed preference
  useEffect(() => {
    if (!isMobile) {
      const savedCollapsed =
        localStorage.getItem("sidebarCollapsed") === "true";
      setCollapsed(savedCollapsed);
    }
  }, [isMobile]);

  // Save collapsed preference to localStorage
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebarCollapsed", collapsed.toString());
    }
  }, [collapsed, isMobile]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    if (isMobile) {
      setOpen(!open);
    } else {
      if (!collapsed) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
        setOpen(true);
      }
    }
  };

  // Toggle submenu function
  const toggleSubmenu = (menuName) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Get sidebar width - FIXED: Adjusted collapsed width to prevent horizontal scroll
  const getSidebarWidth = () => {
    if (isMobile) {
      return open ? "w-80" : "w-0";
    }

    if (collapsed) {
      return "w-24"; // Increased from w-20 to w-24 (96px) to prevent horizontal scroll
    }

    return open ? "w-64" : "w-0";
  };

  // Fetch user data from localStorage
  // ✅ পরিবর্তিত কোড
  useEffect(() => {
    const fetchUserData = () => {
      try {
        if (typeof window !== "undefined") {
          // Check cache expiry first
          const expiry = localStorage.getItem("cacheExpiry");
          if (expiry && Date.now() > parseInt(expiry)) {
            console.log("Cache expired, clearing authentication...");
            handleAutoLogout();
            return;
          }

          const adminData = localStorage.getItem("adminData");
          const employeeData = localStorage.getItem("employeeData");
          const moderatorData = localStorage.getItem("moderatorData");
          const userData = localStorage.getItem("userData");

          let userInfo = {
            name: "User",
            role: "employee",
            email: "",
            phone: "",
            employeeId: "",
            picture: null,
            permissions: [],
            isSuperAdmin: false,
            moderatorLevel: "junior",
            canModerateUsers: false,
            canModerateContent: true,
            canViewReports: true,
            canManageReports: false,
          };

          let parsedData = null;

          if (adminData) {
            try {
              parsedData = JSON.parse(adminData);
              userInfo.role = "admin";
            } catch (e) {
              console.error("Error parsing adminData:", e);
            }
          }

          if (!parsedData && moderatorData) {
            try {
              parsedData = JSON.parse(moderatorData);
              userInfo.role = "moderator";
            } catch (e) {
              console.error("Error parsing moderatorData:", e);
            }
          }

          if (!parsedData && employeeData) {
            try {
              parsedData = JSON.parse(employeeData);
              userInfo.role = "employee";
            } catch (e) {
              console.error("Error parsing employeeData:", e);
            }
          }

          if (!parsedData && userData) {
            try {
              parsedData = JSON.parse(userData);
            } catch (e) {
              console.error("Error parsing userData:", e);
            }
          }

          if (parsedData) {
            if (parsedData.name || parsedData.fullName || parsedData.username) {
              userInfo.name =
                parsedData.name || parsedData.fullName || parsedData.username;
            }

            userInfo = {
              ...userInfo,
              ...parsedData,
              role: parsedData.role || userInfo.role,
            };
          } else {
            const hasToken =
              localStorage.getItem("adminToken") ||
              localStorage.getItem("employeeToken") ||
              localStorage.getItem("moderatorToken") ||
              localStorage.getItem("authToken");

            if (hasToken) {
              console.warn("Token found but no user data in localStorage");
            } else {
              console.log("No authentication found, redirecting to login...");
              router.push("/hrm");
              return;
            }
          }

          console.log("Loaded user data:", userInfo);
          setUserData(userInfo);
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    const handleUserUpdate = () => fetchUserData();
    window.addEventListener("userDataUpdated", handleUserUpdate);

    // Load notification count — profile updates + pending meal requests
    const loadNotifCount = async () => {
      try {
        const token =
          localStorage.getItem("adminToken") ||
          localStorage.getItem("moderatorToken");
        if (!token) return;
        const base = process.env.NEXT_PUBLIC_HRM_API_URL;
        const hdr = { Authorization: `Bearer ${token}` };
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const [y, m] = month.split("-");
        const start = new Date(Number(y), Number(m) - 1, 1).toISOString();
        const end = new Date(Number(y), Number(m), 0, 23, 59, 59).toISOString();

        const [mealsRes, subsRes] = await Promise.all([
          fetch(`${base}/admin/meals/all?startDate=${start}&endDate=${end}`, {
            headers: hdr,
          })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
          fetch(`${base}/admin/subscriptions/all?limit=200&month=${month}`, {
            headers: hdr,
          })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null),
        ]);

        const pendingMeals = (mealsRes?.meals || mealsRes?.data || []).filter(
          (m) => m.status === "pending",
        ).length;
        const pendingSubs = (subsRes?.subscriptions || []).filter(
          (s) => s.currentMonthStatus === "pending",
        ).length;

        // profile notif count (admin only)
        let profilePending = 0;
        if (localStorage.getItem("adminToken")) {
          const profRes = await fetch(`${base}/notifications/count`, {
            headers: hdr,
          })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null);
          profilePending = profRes?.count || 0;
        }

        const newTotal = pendingMeals + pendingSubs + profilePending;
        const seen = parseInt(localStorage.getItem("notifSeenCount") || "0");
        setNotificationCount(Math.max(0, newTotal - seen));
      } catch {}
    };
    loadNotifCount();
    const notifPoll = setInterval(loadNotifCount, 30000);
    window.addEventListener("notifSeen", loadNotifCount);

    return () => {
      window.removeEventListener("userDataUpdated", handleUserUpdate);
      window.removeEventListener("notifSeen", loadNotifCount);
      clearInterval(notifPoll);
    };
  }, [router]);

  const isAdmin = userData?.role === "admin" || userData?.role === "superAdmin";
  const isModerator = userData?.role === "moderator";
  const isEmployee = userData?.role === "employee";
  const isSuperAdmin = userData?.isSuperAdmin;

  // Auto logout when cache expires
  const handleAutoLogout = () => {
    console.log("Auto logout triggered");

    // Clear only authentication data, keep other cache
    const keysToRemove = [
      "adminToken",
      "employeeToken",
      "moderatorToken",
      "authToken",
      "adminData",
      "employeeData",
      "moderatorData",
      "userData",
      "currentUserRole",
      "token",
      "auth_token",
      "refresh_token",
      "session_token",
      "cacheExpiry",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Keep these cache items: sidebarCollapsed, theme, language, etc.

    // Reset user data
    setUserData({
      name: "User",
      role: "employee",
      email: "",
      phone: "",
      employeeId: "",
      picture: null,
      permissions: [],
      isSuperAdmin: false,
      moderatorLevel: "junior",
      canModerateUsers: false,
      canModerateContent: true,
      canViewReports: true,
      canManageReports: false,
    });

    // Redirect to login
    router.push("/hrm");

    setTimeout(() => {
      window.location.href = "/hrm";
    }, 100);
  };

  // Common menus for all roles (ONLY Profile)
  const commonMenus = [
    {
      name: "Profile",
      icon: <User size={20} />,
      path: "/hrm/profile",
      roles: ["admin", "moderator", "employee"],
      showForAll: true,
    },
  ];

  // Employee specific menus
  const employeeMenus = [
    {
      name: "Attendance",
      icon: <Clock size={20} />,
      path: "/hrm/attendance",
      roles: ["employee"],
    },
    {
      name: "Leave Management",
      icon: <Calendar size={20} />,
      path: "/hrm/leave",
      roles: ["employee"],
    },
    {
      name: "Payroll",
      icon: <Wallet size={20} />,
      path: "/hrm/payroll",
      roles: ["employee"],
    },
    {
      name: "Office Schedule",
      icon: <Calendar size={20} />,
      path: "/hrm/officeSchedule",
      roles: ["employee"],
    },
    {
      name: "Holiday",
      icon: <Award size={20} />,
      path: "/hrm/holiday",
      roles: ["employee"],
    },
    {
      name: "Shift Schedule",
      icon: <CalendarClock size={20} />,
      path: "/hrm/shift-schedule",
      roles: ["employee"],
      showForAll: true,
    },
    {
      name: "Meal Management",
      icon: <Utensils size={20} />,
      path: "/hrm/meal",
      roles: ["employee"],
    },
    {
      name: "Task Management",
      icon: <ClipboardList size={20} />,
      path: "/hrm/task",
      roles: ["employee"],
    },
  ];

  // Moderator specific menus
  const moderatorMenus = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      path: "/hrm/moderatorDashboard",
      roles: ["moderator"],
    },
    {
      name: "Audit Logs",
      icon: <FileClock size={20} />,
      path: "/hrm/audit",
      roles: ["moderator"],
    },
    {
      name: "Task Management",
      icon: <ClipboardList size={20} />,
      path: "/hrm/task",
      roles: ["moderator"],
    },
  ];

  // Admin specific menus
  const adminMenus = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      path: "/hrm/dashboard",
      roles: ["admin"],
    },
    {
      name: "Attendance",
      icon: <Clock size={20} />,
      path: "/hrm/attendance",
      roles: ["admin"],
    },
    {
      name: "Leave Management",
      icon: <Calendar size={20} />,
      path: "/hrm/leave",
      roles: ["admin"],
    },
    {
      name: "Payroll",
      icon: <Wallet size={20} />,
      path: "/hrm/payroll",
      roles: ["admin"],
    },
    {
      name: "Office Schedule",
      icon: <Calendar size={20} />,
      path: "/hrm/officeSchedule",
      roles: ["admin"],
    },
    {
      name: "Holiday",
      icon: <Award size={20} />,
      path: "/hrm/holiday",
      roles: ["admin"],
    },
    {
      name: "Shift Schedule",
      icon: <CalendarClock size={20} />,
      path: "/hrm/shift-schedule",
      roles: ["admin"],
      showForAll: true,
    },
    {
      name: "Audit Logs",
      icon: <FileClock size={20} />,
      path: "/hrm/audit",
      roles: ["admin"],
    },
    {
      name: "User Roles",
      icon: <Shield size={20} />,
      path: "/hrm/user-roles",
      roles: ["admin"],
    },
    {
      name: "Task Management",
      icon: <ClipboardList size={20} />,
      path: "/hrm/task",
      roles: ["admin"],
    },
    {
      name: "Meal Management",
      icon: <Utensils size={20} />,
      path: "/hrm/meal",
      roles: ["admin"],
    },
    {
      name: "Notifications",
      icon: <Bell size={20} />,
      path: "/hrm/notification",
      roles: ["admin"],
      badge: notificationCount > 0 ? notificationCount : null,
    },
  ];

  // Cost Details Submenus (Only for Admin and Moderator)
  const costDetailsSubmenus = [
    {
      name: "Office Rent",
      icon: <Building2 size={18} />,
      href: "/hrm/officeRent",
      roles: ["admin", "moderator"],
    },
    {
      name: "Utility Bills",
      icon: <FileText size={18} />,
      href: "/hrm/utilityBills",
      roles: ["admin", "moderator"],
    },
    {
      name: "Office Supplies",
      icon: <Briefcase size={18} />,
      href: "/hrm/officeSupplies",
      roles: ["admin", "moderator"],
    },
    {
      name: "Software Subscriptions",
      icon: <Cloud size={18} />,
      href: "/hrm/subscriptions",
      roles: ["admin"],
    },
    {
      name: "Food Cost",
      icon: <Utensils size={18} />,
      href: "/hrm/foodCost",
      roles: ["admin", "moderator"],
    },
    {
      name: "Transport",
      icon: <Car size={18} />,
      href: "/hrm/transport",
      roles: ["admin", "moderator"],
    },
    {
      name: "Salary Management",
      icon: <Banknote size={18} />,
      href: "/hrm/salary-management",
      roles: ["admin"],
    },
    {
      name: "Cost Overview",
      icon: <LayoutDashboard size={18} />,
      href: "/hrm/cost-overview",
      roles: ["admin", "moderator"],
    },
  ];

  const getFilteredMenus = () => {
    let menus = [...commonMenus];

    if (isAdmin) {
      menus = [...menus, ...adminMenus];

      menus.push({
        name: "Cost Details",
        icon: <DollarSign size={20} />,
        path: "#",
        roles: ["admin"],
        hasSubmenu: true,
        submenus: costDetailsSubmenus.filter((submenu) =>
          submenu.roles.includes("admin"),
        ),
      });
    } else if (isModerator) {
      menus = [...menus, ...moderatorMenus];

      menus.push({
        name: "Cost Details",
        icon: <DollarSign size={20} />,
        path: "#",
        roles: ["moderator"],
        hasSubmenu: true,
        submenus: costDetailsSubmenus.filter((submenu) =>
          submenu.roles.includes("moderator"),
        ),
      });
    } else if (isEmployee) {
      menus = [...menus, ...employeeMenus];
    }

    return menus;
  };

  const filteredMenus = getFilteredMenus();

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(progress);
        setShowScrollTop(scrollTop > 100);
        setShowScrollBottom(scrollTop + clientHeight < scrollHeight - 100);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => sidebar.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToBottom = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({
        top: sidebarRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear auth data
      const authKeys = [
        "adminToken",
        "employeeToken",
        "moderatorToken",
        "authToken",
        "adminData",
        "employeeData",
        "moderatorData",
        "userData",
        "token",
        "auth_token",
        "refresh_token",
        "session_token",
      ];
      authKeys.forEach((key) => localStorage.removeItem(key));

      // ✅ এই event টি dispatch করুন - ClientLayout এ listen করবে
      window.dispatchEvent(new Event("authChange"));

      // ✅ তারপর redirect করুন
      router.push("/hrm");
    }
  };

  // Function to clear ALL cache (for development/testing)
  const clearAllCache = () => {
    if (
      confirm("Are you sure you want to clear ALL cache including preferences?")
    ) {
      localStorage.clear();
      sessionStorage.clear();
      console.log("All cache cleared");
      window.location.reload();
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, open]);

  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, open]);

  // FIXED: Changed from purple to white colors
  const getRoleBadgeColor = () => {
    if (isAdmin) return "bg-amber-500"; // Amber for admin
    if (isModerator) return "bg-blue-500"; // Blue for moderator
    return "bg-emerald-500"; // Emerald for employee
  };

  const getRoleTextColor = () => {
    return "text-white"; // Changed to white text for all roles
  };

  const getPanelTitle = () => {
    if (isAdmin) return "Admin Panel";
    if (isModerator) return "Moderator Panel";
    return "Employee Portal";
  };

  const getRoleIcon = () => {
    if (isAdmin) return <Shield size={12} />;
    if (isModerator) return <Filter size={12} />;
    return <User size={12} />;
  };

  if (isLoading) {
    return (
      <div className="relative h-screen flex flex-col bg-[#113F67] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>{" "}
        {/* Changed to white */}
        <p className="mt-4 text-white">Loading...</p>
      </div>
    );
  }
  if (userData.name === "Loading...") return null;
  const getToggleIcon = () => {
    if (isMobile) {
      return open ? <X size={24} /> : <Menu size={24} />;
    }

    if (collapsed) {
      return <Menu size={24} />;
    }

    return <CopyMinus size={24} />;
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const isSubmenuActive = (submenus) => {
    return submenus.some((submenu) => isActive(submenu.href));
  };

  return (
    <>
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-2 left-4 z-50   text-[#113F67]  transition-all"
        >
          <Menu size={24} />
        </button>
      )}

      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-40 transform" : "relative"} 
          ${isMobile ? (open ? "translate-x-0" : "-translate-x-full") : ""} 
          ${getSidebarWidth()}
          transition-all duration-300 ease-in-out
          h-screen flex flex-col bg-[#113F67]
          ${!isMobile ? "shadow-xl" : ""}
          overflow-x-hidden /* FIXED: Prevent horizontal scroll */
            ${collapsed ? "overflow-hidden" : "overflow-y-auto"}
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 sticky top-0 z-20 bg-[#113F67] backdrop-blur-sm border-b border-white/20">
          {" "}
          {/* Changed border opacity */}
          <div className="flex items-center justify-between px-4 py-4">
            {!collapsed && open && (
              <div className="flex items-center gap-3 min-w-0">
                {" "}
                {/* Added min-w-0 */}
                <div className="relative flex-shrink-0">
                  {" "}
                  {/* Added flex-shrink-0 */}
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <img
                      src="/A2ITLogo.png"
                      alt=""
                      className="max-w-full max-h-full"
                    />{" "}
                    {/* Added image constraints */}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  {" "}
                  {/* Added flex-1 */}
                  <h1 className="text-xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                    A2IT HRM
                  </h1>
                  <p className="text-xs text-white/70 whitespace-nowrap overflow-hidden text-ellipsis">
                    {" "}
                    {/* Changed to white/70 */}
                    {getPanelTitle()}
                  </p>
                </div>
              </div>
            )}

            {collapsed && open && (
              <div className="flex items-center justify-center w-full">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  {" "}
                  {/* Added flex-shrink-0 */}
                  <img
                    src="/A2ITLogo.png"
                    alt=""
                    className="max-w-full max-h-full"
                  />{" "}
                  {/* Added image constraints */}
                </div>
              </div>
            )}

            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg hover:bg-white/20 transition-colors text-white hover:text-white flex-shrink-0 ${
                /* Changed hover colors */
                collapsed && !isMobile ? "mx-auto" : ""
              }`}
            >
              {getToggleIcon()}
            </button>
          </div>
        </div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1); /* Changed to white */
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.5),
              rgba(255, 255, 255, 0.5)
            ); /* Changed to white */
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.8),
              rgba(255, 255, 255, 0.8)
            ); /* Changed to white */
          }
        `}</style>

        {/* Progress Bar */}
        <div className="h-1 bg-white/20 flex-shrink-0 relative overflow-hidden">
          {" "}
          {/* Changed background */}
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              width: `${scrollProgress}%`,
              background:
                "linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.8))" /* Changed to white */,
              opacity: scrollProgress > 0 ? 1 : 0,
              transform: `translateX(${scrollProgress > 0 ? 0 : "-100%"})`,
            }}
          />
          {scrollProgress > 0 && (
            <div
              className="absolute top-0 left-0 h-full w-24"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)" /* Changed to white */,
                transform: `translateX(${scrollProgress}%)`,
                transition: "transform 0.3s ease",
              }}
            />
          )}
        </div>

        {/* Role Badge */}
        {!collapsed && open && (
          <div className="px-4 py-2 flex-shrink-0">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getRoleBadgeColor()} ${getRoleTextColor()}`}
            >
              {getRoleIcon()}
              <span className="capitalize truncate max-w-[100px]">
                {userData?.role}
                {isSuperAdmin && " (Super)"}
                {isModerator &&
                  userData?.moderatorLevel &&
                  ` (${userData?.moderatorLevel})`}
              </span>
            </div>
          </div>
        )}

        {/* Scrollable Menu Container - FIXED: Added overflow-x-hidden */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <nav className={`py-4 ${collapsed ? "px-2" : "px-3"}`}>
            <div className="space-y-1">
              {filteredMenus.map((menu, index) => {
                const menuIsActive = isActive(menu.path);
                const isAdminMenu = menu.adminOnly;
                const isModeratorMenu = menu.moderatorOnly;
                const hasSubmenu = menu.hasSubmenu;
                const submenuIsOpen = openSubmenus[menu.name] || false;
                const anySubmenuActive =
                  hasSubmenu && isSubmenuActive(menu.submenus || []);

                if (collapsed) {
                  return (
                    <div key={index} className="flex justify-center">
                      {hasSubmenu ? (
                        <div className="mb-1 w-full flex justify-center">
                          <button
                            onClick={() => toggleSubmenu(menu.name)}
                            className={`group relative flex items-center justify-center rounded-xl p-3 w-full max-w-[3.5rem] transition-all duration-200 ${
                              menuIsActive || anySubmenuActive
                                ? "bg-white/30"
                                : "hover:bg-white/20"
                            }`}
                            title={menu.name}
                          >
                            {(menuIsActive || anySubmenuActive) && (
                              <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-white rounded-r-full"></div>
                            )}

                            <div
                              className={`p-2 rounded-lg ${
                                menuIsActive || anySubmenuActive
                                  ? "bg-white text-[#113F67]"
                                  : "bg-white/20 text-white group-hover:bg-white/30 group-hover:text-white"
                              }`}
                            >
                              {menu.icon}
                            </div>

                            {/* <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                              {menu.name}
                              {isAdminMenu && <span className="ml-1 text-amber-300">(Admin)</span>}
                              {isModeratorMenu && <span className="ml-1 text-blue-300">(Moderator)</span>}
                            </div> */}
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={menu.path}
                          key={index}
                          onClick={handleLinkClick}
                          className="w-full flex justify-center" /* Added flex justify-center */
                        >
                          <div
                            className={`group relative flex items-center justify-center rounded-xl p-3 w-full max-w-[3.5rem] transition-all duration-200 mb-1 ${
                              /* Added max-w */
                              menuIsActive
                                ? "bg-white/30" /* Changed to white */
                                : "hover:bg-white/20" /* Changed to white */
                            }`}
                            title={menu.name}
                          >
                            {menuIsActive && (
                              <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-white rounded-r-full"></div> /* Changed to white */
                            )}

                            <div
                              className={`p-2 rounded-lg ${
                                menuIsActive
                                  ? "bg-white text-[#113F67]" /* Changed to white with dark text */
                                  : "bg-white/20 text-white group-hover:bg-white/30 group-hover:text-white" /* Changed to white */
                              }`}
                            >
                              {menu.icon}
                            </div>

                            {/* <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                              {menu.name}
                              {isAdminMenu && <span className="ml-1 text-amber-300">(Admin)</span>}
                              {isModeratorMenu && <span className="ml-1 text-blue-300">(Moderator)</span>}
                            </div> */}
                          </div>
                        </Link>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={index}>
                      {hasSubmenu ? (
                        <div className="mb-1">
                          <button
                            onClick={() => toggleSubmenu(menu.name)}
                            className={`group relative flex items-center justify-between w-full rounded-xl px-3 py-3 transition-all duration-200 ${
                              menuIsActive || anySubmenuActive || submenuIsOpen
                                ? "bg-white/30 border-l-4 border-white" /* Changed to white */
                                : "hover:bg-white/20 hover:border-l-4 hover:border-white/50" /* Changed to white */
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {" "}
                              {/* Added flex-1 */}
                              <div
                                className={`p-2 rounded-lg flex-shrink-0 ${
                                  menuIsActive ||
                                  anySubmenuActive ||
                                  submenuIsOpen
                                    ? "bg-white text-[#113F67]" /* Changed to white with dark text */
                                    : "bg-white/20 text-white group-hover:bg-white/30 group-hover:text-white" /* Changed to white */
                                }`}
                              >
                                {menu.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className={`text-sm font-medium truncate ${
                                      menuIsActive ||
                                      anySubmenuActive ||
                                      submenuIsOpen
                                        ? "text-white"
                                        : "text-white/80 group-hover:text-white" /* Changed to white */
                                    }`}
                                  >
                                    {menu.name}
                                  </span>
                                  {isAdminMenu && (
                                    <span className="text-xs px-1.5 py-0.5 bg-amber-500/30 text-amber-300 rounded flex-shrink-0">
                                      Admin
                                    </span>
                                  )}
                                  {isModeratorMenu && (
                                    <span className="text-xs px-1.5 py-0.5 bg-blue-500/30 text-blue-300 rounded flex-shrink-0">
                                      Moderator
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <ChevronRight
                              size={16}
                              className={`transform transition-transform duration-200 flex-shrink-0 ${
                                submenuIsOpen ? "rotate-90" : ""
                              } ${menuIsActive || anySubmenuActive ? "text-white" : "text-white/60"}`} /* Changed to white */
                            />
                          </button>

                          {submenuIsOpen && (
                            <div className="ml-6 mt-1 space-y-1 border-l border-white/30 pl-2">
                              {" "}
                              {/* Changed to white */}
                              {menu.submenus?.map((submenu, subIndex) => (
                                <Link
                                  href={submenu.href}
                                  key={subIndex}
                                  onClick={handleLinkClick}
                                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                                    isActive(submenu.href)
                                      ? "bg-white/20 border-l-2 border-white" /* Changed to white */
                                      : "hover:bg-white/10" /* Changed to white */
                                  }`}
                                >
                                  <div
                                    className={`p-1.5 rounded-lg flex-shrink-0 ${
                                      isActive(submenu.href)
                                        ? "bg-white text-[#113F67]" /* Changed to white with dark text */
                                        : "bg-white/20 text-white group-hover:bg-white/30 group-hover:text-white" /* Changed to white */
                                    }`}
                                  >
                                    {submenu.icon}
                                  </div>
                                  <span
                                    className={`text-sm truncate ${
                                      isActive(submenu.href)
                                        ? "text-white font-medium"
                                        : "text-white/80"
                                    }`}
                                  >
                                    {submenu.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={menu.path}
                          key={index}
                          onClick={handleLinkClick}
                        >
                          <div
                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 mb-1 ${
                              menuIsActive
                                ? "bg-white/30 border-l-4 border-white" /* Changed to white */
                                : "hover:bg-white/20 hover:border-l-4 hover:border-white/50" /* Changed to white */
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 ${
                                menuIsActive
                                  ? "bg-white text-[#113F67]" /* Changed to white with dark text */
                                  : "bg-white/20 text-white group-hover:bg-white/30 group-hover:text-white" /* Changed to white */
                              }`}
                            >
                              {menu.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`text-sm font-medium truncate ${
                                    menuIsActive
                                      ? "text-white"
                                      : "text-white/80 group-hover:text-white" /* Changed to white */
                                  }`}
                                >
                                  {menu.name}
                                </span>
                                {isAdminMenu && (
                                  <span className="text-xs px-1.5 py-0.5 bg-amber-500/30 text-amber-300 rounded flex-shrink-0">
                                    Admin
                                  </span>
                                )}
                                {isModeratorMenu && (
                                  <span className="text-xs px-1.5 py-0.5 bg-blue-500/30 text-blue-300 rounded flex-shrink-0">
                                    Moderator
                                  </span>
                                )}
                                {menu.badge && (
                                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shrink-0">
                                    {menu.badge > 9 ? "9+" : menu.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  );
                }
              })}
            </div>

            {!collapsed && (
              <div className="my-6 mx-3 border-t border-white/20"></div>
            )}

            {/* User Profile Card - FIXED for long names */}
            {!collapsed && open && (
              <div className="px-3 mb-6">
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {userData?.picture ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                            <img
                              src={userData?.picture}
                              alt={userData?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-white/80 to-white text-[#113F67] rounded-full flex items-center justify-center">
                            {" "}
                            {/* Changed to white */}
                            <span className="font-bold text-lg">
                              {userData?.name
                                ? userData.name.charAt(0).toUpperCase()
                                : "?"}
                            </span>
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${
                            isAdmin
                              ? "bg-amber-500"
                              : isModerator
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                          } rounded-full border-2 border-[#113F67]`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white break-words leading-snug">
                        {userData?.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()} ${getRoleTextColor()} whitespace-nowrap`}
                        >
                          {userData?.role}
                          {isModerator &&
                            userData?.moderatorLevel &&
                            ` • ${userData?.moderatorLevel}`}
                        </span>
                        {userData?.employeeId && (
                          <span className="text-xs text-white/60 truncate max-w-full">
                            ID: {userData?.employeeId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {(userData?.email || userData?.phone) && (
                    <div className="space-y-2 border-t border-white/20 pt-3">
                      {" "}
                      {/* Changed to white */}
                      {userData?.email && (
                        <div className="flex items-start gap-2 text-sm">
                          <Mail
                            size={14}
                            className="text-white/60 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-white/80 break-all leading-snug">
                            {userData?.email}
                          </span>
                        </div>
                      )}
                      {userData?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone
                            size={14}
                            className="text-white/60 flex-shrink-0"
                          />
                          <span className="text-white/80 break-all">
                            {userData?.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>
        </div>

        {!collapsed && open && !isMobile && (
          <>
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="absolute right-2 top-1/3 transform -translate-y-1/2 p-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white hover:text-white hover:bg-white/30 transition-all shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 z-30 border border-white/30" /* Changed to white */
                style={{
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <ChevronUp size={20} />
              </button>
            )}

            {showScrollBottom && (
              <button
                onClick={scrollToBottom}
                className="absolute right-2 bottom-1/3 transform translate-y-1/2 p-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white hover:text-white hover:bg-white/30 transition-all shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 z-30 border border-white/30" /* Changed to white */
                style={{
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <ChevronDown size={20} />
              </button>
            )}
          </>
        )}

        {/* Footer - FIXED for long names */}
        <div className="flex-shrink-0 sticky bottom-0 z-20 bg-[#113F67] border-t border-white/20">
          {" "}
          {/* Changed to white */}
          <div className={`${collapsed ? "p-2" : "p-3"}`}>
            {collapsed ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {userData?.picture ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
                      <img
                        src={userData?.picture}
                        alt={userData?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-white/80 to-white text-[#113F67] rounded-full flex items-center justify-center">
                      {" "}
                      {/* Changed to white */}
                      <span className="font-bold">
                        {userData?.name
                          ? userData.name.charAt(0).toUpperCase()
                          : "?"}
                      </span>
                    </div>
                  )}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                      isAdmin
                        ? "bg-amber-500"
                        : isModerator
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                    } rounded-full border-2 border-[#113F67]`}
                  ></div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-red-500/80 text-red-300 hover:text-white hover:bg-red-500 rounded-xl border border-red-500/30 transition-all duration-200 hover:scale-110 active:scale-95 group relative"
                  title="Logout "
                >
                  <LogOut size={18} />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Logout
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {" "}
                    {/* Added flex-1 */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {userData?.picture ? (
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-white">
                            <img
                              src={userData?.picture}
                              alt={userData?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 bg-gradient-to-r from-white/80 to-white text-[#113F67] rounded-full flex items-center justify-center">
                            {" "}
                            {/* Changed to white */}
                            <span className="font-bold text-sm">
                              {userData?.name
                                ? userData.name.charAt(0).toUpperCase()
                                : "?"}
                            </span>
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${
                            isAdmin
                              ? "bg-amber-500"
                              : isModerator
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                          } rounded-full border-2 border-[#113F67]`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white break-words leading-snug">
                        {userData?.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        <p className="text-xs text-white/70 capitalize truncate max-w-full">
                          {userData?.role}
                          {isModerator &&
                            userData?.moderatorLevel &&
                            ` • ${userData?.moderatorLevel}`}
                        </p>
                        {userData?.employeeId && (
                          <span className="text-xs text-white/50 truncate max-w-full">
                            • {userData?.employeeId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <UserCheck
                    size={16}
                    className="text-white/60 flex-shrink-0 mt-1"
                  />{" "}
                  {/* Changed to white */}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/80 text-red-300 hover:text-white hover:bg-red-500 rounded-xl border border-red-500/30 transition-all duration-200 group hover:scale-[1.02] active:scale-[0.98] relative cursor-pointer"
                  title="Logout (Cache will be preserved)"
                >
                  <LogOut
                    size={18}
                    className="group-hover:rotate-180 transition-transform duration-300"
                  />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global CSS for text overflow */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        /* Prevent horizontal scroll in sidebar */
        .sidebar-container * {
          max-width: 100%;
          box-sizing: border-box;
        }
        
        /* Text overflow handling */
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .break-words {
          overflow-wrap: break-word;
          word-wrap: break-word;
          hyphens: auto;
        }
        
        .break-all {
          word-break: break-all;
        }
        
        .leading-snug {
          line-height: 1.375;
        }
        
        /* Custom scrollbar for sidebar content */
        .sidebar-content {
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
        }
        
        .sidebar-content::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar-content::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3); /* Changed to white */
          border-radius: 4px;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5); /* Changed to white */
        }
      `}</style>
    </>
  );
}
