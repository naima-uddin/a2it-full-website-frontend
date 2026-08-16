"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  EyeOff,
  Key,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Check,
  UserPlus,
  Shield,
  UserCog,
  Download,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Building,
  ChevronDown,
  MoreVertical,
  UserCheck,
  UserX,
  TrendingUp,
  Users,
  X,
  CheckCircle,
  AlertCircle,
  Image,
  Camera,
  Upload,
  Loader2,
  Lock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Send,
  Clock,
  CalendarDays,
  History,
  Layers,
  Target,
  UsersRound,
  FileClock,
  BarChart3,
  Info,
  Banknote,
  Briefcase,
  FileText,
  UserPen,
  Award,
  Settings,
  ShieldCheck,
  ClipboardList,
  Zap,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Import your existing APIs
import {
  createUser as createUserAPI,
  getUsers,
  updateUser as updateUserAPI,
  deleteUser as deleteUserAPI,
  uploadProfilePicture,
  removeProfilePicture,
  sendWelcomeEmail,
} from "@/app/hrm/lib/api";

// Import shift APIs
// import {
//   getAllEmployeeShifts,
//   assignShiftToEmployee,
//   resetEmployeeShift,
//   updateDefaultShift,
//   getEmployeeShiftHistory,
//   bulkAssignShifts,
// getShiftStatistics,
//   getMyShift
// } from "@/app/hrm/lib/api";

