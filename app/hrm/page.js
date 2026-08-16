"use client";

import { useState, useEffect } from "react";
import api from "./lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import LoginScene from "@/components/hrm/login/LoginScene";

const page = () => {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  // Real-time validation
  useEffect(() => {
    if (email) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setErrors((prev) => ({ ...prev, email: isValid ? "" : "Please enter a valid email address" }));
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      const isValid = password.length >= 6;
      setErrors((prev) => ({ ...prev, password: isValid ? "" : "Password must be at least 6 characters" }));
    }
  }, [password]);

  const isLocalStorageAvailable = () => {
    try {
      return typeof window !== "undefined" && window.localStorage;
    } catch (e) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (!email || !password) {
        toast.error("Please fill all required fields", { position: "top-right", duration: 3000 });
      } else if (errors.email || errors.password) {
        toast.error("Please fix the validation errors", { position: "top-right", duration: 3000 });
      }
      return;
    }

    setErrors({ email: "", password: "", general: "" });
    setLoading(true);

    const loadingToast = toast.loading("Authenticating...", { position: "top-right", duration: Infinity });

    try {
      const response = await api.post("/unified-login", { email, password });
      const { data } = response;

      if (!data.success) throw new Error(data.message || "Login failed");

      if (isLocalStorageAvailable()) {
        let tokenKey, dataKey;
        switch (data.role) {
          case "employee":
            tokenKey = "employeeToken";
            dataKey = "employeeData";
            break;
          case "admin":
          case "superAdmin":
            tokenKey = "adminToken";
            dataKey = "adminData";
            break;
          case "moderator":
            tokenKey = "moderatorToken";
            dataKey = "moderatorData";
            break;
          default:
            tokenKey = "userToken";
            dataKey = "userData";
        }

        localStorage.setItem(tokenKey, data.token);

        const userData = {
          _id: data._id,
          id: data._id || data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: data.fullName || `${data.firstName} ${data.lastName}`,
          role: data.role,
          phone: data.phone,
          picture: data.picture,
          department: data.department,
          designation: data.designation,
          employeeId: data.employeeId,
          status: data.status,
          isActive: data.isActive,
          lastLogin: data.lastLogin,
          loginCount: data.loginCount || 0,
          token: data.token,
          sessionId: data.sessionId,
          permissions: data.permissions || [],
          loginTime: new Date().toISOString(),
        };

        if (data.role === "admin" || data.role === "superAdmin") {
          userData.adminLevel = data.adminLevel;
          userData.companyName = data.companyName;
          userData.adminPosition = data.adminPosition;
          userData.isSuperAdmin = data.isSuperAdmin || false;
          userData.canManageUsers = data.canManageUsers || false;
          userData.canManagePayroll = data.canManagePayroll || false;
        }

        if (data.role === "moderator") {
          userData.moderatorLevel = data.moderatorLevel;
          userData.moderatorScope = data.moderatorScope || [];
          userData.canModerateUsers = data.canModerateUsers || false;
          userData.canModerateContent = data.canModerateContent || true;
          userData.canViewReports = data.canViewReports || true;
          userData.canManageReports = data.canManageReports || false;
          userData.moderationLimits = data.moderationLimits || {
            dailyActions: 50,
            warningLimit: 3,
            canBanUsers: false,
            canDeleteContent: true,
            canEditContent: true,
            canWarnUsers: true,
          };
        }

        localStorage.setItem(dataKey, JSON.stringify(userData));
        localStorage.setItem("currentUserRole", data.role);
        const expiration = Date.now() + 60 * 60 * 1000;
        localStorage.setItem("cacheExpiry", expiration.toString());
      }

      let welcomeMessage,
        icon = "🎉",
        roleColor = "#10B981";
      switch (data.role) {
        case "employee":
          welcomeMessage = `Welcome back, ${data.firstName || data.fullName || "Employee"}!`;
          icon = "👨‍💼";
          roleColor = "#3B82F6";
          break;
        case "admin":
          welcomeMessage = `Welcome Admin ${data.firstName || data.fullName || ""}!`;
          icon = "👑";
          roleColor = "#8B5CF6";
          break;
        case "superAdmin":
          welcomeMessage = `Welcome Super Admin ${data.firstName || data.fullName || ""}!`;
          icon = "⚡";
          roleColor = "#113F67";
          break;
        case "moderator":
          welcomeMessage = `Welcome Moderator ${data.firstName || data.fullName || ""}!`;
          icon = "🛡️";
          roleColor = "#10B981";
          break;
        default:
          welcomeMessage = `Welcome, ${data.firstName || data.fullName || "User"}!`;
          roleColor = "#6B7280";
      }

      toast.success(welcomeMessage, {
        id: loadingToast,
        duration: 3000,
        position: "top-right",
        icon,
        style: { background: roleColor, color: "white", fontWeight: "500" },
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      switch (data.role) {
        case "employee":
          router.push("/hrm/profile");
          break;
        case "admin":
        case "superAdmin":
          router.push("/hrm/dashboard");
          break;
        case "moderator":
          router.push("/hrm/moderatorDashboard");
          break;
        default:
          router.push("/hrm/profile");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
      toast.error(errorMsg, {
        id: loadingToast,
        duration: 4000,
        position: "top-right",
        icon: "❌",
        style: { background: "#EF4444", color: "white" },
      });
      setErrors((prev) => ({ ...prev, general: errorMsg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginScene
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      errors={errors}
      loading={loading}
      isFocused={isFocused}
      setIsFocused={setIsFocused}
      handleSubmit={handleSubmit}
    />
  );
};

export default page;
