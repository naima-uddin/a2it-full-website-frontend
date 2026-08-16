// app/admin/users/view/page.js
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  CreditCard,
  DollarSign,
  Hash,
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Banknote,
  Home,
  Stethoscope,
  Car,
  Package,
  Scale,
  Percent,
  AlertCircle,
  Edit,
  Lock,
  Globe,
  Activity,
  BadgeCheck,
  ShieldCheck,
  Receipt,
  Eye,
  EyeOff,
  Download,
  Printer,
  Copy,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";

// API functions
const getUserById = async (userId) => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_HRM_API_URL || 'http://localhost:5000/api/v1';
    const token = localStorage.getItem('adminToken') || localStorage.getItem('employeeToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE}/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// Main Component
function UserViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const redirect = searchParams.get('redirect') || 'users';

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(userId);
      
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      toast.error('Failed to load user data');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0.00";
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleEdit = () => {
    router.push(`/hrm/edit?userId=${userId}&redirect=view`);
  };

  const handleBack = () => {
    if (redirect === 'dashboard') {
      router.push('/hrm/admin/dashboard');
    } else {
      router.push('/hrm/admin/users');
    }
  };

  const handleResetPassword = () => {
    if (user) {
      router.push(`/hrm/admin/reset-password?userId=${userId}&userEmail=${user.email}&userName=${user.firstName}+${user.lastName}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Implement export functionality
    toast.success('Export feature coming soon!');
  };

  const handleCopyUserId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      toast.success('User ID copied to clipboard!');
    }
  };

  const getStatusBadge = (status, isActive) => {
    const isActiveStatus = isActive && status === 'active';
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        isActiveStatus ? 'bg-green-100 text-green-800' :
        status === 'inactive' ? 'bg-red-100 text-red-800' :
        status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {isActiveStatus ? (
          <CheckCircle size={14} />
        ) : status === 'suspended' ? (
          <AlertCircle size={14} />
        ) : (
          <XCircle size={14} />
        )}
        {isActiveStatus ? 'Active' : status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </div>
    );
  };

  const getRoleBadge = (role) => {
    const colors = {
      employee: 'bg-blue-100 text-blue-800',
      admin: 'bg-purple-100 text-purple-800',
      moderator: 'bg-orange-100 text-orange-800',
      superAdmin: 'bg-red-100 text-red-800'
    };
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role === 'admin' || role === 'superAdmin' ? (
          <Shield size={14} />
        ) : role === 'moderator' ? (
          <ShieldCheck size={14} />
        ) : (
          <Users size={14} />
        )}
        {role?.charAt(0).toUpperCase() + role?.slice(1) || 'Unknown'}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <h3 className="mt-4 text-lg font-semibold">User not found</h3>
          <button
            onClick={() => router.push('/hrm/user-roles')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {/* <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to {redirect === 'dashboard' ? 'Dashboard' : 'Users'}
          </button> */}
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                User Profile Details
              </h1>
              <p className="text-gray-600 mt-1">
                Viewing profile of {user.firstName} {user.lastName}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Profile
              </button>
               
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              {/* Profile Picture and Basic Info */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-100">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 mt-1">{user.email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status, user.isActive)}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Hash className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="font-semibold text-gray-900">
                        {user.employeeId || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-semibold text-gray-900">
                        {user.department || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joining Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(user.joiningDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {user.salary && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="text-amber-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-semibold text-gray-900">
                          à§³{formatCurrency(user.salary)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="text-purple-600" size={20} />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900 font-semibold">{user.firstName || "-"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900 font-semibold">{user.lastName || "-"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold">{user.email || "-"}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold">{user.phone || "-"}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Address
                  </label>
                  <div className="flex items-start gap-2">
                    <MapPin className="text-gray-400 mt-1" size={16} />
                    <p className="text-gray-900 font-semibold">{user.address || "-"}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Profile Picture URL
                  </label>
                  <p className="text-gray-900 font-semibold truncate">
                    {user.picture ? (
                      <a href={user.picture} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        View Picture
                      </a>
                    ) : "-"}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Joining Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold">{formatDate(user.joiningDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="text-blue-600" size={20} />
                Professional Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(user.role)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Department
                  </label>
                  <div className="flex items-center gap-2">
                    <Building className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold">{user.department || "-"}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Designation
                  </label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold">{user.designation || "-"}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Employee ID
                  </label>
                  <div className="flex items-center gap-2">
                    <Hash className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold">{user.employeeId || "-"}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Work Location Type
                  </label>
                  <div className="flex items-center gap-2">
                    <Globe className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold capitalize">{user.workLocationType || "onsite"}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Work Arrangement
                  </label>
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold capitalize">{user.workArrangement || "full-time"}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(user.status, user.isActive)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Account Active
                  </label>
                  <div className="flex items-center gap-2">
                    {user.isActive ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <XCircle className="text-red-600" size={16} />
                    )}
                    <p className="text-gray-900 font-semibold">
                      {user.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Type Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="text-green-600" size={20} />
                Work Type Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Contract Type
                  </label>
                  <p className="text-gray-900 font-semibold capitalize">{user.contractType || "permanent"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Attendance ID
                  </label>
                  <div className="flex items-center gap-2">
                    <Hash className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold">{user.attendanceId || "-"}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Default Shift Start
                  </label>
                  <p className="text-gray-900 font-semibold">{user.shiftTiming?.defaultShift?.start || "09:00"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Default Shift End
                  </label>
                  <p className="text-gray-900 font-semibold">{user.shiftTiming?.defaultShift?.end || "18:00"}</p>
                </div>
              </div>
            </div>

            {/* Salary Information Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-green-600" size={20} />
                Salary Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Salary Type
                  </label>
                  <p className="text-gray-900 font-semibold capitalize">{user.salaryType || "monthly"}</p>
                </div>
                
                {/* <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Rate
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold">à§³{formatCurrency(user.rate || 0)}</p>
                  </div>
                </div> */}
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Basic Salary
                  </label>
                  <p className="text-gray-900 font-semibold">à§³{formatCurrency(user.basicSalary || 0)}</p>
                </div>
                
                {/* <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Total Salary
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-gray-400" size={16} />
                    <p className="text-gray-900 font-semibold text-green-600">
                      à§³{formatCurrency(user.salary || 0)}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Salary Structure Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="text-orange-600" size={20} />
                Salary Structure Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Basic Salary
                  </label>
                  <p className="text-gray-900 font-semibold">
                    à§³{formatCurrency(user.salaryStructure?.basicSalary || user.basicSalary || 0)}
                  </p>
                </div> 
              </div>
            </div>

            {/* Bank Details Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Banknote className="text-amber-600" size={20} />
                  Bank Details
                </h2>
                <button
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  {showBankDetails ? (
                    <>
                      <EyeOff size={16} />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      Show Details
                    </>
                  )}
                </button>
              </div>
              
              {showBankDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Bank Name
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {user.bankDetails?.bankName || "-"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Account Number
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {user.bankDetails?.accountNumber || "-"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Account Holder Name
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {user.bankDetails?.accountHolderName || "-"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Branch Name
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {user.bankDetails?.branchName || "-"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Routing Number
                    </label>
                    <p className="text-gray-900 font-semibold">
                      {user.bankDetails?.routingNumber || "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Bank details are hidden for security</p>
                  <button
                    onClick={() => setShowBankDetails(true)}
                    className="mt-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Click to reveal bank details
                  </button>
                </div>
              )}
            </div>

            {/* Role Specific Sections */}
            {user.role === 'admin' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="text-purple-600" size={20} />
                  Admin Specific Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Company Name
                    </label>
                    <p className="text-gray-900 font-semibold">{user.companyName || "-"}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Admin Position
                    </label>
                    <p className="text-gray-900 font-semibold">{user.adminPosition || "-"}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Admin Level
                    </label>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={
                        user.adminLevel === 'super' ? 'text-red-600' :
                        user.adminLevel === 'admin' ? 'text-purple-600' :
                        'text-gray-600'
                      } size={16} />
                      <p className="text-gray-900 font-semibold capitalize">{user.adminLevel || "admin"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        user.isSuperAdmin ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {user.isSuperAdmin ? (
                          <CheckCircle className="text-red-600" size={14} />
                        ) : (
                          <XCircle className="text-gray-400" size={14} />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">Super Admin</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        user.canManageUsers ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {user.canManageUsers ? (
                          <CheckCircle className="text-green-600" size={14} />
                        ) : (
                          <XCircle className="text-gray-400" size={14} />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">Can Manage Users</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        user.canManagePayroll ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {user.canManagePayroll ? (
                          <CheckCircle className="text-green-600" size={14} />
                        ) : (
                          <XCircle className="text-gray-400" size={14} />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">Can Manage Payroll</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {user.role === 'moderator' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="text-blue-600" size={20} />
                  Moderator Specific Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Moderator Level
                    </label>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={
                        user.moderatorLevel === 'senior' ? 'text-red-600' :
                        user.moderatorLevel === 'junior' ? 'text-orange-600' :
                        'text-yellow-600'
                      } size={16} />
                      <p className="text-gray-900 font-semibold capitalize">{user.moderatorLevel || "junior"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Permissions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center ${
                          user.canModerateUsers ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {user.canModerateUsers ? (
                            <CheckCircle className="text-green-600" size={14} />
                          ) : (
                            <XCircle className="text-gray-400" size={14} />
                          )}
                        </div>
                        <span className="text-sm text-gray-700">Can Moderate Users</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center ${
                          user.canViewReports ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {user.canViewReports ? (
                            <CheckCircle className="text-green-600" size={14} />
                          ) : (
                            <XCircle className="text-gray-400" size={14} />
                          )}
                        </div>
                        <span className="text-sm text-gray-700">Can View Reports</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center ${
                          user.canManageReports ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {user.canManageReports ? (
                            <CheckCircle className="text-green-600" size={14} />
                          ) : (
                            <XCircle className="text-gray-400" size={14} />
                          )}
                        </div>
                        <span className="text-sm text-gray-700">Can Manage Reports</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Main Export with Suspense
export default function page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserViewContent />
    </Suspense>
  );
}
