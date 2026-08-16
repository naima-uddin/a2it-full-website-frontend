'use client';

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from 'next/navigation';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Download,
  Trash2,
  Edit,
  FileText,
  RefreshCw,
  Calendar,
  TrendingUp,
  Shield,
  Info,
  Plus,
  Filter,
  Key,
  Lock,
  Crown,
  Sparkles,
  BarChart3,
  CreditCard,
  Wallet,
  DollarSign,
  Eye,
  EyeOff,
  LogOut,
  LogIn,
  User,
  Users
} from "lucide-react";

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 
                  type === 'error' ? 'bg-red-50 border-red-200' :
                  type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  type === 'info' ? 'bg-blue-50 border-blue-200' :
                  'bg-gray-50 border-gray-200';
  
  const textColor = type === 'success' ? 'text-green-800' : 
                    type === 'error' ? 'text-red-800' :
                    type === 'warning' ? 'text-yellow-800' :
                    type === 'info' ? 'text-blue-800' :
                    'text-gray-800';
  
  const iconColor = type === 'success' ? 'text-green-600' : 
                    type === 'error' ? 'text-red-600' :
                    type === 'warning' ? 'text-yellow-600' :
                    type === 'info' ? 'text-blue-600' :
                    'text-gray-600';

  const icons = {
    success: <CheckCircle className={`w-5 h-5 ${iconColor}`} />,
    error: <AlertCircle className={`w-5 h-5 ${iconColor}`} />,
    warning: <AlertCircle className={`w-5 h-5 ${iconColor}`} />,
    info: <Info className={`w-5 h-5 ${iconColor}`} />
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border ${bgColor} animate-slide-in`}>
      <div className="flex items-center space-x-3">
        {icons[type]}
        <div className="flex-1">
          <p className={`font-medium ${textColor}`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  itemName, 
  onConfirm,
  userRole 
}) => {
  if (!isOpen) return null;

  const canDelete = ['admin', 'moderator'].includes(userRole);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-in">
        <div className="flex items-start space-x-4 mb-6">
          <div className={`w-12 h-12 rounded-full ${canDelete ? 'bg-red-100' : 'bg-yellow-100'} flex items-center justify-center`}>
            {canDelete ? (
              <AlertCircle className="w-6 h-6 text-red-600" />
            ) : (
              <Shield className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">
              {canDelete ? 'Confirm Deletion' : 'Permission Required'}
            </h3>
            <p className="text-gray-600 mt-2">
              {canDelete ? (
                <>
                  Are you sure you want to delete <span className="font-bold text-gray-900">{itemName}</span>? 
                  This action cannot be undone.
                </>
              ) : (
                <>
                  Only administrators and moderators can delete records. 
                  Your current role: <span className="font-bold capitalize text-[#113F67]">{userRole}</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300"
          >
            Cancel
          </button>
          {canDelete ? (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl transition-all duration-300 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-[#113F67] bg-purple-100 hover:bg-purple-200 rounded-xl transition-all duration-300"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Stats Dashboard Component
const StatsDashboard = ({ expenses, userRole }) => {
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  // Calculate basic stats
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = expenses.length;
  const averageExpense = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

  // Calculate advanced stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses.filter(exp => {
    const date = new Date(exp.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Payment method distribution
  const paymentMethods = {
    'Cash': 0,
    'Card': 0,
    'Bank Transfer': 0,
    'Mobile Banking': 0
  };
  
  expenses.forEach(exp => {
    if (paymentMethods.hasOwnProperty(exp.paymentMethod)) {
      paymentMethods[exp.paymentMethod] += exp.amount;
    }
  });

  // Monthly trend
  const monthlyData = {};
  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        month: monthName,
        year: date.getFullYear(),
        total: 0,
        count: 0
      };
    }
    
    monthlyData[monthYear].total += exp.amount;
    monthlyData[monthYear].count += 1;
  });

  const sortedMonths = Object.values(monthlyData)
    .sort((a, b) => `${b.year}${b.month}`.localeCompare(`${a.year}${a.month}`))
    .slice(0, 6);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
            Expense Statistics
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Overview and insights of your extra expenses â€¢ Access: {userRole.toUpperCase()}
          </p>
        </div>
        <button
          onClick={() => setShowAdvancedStats(!showAdvancedStats)}
          className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-[#113F67] rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 flex items-center text-sm"
        >
          {showAdvancedStats ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showAdvancedStats ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Basic Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#113F67] font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-purple-800 mt-2">{totalExpenses}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-green-800 mt-2">
                {new Intl.NumberFormat('en-BD', {
                  style: 'currency',
                  currency: 'BDT',
                  minimumFractionDigits: 0
                }).format(totalAmount)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pink-700 font-medium">Average per Expense</p>
              <p className="text-2xl font-bold text-pink-800 mt-2">
                {new Intl.NumberFormat('en-BD', {
                  style: 'currency',
                  currency: 'BDT',
                  minimumFractionDigits: 0
                }).format(averageExpense)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">This Month</p>
              <p className="text-2xl font-bold text-blue-800 mt-2">
                {new Intl.NumberFormat('en-BD', {
                  style: 'currency',
                  currency: 'BDT',
                  minimumFractionDigits: 0
                }).format(thisMonthTotal)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Stats Section */}
      {showAdvancedStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
          {/* Payment Method Distribution */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
              Payment Method Distribution
            </h4>
            <div className="space-y-3">
              {Object.entries(paymentMethods).map(([method, amount]) => {
                const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
                return (
                  <div key={method} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{method}</span>
                      <span className="text-gray-600">
                        {new Intl.NumberFormat('en-BD', {
                          style: 'currency',
                          currency: 'BDT',
                          minimumFractionDigits: 0
                        }).format(amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          method === 'Cash' ? 'bg-yellow-500' :
                          method === 'Card' ? 'bg-purple-500' :
                          method === 'Bank Transfer' ? 'bg-blue-500' :
                          'bg-teal-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Monthly Trend */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Recent Monthly Trend
            </h4>
            <div className="space-y-3">
              {sortedMonths.map((monthData, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {monthData.month} {monthData.year}
                    </span>
                    <span className="text-gray-600">
                      {new Intl.NumberFormat('en-BD', {
                        style: 'currency',
                        currency: 'BDT',
                        minimumFractionDigits: 0
                      }).format(monthData.total)} ({monthData.count} expenses)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ 
                        width: `${Math.min((monthData.total / Math.max(...sortedMonths.map(m => m.total))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function page() {
  const router = useRouter();
  
  // User role state
  const [userRole, setUserRole] = useState("guest");
  const [authLoading, setAuthLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);
  
  // Delete confirmation state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemName: '',
    expenseId: null
  });

  const [expenses, setExpenses] = useState([
    {
      id: crypto.randomUUID(),
      expenseName: "",
      amount: "",
      date: "",
      paymentMethod: "Cash",
      note: "",
    },
  ]);

  const [storedExpenses, setStoredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    expenseName: "",
    amount: "",
    date: "",
    paymentMethod: "Cash",
    note: ""
  });

  // Filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  // Mobile menu state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Ref for edit form
  const editFormRef = useRef(null);

  // Month names for display
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Backend API URL
  const API_URL =
    process.env.NEXT_PUBLIC_HRM_API_URL || "http://localhost:5000/api/v1";

  // Payment methods - Backend à¦à¦° enum à¦à¦° à¦¸à¦¾à¦¥à§‡ match
  const paymentMethods = [
    "Cash", 
    "Card", 
    "Bank Transfer", 
    "Mobile Banking"
  ];

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Clear toast
  const clearToast = () => {
    setToast(null);
  };

  // Check user role on component mount
  useEffect(() => {
    checkUserRole();
    fetchStoredExpenses();
  }, []);

  // Update available years and months when storedExpenses changes
  useEffect(() => {
    if (storedExpenses.length > 0) {
      const years = Array.from(
        new Set(
          storedExpenses.map(expense => {
            const date = new Date(expense.date);
            return date.getFullYear();
          })
        )
      ).sort((a, b) => b - a);

      setAvailableYears(years);

      if (filterYear !== "all") {
        const yearExpenses = storedExpenses.filter(expense => {
          const date = new Date(expense.date);
          return date.getFullYear().toString() === filterYear;
        });

        const months = Array.from(
          new Set(
            yearExpenses.map(expense => {
              const date = new Date(expense.date);
              return date.getMonth() + 1;
            })
          )
        ).sort((a, b) => a - b);

        setAvailableMonths(months);
      } else {
        setAvailableMonths([]);
        setFilterMonth("all");
      }
    } else {
      setAvailableYears([]);
      setAvailableMonths([]);
    }
  }, [storedExpenses, filterYear]);

  // Scroll to edit form when editingId changes
  useEffect(() => {
    if (editingId && editFormRef.current) {
      setTimeout(() => {
        editFormRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [editingId]);

  // Check user role from tokens
  const checkUserRole = () => {
    const adminToken = localStorage.getItem('adminToken') || 
                      document.cookie.split('; ').find(row => row.startsWith('adminToken='))?.split('=')[1];
    
    const moderatorToken = localStorage.getItem('moderatorToken') || 
                          document.cookie.split('; ').find(row => row.startsWith('moderatorToken='))?.split('=')[1];

    if (adminToken) {
      setUserRole("admin");
      showToast('Admin access granted!', 'success');
    } else if (moderatorToken) {
      setUserRole("moderator");
      showToast('Moderator access granted!', 'success');
    } else {
      setUserRole("guest");
    }
  };

  // Helper function to get authentication headers
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const adminToken = localStorage.getItem('adminToken') || 
                      document.cookie.split('; ').find(row => row.startsWith('adminToken='))?.split('=')[1];
    
    const moderatorToken = localStorage.getItem('moderatorToken') || 
                          document.cookie.split('; ').find(row => row.startsWith('moderatorToken='))?.split('=')[1];
    
    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
      headers['X-User-Role'] = 'admin';
    } else if (moderatorToken) {
      headers['Authorization'] = `Bearer ${moderatorToken}`;
      headers['X-User-Role'] = 'moderator';
    }
    
    return headers;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return userRole !== "guest";
  };

  // Check if user has admin or moderator role
  const hasAdminOrModeratorAccess = () => {
    return isAuthenticated() && ['admin', 'moderator'].includes(userRole);
  };

  const fetchStoredExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_URL}/miscellaneous`, {
        headers: headers
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        const sortedExpenses = [...data.data].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        setStoredExpenses(sortedExpenses);
      } else {
        if (response.status === 401 || response.status === 403) {
          setError('Authentication required. Please login with admin or moderator token.');
          setStoredExpenses([]);
        } else {
          setError(data.message || 'Failed to load extra expenses');
        }
      }
    } catch (error) {
      console.error('Error fetching extra expenses:', error);
      setError('Network error. Please check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = storedExpenses;

    if (filterDate) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date).toISOString().split('T')[0];
        return expenseDate === filterDate;
      });
    }

    if (filterYear !== "all") {
      filtered = filtered.filter(expense => {
        const date = new Date(expense.date);
        return date.getFullYear().toString() === filterYear;
      });
    }

    if (filterMonth !== "all") {
      filtered = filtered.filter(expense => {
        const date = new Date(expense.date);
        return (date.getMonth() + 1).toString() === filterMonth;
      });
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [storedExpenses, filterDate, filterYear, filterMonth]);

  // Generate PDF function
  const generatePDF = () => {
    if (filteredExpenses.length === 0) {
      setError("No extra expenses to download");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(106, 13, 173);
      doc.setFont("helvetica", "bold");
      doc.text("Extra Expenses Report", pageWidth / 2, 20, { align: "center" });
      
      // Subtitle
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 30);
      
      // Filter info
      let filterInfo = "All Extra Expenses";
      if (filterDate) {
        filterInfo = `Date: ${new Date(filterDate).toLocaleDateString()}`;
      } else if (filterYear !== "all" || filterMonth !== "all") {
        filterInfo = `Filter: ${filterYear !== "all" ? `Year: ${filterYear}` : ""} ${filterMonth !== "all" ? `Month: ${monthNames[parseInt(filterMonth) - 1]}` : ""}`;
      }
      doc.text(`Report Type: ${filterInfo}`, 14, 36);
      doc.text(`Total Records: ${filteredExpenses.length}`, 14, 42);
      
      // User info
      doc.text(`Generated by: ${userRole.toUpperCase()} User`, 14, 48);
      doc.text(`Access Level: ${userRole.toUpperCase()}`, 14, 54);
      
      // Prepare table data
      const tableData = filteredExpenses.map(expense => [
        expense.expenseName,
        new Date(expense.date).toLocaleDateString(),
        `à§³ ${expense.amount.toFixed(2)}`,
        expense.paymentMethod || 'Cash',
        expense.note || "-"
      ]);
      
      // Add table
      autoTable(doc, {
        startY: 60,
        head: [['Expense Name', 'Date', 'Amount (à§³)', 'Payment Method', 'Note']],
        body: tableData,
        headStyles: {
          fillColor: [106, 13, 173],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 45 }
        },
        didDrawPage: function (data) {
          // Footer
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.setTextColor(150);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
        }
      });
      
      // Calculate totals
      const totalAmount = calculateFilteredTotal();
      const lastY = doc.lastAutoTable.finalY + 10;
      
      // Add summary section
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(106, 13, 173);
      doc.text("SUMMARY", 14, lastY);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Expenses: ${filteredExpenses.length}`, 14, lastY + 8);
      doc.text(`Total Amount: à§³ ${totalAmount.toFixed(2)}`, 14, lastY + 16);
      
      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const filename = `extra_expenses_${timestamp}.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
      showToast(`PDF report downloaded successfully!`, "success");
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const updateField = (id, field, value) => {
    setExpenses(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addExpense = () => {
    if (!hasAdminOrModeratorAccess()) {
      setError('Only admin or moderator can add expenses. Please login.');
      return;
    }

    setExpenses(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        expenseName: "",
        amount: "",
        date: "",
        paymentMethod: "Cash",
        note: "",
      },
    ]);
  };

  const removeExpense = (id) => {
    if (expenses.length === 1) return;
    setExpenses(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasAdminOrModeratorAccess()) {
      setError('Only admin or moderator can save expenses. Please login.');
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const validExpenses = expenses.filter(
      item => item.expenseName.trim() && item.amount && item.date
    );

    if (validExpenses.length === 0) {
      setError("Please add at least one extra expense");
      setSaving(false);
      return;
    }

    try {
      const headers = getAuthHeaders();

      const expensesToSave = validExpenses.map(expense => ({
        expenseName: expense.expenseName.trim(),
        amount: parseFloat(expense.amount),
        date: expense.date,
        paymentMethod: expense.paymentMethod || "Cash",
        note: expense.note || ""
      }));

      const response = await fetch(`${API_URL}/create-miscellaneous`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(expensesToSave),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`âœ… Successfully saved ${data.data.length} extra expense(s) as ${userRole.toUpperCase()}!`);
        setExpenses([{
          id: crypto.randomUUID(),
          expenseName: "",
          amount: "",
          date: "",
          paymentMethod: "Cash",
          note: "",
        }]);
        fetchStoredExpenses();
        
        if (data.warnings && data.warnings.length > 0) {
          console.warn('Warnings:', data.warnings);
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          setError('âŒ Authentication failed. Please login with admin or moderator token.');
        } else {
          setError(`âŒ ${data.message || 'Failed to save extra expenses'}`);
        }
      }
    } catch (error) {
      console.error('Error saving extra expenses:', error);
      setError('âŒ Network error. Please check if server is running.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditExpense = (expense) => {
    if (!hasAdminOrModeratorAccess()) {
      setError('Only admin or moderator can edit expenses. Please login.');
      return;
    }

    setEditingId(expense._id);
    setEditForm({
      expenseName: expense.expenseName,
      date: new Date(expense.date).toISOString().split('T')[0],
      amount: expense.amount.toString(),
      paymentMethod: expense.paymentMethod || "Cash",
      note: expense.note || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      expenseName: "",
      amount: "",
      date: "",
      paymentMethod: "Cash",
      note: ""
    });
    setSuccess('Edit mode cancelled');
  };

  const handleUpdateExpense = async () => {
    if (!editingId) return;

    if (!hasAdminOrModeratorAccess()) {
      setError('Only admin or moderator can update expenses. Please login.');
      return;
    }

    if (!editForm.expenseName.trim() || !editForm.amount || !editForm.date) {
      setError("Please fill all required fields");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const headers = getAuthHeaders();

      const updateData = {
        expenseName: editForm.expenseName.trim(),
        date: editForm.date,
        amount: parseFloat(editForm.amount),
        paymentMethod: editForm.paymentMethod || "Cash",
        note: editForm.note || ""
      };

      const response = await fetch(`${API_URL}/update-miscellaneous/${editingId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`âœ… Extra expense updated successfully as ${userRole.toUpperCase()}!`);
        fetchStoredExpenses();
        setEditingId(null);
        setEditForm({
          expenseName: "",
          amount: "",
          date: "",
          paymentMethod: "Cash",
          note: ""
        });
      } else {
        if (response.status === 401 || response.status === 403) {
          setError('âŒ Authentication failed. Please login with admin or moderator token.');
        } else {
          setError(`âŒ ${data.message || 'Failed to update extra expense'}`);
        }
      }
    } catch (error) {
      console.error('Error updating extra expense:', error);
      setError('âŒ Failed to update extra expense');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (expense) => {
    if (!hasAdminOrModeratorAccess()) {
      setError('Only admin or moderator can delete expenses. Please login.');
      return;
    }

    setDeleteModal({
      isOpen: true,
      itemName: `${expense.expenseName} (${formatCurrency(expense.amount)})`,
      expenseId: expense._id
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    const { expenseId } = deleteModal;
    
    if (!expenseId) {
      setError("No expense selected for deletion");
      return;
    }

    try {
      const headers = getAuthHeaders();

      const response = await fetch(`${API_URL}/delete-miscellaneous/${expenseId}`, {
        method: 'DELETE',
        headers: headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`âœ… Extra expense deleted successfully as ${userRole.toUpperCase()}!`);
        fetchStoredExpenses();
      } else {
        if (response.status === 401 || response.status === 403) {
          setError('âŒ Authentication failed. Please login with admin or moderator token.');
        } else {
          setError(`âŒ ${data.message || 'Failed to delete extra expense'}`);
        }
      }
    } catch (error) {
      console.error('Error deleting extra expense:', error);
      setError('âŒ Failed to delete extra expense');
    } finally {
      setDeleteModal({ isOpen: false, itemName: '', expenseId: null });
    }
  };

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency in Bangladeshi Taka (BDT)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate total for filtered expenses
  const calculateFilteredTotal = () => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Calculate total for all expenses
  const calculateTotal = () => {
    return storedExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterDate("");
    setFilterMonth("all");
    setFilterYear("all");
    setSuccess('All filters reset');
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

  // Check if any filter is active
  const isFilterActive = filterDate || filterYear !== "all" || filterMonth !== "all";

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Calculate form total
  const calculateFormTotal = () => {
    return expenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      return total + amount;
    }, 0);
  };

  // Handle token input
  const handleTokenInput = (tokenType) => {
    const token = prompt(`Enter ${tokenType} token:`);
    if (token) {
      localStorage.setItem(tokenType, token);
      checkUserRole();
      fetchStoredExpenses();
      showToast(`${tokenType} saved successfully!`, 'success');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('moderatorToken');
    setUserRole("guest");
    setStoredExpenses([]);
    setExpenses([{
      id: crypto.randomUUID(),
      expenseName: "",
      amount: "",
      date: "",
      paymentMethod: "Cash",
      note: "",
    }]);
    showToast('Logged out successfully!', 'info');
  };

  // Handle return to dashboard
  const handleReturnToDashboard = () => {
    router.push('/hrm/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notifications */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, itemName: '', expenseId: null })}
          itemName={deleteModal.itemName}
          onConfirm={handleDeleteConfirm}
          userRole={userRole}
        />

        {/* Header with Role Badge */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-center md:text-left text-transparent bg-clip-text bg-[#113F67]">
                Extra Expenses Management
              </h2>
              <p className="text-sm md:text-base text-center md:text-left text-purple-600 mt-1">
                Track and manage all your miscellaneous expenses
              </p>
            </div>
            
            {/* User Role and Token Management */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-purple-100">
                <div className={`w-3 h-3 rounded-full ${
                  userRole === "admin" ? "bg-purple-600" :
                  userRole === "moderator" ? "bg-indigo-500" :
                  "bg-gray-400"
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  Role: <span className={`font-bold ${
                    userRole === "admin" ? "text-purple-600" :
                    userRole === "moderator" ? "text-indigo-500" :
                    "text-gray-500"
                  }`}>{userRole.toUpperCase()}</span>
                </span>
              </div>
              
              {/* <div className="flex items-center space-x-2">
                {!isAuthenticated() ? (
                  <>
                    <button
                      onClick={() => handleTokenInput('adminToken')}
                      className="px-3 py-1.5 bg-[#113F67] hover:from-[#113F67] hover:to-pink-700 text-white text-sm rounded-md transition-all duration-300 flex items-center shadow-sm"
                    >
                      <Crown className="w-4 h-4 mr-1" />
                      Admin Login
                    </button>
                    <button
                      onClick={() => handleTokenInput('moderatorToken')}
                      className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white text-sm rounded-md transition-all duration-300 flex items-center shadow-sm"
                    >
                      <Key className="w-4 h-4 mr-1" />
                      Moderator Login
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleReturnToDashboard}
                      className="px-3 py-1.5 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm"
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 text-sm rounded-md transition-colors flex items-center shadow-sm"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </button>
                  </>
                )}
              </div> */}
            </div>
          </div>
          
          {/* Authentication Status */}
          {!isAuthenticated() && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-800">
                    ðŸ” Authentication Required
                  </h3>
                  <div className="mt-2 text-sm text-[#113F67]">
                    <p>Please login with either:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>Admin Token</strong> - Full access to all features</li>
                      <li><strong>Moderator Token</strong> - Limited access to manage expenses</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Access Level Banner */}
          <div className={`rounded-xl p-4 text-white mt-4 ${
            userRole === 'admin' 
              ? 'bg-[#113F67]' 
              : userRole === 'moderator'
              ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {userRole === 'admin' ? (
                    <Crown className="w-5 h-5" />
                  ) : userRole === 'moderator' ? (
                    <Key className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {userRole === 'admin' ? 'Admin Access Granted' :
                     userRole === 'moderator' ? 'Moderator Access Granted' :
                     'View-Only Access'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {userRole === 'admin' ? 'Full management privileges' :
                     userRole === 'moderator' ? 'Limited management privileges' :
                     'Login required for full access'}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-xs opacity-80">Total Expenses</div>
                  <div className="text-xl font-bold">{storedExpenses.length}</div>
                </div>
                <div className="h-8 w-px bg-white/30"></div>
                <div className="text-right">
                  <div className="text-xs opacity-80">Total Amount</div>
                  <div className="text-xl font-bold">
                    {formatCurrency(calculateTotal())}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard expenses={storedExpenses} userRole={userRole} />

        {/* Form Section - Only for Admin & Moderator */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6 md:mb-8 border border-purple-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <div>
              <h3 className="text-lg font-bold text-purple-900 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-purple-600" />
                Add New Extra Expenses
              </h3>
              <p className="text-sm text-purple-600 mt-1">
                {userRole === "admin" ? "ðŸ”“ Full administrative access" :
                 userRole === "moderator" ? "ðŸ” Moderate access" :
                 "ðŸ”’ Login required to add expenses"}
              </p>
            </div>
            <button
              onClick={addExpense}
              disabled={!hasAdminOrModeratorAccess()}
              className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-sm ${
                !hasAdminOrModeratorAccess()
                  ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-[#113F67] hover:from-purple-600 hover:to-indigo-600 text-white shadow-md"
              }`}
            >
              <Plus className="w-4 h-4 mr-1 inline" />
              Add Expense
            </button>
          </div>
          
          {/* Messages */}
          {error && !editingId && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}
          {success && !editingId && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700 font-medium">{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header Row - Hidden on mobile, visible on tablet+ */}
            <div className="hidden md:grid md:grid-cols-12 gap-3 text-sm font-bold text-[#113F67] px-1 bg-purple-50 p-3 rounded-lg">
              <div className="col-span-3">Expense Name</div>
              <div className="col-span-2">Amount (à§³)</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Payment Method</div>
              <div className="col-span-2">Note (Optional)</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {expenses.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-3 items-center p-4 md:p-3 border border-purple-100 rounded-lg mb-4 md:mb-3 bg-gradient-to-br from-white to-purple-50"
              >
                {/* Mobile View - Vertical Layout */}
                <div className="md:hidden space-y-3 w-full">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#113F67] mb-1">
                        Expense Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Office Party, Stationery"
                        value={item.expenseName}
                        onChange={(e) =>
                          updateField(item.id, "expenseName", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        required
                        disabled={!hasAdminOrModeratorAccess()}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#113F67] mb-1">
                        Amount (à§³) *
                      </label>
                      <input
                        type="number"
                        placeholder="Amount in à§³"
                        value={item.amount}
                        onChange={(e) =>
                          updateField(item.id, "amount", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        required
                        min="0"
                        step="0.01"
                        disabled={!hasAdminOrModeratorAccess()}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#113F67] mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={item.date}
                        max={getTodayDate()}
                        onChange={(e) =>
                          updateField(item.id, "date", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        required
                        disabled={!hasAdminOrModeratorAccess()}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#113F67] mb-1">
                        Payment Method *
                      </label>
                      <select
                        value={item.paymentMethod}
                        onChange={(e) =>
                          updateField(item.id, "paymentMethod", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        required
                        disabled={!hasAdminOrModeratorAccess()}
                      >
                        <option value="">Select</option>
                        {paymentMethods.map(method => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#113F67] mb-1">
                      Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Optional note"
                      value={item.note}
                      onChange={(e) =>
                        updateField(item.id, "note", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      disabled={!hasAdminOrModeratorAccess()}
                    />
                  </div>
                  
                  {expenses.length > 1 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => removeExpense(item.id)}
                        disabled={!hasAdminOrModeratorAccess()}
                        className={`w-full py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                          !hasAdminOrModeratorAccess()
                            ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md"
                        }`}
                      >
                        <Trash2 className="w-4 h-4 mr-1 inline" />
                        Remove This Entry
                      </button>
                    </div>
                  )}
                </div>

                {/* Desktop View - Grid Layout */}
                {/* Expense Name */}
                <div className="hidden md:block col-span-3">
                  <input
                    type="text"
                    placeholder="e.g. Office Party, Stationery"
                    value={item.expenseName}
                    onChange={(e) =>
                      updateField(item.id, "expenseName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                    required
                    disabled={!hasAdminOrModeratorAccess()}
                  />
                </div>

                {/* Amount */}
                <div className="hidden md:block col-span-2">
                  <input
                    type="number"
                    placeholder="Amount in à§³"
                    value={item.amount}
                    onChange={(e) =>
                      updateField(item.id, "amount", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                    required
                    min="0"
                    step="0.01"
                    disabled={!hasAdminOrModeratorAccess()}
                  />
                </div>

                {/* Date */}
                <div className="hidden md:block col-span-2">
                  <input
                    type="date"
                    value={item.date}
                    max={getTodayDate()}
                    onChange={(e) =>
                      updateField(item.id, "date", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                    required
                    disabled={!hasAdminOrModeratorAccess()}
                  />
                </div>

                {/* Payment Method */}
                <div className="hidden md:block col-span-2">
                  <select
                    value={item.paymentMethod}
                    onChange={(e) =>
                      updateField(item.id, "paymentMethod", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                    required
                    disabled={!hasAdminOrModeratorAccess()}
                  >
                    <option value="">Select</option>
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Note (Optional) */}
                <div className="hidden md:block col-span-2">
                  <input
                    type="text"
                    placeholder="Optional note"
                    value={item.note}
                    onChange={(e) =>
                      updateField(item.id, "note", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                    disabled={!hasAdminOrModeratorAccess()}
                  />
                </div>

                {/* Remove - Desktop */}
                <div className="hidden md:block col-span-1">
                  {expenses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExpense(item.id)}
                      disabled={!hasAdminOrModeratorAccess()}
                      className={`w-full py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                        !hasAdminOrModeratorAccess()
                          ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Form Total */}
            <div className="flex justify-between items-center mb-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
              <div className="text-lg font-bold text-purple-900">
                Form Total: {formatCurrency(calculateFormTotal())}
              </div>
              <div className="text-sm text-purple-600">
                {expenses.length} item(s) to save
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <button
                type="button"
                onClick={addExpense}
                disabled={!hasAdminOrModeratorAccess()}
                className={`hidden md:block w-full py-3 rounded-lg transition-all duration-300 text-sm font-medium border-2 ${
                  !hasAdminOrModeratorAccess()
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600"
                }`}
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Add More Expense Rows
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving || !hasAdminOrModeratorAccess()}
                className={`w-full py-3 md:py-3 rounded-lg transition-all duration-300 text-sm md:text-base font-bold shadow-lg ${
                  saving
                    ? 'bg-gradient-to-r from-purple-400 to-indigo-400 cursor-not-allowed'
                    : !hasAdminOrModeratorAccess()
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                    : 'bg-[#113F67] hover:from-[#113F67] hover:to-indigo-700 hover:shadow-xl'
                } text-white`}
              >
                {!hasAdminOrModeratorAccess() ? (
                  <span className="flex items-center justify-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Login Required to Save
                  </span>
                ) : saving ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2 text-white" />
                    Saving as {userRole.toUpperCase()}...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Save Extra Expenses as {userRole.toUpperCase()}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Edit Form Section */}
        {editingId && (
          <div 
            ref={editFormRef} 
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-xl p-4 md:p-6 mb-6 md:mb-8 border-2 border-purple-300"
            id="edit-form-section"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <div>
                <h3 className="text-base md:text-lg font-bold text-purple-900 flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Extra Expense
                </h3>
                <p className="text-sm text-purple-600 mt-1">
                  Editing as <span className="font-bold text-[#113F67]">{userRole.toUpperCase()}</span>
                </p>
              </div>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Close Edit
              </button>
            </div>
            
            {/* Messages in Edit Mode */}
            {error && (
              <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">{success}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-3 items-start">
              {/* Expense Name */}
              <div className="md:col-span-3">
                <label className="block text-xs md:text-sm font-bold text-[#113F67] mb-1">
                  Expense Name *
                </label>
                <input
                  type="text"
                  value={editForm.expenseName}
                  onChange={(e) => setEditForm({...editForm, expenseName: e.target.value})}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                  required
                  placeholder="e.g., Office Party, Stationery"
                />
              </div>

              {/* Amount */}
              <div className="md:col-span-2 mt-3 md:mt-0">
                <label className="block text-xs md:text-sm font-bold text-[#113F67] mb-1">
                  Amount (à§³) *
                </label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>

              {/* Date */}
              <div className="md:col-span-2 mt-3 md:mt-0">
                <label className="block text-xs md:text-sm font-bold text-[#113F67] mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={editForm.date}
                  max={getTodayDate()}
                  onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="md:col-span-2 mt-3 md:mt-0">
                <label className="block text-xs md:text-sm font-bold text-[#113F67] mb-1">
                  Payment Method *
                </label>
                <select
                  value={editForm.paymentMethod}
                  onChange={(e) => setEditForm({...editForm, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                  required
                >
                  <option value="">Select Method</option>
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <div className="md:col-span-2 mt-3 md:mt-0">
                <label className="block text-xs md:text-sm font-bold text-[#113F67] mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={editForm.note}
                  onChange={(e) => setEditForm({...editForm, note: e.target.value})}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                  placeholder="Optional note"
                />
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-1 flex space-x-2 pt-6 md:pt-0 md:items-end">
                <button
                  onClick={handleUpdateExpense}
                  disabled={saving || !hasAdminOrModeratorAccess()}
                  className={`flex-1 py-3 md:py-2 rounded-lg transition-all duration-300 text-sm md:text-base font-bold shadow-md ${
                    saving
                      ? 'bg-gradient-to-r from-purple-400 to-indigo-400 cursor-not-allowed'
                      : !hasAdminOrModeratorAccess()
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                      : 'bg-[#113F67] hover:from-[#113F67] hover:to-indigo-700 hover:shadow-lg'
                  } text-white`}
                >
                  {!hasAdminOrModeratorAccess() ? (
                    'Login Required'
                  ) : saving ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-2 text-white" />
                      Updating...
                    </span>
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stored Extra Expenses Table Section */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-3 md:space-y-0">
            <div>
              <h3 className="text-lg font-bold text-purple-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Stored Extra Expenses
                <span className="ml-3 px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-[#113F67] rounded-full text-xs font-medium">
                  {filteredExpenses.length} records
                </span>
              </h3>
              <div className="mt-1 text-sm text-purple-600 flex items-center gap-2">
                {isAuthenticated() && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-100 to-indigo-100 text-[#113F67] rounded-full text-xs font-medium">
                    Access as: {userRole}
                  </span>
                )}
                <span>
                  {isFilterActive ? (
                    `Showing ${filteredExpenses.length} of ${storedExpenses.length} expense(s)`
                  ) : (
                    `Total: ${storedExpenses.length} expense(s)`
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* PDF Download Button */}
              {filteredExpenses.length > 0 && (
                <button
                  onClick={generatePDF}
                  disabled={!isAuthenticated()}
                  className={`px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base font-medium shadow-md ${
                    !isAuthenticated()
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg text-white"
                  }`}
                  title="Download PDF Report"
                >
                  <span className="flex items-center">
                    <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {!isAuthenticated() ? 'Login to Download' : 'Download PDF'}
                  </span>
                </button>
              )}
              
              {/* Mobile Filters Toggle */}
              <button
                onClick={toggleMobileFilters}
                className="md:hidden px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-[#113F67] rounded-lg transition-colors flex items-center shadow-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              
              <button
                onClick={fetchStoredExpenses}
                disabled={loading || !isAuthenticated()}
                className={`px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base font-medium shadow-md ${
                  loading || !isAuthenticated()
                    ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-[#113F67] hover:shadow-lg"
                }`}
              >
                <span className="flex items-center">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {!isAuthenticated() ? 'Login to Refresh' : loading ? 'Refreshing...' : 'Refresh Data'}
                </span>
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block mb-4 md:mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100`}>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-[#113F67] flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by:
                </span>
                <button
                  onClick={toggleMobileFilters}
                  className="md:hidden text-purple-500 hover:text-[#113F67]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-4">
                {/* Date Filter */}
                <div className="w-full md:w-auto">
                  <label htmlFor="filterDate" className="block text-xs md:text-sm font-bold text-[#113F67] mb-1">
                    Specific Date
                  </label>
                  <input
                    type="date"
                    id="filterDate"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full md:w-40 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                    max={getTodayDate()}
                  />
                </div>

                {/* Year Filter */}
                <div className="w-full md:w-auto">
                  <label htmlFor="filterYear" className="block text-xs md:text-sm font-bold text-[#113F67] mb-1">
                    Year
                  </label>
                  <select
                    id="filterYear"
                    value={filterYear}
                    onChange={handleYearChange}
                    className="w-full md:w-32 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Month Filter */}
                <div className="w-full md:w-auto">
                  <label htmlFor="filterMonth" className="block text-xs md:text-sm font-bold text-[#113F67] mb-1">
                    Month
                  </label>
                  <select
                    id="filterMonth"
                    value={filterMonth}
                    onChange={handleMonthChange}
                    disabled={filterYear === "all"}
                    className={`w-full md:w-40 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
                      filterYear === "all" ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'bg-white border-purple-200'
                    }`}
                  >
                    <option value="all">All Months</option>
                    {availableMonths.map(month => (
                      <option key={month} value={month}>
                        {monthNames[month - 1]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active Filters Display */}
                {isFilterActive && (
                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <div className="flex flex-wrap items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 rounded-lg border border-purple-200">
                      <span className="text-xs text-[#113F67] font-medium">
                        {filterDate && `Date: ${new Date(filterDate).toLocaleDateString()}`}
                        {filterDate && (filterYear !== "all" || filterMonth !== "all") && ", "}
                        {filterYear !== "all" && `Year: ${filterYear}`}
                        {filterYear !== "all" && filterMonth !== "all" && ", "}
                        {filterMonth !== "all" && `Month: ${monthNames[parseInt(filterMonth) - 1]}`}
                      </span>
                      <button
                        onClick={() => resetFilters()}
                        className="text-purple-500 hover:text-[#113F67] text-sm"
                      >
                        âœ• Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Reset Filters Button */}
                {isFilterActive && (
                  <div className="w-full md:w-auto flex md:items-end">
                    <button
                      onClick={resetFilters}
                      className="w-full md:w-auto px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-900 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg transition-colors border border-purple-200"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Results Count - Desktop only */}
              <div className="hidden md:block ml-auto text-right">
                <span className="text-sm text-purple-600 font-medium">
                  Showing {filteredExpenses.length} of {storedExpenses.length} record(s)
                </span>
                {isFilterActive && (
                  <div className="text-sm font-bold text-green-600 mt-1">
                    Filtered Total: {formatCurrency(calculateFilteredTotal())}
                  </div>
                )}
              </div>
            </div>
            
            {/* Results Count - Mobile only */}
            <div className="md:hidden mt-4 pt-4 border-t border-purple-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-600 font-medium">
                  Showing {filteredExpenses.length} of {storedExpenses.length}
                </span>
                {isFilterActive && (
                  <span className="text-sm font-bold text-green-600">
                    Total: {formatCurrency(calculateFilteredTotal())}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sort Indicator */}
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg flex items-center">
            <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
            <p className="text-xs md:text-sm text-purple-800 font-medium">
              <strong>Sorted by:</strong> Date (Newest to Oldest) â€¢ <strong>Access Level:</strong> {userRole.toUpperCase()}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-purple-600 text-sm md:text-base font-medium">Loading extra expenses...</p>
              <p className="text-xs text-purple-500 mt-1">Fetching data as {userRole}</p>
            </div>
          ) : !isAuthenticated() ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-purple-900 mb-3">Authentication Required</h4>
                <p className="text-purple-600 mb-6">Please login with Admin or Moderator token to view extra expenses.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => handleTokenInput('adminToken')}
                    className="px-4 py-3 bg-[#113F67] hover:from-[#113F67] hover:to-pink-700 text-white rounded-lg transition-all duration-300 font-medium shadow-md"
                  >
                    Login as Admin
                  </button>
                  <button
                    onClick={() => handleTokenInput('moderatorToken')}
                    className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 font-medium shadow-md"
                  >
                    Login as Moderator
                  </button>
                </div>
              </div>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                {isFilterActive ? (
                  <>
                    <h4 className="text-xl font-bold text-purple-900 mb-3">No Expenses Found</h4>
                    <p className="text-purple-600 mb-6">No extra expenses found for the selected filters.</p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-3 bg-[#113F67] hover:from-[#113F67] hover:to-pink-700 text-white rounded-lg transition-all duration-300 font-medium shadow-md"
                    >
                      Reset Filters
                    </button>
                  </>
                ) : (
                  <>
                    <h4 className="text-xl font-bold text-purple-900 mb-3">No Expenses Yet</h4>
                    <p className="text-purple-600 mb-6">No extra expenses stored yet. Add some using the form above.</p>
                    <p className="text-sm text-purple-500">
                      Logged in as: <span className="font-bold">{userRole.toUpperCase()}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredExpenses.map((expense, index) => (
                  <div key={expense._id} className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-purple-900">{expense.expenseName}</h4>
                        <div className="text-xs text-purple-600 mt-1 flex items-center gap-2">
                          {formatDate(expense.date)}
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-[#113F67] text-xs font-bold rounded-full">
                              NEWEST
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-700 text-lg">{formatCurrency(expense.amount)}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          expense.paymentMethod === 'Cash' ? 'bg-yellow-100 text-yellow-800' :
                          expense.paymentMethod === 'Card' ? 'bg-purple-100 text-purple-800' :
                          expense.paymentMethod === 'Bank Transfer' ? 'bg-blue-100 text-blue-800' :
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {expense.paymentMethod}
                        </span>
                      </div>
                    </div>
                    
                    {expense.note && (
                      <div className="text-sm text-purple-600 mb-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <span className="font-bold">ðŸ“ Note:</span> {expense.note}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-3 border-t border-purple-200">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        disabled={!hasAdminOrModeratorAccess()}
                        className={`flex-1 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium shadow-sm ${
                          !hasAdminOrModeratorAccess()
                            ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-[#113F67] hover:shadow-md'
                        }`}
                      >
                        <span className="flex items-center justify-center">
                          <Edit className="w-4 h-4 mr-2" />
                          {!hasAdminOrModeratorAccess() ? 'Login to Edit' : 'Edit'}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(expense)}
                        disabled={!hasAdminOrModeratorAccess()}
                        className={`flex-1 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium shadow-sm ${
                          !hasAdminOrModeratorAccess()
                            ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-700 hover:shadow-md'
                        }`}
                      >
                        <span className="flex items-center justify-center">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {!hasAdminOrModeratorAccess() ? 'Login to Delete' : 'Delete'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Mobile Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mt-4 border border-purple-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-purple-900 text-lg">
                      {isFilterActive ? "Filtered Total" : "Total"}
                    </span>
                    <span className="font-bold text-purple-900 text-xl">{formatCurrency(calculateFilteredTotal())}</span>
                  </div>
                  <div className="text-xs text-purple-600 font-medium">
                    {filteredExpenses.length} expense(s) â€¢ Access: {userRole.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-purple-100">
                <table className="min-w-full divide-y divide-purple-100">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#113F67] uppercase tracking-wider">
                        Expense Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#113F67] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#113F67] uppercase tracking-wider">
                        Amount (à§³)
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#113F67] uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#113F67] uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#113F67] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-purple-50">
                    {filteredExpenses.map((expense, index) => (
                      <tr key={expense._id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-purple-900">
                            {expense.expenseName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-purple-900">
                            {formatDate(expense.date)}
                          </div>
                          <div className="text-xs text-purple-600">
                            {monthNames[new Date(expense.date).getMonth()]} {new Date(expense.date).getFullYear()}
                          </div>
                          {index === 0 && (
                            <div className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-[#113F67] text-xs font-bold rounded-full">
                              NEWEST
                            </div>
                          )}
                          {index === filteredExpenses.length - 1 && filteredExpenses.length > 1 && (
                            <div className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-bold rounded-full">
                              OLDEST
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-green-700">
                            {formatCurrency(expense.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                            expense.paymentMethod === 'Cash' ? 'bg-yellow-100 text-yellow-800' :
                            expense.paymentMethod === 'Card' ? 'bg-purple-100 text-purple-800' :
                            expense.paymentMethod === 'Bank Transfer' ? 'bg-blue-100 text-blue-800' :
                            'bg-teal-100 text-teal-800'
                          }`}>
                            {expense.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-purple-600 max-w-xs truncate">
                            {expense.note || <span className="text-purple-400">-</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditExpense(expense)}
                              disabled={!hasAdminOrModeratorAccess()}
                              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-sm ${
                                !hasAdminOrModeratorAccess()
                                  ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-[#113F67] hover:shadow-md'
                              }`}
                            >
                              <span className="flex items-center">
                                <Edit className="w-4 h-4 mr-1" />
                                {!hasAdminOrModeratorAccess() ? 'Login to Edit' : 'Edit'}
                              </span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(expense)}
                              disabled={!hasAdminOrModeratorAccess()}
                              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-sm ${
                                !hasAdminOrModeratorAccess()
                                  ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-700 hover:shadow-md'
                              }`}
                            >
                              <span className="flex items-center">
                                <Trash2 className="w-4 h-4 mr-1" />
                                {!hasAdminOrModeratorAccess() ? 'Login to Delete' : 'Delete'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-sm font-bold text-purple-900">
                        {isFilterActive ? "Filtered Total" : "Total"}
                        {isFilterActive && (
                          <div className="text-xs font-normal text-purple-600 mt-1">
                            {filterDate && `Date: ${new Date(filterDate).toLocaleDateString()}`}
                            {filterDate && (filterYear !== "all" || filterMonth !== "all") && " â€¢ "}
                            {filterYear !== "all" && `Year: ${filterYear}`}
                            {filterYear !== "all" && filterMonth !== "all" && " â€¢ "}
                            {filterMonth !== "all" && `Month: ${monthNames[parseInt(filterMonth) - 1]}`}
                          </div>
                        )}
                        <div className="text-xs font-normal text-purple-500 mt-1">
                          Sorted: Newest to Oldest â€¢ Access: {userRole.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-purple-900">
                          {formatCurrency(calculateFilteredTotal())}
                        </div>
                        {filteredExpenses.length > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            Average: {formatCurrency(calculateFilteredTotal() / filteredExpenses.length)}
                          </div>
                        )}
                      </td>
                      <td colSpan="3" className="px-6 py-4 text-sm text-purple-600 font-medium">
                        <div className="flex items-center">
                          <BarChart3 className="w-4 h-4 mr-2 text-purple-500" />
                          {filteredExpenses.length} expense(s)
                        </div>
                        {filteredExpenses.length > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            Showing {Math.min(filteredExpenses.length, 10)} of {filteredExpenses.length} records
                          </div>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Summary Stats */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6 rounded-xl border border-purple-100 shadow-sm">
                  <h4 className="text-xs md:text-sm font-bold text-purple-900">
                    {isFilterActive ? "Filtered Expenses" : "Total Expenses"}
                  </h4>
                  <p className="text-2xl md:text-3xl font-bold text-[#113F67] mt-2">{filteredExpenses.length}</p>
                  <div className="text-xs text-purple-600 mt-2">Managed by {userRole}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-xl border border-green-100 shadow-sm">
                  <h4 className="text-xs md:text-sm font-bold text-green-900">
                    {isFilterActive ? "Filtered Cost" : "Total Cost"}
                  </h4>
                  <p className="text-2xl md:text-3xl font-bold text-green-700 mt-2">{formatCurrency(calculateFilteredTotal())}</p>
                  <div className="text-xs text-green-600 mt-2">Bangladeshi Taka</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 md:p-6 rounded-xl border border-pink-100 shadow-sm">
                  <h4 className="text-xs md:text-sm font-bold text-pink-900">Expense Types</h4>
                  <p className="text-2xl md:text-3xl font-bold text-pink-700 mt-2">
                    {[...new Set(filteredExpenses.map(expense => expense.expenseName))].length}
                  </p>
                  <div className="text-xs text-pink-600 mt-2">Unique categories</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 rounded-xl border border-blue-100 shadow-sm">
                  <h4 className="text-xs md:text-sm font-bold text-blue-900">Access Level</h4>
                  <p className="text-2xl md:text-3xl font-bold text-blue-700 mt-2">{userRole.toUpperCase()}</p>
                  <div className="text-xs text-blue-600 mt-2">Current user role</div>
                </div>
              </div>

              {/* Expense Type Breakdown */}
              {filteredExpenses.length > 0 && (
                <div className="mt-8 md:mt-10">
                  <h4 className="text-base md:text-lg font-bold text-purple-900 mb-4">
                    {isFilterActive ? "Filtered Expense Type Breakdown" : "Expense Type Breakdown"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {Object.entries(
                      filteredExpenses.reduce((acc, expense) => {
                        acc[expense.expenseName] = (acc[expense.expenseName] || 0) + expense.amount;
                        return acc;
                      }, {})
                    ).map(([expenseName, totalAmount]) => (
                      <div key={expenseName} className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm md:text-base font-bold text-purple-900 truncate mr-2">{expenseName}</span>
                          <span className="text-sm md:text-base font-bold text-purple-900 whitespace-nowrap">{formatCurrency(totalAmount)}</span>
                        </div>
                        <div className="mb-1 flex justify-between text-xs text-purple-600">
                          <span>{(totalAmount / calculateFilteredTotal() * 100).toFixed(1)}% of total</span>
                          <span>{((filteredExpenses.filter(e => e.expenseName === expenseName).length / filteredExpenses.length) * 100).toFixed(1)}% by count</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div 
                            className="bg-[#113F67] h-2 rounded-full" 
                            style={{ 
                              width: `${(totalAmount / calculateFilteredTotal()) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-purple-200">
          <div className="text-center text-sm text-purple-600">
            <p>Extra Expense Management System â€¢ {new Date().getFullYear()}</p>
            <p className="mt-1">Access Level: <span className="font-bold text-[#113F67]">{userRole.toUpperCase()}</span></p>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-purple-500">
              <span>Total Expenses: {storedExpenses.length}</span>
              <span>â€¢</span>
              <span>Total Amount: {formatCurrency(calculateTotal())}</span>
              <span>â€¢</span>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