export default function page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [adminEmail, setAdminEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Shift Management States
  const [showShiftManagement, setShowShiftManagement] = useState(false);
  const [selectedEmployeeForShift, setSelectedEmployeeForShift] =
    useState(null);
  const [shiftForm, setShiftForm] = useState({
    startTime: "09:00",
    endTime: "18:00",
    effectiveDate: new Date().toISOString().split("T")[0],
    reason: "",
    isPermanent: false,
  });
  const [shiftHistory, setShiftHistory] = useState([]);
  const [shiftStatistics, setShiftStatistics] = useState(null);
  const [showShiftHistory, setShowShiftHistory] = useState(false);
  const [showShiftStatistics, setShowShiftStatistics] = useState(false);
  const [selectedEmployeesForBulk, setSelectedEmployeesForBulk] = useState([]);
  const [showBulkShiftAssign, setShowBulkShiftAssign] = useState(false);
  const [defaultShiftTime, setDefaultShiftTime] = useState({
    start: "09:00",
    end: "18:00",
  });

  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Reset Password Page state
  const [showResetPasswordPage, setShowResetPasswordPage] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);

  // Profile update notifications
  const [pendingNotifications, setPendingNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUpdateNotif, setSelectedUpdateNotif] = useState(null);
  const [selectedUpdateUser, setSelectedUpdateUser] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee",
    salary: "",
    status: "active",
    department: "IT",
    phone: "",
    workLocationType: "onsite",
    workArrangement: "full-time",
    joiningDate: new Date().toISOString().split("T")[0],
    profilePicture: null,
    employeeId: "", // Optional - খালি রাখলে auto generate হবে
    designation: "",
    salaryType: "monthly",
    basicSalary: "",
    rate: "",
    contractType: "permanent",
    useCustomId: false, // নতুন state: custom ID ব্যবহার করবে কিনা
  });

  // Advanced form state
  const [advancedForm, setAdvancedForm] = useState({
    // Employee & Moderator specific
    contractType: "permanent",
    bankDetails: {
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      branchName: "",
      routingNumber: "",
    },

    // Admin specific
    companyName: "",
    adminPosition: "",
    adminLevel: "admin",
    permissions: [],
    isSuperAdmin: false,
    canManageUsers: true,
    canManagePayroll: true,

    // Employee specific
    managerId: "",
    attendanceId: "",
    preferredShift: "",

    // Moderator specific
    moderatorLevel: "junior",
    moderatorScope: ["content"],
    canModerateUsers: false,
    canModerateContent: true,
    canViewReports: true,
    canManageReports: false,
    moderationLimits: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showResetNewPwd, setShowResetNewPwd] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  // ✅ Welcome Email পাঠানোর ফাংশন
  // const sendWelcomeEmailToUser = async (userData, generatedPassword = null) => {
  //   setSendingEmail(true);

  //   const toastId = toast.loading(`Processing email for ${userData.email}...`, {
  //     position: 'top-center'
  //   });

  //   try {
  //     console.log('📧 Email recipient:', userData.email);

  //     const result = await sendWelcomeEmail({
  //       to: userData.email,
  //       subject: `Welcome to A2IT HRM System`,
  //       userName: `${userData.firstName} ${userData.lastName}`,
  //       userEmail: userData.email,
  //       password: generatedPassword || form.password,
  //       role: userData.role,
  //       department: userData.department || 'General',
  //       joiningDate: userData.joiningDate || new Date().toISOString().split('T')[0],
  //       salary: userData.salary || '0',
  //       loginUrl: window.location.origin + '/'
  //     });

  //     toast.dismiss(toastId);

  //     if (result?.success) {
  //       const message = result.simulated
  //         ? `✅ User created! (Email simulation: ${userData.email})`
  //         : `✅ Welcome email sent to ${userData.email}!`;

  //       toast.success(message, {
  //         duration: 4000,
  //         position: 'top-center'
  //       });
  //       return true;
  //     }

  //     return false;

  //   } catch (error) {
  //     toast.dismiss(toastId);
  //     console.warn('📧 Email sending skipped (backend issue):', error.message);

  //     toast.success(`✅ User created successfully!`, {
  //       duration: 4000,
  //       position: 'top-center'
  //     });

  //     return true;
  //   } finally {
  //     setSendingEmail(false);
  //   }
  // };

  // useEffect-এর মধ্যে admin email সেট করুন
  useEffect(() => {
    const envAdminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      "admin@attendance-system.a2itltd.com";
    console.log("📧 Setting admin email:", envAdminEmail);
    setAdminEmail(envAdminEmail);

    // Load default shift time
    fetchDefaultShiftTime();
  }, []);

  // Handle advanced form changes
  const handleAdvancedChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setAdvancedForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setAdvancedForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const setupAxios = () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    axios.defaults.baseURL =
      process.env.NEXT_PUBLIC_HRM_API_URL ||
      "http://localhost:5000/api/v1";
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Loading users...");
    try {
      const data = await getUsers();
      const usersWithPictures =
        data.users?.map((user) => ({
          ...user,
          profilePicture: user.profilePicture || user.picture || null,
        })) || [];
      setUsers(usersWithPictures);
      toast.dismiss(loadingToast);
      toast.success(`Loaded ${usersWithPictures.length} users successfully!`, {
        icon: "👥",
        duration: 3000,
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to load users!", {
        icon: "❌",
        duration: 4000,
      });
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch default shift time
  const fetchDefaultShiftTime = async () => {
    try {
      setDefaultShiftTime({
        start: "09:00",
        end: "18:00",
      });
    } catch (error) {
      console.error("Error fetching default shift time:", error);
    }
  };

  // Fetch shift statistics
  const fetchShiftStatistics = async () => {
    try {
      const result = await getShiftStatistics();
      if (result.success) {
        setShiftStatistics(result.statistics);
      }
    } catch (error) {
      console.error("Error fetching shift statistics:", error);
    }
  };

  // All notifications (pending + approved) keyed by userId for table row display
  const [allNotifsByUser, setAllNotifsByUser] = useState({});

  const getAdminToken = () => localStorage.getItem("adminToken");
  const apiUrl = process.env.NEXT_PUBLIC_HRM_API_URL;

  const loadPendingNotifs = async () => {
    try {
      const token = getAdminToken();
      if (!token) return;
      const res = await fetch(`${apiUrl}/notifications?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const all = data.notifications || [];
      setPendingNotifications(all.filter((n) => n.status === "pending"));
      // Build map: userId (string) → latest notification
      const byUser = {};
      all.forEach((n) => {
        const uid = String(n.userId);
        if (
          !byUser[uid] ||
          new Date(n.createdAt) > new Date(byUser[uid].createdAt)
        ) {
          byUser[uid] = n;
        }
      });
      setAllNotifsByUser(byUser);
    } catch {}
  };

  useEffect(() => {
    fetchUsers();
    fetchShiftStatistics();
    loadPendingNotifs();
    const poll = setInterval(loadPendingNotifs, 30000);
    return () => clearInterval(poll);
  }, []);

  const handleApproveNotif = async (id) => {
    try {
      const token = getAdminToken();
      await fetch(`${apiUrl}/notifications/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile update approved!");
      await loadPendingNotifs();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleApproveByUserId = async (userId) => {
    try {
      const token = getAdminToken();
      const pending = pendingNotifications.filter(
        (n) => String(n.userId) === String(userId),
      );
      await Promise.all(
        pending.map((n) =>
          fetch(`${apiUrl}/notifications/${n._id}/approve`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );
      toast.success("Profile update approved!");
      await loadPendingNotifs();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleRejectNotif = async (id) => {
    try {
      const token = getAdminToken();
      await fetch(`${apiUrl}/notifications/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile update rejected.");
      await loadPendingNotifs();
    } catch {
      toast.error("Failed to reject");
    }
  };

  const handleRejectByUserId = async (userId) => {
    try {
      const token = getAdminToken();
      const pending = pendingNotifications.filter(
        (n) => String(n.userId) === String(userId),
      );
      await Promise.all(
        pending.map((n) =>
          fetch(`${apiUrl}/notifications/${n._id}/reject`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );
      toast.success("Profile update rejected.");
      await loadPendingNotifs();
    } catch {
      toast.error("Failed to reject");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate a strong random password for the create-user form (12 chars, mixed types)
  const generateCreateFormPassword = () => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const digits = "23456789";
    const symbols = "!@#$%&*?";
    const all = upper + lower + digits + symbols;

    const pick = (set) => set[Math.floor(Math.random() * set.length)];

    // Guarantee at least one of each type
    const chars = [pick(upper), pick(lower), pick(digits), pick(symbols)];
    for (let i = chars.length; i < 12; i++) {
      chars.push(pick(all));
    }
    // Shuffle (Fisher-Yates)
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    const password = chars.join("");
    setForm((prev) => ({ ...prev, password }));
    setShowPassword(true);
    toast.success("Strong password generated!", { icon: "🔐", duration: 2000 });
  };

  // Copy the current password to clipboard
  const handleCopyPassword = async () => {
    if (!form.password) return;
    try {
      await navigator.clipboard.writeText(form.password);
      toast.success("Password copied to clipboard!", { duration: 2000 });
    } catch {
      toast.error("Failed to copy password");
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Handle file upload logic...
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isEditMode && (!form.password || form.password.length < 6)) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setFormLoading(true);

    const loadingToast = toast.loading(
      isEditMode ? "Updating user..." : "Creating user...",
      { position: "top-center" },
    );

    try {
      // Base payload
      let payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
        status: form.status,
        department: form.department,
        phone: form.phone,
        workLocationType: form.workLocationType || "onsite",
        workArrangement: form.workArrangement || "full-time",
        joiningDate: form.joiningDate || new Date().toISOString().split("T")[0],
        salaryType: form.salaryType || "monthly",
        rate: Number(form.salary) || Number(form.rate) || 0,
        basicSalary: Number(form.salary) || Number(form.basicSalary) || 0,
        salary: Number(form.salary) || 0,
        contractType: form.contractType || "permanent",
      };

      // Only include password for new users
      if (!isEditMode) {
        payload.password = form.password;
      }

      // Only include employeeId if manually provided and not empty
      if (form.employeeId && form.employeeId.trim() !== "") {
        payload.employeeId = form.employeeId.trim();
      }
      // Otherwise backend will auto-generate

      // Include designation if provided
      if (form.designation && form.designation.trim() !== "") {
        payload.designation = form.designation.trim();
      }

      // Include shift timing
      payload.shiftTiming = {
        defaultShift: {
          start: defaultShiftTime.start,
          end: defaultShiftTime.end,
        },
      };

      // ============ ROLE-SPECIFIC FIELDS ============

      // Employee & Moderator specific fields
      if (form.role === "employee" || form.role === "moderator") {
        payload.contractType = advancedForm.contractType || "permanent";

        // Add bank details if provided
        if (advancedForm.bankDetails.bankName) {
          payload.bankDetails = advancedForm.bankDetails;
        }

        // Add salary structure
        if (payload.salary > 0) {
          payload.salaryStructure = {
            basicSalary: payload.basicSalary || payload.salary || 0,
            grossSalary: payload.salary || 0,
          };
        }
      }

      // Employee specific fields
      if (form.role === "employee") {
        if (advancedForm.managerId) {
          payload.managerId = advancedForm.managerId;
        }

        if (form.employeeId) {
          payload.attendanceId = form.employeeId;
        }

        if (advancedForm.preferredShift) {
          payload.preferredShift = advancedForm.preferredShift;
        }
      }

      // Admin specific fields
      if (form.role === "admin" || form.role === "superAdmin") {
        payload.companyName = advancedForm.companyName || "Default Company";
        payload.adminPosition =
          advancedForm.adminPosition ||
          (form.role === "superAdmin"
            ? "Super Administrator"
            : "Administrator");
        payload.adminLevel =
          advancedForm.adminLevel ||
          (form.role === "superAdmin" ? "super" : "admin");
        payload.isSuperAdmin =
          advancedForm.isSuperAdmin || form.role === "superAdmin";
        payload.canManageUsers =
          advancedForm.canManageUsers !== undefined
            ? advancedForm.canManageUsers
            : true;
        payload.canManagePayroll =
          advancedForm.canManagePayroll !== undefined
            ? advancedForm.canManagePayroll
            : true;

        // Set default permissions based on role
        if (form.role === "superAdmin") {
          payload.permissions = [
            "user:read",
            "user:create",
            "user:update",
            "user:delete",
            "report:view",
            "report:generate",
            "settings:manage",
            "system:admin",
            "audit:view",
            "database:manage",
            "backup:manage",
          ];
        } else {
          payload.permissions = [
            "user:read",
            "user:create",
            "user:update",
            "user:delete",
            "report:view",
            "report:generate",
            "settings:manage",
          ];
        }
      }

      // Moderator specific fields
      if (form.role === "moderator") {
        payload.moderatorLevel = advancedForm.moderatorLevel || "junior";
        payload.moderatorScope = advancedForm.moderatorScope || ["content"];
        payload.canModerateUsers =
          advancedForm.canModerateUsers !== undefined
            ? advancedForm.canModerateUsers
            : false;
        payload.canModerateContent =
          advancedForm.canModerateContent !== undefined
            ? advancedForm.canModerateContent
            : true;
        payload.canViewReports =
          advancedForm.canViewReports !== undefined
            ? advancedForm.canViewReports
            : true;
        payload.canManageReports =
          advancedForm.canManageReports !== undefined
            ? advancedForm.canManageReports
            : false;

        // Set default permissions based on moderator level
        const moderatorLevel = advancedForm.moderatorLevel || "junior";
        if (moderatorLevel === "trainee") {
          payload.permissions = ["content:view", "report:view"];
        } else if (moderatorLevel === "junior") {
          payload.permissions = [
            "content:view",
            "content:edit",
            "report:view",
            "users:warn",
          ];
        } else {
          payload.permissions = [
            "content:view",
            "content:edit",
            "content:delete",
            "user:view",
            "user:warn",
            "user:suspend",
            "report:view",
            "report:generate",
          ];
        }

        // Set moderation limits
        if (moderatorLevel === "trainee") {
          payload.moderationLimits = {
            dailyActions: 30,
            warningLimit: 1,
            canBanUsers: false,
            canDeleteContent: false,
            canEditContent: false,
            canWarnUsers: true,
          };
        } else if (moderatorLevel === "junior") {
          payload.moderationLimits = {
            dailyActions: 100,
            warningLimit: 3,
            canBanUsers: false,
            canDeleteContent: true,
            canEditContent: true,
            canWarnUsers: true,
          };
        } else {
          payload.moderationLimits = {
            dailyActions: 200,
            warningLimit: 5,
            canBanUsers: true,
            canDeleteContent: true,
            canEditContent: true,
            canWarnUsers: true,
          };
        }
      }

      console.log("📝 User creation payload:", payload);

      let res;
      if (isEditMode) {
        res = await updateUserAPI(currentUserId, payload);
      } else {
        res = await createUserAPI(payload);
      }

      console.log("✅ API Response:", res);

      if (res.message?.includes("successfully") || res.success || res._id) {
        toast.dismiss(loadingToast);

        const successMessage = isEditMode
          ? `✅ User "${form.firstName} ${form.lastName}" updated!`
          : `✅ User "${form.firstName} ${form.lastName}" created with ID: ${res.user?.employeeId || "Generated"}`;

        toast.success(successMessage, {
          duration: 4000,
          position: "top-center",
        });

        // For new users, send welcome email
        if (!isEditMode && res.user?._id) {
          setCurrentUserId(res.user._id);
          setIsEditMode(true);

          setTimeout(async () => {
            try {
              await sendWelcomeEmailToUser(
                {
                  ...form,
                  _id: res.user._id,
                  employeeId: res.user.employeeId,
                },
                form.password,
              );
            } catch (e) {
              console.log("Email optional - user created anyway");
            }
          }, 500);
        }

        // Refresh user list
        fetchUsers();

        // Reset form only for new user creation
        if (!isEditMode) {
          resetForm();
        }
      } else {
        throw new Error(res.message || res.error || "Failed to process user");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("❌ Error:", error);

      let errorMessage = error.message;
      if (
        errorMessage.includes("409") ||
        errorMessage.includes("already exists")
      ) {
        errorMessage = "User with this email already exists";
      } else if (
        errorMessage.includes("400") ||
        errorMessage.includes("validation")
      ) {
        errorMessage = "Invalid data provided";
      } else if (errorMessage.includes("employeeId")) {
        errorMessage = "Employee ID already exists";
      }

      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "employee",
      salary: "",
      status: "active",
      department: "IT",
      phone: "",
      workLocationType: "onsite",
      workArrangement: "full-time",
      joiningDate: new Date().toISOString().split("T")[0],
      profilePicture: null,
      employeeId: "",
      designation: "",
      salaryType: "monthly",
      basicSalary: "",
      rate: "",
      contractType: "permanent",
    });

    setAdvancedForm({
      contractType: "permanent",
      bankDetails: {
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        branchName: "",
        routingNumber: "",
      },
      companyName: "",
      adminPosition: "",
      adminLevel: "admin",
      permissions: [],
      isSuperAdmin: false,
      canManageUsers: true,
      canManagePayroll: true,
      managerId: "",
      attendanceId: "",
      preferredShift: "",
      moderatorLevel: "junior",
      moderatorScope: ["content"],
      canModerateUsers: false,
      canModerateContent: true,
      canViewReports: true,
      canManageReports: false,
      moderationLimits: null,
    });

    setIsEditMode(false);
    setCurrentUserId(null);
    setShowAdvanced(false);

    toast.success("Form reset successfully!", {
      duration: 2000,
    });
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setCurrentUserId(user._id);

    // Set basic form
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "", // Don't show existing password
      role: user.role || "employee",
      salary: user.salary || user.rate || "",
      status: user.status || "active",
      department: user.department || "IT",
      phone: user.phone || "",
      workLocationType: user.workLocationType || "onsite",
      workArrangement: user.workArrangement || "full-time",
      joiningDate: user.joiningDate || new Date().toISOString().split("T")[0],
      profilePicture: user.profilePicture || user.picture || null,
      employeeId: user.employeeId || "",
      designation: user.designation || "",
      salaryType: user.salaryType || "monthly",
      basicSalary: user.basicSalary || user.salary || "",
      rate: user.rate || user.salary || "",
      contractType: user.contractType || "permanent",
    });

    // Set advanced form
    setAdvancedForm({
      contractType: user.contractType || "permanent",
      bankDetails: user.bankDetails || {
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        branchName: "",
        routingNumber: "",
      },
      companyName: user.companyName || "",
      adminPosition: user.adminPosition || "",
      adminLevel: user.adminLevel || "admin",
      permissions: user.permissions || [],
      isSuperAdmin: user.isSuperAdmin || false,
      canManageUsers:
        user.canManageUsers !== undefined ? user.canManageUsers : true,
      canManagePayroll:
        user.canManagePayroll !== undefined ? user.canManagePayroll : true,
      managerId: user.managerId || "",
      attendanceId: user.attendanceId || "",
      preferredShift: user.preferredShift || "",
      moderatorLevel: user.moderatorLevel || "junior",
      moderatorScope: user.moderatorScope || ["content"],
      canModerateUsers:
        user.canModerateUsers !== undefined ? user.canModerateUsers : false,
      canModerateContent:
        user.canModerateContent !== undefined ? user.canModerateContent : true,
      canViewReports:
        user.canViewReports !== undefined ? user.canViewReports : true,
      canManageReports:
        user.canManageReports !== undefined ? user.canManageReports : false,
      moderationLimits: user.moderationLimits || null,
    });

    setSelectedFile(null);
    setProfilePreview(null);
    setShowAdvanced(true);

    toast("Edit mode activated. Scroll to form.", {
      icon: "✏️",
      duration: 2000,
    });

    setTimeout(() => {
      document.getElementById("userForm")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // handleDelete ফাংশনটা সম্পূর্ণ এভাবে পরিবর্তন করুন:
  const handleDelete = async (user) => {
    const userName = `${user.firstName} ${user.lastName}`;

    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
      max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-red-600" size={20} />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Delete User</p>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{userName}</span>? This action
                  cannot be undone.
                </p>
                <div className="mt-2 text-xs text-gray-600">
                  <p>
                    Role:{" "}
                    <span className="font-semibold capitalize">
                      {user.role}
                    </span>
                  </p>
                  <p>
                    Email: <span className="font-semibold">{user.email}</span>
                  </p>
                  {/* সরাসরি warning message দিন */}
                  {(user.role === "admin" || user.role === "superAdmin") && (
                    <p className="mt-1 text-yellow-600">
                      <AlertCircle size={10} className="inline mr-1" />
                      Note: Only Super Admin can delete Admin users
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(user._id, userName, user.role);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none hover:bg-red-50"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
      },
    );
  };

  const confirmDelete = async (userId, userName, userRole) => {
    const loadingToast = toast.loading(`Deleting ${userName}...`);

    try {
      const res = await deleteUserAPI(userId);

      if (res.message === "User deleted successfully" || res.success) {
        toast.dismiss(loadingToast);
        toast.success(`${userName} deleted successfully!`, {
          icon: "🗑️",
          duration: 3000,
          style: {
            background: "#10B981",
            color: "#fff",
          },
        });
        fetchUsers();
      } else {
        toast.dismiss(loadingToast);
        toast.error(res.message || "Failed to delete user", {
          icon: "❌",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);

      // Backend থেকে error message পাওয়া গেলে সেটা দেখাবে
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          icon: "🚫",
          duration: 5000,
        });
      } else if (error.message.includes("403")) {
        toast.error("You don't have permission to delete this user!", {
          icon: "🚫",
          duration: 5000,
        });
      } else {
        toast.error("Error deleting user: " + error.message, {
          icon: "❌",
          duration: 5000,
        });
      }
    }
  };

  // ================= RESET PASSWORD FUNCTIONS =================

  // Handle Reset Password Page
  const handleOpenResetPasswordPage = (user) => {
    setSelectedUserForReset(user);
    setResetNewPassword("");
    setResetConfirmPassword("");
    setShowResetNewPwd(false);
    setShowResetPasswordPage(true);
  };

  // Admin direct password reset (no OTP)
  const handleDirectResetPassword = async () => {
    if (resetNewPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    const userId = selectedUserForReset?._id || currentUserId;
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    setResetPasswordLoading(true);
    try {
      setupAxios();
      await axios.put(`/admin/direct-reset-password/${userId}`, {
        newPassword: resetNewPassword,
      });
      toast.success(
        `Password reset successfully for ${selectedUserForReset?.firstName || "user"}`,
      );
      handleCloseResetPasswordPage();
      // Refresh list so the table stays in sync (avoids the list vanishing until a full reload)
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  // Handle Close Reset Password Modal
  const handleCloseResetPasswordPage = () => {
    setShowResetPasswordPage(false);
    setSelectedUserForReset(null);
    setResetNewPassword("");
    setResetConfirmPassword("");
    setShowResetNewPwd(false);
  };

  // ================= SHIFT MANAGEMENT FUNCTIONS =================

  // Open shift management modal
  const handleOpenShiftManagement = (employee = null) => {
    if (employee) {
      setSelectedEmployeeForShift(employee);

      if (employee.shiftTiming?.currentShift?.isActive) {
        setShiftForm({
          startTime: employee.shiftTiming.currentShift.start || "09:00",
          endTime: employee.shiftTiming.currentShift.end || "18:00",
          effectiveDate: employee.shiftTiming.currentShift.effectiveDate
            ? new Date(employee.shiftTiming.currentShift.effectiveDate)
                .toISOString()
                .split("T")[0]
            : new Date().toISOString().split("T")[0],
          reason: "",
          isPermanent: false,
        });
      } else {
        setShiftForm({
          startTime: defaultShiftTime.start,
          endTime: defaultShiftTime.end,
          effectiveDate: new Date().toISOString().split("T")[0],
          reason: "",
          isPermanent: false,
        });
      }
    } else {
      setSelectedEmployeeForShift(null);
      setShiftForm({
        startTime: defaultShiftTime.start,
        endTime: defaultShiftTime.end,
        effectiveDate: new Date().toISOString().split("T")[0],
        reason: "",
        isPermanent: false,
      });
    }
    setShowShiftManagement(true);
  };

  // Assign shift to employee
  const handleAssignShift = async () => {
    if (!selectedEmployeeForShift) {
      toast.error("Please select an employee first");
      return;
    }

    if (!shiftForm.startTime || !shiftForm.endTime) {
      toast.error("Please enter start and end time");
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(shiftForm.startTime) ||
      !timeRegex.test(shiftForm.endTime)
    ) {
      toast.error("Invalid time format. Use HH:mm (24-hour format)");
      return;
    }

    const loadingToast = toast.loading(
      `Assigning shift to ${selectedEmployeeForShift.firstName}...`,
    );

    try {
      const result = await assignShiftToEmployee(
        selectedEmployeeForShift._id,
        shiftForm,
      );

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(
          `✅ Shift assigned successfully to ${selectedEmployeeForShift.firstName}!`,
          {
            duration: 4000,
            icon: "🕐",
          },
        );

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedEmployeeForShift._id
              ? {
                  ...user,
                  shiftTiming: {
                    ...user.shiftTiming,
                    currentShift: {
                      start: shiftForm.startTime,
                      end: shiftForm.endTime,
                      isActive: true,
                      assignedAt: new Date(),
                      effectiveDate: shiftForm.effectiveDate,
                    },
                  },
                }
              : user,
          ),
        );

        setShowShiftManagement(false);
        fetchShiftStatistics();

        setTimeout(() => {
          toast(
            `📧 Shift change notification sent to ${selectedEmployeeForShift.email}`,
            {
              duration: 3000,
              icon: "📨",
            },
          );
        }, 1000);
      } else {
        toast.error(result.message || "Failed to assign shift");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`❌ Failed to assign shift: ${error.message}`);
    }
  };

  // Reset employee shift to default
  const handleResetShift = async () => {
    if (!selectedEmployeeForShift) {
      toast.error("Please select an employee first");
      return;
    }

    if (!selectedEmployeeForShift.shiftTiming?.currentShift?.isActive) {
      toast.error("This employee does not have an active assigned shift");
      return;
    }

    const loadingToast = toast.loading(
      `Resetting shift for ${selectedEmployeeForShift.firstName}...`,
    );

    try {
      const result = await resetEmployeeShift(
        selectedEmployeeForShift._id,
        shiftForm.reason,
      );

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(
          `✅ Shift reset to default for ${selectedEmployeeForShift.firstName}!`,
          {
            duration: 4000,
            icon: "🔄",
          },
        );

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedEmployeeForShift._id
              ? {
                  ...user,
                  shiftTiming: {
                    ...user.shiftTiming,
                    currentShift: {
                      start: "",
                      end: "",
                      isActive: false,
                    },
                  },
                }
              : user,
          ),
        );

        setShowShiftManagement(false);
        fetchShiftStatistics();
      } else {
        toast.error(result.message || "Failed to reset shift");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`❌ Failed to reset shift: ${error.message}`);
    }
  };

  // Update default shift timing
  const handleUpdateDefaultShift = async () => {
    if (!shiftForm.startTime || !shiftForm.endTime) {
      toast.error("Please enter start and end time");
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(shiftForm.startTime) ||
      !timeRegex.test(shiftForm.endTime)
    ) {
      toast.error("Invalid time format. Use HH:mm (24-hour format)");
      return;
    }

    const loadingToast = toast.loading("Updating default shift timing...");

    try {
      const result = await updateDefaultShift(
        shiftForm.startTime,
        shiftForm.endTime,
      );

      toast.dismiss(loadingToast);

      if (result.success) {
        setDefaultShiftTime({
          start: shiftForm.startTime,
          end: shiftForm.endTime,
        });

        toast.success(
          `✅ Default shift updated to ${shiftForm.startTime} - ${shiftForm.endTime}!`,
          {
            duration: 4000,
            icon: "⚙️",
          },
        );

        setShowShiftManagement(false);
        fetchShiftStatistics();
      } else {
        toast.error(result.message || "Failed to update default shift");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`❌ Failed to update default shift: ${error.message}`);
    }
  };

  // View shift history
  const handleViewShiftHistory = async (employee) => {
    const loadingToast = toast.loading(
      `Loading shift history for ${employee.firstName}...`,
    );

    try {
      const result = await getEmployeeShiftHistory(employee._id);

      toast.dismiss(loadingToast);

      if (result.success) {
        setShiftHistory(result.shiftHistory || []);
        setSelectedEmployeeForShift(employee);
        setShowShiftHistory(true);
      } else {
        toast.error(result.message || "Failed to load shift history");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`❌ Failed to load shift history: ${error.message}`);
    }
  };

  // Toggle employee selection for bulk shift assign
  const handleToggleEmployeeForBulk = (employeeId) => {
    setSelectedEmployeesForBulk((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Bulk assign shifts
  const handleBulkAssignShifts = async () => {
    if (selectedEmployeesForBulk.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    if (!shiftForm.startTime || !shiftForm.endTime) {
      toast.error("Please enter start and end time");
      return;
    }

    const loadingToast = toast.loading(
      `Assigning shift to ${selectedEmployeesForBulk.length} employees...`,
    );

    try {
      const result = await bulkAssignShifts(
        selectedEmployeesForBulk,
        shiftForm,
      );

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(
          `✅ Shift assigned to ${result.summary?.successful || 0} employees successfully!`,
          {
            duration: 5000,
            icon: "👥",
          },
        );

        fetchUsers();
        setShowBulkShiftAssign(false);
        setSelectedEmployeesForBulk([]);
        fetchShiftStatistics();
      } else {
        toast.error(result.message || "Failed to assign shifts");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`❌ Failed to assign shifts: ${error.message}`);
    }
  };

  // Get current shift for employee
  const getCurrentShift = (user) => {
    if (!user.shiftTiming) {
      return {
        start: defaultShiftTime.start,
        end: defaultShiftTime.end,
        type: "default",
      };
    }

    if (user.shiftTiming.currentShift?.isActive) {
      return {
        start: user.shiftTiming.currentShift.start || defaultShiftTime.start,
        end: user.shiftTiming.currentShift.end || defaultShiftTime.end,
        type: "assigned",
        isActive: true,
        assignedAt: user.shiftTiming.currentShift.assignedAt,
      };
    }

    if (user.shiftTiming.defaultShift) {
      return {
        start: user.shiftTiming.defaultShift.start || defaultShiftTime.start,
        end: user.shiftTiming.defaultShift.end || defaultShiftTime.end,
        type: "default",
      };
    }

    return {
      start: defaultShiftTime.start,
      end: defaultShiftTime.end,
      type: "default",
    };
  };

  // Format shift time for display
  const formatShiftTime = (shift) => {
    return `${shift.start} - ${shift.end}`;
  };

  // Shift status badge
  // UserRolesPage কম্পোনেন্টে ShiftBadge কম্পোনেন্টটি এইভাবে পরিবর্তন করুন:
  const ShiftBadge = ({ user }) => {
    // Get shift timing display
    const getShiftDisplay = (user) => {
      const shiftTiming = user.shiftTiming || {};
      const today = new Date().toISOString().split("T")[0];

      // Check for today's active shift
      const todaysActiveShift =
        shiftTiming.currentShift?.isActive &&
        shiftTiming.currentShift.effectiveDate === today
          ? shiftTiming.currentShift
          : null;

      // Check shift history for today
      const todaysShiftFromHistory = shiftTiming.shiftHistory?.find(
        (shift) => shift.effectiveDate === today,
      );

      // Use whichever is available
      const activeShift = todaysActiveShift || todaysShiftFromHistory;

      if (activeShift) {
        return `${activeShift.start || activeShift.startTime} - ${activeShift.end || activeShift.endTime}`;
      }

      // Check for assigned shift
      if (shiftTiming.assignedShift && shiftTiming.assignedShift.start) {
        return `${shiftTiming.assignedShift.start} - ${shiftTiming.assignedShift.end}`;
      }

      // Default shift
      return `${shiftTiming.defaultShift?.start || "09:00"} - ${shiftTiming.defaultShift?.end || "18:00"}`;
    };

    // Check if user has assigned shift
    const hasAssignedShift = () => {
      const shiftTiming = user.shiftTiming || {};
      const today = new Date().toISOString().split("T")[0];

      // Check any assigned shift
      const hasAssignedShift =
        shiftTiming.assignedShift?.start ||
        shiftTiming.currentShift?.isActive ||
        (shiftTiming.shiftHistory && shiftTiming.shiftHistory.length > 0);

      return hasAssignedShift;
    };

    const shiftDisplay = getShiftDisplay(user);
    const isAssignedShift = hasAssignedShift();

    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isAssignedShift
            ? "bg-purple-100 text-purple-700 border border-purple-200"
            : "bg-gray-100 text-gray-700 border border-gray-200"
        }`}
      >
        <Clock size={10} className="mr-1" />
        {isAssignedShift ? "Assigned Shift" : "Default Shift"}
        <span className="ml-1 font-bold">{shiftDisplay}</span>
      </div>
    );
  };

  // ================= MAIN COMPONENTS =================

  // Shift Management Modal Component
  const ShiftManagementModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedEmployeeForShift
                    ? `Manage Shift: ${selectedEmployeeForShift.firstName} ${selectedEmployeeForShift.lastName}`
                    : "Shift Management"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedEmployeeForShift
                    ? "Assign or modify employee shift timing"
                    : "Update default shift timing for all employees"}
                </p>
              </div>
              <button
                onClick={() => setShowShiftManagement(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            {selectedEmployeeForShift && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                  Current Shift
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatShiftTime(
                        getCurrentShift(selectedEmployeeForShift),
                      )}
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      {getCurrentShift(selectedEmployeeForShift).type ===
                      "assigned"
                        ? "Assigned Shift (Custom)"
                        : "Default Company Shift"}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      getCurrentShift(selectedEmployeeForShift).type ===
                      "assigned"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getCurrentShift(selectedEmployeeForShift).type ===
                    "assigned"
                      ? "Custom"
                      : "Default"}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Timing (24-hour format)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center mb-1">
                      <Clock size={14} className="text-gray-500 mr-1" />
                      <span className="text-xs text-gray-600">Start Time</span>
                    </div>
                    <input
                      type="time"
                      value={shiftForm.startTime}
                      onChange={(e) =>
                        setShiftForm((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <Clock size={14} className="text-gray-500 mr-1" />
                      <span className="text-xs text-gray-600">End Time</span>
                    </div>
                    <input
                      type="time"
                      value={shiftForm.endTime}
                      onChange={(e) =>
                        setShiftForm((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={shiftForm.effectiveDate}
                  onChange={(e) =>
                    setShiftForm((prev) => ({
                      ...prev,
                      effectiveDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Change (Optional)
                </label>
                <textarea
                  value={shiftForm.reason}
                  onChange={(e) =>
                    setShiftForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="e.g., Project requirements, Department changes, etc."
                  rows="2"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              {!selectedEmployeeForShift && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPermanent"
                    checked={shiftForm.isPermanent}
                    onChange={(e) =>
                      setShiftForm((prev) => ({
                        ...prev,
                        isPermanent: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="isPermanent"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Set as new default shift for all employees
                  </label>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Shift Preview
              </h3>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                  {shiftForm.startTime} - {shiftForm.endTime}
                </div>
                <div className="text-sm text-gray-600">
                  Effective:{" "}
                  {new Date(shiftForm.effectiveDate).toLocaleDateString()}
                </div>
              </div>
              {shiftForm.reason && (
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-medium">Reason:</span>{" "}
                  {shiftForm.reason}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between">
              <div className="flex space-x-3">
                {selectedEmployeeForShift &&
                  getCurrentShift(selectedEmployeeForShift).type ===
                    "assigned" && (
                    <button
                      onClick={handleResetShift}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                    >
                      Reset to Default
                    </button>
                  )}
                <button
                  onClick={() => setShowShiftManagement(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <div className="flex space-x-3">
                {selectedEmployeeForShift ? (
                  <button
                    onClick={handleAssignShift}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-[#113F67] text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                  >
                    Update Shift
                  </button>
                ) : (
                  <button
                    onClick={handleUpdateDefaultShift}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                  >
                    Update Default Shift
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Shift History Modal
  const ShiftHistoryModal = () => {
    if (!selectedEmployeeForShift) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shift History: {selectedEmployeeForShift.firstName}{" "}
                  {selectedEmployeeForShift.lastName}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  All previous shift assignments and changes
                </p>
              </div>
              <button
                onClick={() => setShowShiftHistory(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            {shiftHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  No Shift History
                </h3>
                <p className="text-gray-500">
                  No shift changes recorded for this employee.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {shiftHistory.map((history, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {history.start} - {history.end}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {history.reason || "No reason provided"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(history.assignedAt).toLocaleDateString()}
                      </div>
                    </div>
                    {history.endedAt && (
                      <div className="text-xs text-gray-500 mt-2">
                        Ended: {new Date(history.endedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {shiftHistory.length} shift records found
              </div>
              <button
                onClick={() => setShowShiftHistory(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Shift Statistics Modal
  const ShiftStatisticsModal = () => {
    if (!shiftStatistics) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shift Statistics
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Overview of shift distribution and patterns
                </p>
              </div>
              <button
                onClick={() => setShowShiftStatistics(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-700 font-medium">
                        Total Employees
                      </p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        {shiftStatistics.totalEmployees || 0}
                      </p>
                    </div>
                    <UsersRound className="text-purple-500" size={24} />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        With Assigned Shifts
                      </p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {shiftStatistics.employeesWithAssignedShifts || 0}
                      </p>
                    </div>
                    <Target className="text-blue-500" size={24} />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-medium">
                        On Default Shift
                      </p>
                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {shiftStatistics.employeesOnDefaultShift || 0}
                      </p>
                    </div>
                    <Clock className="text-green-500" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Shift Distribution
                </h3>
                <div className="space-y-3">
                  {shiftStatistics.shiftDistribution?.map((shift, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="text-sm text-gray-700">
                        {shift._id.start} - {shift._id.end}
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-[#113F67] h-2 rounded-full"
                            style={{
                              width: `${(shift.count / shiftStatistics.totalEmployees) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {shift.count} (
                          {Math.round(
                            (shift.count / shiftStatistics.totalEmployees) *
                              100,
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-gray-500">
                      No shift distribution data available
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-yellow-800 mb-3">
                  Default Company Shift
                </h3>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-900">
                      {defaultShiftTime.start} - {defaultShiftTime.end}
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Regular working hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <button
                onClick={() => setShowShiftStatistics(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bulk Shift Assign Modal
  const BulkShiftAssignModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Bulk Shift Assignment
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Assign the same shift to multiple employees at once
                </p>
              </div>
              <button
                onClick={() => setShowBulkShiftAssign(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Shift Configuration
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={shiftForm.startTime}
                        onChange={(e) =>
                          setShiftForm((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={shiftForm.endTime}
                        onChange={(e) =>
                          setShiftForm((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      value={shiftForm.effectiveDate}
                      onChange={(e) =>
                        setShiftForm((prev) => ({
                          ...prev,
                          effectiveDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Reason (Optional)
                    </label>
                    <textarea
                      value={shiftForm.reason}
                      onChange={(e) =>
                        setShiftForm((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      placeholder="e.g., New project requirements, Department reorganization"
                      rows="2"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Select Employees ({selectedEmployeesForBulk.length} selected)
                </h3>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {users
                    .filter((user) => user.role === "employee")
                    .map((user) => (
                      <div
                        key={user._id}
                        className={`flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedEmployeesForBulk.includes(user._id)
                            ? "bg-purple-50"
                            : ""
                        }`}
                        onClick={() => handleToggleEmployeeForBulk(user._id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEmployeesForBulk.includes(user._id)}
                          onChange={() => handleToggleEmployeeForBulk(user._id)}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                        <ShiftBadge user={user} />
                      </div>
                    ))}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      const allEmployeeIds = users
                        .filter((user) => user.role === "employee")
                        .map((user) => user._id);
                      setSelectedEmployeesForBulk(allEmployeeIds);
                    }}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setSelectedEmployeesForBulk([])}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Assignment Preview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {shiftForm.startTime} - {shiftForm.endTime}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Shift Timing</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedEmployeesForBulk.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Employees Selected
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between">
              <button
                onClick={() => setShowBulkShiftAssign(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAssignShifts}
                disabled={selectedEmployeesForBulk.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-[#113F67] text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign to {selectedEmployeesForBulk.length} Employees
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Reset Password Modal
  const generateStrongPassword = () => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghjkmnpqrstuvwxyz";
    const digits = "23456789";
    const symbols = "@#$%&*!";
    const all = upper + lower + digits + symbols;
    let pwd = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      digits[Math.floor(Math.random() * digits.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];
    for (let i = 4; i < 12; i++) {
      pwd.push(all[Math.floor(Math.random() * all.length)]);
    }
    pwd = pwd.sort(() => Math.random() - 0.5).join("");
    setResetNewPassword(pwd);
    setResetConfirmPassword(pwd);
    setShowResetNewPwd(true);
    toast.success("Strong password generated!", { duration: 2000 });
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2)
      return {
        label: "Weak",
        color: "bg-red-400",
        width: "w-1/4",
        text: "text-red-500",
      };
    if (score <= 4)
      return {
        label: "Fair",
        color: "bg-yellow-400",
        width: "w-2/4",
        text: "text-yellow-600",
      };
    if (score === 5)
      return {
        label: "Good",
        color: "bg-blue-400",
        width: "w-3/4",
        text: "text-blue-600",
      };
    return {
      label: "Strong",
      color: "bg-green-500",
      width: "w-full",
      text: "text-green-600",
    };
  };

  const pwdStrength = getPasswordStrength(resetNewPassword);

  const resetPasswordModal = showResetPasswordPage && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-[#113F67] to-purple-700 p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Reset Password</h2>
            <p className="text-sm opacity-80 mt-0.5">
              {selectedUserForReset?.firstName} {selectedUserForReset?.lastName}
            </p>
          </div>
          <button
            onClick={handleCloseResetPasswordPage}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* User info strip */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#113F67] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {selectedUserForReset?.firstName?.charAt(0)}
            {selectedUserForReset?.lastName?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {selectedUserForReset?.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {selectedUserForReset?.role}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Strong password generator button */}
          <button
            type="button"
            onClick={generateStrongPassword}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all text-sm font-medium"
          >
            <Zap size={15} className="text-purple-500" />
            Generate Strong Password
          </button>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showResetNewPwd ? "text" : "password"}
                value={resetNewPassword}
                onChange={(e) => {
                  setResetNewPassword(e.target.value);
                  setResetConfirmPassword("");
                }}
                placeholder="Enter new password (min 6 chars)"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl pr-10 focus:ring-2 focus:ring-[#113F67] focus:border-transparent outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowResetNewPwd(!showResetNewPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showResetNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength meter */}
            {pwdStrength && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${pwdStrength.color} ${pwdStrength.width}`}
                  />
                </div>
                <p className={`text-xs font-medium ${pwdStrength.text}`}>
                  {pwdStrength.label}
                  {pwdStrength.label === "Weak" &&
                    " — add uppercase, numbers & symbols"}
                  {pwdStrength.label === "Fair" &&
                    " — almost there, try adding symbols"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showResetNewPwd ? "text" : "password"}
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`w-full px-4 py-2.5 border rounded-xl pr-10 focus:ring-2 focus:ring-[#113F67] focus:border-transparent outline-none text-sm ${
                  resetConfirmPassword &&
                  resetNewPassword !== resetConfirmPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}
              />
            </div>
            {resetConfirmPassword &&
              resetNewPassword !== resetConfirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords don&apos;t match
                </p>
              )}
            {resetConfirmPassword &&
              resetNewPassword === resetConfirmPassword && (
                <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
              )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={handleCloseResetPasswordPage}
            className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDirectResetPassword}
            disabled={
              resetPasswordLoading || !resetNewPassword || !resetConfirmPassword
            }
            className="flex-1 py-2.5 bg-[#113F67] text-white rounded-xl font-semibold hover:bg-[#0d3256] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
          >
            {resetPasswordLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Resetting...
              </>
            ) : (
              <>
                <Key size={15} /> Reset Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Existing View function with shift management buttons
  const handleView = (user) => {
    const userPicture = user.profilePicture || user.picture;

    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} 
        max-w-md w-full bg-gradient-to-br from-purple-50 to-white shadow-xl rounded-xl pointer-events-auto ring-1 ring-purple-100`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#113F67]">
                  {userPicture ? (
                    <img
                      src={userPicture}
                      alt={user.firstName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        const parent = e.target.parentElement;
                        parent.innerHTML = `
                        <div class="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg">
                          ${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}
                        </div>
                      `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.firstName?.charAt(0) || ""}
                      {user.lastName?.charAt(0) || ""}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {user.role?.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Mail className="w-4 h-4 mr-3 text-purple-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-3 text-blue-500" />
                <span>{user.phone || "Not provided"}</span>
              </div>
              {/* User View Modal এ এই অংশ পরিবর্তন করুন */}
              <div className="flex items-center text-gray-700">
                <Briefcase className="w-4 h-4 mr-3 text-green-500" />
                <span className="capitalize">
                  {user.workArrangement || "full-time"} •{" "}
                  {user.workLocationType || "onsite"}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <Building className="w-4 h-4 mr-3 text-green-500" />
                <span>{user.department || "Not assigned"}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CreditCard className="w-4 h-4 mr-3 text-yellow-500" />
                <span>৳{(user.rate || 0).toLocaleString()}/month</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status?.toUpperCase()}
                </span>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    handleEdit(user);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-[#113F67] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: "top-right",
      },
    );
  };

  // View Updates Modal — updated fields = RED, current unchanged fields = GREEN
  const ViewUpdatesModal = () => {
    if (!showUpdateModal || !selectedUpdateNotif || !selectedUpdateUser)
      return null;

    const DISPLAY_FIELDS = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "department", label: "Department" },
      { key: "designation", label: "Designation" },
      { key: "workLocationType", label: "Work Location" },
      { key: "workArrangement", label: "Work Arrangement" },
      { key: "salary", label: "Salary" },
      { key: "salaryType", label: "Salary Type" },
      { key: "joiningDate", label: "Joining Date" },
      { key: "shiftTiming", label: "Shift Timing" },
      { key: "bankDetails", label: "Bank Details" },
      { key: "address", label: "Address" },
      { key: "gender", label: "Gender" },
      { key: "bloodGroup", label: "Blood Group" },
      { key: "maritalStatus", label: "Marital Status" },
      { key: "nid", label: "NID" },
    ];

    const updatedSet = new Set(selectedUpdateNotif.updatedFields || []);
    const updatedData = selectedUpdateNotif.updatedData || {};

    // Also include any extra updated fields not in DISPLAY_FIELDS
    const extraFields = (selectedUpdateNotif.updatedFields || [])
      .filter((f) => !DISPLAY_FIELDS.find((d) => d.key === f))
      .map((f) => ({ key: f, label: f }));

    const allFields = [...DISPLAY_FIELDS, ...extraFields];

    const renderVal = (field, val) => {
      if (val === null || val === undefined || val === "")
        return <span className="opacity-50 text-sm">—</span>;

      if (field === "bankDetails" && typeof val === "object") {
        const rows = [
          { label: "Bank", value: val.bankName },
          { label: "Account No.", value: val.accountNumber },
          { label: "Holder", value: val.accountHolderName },
          { label: "Branch", value: val.branchName },
          { label: "Routing", value: val.routingNumber },
          { label: "Type", value: val.accountType },
        ].filter((r) => r.value);
        return (
          <div className="space-y-0.5">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-2 text-xs">
                <span className="opacity-60 w-20 shrink-0">{r.label}:</span>
                <span className="font-medium">{r.value}</span>
              </div>
            ))}
          </div>
        );
      }

      if (field === "shiftTiming" && typeof val === "object") {
        const shift = val.defaultShift || val.assignedShift || val;
        const start = shift.start || val.start;
        const end = shift.end || val.end;
        if (start || end)
          return (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono bg-black/10 px-2 py-0.5 rounded">
                {start || "—"}
              </span>
              <span className="opacity-50">→</span>
              <span className="font-mono bg-black/10 px-2 py-0.5 rounded">
                {end || "—"}
              </span>
            </div>
          );
      }

      if (field === "address" && typeof val === "object") {
        const parts = [
          val.street,
          val.city,
          val.state,
          val.zip,
          val.country,
        ].filter(Boolean);
        return <span className="text-sm">{parts.join(", ") || "—"}</span>;
      }

      if (typeof val === "object" && !Array.isArray(val)) {
        const entries = Object.entries(val).filter(
          ([, v]) => v !== null && v !== undefined && v !== "",
        );
        if (!entries.length)
          return <span className="opacity-50 text-sm">—</span>;
        return (
          <div className="space-y-0.5">
            {entries.map(([k, v]) => (
              <div key={k} className="flex gap-2 text-xs">
                <span className="opacity-60 capitalize w-24 shrink-0">
                  {k}:
                </span>
                <span>{String(v)}</span>
              </div>
            ))}
          </div>
        );
      }

      if (Array.isArray(val))
        return <span className="text-sm">{val.join(", ") || "—"}</span>;

      // Format date fields — strip the T00:00:00.000Z suffix
      const dateFields = [
        "joiningDate",
        "dateOfBirth",
        "createdAt",
        "updatedAt",
      ];
      if (dateFields.includes(field) && val) {
        const d = new Date(val);
        if (!isNaN(d))
          return (
            <span className="text-sm">
              {d.toLocaleDateString("en-BD", {
                timeZone: "Asia/Dhaka",
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </span>
          );
      }

      return <span className="text-sm">{String(val)}</span>;
    };

    const getCurrentVal = (key) => {
      if (key === "shiftTiming") return selectedUpdateUser.shiftTiming;
      if (key === "bankDetails") return selectedUpdateUser.bankDetails;
      return selectedUpdateUser[key];
    };

    const hasValue = (key) => {
      const v = getCurrentVal(key);
      if (v === null || v === undefined || v === "") return false;
      if (typeof v === "object") return Object.keys(v).length > 0;
      return true;
    };

    const updatedCount = [...updatedSet].length;

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-[#113F67] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-base">
                  {selectedUpdateUser.firstName} {selectedUpdateUser.lastName}
                </h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                    selectedUpdateNotif.status === "pending"
                      ? "bg-red-500 text-white"
                      : selectedUpdateNotif.status === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                  }`}
                >
                  {selectedUpdateNotif.status}
                </span>
              </div>
              <p className="text-white/60 text-xs mt-0.5">
                {updatedCount} field{updatedCount !== 1 ? "s" : ""} updated
                &bull;{" "}
                {new Date(selectedUpdateNotif.createdAt).toLocaleString(
                  "en-BD",
                  {
                    timeZone: "Asia/Dhaka",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  },
                )}
              </p>
            </div>
            <button
              onClick={() => setShowUpdateModal(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Legend */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-400 inline-block"></span>
              <span className="text-gray-600">Updated (pending approval)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-green-400 inline-block"></span>
              <span className="text-gray-600">Current (unchanged)</span>
            </span>
          </div>

          <div
            className="overflow-auto"
            style={{ maxHeight: "calc(85vh - 150px)" }}
          >
            <table className="w-full min-w-[640px]">
              <thead className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase w-36">
                    Field
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allFields.map(({ key, label }) => {
                  const isUpdated = updatedSet.has(key);
                  const val = isUpdated ? updatedData[key] : getCurrentVal(key);
                  if (!isUpdated && !hasValue(key)) return null;
                  return (
                    <tr
                      key={key}
                      className={
                        isUpdated
                          ? "bg-red-50 border-l-4 border-l-red-400"
                          : "bg-green-50 border-l-4 border-l-green-400"
                      }
                    >
                      <td
                        className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap align-top ${isUpdated ? "text-red-700" : "text-green-700"}`}
                      >
                        {label}
                      </td>
                      <td className="px-4 py-2.5 align-top text-gray-900">
                        {renderVal(key, val)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="px-4 py-1.5 bg-[#113F67] text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Filter users based on search, role, and status
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower);

    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admins: users.filter((u) => u.role === "admin" || u.role === "superAdmin")
      .length,
    employees: users.filter((u) => u.role === "employee").length,
    moderators: users.filter((u) => u.role === "moderator").length,
    totalSalary: users.reduce((sum, user) => sum + (user.rate || 0), 0),
    customShifts: users.filter((u) => getCurrentShift(u).type === "assigned")
      .length,
  };

  // Function to get user initials
  const getUserInitials = (user) => {
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  // Main Users Page
  return (
    <>
      {/* Shift Management Modals */}
      {showShiftManagement && <ShiftManagementModal />}
      {showShiftHistory && <ShiftHistoryModal />}
      {showShiftStatistics && <ShiftStatisticsModal />}
      {showBulkShiftAssign && <BulkShiftAssignModal />}
      <ViewUpdatesModal />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-2 md:p-4">
        {/* Header Section with Shift Management Buttons */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-[#113F67] bg-clip-text text-transparent">
                Employee Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all system users with advanced shift controls
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {/* Shift Management Buttons */}
              {/* <button
                onClick={() => handleOpenShiftManagement()}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                title="Update Default Shift"
              >
                <Clock size={18} />
                Default Shift
              </button> */}
              {/* <button
                onClick={() => setShowBulkShiftAssign(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                title="Bulk Assign Shifts"
              >
                <Layers size={18} />
                Bulk Assign
              </button> */}
              {/* <button
                onClick={() => setShowShiftStatistics(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                title="View Shift Statistics"
              >
                <BarChart3 size={18} />
                Statistics
              </button> */}
              {/* <button
                onClick={fetchUsers}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 shadow-sm hover:shadow"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                Refresh
              </button> */}
            </div>
          </div>

          {/* Profile Update Notifications Panel */}
          {pendingNotifications.length > 0 && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowNotifPanel((p) => !p)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-sm font-semibold text-amber-800">
                    {pendingNotifications.length} pending profile update
                    {pendingNotifications.length > 1 ? "s" : ""} awaiting
                    approval
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-amber-600 transition-transform ${showNotifPanel ? "rotate-180" : ""}`}
                />
              </button>
              {showNotifPanel && (
                <div className="divide-y divide-amber-100 border-t border-amber-200">
                  {pendingNotifications.map((n) => (
                    <div
                      key={n._id}
                      className="flex items-center gap-3 px-4 py-3 bg-white"
                    >
                      <div className="w-8 h-8 bg-[#113F67]/10 rounded-full flex items-center justify-center shrink-0">
                        <UserPen size={14} className="text-[#113F67]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {n.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {n.userEmail} &bull;{" "}
                          <span className="capitalize">{n.userRole}</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {n.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleApproveNotif(n._id)}
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectNotif(n._id)}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stats Cards with Shift Info */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedRole("all");
                setSelectedStatus("all");
                setCurrentPage(1);
              }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Total Users
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={18} />
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole("all");
                setSelectedStatus("active");
                setCurrentPage(1);
              }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Active Users
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {stats.active}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="text-white" size={18} />
                </div>
              </div>
            </button>

            {/* <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Custom Shifts</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stats.customShifts}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Clock className="text-white" size={18} />
                </div>
              </div>
            </div> */}

            <button
              type="button"
              onClick={() => {
                setSelectedRole("admin");
                setSelectedStatus("all");
                setCurrentPage(1);
              }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Administrators
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {stats.admins}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={18} />
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole("all");
                setSelectedStatus("all");
                setCurrentPage(1);
              }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Monthly Salary
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    ৳{stats.totalSalary.toLocaleString()}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-white" size={18} />
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Employee Directory
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Showing {startIndex + 1}-{endIndex} of{" "}
                      {filteredUsers.length} users
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-full text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedRole}
                        onChange={(e) => {
                          setSelectedRole(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                      >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="moderator">Moderator</option>
                      </select>
                      <select
                        value={selectedStatus}
                        onChange={(e) => {
                          setSelectedStatus(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* User List Container */}
              <div className="flex-1 overflow-hidden">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3 mx-auto"></div>
                      <p className="text-gray-600 font-medium">
                        Loading users...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full overflow-auto">
                    <table className="w-full min-w-[560px]">
                      <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            User
                          </th>
                          <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Role & Shift
                          </th>
                          <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Update Status
                          </th>
                          <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentUsers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                  <UserCog
                                    className="text-gray-400"
                                    size={24}
                                  />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                                  No users found
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {searchTerm ||
                                  selectedRole !== "all" ||
                                  selectedStatus !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Start by creating your first user"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          currentUsers.map((user) => {
                            const userPicture =
                              user.profilePicture || user.picture;
                            return (
                              <tr key={user._id} className="hover:bg-gray-50">
                                <td className="p-3">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-[#113F67]">
                                      {userPicture ? (
                                        <img
                                          src={userPicture}
                                          alt={user.firstName}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = "none";
                                            const parent =
                                              e.target.parentElement;
                                            parent.innerHTML = `
                                              <div class="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                ${getUserInitials(user)}
                                              </div>
                                            `;
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm">
                                          {getUserInitials(user)}
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-3 min-w-0">
                                      <a
                                        href={`/hrm/profile?userId=${user._id}`}
                                        className="font-semibold text-gray-900 text-sm truncate hover:text-purple-600 hover:underline transition-all"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          router.push(
                                            `/hrm/view?userId=${user._id}`,
                                          );
                                        }}
                                      >
                                        {user.firstName} {user.lastName}
                                      </a>
                                      <div className="text-xs text-gray-500 truncate flex items-center">
                                        <Mail size={10} className="mr-1" />
                                        <a
                                          href={`/hrm/view?userId=${user._id}&section=contact`}
                                          className="truncate hover:text-purple-600 hover:underline"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            router.push(
                                              `/hrm/view?userId=${user._id}&section=contact`,
                                            );
                                          }}
                                        >
                                          {user.email}
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <div
                                        className={`p-1.5 rounded ${
                                          user.role === "admin" ||
                                          user.role === "superAdmin"
                                            ? "bg-purple-100 text-purple-800"
                                            : user.role === "moderator"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {user.role === "admin" && (
                                          <Shield size={12} />
                                        )}
                                        {user.role === "superAdmin" && (
                                          <ShieldCheck size={12} />
                                        )}
                                        {user.role === "moderator" && (
                                          <UserCog size={12} />
                                        )}
                                        {user.role === "employee" && (
                                          <Users size={12} />
                                        )}
                                      </div>
                                      <span className="ml-2 text-xs font-medium capitalize">
                                        {user.role}
                                      </span>
                                    </div>
                                    <ShiftBadge user={user} />
                                  </div>
                                </td>
                                {/* Profile update notification status */}
                                <td className="p-3">
                                  {(() => {
                                    const notif = allNotifsByUser[user._id];
                                    if (!notif)
                                      return (
                                        <span className="text-xs text-gray-300">
                                          —
                                        </span>
                                      );
                                    if (notif.status === "pending")
                                      return (
                                        <div className="flex flex-col gap-1">
                                          <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                            Pending
                                          </span>
                                          <div className="flex gap-1">
                                            <button
                                              onClick={() =>
                                                handleApproveByUserId(user._id)
                                              }
                                              className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full hover:bg-green-600 transition-colors"
                                            >
                                              Approve
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleRejectByUserId(user._id)
                                              }
                                              className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                              Reject
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    if (notif.status === "approved")
                                      return (
                                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                          <CheckCircle size={10} />
                                          Approved
                                        </span>
                                      );
                                    return (
                                      <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                        Rejected
                                      </span>
                                    );
                                  })()}
                                </td>
                                <td className="p-3">
                                  <div
                                    className="flex items-center space-x-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {allNotifsByUser[user._id] && (
                                      <button
                                        onClick={() => {
                                          setSelectedUpdateNotif(
                                            allNotifsByUser[user._id],
                                          );
                                          setSelectedUpdateUser(user);
                                          setShowUpdateModal(true);
                                        }}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Updates"
                                      >
                                        <Eye size={14} />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleEdit(user)}
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                      title="Edit User"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    {/* <button
      onClick={() => handleOpenShiftManagement(user)}
      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      title="Manage Shift"
    >
      <Clock size={14} />
    </button>  */}
                                    <button
                                      onClick={() =>
                                        handleOpenResetPasswordPage(user)
                                      }
                                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                      title="Reset Password"
                                    >
                                      <Lock size={14} />
                                    </button>
                                    {/* DELETE BUTTON - সবাই দেখবে */}
                                    <button
                                      onClick={() => handleDelete(user)}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete User"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {filteredUsers.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
                  <div>
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Previous Page"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1.5 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-purple-600 to-[#113F67] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next Page"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-1">
            <div
              id="userForm"
              className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-6"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {isEditMode ? "Edit User" : "Create Employee"}
                    </h2>
                    <p className="text-gray-500 text-xs mt-1">
                      {isEditMode
                        ? "Update user details"
                        : "Add a new user to the system"}
                    </p>
                    {/* {!isEditMode && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                        <Send size={10} />
                        <span>Welcome email will be sent automatically</span>
                      </div>
                    )} */}
                  </div>
                  {isEditMode && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={resetForm}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First"
                        required
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                      />
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last"
                        required
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="user@company.com"
                      required
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                    />
                  </div>

                  {!isEditMode && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-gray-700">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={generateCreateFormPassword}
                          className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          <Zap size={12} />
                          Generate strong password
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          required={!isEditMode}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300 pr-16"
                        />
                        {form.password && (
                          <button
                            type="button"
                            onClick={handleCopyPassword}
                            title="Copy password"
                            className="absolute right-9 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <ClipboardList size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 6 characters
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Role & Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="superAdmin">Super Admin</option>
                      </select>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <div className="space-y-2">
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                      />
                      {/* পুরানো workType এর জায়গায় */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Work Location
                          </label>
                          <select
                            name="workLocationType"
                            value={form.workLocationType || "onsite"}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                          >
                            <option value="onsite">Onsite</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Work Arrangement
                          </label>
                          <select
                            name="workArrangement"
                            value={form.workArrangement || "full-time"}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                          >
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contractual">Contractual</option>
                            <option value="freelance">Freelance</option>
                            <option value="internship">Internship</option>
                            <option value="temporary">Temporary</option>
                          </select>
                        </div>
                      </div>
                      <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                      >
                        <option value="IT">IT Department</option>
                        <option value="HR">Human Resources</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                      </select>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <input
                            name="employeeId"
                            value={form.employeeId}
                            onChange={handleChange}
                            placeholder="Custom ID (Optional)"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Leave empty for auto-generated ID
                          </p>
                        </div>
                        <input
                          name="designation"
                          value={form.designation}
                          onChange={handleChange}
                          placeholder="Designation"
                          className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                        />
                      </div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Salary (৳)
                      </label>
                      <input
                        name="salary"
                        type="number"
                        value={form.salary}
                        onChange={handleChange}
                        placeholder="Monthly Salary (৳)"
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                      />
                    </div>
                  </div>

                  {/* Contract Type for Employee & Moderator */}
                  {/* {(form.role === 'employee' || form.role === 'moderator') && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Contract Type
                      </label>
                         <select
                        name="workType"
                        value={form.workType || "full-time"}  // default value
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-colors hover:border-purple-300"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contractual">Contractual</option>
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                        <option value="temporary">Temporary</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                  )} */}
                </div>

                {/* Advanced Settings Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium py-1"
                >
                  {showAdvanced
                    ? "Hide Advanced Settings"
                    : "Show Advanced Settings"}
                  <ChevronDown
                    size={12}
                    className={showAdvanced ? "transform rotate-180" : ""}
                  />
                </button>

                {/* Advanced Settings Section */}
                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Advanced Settings
                      </h3>
                      <span className="text-xs text-gray-500 capitalize">
                        {form.role} Options
                      </span>
                    </div>

                    {/* Bank Details - for Employee & Moderator */}
                    {(form.role === "employee" ||
                      form.role === "moderator") && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-medium text-gray-700">
                            Bank Details
                          </label>
                          <span className="text-xs text-gray-500">
                            Optional
                          </span>
                        </div>
                        <input
                          name="bankDetails.bankName"
                          value={advancedForm.bankDetails.bankName}
                          onChange={handleAdvancedChange}
                          placeholder="Bank Name"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                        />
                        <input
                          name="bankDetails.accountNumber"
                          value={advancedForm.bankDetails.accountNumber}
                          onChange={handleAdvancedChange}
                          placeholder="Account Number"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                        />
                        <input
                          name="bankDetails.accountHolderName"
                          value={advancedForm.bankDetails.accountHolderName}
                          onChange={handleAdvancedChange}
                          placeholder="Account Holder Name"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                        />
                      </div>
                    )}

                    {/* Manager ID - for Employee */}
                    {/* {form.role === 'employee' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Manager ID (Optional)
                        </label>
                        <input
                          name="managerId"
                          value={advancedForm.managerId}
                          onChange={handleAdvancedChange}
                          placeholder="Enter manager's employee ID"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                        />
                      </div>
                    )} */}

                    {/* Admin specific fields */}
                    {(form.role === "admin" || form.role === "superAdmin") && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Company Name
                          </label>
                          <input
                            name="companyName"
                            value={advancedForm.companyName}
                            onChange={handleAdvancedChange}
                            placeholder="Company Name"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Admin Position
                          </label>
                          <input
                            name="adminPosition"
                            value={advancedForm.adminPosition}
                            onChange={handleAdvancedChange}
                            placeholder="e.g., HR Administrator"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="canManageUsers"
                              checked={advancedForm.canManageUsers}
                              onChange={handleAdvancedChange}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="ml-2 text-xs text-gray-700">
                              Can Manage Users
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="canManagePayroll"
                              checked={advancedForm.canManagePayroll}
                              onChange={handleAdvancedChange}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="ml-2 text-xs text-gray-700">
                              Can Manage Payroll
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Moderator specific fields */}
                    {form.role === "moderator" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Moderator Level
                          </label>
                          <select
                            name="moderatorLevel"
                            value={advancedForm.moderatorLevel}
                            onChange={handleAdvancedChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                          >
                            <option value="trainee">Trainee</option>
                            <option value="junior">Junior</option>
                            <option value="senior">Senior</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="canModerateUsers"
                              checked={advancedForm.canModerateUsers}
                              onChange={handleAdvancedChange}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="ml-2 text-xs text-gray-700">
                              Can Moderate Users
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="canModerateContent"
                              checked={advancedForm.canModerateContent}
                              onChange={handleAdvancedChange}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="ml-2 text-xs text-gray-700">
                              Can Moderate Content
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Shift Information for New Users */}
                {!isEditMode && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-blue-500" />
                        <span className="text-xs font-medium text-gray-700">
                          Default Shift Timing
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {defaultShiftTime.start} - {defaultShiftTime.end}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      New employees will be assigned the default company shift.
                      You can customize it later.
                    </p>
                  </div>
                )}

                {/* Reset Password Button */}
                {isEditMode && (
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenResetPasswordPage({
                          email: form.email,
                          firstName: form.firstName,
                          lastName: form.lastName,
                        })
                      }
                      className="group w-full inline-flex items-center justify-center gap-2 text-xs text-purple-600 hover:text-purple-700 font-medium py-2 px-3 border border-purple-100 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-300"
                    >
                      <Lock
                        size={12}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="truncate">Admin: Reset Password</span>
                      {adminEmail && (
                        <span className="text-[10px] text-purple-400 group-hover:text-purple-500 ml-auto">
                          {adminEmail.split("@")[0]}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formLoading || sendingEmail}
                  className="w-full bg-gradient-to-r from-purple-600 to-[#113F67] text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
                >
                  {formLoading || sendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {sendingEmail
                        ? "Sending Email..."
                        : isEditMode
                          ? "Updating..."
                          : "Creating..."}
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <>
                          <CheckCircle size={16} />
                          Update User
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          Create Employee
                        </>
                      )}
                    </>
                  )}
                </button>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full border border-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 text-sm"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {resetPasswordModal}
    </>
  );
}
