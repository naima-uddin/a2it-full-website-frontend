"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Toast Component
const Toast = ({ message, type = "success", onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  const iconColor = type === "success" ? "text-green-600" : "text-red-600";

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border ${bgColor} animate-slide-in`}
    >
      <div className="flex items-center space-x-3">
        {type === "success" ? (
          <svg
            className={`w-5 h-5 ${iconColor}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className={`w-5 h-5 ${iconColor}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <div>
          <p className={`font-medium ${textColor}`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function page() {
  const router = useRouter();
  const formRef = useRef(null);

  // Authentication state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeToken, setActiveToken] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    rent: "",
    paymentMethod: "cash",
    note: "",
  });

  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingId, setEditingId] = useState(null);

  // Filter states
  const [filterYear, setFilterYear] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    yearlySummary: [],
    monthlyAverage: 0,
  });

  const API_URL = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_HRM_API_URL || "http://localhost:5000/api/v1"}`,
    [],
  );

  // Month names for display
  const monthNames = [
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

  // Payment methods
  const paymentMethods = [
    "cash",
    "bank_transfer",
    "credit_card",
    "debit_card",
    "online",
    "other",
  ];

  // Show toast function
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Clear toast
  const clearToast = () => {
    setToast(null);
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Fetch data after authentication
  useEffect(() => {
    if (user && activeToken && !authLoading) {
      fetchOfficeRents();
      fetchStats();
      // Extract years and months from rents data
      const extractedYears = [
        ...new Set(rents.map((rent) => new Date(rent.date).getFullYear())),
      ];
      setYears(extractedYears.sort((a, b) => b - a));
    }
  }, [user, activeToken, authLoading]);

  // Update months when year changes
  useEffect(() => {
    if (filterYear !== "all") {
      const yearRents = rents.filter(
        (rent) => new Date(rent.date).getFullYear() === parseInt(filterYear),
      );
      const extractedMonths = [
        ...new Set(yearRents.map((rent) => new Date(rent.date).getMonth() + 1)),
      ];
      setMonths(extractedMonths.sort((a, b) => a - b));
    } else {
      setMonths([]);
    }
  }, [filterYear, rents]);

  // **UPDATED: à¦¶à§à¦§à§à¦®à¦¾à¦¤à§à¦° adminToken à¦¬à¦¾ moderatorToken à¦¥à¦¾à¦•à¦²à§‡à¦‡ access à¦ªà¦¾à¦¬à§‡**
  const checkAuthentication = () => {
    try {
      // à¦¶à§à¦§à§à¦®à¦¾à¦¤à§à¦° à¦à¦‡ à¦¦à§à¦‡à¦Ÿà¦¿ token à¦šà§‡à¦• à¦•à¦°à¦¬
      const adminToken = localStorage.getItem("adminToken");
      const moderatorToken = localStorage.getItem("moderatorToken");

      let activeToken = null;
      let userInfo = null;
      let userRole = "";

      // **à¦¶à§à¦§à§à¦®à¦¾à¦¤à§à¦° admin à¦¬à¦¾ moderator token à¦¥à¦¾à¦•à¦²à§‡à¦‡ access**
      if (adminToken) {
        activeToken = adminToken;
        userRole = "admin";
        // admin data à¦–à§à¦à¦œà§‡ à¦¬à§‡à¦° à¦•à¦°à¦¿
        const adminData = localStorage.getItem("adminData");
        if (adminData) {
          try {
            userInfo = JSON.parse(adminData);
            userInfo.role = "admin";
          } catch (e) {
            console.error("Error parsing admin data:", e);
          }
        }
      } else if (moderatorToken) {
        activeToken = moderatorToken;
        userRole = "moderator";
        // moderator data à¦–à§à¦à¦œà§‡ à¦¬à§‡à¦° à¦•à¦°à¦¿
        const moderatorData = localStorage.getItem("moderatorData");
        if (moderatorData) {
          try {
            userInfo = JSON.parse(moderatorData);
            userInfo.role = "moderator";
          } catch (e) {
            console.error("Error parsing moderator data:", e);
          }
        }
      }

      // à¦¯à¦¦à¦¿ admin à¦¬à¦¾ moderator token à¦¨à¦¾ à¦¥à¦¾à¦•à§‡
      if (!activeToken) {
        console.log(
          "Access denied: Only admin or moderator tokens are allowed",
        );
        setMessage({
          type: "error",
          text: "Access denied. This page is only for administrators and moderators.",
        });
        setTimeout(() => router.push("/hrm/dashboard"), 2000);
        return;
      }

      // à¦¯à¦¦à¦¿ user info à¦¨à¦¾ à¦¥à¦¾à¦•à§‡, basic info create à¦•à¦°à¦¿
      if (!userInfo) {
        userInfo = {
          name: userRole === "admin" ? "Administrator" : "Moderator",
          role: userRole,
          email: "",
          phone: "",
          employeeId: "",
          isAuthenticated: true,
        };
      }

      // Set user and token state
      setUser(userInfo);
      setActiveToken(activeToken);
      setAuthLoading(false);
    } catch (error) {
      console.error("Error in authentication check:", error);
      showToast("Authentication error. Please login again.", "error");
      setTimeout(() => router.push("/hrm"), 2000);
    }
  };

  // Function to get correct authorization header
  const getAuthHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (activeToken) {
      headers["Authorization"] = `Bearer ${activeToken}`;
    }

    return headers;
  };

  // Fetch all office rents
  const fetchOfficeRents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/office-rents`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          showToast("Session expired. Please login again.", "error");
          setTimeout(() => {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("moderatorToken");
            router.push("/hrm");
          }, 2000);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const sortedRents = [...data.data].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        setRents(sortedRents);

        // Update years list
        const extractedYears = [
          ...new Set(
            sortedRents.map((rent) => new Date(rent.date).getFullYear()),
          ),
        ];
        setYears(extractedYears.sort((a, b) => b - a));
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to load office rents",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      // Fetch total stats
      const totalResponse = await fetch(`${API_URL}/stats/total`, {
        headers: getAuthHeaders(),
      });

      if (totalResponse.ok) {
        const totalData = await totalResponse.json();
        if (totalData.success) {
          setStats((prev) => ({
            ...prev,
            totalAmount: totalData.data.totalAmount || 0,
            monthlyAverage: totalData.data.monthlyAverage || 0,
          }));
        }
      }

      // Fetch yearly summary if needed
      // You can implement this based on your needs
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(100, 65, 164); // Purple color
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICE RENT REPORT", 105, 12, { align: "center" });

    doc.setFontSize(10);
    doc.text("A2IT Solutions Ltd.", 105, 19, { align: "center" });
    doc.text("Office Rent Management System", 105, 24, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Report Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Report Information", 14, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const reportInfo = [
      [
        "Generated On:",
        new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ],
      ["Total Records:", filteredRents.length],
      [
        "Report Period:",
        filterYear === "all"
          ? "All Time"
          : `Year: ${filterYear}` +
            (filterMonth !== "all"
              ? `, Month: ${monthNames[parseInt(filterMonth) - 1]}`
              : ""),
      ],
      ["Total Amount:", formatCurrency(calculateFilteredTotal())],
    ];

    autoTable(doc, {
      startY: 45,
      head: [],
      body: reportInfo,
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 55 },
        1: { cellWidth: 125 },
      },
    });

    // Rent Details Table
    const detailsY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Rent Details", 14, detailsY);

    // Prepare table data
    const tableData = filteredRents.map((rent, index) => {
      const date = new Date(rent.date);
      return [
        index + 1,
        date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        formatPaymentMethod(rent.paymentMethod || "cash"),
        formatCurrency(rent.rent),
        rent.note || "-",
        new Date(rent.createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      ];
    });

    autoTable(doc, {
      startY: detailsY + 5,
      head: [["#", "Date", "Payment Method", "Amount", "Note", "Created"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: {
        fillColor: [100, 65, 164],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 30 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 45 },
        5: { cellWidth: 30 },
      },
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("This is a computer generated report.", 105, finalY, {
      align: "center",
    });

    doc.setFontSize(8);
    doc.text("Powered by A2IT HRMS", 105, finalY + 5, { align: "center" });

    // Save the PDF
    const fileName = `Office_Rent_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
    showToast(`PDF downloaded: ${fileName}`);
  };

  // Function to check for duplicate month-year entries
  const checkForDuplicateMonthYear = (
    selectedDate,
    currentEditingId = null,
  ) => {
    if (!selectedDate) return false;

    const inputDate = new Date(selectedDate);
    const inputYear = inputDate.getFullYear();
    const inputMonth = inputDate.getMonth();

    // Filter out the current record being edited
    const filteredRents = currentEditingId
      ? rents.filter((rent) => rent._id !== currentEditingId)
      : rents;

    const isDuplicate = filteredRents.some((rent) => {
      const rentDate = new Date(rent.date);
      const rentYear = rentDate.getFullYear();
      const rentMonth = rentDate.getMonth();

      return rentYear === inputYear && rentMonth === inputMonth;
    });

    return isDuplicate;
  };

  // **UPDATED: Fetch single rent for editing - AUTO SCROLL TO FORM**
  const fetchRentForEdit = async (id) => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await fetch(`${API_URL}/office-rents/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const rent = data.data;
        setFormData({
          date: rent.date.split("T")[0],
          rent: rent.rent.toString(),
          paymentMethod: rent.paymentMethod || "cash",
          note: rent.note || "",
        });
        setEditingId(id);

        // Auto scroll to form section
        setTimeout(() => {
          if (formRef.current) {
            // Smooth scroll to form
            formRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            // Highlight the form for better UX
            formRef.current.style.transition = "all 0.3s";
            formRef.current.style.boxShadow =
              "0 0 0 3px rgba(147, 51, 234, 0.3)";

            // Remove highlight after 2 seconds
            setTimeout(() => {
              if (formRef.current) {
                formRef.current.style.boxShadow = "";
              }
            }, 2000);
          }
        }, 100);
      } else {
        showToast(data.message || "Failed to load rent data", "error");
      }
    } catch (error) {
      showToast(`Failed to load rent record: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Get monthly rents
  const getMonthlyRents = async (year, month) => {
    try {
      const response = await fetch(`${API_URL}/monthly/${year}/${month}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching monthly rents:", error);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear duplicate warning when date changes
    if (name === "date") {
      if (
        message.text.includes("already exists") ||
        message.text.includes("duplicate")
      ) {
        setMessage({ type: "", text: "" });
      }

      // Check for duplicate when editing
      if (editingId && value) {
        const isDuplicate = checkForDuplicateMonthYear(value, editingId);
        if (isDuplicate) {
          const inputDate = new Date(value);
          const monthName = monthNames[inputDate.getMonth()];
          const year = inputDate.getFullYear();
          setMessage({
            type: "error",
            text: `Cannot edit: A rent record for ${monthName} ${year} already exists. Please choose a different date.`,
          });
        }
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (!formData.date) {
        throw new Error("Please select a date");
      }

      if (!formData.rent || parseFloat(formData.rent) <= 0) {
        throw new Error("Please enter a valid rent amount");
      }

      // Check for duplicate month-year
      const isDuplicate = checkForDuplicateMonthYear(formData.date, editingId);

      if (isDuplicate) {
        const inputDate = new Date(formData.date);
        const monthName = monthNames[inputDate.getMonth()];
        const year = inputDate.getFullYear();

        if (editingId) {
          throw new Error(
            `Cannot update: A rent record for ${monthName} ${year} already exists. Please keep the original date or choose a different one.`,
          );
        } else {
          throw new Error(
            `A rent record for ${monthName} ${year} already exists. Please edit the existing record instead.`,
          );
        }
      }

      let url, method, requestBody;

      if (editingId) {
        // âœ… URL à¦ ID à¦ªà¦¾à¦ à¦¾à¦¨à§‹ (à¦°à¦¾à¦‰à¦Ÿà§‡ :id à¦¥à¦¾à¦•à¦¾à¦° à¦•à¦¾à¦°à¦£à§‡)
        url = `${API_URL}/updateOffice-rents/${editingId}`;
        method = "PUT";
        requestBody = formData; // ID body à¦¤à§‡ à¦ªà¦¾à¦ à¦¾à¦¬à§‡à¦¨ à¦¨à¦¾
      } else {
        url = `${API_URL}/createOffice-rents`;
        method = "POST";
        requestBody = formData;
      }

      console.log("Sending request:", { url, method, body: requestBody });

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `HTTP error! status: ${response.status}`,
        );
      }

      if (data.success) {
        const actionText = editingId ? "updated" : "saved";
        showToast(`Office rent ${actionText} successfully!`);

        // Reset form
        setFormData({
          date: "",
          rent: "",
          paymentMethod: "cash",
          note: "",
        });

        setEditingId(null);

        // Refresh data
        await fetchOfficeRents();
        await fetchStats();

        // Clear any existing messages
        setMessage({ type: "", text: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || data.error || "Operation failed",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setFormData({
      date: "",
      rent: "",
      paymentMethod: "cash",
      note: "",
    });
    setEditingId(null);
    setMessage({ type: "", text: "" });
  };

  // Delete rent record
  const handleDelete = async (id) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this rent record?",
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/deleteOffice-rents/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Rent record deleted successfully!");
        if (editingId === id) {
          cancelEdit();
        }
        fetchOfficeRents();
        fetchStats();
      } else {
        showToast(data.message || data.error, "error");
      }
    } catch (error) {
      showToast(`Failed to delete rent record: ${error.message}`, "error");
    }
  };

  // Handle year filter change
  const handleYearChange = (e) => {
    setFilterYear(e.target.value);
    setFilterMonth("all");
  };

  // Handle month filter change
  const handleMonthChange = (e) => {
    setFilterMonth(e.target.value);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterYear("all");
    setFilterMonth("all");
  };

  // Filter rents based on selected year and month and sort by date descending
  const filteredRents = useMemo(() => {
    const filtered = rents.filter((rent) => {
      const date = new Date(rent.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();

      if (filterYear !== "all" && year !== filterYear) {
        return false;
      }

      if (filterMonth !== "all" && month !== filterMonth) {
        return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [rents, filterYear, filterMonth]);

  // Calculate total for filtered rents
  const calculateFilteredTotal = () => {
    return filteredRents.reduce((total, rent) => total + rent.rent, 0);
  };

  // Format currency in Bangladeshi Taka (BDT)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format payment method for display
  const formatPaymentMethod = (method) => {
    return method
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get existing month-year for warning
  const getExistingMonthsWarning = () => {
    if (rents.length === 0) return null;

    const selectedDate = new Date(formData.date);
    if (isNaN(selectedDate.getTime())) return null;

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();

    const existingMonths = rents
      .map((rent) => {
        const rentDate = new Date(rent.date);
        return {
          year: rentDate.getFullYear(),
          month: rentDate.getMonth(),
          monthName: monthNames[rentDate.getMonth()],
          id: rent._id,
        };
      })
      .filter(
        (item) => item.year === selectedYear && item.month === selectedMonth,
      );

    return existingMonths.length > 0 ? existingMonths[0] : null;
  };

  // Check if date has duplicate warning for new entries
  const existingMonthWarning = !editingId ? getExistingMonthsWarning() : null;

  // Check if editing date causes duplicate
  const editingDuplicateWarning = editingId
    ? (() => {
        if (!formData.date) return null;

        const selectedDate = new Date(formData.date);
        if (isNaN(selectedDate.getTime())) return null;

        const selectedYear = selectedDate.getFullYear();
        const selectedMonth = selectedDate.getMonth();

        // Find the original record being edited
        const originalRecord = rents.find((rent) => rent._id === editingId);
        if (!originalRecord) return null;

        const originalDate = new Date(originalRecord.date);
        const originalYear = originalDate.getFullYear();
        const originalMonth = originalDate.getMonth();

        // Check if date has changed
        const dateChanged =
          selectedYear !== originalYear || selectedMonth !== originalMonth;

        if (!dateChanged) return null;

        // Check for duplicates excluding current record
        const isDuplicate = rents.some((rent) => {
          if (rent._id === editingId) return false;

          const rentDate = new Date(rent.date);
          const rentYear = rentDate.getFullYear();
          const rentMonth = rentDate.getMonth();

          return rentYear === selectedYear && rentMonth === selectedMonth;
        });

        return isDuplicate
          ? {
              monthName: monthNames[selectedMonth],
              year: selectedYear,
            }
          : null;
      })()
    : null;

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-2 md:p-3">
      {/* Toast Notifications */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-[#113F67] bg-clip-text text-transparent">
            Office Rent Management
          </h1>
          <p className="text-center text-purple-600 font-medium">
            Manage your office rent payments efficiently
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl shadow-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-800 border-l-4 border-red-500"
                : message.type === "success"
                  ? "bg-green-50 text-green-800 border-l-4 border-green-500"
                  : "bg-blue-50 text-blue-800 border-l-4 border-blue-500"
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3">
                {message.type === "error"
                  ? "âŒ"
                  : message.type === "success"
                    ? "âœ…"
                    : "â„¹ï¸"}
              </span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* User Info Banner */}
        <div className="mb-8 p-5 bg-[#113F67] rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <p className="text-sm text-purple-100">
                Logged in as:{" "}
                <span className="font-semibold text-white">{user.name}</span>
              </p>
              <p className="text-xs text-purple-200">
                Role:{" "}
                <span className="font-medium capitalize text-white">
                  {user.role}
                </span>
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                Office Rent Management
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1">
          {/* Left: Rent Form with ref for auto-scroll */}
          <div
            ref={formRef}
            className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 mb-4 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Rent Record" : "Add New Rent"}
              </h2>
              {editingId && (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-medium rounded-full animate-pulse">
                    Editing Mode
                  </span>
                  <button
                    onClick={cancelEdit}
                    disabled={loading}
                    className="px-3 py-1 text-sm bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-lg font-medium hover:from-gray-300 hover:to-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rent Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    (existingMonthWarning && !editingId) ||
                    (editingDuplicateWarning && editingId)
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                  disabled={loading}
                />

                {/* Warning for new entries */}
                {existingMonthWarning && !editingId && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <strong>Warning:</strong> A rent record for{" "}
                        {existingMonthWarning.monthName}{" "}
                        {existingMonthWarning.year} already exists.
                        <span className="block mt-1">
                          Please edit the existing record instead.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning for editing duplicates */}
                {editingDuplicateWarning && editingId && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <strong>Cannot Update:</strong> Changing date to{" "}
                        {editingDuplicateWarning.monthName}{" "}
                        {editingDuplicateWarning.year} would create a duplicate.
                        <span className="block mt-1">
                          Please keep the original date or choose a different
                          one.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-purple-600 font-medium">Note:</span>{" "}
                  Only one rent record per month is allowed
                </p>
              </div>

              {/* Rent Amount */}
              {/* Rent Amount - Compact Tailwind solution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rent Amount (BDT) *
                </label>
                <input
                  type="number"
                  name="rent"
                  placeholder="Enter rent amount in BDT"
                  value={formData.rent}
                  onChange={handleChange}
                  onWheel={(e) => {
                    e.preventDefault();
                    e.target.blur();
                  }}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowUp", "ArrowDown", "e", "E", "+", "-"].includes(
                        e.key,
                      )
                    )
                      e.preventDefault();
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  required
                  min="0"
                  step="0.01"
                  disabled={loading}
                  inputMode="decimal"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={loading}
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {formatPaymentMethod(method)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  name="note"
                  placeholder="Add any additional notes about this rent payment..."
                  value={formData.note}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (existingMonthWarning && !editingId) ||
                    (editingDuplicateWarning && editingId)
                  }
                  className={`flex-1 py-3 rounded-xl font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                    editingId
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      : (existingMonthWarning && !editingId) ||
                          (editingDuplicateWarning && editingId)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#113F67] hover:from-purple-700 hover:to-pink-700 text-white"
                  } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {editingId ? "Updating..." : "Saving..."}
                    </>
                  ) : existingMonthWarning && !editingId ? (
                    "Duplicate Month - Edit Existing"
                  ) : editingDuplicateWarning && editingId ? (
                    "Duplicate - Cannot Update"
                  ) : editingId ? (
                    "Update Rent Record"
                  ) : (
                    "Save Rent to Database"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Rent Records */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {filterYear !== "all" || filterMonth !== "all"
                    ? "Filtered Rent Records"
                    : "All Rent Records"}
                  <span className="text-lg font-normal text-purple-600 ml-2">
                    ({filteredRents.length} records)
                  </span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Total Amount:{" "}
                  <span className="font-bold text-purple-600">
                    {formatCurrency(calculateFilteredTotal())}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                {/* PDF Download Button */}
                {filteredRents.length > 0 && (
                  <button
                    onClick={generatePDF}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all flex items-center shadow-lg hover:shadow-xl"
                    title="Download PDF Report"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    PDF Report
                  </button>
                )}

                <button
                  onClick={() => {
                    fetchOfficeRents();
                    fetchStats();
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200 text-sm font-medium shadow-sm"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Sort Indicator */}
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl flex items-center">
              <svg
                className="w-5 h-5 text-purple-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                ></path>
              </svg>
              <p className="text-sm text-purple-800">
                <strong>Sorted by:</strong> Date (Newest to Oldest)
              </p>
            </div>

            {/* Filter Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-gray-50 rounded-xl border border-purple-100">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex flex-wrap gap-4">
                  {/* Year Filter */}
                  <div>
                    <label
                      htmlFor="yearFilter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Year
                    </label>
                    <select
                      id="yearFilter"
                      value={filterYear}
                      onChange={handleYearChange}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white"
                    >
                      <option value="all">All Years</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month Filter */}
                  <div>
                    <label
                      htmlFor="monthFilter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Month
                    </label>
                    <select
                      id="monthFilter"
                      value={filterMonth}
                      onChange={handleMonthChange}
                      disabled={filterYear === "all"}
                      className={`w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm ${
                        filterYear === "all"
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    >
                      <option value="all">All Months</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {monthNames[month - 1]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Active Filters Display */}
                  {(filterYear !== "all" || filterMonth !== "all") && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-purple-200">
                        <span className="text-sm text-purple-700">
                          {filterYear !== "all" && `Year: ${filterYear}`}
                          {filterYear !== "all" &&
                            filterMonth !== "all" &&
                            ", "}
                          {filterMonth !== "all" &&
                            `Month: ${monthNames[parseInt(filterMonth) - 1]}`}
                        </span>
                        <button
                          onClick={() => resetFilters()}
                          className="text-purple-500 hover:text-purple-700 text-sm"
                        >
                          âœ•
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reset Filters Button */}
                  {(filterYear !== "all" || filterMonth !== "all") && (
                    <div className="flex items-end">
                      <button
                        onClick={resetFilters}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors shadow-sm"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Results Count */}
                <div className="md:ml-auto text-right">
                  <span className="text-sm text-gray-600">
                    Showing {filteredRents.length} of {rents.length} record(s)
                  </span>
                  {filterYear !== "all" || filterMonth !== "all" ? (
                    <div className="text-sm font-medium text-green-600 mt-1">
                      Filtered Total: {formatCurrency(calculateFilteredTotal())}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Duplicate Warning Notice */}
            {existingMonthWarning && !editingId && (
              <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800">
                    <strong>Duplicate Month Detected:</strong> You cannot add
                    another rent record for {existingMonthWarning.monthName}{" "}
                    {existingMonthWarning.year}. Please edit the existing record
                    below.
                  </p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading rent records...</p>
                </div>
              </div>
            ) : filteredRents.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-10 h-10 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {filterYear === "all" && filterMonth === "all"
                      ? "No rent records yet"
                      : "No rent records found"}
                  </h3>
                  <p className="text-gray-500">
                    {filterYear === "all" && filterMonth === "all"
                      ? "Add your first rent record using the form!"
                      : "Try changing your filter criteria."}
                  </p>
                  {(filterYear !== "all" || filterMonth !== "all") && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 px-4 py-2 text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-purple-50 to-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                          <div className="text-xs font-normal text-purple-400 mt-1">
                            Month-Year
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredRents.map((rent, index) => {
                        const rentDate = new Date(rent.date);
                        const monthYear = `${monthNames[rentDate.getMonth()]} ${rentDate.getFullYear()}`;

                        return (
                          <tr
                            key={rent._id}
                            className={`hover:bg-purple-50 transition-colors ${editingId === rent._id ? "bg-gradient-to-r from-blue-50 to-purple-50" : ""}`}
                          >
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">
                                {formatDate(rent.date)}
                              </div>
                              <div className="text-xs text-purple-600 font-medium">
                                {monthYear}
                              </div>
                              {index === 0 && (
                                <div className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium rounded">
                                  Newest
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-purple-700">
                                {formatCurrency(rent.rent)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  rent.paymentMethod === "cash"
                                    ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800"
                                    : rent.paymentMethod === "bank_transfer"
                                      ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800"
                                      : rent.paymentMethod === "credit_card"
                                        ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800"
                                        : rent.paymentMethod === "debit_card"
                                          ? "bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-800"
                                          : rent.paymentMethod === "online"
                                            ? "bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800"
                                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                                }`}
                              >
                                {formatPaymentMethod(
                                  rent.paymentMethod || "cash",
                                )}
                              </span>
                              {rent.note && (
                                <div
                                  className="text-xs text-gray-500 mt-1 truncate max-w-xs"
                                  title={rent.note}
                                >
                                  {rent.note}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => fetchRentForEdit(rent._id)}
                                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors border border-purple-200 hover:border-purple-300 hover:shadow-md"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(rent._id)}
                                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-lg hover:from-red-100 hover:to-pink-100 transition-colors border border-red-200 hover:border-red-300 hover:shadow-md"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <h4 className="text-sm font-medium text-purple-900 mb-2">
                      {filterYear !== "all" || filterMonth !== "all"
                        ? "Filtered Total"
                        : "Total Amount"}
                    </h4>
                    <p className="text-2xl font-bold bg-[#113F67] bg-clip-text text-transparent">
                      {formatCurrency(calculateFilteredTotal())}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-purple-500">
                        {filteredRents.length} record(s)
                      </span>
                      <span className="text-xs text-purple-400">
                        Sorted: Newest First
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
