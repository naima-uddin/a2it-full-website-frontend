"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Calendar,
  Activity,
  Edit,
  Save,
  X,
  Clock,
  MapPin,
  Building,
  Briefcase,
  CreditCard,
  Eye,
  EyeOff,
  History,
  Users,
  CheckCircle,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  DollarSign,
  Hash,
  BadgeCheck,
  ChevronRight,
  Key,
  Upload,
  Camera,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Search,
  ExternalLink,
  MoreVertical,
  Bell,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("personal");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination for sessions
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(10);

  // Payroll history
  const [payrolls, setPayrolls] = useState([]);
  const [payrollLoading, setPayrollLoading] = useState(false);

  // Own profile update notification status
  const [ownNotification, setOwnNotification] = useState(null);

  const fileInputRef = useRef(null);
  const router = useRouter();

  // Helper to get user type from role
  const getUserTypeFromRole = (role) => {
    switch (role) {
      case "admin":
      case "superAdmin":
        return "admin";
      case "employee":
        return "employee";
      case "moderator":
        return "moderator";
      default:
        return "user";
    }
  };

  // Improved getUserType function
  const getUserType = () => {
    if (localStorage.getItem("adminToken")) return "admin";
    if (localStorage.getItem("employeeToken")) return "employee";
    if (localStorage.getItem("moderatorToken")) return "moderator";
    return null;
  };

  // Get current token based on user type
  const getCurrentToken = () => {
    const userType = getUserType();
    switch (userType) {
      case "admin":
        return localStorage.getItem("adminToken");
      case "employee":
        return localStorage.getItem("employeeToken");
      case "moderator":
        return localStorage.getItem("moderatorToken");
      default:
        return null;
    }
  };

  // New Model এর জন্য updated profile form
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    department: "",
    designation: "",
    employeeId: "",
    salaryType: "",
    rate: "",
    basicSalary: "",
    joiningDate: "",
    picture: "",

    // Admin-specific fields
    companyName: "",
    adminPosition: "",
    adminLevel: "",
    permissions: [],
    isSuperAdmin: false,
    canManageUsers: false,
    canManagePayroll: false,

    // Moderator-specific fields
    moderatorLevel: "",
    moderatorScope: [],
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
      canWarnUsers: true,
    },

    // Employee-specific fields
    managerId: "",
    attendanceId: "",
    shiftTiming: { start: "09:00", end: "18:00" },

    // Work type fields
    workLocationType: "onsite",
    workArrangement: "full-time",
    contractType: "",

    // Bank details
    bankDetails: {
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      branchName: "",
      routingNumber: "",
      accountType: "savings",
      swiftCode: "",
      isVerified: false,
      verifiedAt: null,
      updatedAt: null,
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile - Unified for all roles
  const fetchUserProfile = async () => {
    try {
      const token = getCurrentToken();

      if (!token) {
        router.push("/hrm");
        return;
      }

      // Unified endpoint for all users
      const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/users/getProfile`;

      console.log("Fetching profile from:", endpoint);

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        // Clear all tokens and redirect
        localStorage.removeItem("adminToken");
        localStorage.removeItem("employeeToken");
        localStorage.removeItem("moderatorToken");
        router.push("/hrm");
        return;
      }

      const data = await response.json();

      if (data.user || (data && typeof data === "object" && data._id)) {
        const userData = data.user || data;

        // Get user type based on role
        const currentUserType = getUserTypeFromRole(userData.role);
        const localUserKey = `${currentUserType}UserData`;
        const localData = JSON.parse(
          localStorage.getItem(localUserKey) || "{}",
        );

        // Picture persistence
        const pictureToUse = userData.picture || localData.picture || null;

        const userObj = {
          ...userData,
          picture: pictureToUse,
        };

        setUser(userObj);

        // Unified profile form for all roles
        const formData = {
          // Basic info
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          address: userData.address || "",
          department: userData.department || "",
          designation: userData.designation || "",
          employeeId: userData.employeeId || "",
          salaryType: userData.salaryType || "",
          rate: userData.rate || "",
          basicSalary: userData.basicSalary || userData.salary || "",
          joiningDate: userData.joiningDate || "",
          picture: userData.picture || "",

          // Admin-specific fields
          companyName: userData.companyName || "",
          adminPosition: userData.adminPosition || userData.position || "",
          adminLevel: userData.adminLevel || "",
          permissions: userData.permissions || [],
          isSuperAdmin: userData.isSuperAdmin || false,
          canManageUsers: userData.canManageUsers || false,
          canManagePayroll: userData.canManagePayroll || false,

          // Moderator-specific fields
          moderatorLevel: userData.moderatorLevel || "",
          moderatorScope: userData.moderatorScope || [],
          canModerateUsers: userData.canModerateUsers || false,
          canModerateContent:
            userData.canModerateContent !== undefined
              ? userData.canModerateContent
              : true,
          canViewReports:
            userData.canViewReports !== undefined
              ? userData.canViewReports
              : true,
          canManageReports: userData.canManageReports || false,
          moderationLimits: userData.moderationLimits || {
            dailyActions: 50,
            warningLimit: 3,
            canBanUsers: false,
            canDeleteContent: true,
            canEditContent: true,
            canWarnUsers: true,
          },

          // Employee-specific fields
          managerId: userData.managerId || "",
          attendanceId: userData.attendanceId || "",
          // Support both old flat {start,end} and new nested {defaultShift:{start,end}} format
          shiftTiming: {
            start:
              userData.shiftTiming?.defaultShift?.start ||
              userData.shiftTiming?.start ||
              "09:00",
            end:
              userData.shiftTiming?.defaultShift?.end ||
              userData.shiftTiming?.end ||
              "18:00",
          },

          // Work type fields
          workLocationType: userData.workLocationType || "onsite",
          workArrangement: userData.workArrangement || "full-time",
          contractType: userData.contractType || "",

          // Bank details
          bankDetails: userData.bankDetails || {
            bankName: "",
            accountNumber: "",
            accountHolderName: "",
            branchName: "",
            routingNumber: "",
            accountType: "savings",
            swiftCode: "",
            isVerified: false,
            verifiedAt: null,
            updatedAt: null,
          },
        };

        setProfileForm(formData);

        console.log("User data loaded:", {
          role: userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          hasPicture: !!pictureToUse,
        });
      } else {
        console.error("Invalid response data:", data);
        toast.error("Failed to load user data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user sessions
  // const fetchUserSessions = async () => {
  //   try {
  //     const token = getCurrentToken();

  //     const response = await fetch(`${process.env.NEXT_PUBLIC_HRM_API_URL}/my-sessions`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSessions(data.data || []);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch sessions:", error);
  //   }
  // };

  const fetchMyPayrolls = async () => {
    setPayrollLoading(true);
    try {
      const token = getCurrentToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HRM_API_URL}/my-payrolls`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data?.payrolls)
          ? data.payrolls
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];
        // Sort newest first
        list.sort((a, b) =>
          b.year !== a.year ? b.year - a.year : b.month - a.month,
        );
        setPayrolls(list);
      }
    } catch {
    } finally {
      setPayrollLoading(false);
    }
  };

  const loadOwnNotification = async () => {
    try {
      const token = getCurrentToken();
      if (!token) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HRM_API_URL}/my-notification`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) return;
      const data = await res.json();
      setOwnNotification(data.notification || null);
    } catch {}
  };

  useEffect(() => {
    fetchUserProfile();
    loadOwnNotification();
    fetchMyPayrolls();
    // Refresh own notification status every 30s
    const poll = setInterval(loadOwnNotification, 30000);
    return () => clearInterval(poll);
  }, []);

  // Handle file selection with improved preview
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target.result;

      // Create blurred preview
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        // Create a canvas for blur effect
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply blur effect
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const blurredUrl = canvas.toDataURL("image/jpeg", 0.7);

        // Update state with blurred preview
        setUser((prev) => ({
          ...prev,
          picture: previewUrl,
          previewPicture: previewUrl, // Store original for upload
        }));

        setProfileForm((prev) => ({
          ...prev,
          picture: previewUrl,
        }));

        // Save to localStorage for persistence
        const userType = getUserType();
        const localUserKey = `${userType}UserData`;
        const existingData = JSON.parse(
          localStorage.getItem(localUserKey) || "{}",
        );
        localStorage.setItem(
          localUserKey,
          JSON.stringify({
            ...existingData,
            picture: previewUrl,
            previewPicture: previewUrl,
            isPreview: true,
          }),
        );

        toast.success('Preview updated! Click "Upload Photo" to save.');
      };
    };

    reader.onerror = () => {
      toast.error("Failed to load image preview");
    };

    reader.readAsDataURL(file);
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const token = getCurrentToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      setUploadProgress(30);

      const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/upload-profile-picture`;

      console.log("Uploading to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setUploadProgress(70);

      if (!response.ok) {
        let errorMessage = "Upload failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("Server error response:", errorData);
        } catch (e) {
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      setUploadProgress(100);

      if (data.success) {
        // Immediately update state with new picture
        const pictureUrl = data.pictureUrl;

        // Apply blur effect to uploaded image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = pictureUrl + "?t=" + new Date().getTime(); // Cache busting

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const blurredUrl = canvas.toDataURL("image/jpeg", 0.7);

          setUser((prev) => ({
            ...prev,
            picture: pictureUrl,
            serverPicture: pictureUrl,
          }));

          setProfileForm((prev) => ({
            ...prev,
            picture: pictureUrl,
          }));

          // Save to localStorage as backup
          const userType = getUserType();
          const localUserKey = `${userType}UserData`;
          const existingData = JSON.parse(
            localStorage.getItem(localUserKey) || "{}",
          );
          localStorage.setItem(
            localUserKey,
            JSON.stringify({
              ...existingData,
              picture: pictureUrl,
              serverPicture: pictureUrl,
              lastUpdated: new Date().toISOString(),
              isPreview: false,
            }),
          );
        };

        toast.success(data.message || "Profile picture uploaded successfully!");

        // Refresh profile data after upload
        setTimeout(() => {
          fetchUserProfile();
        }, 500);
      } else {
        toast.error(data.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Upload error:", error);

      // Fallback: Save to localStorage temporarily
      const reader = new FileReader();
      reader.onload = (e) => {
        const localUrl = e.target.result;

        // Create blurred version
        const img = new Image();
        img.src = localUrl;
        img.onload = () => {
          const localUrl = e.target.result;

          setUser((prev) => ({
            ...prev,
            picture: localUrl,
          }));

          setProfileForm((prev) => ({
            ...prev,
            picture: localUrl,
          }));

          // Save to localStorage
          const userType = getUserType();
          const localUserKey = `${userType}UserData`;
          const existingData = JSON.parse(
            localStorage.getItem(localUserKey) || "{}",
          );
          localStorage.setItem(
            localUserKey,
            JSON.stringify({
              ...existingData,
              picture: localUrl,
              previewPicture: localUrl,
              isLocal: true,
              lastUpdated: new Date().toISOString(),
              isPreview: false,
            }),
          );

          toast.success("Profile picture saved locally (server unavailable)");
        };
      };
      reader.readAsDataURL(selectedFile);

      toast.error(
        error.message || "Failed to upload profile picture to server",
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setShowUploadConfirm(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Delete profile picture
  const handleDeleteProfilePicture = async () => {
    if (!user?.picture) {
      toast.error("No profile picture to remove");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to remove your profile picture? This will delete it from Cloudinary.",
      )
    )
      return;

    try {
      const token = getCurrentToken();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/remove-profile-picture`;

      console.log("Deleting profile picture from:", endpoint);

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.status === 400) {
        const errorData = await response.json();
        toast.error(errorData.message || "No profile picture exists");
        return;
      }

      if (!response.ok) {
        let errorMessage = "Delete failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("Server error response:", errorData);
        } catch (e) {
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Delete response data:", data);

      if (data.success) {
        // Update local user state
        setUser((prev) => ({
          ...prev,
          picture: null,
          previewPicture: null,
          serverPicture: null,
        }));

        setProfileForm((prev) => ({
          ...prev,
          picture: "",
        }));

        // Also remove from localStorage
        const userType = getUserType();
        const localUserKey = `${userType}UserData`;
        const existingData = JSON.parse(
          localStorage.getItem(localUserKey) || "{}",
        );
        const {
          picture,
          previewPicture,
          serverPicture,
          isLocal,
          isPreview,
          ...restData
        } = existingData;
        localStorage.setItem(localUserKey, JSON.stringify(restData));

        toast.success("Profile picture removed successfully!");

        // Refresh profile data
        setTimeout(() => {
          fetchUserProfile();
        }, 300);
      } else {
        toast.error(data.message || "Failed to remove profile picture");
      }
    } catch (error) {
      console.error("Delete error:", error);

      if (
        error.message.includes("No profile picture") ||
        error.message.includes("404")
      ) {
        toast.error("No profile picture exists to remove");

        // Still update UI to remove any local references
        setUser((prev) => ({
          ...prev,
          picture: null,
          previewPicture: null,
          serverPicture: null,
        }));

        setProfileForm((prev) => ({
          ...prev,
          picture: "",
        }));

        // Remove from localStorage
        const userType = getUserType();
        const localUserKey = `${userType}UserData`;
        const existingData = JSON.parse(
          localStorage.getItem(localUserKey) || "{}",
        );
        const {
          picture,
          previewPicture,
          serverPicture,
          isLocal,
          isPreview,
          ...restData
        } = existingData;
        localStorage.setItem(localUserKey, JSON.stringify(restData));
      } else {
        toast.error(error.message || "Failed to remove profile picture");
      }
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Cancel file selection
  const cancelFileSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Restore previous picture
    const userType = getUserType();
    const localUserKey = `${userType}UserData`;
    const localData = JSON.parse(localStorage.getItem(localUserKey) || "{}");

    // Better picture restoration logic
    if (localData.serverPicture) {
      // Restore from server picture
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = localData.serverPicture + "?t=" + new Date().getTime();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const blurredUrl = canvas.toDataURL("image/jpeg", 0.7);

        setUser((prev) => ({
          ...prev,
          picture: blurredUrl,
          serverPicture: localData.serverPicture,
        }));

        setProfileForm((prev) => ({
          ...prev,
          picture: localData.serverPicture,
        }));
      };
    } else if (localData.picture && !localData.isPreview) {
      // Restore local picture with blur
      setUser((prev) => ({
        ...prev,
        picture: localData.picture,
      }));

      setProfileForm((prev) => ({
        ...prev,
        picture: localData.previewPicture || localData.picture,
      }));
    } else if (user?.serverPicture) {
      // Keep server picture if exists
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = user.serverPicture + "?t=" + new Date().getTime();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = "blur(10px) brightness(0.9)";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const blurredUrl = canvas.toDataURL("image/jpeg", 0.7);

        setUser((prev) => ({
          ...prev,
          picture: blurredUrl,
        }));
      };
    } else {
      setUser((prev) => ({
        ...prev,
        picture: null,
      }));

      setProfileForm((prev) => ({
        ...prev,
        picture: "",
      }));
    }
  };

  // Fixed Profile Update Function with success message fix
  const handleUpdateProfile = async () => {
    // Prevent multiple clicks
    if (updating) return;

    setUpdating(true);

    console.log("=== PROFILE UPDATE START ===");
    console.log("User Role:", user?.role);
    console.log("Profile Form Data to Update:", profileForm);

    try {
      const token = getCurrentToken();

      if (!token) {
        toast.error("No authentication token found. Please login again.");
        localStorage.clear();
        router.push("/hrm");
        return;
      }

      // Use correct endpoint based on user role
      let endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/users/updateProfile`;

      console.log("API Endpoint:", endpoint);
      console.log("Token exists:", !!token);

      // Basic validation
      if (!profileForm.firstName?.trim()) {
        toast.error("First name is required");
        setUpdating(false);
        return;
      }

      if (!profileForm.lastName?.trim()) {
        toast.error("Last name is required");
        setUpdating(false);
        return;
      }

      // Prepare update data
      const updateData = {
        // Personal Information
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone?.trim() || "",
        address: profileForm.address?.trim() || "",

        // Professional Information
        department: profileForm.department?.trim() || "",
        designation: profileForm.designation?.trim() || "",
        employeeId: profileForm.employeeId?.trim() || "",
        joiningDate: profileForm.joiningDate || "",

        // Work Information
        workLocationType: profileForm.workLocationType || "onsite",
        workArrangement: profileForm.workArrangement || "full-time",
        contractType: profileForm.contractType || "",

        // Salary Information — always send a valid enum value for salaryType
        salaryType: profileForm.salaryType || "monthly",
        basicSalary: profileForm.basicSalary
          ? parseFloat(profileForm.basicSalary)
          : undefined,
        salary: profileForm.basicSalary
          ? parseFloat(profileForm.basicSalary)
          : undefined,

        // Profile Picture
        picture: profileForm.picture || "",

        // Status
        status: user?.status || "active",
        isActive: user?.isActive !== undefined ? user.isActive : true,
      };

      // Add role-specific fields based on user's role
      if (user?.role === "admin" || user?.role === "superAdmin") {
        updateData.companyName = profileForm.companyName?.trim() || "";
        updateData.adminPosition = profileForm.adminPosition?.trim() || "";
        updateData.adminLevel = profileForm.adminLevel || "";
        updateData.permissions = profileForm.permissions || [];
        updateData.isSuperAdmin = profileForm.isSuperAdmin || false;
        updateData.canManageUsers =
          profileForm.canManageUsers !== undefined
            ? profileForm.canManageUsers
            : false;
        updateData.canManagePayroll =
          profileForm.canManagePayroll !== undefined
            ? profileForm.canManagePayroll
            : false;
      }

      if (user?.role === "moderator") {
        updateData.moderatorLevel = profileForm.moderatorLevel || "";
        updateData.moderatorScope = profileForm.moderatorScope || [];
        updateData.canModerateUsers =
          profileForm.canModerateUsers !== undefined
            ? profileForm.canModerateUsers
            : false;
        updateData.canModerateContent =
          profileForm.canModerateContent !== undefined
            ? profileForm.canModerateContent
            : true;
        updateData.canViewReports =
          profileForm.canViewReports !== undefined
            ? profileForm.canViewReports
            : true;
        updateData.canManageReports =
          profileForm.canManageReports !== undefined
            ? profileForm.canManageReports
            : false;
        updateData.moderationLimits = profileForm.moderationLimits || {
          dailyActions: 50,
          warningLimit: 3,
          canBanUsers: false,
          canDeleteContent: true,
          canEditContent: true,
          canWarnUsers: true,
        };
        updateData.permissions = profileForm.permissions || [];
      }

      if (user?.role === "employee" || user?.role === "moderator") {
        // Always send these even if empty so they can be cleared
        updateData.managerId = profileForm.managerId?.trim() || "";
        updateData.attendanceId = profileForm.attendanceId?.trim() || "";
        // Send in the correct nested structure the schema expects
        updateData.shiftTiming = {
          defaultShift: {
            start: profileForm.shiftTiming?.start || "09:00",
            end: profileForm.shiftTiming?.end || "18:00",
          },
        };
      }

      // Bank Details — always send for non-admin users so accountType is persisted
      if (user?.role !== "admin" && user?.role !== "superAdmin") {
        updateData.bankDetails = {
          bankName: profileForm.bankDetails?.bankName?.trim() || "",
          accountNumber:
            profileForm.bankDetails?.accountNumber?.toString() || "",
          accountHolderName:
            profileForm.bankDetails?.accountHolderName?.trim() || "",
          branchName: profileForm.bankDetails?.branchName?.trim() || "",
          routingNumber:
            profileForm.bankDetails?.routingNumber?.toString() || "",
          accountType: profileForm.bankDetails?.accountType || "savings",
          swiftCode: profileForm.bankDetails?.swiftCode?.trim() || "",
        };
      }

      // Clean up undefined/null/empty string values
      const cleanUpdateData = Object.keys(updateData).reduce((acc, key) => {
        const value = updateData[key];

        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "object" && !Array.isArray(value)) {
            const hasProperties = Object.keys(value).some(
              (k) =>
                value[k] !== undefined && value[k] !== null && value[k] !== "",
            );
            if (hasProperties) {
              acc[key] = value;
            }
          } else if (Array.isArray(value)) {
            acc[key] = value;
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {});

      console.log("📤 Sending Update Data:", cleanUpdateData);

      // Send request to server
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanUpdateData),
      });

      console.log("📥 Response Status:", response.status);

      const result = await response.json();
      console.log("📥 Response Data:", result);

      if (response.ok) {
        toast.success("Profile updated successfully!");

        // Backend creates the notification in DB — reload own status after a short delay
        if (user?.role !== "admin" && user?.role !== "superAdmin") {
          setTimeout(() => loadOwnNotification(), 1500);
        }

        // Update local user state with new data
        if (result.user) {
          const updatedUser = {
            ...user,
            ...result.user,
            picture: result.user.picture || user.picture,
          };
          setUser(updatedUser);
        }

        setEditMode(false);

        setTimeout(() => {
          fetchUserProfile();
        }, 1000);
      } else {
        // Handle specific error cases
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.clear();
          router.push("/hrm");
        } else if (response.status === 400) {
          if (result.message && result.message.includes("Validation failed")) {
            const validationError =
              result.message.split(": ")[1] || result.message;
            toast.error(`Validation Error: ${validationError}`);
          } else {
            toast.error(
              result.message || "Invalid data. Please check your inputs.",
            );
          }
        } else if (response.status === 403) {
          toast.error("You don't have permission to update this profile.");
        } else {
          toast.error(
            result.message || `Update failed (Status: ${response.status})`,
          );
        }
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error(
          "Network error. Please check your connection and try again.",
        );
      } else if (error.name === "SyntaxError") {
        toast.error("Server response error. Please try again.");
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    } finally {
      setUpdating(false);
      console.log("=== PROFILE UPDATE END ===");
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const token = getCurrentToken();

      const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/users/change-password`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          toast.success("Password changed successfully!");
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          toast.error(data.message || "Failed to change password");
        }
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  // Logout from all sessions
  const handleLogoutAllSessions = async () => {
    if (!confirm("Are you sure you want to logout from all devices?")) return;

    try {
      const token = getCurrentToken();

      const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/logout-all`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("Logged out from all devices");
          fetchUserSessions();
        } else {
          toast.error(data.message || "Failed to logout");
        }
      } else {
        toast.error("Failed to logout from all sessions");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  // Terminate specific session
  const handleTerminateSession = async (sessionId) => {
    if (!confirm("Terminate this session?")) return;

    try {
      const token = getCurrentToken();

      const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/terminate-session/${sessionId}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("Session terminated");
          fetchUserSessions();
        } else {
          toast.error(data.message || "Failed to terminate session");
        }
      } else {
        toast.error("Failed to terminate session");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  // Admin: Search users
  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    try {
      const token = getCurrentToken();

      const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/users/search?query=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSearchResults(data.users || []);
          setShowSearchResults(true);
        } else {
          toast.error(data.message || "Search failed");
        }
      } else {
        toast.error("Failed to search users");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  // Admin: Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);

    try {
      const token = getCurrentToken();

      const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/users/${userToDelete._id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(`User "${userToDelete.email}" deleted successfully!`);

          setSearchResults((prev) =>
            prev.filter((u) => u._id !== userToDelete._id),
          );

          setShowDeleteModal(false);
          setUserToDelete(null);
        } else {
          toast.error(data.message || "Failed to delete user");
        }
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (userData) => {
    if (userData._id === user?._id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (
      (userData.isSuperAdmin || userData.adminLevel === "super") &&
      !user?.isSuperAdmin &&
      user?.adminLevel !== "super"
    ) {
      toast.error("Cannot delete super admin without super admin privileges");
      return;
    }

    setUserToDelete(userData);
    setShowDeleteModal(true);
  };

  // Format date
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

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    const firstName =
      user.firstName ||
      user.name?.split(" ")[0] ||
      user.email?.split("@")[0] ||
      "U";
    const lastName =
      user.lastName || user.name?.split(" ").slice(1).join(" ") || "";
    return `${firstName.charAt(0)}${lastName.charAt(0) || ""}`.toUpperCase();
  };

  // Check if user has a valid picture
  const hasValidPicture = () => {
    return (
      user?.picture &&
      user.picture !== null &&
      user.picture !== "" &&
      user.picture !== "null" &&
      user.picture !== "undefined"
    );
  };

  // Check user role
  const isAdmin = () => {
    return user?.role === "admin" || user?.role === "superAdmin";
  };

  const isModerator = () => {
    return user?.role === "moderator";
  };

  const isEmployee = () => {
    return user?.role === "employee";
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    if (isAdmin()) return "from-indigo-500 to-purple-500";
    if (isModerator()) return "from-orange-500 to-red-500";
    if (isEmployee()) return "from-blue-500 to-cyan-500";
    return "from-gray-500 to-gray-700";
  };

  // Get role display text
  const getRoleDisplayText = () => {
    if (user?.role === "superAdmin") return "SUPER ADMIN";
    if (isAdmin()) return "ADMINISTRATOR";
    if (isModerator()) return "MODERATOR";
    if (isEmployee()) return "EMPLOYEE";
    return "USER";
  };

  // Get work type display text
  const getWorkTypeDisplay = () => {
    const location =
      profileForm.workLocationType || user?.workLocationType || "onsite";
    const arrangement =
      profileForm.workArrangement || user?.workArrangement || "full-time";
    return `${arrangement} • ${location}`;
  };

  // Pagination calculations for sessions
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(
    indexOfFirstSession,
    indexOfLastSession,
  );
  const totalPages = Math.ceil(sessions.length / sessionsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 p-2 md:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                My Profile
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your personal information and security
              </p>
            </div>
          </div>
        </div>

        {/* Profile Update Status Banner — shown for employees & moderators only */}
        {ownNotification &&
          (user?.role === "employee" || user?.role === "moderator") && (
            <div
              className={`mb-6 rounded-xl border px-4 py-3 flex items-center gap-3 ${
                ownNotification.status === "pending"
                  ? "bg-amber-50 border-amber-200"
                  : ownNotification.status === "approved"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
              }`}
            >
              {ownNotification.status === "pending" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                  <p className="text-sm text-amber-800 font-medium">
                    Your profile update is{" "}
                    <strong>pending admin approval</strong>. Updated on{" "}
                    {new Date(
                      ownNotification.createdAt || ownNotification.timestamp,
                    ).toLocaleString("en-BD", {
                      timeZone: "Asia/Dhaka",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    .
                  </p>
                </>
              )}
              {ownNotification.status === "approved" && (
                <>
                  <CheckCircle size={16} className="text-green-600 shrink-0" />
                  <p className="text-sm text-green-800 font-medium">
                    Your profile update was <strong>approved</strong> by admin
                    on{" "}
                    {new Date(
                      ownNotification.approvedAt || ownNotification.timestamp,
                    ).toLocaleString("en-BD", {
                      timeZone: "Asia/Dhaka",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    .
                  </p>
                </>
              )}
              {ownNotification.status === "rejected" && (
                <>
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <p className="text-sm text-red-800 font-medium">
                    Your profile update was <strong>not approved</strong> by
                    admin.
                  </p>
                </>
              )}
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-6">
              {/* Profile Header */}
              <div className="bg-[#113F67] p-6 relative">
                <div className="flex flex-col items-center relative">
                  {/* Profile Picture Container */}
                  <div className="relative group mb-4">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl overflow-hidden">
                      {hasValidPicture() ? (
                        <img
                          src={user.picture}
                          alt={user.firstName || user.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <span class="text-white text-2xl font-bold">${getUserInitials()}</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-white backdrop-blur-sm rounded-full flex items-center justify-center">
                          <span className="text-[#113F67] text-2xl font-bold">
                            {getUserInitials()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload Overlay - Show only when in edit mode */}
                    {editMode && (
                      <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <button
                          onClick={triggerFileInput}
                          disabled={uploading}
                          className="bg-white/90 p-2.5 rounded-full hover:bg-white transition-all duration-200 hover:scale-110"
                          title="Change photo"
                        >
                          <Camera className="text-gray-700" size={20} />
                        </button>

                        {hasValidPicture() && !selectedFile && (
                          <button
                            onClick={handleDeleteProfilePicture}
                            disabled={uploading}
                            className="absolute top-0 right-0 bg-red-500/90 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110"
                            title="Remove photo"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="absolute inset-0 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-xs font-medium">
                            {uploadProgress}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                  />

                  <h2 className="text-xl font-bold text-white text-center">
                    {user?.firstName ||
                      user?.name?.split(" ")[0] ||
                      user?.email?.split("@")[0]}{" "}
                    {user?.lastName ||
                      user?.name?.split(" ").slice(1).join(" ") ||
                      ""}
                  </h2>
                  <p className="text-purple-100/90 mt-1 text-center">
                    {user?.email}
                  </p>
                  <div className="mt-3">
                    <span
                      className={`px-3 py-1 text-white rounded-full text-sm font-medium bg-gradient-to-r ${getRoleBadgeColor()} backdrop-blur-sm`}
                    >
                      {getRoleDisplayText()}
                    </span>
                  </div>

                  {/* Upload/Cancel Buttons - Show only in edit mode */}
                  {editMode && (
                    <div className="mt-4 flex flex-col gap-2 w-full">
                      <button
                        onClick={triggerFileInput}
                        disabled={uploading}
                        className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2"
                      >
                        <Camera size={14} />
                        {uploading
                          ? "Uploading..."
                          : selectedFile
                            ? "Change Selection"
                            : "Upload Photo"}
                      </button>

                      {selectedFile && (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => setShowUploadConfirm(true)}
                            disabled={uploading}
                            className="flex-1 px-4 py-2 bg-green-600/90 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2"
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="animate-spin" size={14} />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                Save Photo
                              </>
                            )}
                          </button>
                          <button
                            onClick={cancelFileSelection}
                            disabled={uploading}
                            className="flex-1 px-4 py-2 bg-red-600/90 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Stats */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <ShieldCheck className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Account Status
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            user?.status === "active"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {user?.status?.toUpperCase() || "ACTIVE"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Briefcase className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Designation
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.designation || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Building className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Department
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.department || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Work Type Info */}
                  <div className="flex items-center justify-between p-3 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Briefcase className="text-cyan-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Work Type
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getWorkTypeDisplay()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Role-specific additional info */}
                  {isAdmin() && user?.adminLevel && (
                    <div className="flex items-center justify-between p-3 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <ShieldCheck className="text-indigo-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Admin Level
                          </p>
                          <p className="text-sm font-semibold text-indigo-600 capitalize">
                            {user?.adminLevel}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isModerator() && user?.moderatorLevel && (
                    <div className="flex items-center justify-between p-3 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <ShieldCheck className="text-orange-600" size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Moderator Level
                          </p>
                          <p className="text-sm font-semibold text-orange-600 capitalize">
                            {user?.moderatorLevel}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 space-y-3">
                  {isAdmin() && (
                    <button
                      onClick={() => router.push("/hrm/user-roles")}
                      className="w-full flex items-center justify-between p-3 bg-gray-50/50 hover:bg-gray-100/50 backdrop-blur-sm rounded-xl transition-all duration-200 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="text-gray-600" size={20} />
                        <span className="font-medium text-gray-700">
                          Manage Users
                        </span>
                      </div>
                      <ChevronRight className="text-gray-400" size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 min-w-0 ${
                    activeTab === "personal"
                      ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}
                >
                  Personal Info
                </button>
                {/* Hide Bank Info tab for Admin */}
                {!isAdmin() && (
                  <button
                    onClick={() => setActiveTab("bank")}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 min-w-0 ${
                      activeTab === "bank"
                        ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                    }`}
                  >
                    Bank Info
                  </button>
                )}
                {isEmployee() && (
                  <button
                    onClick={() => setActiveTab("payroll")}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 min-w-0 ${
                      activeTab === "payroll"
                        ? "text-[#113F67] border-b-2 border-[#113F67] bg-blue-50/50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                    }`}
                  >
                    Payroll History
                  </button>
                )}
                {/* <button
                  onClick={() => setActiveTab("sessions")}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 min-w-0 ${
                    activeTab === "sessions"
                      ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}
                >
                  Sessions
                </button> */}
              </div>

              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Personal Information
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Update your personal details
                      </p>
                    </div>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2.5 bg-[#113F67] text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditMode(false);
                            fetchUserProfile();
                          }}
                          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          disabled={updating}
                          className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updating ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* View Mode */}
                  {!editMode ? (
                    <div className="space-y-6">
                      {/* Profile Picture View Card */}
                      {/* <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                              <ImageIcon className="text-purple-600" size={22} />
                            </div>
                            Profile Picture
                          </h4>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="relative mb-4">
                            <div className="w-32 h-32 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50 shadow-lg overflow-hidden">
                              {hasValidPicture() ? (
                                <img
                                  src={user.picture}
                                  alt={user.firstName || user.name}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                      <div class="w-full h-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <span class="text-white text-4xl font-bold">${getUserInitials()}</span>
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <span className="text-white text-4xl font-bold">
                                    {getUserInitials()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-gray-700">
                              {hasValidPicture() ? 
                                "Your profile picture is visible to other users" : 
                                "No profile picture uploaded yet"
                              }
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Click "Edit Profile" to upload or change your profile picture
                            </p>
                          </div>
                        </div>
                      </div> */}

                      {/* Basic Info Card */}
                      <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                              <User className="text-purple-600" size={22} />
                            </div>
                            Basic Information
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Full Name
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {user?.firstName ||
                                  user?.name?.split(" ")[0] ||
                                  user?.email?.split("@")[0]}
                                {user?.lastName && ` ${user.lastName}`}
                                {!user?.lastName &&
                                  user?.name?.split(" ").slice(1).join(" ") &&
                                  ` ${user.name.split(" ").slice(1).join(" ")}`}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Email Address
                              </p>
                              <div className="flex items-center gap-2">
                                <Mail className="text-gray-400" size={16} />
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.email}
                                </p>
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                  Verified
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Phone Number
                              </p>
                              <div className="flex items-center gap-2">
                                <Phone className="text-gray-400" size={16} />
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.phone || "Not provided"}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Address
                              </p>
                              <div className="flex items-center gap-2">
                                <MapPin className="text-gray-400" size={16} />
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.address || "Not provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Work Information Card */}
                      <div className="bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-100 shadow-sm">
                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                            <Briefcase className="text-cyan-600" size={22} />
                          </div>
                          Work Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Work Type
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {getWorkTypeDisplay()}
                            </p>
                          </div>

                          {user?.contractType && (
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Contract Type
                              </p>
                              <p className="text-lg font-semibold text-gray-900 capitalize">
                                {user.contractType}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Admin Information Card */}
                      {isAdmin() && (
                        <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 shadow-sm">
                          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                              <Shield className="text-indigo-600" size={22} />
                            </div>
                            Administrator Information
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Company
                                </p>
                                <div className="flex items-center gap-2">
                                  <Building
                                    className="text-gray-400"
                                    size={16}
                                  />
                                  <p className="text-lg font-semibold text-gray-900">
                                    {user?.companyName || "Not specified"}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Admin Position
                                </p>
                                <div className="flex items-center gap-2">
                                  <BadgeCheck
                                    className="text-gray-400"
                                    size={16}
                                  />
                                  <p className="text-lg font-semibold text-gray-900">
                                    {user?.adminPosition ||
                                      user?.position ||
                                      "Administrator"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Admin Level
                                </p>
                                <div
                                  className={`flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-sm ${
                                    user?.adminLevel === "super"
                                      ? "bg-purple-100/80 text-purple-800"
                                      : user?.adminLevel === "admin"
                                        ? "bg-blue-100/80 text-blue-800"
                                        : user?.adminLevel === "manager"
                                          ? "bg-green-100/80 text-green-800"
                                          : "bg-gray-100/80 text-gray-800"
                                  }`}
                                >
                                  <ShieldCheck
                                    className={
                                      user?.adminLevel === "super"
                                        ? "text-purple-600"
                                        : user?.adminLevel === "admin"
                                          ? "text-blue-600"
                                          : user?.adminLevel === "manager"
                                            ? "text-green-600"
                                            : "text-gray-600"
                                    }
                                    size={18}
                                  />
                                  <p className="font-semibold capitalize">
                                    {user?.adminLevel || "Admin"}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Permissions
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {user?.permissions?.map((perm, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-indigo-100/80 backdrop-blur-sm text-indigo-800 text-xs rounded-full font-medium"
                                    >
                                      {perm}
                                    </span>
                                  )) || (
                                    <span className="text-gray-500">
                                      No specific permissions
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Moderator Information Card */}
                      {isModerator() && (
                        <div className="bg-gradient-to-r from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 shadow-sm">
                          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                              <ShieldCheck
                                className="text-orange-600"
                                size={22}
                              />
                            </div>
                            Moderator Information
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Moderator Level
                                </p>
                                <div
                                  className={`flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-sm ${
                                    user?.moderatorLevel === "senior"
                                      ? "bg-red-100/80 text-red-800"
                                      : user?.moderatorLevel === "junior"
                                        ? "bg-orange-100/80 text-orange-800"
                                        : "bg-yellow-100/80 text-yellow-800"
                                  }`}
                                >
                                  <ShieldCheck
                                    className={
                                      user?.moderatorLevel === "senior"
                                        ? "text-red-600"
                                        : user?.moderatorLevel === "junior"
                                          ? "text-orange-600"
                                          : "text-yellow-600"
                                    }
                                    size={18}
                                  />
                                  <p className="font-semibold capitalize">
                                    {user?.moderatorLevel || "Moderator"}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Moderation Scope
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {user?.moderatorScope?.map((scope, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-orange-100/80 backdrop-blur-sm text-orange-800 text-xs rounded-full font-medium"
                                    >
                                      {scope}
                                    </span>
                                  )) || (
                                    <span className="text-gray-500">
                                      No specific scope
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Permissions
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {user?.permissions?.map((perm, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-indigo-100/80 backdrop-blur-sm text-indigo-800 text-xs rounded-full font-medium"
                                    >
                                      {perm}
                                    </span>
                                  )) || (
                                    <span className="text-gray-500">
                                      No specific permissions
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Moderation Limits
                                </p>
                                <div className="text-sm text-gray-700">
                                  <p>
                                    Daily Actions:{" "}
                                    {user?.moderationLimits?.dailyActions || 50}
                                  </p>
                                  <p>
                                    Warning Limit:{" "}
                                    {user?.moderationLimits?.warningLimit || 3}
                                  </p>
                                  <p>
                                    Can Ban Users:{" "}
                                    {user?.moderationLimits?.canBanUsers
                                      ? "Yes"
                                      : "No"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Professional Info Card */}
                      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                            <Briefcase className="text-blue-600" size={22} />
                          </div>
                          Professional Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Department
                              </p>
                              <div className="flex items-center gap-2">
                                <Building className="text-gray-400" size={16} />
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.department || "Not assigned"}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Designation
                              </p>
                              <div className="flex items-center gap-2">
                                <Briefcase
                                  className="text-gray-400"
                                  size={16}
                                />
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.designation || "Not assigned"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Employee ID
                              </p>
                              <div className="flex items-center gap-2">
                                <Hash className="text-gray-400" size={16} />
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.employeeId || "Not assigned"}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Joining Date
                              </p>
                              <div className="flex items-center gap-2">
                                <Calendar className="text-gray-400" size={16} />
                                <p className="text-lg font-semibold text-gray-900">
                                  {formatDate(user?.joiningDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Salary Info Card */}
                      {(isEmployee() || isModerator()) &&
                        (user?.basicSalary || user?.salary) && (
                          <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-sm">
                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                                <CreditCard
                                  className="text-green-600"
                                  size={22}
                                />
                              </div>
                              Salary Information
                            </h4>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Basic Salary
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                ৳
                                {formatCurrency(
                                  user?.basicSalary || user?.salary,
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                      {/* Bank Details Card - Only for non-admin users */}
                      {!isAdmin() &&
                        (isEmployee() || isModerator()) &&
                        user?.bankDetails?.bankName && (
                          <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm">
                            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                                <CreditCard
                                  className="text-emerald-600"
                                  size={22}
                                />
                              </div>
                              Bank Details
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">
                                    Bank Name
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900">
                                    {user?.bankDetails?.bankName}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-sm text-gray-500 mb-1">
                                    Account Number
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900">
                                    {user?.bankDetails?.accountNumber}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">
                                    Account Holder Name
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900">
                                    {user?.bankDetails?.accountHolderName}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-sm text-gray-500 mb-1">
                                    Branch Name
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900">
                                    {user?.bankDetails?.branchName}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Account Status Card */}
                      <div className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                            <ShieldCheck className="text-gray-600" size={22} />
                          </div>
                          Account Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Account Status
                              </p>
                              <div
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-sm ${
                                  user?.status === "active"
                                    ? "bg-green-100/80 text-green-800"
                                    : user?.status === "inactive"
                                      ? "bg-red-100/80 text-red-800"
                                      : "bg-gray-100/80 text-gray-800"
                                }`}
                              >
                                {user?.status === "active" ? (
                                  <CheckCircle
                                    className="text-green-600"
                                    size={18}
                                  />
                                ) : (
                                  <AlertCircle
                                    className="text-red-600"
                                    size={18}
                                  />
                                )}
                                <p className="font-semibold capitalize">
                                  {user?.status || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Account Role
                              </p>
                              <div
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-sm ${
                                  isAdmin()
                                    ? "bg-purple-100/80 text-purple-800"
                                    : isModerator()
                                      ? "bg-orange-100/80 text-orange-800"
                                      : "bg-blue-100/80 text-blue-800"
                                }`}
                              >
                                <Shield
                                  className={
                                    isAdmin()
                                      ? "text-purple-600"
                                      : isModerator()
                                        ? "text-orange-600"
                                        : "text-blue-600"
                                  }
                                  size={18}
                                />
                                <p className="font-semibold capitalize">
                                  {user?.role || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Account Created
                              </p>
                              <div className="flex items-center gap-2">
                                <Calendar className="text-gray-400" size={16} />
                                <p className="text-lg font-semibold text-gray-900">
                                  {formatDate(user?.createdAt)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Last Updated
                              </p>
                              <div className="flex items-center gap-2">
                                <Activity className="text-gray-400" size={16} />
                                <p className="text-lg font-semibold text-gray-900">
                                  {formatDate(user?.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode - Input Forms */
                    <div className="space-y-6">
                      {/* Profile Picture Upload Section */}
                      <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                              <ImageIcon
                                className="text-purple-600"
                                size={20}
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">
                                Profile Picture
                              </h4>
                              <p className="text-sm text-gray-600">
                                Update your profile photo
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {/* <button
                              onClick={triggerFileInput}
                              disabled={uploading}
                              className="px-4 py-2 bg-[#113F67] text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Camera size={16} />
                              {selectedFile ? 'Change' : 'Change Photo'}
                            </button> */}

                            {/* {selectedFile && (
                              <button
                                onClick={() => setShowUploadConfirm(true)}
                                disabled={uploading}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Upload size={16} />
                                Save
                              </button>
                            )} */}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="relative">
                            <div className="w-20 h-20 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40 shadow-sm overflow-hidden">
                              {hasValidPicture() ? (
                                <img
                                  src={user.picture}
                                  alt={user.firstName || user.name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <span className="text-white text-2xl font-bold">
                                    {getUserInitials()}
                                  </span>
                                </div>
                              )}

                              {uploading && (
                                <div className="absolute inset-0 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
                                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="space-y-2">
                              <p className="text-sm text-gray-700">
                                Click the upload button to change your profile
                                picture.
                              </p>
                              <div className="flex gap-2">
                                {selectedFile && (
                                  <button
                                    onClick={cancelFileSelection}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                  >
                                    <X size={14} />
                                    Cancel Preview
                                  </button>
                                )}

                                {hasValidPicture() && !selectedFile && (
                                  <button
                                    onClick={handleDeleteProfilePicture}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                  >
                                    <Trash2 size={14} />
                                    Remove current photo
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Upload Confirmation Modal */}
                        {showUploadConfirm && (
                          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
                              <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Confirm Upload
                              </h3>
                              <p className="text-gray-600 mb-6">
                                Are you sure you want to upload this image as
                                your new profile picture?
                              </p>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => setShowUploadConfirm(false)}
                                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleProfilePictureUpload}
                                  disabled={uploading}
                                  className="flex-1 px-4 py-2 bg-[#113F67] text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
                                >
                                  {uploading ? "Uploading..." : "Yes, Upload"}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Basic Info Section */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">
                          Basic Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={profileForm.firstName}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  firstName: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              value={profileForm.lastName}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  lastName: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email Section (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg border border-gray-300">
                          <Mail className="text-gray-400" size={20} />
                          <span className="text-gray-900">{user?.email}</span>
                          <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Email cannot be changed
                        </p>
                      </div>

                      {/* Contact Info Section */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">
                          Contact Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="+8801XXXXXXXXX"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={profileForm.address}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  address: e.target.value,
                                })
                              }
                              placeholder="City, Country"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Work Information Section */}
                      <div className="bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                          <Briefcase size={18} />
                          Work Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Work Location Type
                            </label>
                            <select
                              value={profileForm.workLocationType}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  workLocationType: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200"
                            >
                              <option value="onsite">Onsite</option>
                              <option value="remote">Remote</option>
                              <option value="hybrid">Hybrid</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Work Arrangement
                            </label>
                            <select
                              value={profileForm.workArrangement}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  workArrangement: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200"
                            >
                              <option value="full-time">Full-time</option>
                              <option value="part-time">Part-time</option>
                              <option value="contractual">Contractual</option>
                              <option value="freelance">Freelance</option>
                              <option value="internship">Internship</option>
                              <option value="temporary">Temporary</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contract Type (if applicable)
                            </label>
                            <input
                              type="text"
                              value={profileForm.contractType}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  contractType: e.target.value,
                                })
                              }
                              placeholder="e.g., Permanent, Probation, Project-based"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Admin Information Section */}
                      {isAdmin() && (
                        <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 shadow-sm">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <Shield size={18} />
                            Administrator Information
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name
                              </label>
                              <input
                                type="text"
                                value={profileForm.companyName}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    companyName: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Position
                              </label>
                              <input
                                type="text"
                                value={profileForm.adminPosition}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    adminPosition: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Level
                              </label>
                              <select
                                value={profileForm.adminLevel}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    adminLevel: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                              >
                                <option value="">Select Level</option>
                                <option value="super">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="moderator">Moderator</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Permissions
                              </label>
                              <input
                                type="text"
                                value={profileForm.permissions.join(", ")}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    permissions: e.target.value
                                      .split(",")
                                      .map((p) => p.trim()),
                                  })
                                }
                                placeholder="user:read, user:write, etc."
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Comma separated values
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={profileForm.isSuperAdmin}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    isSuperAdmin: e.target.checked,
                                  })
                                }
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="text-sm text-gray-700">
                                Is Super Admin
                              </label>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={profileForm.canManageUsers}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    canManageUsers: e.target.checked,
                                  })
                                }
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="text-sm text-gray-700">
                                Can Manage Users
                              </label>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={profileForm.canManagePayroll}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    canManagePayroll: e.target.checked,
                                  })
                                }
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="text-sm text-gray-700">
                                Can Manage Payroll
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Moderator Information Section */}
                      {isModerator() && (
                        <div className="bg-gradient-to-r from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <ShieldCheck size={18} />
                            Moderator Information
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Moderator Level
                              </label>
                              <select
                                value={profileForm.moderatorLevel}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    moderatorLevel: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                              >
                                <option value="">Select Level</option>
                                <option value="trainee">Trainee</option>
                                <option value="junior">Junior Moderator</option>
                                <option value="senior">Senior Moderator</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Moderation Scope
                              </label>
                              <input
                                type="text"
                                value={profileForm.moderatorScope.join(", ")}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    moderatorScope: e.target.value
                                      .split(",")
                                      .map((s) => s.trim()),
                                  })
                                }
                                placeholder="content, users, reports, etc."
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Comma separated values
                              </p>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Moderation Permissions
                              </label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={profileForm.canModerateUsers}
                                    onChange={(e) =>
                                      setProfileForm({
                                        ...profileForm,
                                        canModerateUsers: e.target.checked,
                                      })
                                    }
                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                  />
                                  <label className="text-sm text-gray-700">
                                    Can Moderate Users
                                  </label>
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={profileForm.canModerateContent}
                                    onChange={(e) =>
                                      setProfileForm({
                                        ...profileForm,
                                        canModerateContent: e.target.checked,
                                      })
                                    }
                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                  />
                                  <label className="text-sm text-gray-700">
                                    Can Moderate Content
                                  </label>
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={profileForm.canViewReports}
                                    onChange={(e) =>
                                      setProfileForm({
                                        ...profileForm,
                                        canViewReports: e.target.checked,
                                      })
                                    }
                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                  />
                                  <label className="text-sm text-gray-700">
                                    Can View Reports
                                  </label>
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={profileForm.canManageReports}
                                    onChange={(e) =>
                                      setProfileForm({
                                        ...profileForm,
                                        canManageReports: e.target.checked,
                                      })
                                    }
                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                  />
                                  <label className="text-sm text-gray-700">
                                    Can Manage Reports
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Daily Action Limit
                              </label>
                              <input
                                type="number"
                                value={
                                  profileForm.moderationLimits.dailyActions
                                }
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    moderationLimits: {
                                      ...profileForm.moderationLimits,
                                      dailyActions:
                                        parseInt(e.target.value) || 50,
                                    },
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Warning Limit
                              </label>
                              <input
                                type="number"
                                value={
                                  profileForm.moderationLimits.warningLimit
                                }
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    moderationLimits: {
                                      ...profileForm.moderationLimits,
                                      warningLimit:
                                        parseInt(e.target.value) || 3,
                                    },
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Permissions
                              </label>
                              <input
                                type="text"
                                value={profileForm.permissions.join(", ")}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    permissions: e.target.value
                                      .split(",")
                                      .map((p) => p.trim()),
                                  })
                                }
                                placeholder="content:edit, user:view, report:view, etc."
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Comma separated values
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Professional Info Section */}
                      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                          <Briefcase size={18} />
                          Professional Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Department
                            </label>
                            <input
                              type="text"
                              value={profileForm.department}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  department: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Designation
                            </label>
                            <input
                              type="text"
                              value={profileForm.designation}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  designation: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Employee ID
                            </label>
                            <input
                              type="text"
                              value={profileForm.employeeId}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  employeeId: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Joining Date
                            </label>
                            <input
                              type="date"
                              value={
                                profileForm.joiningDate
                                  ? new Date(profileForm.joiningDate)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  joiningDate: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bank Details Section (for employees and moderators only - not for admin) */}
                      {!isAdmin() && (isEmployee() || isModerator()) && (
                        <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-100 shadow-sm">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <CreditCard size={18} />
                            Bank Details
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name
                              </label>
                              <input
                                type="text"
                                value={profileForm.bankDetails?.bankName || ""}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    bankDetails: {
                                      ...profileForm.bankDetails,
                                      bankName: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., DBBL, City Bank, Brac Bank"
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number
                              </label>
                              <input
                                type="text"
                                value={
                                  profileForm.bankDetails?.accountNumber || ""
                                }
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    bankDetails: {
                                      ...profileForm.bankDetails,
                                      accountNumber: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., 1234567890"
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Holder Name
                              </label>
                              <input
                                type="text"
                                value={
                                  profileForm.bankDetails?.accountHolderName ||
                                  ""
                                }
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    bankDetails: {
                                      ...profileForm.bankDetails,
                                      accountHolderName: e.target.value,
                                    },
                                  })
                                }
                                placeholder="Your full name as in bank account"
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Branch Name
                              </label>
                              <input
                                type="text"
                                value={
                                  profileForm.bankDetails?.branchName || ""
                                }
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    bankDetails: {
                                      ...profileForm.bankDetails,
                                      branchName: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., Gulshan, Motijheel, Dhanmondi"
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Routing Number
                              </label>
                              <input
                                type="text"
                                value={
                                  profileForm.bankDetails?.routingNumber || ""
                                }
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    bankDetails: {
                                      ...profileForm.bankDetails,
                                      routingNumber: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., 123456789"
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Type
                              </label>
                              <select
                                value={
                                  profileForm.bankDetails?.accountType ||
                                  "savings"
                                }
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    bankDetails: {
                                      ...profileForm.bankDetails,
                                      accountType: e.target.value,
                                    },
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                              >
                                <option value="savings">Savings Account</option>
                                <option value="current">Current Account</option>
                                <option value="salary">Salary Account</option>
                                <option value="student">Student Account</option>
                                <option value="joint">Joint Account</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Swift Code / IBAN (if applicable)
                              </label>
                              <input
                                type="text"
                                value={profileForm.bankDetails?.swiftCode || ""}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    bankDetails: {
                                      ...profileForm.bankDetails,
                                      swiftCode: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., DBBLBDDH123"
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Salary Info Section */}
                      {(isEmployee() || isModerator()) && (
                        <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-100 shadow-sm">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <CreditCard size={18} />
                            Salary Information
                          </h4>
                          <div className="max-w-xs">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Basic Salary (৳)
                            </label>
                            <input
                              type="number"
                              value={profileForm.basicSalary}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  basicSalary: e.target.value,
                                })
                              }
                              placeholder="Enter basic salary"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>
                        </div>
                      )}

                      {/* Employee/Moderator-specific fields */}
                      {(isEmployee() || isModerator()) && (
                        <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <Users size={18} />
                            Employee Information
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Manager ID
                              </label>
                              <input
                                type="text"
                                value={profileForm.managerId}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    managerId: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Attendance ID
                              </label>
                              <input
                                type="text"
                                value={profileForm.attendanceId}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    attendanceId: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shift Start Time
                              </label>
                              <input
                                type="time"
                                value={profileForm.shiftTiming.start}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    shiftTiming: {
                                      ...profileForm.shiftTiming,
                                      start: e.target.value,
                                    },
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shift End Time
                              </label>
                              <input
                                type="time"
                                value={profileForm.shiftTiming.end}
                                onChange={(e) =>
                                  setProfileForm({
                                    ...profileForm,
                                    shiftTiming: {
                                      ...profileForm.shiftTiming,
                                      end: e.target.value,
                                    },
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bank Information Tab - Hidden for Admin */}
              {activeTab === "bank" && !isAdmin() && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Bank Information
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Manage your bank account details
                      </p>
                    </div>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2.5 bg-[#113F67] text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit Bank Info
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditMode(false);
                            fetchUserProfile();
                          }}
                          className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          disabled={updating}
                          className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updating ? (
                            <>
                              <Loader2 className="animate-spin" size={16} />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* View Mode - Bank Information */}
                  {!editMode ? (
                    <div className="space-y-6">
                      {/* Bank Details Card */}
                      {(isEmployee() || isModerator()) &&
                      user?.bankDetails?.bankName ? (
                        <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm">
                          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                              <CreditCard
                                className="text-emerald-600"
                                size={22}
                              />
                            </div>
                            Bank Account Details
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Bank Name
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.bankDetails?.bankName}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Account Number
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.bankDetails?.accountNumber}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Account Holder Name
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.bankDetails?.accountHolderName}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Branch Name
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.bankDetails?.branchName}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Routing Number
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.bankDetails?.routingNumber || "N/A"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Account Type
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {user?.bankDetails?.accountType || "Savings"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Account Status */}
                          <div className="mt-8 pt-6 border-t border-emerald-200/50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Verification Status
                                </p>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${user?.bankDetails?.isVerified ? "bg-green-500" : "bg-yellow-500"}`}
                                  ></div>
                                  <p
                                    className={`font-semibold ${user?.bankDetails?.isVerified ? "text-green-600" : "text-yellow-600"}`}
                                  >
                                    {user?.bankDetails?.isVerified
                                      ? "Verified"
                                      : "Pending Verification"}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">
                                  Last Updated
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {user?.bankDetails?.updatedAt
                                    ? formatDate(user.bankDetails.updatedAt)
                                    : formatDate(user?.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // No Bank Information Card
                        <div className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 text-center">
                          <div className="w-16 h-16 bg-gray-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="text-gray-400" size={24} />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">
                            No Bank Information
                          </h4>
                          <p className="text-gray-600 mb-4">
                            You haven't added your bank account details yet
                          </p>
                          <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2.5 bg-[#113F67] text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md inline-flex items-center gap-2"
                          >
                            <Edit size={16} />
                            Add Bank Details
                          </button>
                        </div>
                      )}

                      {/* Security Note */}
                      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                        <div className="flex items-start gap-3">
                          <ShieldCheck
                            className="text-blue-600 mt-0.5"
                            size={18}
                          />
                          <div>
                            <p className="font-medium text-gray-900 mb-1">
                              Security Note
                            </p>
                            <p className="text-sm text-gray-600">
                              Your bank information is encrypted and stored
                              securely. Only authorized payroll administrators
                              can view this information.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode - Bank Information Form */
                    <div className="space-y-6">
                      {/* Bank Details Form */}
                      <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-xl p-6 border border-emerald-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                          <CreditCard size={20} />
                          Bank Account Details
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bank Name *
                            </label>
                            <input
                              type="text"
                              value={profileForm.bankDetails?.bankName || ""}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  bankDetails: {
                                    ...profileForm.bankDetails,
                                    bankName: e.target.value,
                                  },
                                })
                              }
                              placeholder="e.g., DBBL, City Bank, Brac Bank"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Account Number *
                            </label>
                            <input
                              type="text"
                              value={
                                profileForm.bankDetails?.accountNumber || ""
                              }
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  bankDetails: {
                                    ...profileForm.bankDetails,
                                    accountNumber: e.target.value,
                                  },
                                })
                              }
                              placeholder="e.g., 1234567890"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Account Holder Name *
                            </label>
                            <input
                              type="text"
                              value={
                                profileForm.bankDetails?.accountHolderName || ""
                              }
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  bankDetails: {
                                    ...profileForm.bankDetails,
                                    accountHolderName: e.target.value,
                                  },
                                })
                              }
                              placeholder="Your full name as in bank account"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Branch Name *
                            </label>
                            <input
                              type="text"
                              value={profileForm.bankDetails?.branchName || ""}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  bankDetails: {
                                    ...profileForm.bankDetails,
                                    branchName: e.target.value,
                                  },
                                })
                              }
                              placeholder="e.g., Gulshan, Motijheel, Dhanmondi"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Routing Number
                            </label>
                            <input
                              type="text"
                              value={
                                profileForm.bankDetails?.routingNumber || ""
                              }
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  bankDetails: {
                                    ...profileForm.bankDetails,
                                    routingNumber: e.target.value,
                                  },
                                })
                              }
                              placeholder="e.g., 123456789"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Account Type
                            </label>
                            <select
                              value={
                                profileForm.bankDetails?.accountType ||
                                "savings"
                              }
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  bankDetails: {
                                    ...profileForm.bankDetails,
                                    accountType: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                            >
                              <option value="savings">Savings Account</option>
                              <option value="current">Current Account</option>
                              <option value="salary">Salary Account</option>
                              <option value="student">Student Account</option>
                              <option value="joint">Joint Account</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Swift Code / IBAN (if applicable)
                            </label>
                            <input
                              type="text"
                              value={profileForm.bankDetails?.swiftCode || ""}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  bankDetails: {
                                    ...profileForm.bankDetails,
                                    swiftCode: e.target.value,
                                  },
                                })
                              }
                              placeholder="e.g., DBBLBDDH123"
                              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                            />
                          </div>
                        </div>

                        {/* Verification Checkbox */}
                        <div className="mt-6 pt-6 border-t border-emerald-200/50">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={
                                profileForm.bankDetails?.isVerified || false
                              }
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  bankDetails: {
                                    ...profileForm.bankDetails,
                                    isVerified: e.target.checked,
                                    verifiedAt: e.target.checked
                                      ? new Date()
                                      : null,
                                  },
                                })
                              }
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                              id="bankVerified"
                            />
                            <label
                              htmlFor="bankVerified"
                              className="text-sm text-gray-700"
                            >
                              Mark account as verified (Only for admin use)
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            This indicates that the bank account has been
                            verified by the finance department.
                          </p>
                        </div>
                      </div>

                      {/* Security Note */}
                      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ShieldCheck size={16} />
                          Important Instructions
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle
                              className="text-green-600 mt-0.5"
                              size={14}
                            />
                            <p className="text-sm text-gray-600">
                              Ensure the account holder name matches your
                              official name
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle
                              className="text-green-600 mt-0.5"
                              size={14}
                            />
                            <p className="text-sm text-gray-600">
                              Double-check account number before saving
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle
                              className="text-green-600 mt-0.5"
                              size={14}
                            />
                            <p className="text-sm text-gray-600">
                              Your salary will be deposited to this account
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payroll History Tab */}
              {activeTab === "payroll" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Payroll History
                      </h3>
                      <p className="text-gray-500 text-sm mt-0.5">
                        Your monthly salary breakdown
                      </p>
                    </div>
                    <button
                      onClick={fetchMyPayrolls}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 2v6h-6" />
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                        <path d="M3 22v-6h6" />
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                      </svg>
                    </button>
                  </div>

                  {payrollLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2
                        size={28}
                        className="animate-spin text-[#113F67]"
                      />
                    </div>
                  ) : payrolls.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <DollarSign size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">
                        No payroll records yet
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Your monthly payroll will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payrolls.map((p) => {
                        const MONTHS_LIST = [
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
                        const monthName = MONTHS_LIST[(p.month || 1) - 1];
                        const net = p.summary?.netPayable ?? 0;
                        const gross =
                          p.earnings?.total ?? p.summary?.grossEarnings ?? 0;
                        const deductions =
                          p.deductions?.total ??
                          p.summary?.totalDeductions ??
                          0;
                        const present = p.attendance?.presentDays ?? "--";
                        const totalWd = p.attendance?.totalWorkingDays ?? "--";
                        const late = p.attendance?.lateDays ?? 0;
                        const absent = p.attendance?.absentDays ?? 0;
                        const salary = p.salaryDetails?.monthlySalary ?? 0;

                        const statusColors = {
                          Paid: "bg-green-100 text-green-700 border-green-200",
                          Approved: "bg-blue-100 text-blue-700 border-blue-200",
                          Pending:
                            "bg-amber-100 text-amber-700 border-amber-200",
                          Draft: "bg-gray-100 text-gray-600 border-gray-200",
                          Rejected: "bg-red-100 text-red-700 border-red-200",
                          Processing:
                            "bg-purple-100 text-purple-700 border-purple-200",
                        };
                        const statusCls =
                          statusColors[p.status] || statusColors.Pending;

                        const fmt = (n) =>
                          Number(n || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          });

                        return (
                          <div
                            key={p._id}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                          >
                            {/* Card header */}
                            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#113F67]/5 to-blue-50 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={15}
                                  className="text-[#113F67]"
                                />
                                <span className="font-bold text-gray-800 text-sm">
                                  {monthName} {p.year}
                                </span>
                              </div>
                              <span
                                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusCls}`}
                              >
                                {p.status || "Pending"}
                              </span>
                            </div>

                            <div className="p-5">
                              {/* Net pay large display */}
                              <div className="flex items-end justify-between mb-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-0.5">
                                    Net Pay
                                  </p>
                                  <p className="text-2xl font-bold text-[#113F67]">
                                    BDT {fmt(net)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-400 mb-0.5">
                                    Gross Salary
                                  </p>
                                  <p className="text-sm font-medium text-gray-600">
                                    BDT {fmt(salary)}
                                  </p>
                                </div>
                              </div>

                              {/* Earnings / Deductions bar */}
                              <div className="flex gap-3 mb-4">
                                <div className="flex-1 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                                  <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">
                                    Earned
                                  </p>
                                  <p className="text-sm font-bold text-green-700 mt-0.5">
                                    BDT {fmt(gross)}
                                  </p>
                                </div>
                                <div className="flex-1 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                  <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wide">
                                    Deductions
                                  </p>
                                  <p className="text-sm font-bold text-red-600 mt-0.5">
                                    - BDT {fmt(deductions)}
                                  </p>
                                </div>
                              </div>

                              {/* Attendance summary */}
                              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                                <div className="text-center">
                                  <p className="text-base font-bold text-gray-800">
                                    {present}
                                    <span className="text-xs text-gray-400 font-normal">
                                      /{totalWd}
                                    </span>
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    Present
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p
                                    className={`text-base font-bold ${absent > 0 ? "text-red-600" : "text-gray-800"}`}
                                  >
                                    {absent}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    Absent
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p
                                    className={`text-base font-bold ${late > 0 ? "text-amber-600" : "text-gray-800"}`}
                                  >
                                    {late}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    Late
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-base font-bold text-gray-800">
                                    {p.attendance?.leaveDays ?? 0}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    Leaves
                                  </p>
                                </div>
                              </div>

                              {/* Employee accepted badge */}
                              {p.employeeAccepted?.accepted && (
                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
                                  <CheckCircle
                                    size={12}
                                    className="text-green-500"
                                  />
                                  <span className="text-xs text-green-600 font-medium">
                                    You accepted this payroll
                                  </span>
                                </div>
                              )}
                              {p.status === "Paid" &&
                                !p.employeeAccepted?.accepted && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <button
                                      onClick={async () => {
                                        try {
                                          const token = getCurrentToken();
                                          const res = await fetch(
                                            `${process.env.NEXT_PUBLIC_HRM_API_URL}/payroll/${p._id}/employee-accept`,
                                            {
                                              method: "PUT",
                                              headers: {
                                                Authorization: `Bearer ${token}`,
                                                "Content-Type":
                                                  "application/json",
                                              },
                                            },
                                          );
                                          if (res.ok) {
                                            toast.success("Payroll accepted!");
                                            fetchMyPayrolls();
                                          }
                                        } catch {
                                          toast.error("Failed to accept");
                                        }
                                      }}
                                      className="w-full py-1.5 text-xs font-medium text-[#113F67] border border-[#113F67] rounded-lg hover:bg-[#113F67] hover:text-white transition-colors"
                                    >
                                      Accept Payroll
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Sessions Tab with Pagination */}
              {activeTab === "sessions" && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Session History
                      </h3>
                      <p className="text-gray-600 mt-1">
                        View and manage your login sessions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleLogoutAllSessions}
                        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout All Sessions
                      </button>
                    </div>
                  </div>

                  {sessions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="text-gray-400" size={24} />
                      </div>
                      <p className="text-gray-700 font-medium">
                        No session history found
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Your login sessions will appear here
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-6">
                        {currentSessions.map((session, index) => (
                          <div
                            key={session._id || `session-${index}`}
                            className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:bg-white/50 transition-all duration-200"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    session.logoutAt
                                      ? "bg-gray-300"
                                      : "bg-green-500 animate-pulse"
                                  }`}
                                ></div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {session.device || "Unknown Device"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {session.ip || "Unknown IP"}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {session.loginAt
                                    ? new Date(
                                        session.loginAt,
                                      ).toLocaleDateString("en-BD", {
                                        timeZone: "Asia/Dhaka",
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "N/A"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {session.loginAt
                                    ? new Date(
                                        session.loginAt,
                                      ).toLocaleTimeString("en-BD", {
                                        timeZone: "Asia/Dhaka",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                              <div className="flex flex-wrap items-center gap-4">
                                <span className="text-gray-600">
                                  <Clock size={14} className="inline mr-1" />
                                  Login:{" "}
                                  {session.loginAt
                                    ? new Date(
                                        session.loginAt,
                                      ).toLocaleTimeString("en-BD", {
                                        timeZone: "Asia/Dhaka",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : "N/A"}
                                </span>
                                {session.logoutAt && (
                                  <span className="text-gray-600">
                                    <Clock size={14} className="inline mr-1" />
                                    Logout:{" "}
                                    {new Date(
                                      session.logoutAt,
                                    ).toLocaleTimeString("en-BD", {
                                      timeZone: "Asia/Dhaka",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </span>
                                )}
                              </div>

                              {!session.logoutAt && index !== 0 && (
                                <button
                                  onClick={() =>
                                    handleTerminateSession(session._id)
                                  }
                                  className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all duration-200 text-sm"
                                >
                                  Terminate
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                          <div className="text-sm text-gray-500">
                            Showing {indexOfFirstSession + 1} to{" "}
                            {Math.min(indexOfLastSession, sessions.length)} of{" "}
                            {sessions.length} sessions
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              <ChevronLeft size={16} />
                            </button>

                            <div className="flex items-center gap-1">
                              {Array.from(
                                { length: Math.min(5, totalPages) },
                                (_, i) => {
                                  let pageNumber;
                                  if (totalPages <= 5) {
                                    pageNumber = i + 1;
                                  } else if (currentPage <= 3) {
                                    pageNumber = i + 1;
                                  } else if (currentPage >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + i;
                                  } else {
                                    pageNumber = currentPage - 2 + i;
                                  }

                                  return (
                                    <button
                                      key={pageNumber}
                                      onClick={() =>
                                        handlePageClick(pageNumber)
                                      }
                                      className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                                        currentPage === pageNumber
                                          ? "bg-[#113F67] text-white"
                                          : "hover:bg-gray-50/50 text-gray-700"
                                      }`}
                                    >
                                      {pageNumber}
                                    </button>
                                  );
                                },
                              )}

                              {totalPages > 5 &&
                                currentPage < totalPages - 2 && (
                                  <>
                                    <span className="text-gray-400">...</span>
                                    <button
                                      onClick={() =>
                                        handlePageClick(totalPages)
                                      }
                                      className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                                        currentPage === totalPages
                                          ? "bg-[#113F67] text-white"
                                          : "hover:bg-gray-50/50 text-gray-700"
                                      }`}
                                    >
                                      {totalPages}
                                    </button>
                                  </>
                                )}
                            </div>

                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              <ChevronRightIcon size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Trash2 className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                Are you sure you want to delete the user{" "}
                <strong>{userToDelete?.name || userToDelete?.email}</strong>?
              </p>
              <p className="text-xs text-red-600 mt-2">
                This will permanently delete the user account and all associated
                data.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50/50 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Yes, Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add LogOut icon component
const LogOut = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
