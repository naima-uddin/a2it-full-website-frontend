"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  DollarSign,
  Calendar,
  PieChart,
  FileText,
  BarChart3,
  Download,
  RefreshCw,
  ChevronDown,
  PlusCircle,
  Tag,
  AlertCircle,
  FileDown,
  Sparkles,
  Utensils,
  Shield,
  LogOut,
  User,
  Home,
  Zap,
  Package,
  Cpu,
  Car,
  Gift,
  Coffee,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_HRM_API_URL || "http://localhost:5000/api/v1";

// Months for dropdown
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState({
    monthly: false,
    yearly: false,
  });
  const [pdfReady, setPdfReady] = useState(false);
  const [jsPDF, setJsPDF] = useState(null);
  const [autoTable, setAutoTable] = useState(null);

  // Admin/SuperAdmin state
  const [userRole, setUserRole] = useState({
    isAdmin: false,
    isSuperAdmin: false,
  });

  // Initialize PDF libraries on client side
  useEffect(() => {
    const initializePDF = async () => {
      if (typeof window !== "undefined") {
        try {
          const [jsPDFModule, autoTableModule] = await Promise.all([
            import("jspdf"),
            import("jspdf-autotable"),
          ]);
          setJsPDF(() => jsPDFModule.default);
          setAutoTable(() => autoTableModule.default);
          setPdfReady(true);
        } catch (error) {
          console.error("Failed to load PDF libraries:", error);
        }
      }
    };

    initializePDF();
  }, []);

  const [dashboardData, setDashboardData] = useState({
    // Selected Period
    selectedYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1,
    selectedYearForYearly: new Date().getFullYear(),

    // Summary Data
    monthlySummary: {
      total: 0,
      employeeSalaries: 0,
      officeRent: 0,
      utilities: 0,
      officeSupplies: 0,
      softwareSubscriptions: 0,
      transportExpenses: 0,
      extraExpenses: 0,
      foodCosts: 0,
      categoryBreakdown: [],
    },

    yearlySummary: {
      total: 0,
      monthlyBreakdown: [],
      categoryTotals: [],
    },

    recentExpenses: [],

    isLoading: false,
    isLoadingYearly: false,
    error: null,
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Check admin/superadmin mode on user change
  useEffect(() => {
    if (user) {
      const isAdmin = user.role === "admin" || user.role === "superAdmin";
      const isSuperAdmin = user.role === "superAdmin";
      setUserRole({ isAdmin, isSuperAdmin });
    }
  }, [user]);

  // Fetch data after authentication
  useEffect(() => {
    if (user && !authLoading) {
      fetchMonthlySummary();
      fetchYearlySummary();
      fetchRecentExpenses();
    }
  }, [
    user,
    authLoading,
    dashboardData.selectedYear,
    dashboardData.selectedMonth,
    dashboardData.selectedYearForYearly,
  ]);

  // Check if user is authenticated
  const checkAuthentication = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const adminToken = localStorage.getItem("adminToken");
      const adminData = localStorage.getItem("adminData");

      if (!adminToken) {
        router.push("/hrm");
        return;
      }

      if (adminData) {
        const parsedUser = JSON.parse(adminData);
        setUser(parsedUser);
        setUserRole({
          isAdmin:
            parsedUser.role === "admin" || parsedUser.role === "superAdmin",
          isSuperAdmin: parsedUser.role === "superAdmin",
        });
      }

      setAuthLoading(false);
    } catch (error) {
      console.error("Error in authentication check:", error);
      localStorage.clear();
      router.push("/hrm");
    }
  }, [router]);

  // Update the useEffect that checks authentication
  useEffect(() => {
    checkAuthentication();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthentication();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkAuthentication]);

  const getAuthHeaders = useCallback(() => {
    const adminToken = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    };
  }, []);

  // Handle API error - MODIFIED to not show error for food costs only
  const handleAPIError = useCallback((error, context) => {
    console.error(`Error in ${context}:`, error);

    // Don't show error for recent expenses if food costs are loading
    if (context === "recent expenses") {
      return false;
    }

    setDashboardData((prev) => ({
      ...prev,
      error: error.message || `Failed to load ${context} data`,
      isLoading: false,
      isLoadingYearly: false,
    }));

    return true;
  }, []);

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(
    () => Array.from({ length: 7 }, (_, i) => currentYear - 3 + i),
    [currentYear],
  );

  // Format currency in BDT
  const formatCurrency = useCallback((amount) => {
    if (amount === undefined || amount === null || isNaN(amount))
      return "BDT 0.00";

    const formattedAmount = new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `BDT ${formattedAmount}`;
  }, []);

  // Format amount without symbol
  const formatAmount = useCallback((amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return "0.00";

    return new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Calculate percentage
  const calculatePercentage = useCallback(
    (amount) => {
      const total = dashboardData.monthlySummary.total;
      return total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
    },
    [dashboardData.monthlySummary.total],
  );

  // Calculate yearly percentage
  const calculateYearlyPercentage = useCallback(
    (amount) => {
      const total = dashboardData.yearlySummary.total;
      return total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
    },
    [dashboardData.yearlySummary.total],
  );

  // Fetch monthly summary — a single backend aggregation endpoint computes
  // every category total directly in MongoDB (payroll matched on its own
  // month/year fields, everything else on its date field within the
  // selected month), so the client never re-derives totals from raw records.
  const fetchMonthlySummary = async () => {
    if (!user) return;

    try {
      setDashboardData((prev) => ({ ...prev, isLoading: true, error: null }));

      const { selectedYear, selectedMonth } = dashboardData;
      const headers = getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/dashboard/monthly-summary?year=${selectedYear}&month=${selectedMonth}`,
        { headers },
      );

      if (!res.ok) {
        throw new Error("Failed to load monthly summary");
      }

      const { data } = await res.json();

      setDashboardData((prev) => ({
        ...prev,
        monthlySummary: {
          total: data.total,
          employeeSalaries: data.employeeSalaries,
          officeRent: data.officeRent,
          utilities: data.utilities,
          officeSupplies: data.officeSupplies,
          softwareSubscriptions: data.softwareSubscriptions,
          transportExpenses: data.transportExpenses,
          extraExpenses: data.extraExpenses,
          foodCosts: data.foodCosts,
          categoryBreakdown: data.categoryBreakdown,
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error in fetchMonthlySummary:", error);
      setDashboardData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load monthly summary data",
      }));
    }
  };

  // Fetch yearly summary — same aggregation endpoint family, grouped by month.
  const fetchYearlySummary = async () => {
    if (!user) return;

    try {
      setDashboardData((prev) => ({ ...prev, isLoadingYearly: true }));

      const { selectedYearForYearly } = dashboardData;
      const headers = getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/dashboard/yearly-summary?year=${selectedYearForYearly}`,
        { headers },
      );

      if (!res.ok) {
        throw new Error("Failed to load yearly summary");
      }

      const { data } = await res.json();

      setDashboardData((prev) => ({
        ...prev,
        yearlySummary: {
          total: data.total,
          monthlyBreakdown: data.monthlyBreakdown,
          categoryTotals: data.categoryTotals,
        },
        isLoadingYearly: false,
      }));
    } catch (error) {
      console.error("Error in fetchYearlySummary:", error);
      setDashboardData((prev) => ({
        ...prev,
        isLoadingYearly: false,
        error: "Failed to load yearly summary data",
      }));
    }
  };

  // Fetch recent expenses
  const fetchRecentExpenses = async () => {
    if (!user) return;

    try {
      const headers = getAuthHeaders();

      const res = await fetch(
        `${API_BASE_URL}/dashboard/recent-expenses?limit=10`,
        { headers },
      );

      if (!res.ok) {
        throw new Error("Failed to load recent expenses");
      }

      const { data } = await res.json();

      setDashboardData((prev) => ({
        ...prev,
        recentExpenses: data.map((item) => ({
          ...item,
          date: new Date(item.date),
        })),
      }));
    } catch (error) {
      console.error("Error fetching recent expenses:", error);
      handleAPIError(error, "recent expenses");
    }
  };

  // Download Monthly Summary PDF
  const downloadMonthlyPDF = async () => {
    if (
      !pdfReady ||
      downloadingPDF.monthly ||
      dashboardData.isLoading ||
      !dashboardData.monthlySummary.categoryBreakdown.length
    ) {
      alert(
        "Please wait for PDF libraries to load or ensure there is data available.",
      );
      return;
    }

    setDownloadingPDF((prev) => ({ ...prev, monthly: true }));

    try {
      let pdfLib = jsPDF;
      let tableLib = autoTable;

      if (!pdfLib || !tableLib) {
        const [jsPDFModule, autoTableModule] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
        ]);
        pdfLib = jsPDFModule.default;
        tableLib = autoTableModule.default;
      }

      const doc = new pdfLib();
      const monthName = MONTHS[dashboardData.selectedMonth - 1];
      const year = dashboardData.selectedYear;
      const summary = dashboardData.monthlySummary;

      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text(`Monthly Expense Summary - ${monthName} ${year}`, 105, 20, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, {
        align: "center",
      });
      doc.text(`Generated by: ${user?.name || "Admin"}`, 105, 38, {
        align: "center",
      });

      if (userRole.isSuperAdmin) {
        doc.text("Access Mode: SUPER ADMIN", 105, 46, { align: "center" });
      } else if (userRole.isAdmin) {
        doc.text("Access Mode: ADMIN", 105, 46, { align: "center" });
      }

      doc.setFontSize(16);
      doc.setTextColor(107, 33, 168);
      doc.text(
        `Total Monthly Expenses: ${formatCurrency(summary.total)}`,
        105,
        userRole.isSuperAdmin || userRole.isAdmin ? 60 : 55,
        { align: "center" },
      );

      const tableData = [];

      if (summary.employeeSalaries > 0) {
        tableData.push([
          "Employee Salaries",
          formatAmount(summary.employeeSalaries),
          `${calculatePercentage(summary.employeeSalaries)}%`,
        ]);
      }
      if (summary.officeRent > 0) {
        tableData.push([
          "House Rent",
          formatAmount(summary.officeRent),
          `${calculatePercentage(summary.officeRent)}%`,
        ]);
      }
      if (summary.utilities > 0) {
        tableData.push([
          "Utilities",
          formatAmount(summary.utilities),
          `${calculatePercentage(summary.utilities)}%`,
        ]);
      }
      if (summary.officeSupplies > 0) {
        tableData.push([
          "Office Supplies",
          formatAmount(summary.officeSupplies),
          `${calculatePercentage(summary.officeSupplies)}%`,
        ]);
      }
      if (summary.softwareSubscriptions > 0) {
        tableData.push([
          "Software Subscriptions",
          formatAmount(summary.softwareSubscriptions),
          `${calculatePercentage(summary.softwareSubscriptions)}%`,
        ]);
      }
      if (summary.transportExpenses > 0) {
        tableData.push([
          "Transport Expenses",
          formatAmount(summary.transportExpenses),
          `${calculatePercentage(summary.transportExpenses)}%`,
        ]);
      }
      if (summary.extraExpenses > 0) {
        tableData.push([
          "Extra Expenses",
          formatAmount(summary.extraExpenses),
          `${calculatePercentage(summary.extraExpenses)}%`,
        ]);
      }
      if (summary.foodCosts > 0) {
        tableData.push([
          "Food Costs",
          formatAmount(summary.foodCosts),
          `${calculatePercentage(summary.foodCosts)}%`,
        ]);
      }

      tableData.push(["", "", ""]);
      tableData.push(["TOTAL", formatAmount(summary.total), "100%"]);

      tableLib(doc, {
        startY: userRole.isSuperAdmin || userRole.isAdmin ? 65 : 60,
        head: [["Category", "Amount (BDT)", "Percentage"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [107, 33, 168], textColor: 255, fontSize: 12 },
        bodyStyles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 60 },
          2: { cellWidth: 40 },
        },
        margin: { left: 15, right: 15 },
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: "right" });
        doc.text("Confidential - Office Expenses Report", 15, 285);
        if (userRole.isSuperAdmin) {
          doc.text("Super Admin Access Report", 105, 285, { align: "center" });
        } else if (userRole.isAdmin) {
          doc.text("Admin Access Report", 105, 285, { align: "center" });
        }
      }

      const accessMode = userRole.isSuperAdmin
        ? "_SUPER_ADMIN"
        : userRole.isAdmin
          ? "_ADMIN"
          : "";
      doc.save(`Monthly_Expense_Summary_${monthName}_${year}${accessMode}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPDF((prev) => ({ ...prev, monthly: false }));
    }
  };

  // Download Yearly Summary PDF
  const downloadYearlyPDF = async () => {
    if (
      !pdfReady ||
      downloadingPDF.yearly ||
      dashboardData.isLoadingYearly ||
      !dashboardData.yearlySummary.monthlyBreakdown.length
    ) {
      alert(
        "Please wait for PDF libraries to load or ensure there is data available.",
      );
      return;
    }

    setDownloadingPDF((prev) => ({ ...prev, yearly: true }));

    try {
      let pdfLib = jsPDF;
      let tableLib = autoTable;

      if (!pdfLib || !tableLib) {
        const [jsPDFModule, autoTableModule] = await Promise.all([
          import("jspdf"),
          import("jspdf-autotable"),
        ]);
        pdfLib = jsPDFModule.default;
        tableLib = autoTableModule.default;
      }

      const doc = new pdfLib();
      const year = dashboardData.selectedYearForYearly;
      const summary = dashboardData.yearlySummary;

      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text(`Yearly Expense Summary - ${year}`, 105, 20, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, {
        align: "center",
      });
      doc.text(`Generated by: ${user?.name || "Admin"}`, 105, 38, {
        align: "center",
      });

      if (userRole.isSuperAdmin) {
        doc.text("Access Mode: SUPER ADMIN", 105, 46, { align: "center" });
      } else if (userRole.isAdmin) {
        doc.text("Access Mode: ADMIN", 105, 46, { align: "center" });
      }

      doc.setFontSize(16);
      doc.setTextColor(147, 51, 234);
      doc.text(
        `Total Yearly Expenses: ${formatCurrency(summary.total)}`,
        105,
        userRole.isSuperAdmin || userRole.isAdmin ? 60 : 55,
        { align: "center" },
      );

      tableLib(doc, {
        startY: userRole.isSuperAdmin || userRole.isAdmin ? 65 : 60,
        head: [
          [
            "Month",
            "Total (BDT)",
            "Employee Salaries",
            "House Rent",
            "Utilities",
            "Other",
          ],
        ],
        body: summary.monthlyBreakdown.map((month) => [
          month.monthName,
          formatAmount(month.total),
          formatAmount(month.employeeSalaries),
          formatAmount(month.officeRent),
          formatAmount(month.utilities),
          formatAmount(
            month.officeSupplies +
              month.softwareSubscriptions +
              month.transportExpenses +
              month.extraExpenses +
              month.foodCosts,
          ),
        ]),
        theme: "grid",
        headStyles: { fillColor: [147, 51, 234], textColor: 255, fontSize: 11 },
        bodyStyles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
        },
        margin: { left: 10, right: 10 },
      });

      if (summary.categoryTotals.length > 0) {
        doc.addPage();

        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text("Yearly Category Totals", 105, 20, { align: "center" });

        tableLib(doc, {
          startY: 30,
          head: [["Category", "Amount (BDT)", "Percentage", "Monthly Average"]],
          body: summary.categoryTotals.map((item) => [
            item.category,
            formatAmount(item.amount),
            `${calculateYearlyPercentage(item.amount)}%`,
            formatAmount(item.amount / 12),
          ]),
          theme: "striped",
          headStyles: {
            fillColor: [168, 85, 247],
            textColor: 255,
            fontSize: 11,
          },
          bodyStyles: { fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 40 },
            2: { cellWidth: 35 },
            3: { cellWidth: 45 },
          },
          margin: { left: 10, right: 10 },
        });

        const finalY = doc.lastAutoTable.finalY || 80;
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);

        if (summary.monthlyBreakdown.length > 0) {
          const highestMonth = summary.monthlyBreakdown.reduce(
            (max, month) => (month.total > max.total ? month : max),
            summary.monthlyBreakdown[0],
          );
          const lowestMonth = summary.monthlyBreakdown.reduce(
            (min, month) => (month.total < min.total ? month : min),
            summary.monthlyBreakdown[0],
          );

          doc.text(
            `Highest Expense Month: ${highestMonth.monthName} - ${formatCurrency(highestMonth.total)}`,
            15,
            finalY + 15,
          );
          doc.text(
            `Lowest Expense Month: ${lowestMonth.monthName} - ${formatCurrency(lowestMonth.total)}`,
            15,
            finalY + 25,
          );

          const avgMonthly = summary.total / 12;
          doc.text(
            `Average Monthly Expense: ${formatCurrency(avgMonthly)}`,
            15,
            finalY + 35,
          );

          const totalFoodCosts =
            summary.categoryTotals.find(
              (item) => item.category === "Food Costs",
            )?.amount || 0;
          doc.text(
            `Average Monthly Food Costs: ${formatCurrency(totalFoodCosts / 12)}`,
            15,
            finalY + 45,
          );
        }
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: "right" });
        doc.text("Confidential - Yearly Expenses Report", 15, 285);
        if (userRole.isSuperAdmin) {
          doc.text("Super Admin Access Report", 105, 285, { align: "center" });
        } else if (userRole.isAdmin) {
          doc.text("Admin Access Report", 105, 285, { align: "center" });
        }
      }

      const accessMode = userRole.isSuperAdmin
        ? "_SUPER_ADMIN"
        : userRole.isAdmin
          ? "_ADMIN"
          : "";
      doc.save(`Yearly_Expense_Summary_${year}${accessMode}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPDF((prev) => ({ ...prev, yearly: false }));
    }
  };

  // Handle year/month change
  const handleMonthYearChange = (type, value) => {
    setDashboardData((prev) => ({
      ...prev,
      [type]: parseInt(value),
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    if (!user) return;
    setDashboardData((prev) => ({ ...prev, error: null }));
    fetchMonthlySummary();
    fetchYearlySummary();
    fetchRecentExpenses();
  };

  // Handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      localStorage.clear();
      sessionStorage.clear();
      router.push("/hrm");
    }
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#113F67] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#113F67]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(244,231,255,0.7)_45%,_rgba(237,242,255,0.92))] p-2 md:p-4">
      {/* Header */}
      <div className="mb-8 rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-[0_25px_80px_rgba(96,36,130,0.12)] backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-r from-[#113F67] to-violet-600 p-2 shadow-lg shadow-violet-200/50">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-[#113F67]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Expense intelligence
                </div>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  Admin Dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
                  Track and analyze your office expenses in BDT (Taka)
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-right">
              <div className="flex items-center justify-end">
                <User className="w-4 h-4 text-purple-500 mr-1" />
                <p className="text-sm text-gray-600">Logged in as</p>
                {(userRole.isSuperAdmin || userRole.isAdmin) && (
                  <Shield className="w-4 h-4 text-[#113F67] ml-1" />
                )}
              </div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-[#113F67] capitalize">
                {Array.isArray(user.role) ? user.role.join(", ") : user.role}
                {userRole.isSuperAdmin && (
                  <span className="ml-1 font-semibold">(Super Admin Mode)</span>
                )}
                {userRole.isAdmin && !userRole.isSuperAdmin && (
                  <span className="ml-1 font-semibold">(Admin Mode)</span>
                )}
              </p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2 bg-white rounded-xl border border-purple-200 hover:bg-purple-50 transition-all shadow-sm hover:shadow-md"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 text-[#113F67]" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {dashboardData.error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-rose-500 mr-2" />
              <p className="text-rose-700">{dashboardData.error}</p>
            </div>
            <button
              onClick={() =>
                setDashboardData((prev) => ({ ...prev, error: null }))
              }
              className="text-rose-500 hover:text-rose-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Super Admin Mode Indicator */}
      {userRole.isSuperAdmin && (
        <div className="mb-6 p-4 bg-gradient-to-r from-[#113F67] to-[#113F67] border border-purple-200 rounded-xl shadow-md">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-white mr-2" />
            <p className="text-white font-semibold">
              You are accessing the dashboard in Super Admin Mode. You have full
              access to all features and data.
            </p>
          </div>
        </div>
      )}

      {/* Admin Mode Indicator */}
      {userRole.isAdmin && !userRole.isSuperAdmin && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl shadow-md">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-[#113F67] mr-2" />
            <p className="text-purple-700 font-semibold">
              You are accessing the dashboard in Admin Mode. You can view all
              expense data.
            </p>
          </div>
        </div>
      )}

      {/* Top Metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-gradient-to-br from-[#113F67] via-slate-900 to-[#1d5a89] p-5 text-white shadow-[0_24px_70px_rgba(17,63,103,0.28)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                Selected month
              </p>
              <h3 className="mt-3 text-3xl font-bold">
                {formatCurrency(dashboardData.monthlySummary.total)}
              </h3>
              <p className="mt-2 text-sm text-white/75">
                {MONTHS[dashboardData.selectedMonth - 1]}{" "}
                {dashboardData.selectedYear}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <TrendingUp className="h-7 w-7" />
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-5 text-white shadow-[0_24px_70px_rgba(124,58,237,0.25)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/65">
                Selected year
              </p>
              <h3 className="mt-3 text-3xl font-bold">
                {formatCurrency(dashboardData.yearlySummary.total)}
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Year {dashboardData.selectedYearForYearly}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <BarChart3 className="h-7 w-7" />
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_24px_70px_rgba(96,36,130,0.12)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                Recent expenses
              </p>
              <h3 className="mt-3 text-3xl font-bold text-gray-900">
                {dashboardData.recentExpenses.length}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Last 30 days across all tracked items
              </p>
            </div>
            <div className="rounded-2xl bg-violet-100 p-3 text-[#113F67]">
              <Coffee className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary Section */}
      <div className="mb-8 bg-white/90 rounded-[28px] shadow-[0_24px_80px_rgba(96,36,130,0.10)] p-6 border border-purple-100 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-[#113F67]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Monthly Expense Summary
              </h2>
            </div>
            {dashboardData.monthlySummary.categoryBreakdown.length > 0 && (
              <button
                onClick={downloadMonthlyPDF}
                disabled={
                  !pdfReady || downloadingPDF.monthly || dashboardData.isLoading
                }
                className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown
                  className={`w-4 h-4 mr-2 ${downloadingPDF.monthly ? "animate-spin" : ""}`}
                />
                {downloadingPDF.monthly ? "Generating PDF..." : "Download PDF"}
              </button>
            )}
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <select
                value={dashboardData.selectedYear}
                onChange={(e) =>
                  handleMonthYearChange("selectedYear", e.target.value)
                }
                className="appearance-none bg-white border border-purple-200 rounded-xl pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                disabled={dashboardData.isLoading}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-purple-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={dashboardData.selectedMonth}
                onChange={(e) =>
                  handleMonthYearChange("selectedMonth", e.target.value)
                }
                className="appearance-none bg-white border border-purple-200 rounded-xl pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                disabled={dashboardData.isLoading}
              >
                {MONTHS.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-purple-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {dashboardData.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : dashboardData.monthlySummary.categoryBreakdown.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-purple-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500">
              No expense data found for{" "}
              {MONTHS[dashboardData.selectedMonth - 1]}{" "}
              {dashboardData.selectedYear}
            </p>
          </div>
        ) : (
          <>
            {/* Monthly Total Card */}
            <div className="bg-gradient-to-r from-purple-500 to-[#113F67] rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    {MONTHS[dashboardData.selectedMonth - 1]}{" "}
                    {dashboardData.selectedYear}
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-2">
                    {formatCurrency(dashboardData.monthlySummary.total)}
                  </h3>
                  <p className="text-purple-100 text-sm mt-2">
                    Total Monthly Expenses (BDT)
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  {dashboardData.monthlySummary.categoryBreakdown.length >
                    0 && (
                    <button
                      onClick={downloadMonthlyPDF}
                      disabled={!pdfReady || downloadingPDF.monthly}
                      className="p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download PDF Report"
                    >
                      <FileDown className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Category Breakdown
              </h3>
              <div className="space-y-4">
                {dashboardData.monthlySummary.categoryBreakdown.map(
                  (item, index) => (
                    <div
                      key={`${item.category}-${index}`}
                      className="space-y-2"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          {item.category}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${calculatePercentage(item.amount)}%`,
                            backgroundColor: item.color,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>
                          {calculatePercentage(item.amount)}% of total
                        </span>
                        <span>BDT {formatAmount(item.amount)}</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Detailed Monthly Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardData.monthlySummary.employeeSalaries > 0 && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg mr-3">
                      <span className="text-white text-lg">👨‍💼</span>
                    </div>
                    <p className="text-gray-600 text-sm">Employee Salaries</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      dashboardData.monthlySummary.employeeSalaries,
                    )}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-400">
                      {calculatePercentage(
                        dashboardData.monthlySummary.employeeSalaries,
                      )}
                      % of total
                    </p>
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  </div>
                </div>
              )}
              {dashboardData.monthlySummary.officeRent > 0 && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg mr-3">
                      <span className="text-white text-lg">🏢</span>
                    </div>
                    <p className="text-gray-600 text-sm">House Rent</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.monthlySummary.officeRent)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-400">
                      {calculatePercentage(
                        dashboardData.monthlySummary.officeRent,
                      )}
                      % of total
                    </p>
                    <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                  </div>
                </div>
              )}
              {dashboardData.monthlySummary.utilities > 0 && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg mr-3">
                      <span className="text-white text-lg">💡</span>
                    </div>
                    <p className="text-gray-600 text-sm">Utilities</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.monthlySummary.utilities)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-400">
                      {calculatePercentage(
                        dashboardData.monthlySummary.utilities,
                      )}
                      % of total
                    </p>
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
                  </div>
                </div>
              )}
              {dashboardData.monthlySummary.officeSupplies > 0 && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg mr-3">
                      <span className="text-white text-lg">📦</span>
                    </div>
                    <p className="text-gray-600 text-sm">Office Supplies</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      dashboardData.monthlySummary.officeSupplies,
                    )}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-400">
                      {calculatePercentage(
                        dashboardData.monthlySummary.officeSupplies,
                      )}
                      % of total
                    </p>
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  </div>
                </div>
              )}
              {dashboardData.monthlySummary.softwareSubscriptions > 0 && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-rose-500 to-red-500 rounded-lg mr-3">
                      <span className="text-white text-lg">💻</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Software Subscriptions
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      dashboardData.monthlySummary.softwareSubscriptions,
                    )}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-400">
                      {calculatePercentage(
                        dashboardData.monthlySummary.softwareSubscriptions,
                      )}
                      % of total
                    </p>
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  </div>
                </div>
              )}
              {dashboardData.monthlySummary.transportExpenses > 0 && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg mr-3">
                      <span className="text-white text-lg">🚗</span>
                    </div>
                    <p className="text-gray-600 text-sm">Transport Expenses</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      dashboardData.monthlySummary.transportExpenses,
                    )}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-400">
                      {calculatePercentage(
                        dashboardData.monthlySummary.transportExpenses,
                      )}
                      % of total
                    </p>
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
              )}
              {dashboardData.monthlySummary.extraExpenses > 0 && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg mr-3">
                      <span className="text-white text-lg">📝</span>
                    </div>
                    <p className="text-gray-600 text-sm">Extra Expenses</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.monthlySummary.extraExpenses)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-400">
                      {calculatePercentage(
                        dashboardData.monthlySummary.extraExpenses,
                      )}
                      % of total
                    </p>
                    <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                  </div>
                </div>
              )}
              {dashboardData.monthlySummary.foodCosts > 0 && (
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg mr-3">
                      <span className="text-white text-lg">🍽️</span>
                    </div>
                    <p className="text-gray-600 text-sm">Food Costs</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.monthlySummary.foodCosts)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-400">
                      {calculatePercentage(
                        dashboardData.monthlySummary.foodCosts,
                      )}
                      % of total
                    </p>
                    <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Yearly Summary Section */}
      <div className="mb-8 bg-white/90 rounded-[28px] shadow-[0_24px_80px_rgba(96,36,130,0.10)] p-6 border border-purple-100 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-[#113F67]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Yearly Expense Summary
              </h2>
            </div>
            {dashboardData.yearlySummary.monthlyBreakdown.length > 0 && (
              <button
                onClick={downloadYearlyPDF}
                disabled={
                  !pdfReady ||
                  downloadingPDF.yearly ||
                  dashboardData.isLoadingYearly
                }
                className="flex items-center px-4 py-2 bg-gradient-to-r from-violet-500 to-[#113F67] text-white rounded-xl hover:from-[#113F67] hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown
                  className={`w-4 h-4 mr-2 ${downloadingPDF.yearly ? "animate-spin" : ""}`}
                />
                {downloadingPDF.yearly ? "Generating PDF..." : "Download PDF"}
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={dashboardData.selectedYearForYearly}
              onChange={(e) =>
                handleMonthYearChange("selectedYearForYearly", e.target.value)
              }
              className="appearance-none bg-white border border-purple-200 rounded-xl pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
              disabled={dashboardData.isLoadingYearly}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-purple-400 pointer-events-none" />
          </div>
        </div>

        {dashboardData.isLoadingYearly ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : dashboardData.yearlySummary.monthlyBreakdown.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-purple-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500">
              No expense data found for year{" "}
              {dashboardData.selectedYearForYearly}
            </p>
          </div>
        ) : (
          <>
            {/* Yearly Total Card */}
            <div className="bg-gradient-to-r from-violet-500 to-[#113F67] rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-sm font-medium">
                    Year {dashboardData.selectedYearForYearly}
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-2">
                    {formatCurrency(dashboardData.yearlySummary.total)}
                  </h3>
                  <p className="text-violet-100 text-sm mt-2">
                    Total Yearly Expenses (BDT)
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  {dashboardData.yearlySummary.monthlyBreakdown.length > 0 && (
                    <button
                      onClick={downloadYearlyPDF}
                      disabled={!pdfReady || downloadingPDF.yearly}
                      className="p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download PDF Report"
                    >
                      <FileDown className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Monthly Breakdown Chart */}
            {dashboardData.yearlySummary.monthlyBreakdown.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {dashboardData.yearlySummary.monthlyBreakdown.map(
                    (month, index) => {
                      const maxTotal = Math.max(
                        ...dashboardData.yearlySummary.monthlyBreakdown.map(
                          (m) => m.total || 1,
                        ),
                      );
                      return (
                        <div
                          key={`month-${index}`}
                          className="text-center group"
                        >
                          <div className="text-sm text-gray-500 mb-1 group-hover:text-[#113F67] transition-colors">
                            {month.monthName}
                          </div>
                          <div className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                            {formatCurrency(month.total)}
                          </div>
                          <div className="mt-2">
                            <div className="h-2 bg-purple-100 rounded-full w-full">
                              <div
                                className="h-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(month.total / maxTotal) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 group-hover:text-[#113F67] transition-colors">
                            BDT {formatAmount(month.total)}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}

            {/* Yearly Category Totals */}
            {dashboardData.yearlySummary.categoryTotals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Yearly Category Totals (BDT)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardData.yearlySummary.categoryTotals.map(
                    (item, index) => (
                      <div
                        key={`category-${index}`}
                        className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-center mb-3">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="font-medium text-gray-700">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(item.amount)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-gray-500">
                            BDT {formatAmount(item.amount)} (
                            {calculateYearlyPercentage(item.amount)}%)
                          </div>
                          <div className="text-lg">{item.icon}</div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recent Expenses Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-100 rounded-lg">
              <FileText className="w-5 h-5 text-pink-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Recent Expenses (Past 30 Days)
            </h2>
          </div>
          <div className="flex items-center">
            <Coffee className="w-6 h-6 text-purple-500 mr-2" />
            <Utensils className="w-5 h-5 text-pink-500" />
          </div>
        </div>

        <div className="space-y-3">
          {dashboardData.recentExpenses.length > 0 ? (
            dashboardData.recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="p-4 border border-purple-100 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        expense.category === "Food Cost"
                          ? "bg-gradient-to-r from-pink-100 to-rose-100"
                          : expense.category === "Employee Salary"
                            ? "bg-gradient-to-r from-purple-100 to-violet-100"
                            : expense.category === "House Rent"
                              ? "bg-gradient-to-r from-violet-100 to-purple-100"
                              : expense.category === "Utility Bill"
                                ? "bg-gradient-to-r from-fuchsia-100 to-pink-100"
                                : "bg-gradient-to-r from-purple-50 to-violet-50"
                      }`}
                    >
                      {expense.category === "Food Cost" ? (
                        <Coffee className="w-5 h-5 text-pink-600" />
                      ) : expense.category === "Employee Salary" ? (
                        <User className="w-5 h-5 text-[#113F67]" />
                      ) : expense.category === "House Rent" ? (
                        <Home className="w-5 h-5 text-[#113F67]" />
                      ) : expense.category === "Utility Bill" ? (
                        <Zap className="w-5 h-5 text-fuchsia-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-[#113F67]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold text-gray-900">
                          {expense.category}
                        </h4>
                        {expense.category === "Food Cost" && (
                          <span className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 rounded-full border border-pink-200">
                            🍽️ Food
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {expense.name} •{" "}
                        <span className="text-[#113F67]">
                          {expense.payment}
                        </span>
                      </p>
                      <p className="text-sm text-purple-500">
                        {expense.date.toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900 block">
                      {formatCurrency(expense.amount)}
                    </span>
                    <span className="text-sm text-[#113F67] block">
                      BDT {formatAmount(expense.amount)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Recent Expenses
              </h3>
              <p className="text-gray-500">
                No expense data found in the past 30 days
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
