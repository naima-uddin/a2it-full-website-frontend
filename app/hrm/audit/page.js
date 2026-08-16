"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Trash2,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  BarChart3,
  Users,
  Activity,
  ChevronDown,
  ChevronRight,
  FileText,
  Printer,
  UserCheck,
  Key,
  Database,
  LogIn,
  LogOut,
  Edit,
  Settings,
  Bell,
  AlertTriangle,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  Wifi,
  MapPin,
  Loader2,
  Copy,
  ShieldAlert,
  History,
  TrendingUp,
  ShieldCheck,
  FileWarning,
  Timer,
  Server,
  HardDrive,
  Network,
  Mail,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

// approve or rejectongoing

export default function page() {
  const router = useRouter();

  // State
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // User authentication state
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // privileged viewer (admin/superAdmin/moderator)
  const [canDelete, setCanDelete] = useState(false); // admin/superAdmin only
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    action: "",
    userId: "",
    startDate: "",
    endDate: "",
    ipAddress: "",
    deviceType: "",
  });

  // Time state for real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-BD", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // ================== Helper Functions ==================
  const getToken = () => {
    if (typeof window === "undefined") return null;

    const adminToken = localStorage.getItem("adminToken");
    const moderatorToken = localStorage.getItem("moderatorToken");
    const employeeToken = localStorage.getItem("employeeToken");
    const adminData = localStorage.getItem("adminData");

    if (adminToken) {
      let isSuperAdmin = false;
      try {
        const parsed = adminData ? JSON.parse(adminData) : null;
        isSuperAdmin = parsed?.role === "superAdmin";
      } catch {}
      return {
        token: adminToken,
        type: isSuperAdmin ? "superAdmin" : "admin",
        isAdmin: true,
        isSuperAdmin,
        isModerator: false,
        canViewAll: true, // can view all system logs
        canDelete: true, // can delete logs (admin/superAdmin only)
      };
    }

    // Moderator: can view all logs like admin, but cannot delete
    if (moderatorToken) {
      return {
        token: moderatorToken,
        type: "moderator",
        isAdmin: false,
        isSuperAdmin: false,
        isModerator: true,
        canViewAll: true,
        canDelete: false,
      };
    }

    if (employeeToken) {
      return {
        token: employeeToken,
        type: "employee",
        isAdmin: false,
        isSuperAdmin: false,
        isModerator: false,
        canViewAll: false,
        canDelete: false,
      };
    }

    return null;
  };

  // Derive user profile from the stored token/session (no non-existent API call)
  const fetchUserProfile = async () => {
    try {
      const tokenInfo = getToken();

      if (!tokenInfo || !tokenInfo.token) {
        toast.error("Please login first");
        router.push("/hrm");
        return null;
      }

      // Stored login payload keyed by role
      const dataKey =
        tokenInfo.type === "employee"
          ? "employeeData"
          : tokenInfo.type === "moderator"
            ? "moderatorData"
            : "adminData";
      const rawData = localStorage.getItem(dataKey);

      let userData = null;
      try {
        userData = rawData ? JSON.parse(rawData) : null;
      } catch {
        userData = null;
      }

      return {
        // 'superAdmin' | 'admin' | 'moderator' | 'employee' — real role for badges
        role: tokenInfo.type,
        // "privileged viewer" — admin/superAdmin/moderator can see all logs
        isAdmin: tokenInfo.canViewAll,
        canDelete: tokenInfo.canDelete,
        userData,
        userId: userData?._id || userData?.id || null,
      };
    } catch (error) {
      console.error("Error deriving user profile:", error);
      return null;
    }
  };

  // ================== Fetch Audit Logs ==================
  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const tokenInfo = getToken();

      if (!tokenInfo || !tokenInfo.token) {
        router.push("/hrm");
        return;
      }

      console.log("👤 User type:", tokenInfo.type);
      console.log("⭐ Is Super Admin:", tokenInfo.isSuperAdmin);

      const headers = {
        Authorization: `Bearer ${tokenInfo.token}`,
        "Content-Type": "application/json",
      };

      let endpoint = "";

      // Privileged (admin/superAdmin/moderator) viewing a specific user's logs
      if (tokenInfo.canViewAll && viewMode === "all" && filters.userId) {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/admin/getAllAudits/${filters.userId}?page=${currentPage}&limit=20`;
      }
      // Privileged viewing ALL system logs
      else if (tokenInfo.canViewAll && viewMode === "all") {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/admin/getAllAudits?page=${currentPage}&limit=20`;
      }
      // Everyone else ("My Logs" view) → personal logs
      else {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/user/my-logs?page=${currentPage}&limit=20`;
      }

      console.log("📡 Fetching from:", endpoint);

      const response = await fetch(endpoint, { headers });

      if (response.status === 403 && tokenInfo.isSuperAdmin) {
        // Super Admin হলেও permission না থাকলে
        toast.error("Super Admin permission issue. Using personal logs.");
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/user/my-logs?page=${currentPage}&limit=20`;
        const retryResponse = await fetch(endpoint, { headers });
        const retryData = await retryResponse.json();
        if (retryResponse.ok && retryData.success) {
          setLogs(retryData.data || []);
          setTotalPages(retryData.pagination?.pages || 1);
          setTotalLogs(
            retryData.pagination?.total || retryData.data?.length || 0,
          );
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setLogs(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalLogs(data.pagination?.total || data.data?.length || 0);

        // Success message based on role
        if (tokenInfo.isSuperAdmin && viewMode === "all") {
          toast.success(
            `Super Admin: Loaded all ${data.data?.length || 0} logs`,
            { duration: 2000 },
          );
        } else {
          toast.success(`Loaded ${data.data?.length || 0} logs`, {
            duration: 2000,
          });
        }
      } else {
        toast.error(data.message || "Failed to fetch logs");
        setLogs([]);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error("Failed to load audit logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters.userId, viewMode, router]);

  // ================== Fetch Audit Stats ==================
  const fetchAuditStats = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HRM_API_URL}/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          // Use mock stats if API not implemented
          setStats({
            totalLogs: 0,
            todaysLogs: 0,
            topActions: [],
            topUsers: [],
          });
        }
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
      // Set default stats
      setStats({
        totalLogs: 0,
        todaysLogs: 0,
        topActions: [],
        topUsers: [],
      });
    }
  }, [isAdmin]);

  // ================== Initialize Data ==================
  const initializeData = useCallback(async () => {
    setLoading(true);
    try {
      const roleInfo = await fetchUserProfile();

      if (roleInfo) {
        // Employees have no access to audit logs — send them away
        if (!roleInfo.isAdmin) {
          toast.error("Access denied. Audit logs are for admins only.");
          router.replace("/hrm/profile");
          return;
        }

        setUserRole(roleInfo.role);
        setIsAdmin(roleInfo.isAdmin);
        setCanDelete(roleInfo.canDelete);
        setUserData(roleInfo.userData);
        setUserId(roleInfo.userId);

        await fetchAuditLogs();
        await fetchAuditStats();
      }
    } catch (error) {
      console.error("Initialize data error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [fetchAuditLogs, fetchAuditStats]);

  // ================== Event Handlers ==================
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchAuditLogs();
      if (isAdmin) await fetchAuditStats();
      toast.success("Data refreshed successfully", {
        icon: "🔄",
        style: {
          borderRadius: "10px",
          background: "#363636",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAuditLogs();
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      action: "",
      userId: "",
      startDate: "",
      endDate: "",
      ipAddress: "",
      deviceType: "",
    });
    setCurrentPage(1);
    fetchAuditLogs();
  };

  const viewLogDetails = (log) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const deleteLog = async (logId) => {
    // টোকেন তথ্য নিন
    const tokenInfo = getToken();

    // চেক করুন ইউজার অথেনটিকেটেড কিনা
    if (!tokenInfo || !tokenInfo.token) {
      toast.error("Authentication required");
      return;
    }

    // চেক করুন ইউজার Admin বা SuperAdmin কিনা
    if (!tokenInfo.canDelete) {
      toast.error("Only admins can delete logs");
      return;
    }

    // কনফার্মেশন ডায়ালগ - Admin/SuperAdmin উভয়ের জন্যই দেখাবে
    if (
      !confirm(
        "⚠️ Are you sure you want to delete this audit log? This action cannot be undone.",
      )
    ) {
      return;
    }

    // লোডিং টোস্ট
    const loadingToast = toast.loading("Deleting audit log...");

    try {
      console.log("🗑️ Deleting log:", logId);
      console.log("👤 User type:", tokenInfo.type);
      console.log("⭐ Is SuperAdmin:", tokenInfo.isSuperAdmin);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HRM_API_URL}/admin/AuditDelete/${logId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenInfo.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok && data.success) {
        // সাকসেস মেসেজ
        toast.success(
          <div>
            <div className="font-bold">✓ Audit Log Deleted</div>
            <div className="text-xs mt-1">
              {tokenInfo.isSuperAdmin ? "Super Admin" : "Admin"} action
              completed
            </div>
          </div>,
          {
            icon: "🗑️",
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#10B981",
              color: "#fff",
            },
          },
        );

        // লগ রিফ্রেশ করুন
        await fetchAuditLogs();
        if (tokenInfo.canViewAll) {
          await fetchAuditStats();
        }

        // মোডাল বন্ধ করুন যদি খোলা থাকে
        if (showDetails && selectedLog?._id === logId) {
          setShowDetails(false);
          setSelectedLog(null);
        }
      } else if (response.status === 403) {
        // পারমিশন ডিনাইড
        toast.error(
          <div>
            <div className="font-bold">❌ Permission Denied</div>
            <div className="text-xs mt-1">
              {data.message || "You don't have permission to delete this log"}
            </div>
          </div>,
          {
            duration: 4000,
            icon: "🔒",
          },
        );
      } else {
        // অন্য কোন এরর
        toast.error(data.message || "Failed to delete log", {
          icon: "❌",
          duration: 3000,
        });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("❌ Delete log error:", err);
      toast.error("Failed to delete audit log", {
        icon: "❌",
        duration: 3000,
      });
    }
  };

  const exportLogs = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      let endpoint = "";
      if (isAdmin && viewMode === "all") {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/admin/audit/export`;
      } else {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/audit/export`;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success("Logs exported successfully", {
          icon: "📥",
          style: {
            borderRadius: "10px",
            background: "#10B981",
            color: "#fff",
          },
        });
      } else {
        const data = await response.json();
        toast.error(data.message || "Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export feature is coming soon!", {
        icon: "📊",
        style: {
          borderRadius: "10px",
          background: "#8B5CF6",
          color: "#fff",
        },
      });
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      icon: "📋",
      style: {
        borderRadius: "10px",
        background: "#3B82F6",
        color: "#fff",
      },
    });
  };

  // ================== Test Functions ==================
  const testAuditLog = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HRM_API_URL}/audit/test-audit`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Test logs created successfully! Check the list.", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#10B981",
            color: "#fff",
          },
        });
        // Refresh logs after test
        setTimeout(() => fetchAuditLogs(), 1000);
      } else {
        toast.error("Test failed: " + data.message);
      }
    } catch (error) {
      console.error("Test error:", error);
      toast.error("Test failed. Check console for details.");
    }
  };

  // Initialize on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // ================== UI Helper Functions ==================
  const getActionIcon = (action) => {
    if (!action) return <Activity className="w-5 h-5 text-gray-400" />;

    const actionLower = action.toLowerCase();

    if (actionLower.includes("login"))
      return <LogIn className="w-5 h-5 text-green-500" />;
    if (actionLower.includes("logout"))
      return <LogOut className="w-5 h-5 text-red-500" />;
    if (actionLower.includes("create"))
      return <UserCheck className="w-5 h-5 text-blue-500" />;
    if (actionLower.includes("delete"))
      return <Trash2 className="w-5 h-5 text-red-500" />;
    if (actionLower.includes("update") || actionLower.includes("edit"))
      return <Edit className="w-5 h-5 text-yellow-500" />;
    if (actionLower.includes("password"))
      return <Key className="w-5 h-5 text-purple-500" />;
    if (actionLower.includes("role") || actionLower.includes("permission"))
      return <Shield className="w-5 h-5 text-indigo-500" />;
    if (actionLower.includes("view") || actionLower.includes("read"))
      return <Eye className="w-5 h-5 text-gray-500" />;
    if (actionLower.includes("export") || actionLower.includes("download"))
      return <Download className="w-5 h-5 text-teal-500" />;
    if (actionLower.includes("settings"))
      return <Settings className="w-5 h-5 text-gray-500" />;
    if (actionLower.includes("notification"))
      return <Bell className="w-5 h-5 text-[#113F67]" />;
    if (actionLower.includes("error") || actionLower.includes("failed"))
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (actionLower.includes("security"))
      return <ShieldAlert className="w-5 h-5 text-orange-500" />;

    return <Activity className="w-5 h-5 text-gray-400" />;
  };

  const getActionColor = (action) => {
    if (!action) return "bg-gray-50 text-gray-700 border-gray-100";

    const actionLower = action.toLowerCase();

    if (actionLower.includes("login"))
      return "bg-green-50 text-green-700 border-green-100";
    if (actionLower.includes("logout"))
      return "bg-red-50 text-red-700 border-red-100";
    if (actionLower.includes("create"))
      return "bg-blue-50 text-blue-700 border-blue-100";
    if (actionLower.includes("delete"))
      return "bg-red-50 text-red-700 border-red-100";
    if (actionLower.includes("update") || actionLower.includes("edit"))
      return "bg-yellow-50 text-yellow-700 border-yellow-100";
    if (actionLower.includes("password"))
      return "bg-purple-50 text-purple-700 border-purple-100";
    if (actionLower.includes("role") || actionLower.includes("permission"))
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    if (actionLower.includes("security"))
      return "bg-orange-50 text-orange-700 border-orange-100";

    return "bg-gray-50 text-gray-700 border-gray-100";
  };

  // Parse a raw user-agent string into readable browser / OS / device type.
  // Audit logs store the raw UA in `log.device`, so we derive the rest from it.
  const parseUserAgent = (ua) => {
    if (!ua || typeof ua !== "string" || ua.toLowerCase() === "unknown") {
      return { browser: null, os: null, deviceType: null };
    }
    const s = ua;

    // Browser (order matters — Edge/Opera masquerade as Chrome)
    let browser = null;
    if (/edg/i.test(s)) browser = "Edge";
    else if (/opr|opera/i.test(s)) browser = "Opera";
    else if (/brave/i.test(s)) browser = "Brave";
    else if (/samsungbrowser/i.test(s)) browser = "Samsung Internet";
    else if (/chrome|crios/i.test(s)) browser = "Chrome";
    else if (/firefox|fxios/i.test(s)) browser = "Firefox";
    else if (/safari/i.test(s)) browser = "Safari";
    else if (/msie|trident/i.test(s)) browser = "Internet Explorer";

    // OS
    let os = null;
    if (/windows nt 10/i.test(s)) os = "Windows 10/11";
    else if (/windows/i.test(s)) os = "Windows";
    else if (/android/i.test(s)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(s)) os = "iOS";
    else if (/mac os x|macintosh/i.test(s)) os = "macOS";
    else if (/linux/i.test(s)) os = "Linux";

    // Device type
    let deviceType = "desktop";
    if (/bot|crawler|spider/i.test(s)) deviceType = "bot";
    else if (/ipad|tablet/i.test(s)) deviceType = "tablet";
    else if (/mobile|iphone|android/i.test(s)) deviceType = "mobile";

    return { browser, os, deviceType };
  };

  // Human-readable location that tolerates both a plain string and an object
  const getLocationDisplay = (log) => {
    const loc = log?.location;
    if (!loc) return "Unknown";
    if (typeof loc === "string") {
      return loc.toLowerCase() === "unknown" ? "Unknown" : loc;
    }
    if (typeof loc === "object") {
      const parts = [loc.city, loc.region, loc.country].filter(
        (p) => p && String(p).toLowerCase() !== "unknown",
      );
      return parts.length ? parts.join(", ") : "Unknown";
    }
    return "Unknown";
  };

  // Improved device display functions
  const getDeviceDisplay = (log) => {
    if (!log) return "Unknown Device";

    const parsed = parseUserAgent(log.device);
    const type =
      log.deviceType && log.deviceType !== "unknown"
        ? log.deviceType
        : parsed.deviceType;

    const typeMap = {
      mobile: "Mobile Phone",
      tablet: "Tablet",
      desktop: "Desktop/Laptop",
      bot: "Bot/Crawler",
    };

    if (type && typeMap[type]) return typeMap[type];
    if (parsed.os) return `${parsed.os} Device`;
    if (log.os && log.os !== "Unknown") return `${log.os} Device`;

    return "Unknown Device";
  };

  const getBrowserDisplay = (log) => {
    if (!log) return "Unknown Browser";

    if (log.browser && log.browser !== "Unknown") {
      if (log.browserVersion && log.browserVersion !== "Unknown") {
        return `${log.browser} ${log.browserVersion}`;
      }
      return log.browser;
    }

    return parseUserAgent(log.device).browser || "Unknown Browser";
  };

  const getOSDisplay = (log) => {
    if (!log) return "Unknown OS";

    if (log.os && log.os !== "Unknown") {
      if (log.osVersion && log.osVersion !== "Unknown") {
        return `${log.os} ${log.osVersion}`;
      }
      return log.os;
    }

    return parseUserAgent(log.device).os || "Unknown OS";
  };

  const getDeviceIcon = (device, deviceType) => {
    const deviceLower = (device || "").toLowerCase();
    const typeLower = (deviceType || "").toLowerCase();

    if (
      deviceLower.includes("iphone") ||
      deviceLower.includes("mobile") ||
      deviceLower.includes("android") ||
      deviceLower.includes("phone") ||
      typeLower === "mobile"
    ) {
      return <Smartphone className="w-4 h-4 text-blue-500" />;
    }
    if (
      deviceLower.includes("ipad") ||
      deviceLower.includes("tablet") ||
      typeLower === "tablet"
    ) {
      return <Tablet className="w-4 h-4 text-purple-500" />;
    }
    if (
      deviceLower.includes("mac") ||
      deviceLower.includes("windows") ||
      deviceLower.includes("desktop") ||
      deviceLower.includes("laptop") ||
      typeLower === "desktop"
    ) {
      return <Laptop className="w-4 h-4 text-green-500" />;
    }
    if (deviceLower.includes("bot") || typeLower === "bot") {
      return <Globe className="w-4 h-4 text-gray-500" />;
    }
    return <Smartphone className="w-4 h-4 text-gray-400" />;
  };

  const getBrowserIcon = (browser) => {
    if (!browser) return <Globe className="w-4 h-4 text-gray-400" />;

    const browserLower = browser.toLowerCase();
    if (browserLower.includes("chrome")) {
      return <Globe className="w-4 h-4 text-green-500" />;
    }
    if (browserLower.includes("firefox")) {
      return <Globe className="w-4 h-4 text-orange-500" />;
    }
    if (browserLower.includes("safari")) {
      return <Globe className="w-4 h-4 text-blue-500" />;
    }
    if (browserLower.includes("edge")) {
      return <Globe className="w-4 h-4 text-indigo-500" />;
    }
    if (browserLower.includes("opera")) {
      return <Globe className="w-4 h-4 text-red-500" />;
    }
    if (browserLower.includes("brave")) {
      return <Globe className="w-4 h-4 text-yellow-500" />;
    }
    return <Globe className="w-4 h-4 text-gray-400" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-BD", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const timeAgo = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      if (seconds < 60) return "just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}d ago`;
      const weeks = Math.floor(days / 7);
      if (weeks < 4) return `${weeks}w ago`;
      return formatDate(dateString);
    } catch (error) {
      return "Invalid time";
    }
  };

  const getSeverityBadge = (action) => {
    if (!action) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
          Unknown
        </span>
      );
    }

    const actionLower = action.toLowerCase();

    if (
      actionLower.includes("delete") ||
      actionLower.includes("security") ||
      actionLower.includes("error")
    ) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          High
        </span>
      );
    }
    if (
      actionLower.includes("update") ||
      actionLower.includes("password") ||
      actionLower.includes("role")
    ) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
          Medium
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
        Low
      </span>
    );
  };

  const safeString = (str, fallback = "-") => {
    if (str === undefined || str === null) return fallback;
    if (typeof str === "string" && str.trim() === "") return fallback;
    if (typeof str === "string" && str.toLowerCase() === "unknown")
      return fallback;
    if (typeof str === "object") {
      try {
        return JSON.stringify(str).substring(0, 80) + "...";
      } catch {
        return "Object";
      }
    }
    return String(str);
  };

  // ================== Human-readable "details" rendering ==================
  const isPlainObject = (v) => v && typeof v === "object" && !Array.isArray(v);

  // "oldData" -> "Old Data", "employeeId" -> "Employee Id"
  const formatFieldName = (key) =>
    String(key)
      .replace(/_/g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/^./, (c) => c.toUpperCase());

  const prettyValue = (v) => {
    if (v === null || v === undefined || v === "") return "—";
    if (typeof v === "boolean") return v ? "Yes" : "No";
    if (Array.isArray(v))
      return v.length ? `${v.length} item${v.length > 1 ? "s" : ""}` : "—";
    const str = String(v);
    // ISO date string -> friendly date
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:/.test(str)) return formatDate(str);
    // Very long values (image URLs, tokens, base64) -> truncate
    if (str.length > 70) return str.slice(0, 70) + "…";
    return str;
  };

  // Skip noisy / internal fields that mean nothing to a human reader
  const HIDDEN_DETAIL_KEYS = new Set([
    "password",
    "__v",
    "_id",
    "picture",
    "token",
    "timestamp",
  ]);

  const renderKeyValueRows = (obj, level = 0) => {
    const entries = Object.entries(obj).filter(
      ([k]) => !HIDDEN_DETAIL_KEYS.has(k),
    );
    if (!entries.length)
      return <span className="text-gray-400 text-sm">—</span>;

    return (
      <div
        className={
          level > 0
            ? "ml-3 border-l border-gray-200 pl-3 mt-1 space-y-1"
            : "space-y-1"
        }
      >
        {entries.map(([key, value]) =>
          isPlainObject(value) ? (
            <div key={key}>
              <div className="text-xs font-semibold text-gray-600">
                {formatFieldName(key)}
              </div>
              {renderKeyValueRows(value, level + 1)}
            </div>
          ) : (
            <div key={key} className="flex gap-2 text-sm">
              <span className="text-gray-500 min-w-[130px] flex-shrink-0">
                {formatFieldName(key)}:
              </span>
              <span className="text-gray-800 break-all">
                {prettyValue(value)}
              </span>
            </div>
          ),
        )}
      </div>
    );
  };

  const renderChangedFields = (oldData, newData) => {
    const keys = Array.from(
      new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]),
    );
    const changed = keys.filter((k) => {
      if (HIDDEN_DETAIL_KEYS.has(k)) return false;
      const a = oldData?.[k];
      const b = newData?.[k];
      if (isPlainObject(a) || isPlainObject(b)) return false;
      return String(a) !== String(b);
    });

    if (!changed.length)
      return <p className="text-sm text-gray-500">No field changes recorded</p>;

    return (
      <div className="space-y-1.5">
        {changed.map((k) => (
          <div key={k} className="text-sm">
            <span className="font-medium text-gray-700">
              {formatFieldName(k)}:
            </span>{" "}
            <span className="text-red-600 line-through">
              {prettyValue(oldData?.[k])}
            </span>{" "}
            <span className="text-gray-400">→</span>{" "}
            <span className="text-green-700 font-medium">
              {prettyValue(newData?.[k])}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderReadableDetails = (details) => {
    if (details === null || details === undefined)
      return (
        <span className="text-gray-400 text-sm">No details available</span>
      );
    if (typeof details !== "object")
      return (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {String(details)}
        </p>
      );

    const { oldData, newData, ...rest } = details;

    return (
      <div className="space-y-3">
        {Object.keys(rest).length > 0 && renderKeyValueRows(rest)}

        {oldData && newData ? (
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Changed Fields
            </div>
            {renderChangedFields(oldData, newData)}
          </div>
        ) : oldData ? (
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">
              Previous Data
            </div>
            {renderKeyValueRows(oldData)}
          </div>
        ) : newData ? (
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">
              New Data
            </div>
            {renderKeyValueRows(newData)}
          </div>
        ) : null}
      </div>
    );
  };

  // One-line summary for compact list/card previews
  const summarizeDetails = (details) => {
    if (details === null || details === undefined) return "No details";
    if (typeof details !== "object") return String(details).slice(0, 100);

    const { oldData, newData, ...rest } = details;

    if (oldData && newData) {
      const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
      let n = 0;
      keys.forEach((k) => {
        if (
          !HIDDEN_DETAIL_KEYS.has(k) &&
          !isPlainObject(oldData[k]) &&
          String(oldData[k]) !== String(newData[k])
        )
          n++;
      });
      return `Updated ${n} field${n !== 1 ? "s" : ""}`;
    }

    const parts = Object.entries(rest)
      .filter(([k, v]) => !HIDDEN_DETAIL_KEYS.has(k) && !isPlainObject(v))
      .slice(0, 2)
      .map(([k, v]) => `${formatFieldName(k)}: ${prettyValue(v)}`);

    if (parts.length) return parts.join(" · ");
    if (oldData) return "Previous data recorded";
    return "Details available";
  };

  // Loading state
  if (loading && !userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-[#113F67] rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading audit logs...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#113F67] rounded-xl shadow-lg">
                  <History className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-[#113F67] bg-clip-text text-transparent">
                    Audit Logs
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    {isAdmin
                      ? "System activity monitoring dashboard"
                      : "Your activity history"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="text-right hidden md:block">
                <div className="text-sm text-gray-500">Current Time</div>
                <div className="text-lg font-bold text-indigo-700">
                  {formatTime(currentTime)}
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* User Role Badge */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  userRole === "superAdmin"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-purple-300"
                    : userRole === "moderator"
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                      : isAdmin
                        ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200"
                        : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200"
                }`}
              >
                {userRole === "superAdmin" ? (
                  <ShieldCheck size={14} />
                ) : userRole === "moderator" ? (
                  <ShieldAlert size={14} />
                ) : isAdmin ? (
                  <Shield size={14} />
                ) : (
                  <User size={14} />
                )}
                {userRole === "superAdmin"
                  ? "SUPER ADMIN"
                  : userRole === "moderator"
                    ? "MODERATOR"
                    : isAdmin
                      ? "ADMINISTRATOR"
                      : "EMPLOYEE"}
              </span>
              <span className="text-sm text-gray-500">
                {userRole === "superAdmin"
                  ? "Full system access with delete permissions"
                  : userRole === "moderator"
                    ? "View-only access to all system logs"
                    : isAdmin
                      ? "Full system access"
                      : "View personal logs only"}
              </span>
            </div>
          </div>

          {/* Admin Stats Cards */}
          {isAdmin && stats && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-5 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Total Logs
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.totalLogs ? stats.totalLogs.toLocaleString() : 0}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Database size={14} className="text-blue-500" />
                        <span className="text-xs text-blue-600">
                          All time records
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                      <Database className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-5 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Today's Logs
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.todaysLogs
                          ? stats.todaysLogs.toLocaleString()
                          : 0}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Activity size={14} className="text-green-500" />
                        <span className="text-xs text-green-600">
                          Live activity
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                      <Activity className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-5 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Active Users
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.topUsers ? stats.topUsers.length : 0}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Users size={14} className="text-purple-500" />
                        <span className="text-xs text-purple-600">
                          Most active
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-5 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Top Actions
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.topActions ? stats.topActions.length : 0}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <BarChart3 size={14} className="text-orange-500" />
                        <span className="text-xs text-orange-600">Tracked</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Mode Toggle - Admin Only */}
          {isAdmin && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode("all")}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      viewMode === "all"
                        ? "bg-gradient-to-r from-[#113F67] to-purple-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <Database size={18} />
                    All Logs
                    {viewMode === "all" && (
                      <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {totalLogs}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setViewMode("my")}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      viewMode === "my"
                        ? "bg-gradient-to-r from-[#113F67] to-purple-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <User size={18} />
                    My Logs
                  </button>
                </div>

                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                  {viewMode === "all"
                    ? "🔄 Viewing all system logs"
                    : "👤 Viewing your personal logs"}
                </div>
              </div>
            </div>
          )}

          {/* Logs Table Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <FileText
                      className="text-[#113F67] flex-shrink-0"
                      size={22}
                    />
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                      Audit Logs
                    </h2>
                    <span className="text-sm font-normal text-gray-500 whitespace-nowrap">
                      ({logs.length} log{logs.length !== 1 ? "s" : ""} found)
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 truncate">
                    {viewMode === "all"
                      ? "All system activities"
                      : "Your personal activity history"}
                  </p>
                </div>

                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <div className="text-sm text-gray-500 bg-gray-50 px-2 md:px-3 py-1.5 rounded-lg whitespace-nowrap">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 md:p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
                      title="Previous Page"
                    >
                      <ChevronRight className="rotate-180" size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 md:p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
                      title="Next Page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-8 md:p-12 text-center">
                <div className="inline-flex flex-col items-center">
                  <Loader2
                    size={48}
                    className="animate-spin text-[#113F67] mb-4"
                  />
                  <p className="text-gray-600 font-medium">
                    Loading audit logs...
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Please wait while we fetch the data
                  </p>
                </div>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-8 md:p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <FileText className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No audit logs found
                  </h3>
                  <p className="text-gray-500 max-w-md mb-6 text-sm md:text-base">
                    {filters.search || filters.action || filters.startDate
                      ? "No logs match your filters. Try adjusting your search criteria."
                      : "No audit logs available for the selected view."}
                  </p>
                  {(filters.search || filters.action || filters.startDate) && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-[#113F67] to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-medium text-sm md:text-base"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Mobile Card View for small screens */}
                <div className="md:hidden p-4 space-y-4">
                  {logs.map((log) => (
                    <div
                      key={log._id || Math.random()}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Header with Action and Actions */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {getActionIcon(safeString(log.action))}
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {safeString(log.action, "Unknown Action")}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                              <div
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(safeString(log.action))}`}
                              >
                                {safeString(log.actionType, "System")}
                              </div>
                              {getSeverityBadge(safeString(log.action))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => viewLogDetails(log)}
                            className="p-1.5 text-[#113F67] hover:bg-indigo-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => deleteLog(log._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete Log"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* User Info (Admin only) */}
                      {isAdmin &&
                        viewMode === "all" &&
                        log.userId &&
                        typeof log.userId === "object" && (
                          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <User size={14} className="text-gray-500" />
                              <span className="text-xs font-medium text-gray-700">
                                User:
                              </span>
                              <span className="text-xs text-gray-600 truncate">
                                {safeString(log.userId.firstName)}{" "}
                                {safeString(log.userId.lastName)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {safeString(log.userId.email)}
                            </div>
                          </div>
                        )}

                      {/* Device, Browser, OS Info */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(
                            safeString(log.device),
                            safeString(log.deviceType),
                          )}
                          <div>
                            <div className="text-xs font-medium text-gray-700">
                              Device
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {getDeviceDisplay(log)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getBrowserIcon(getBrowserDisplay(log))}
                          <div>
                            <div className="text-xs font-medium text-gray-700">
                              Browser
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {getBrowserDisplay(log)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* OS and IP Info */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <HardDrive size={14} className="text-gray-400" />
                          <div>
                            <div className="text-xs font-medium text-gray-700">
                              OS
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {getOSDisplay(log)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wifi size={14} className="text-gray-400" />
                          <div>
                            <div className="text-xs font-medium text-gray-700">
                              IP Address
                            </div>
                            <div className="text-xs text-gray-600 font-mono truncate">
                              {safeString(log.ip, "N/A")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-1">
                          Details:
                        </div>
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {summarizeDetails(log.details)}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <div>
                          <div className="text-xs font-medium text-gray-900">
                            {new Date(
                              safeString(log.createdAt),
                            ).toLocaleDateString("en-BD", {
                              timeZone: "Asia/Dhaka",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(
                              safeString(log.createdAt),
                            ).toLocaleTimeString("en-BD", {
                              timeZone: "Asia/Dhaka",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {timeAgo(safeString(log.createdAt))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <div className="w-full">
                    <div className="min-w-full divide-y divide-gray-200">
                      {/* Table Header - Updated with new columns */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="grid grid-cols-12 gap-2 px-4 py-3">
                          <div className="col-span-2">
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Action
                            </div>
                          </div>
                          {isAdmin && viewMode === "all" && (
                            <div className="col-span-2">
                              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                User
                              </div>
                            </div>
                          )}
                          <div className="col-span-2">
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Date &amp; Time
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Actions
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-gray-100">
                        {logs.map((log) => (
                          <div
                            key={log._id || Math.random()}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                              {/* Action Column */}
                              <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex-shrink-0">
                                    {getActionIcon(safeString(log.action))}
                                  </div>
                                  <div className="min-w-0">
                                    <div
                                      className="font-medium text-gray-900 text-sm truncate"
                                      title={safeString(log.action)}
                                    >
                                      {safeString(log.action, "Unknown Action")}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <div
                                        className={`text-xs px-2 py-0.5 rounded-full ${getActionColor(safeString(log.action))}`}
                                      >
                                        {safeString(log.actionType, "System")}
                                      </div>
                                      {getSeverityBadge(safeString(log.action))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* User Column (Admin only) */}
                              {isAdmin && viewMode === "all" && (
                                <div className="col-span-2">
                                  {log.userId &&
                                  typeof log.userId === "object" ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User
                                          className="text-[#113F67]"
                                          size={14}
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="font-medium text-gray-900 text-sm truncate">
                                          {safeString(log.userId.firstName)}{" "}
                                          {safeString(log.userId.lastName)}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                          {safeString(log.userId.email)}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-400 italic">
                                      System Action
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Timestamp Column */}
                              <div className="col-span-2">
                                <div className="flex flex-col">
                                  <div className="text-xs font-medium text-gray-900 whitespace-nowrap">
                                    {new Date(
                                      safeString(log.createdAt),
                                    ).toLocaleDateString("en-US", {
                                      timeZone: "Asia/Dhaka",
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </div>
                                  <div className="text-xs text-gray-500 whitespace-nowrap">
                                    {new Date(
                                      safeString(log.createdAt),
                                    ).toLocaleTimeString("en-US", {
                                      timeZone: "Asia/Dhaka",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* Actions Column */}
                              <div className="col-span-1">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => viewLogDetails(log)}
                                    className="p-1.5 text-[#113F67] hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                                    title="View Details"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  {canDelete && (
                                    <button
                                      onClick={() => deleteLog(log._id)}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                      title="Delete Log"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        JSON.stringify(log, null, 2),
                                      )
                                    }
                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                    title="Copy Log Data"
                                  >
                                    <Copy size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Pagination Footer */}
            {logs.length > 0 && (
              <div className="p-4 md:p-6 border-t border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    Showing {(currentPage - 1) * 20 + 1} to{" "}
                    {Math.min(currentPage * 20, totalLogs)} of {totalLogs} logs
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 text-sm"
                    >
                      <ChevronRight className="rotate-180" size={14} />
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(3, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage <= 2) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 1) {
                            pageNum = totalPages - 2 + i;
                          } else {
                            pageNum = currentPage - 1 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg transition-all duration-300 text-sm ${
                                currentPage === pageNum
                                  ? "bg-[#113F67] text-white shadow-md"
                                  : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 text-sm"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Details Modal - Updated */}
      {selectedLog && showDetails && (
        <div className="fixed inset-0 bg-black-300 bg-opacity-30 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getActionIcon(safeString(selectedLog.action))}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Audit Log Details
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Complete information about this activity
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <XCircle size={24} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Activity size={16} />
                      Action Information
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-gray-900">
                          {safeString(selectedLog.action)}
                        </span>
                        <div
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getActionColor(safeString(selectedLog.action))}`}
                        >
                          {selectedLog.userId &&
                          typeof selectedLog.userId === "object"
                            ? formatFieldName(
                                safeString(
                                  selectedLog.userRole ||
                                    selectedLog.userId.role,
                                  "User",
                                ),
                              ) + " Action"
                            : "System Action"}
                        </div>
                      </div>
                      <div className="text-gray-700 text-sm mt-3">
                        {renderReadableDetails(selectedLog.details)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Clock size={16} />
                      Timestamp
                    </label>
                    <div className="mt-2">
                      <div className="text-lg font-bold text-gray-900">
                        {formatDate(safeString(selectedLog.createdAt))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <Timer size={14} />
                        {timeAgo(safeString(selectedLog.createdAt))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedLog.userId &&
                  typeof selectedLog.userId === "object" ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User size={16} />
                        User Information
                      </label>
                      <div className="mt-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                            <User className="text-white" size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {safeString(selectedLog.userId.firstName)}{" "}
                              {safeString(selectedLog.userId.lastName)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {safeString(selectedLog.userId.email)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">
                                {safeString(
                                  selectedLog.userId.role,
                                  "Unknown Role",
                                )}
                              </span>
                              {selectedLog.userId.department && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                  {safeString(selectedLog.userId.department)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Server size={16} />
                        System Action
                      </label>
                      <div className="mt-2 text-gray-600">
                        This action was performed by the system automatically.
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Globe size={16} />
                      Network Information
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Wifi className="text-purple-600" size={16} />
                        <span className="font-mono font-bold text-gray-900">
                          {safeString(selectedLog.ip, "N/A")}
                        </span>
                        {selectedLog.ip && (
                          <button
                            onClick={() => copyToClipboard(selectedLog.ip)}
                            className="p-1 hover:bg-purple-100 rounded"
                            title="Copy IP"
                          >
                            <Copy size={14} className="text-purple-600" />
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Location: {getLocationDisplay(selectedLog)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Information - Updated */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Laptop size={20} />
                  Device & Browser Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      {getDeviceIcon(
                        safeString(selectedLog.device),
                        safeString(selectedLog.deviceType),
                      )}
                      <span className="font-medium text-gray-700">Device</span>
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {getDeviceDisplay(selectedLog)}
                    </div>
                    {selectedLog.deviceType && (
                      <div className="text-xs text-gray-500 mt-1">
                        Type: {safeString(selectedLog.deviceType)}
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      {getBrowserIcon(getBrowserDisplay(selectedLog))}
                      <span className="font-medium text-gray-700">Browser</span>
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {getBrowserDisplay(selectedLog)}
                    </div>
                    {selectedLog.device && selectedLog.device !== "Unknown" && (
                      <div
                        className="text-xs text-gray-500 mt-1 truncate"
                        title={selectedLog.device}
                      >
                        User Agent:{" "}
                        {String(selectedLog.device).substring(0, 30)}
                        ...
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive className="text-green-500" size={16} />
                      <span className="font-medium text-gray-700">
                        Operating System
                      </span>
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {getOSDisplay(selectedLog)}
                    </div>
                    {selectedLog.osVersion && (
                      <div className="text-xs text-gray-500 mt-1">
                        Version: {safeString(selectedLog.osVersion)}
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="text-red-500" size={16} />
                      <span className="font-medium text-gray-700">
                        Location
                      </span>
                    </div>
                    <div className="text-gray-900 font-semibold">
                      {getLocationDisplay(selectedLog)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedLog.additionalInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Additional Information
                  </h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto">
                    <pre className="text-sm">
                      {JSON.stringify(selectedLog.additionalInfo, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Security Analysis */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ShieldAlert size={20} />
                  Security Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Severity Level
                    </div>
                    {getSeverityBadge(safeString(selectedLog.action))}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Status
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedLog.status === "success" ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={14} />
                          Success
                        </span>
                      ) : selectedLog.status === "failed" ? (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertCircle size={14} />
                          Failed
                        </span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(selectedLog, null, 2))
                  }
                  className="px-6 py-3 bg-gradient-to-r from-[#113F67] to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <Copy size={18} />
                  Copy as JSON
                </button>
                {canDelete && selectedLog._id && (
                  <button
                    onClick={() => deleteLog(selectedLog._id)}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-medium flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete Log
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
