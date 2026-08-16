/**
 * HRM session storage helper.
 *
 * The HRM module keeps role-specific tokens in localStorage (adminToken /
 * employeeToken / moderatorToken). This mirrors exactly what the HRM login
 * page (app/hrm/page.js) writes, so a user who signs in through the unified
 * /login page lands in a fully working HRM session.
 */

export const HRM_API_URL =
  process.env.NEXT_PUBLIC_HRM_API_URL || "http://localhost:5000/api/v1";

const KEYS_BY_ROLE = {
  employee: { tokenKey: "employeeToken", dataKey: "employeeData" },
  admin: { tokenKey: "adminToken", dataKey: "adminData" },
  superAdmin: { tokenKey: "adminToken", dataKey: "adminData" },
  moderator: { tokenKey: "moderatorToken", dataKey: "moderatorData" },
};

const REDIRECT_BY_ROLE = {
  employee: "/hrm/profile",
  admin: "/hrm/dashboard",
  superAdmin: "/hrm/dashboard",
  moderator: "/hrm/moderatorDashboard",
};

/** Persist an HRM login response. Returns the page the user should land on. */
export function storeHrmSession(data) {
  const { tokenKey, dataKey } = KEYS_BY_ROLE[data.role] || {
    tokenKey: "userToken",
    dataKey: "userData",
  };

  const userData = {
    _id: data._id,
    id: data._id || data.id,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    fullName: data.fullName || `${data.firstName || ""} ${data.lastName || ""}`.trim(),
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
    userData.canModerateContent = data.canModerateContent ?? true;
    userData.canViewReports = data.canViewReports ?? true;
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

  localStorage.setItem(tokenKey, data.token);
  localStorage.setItem(dataKey, JSON.stringify(userData));
  localStorage.setItem("currentUserRole", data.role);
  localStorage.setItem("cacheExpiry", String(Date.now() + 60 * 60 * 1000));

  return REDIRECT_BY_ROLE[data.role] || "/hrm/profile";
}

/** Attempt an HRM login. Returns { success, redirectTo, role, message }. */
export async function hrmLogin(email, password) {
  try {
    const res = await fetch(`${HRM_API_URL}/unified-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      return { success: false, message: data.message || "Invalid credentials" };
    }

    return {
      success: true,
      role: data.role,
      redirectTo: storeHrmSession(data),
      name: data.firstName || data.fullName || "",
    };
  } catch (error) {
    return { success: false, message: "Could not reach the HRM server." };
  }
}
