// app/admin/users/edit/page.js
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
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
  Upload,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";

// API functions
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

const updateUser = async (userId, data) => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_HRM_API_URL || 'http://localhost:5000/api/v1';
    const token = localStorage.getItem('adminToken') || localStorage.getItem('employeeToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Correct endpoint based on your backend route
    const endpoint = `${API_BASE}/admin/update-user/${userId}`;
    
    console.log('Updating user at:', endpoint);
    console.log('Update data:', data);

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Try to parse the response
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { message: 'No response data' };
    }

    if (!response.ok) {
      console.error('Update failed:', responseData);
      throw new Error(responseData.message || `Failed to update user (Status: ${response.status})`);
    }

    return responseData;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};



// Also add a test function to check if the API is accessible
const testApiConnection = async () => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_HRM_API_URL || 'http://localhost:5000/api/v1';
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      console.log('No admin token found');
      return;
    }

    // Test if the API is accessible
    const response = await fetch(`${API_BASE}/admin/update-user/test`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('API Test Response:', response.status);
  } catch (error) {
    console.error('API Test Error:', error);
  }
};
 
// Main Component
function UserEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const redirect = searchParams.get('redirect') || 'view';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    picture: '',
    
    // Professional Information
    department: '',
    designation: '',
    employeeId: '',
    status: 'active',
    isActive: true,
    role: 'employee',
    
    // Salary Information
    salaryType: 'monthly',
    rate: 0,
    basicSalary: 0,
    salary: 0,
    joiningDate: new Date().toISOString().split('T')[0],
    
    // Work Type Information
    workLocationType: 'onsite',
    workArrangement: 'full-time',
    
    // Employee Specific
    managerId: '',
    attendanceId: '',
    contractType: 'permanent',
    
    // Bank Details
    bankDetails: {
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      branchName: '',
      routingNumber: ''
    },
    
    // Salary Structure
    salaryStructure: {
      basicSalary: 0,
      houseRent: 0,
      medicalAllowance: 0,
      conveyance: 0,
      otherAllowances: 0,
      grossSalary: 0,
      providentFund: 0,
      tax: 0
    },
    
    // Shift Timing
    shiftTiming: {
      defaultShift: {
        start: '09:00',
        end: '18:00'
      }
    },
    
    // Admin Specific
    companyName: '',
    adminPosition: '',
    adminLevel: 'admin',
    isSuperAdmin: false,
    canManageUsers: false,
    canManagePayroll: false,
    permissions: [],
    
    // Moderator Specific
    moderatorLevel: 'junior',
    moderatorScope: ['content'],
    canModerateUsers: false,
    canModerateContent: true,
    canViewReports: true,
    canManageReports: false,
    moderationLimits: {
      dailyActions: 50,
      warningLimit: 3,
      canBanUsers: false,
      canDeleteContent: true,
      canEditContent: true,
      canWarnUsers: true
    }
  });

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
        const userData = data.user;
        setUser(userData);
        
        // Format data for form
        setFormData({
          // Basic Information
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          picture: userData.picture || '',
          
          // Professional Information
          department: userData.department || '',
          designation: userData.designation || '',
          employeeId: userData.employeeId || '',
          status: userData.status || 'active',
          isActive: userData.isActive !== false,
          role: userData.role || 'employee',
          
          // Salary Information
          salaryType: userData.salaryType || 'monthly',
          rate: userData.rate || 0,
          basicSalary: userData.basicSalary || 0,
          salary: userData.salary || 0,
          joiningDate: userData.joiningDate 
            ? new Date(userData.joiningDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          
          // Work Type Information
          workLocationType: userData.workLocationType || 'onsite',
          workArrangement: userData.workArrangement || 'full-time',
          
          // Employee Specific
          managerId: userData.managerId || '',
          attendanceId: userData.attendanceId || '',
          contractType: userData.contractType || 'permanent',
          
          // Bank Details
          bankDetails: {
            bankName: userData.bankDetails?.bankName || '',
            accountNumber: userData.bankDetails?.accountNumber || '',
            accountHolderName: userData.bankDetails?.accountHolderName || '',
            branchName: userData.bankDetails?.branchName || '',
            routingNumber: userData.bankDetails?.routingNumber || ''
          },
          
          // Salary Structure
          salaryStructure: {
            basicSalary: userData.salaryStructure?.basicSalary || userData.basicSalary || 0,
            houseRent: userData.salaryStructure?.houseRent || 0,
            medicalAllowance: userData.salaryStructure?.medicalAllowance || 0,
            conveyance: userData.salaryStructure?.conveyance || 0,
            otherAllowances: userData.salaryStructure?.otherAllowances || 0,
            grossSalary: userData.salaryStructure?.grossSalary || userData.salary || 0,
            providentFund: userData.salaryStructure?.providentFund || 0,
            tax: userData.salaryStructure?.tax || 0
          },
          
          // Shift Timing
          shiftTiming: {
            defaultShift: {
              start: userData.shiftTiming?.defaultShift?.start || '09:00',
              end: userData.shiftTiming?.defaultShift?.end || '18:00'
            }
          },
          
          // Admin Specific
          companyName: userData.companyName || '',
          adminPosition: userData.adminPosition || '',
          adminLevel: userData.adminLevel || 'admin',
          isSuperAdmin: userData.isSuperAdmin || false,
          canManageUsers: userData.canManageUsers || false,
          canManagePayroll: userData.canManagePayroll || false,
          permissions: userData.permissions || [],
          
          // Moderator Specific
          moderatorLevel: userData.moderatorLevel || 'junior',
          moderatorScope: userData.moderatorScope || ['content'],
          canModerateUsers: userData.canModerateUsers || false,
          canModerateContent: userData.canModerateContent !== false,
          canViewReports: userData.canViewReports !== false,
          canManageReports: userData.canManageReports || false,
          moderationLimits: userData.moderationLimits || {
            dailyActions: 50,
            warningLimit: 3,
            canBanUsers: false,
            canDeleteContent: true,
            canEditContent: true,
            canWarnUsers: true
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      toast.error('Failed to load user data');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (e.g., bankDetails.accountNumber)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.includes('salaryStructure.')) {
      // Handle salary structure
      const field = name.replace('salaryStructure.', '');
      setFormData(prev => ({
        ...prev,
        salaryStructure: {
          ...prev.salaryStructure,
          [field]: type === 'number' ? parseFloat(value) || 0 : value
        }
      }));
      
      // Auto-calculate gross salary
      if (field !== 'grossSalary') {
        setTimeout(() => {
          calculateGrossSalary();
        }, 100);
      }
    } else if (name.includes('moderationLimits.')) {
      // Handle moderation limits
      const field = name.replace('moderationLimits.', '');
      setFormData(prev => ({
        ...prev,
        moderationLimits: {
          ...prev.moderationLimits,
          [field]: type === 'checkbox' ? checked : 
                   type === 'number' ? parseInt(value) || 0 : value
        }
      }));
    } else {
      // Handle simple fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
                type === 'number' ? parseFloat(value) || 0 : 
                type === 'date' ? value : value
      }));
    }
  };

  const calculateGrossSalary = () => {
    const { salaryStructure } = formData;
    const gross = (
      (salaryStructure.basicSalary || 0) +
      (salaryStructure.houseRent || 0) +
      (salaryStructure.medicalAllowance || 0) +
      (salaryStructure.conveyance || 0) +
      (salaryStructure.otherAllowances || 0)
    );
    
    setFormData(prev => ({
      ...prev,
      salaryStructure: {
        ...prev.salaryStructure,
        grossSalary: gross
      },
      salary: gross,
      basicSalary: salaryStructure.basicSalary || 0
    }));
  };



  const handleBack = () => {
    router.push(`/hrm/admin/users/view?userId=${userId}`);
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role,
      // Reset role-specific fields when role changes
      ...(role !== 'admin' && {
        companyName: '',
        adminPosition: '',
        adminLevel: 'admin',
        isSuperAdmin: false,
        canManageUsers: false,
        canManagePayroll: false
      }),
      ...(role !== 'moderator' && {
        moderatorLevel: 'junior',
        moderatorScope: ['content'],
        canModerateUsers: false,
        canModerateContent: true,
        canViewReports: true,
        canManageReports: false
      })
    }));
  };
