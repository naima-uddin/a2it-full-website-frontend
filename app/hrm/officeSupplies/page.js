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
  LogOut,
  Plus,
  XCircle,
  Package,
  ShoppingCart,
  BarChart3,
  Filter
} from "lucide-react";

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 
                  type === 'error' ? 'bg-red-50 border-red-200' :
                  type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200';
  const textColor = type === 'success' ? 'text-green-700' : 
                    type === 'error' ? 'text-red-700' :
                    type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700';
  const iconColor = type === 'success' ? 'text-green-600' : 
                    type === 'error' ? 'text-red-600' :
                    type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600';

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border ${bgColor} animate-slide-in`}>
      <div className="flex items-center space-x-3">
        {type === 'success' ? (
          <CheckCircle className={`w-5 h-5 ${iconColor}`} />
        ) : type === 'error' ? (
          <AlertCircle className={`w-5 h-5 ${iconColor}`} />
        ) : type === 'warning' ? (
          <AlertCircle className={`w-5 h-5 ${iconColor}`} />
        ) : (
          <AlertCircle className={`w-5 h-5 ${iconColor}`} />
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
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ 
  itemName, 
  itemType = "supply item", 
  onConfirm, 
  onCancel 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCancel();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 border border-purple-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to delete <span className="font-medium text-purple-700">{itemName}</span>? 
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function page() {
  const router = useRouter();
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeToken, setActiveToken] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState(null);
  
  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  
  // Form state
  const [supplies, setSupplies] = useState([]);
  const [storedSupplies, setStoredSupplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    date: "",
    price: "",
    paymentMethod: "",
    note: ""
  });

  // Filter states
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);

  // Track which supply is being deleted
  const [deletingSupplyId, setDeletingSupplyId] = useState(null);

  // Ref for edit form
  const editFormRef = useRef(null);

  // API URL
  const API_URL = useMemo(() => 
    `${process.env.NEXT_PUBLIC_HRM_API_URL || 'http://localhost:5000/api/v1'}`, 
  []);

  // Month names for display
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Common supply items for suggestions
  const commonSupplyTypes = [
    "Printer Paper", "Pens & Markers", "Stationery", "Cleaning Supplies",
    "Coffee & Tea", "Toner & Ink", "Notebooks", "Files & Folders",
    "Office Furniture", "Tech Accessories", "Other"
  ];

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Clear toast
  const clearToast = () => {
    setToast(null);
  };

  // Show delete confirmation
  const showDeleteConfirmation = (supplyId, itemName, itemType) => {
    setDeleteConfirmation({
      supplyId,
      itemName,
      itemType
    });
  };

  // Clear delete confirmation
  const clearDeleteConfirmation = () => {
    setDeleteConfirmation(null);
    setDeletingSupplyId(null);
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Initialize data after authentication
  useEffect(() => {
    if (user && activeToken && !authLoading) {
      fetchStoredSupplies();
    }
  }, [user, activeToken, authLoading]);

  // Update years and months when supplies change
  useEffect(() => {
    if (storedSupplies.length > 0) {
      const uniqueYears = Array.from(
        new Set(
          storedSupplies.map(supply => {
            const date = new Date(supply.date);
            return date.getFullYear();
          })
        )
      ).sort((a, b) => b - a);

      setYears(uniqueYears);

      if (selectedYear !== "all") {
        const yearSupplies = storedSupplies.filter(supply => {
          const date = new Date(supply.date);
          return date.getFullYear().toString() === selectedYear;
        });

        const uniqueMonths = Array.from(
          new Set(
            yearSupplies.map(supply => {
              const date = new Date(supply.date);
              return date.getMonth() + 1;
            })
          )
        ).sort((a, b) => a - b);

        setMonths(uniqueMonths);
      } else {
        setMonths([]);
      }
    } else {
      setYears([]);
      setMonths([]);
    }
  }, [storedSupplies, selectedYear]);

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

  // Authentication function
  const checkAuthentication = () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const moderatorToken = localStorage.getItem('moderatorToken');
      
      let activeToken = null;
      let userInfo = null;
      let userRole = '';
      
      if (adminToken) {
        activeToken = adminToken;
        userRole = 'admin';
        const adminData = localStorage.getItem('adminData');
        if (adminData) {
          try {
            userInfo = JSON.parse(adminData);
            userInfo.role = 'admin';
          } catch (e) {
            console.error("Error parsing admin data:", e);
          }
        }
      } 
      else if (moderatorToken) {
        activeToken = moderatorToken;
        userRole = 'moderator';
        const moderatorData = localStorage.getItem('moderatorData');
        if (moderatorData) {
          try {
            userInfo = JSON.parse(moderatorData);
            userInfo.role = 'moderator';
          } catch (e) {
            console.error("Error parsing moderator data:", e);
          }
        }
      }
      
      if (!activeToken) {
        console.log("Access denied: Only admin or moderator tokens are allowed");
        showToast('Access denied. This page is only for administrators and moderators.', 'error');
        setTimeout(() => router.push('/hrm/dashboard'), 2000);
        return;
      }
      
      if (!userInfo) {
        userInfo = {
          name: userRole === 'admin' ? "Administrator" : "Moderator",
          role: userRole,
          email: "",
          phone: "",
          employeeId: "",
          isAuthenticated: true
        };
      }
      
      setUser(userInfo);
      setActiveToken(activeToken);
      setAuthLoading(false);
      
    } catch (error) {
      console.error('Error in authentication check:', error);
      showToast('Authentication error. Please login again.', 'error');
      setTimeout(() => router.push('/hrm'), 2000);
    }
  };

  // Function to get correct authorization header
  const getAuthHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }
    
    return headers;
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('moderatorToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('moderatorData');
    sessionStorage.clear();
    
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    router.push('/hrm');
    showToast('Logged out successfully', 'success');
  };

  const fetchStoredSupplies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/office-supplies`, {
        headers: getAuthHeaders(), 
      });
      
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        const sortedSupplies = [...data.data].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        setStoredSupplies(sortedSupplies);
      } else {
        showToast(data.message || 'Failed to load stored supplies', 'error');
      }
    } catch (error) {
      console.error('Error fetching supplies:', error);
      showToast('Failed to load stored supplies', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter supplies based on selected year and month
  const filteredSupplies = useMemo(() => {
    return storedSupplies.filter(supply => {
      const date = new Date(supply.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();

      if (selectedYear !== "all" && year !== selectedYear) {
        return false;
      }

      if (selectedMonth !== "all" && month !== selectedMonth) {
        return false;
      }

      return true;
    });
  }, [storedSupplies, selectedYear, selectedMonth]);

  // Generate PDF function
  const generatePDF = () => {
    if (filteredSupplies.length === 0) {
      showToast("No supplies to download", "error");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFontSize(20);
      doc.setTextColor(128, 90, 213);
      doc.setFont("helvetica", "bold");
      doc.text("Office Supplies Report", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 30);
      
      let filterInfo = "All Supplies";
      if (selectedYear !== "all" && selectedMonth !== "all") {
        filterInfo = `${monthNames[parseInt(selectedMonth) - 1]} ${selectedYear}`;
      } else if (selectedYear !== "all") {
        filterInfo = `Year: ${selectedYear}`;
      } else if (selectedMonth !== "all") {
        filterInfo = `Month: ${monthNames[parseInt(selectedMonth) - 1]}`;
      }
      doc.text(`Report Type: ${filterInfo}`, 14, 36);
      doc.text(`Total Records: ${filteredSupplies.length}`, 14, 42);
      
      if (user) {
        doc.text(`Generated by: ${user.name} (${user.role})`, 14, 48);
      }
      
      const tableData = filteredSupplies.map(supply => [
        supply.name,
        new Date(supply.date).toLocaleDateString(),
        `BDT ${supply.price.toFixed(2)}`,
        supply.paymentMethod,
        supply.note || "-"
      ]);
      
      autoTable(doc, {
        startY: user ? 55 : 50,
        head: [['Supply Name', 'Date', 'Price (BDT)', 'Payment Method', 'Note']],
        body: tableData,
        headStyles: {
          fillColor: [128, 90, 213],
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
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 40 }
        },
        didDrawPage: function (data) {
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
      
      const totalPrice = calculateTotal();
      const lastY = doc.lastAutoTable.finalY + 10;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(128, 90, 213);
      doc.text("SUMMARY", 14, lastY);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40);
      doc.text(`Total Supply Items: ${filteredSupplies.length}`, 14, lastY + 8);
      doc.text(`Total Cost: BDT ${totalPrice.toFixed(2)}`, 14, lastY + 16);
      
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(
        `Report generated on ${new Date().toLocaleString()}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: "center" }
      );
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const isFilterActive = selectedYear !== "all" || selectedMonth !== "all";
      const filterSuffix = isFilterActive ? '_filtered' : '';
      const filename = `office_supplies_${timestamp}${filterSuffix}.pdf`;
      
      doc.save(filename);
      showToast(`PDF downloaded successfully: ${filename}`, "success");
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Failed to generate PDF. Please try again.', 'error');
    }
  };

  const updateSupplyField = (index, field, value) => {
    const updatedSupplies = [...supplies];
    updatedSupplies[index][field] = value;
    setSupplies(updatedSupplies);
  };

  const addSupply = () => {
    const newSupply = { name: "", date: "", price: "", paymentMethod: "", note: "" };
    setSupplies([...supplies, newSupply]);
    showToast('New supply field added', 'info');
  };

  const removeSupply = (index) => {
    if (supplies.length === 1) {
      setSupplies([]);
      showToast('Form cleared', 'info');
      return;
    }
    setSupplies(supplies.filter((_, i) => i !== index));
    showToast('Supply field removed', 'info');
  };

  const clearForm = () => {
    setSupplies([]);
    showToast('Form cleared', 'success');
  };

  // Quick add common supply types
  const quickAddSupply = (supplyName) => {
    const newSupply = {
      name: supplyName,
      date: getTodayDate(),
      price: "",
      paymentMethod: "",
      note: "",
      isFixed: true
    };
    setSupplies([...supplies, newSupply]);
    showToast(`Added "${supplyName}" to form`, "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const validSupplies = supplies.filter(
      supply => supply.name.trim() && supply.price && supply.date
    );

    if (validSupplies.length === 0) {
      showToast("Please add at least one supply item", "error");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/addOffice-supplies`, {
        method: 'POST',
        headers: getAuthHeaders(), 
        body: JSON.stringify(validSupplies),
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        showToast(`Successfully saved ${data.data.length} supply item(s)`, 'success');
        setSupplies([]);
        fetchStoredSupplies();
        
        if (data.warnings && data.warnings.length > 0) {
          console.warn('Warnings:', data.warnings);
        }
      } else {
        showToast(data.message || 'Failed to save supplies', 'error');
      }
    } catch (error) {
      console.error('Error saving supplies:', error);
      showToast('Network error. Please check if server is running.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSupply = (supply) => {
    setEditingId(supply._id);
    setEditForm({
      name: supply.name,
      date: new Date(supply.date).toISOString().split('T')[0],
      price: supply.price.toString(),
      paymentMethod: supply.paymentMethod,
      note: supply.note || ""
    });
    showToast(`Editing "${supply.name}"`, 'info');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      date: "",
      price: "",
      paymentMethod: "",
      note: ""
    });
    showToast('Edit cancelled', 'info');
  };

  const handleUpdateSupply = async () => {
    if (!editingId) return;

    if (!editForm.name.trim() || !editForm.price || !editForm.date) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/office-supplies/${editingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(), 
        body: JSON.stringify({
          name: editForm.name,
          date: editForm.date,
          price: parseFloat(editForm.price),
          paymentMethod: editForm.paymentMethod,
          note: editForm.note
        }),
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        showToast('Supply item updated successfully', 'success');
        fetchStoredSupplies();
        setEditingId(null);
        setEditForm({
          name: "",
          date: "",
          price: "",
          paymentMethod: "",
          note: ""
        });
      } else {
        showToast(data.message || 'Failed to update supply item', 'error');
      }
    } catch (error) {
      console.error('Error updating supply:', error);
      showToast('Failed to update supply item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSupplyClick = (supply) => {
    if (deletingSupplyId === supply._id) return;
    
    setDeletingSupplyId(supply._id);
    showDeleteConfirmation(
      supply._id,
      `"${supply.name}" (${formatCurrency(supply.price)})`,
      "supply item"
    );
  };

  const handleDeleteSupplyConfirm = async (supplyId) => {
    if (!supplyId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/office-supplies/${supplyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(), 
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        showToast('Supply item deleted successfully', 'success');
        fetchStoredSupplies();
      } else {
        showToast(data.message || 'Failed to delete supply item', 'error');
      }
    } catch (error) {
      console.error('Error deleting supply:', error);
      showToast('Failed to delete supply item', 'error');
    } finally {
      setLoading(false);
      clearDeleteConfirmation();
    }
  };

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-BD', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateTotal = () => {
    return filteredSupplies.reduce((total, supply) => total + supply.price, 0);
  };

  const calculateFormTotal = () => {
    return supplies.reduce((total, supply) => {
      const price = parseFloat(supply.price) || 0;
      return total + price;
    }, 0);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("all");
    showToast('Year filter applied', 'info');
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    showToast('Month filter applied', 'info');
  };

  const resetFilters = () => {
    setSelectedYear("all");
    setSelectedMonth("all");
    showToast("Filters reset", "info");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        
        {deleteConfirmation && (
          <DeleteConfirmationModal 
            itemName={deleteConfirmation.itemName}
            itemType={deleteConfirmation.itemType}
            onConfirm={() => handleDeleteSupplyConfirm(deleteConfirmation.supplyId)}
            onCancel={clearDeleteConfirmation}
          />
        )}

        {/* Header with User Info */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Office Supply Management</h1>
              <p className="text-gray-600 mt-2">Track and manage your office supply expenses</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as: <span className="font-semibold text-purple-700">{user.name}</span></p>
                <p className="text-xs text-gray-500">Role: <span className="font-medium capitalize text-purple-600">{user.role}</span></p>
              </div>
            </div>
          </div>

          {/* User Info Banner */}
          <div className="bg-[#113F67] text-white rounded-xl shadow-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-semibold">Office Supplies Management</div>
                  <div className="text-sm text-white/90">
                    Track office supply purchases and expenses for your organization
                  </div>
                </div>
              </div>
              <div className="text-sm text-white/90">
                <span className="font-medium">Access Level:</span> {user.role}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {storedSupplies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Supplies</div>
                  <div className="text-2xl font-bold text-purple-600">{storedSupplies.length}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Spent</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(storedSupplies.reduce((total, supply) => total + supply.price, 0))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Months Tracked</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {Array.from(new Set(storedSupplies.map(s => new Date(s.date).getMonth()))).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2 text-purple-600" />
              Add New Supplies
            </h2>
            {supplies.length > 0 && (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center shadow-sm"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Clear Form
                </button>
              </div>
            )}
          </div>

          {/* Quick Add Section */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Quick Add Common Supplies</h3>
            <div className="flex flex-wrap gap-2">
              {commonSupplyTypes.map((supplyType, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => quickAddSupply(supplyType)}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors shadow-sm text-sm"
                >
                  + {supplyType}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Click any button above to quickly add a supply type to the form below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Empty State */}
            {supplies.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-purple-300 rounded-lg mb-6">
                <Plus className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No supplies added yet</h3>
                <p className="text-gray-500 mb-6">Click "Add Supply" or use the quick add buttons above to get started</p>
                <button
                  type="button"
                  onClick={addSupply}
                  className="px-4 py-2 bg-[#113F67] text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center mx-auto"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Supply
                </button>
              </div>
            )}

            {/* Form Header - Only show when there are supplies */}
            {supplies.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-500 mb-2">
                  <div className="col-span-4">Supply Name *</div>
                  <div className="col-span-2">Price (BDT) *</div>
                  <div className="col-span-2">Date *</div>
                  <div className="col-span-2">Payment Method *</div>
                  <div className="col-span-1">Action</div>
                </div>
                
                {/* Supply Rows */}
                {supplies.map((supply, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center mb-3">
                    {/* Supply Name */}
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={supply.name}
                        onChange={(e) => updateSupplyField(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter supply name"
                        list="supply-suggestions"
                        required
                      />
                      <datalist id="supply-suggestions">
                        {commonSupplyTypes.map((type, i) => (
                          <option key={i} value={type} />
                        ))}
                      </datalist>
                    </div>

                    {/* Price */}
<div className="col-span-2">
  <input
    type="number"
    placeholder="0.00"
    value={supply.price}
    onChange={(e) => updateSupplyField(index, "price", e.target.value)}
    onWheel={(e) => e.target.blur()}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    min="0"
    step="0.01"
    required
  />
</div>

                    {/* Date */}
                    <div className="col-span-2">
                      <input
                        type="date"
                        value={supply.date || getTodayDate()}
                        max={getTodayDate()}
                        onChange={(e) => updateSupplyField(index, "date", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="col-span-2">
                      <select
                        value={supply.paymentMethod}
                        onChange={(e) => updateSupplyField(index, "paymentMethod", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      >
                        <option value="">Select Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Mobile Banking">Mobile Banking</option>
                        <option value="Card">Card</option>
                        <option value="Online Payment">Online Payment</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeSupply(index)}
                        className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center shadow-sm"
                        title="Remove this supply"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Note Field (Optional) - Below the row */}
                    <div className="col-span-12 mt-2">
                      <input
                        type="text"
                        value={supply.note || ""}
                        onChange={(e) => updateSupplyField(index, "note", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Optional note (e.g., 'Bulk purchase', 'Emergency order')"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form Total */}
            {supplies.length > 0 && (
              <div className="flex justify-end mb-3">
                <div className="text-lg font-semibold text-purple-700">
                  Form Total: {formatCurrency(calculateFormTotal())}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {supplies.length > 0 && (
                  <button
                    type="button"
                    onClick={addSupply}
                    className="px-4 py-2 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 flex items-center shadow-sm"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Another Supply
                  </button>
                )}
              </div>
              
              {supplies.length > 0 && (
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-6 py-3 rounded-lg transition-colors flex items-center justify-center shadow-lg ${
                    saving
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-[#113F67] hover:from-purple-700 hover:to-indigo-700'
                  } text-white`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Save {supplies.filter(s => s.name && s.price && s.paymentMethod).length} Supply Item(s)
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Form Status */}
            {supplies.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>Total supplies in form: <strong className="text-purple-700">{supplies.length}</strong></span>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600">
                      {supplies.filter(s => s.name && s.price && s.paymentMethod).length} ready to save
                    </span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Edit Form Section */}
        {editingId && (
          <div 
            ref={editFormRef}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-purple-300"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Edit className="w-6 h-6 mr-2 text-purple-600" />
                Edit Supply Item
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <X className="w-5 h-5" />
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Supply Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supply Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  placeholder="e.g., Printer Paper"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (BDT) *
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={editForm.date}
                  max={getTodayDate()}
                  onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={editForm.paymentMethod}
                  onChange={(e) => setEditForm({...editForm, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Banking">Mobile Banking</option>
                  <option value="Card">Card</option>
                  <option value="Online Payment">Online Payment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Note Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={editForm.note}
                  onChange={(e) => setEditForm({...editForm, note: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Optional note about this item"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSupply}
                disabled={saving}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center shadow-lg ${
                  saving
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-[#113F67] hover:from-purple-700 hover:to-indigo-700'
                } text-white`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Stored Supplies Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Package className="w-6 h-6 mr-2 text-purple-600" />
                Stored Office Supplies
              </h3>
              <div className="mt-1 text-sm text-gray-600">
                {selectedYear !== "all" || selectedMonth !== "all" ? (
                  <span>
                    Showing {filteredSupplies.length} of {storedSupplies.length} item(s)
                  </span>
                ) : (
                  <span>Total: {storedSupplies.length} item(s)</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* PDF Download Button */}
              {filteredSupplies.length > 0 && (
                <button
                  onClick={generatePDF}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-colors flex items-center shadow-lg"
                  title="Download PDF Report"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
              )}
              
              <button
                onClick={fetchStoredSupplies}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {/* Year Filter */}
                <div>
                  <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    id="yearFilter"
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  >
                    <option value="all">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Month Filter */}
                <div>
                  <label htmlFor="monthFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    id="monthFilter"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    disabled={selectedYear === "all"}
                    className={`w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm ${
                      selectedYear === "all" ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="all">All Months</option>
                    {months.map(month => (
                      <option key={month} value={month}>
                        {monthNames[month - 1]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active Filters Display */}
                {(selectedYear !== "all" || selectedMonth !== "all") && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 bg-purple-100 px-3 py-2 rounded-lg">
                      <span className="text-sm text-purple-700">
                        {selectedYear !== "all" && selectedMonth !== "all" 
                          ? `${monthNames[parseInt(selectedMonth) - 1]} ${selectedYear}`
                          : selectedYear !== "all" 
                          ? `Year: ${selectedYear}`
                          : `Month: ${monthNames[parseInt(selectedMonth) - 1]}`
                        }
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
                {(selectedYear !== "all" || selectedMonth !== "all") && (
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
              <div className="ml-auto">
                <span className="text-sm text-gray-600">
                  Showing {filteredSupplies.length} of {storedSupplies.length} item(s)
                </span>
                {filteredSupplies.length > 0 && (
                  <div className="text-sm font-medium text-purple-700 mt-1">
                    Total: {formatCurrency(calculateTotal())}
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading supplies...</p>
            </div>
          ) : storedSupplies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No supplies stored yet. Add some using the form above.
            </div>
          ) : filteredSupplies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No supplies found for the selected filters. Try changing your filter criteria.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Supply Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Price (BDT)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSupplies.map((supply) => (
                      <tr key={supply._id} className="hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {supply.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(supply.date)}
                            <div className="text-xs text-gray-500">
                              {monthNames[new Date(supply.date).getMonth()]} {new Date(supply.date).getFullYear()}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(supply.price)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            supply.paymentMethod === 'Cash' ? 'bg-yellow-100 text-yellow-800' :
                            supply.paymentMethod === 'Bank Transfer' ? 'bg-blue-100 text-blue-800' :
                            supply.paymentMethod === 'Mobile Banking' ? 'bg-green-100 text-green-800' :
                            supply.paymentMethod === 'Card' ? 'bg-purple-100 text-purple-800' :
                            supply.paymentMethod === 'Online Payment' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {supply.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {supply.note || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSupply(supply)}
                              className="text-purple-600 hover:text-purple-900 transition-colors px-3 py-1 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center"
                              title="Edit this supply"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSupplyClick(supply)}
                              disabled={deletingSupplyId === supply._id}
                              className="text-red-600 hover:text-red-900 transition-colors px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete this supply"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-purple-50">
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-sm font-semibold text-purple-900">
                        {selectedYear !== "all" || selectedMonth !== "all" ? "Filtered Total" : "Total"}
                        {(selectedYear !== "all" || selectedMonth !== "all") && (
                          <div className="text-xs font-normal text-purple-600 mt-1">
                            {selectedYear !== "all" && selectedMonth !== "all" 
                              ? `${monthNames[parseInt(selectedMonth) - 1]} ${selectedYear}`
                              : selectedYear !== "all" 
                              ? `Year: ${selectedYear}`
                              : `Month: ${monthNames[parseInt(selectedMonth) - 1]}`
                            }
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-bold text-purple-900">
                          {formatCurrency(calculateTotal())}
                        </div>
                      </td>
                      <td colSpan="3" className="px-4 py-3 text-sm text-purple-700">
                        {filteredSupplies.length} item(s)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Summary Stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-medium text-purple-900">
                    {selectedYear !== "all" || selectedMonth !== "all" ? "Filtered Items" : "Total Items"}
                  </h4>
                  <p className="text-2xl font-bold text-purple-700">{filteredSupplies.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-medium text-green-900">
                    {selectedYear !== "all" || selectedMonth !== "all" ? "Filtered Total Cost" : "Total Cost"}
                  </h4>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(calculateTotal())}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add CSS for animations */}
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
