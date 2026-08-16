"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  CreditCard,
  Calendar,
  UserCog,
  Shield,
  Users,
  Edit,
  Lock,
  CheckCircle,
  XCircle,
  MapPin,
  Briefcase,
  Clock,
  User,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Hash,
  BadgeCheck,
  Activity,
  AlertCircle,
  Banknote,
  FileText,
  Percent,
  Home,
  Stethoscope,
  Car,
  Package,
  Scale,
  Receipt,
} from "lucide-react";
import { toast } from "react-hot-toast";
// Temporary API function
const getUserById = async (userId) => {
  try {
    const API_BASE =
      process.env.NEXT_PUBLIC_HRM_API_URL || "http://localhost:5000/api";
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("employeeToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const endpoint = `${API_BASE}/profile/${userId}`;
    console.log("Fetching user by ID:", endpoint);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("employeeToken");
      localStorage.removeItem("token");
      window.location.href = "/hrm";
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw error;
  }
};

export default function profileDeatils() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(userId);

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        toast.error(data.message || "User not found");
        router.back();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("Failed to load user data");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    } else {
      toast.error("No user ID provided");
      router.back();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-BD", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("en-US").format(amount);
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const renderAdminSpecificFields = () => {
    if (user.role !== "admin") return null;

    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-indigo-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Shield className="text-indigo-600" size={22} />
          </div>
          Administrator Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Info */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Company Name</p>
            <div className="flex items-center gap-2">
              <Building className="text-gray-400" size={16} />
              <p className="text-lg font-semibold text-gray-900">
                {user.companyName || "Not specified"}
              </p>
            </div>
          </div>

          {/* Admin Level */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Admin Level</p>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                user.adminLevel === "super"
                  ? "bg-purple-50 text-purple-800"
                  : user.adminLevel === "admin"
                    ? "bg-blue-50 text-blue-800"
                    : user.adminLevel === "manager"
                      ? "bg-green-50 text-green-800"
                      : user.adminLevel === "moderator"
                        ? "bg-yellow-50 text-yellow-800"
                        : "bg-gray-50 text-gray-800"
              }`}
            >
              <ShieldCheck
                className={
                  user.adminLevel === "super"
                    ? "text-purple-600"
                    : user.adminLevel === "admin"
                      ? "text-blue-600"
                      : user.adminLevel === "manager"
                        ? "text-green-600"
                        : user.adminLevel === "moderator"
                          ? "text-yellow-600"
                          : "text-gray-600"
                }
                size={18}
              />
              <p className="font-semibold capitalize">
                {user.adminLevel || "admin"}
              </p>
            </div>
          </div>

          {/* Admin Position */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Admin Position</p>
            <div className="flex items-center gap-2">
              <BadgeCheck className="text-gray-400" size={16} />
              <p className="text-lg font-semibold text-gray-900">
                {user.adminPosition || "Administrator"}
              </p>
            </div>
          </div>

          {/* Super Admin Status */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Super Admin</p>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                user.isSuperAdmin
                  ? "bg-red-50 text-red-800"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              <ShieldCheck
                className={user.isSuperAdmin ? "text-red-600" : "text-gray-600"}
                size={18}
              />
              <p className="font-semibold">
                {user.isSuperAdmin ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Permissions */}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 mb-2">Permissions</p>
            <div className="flex flex-wrap gap-2">
              {user.permissions?.length > 0 ? (
                user.permissions.map((perm, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium"
                  >
                    {perm}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No specific permissions</span>
              )}
            </div>
          </div>

          {/* Management Permissions */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Can Manage Users</p>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                user.canManageUsers
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              <Users
                className={
                  user.canManageUsers ? "text-green-600" : "text-gray-600"
                }
                size={18}
              />
              <p className="font-semibold">
                {user.canManageUsers ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Can Manage Payroll</p>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                user.canManagePayroll
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-800"
              }`}
            >
              <CreditCard
                className={
                  user.canManagePayroll ? "text-green-600" : "text-gray-600"
                }
                size={18}
              />
              <p className="font-semibold">
                {user.canManagePayroll ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmployeeSpecificFields = () => {
    if (user.role !== "employee") return null;

    return (
      <>
        {/* Employee Information Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Briefcase className="text-blue-600" size={22} />
            </div>
            Employee Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employee ID */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Employee ID</p>
              <div className="flex items-center gap-2">
                <Hash className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900">
                  {user.employeeId || "Not assigned"}
                </p>
              </div>
            </div>

            {/* Attendance ID */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Attendance ID</p>
              <div className="flex items-center gap-2">
                <Clock className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900">
                  {user.attendanceId || "Not assigned"}
                </p>
              </div>
            </div>

            {/* Contract Type */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Contract Type</p>
              <div className="flex items-center gap-2">
                <FileText className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {user.contractType || "Permanent"}
                </p>
              </div>
            </div>

            {/* Shift Timing */}
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Shift Timing</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    {user.shiftTiming?.start || "09:00"} -{" "}
                    {user.shiftTiming?.end || "18:00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Manager */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Manager</p>
              <div className="flex items-center gap-2">
                <UserCog className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900">
                  {user.managerId ? "Assigned" : "Not assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Structure Card */}
        {user.salaryStructure && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Receipt className="text-green-600" size={22} />
              </div>
              Salary Structure
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Salary */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Basic Salary</p>
                <div className="flex items-center gap-2">
                  <Banknote className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    ৳{formatCurrency(user.salaryStructure?.basicSalary)}
                  </p>
                </div>
              </div>

              {/* House Rent */}
              <div>
                <p className="text-sm text-gray-500 mb-1">House Rent</p>
                <div className="flex items-center gap-2">
                  <Home className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    ৳{formatCurrency(user.salaryStructure?.houseRent)}
                  </p>
                </div>
              </div>

              {/* Medical Allowance */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Medical Allowance</p>
                <div className="flex items-center gap-2">
                  <Stethoscope className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    ৳{formatCurrency(user.salaryStructure?.medicalAllowance)}
                  </p>
                </div>
              </div>

              {/* Conveyance */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Conveyance</p>
                <div className="flex items-center gap-2">
                  <Car className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    ৳{formatCurrency(user.salaryStructure?.conveyance)}
                  </p>
                </div>
              </div>

              {/* Other Allowances */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Other Allowances</p>
                <div className="flex items-center gap-2">
                  <Package className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    ৳{formatCurrency(user.salaryStructure?.otherAllowances)}
                  </p>
                </div>
              </div>

              {/* Gross Salary */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Gross Salary</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-green-700">
                    ৳{formatCurrency(user.salaryStructure?.grossSalary)}
                  </p>
                </div>
              </div>

              {/* Provident Fund */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Provident Fund</p>
                <div className="flex items-center gap-2">
                  <Scale className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    ৳{formatCurrency(user.salaryStructure?.providentFund)}
                  </p>
                </div>
              </div>

              {/* Tax */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Tax</p>
                <div className="flex items-center gap-2">
                  <Percent className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    ৳{formatCurrency(user.salaryStructure?.tax)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Details Card */}
        {user.bankDetails && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Banknote className="text-amber-600" size={22} />
              </div>
              Bank Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bank Name */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.bankDetails?.bankName || "Not provided"}
                </p>
              </div>

              {/* Account Number */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Account Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.bankDetails?.accountNumber || "Not provided"}
                </p>
              </div>

              {/* Account Holder Name */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Account Holder</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.bankDetails?.accountHolderName || "Not provided"}
                </p>
              </div>

              {/* Branch Name */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Branch Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.bankDetails?.branchName || "Not provided"}
                </p>
              </div>

              {/* Routing Number */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Routing Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.bankDetails?.routingNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Salary Information Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <CreditCard className="text-green-600" size={22} />
            </div>
            Salary Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Salary Type */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Salary Type</p>
              <div className="flex items-center gap-2">
                <CreditCard className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {user.salaryType}
                </p>
              </div>
            </div>

            {/* Rate */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Rate</p>
              <div className="flex items-center gap-2">
                <DollarSign className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900">
                  ৳{formatCurrency(user.rate)}{" "}
                  {user.salaryType ? `/${user.salaryType}` : ""}
                </p>
              </div>
            </div>

            {/* Basic Salary */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Basic Salary</p>
              <div className="flex items-center gap-2">
                <DollarSign className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900">
                  ৳{formatCurrency(user.basicSalary || user.salary)}
                </p>
              </div>
            </div>

            {/* Salary */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Salary</p>
              <div className="flex items-center gap-2">
                <DollarSign className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-green-700">
                  ৳{formatCurrency(user.salary)}
                </p>
              </div>
            </div>

            {/* Salary Rule */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Salary Rule</p>
              <div className="flex items-center gap-2">
                <Scale className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900">
                  {user.salaryRule ? "Assigned" : "Not assigned"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCommonFields = () => {
    return (
      <>
        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="text-purple-600" size={22} />
            </div>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <div className="flex items-center gap-2">
                  <Mail className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    {user.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <div className="flex items-start gap-2">
                  <MapPin className="text-gray-400 mt-1" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    {user.address || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Joining Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(user.joiningDate)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Picture</p>
                <div className="flex items-center gap-2">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {getUserInitials()}
                    </div>
                  )}
                  <p className="text-gray-600">
                    {user.picture
                      ? "Profile picture uploaded"
                      : "No profile picture"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="text-blue-600" size={22} />
            </div>
            Professional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Department</p>
                <div className="flex items-center gap-2">
                  <Building className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    {user.department || "Not assigned"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Designation</p>
                <div className="flex items-center gap-2">
                  <Briefcase className="text-gray-400" size={16} />
                  <p className="text-lg font-semibold text-gray-900">
                    {user.designation || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                    user.role === "admin"
                      ? "bg-purple-50 text-purple-800"
                      : user.role === "superAdmin"
                        ? "bg-red-50 text-red-800"
                        : "bg-blue-50 text-blue-800"
                  }`}
                >
                  {user.role === "admin" || user.role === "superAdmin" ? (
                    <Shield className="text-purple-600" size={18} />
                  ) : (
                    <Users className="text-blue-600" size={18} />
                  )}
                  <p className="font-semibold capitalize">{user.role}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Is Active</p>
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                    user.isActive
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {user.isActive ? (
                    <CheckCircle className="text-green-600" size={18} />
                  ) : (
                    <XCircle className="text-red-600" size={18} />
                  )}
                  <p className="font-semibold">
                    {user.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAccountInformation = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Activity className="text-gray-600" size={22} />
          </div>
          Account Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Status</p>
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                  user.status === "active"
                    ? "bg-green-50 text-green-800"
                    : user.status === "inactive"
                      ? "bg-red-50 text-red-800"
                      : user.status === "suspended"
                        ? "bg-yellow-50 text-yellow-800"
                        : "bg-gray-50 text-gray-800"
                }`}
              >
                {user.status === "active" ? (
                  <CheckCircle className="text-green-600" size={18} />
                ) : user.status === "suspended" ? (
                  <AlertCircle className="text-yellow-600" size={18} />
                ) : (
                  <XCircle className="text-red-600" size={18} />
                )}
                <p className="font-semibold capitalize">
                  {user.status || "active"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Is Deleted</p>
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                  user.isDeleted
                    ? "bg-red-50 text-red-800"
                    : "bg-green-50 text-green-800"
                }`}
              >
                {user.isDeleted ? (
                  <XCircle className="text-red-600" size={18} />
                ) : (
                  <CheckCircle className="text-green-600" size={18} />
                )}
                <p className="font-semibold">{user.isDeleted ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Login Count</p>
              <div className="flex items-center gap-2">
                <Clock className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900">
                  {user.loginCount || 0} times
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Last Login</p>
              <div className="flex items-center gap-2">
                <Clock className="text-gray-400" size={16} />
                <p className="text-lg font-semibold text-gray-900">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString("en-BD", {
                        timeZone: "Asia/Dhaka",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Never logged in"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Account Created</p>
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-400" size={16} />
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Last Updated</p>
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-400" size={16} />
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-red-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            User Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The user you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-2 md:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Users
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                User Profile Details
              </h1>
              <p className="text-gray-600 mt-2">
                Viewing complete profile of {user.firstName} {user.lastName}
              </p>
            </div>

            <div className="flex gap-3">
              {/* <button
                onClick={() => router.push(`/hrm/profile?edit=${user._id}`)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Profile
              </button> */}
              {/* <button
                onClick={() => {
                  // Reset password function
                  toast.success("Reset password feature coming soon");
                }}
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <Lock size={16} />
                Reset Password
              </button> */}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("professional")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "professional"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Professional
              </button>
              {user.role === "employee" && (
                <button
                  onClick={() => setActiveTab("salary")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "salary"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Salary & Bank
                </button>
              )}
              <button
                onClick={() => setActiveTab("account")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "account"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Account
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-6">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex flex-col items-center">
                  {/* Profile Picture */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.firstName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-3xl">
                              ${getUserInitials()}
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">
                          {getUserInitials()}
                        </span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-white text-center">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-purple-100 mt-1 text-center">
                    {user.email}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span
                      className={`px-3 py-1 text-white rounded-full text-sm font-medium ${
                        user.role === "admin"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                          : user.role === "superAdmin"
                            ? "bg-gradient-to-r from-red-500 to-pink-500"
                            : "bg-gradient-to-r from-blue-500 to-cyan-500"
                      }`}
                    >
                      {user.role?.toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "suspended"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Account Status
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            user.status === "active"
                              ? "text-green-600"
                              : user.status === "suspended"
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {user.status?.toUpperCase() || "ACTIVE"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Department
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.department || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Designation
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.designation || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.role === "employee" && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Hash className="text-cyan-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Employee ID
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {user.employeeId || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {user.role === "admin" && user.adminLevel && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <ShieldCheck className="text-indigo-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Admin Level
                          </p>
                          <p className="text-sm font-semibold text-indigo-600 capitalize">
                            {user.adminLevel}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 space-y-3">
                  {/* <button
                    onClick={() => router.push(`/hrm/admin/users?edit=${user._id}`)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Edit className="text-gray-600" size={20} />
                      <span className="font-medium text-gray-700">Edit Profile</span>
                    </div>
                    <ChevronRight className="text-gray-400" size={16} />
                  </button> */}

                  {/* <button
                    onClick={() => {
                      // Reset password
                      toast.success("Reset password feature coming soon");
                    }}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="text-gray-600" size={20} />
                      <span className="font-medium text-gray-700">Reset Password</span>
                    </div>
                    <ChevronRight className="text-gray-400" size={16} />
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <>
                {renderCommonFields()}
                {renderAdminSpecificFields()}
                {renderEmployeeSpecificFields()}
                {renderAccountInformation()}
              </>
            )}

            {activeTab === "professional" && (
              <>
                {renderCommonFields()}
                {renderAdminSpecificFields()}
                {renderEmployeeSpecificFields()}
              </>
            )}

            {activeTab === "salary" && (
              <>{user.role === "employee" && renderEmployeeSpecificFields()}</>
            )}

            {activeTab === "account" && <>{renderAccountInformation()}</>}
          </div>
        </div>
      </div>
    </div>
  );
}