// In your handleSubmit function, make sure you're not sending too much data
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setSaving(true);
    
    // Prepare clean data for submission - remove any unnecessary nested structures
    // that might cause issues with the backend
    const submitData = {
      // Basic Information
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      picture: formData.picture,
      
      // Professional Information
      department: formData.department,
      designation: formData.designation,
      employeeId: formData.employeeId,
      status: formData.status,
      isActive: formData.isActive,
      role: formData.role,
      
      // Salary Information
      salaryType: formData.salaryType,
      rate: Number(formData.rate) || 0,
      basicSalary: Number(formData.basicSalary) || 0,
      salary: Number(formData.salary) || 0,
      joiningDate: formData.joiningDate,
      
      // Work Type Information
      workLocationType: formData.workLocationType,
      workArrangement: formData.workArrangement,
      contractType: formData.contractType,
      
      // Bank Details - only if they exist
      ...(formData.bankDetails && {
        bankDetails: {
          bankName: formData.bankDetails.bankName || '',
          accountNumber: formData.bankDetails.accountNumber || '',
          accountHolderName: formData.bankDetails.accountHolderName || '',
          branchName: formData.bankDetails.branchName || '',
          routingNumber: formData.bankDetails.routingNumber || ''
        }
      }),
      
      // Salary Structure - only if it exists
      ...(formData.salaryStructure && {
        salaryStructure: {
          basicSalary: Number(formData.salaryStructure.basicSalary) || 0,
          houseRent: Number(formData.salaryStructure.houseRent) || 0,
          medicalAllowance: Number(formData.salaryStructure.medicalAllowance) || 0,
          conveyance: Number(formData.salaryStructure.conveyance) || 0,
          otherAllowances: Number(formData.salaryStructure.otherAllowances) || 0,
          grossSalary: Number(formData.salaryStructure.grossSalary) || 0,
          providentFund: Number(formData.salaryStructure.providentFund) || 0,
          tax: Number(formData.salaryStructure.tax) || 0
        }
      }),
      
      // Shift Timing
      shiftTiming: {
        defaultShift: {
          start: formData.shiftTiming?.defaultShift?.start || '09:00',
          end: formData.shiftTiming?.defaultShift?.end || '18:00'
        }
      }
    };

    // Add role-specific fields only if they exist and role matches
    if (formData.role === 'admin') {
      submitData.companyName = formData.companyName;
      submitData.adminPosition = formData.adminPosition;
      submitData.adminLevel = formData.adminLevel;
      submitData.isSuperAdmin = formData.isSuperAdmin;
      submitData.canManageUsers = formData.canManageUsers;
      submitData.canManagePayroll = formData.canManagePayroll;
      submitData.permissions = formData.permissions || [];
    }

    if (formData.role === 'moderator') {
      submitData.moderatorLevel = formData.moderatorLevel;
      submitData.moderatorScope = formData.moderatorScope || ['content'];
      submitData.canModerateUsers = formData.canModerateUsers;
      submitData.canModerateContent = formData.canModerateContent;
      submitData.canViewReports = formData.canViewReports;
      submitData.canManageReports = formData.canManageReports;
      submitData.moderationLimits = formData.moderationLimits;
    }

    // Remove undefined or null values
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === undefined || submitData[key] === null) {
        delete submitData[key];
      }
    });

    console.log('Cleaned submit data:', submitData);
    
    // Send update request
    const result = await updateUser(userId, submitData);
    
    if (result.success || result.message) {
      toast.success('User updated successfully');
      
      // Wait a moment before redirecting
      setTimeout(() => {
        if (redirect === 'view') {
          router.push(`/hrm/view?userId=${userId}`);
        } else {
          router.push('/hrm/admin/users');
        }
      }, 1500);
    } else {
      throw new Error(result.message || 'Update failed');
    }
  } catch (error) {
    console.error('Update error:', error);
    toast.error(error.message || 'Failed to update user');
  } finally {
    setSaving(false);
  }
};
  const workLocationTypes = [
    { value: 'onsite', label: 'Onsite' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const workArrangements = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contractual', label: 'Contractual' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' }
  ];

  const contractTypes = [
    { value: 'permanent', label: 'Permanent' },
    { value: 'contractual', label: 'Contractual' },
    { value: 'probation', label: 'Probation' },
    { value: 'internship', label: 'Internship' }
  ];

  const salaryTypes = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'project', label: 'Project Based' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'commission', label: 'Commission' },
    { value: 'fixed', label: 'Fixed' }
  ];

  const adminLevels = [
    { value: 'super', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'moderator', label: 'Moderator' }
  ];

  const moderatorLevels = [
    { value: 'senior', label: 'Senior Moderator' },
    { value: 'junior', label: 'Junior Moderator' },
    { value: 'trainee', label: 'Trainee Moderator' }
  ];

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
            Back to Profile
          </button> */}
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Edit User Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Editing profile of {user.firstName} {user.lastName}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="text-purple-600" size={20} />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="text-gray-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-400" size={16} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="flex items-start gap-2">
                  <MapPin className="text-gray-400 mt-2" size={16} />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  name="picture"
                  value={formData.picture}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400" size={16} />
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <div className="flex items-center gap-2">
                  <Building className="text-gray-400" size={16} />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <div className="flex items-center gap-2">
                  <Briefcase className="text-gray-400" size={16} />
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <div className="flex items-center gap-2">
                  <Hash className="text-gray-400" size={16} />
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Location Type
                </label>
                <select
                  name="workLocationType"
                  value={formData.workLocationType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {workLocationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Arrangement
                </label>
                <select
                  name="workArrangement"
                  value={formData.workArrangement}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {workArrangements.map(arrangement => (
                    <option key={arrangement.value} value={arrangement.value}>
                      {arrangement.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Account Active
                  </span>
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Type
                </label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {contractTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div> 
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Shift Start
                </label>
                <input
                  type="time"
                  name="shiftTiming.defaultShift.start"
                  value={formData.shiftTiming.defaultShift.start}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Shift End
                </label>
                <input
                  type="time"
                  name="shiftTiming.defaultShift.end"
                  value={formData.shiftTiming.defaultShift.end}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Type
                </label>
                <select
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {salaryTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate / Salary
                </label>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-gray-400" size={16} />
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Basic Salary
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Basic Salary
                </label>
                <input
                  type="number"
                  name="salaryStructure.basicSalary"
                  value={formData.salaryStructure.basicSalary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div> 
            </div>
          </div>

          {/* Bank Details Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Banknote className="text-amber-600" size={20} />
              Bank Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankDetails.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="bankDetails.accountNumber"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="bankDetails.accountHolderName"
                  value={formData.bankDetails.accountHolderName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  name="bankDetails.branchName"
                  value={formData.bankDetails.branchName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Routing Number
                </label>
                <input
                  type="text"
                  name="bankDetails.routingNumber"
                  value={formData.bankDetails.routingNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Role Specific Sections */}
          {formData.role === 'admin' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="text-purple-600" size={20} />
                Admin Specific Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Position
                  </label>
                  <input
                    type="text"
                    name="adminPosition"
                    value={formData.adminPosition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Level
                  </label>
                  <select
                    name="adminLevel"
                    value={formData.adminLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {adminLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isSuperAdmin"
                        checked={formData.isSuperAdmin}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Super Admin
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="canManageUsers"
                        checked={formData.canManageUsers}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Can Manage Users
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="canManagePayroll"
                        checked={formData.canManagePayroll}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Can Manage Payroll
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.role === 'moderator' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="text-blue-600" size={20} />
                Moderator Specific Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moderator Level
                  </label>
                  <select
                    name="moderatorLevel"
                    value={formData.moderatorLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {moderatorLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="canModerateUsers"
                        checked={formData.canModerateUsers}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Can Moderate Users</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="canViewReports"
                        checked={formData.canViewReports}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Can View Reports</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="canManageReports"
                        checked={formData.canManageReports}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Can Manage Reports</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
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
      <UserEditContent />
    </Suspense>
  );
}
