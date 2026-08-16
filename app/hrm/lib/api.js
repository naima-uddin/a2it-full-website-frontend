// app/lib/api.js
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_HRM_API_URL ||
  "http://localhost:5000/api/v1" ||
  "http://localhost:5000/api/v1";

console.log("🔧 API Base URL:", API_BASE); // ডিবাগিং যোগ করুন

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper function to get token
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
};

// Users
export async function getUsers() {
  try {
    const res = await api.get("/admin/getAll-user");
    return res.data;
  } catch (err) {
    console.error(err);
    return { users: [] };
  }
}

export async function createUser(data) {
  try {
    const res = await api.post("/admin/create-user", data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err);
    return { message: err.response?.data?.message || "Failed to create user" };
  }
}

export async function updateUser(id, data) {
  try {
    const res = await api.put(`/admin/update-user/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err);
    return { message: err.response?.data?.message || "Failed to update user" };
  }
}

export async function deleteUser(id) {
  try {
    const res = await api.delete(`/admin/user-delete/${id}`);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err);
    return { message: err.response?.data?.message || "Failed to delete user" };
  }
}

// Admin reset password functions
const REQUEST_TIMEOUT = 10000; // 10 seconds

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const text = await response.text();
    let result;

    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Invalid JSON response: ${text}`);
    }

    if (!response.ok) {
      throw new Error(result.message || `Request failed (${response.status})`);
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Server timeout. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
};
// get user by id
// Get user by ID (for Admin to view any user's profile)
export const getUserById = async (userId) => {
  try {
    const token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("employeeToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // সঠিক endpoint
    const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/profile/${userId}`;
    // অথবা
    // const endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/admin/users/${userId}`;

    console.log("Fetching user by ID:", endpoint);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // ... rest of your code
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw error;
  }
};

// অথবা যদি admin-specific endpoint থাকে
export const getAdminUserById = async (userId) => {
  try {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      throw new Error("Admin token not found");
    }

    const response = await fetch(`${API_BASE}/profile/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return await response.json();
  } catch (error) {
    console.error("Get admin user by ID error:", error);
    throw error;
  }
};
// /**
//  * Admin: Request OTP
//  */
// export const adminRequestOtp = async (data) => {
//   const token = getToken();

//   if (!token) {
//     throw new Error('Authentication required. Please login first.');
//   }

//   if (!data?.userEmail) {
//     throw new Error('User email is required.');
//   }

//   console.log('🔄 Requesting OTP for:', data.userEmail);

//   try {
//     const result = await fetchWithTimeout(
//       `${API_BASE}/admin/request-otp`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       }
//     );

//     console.log('✅ OTP request successful:', result);
//     return result;
//   } catch (error) {
//     console.error('❌ OTP request failed:', error.message);
//     throw error;
//   }
// };

// /**
//  * Admin: Verify OTP & Reset Password
//  */
// export const adminResetPassword = async (data) => {
//   const token = getToken();

//   if (!token) {
//     throw new Error('Authentication required. Please login first.');
//   }

//   if (!data?.userEmail || !data?.otp || !data?.newPassword) {
//     throw new Error('User email, OTP, and new password are required.');
//   }

//   console.log('🔄 Resetting password for:', data.userEmail);

//   try {
//     const result = await fetchWithTimeout(
//       `${API_BASE}/admin/reset-password`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       }
//     );

//     console.log('✅ Password reset successful:', result);
//     return result;
//   } catch (error) {
//     console.error('❌ Password reset failed:', error.message);
//     throw error;
//   }
// };

// Profile Picture Upload API
export const uploadProfilePicture = async (userId, formData) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HRM_API_URL}/upload-profile-picture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// Remove Profile Picture API
export const removeProfilePicture = async (userId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HRM_API_URL}/remove-profile-picture`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );
    return await response.json();
  } catch (error) {
    console.error("Error removing profile picture:", error);
    throw error;
  }
};

// ================== ATTENDANCE API FUNCTIONS ==================

// Clock In
const handleClockIn = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Please login first!");
      setLoading(false);
      return;
    }

    const API_BASE =
      process.env.NEXT_PUBLIC_HRM_API_URL ||
      "http://localhost:5000/api/v1";

    const response = await fetch(`${API_BASE}/attendance/clock-in`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-BD", {
          timeZone: "Asia/Dhaka",
          hour12: false,
        }),
      }),
    });

    const data = await response.json();
    console.log("Clock In Raw Response:", data);

    if (response.ok && data.status === "success") {
      await fetchSummary();
      alert("✅ Clock In successful!");
    } else {
      alert(`Clock In failed: ${data.message || `Status: ${response.status}`}`);
    }
  } catch (error) {
    console.error("Clock In fetch error:", error);
    alert("Network error. Please check your connection.");
  }
  setLoading(false);
};

// Clock Out
// export async function clockOut() {
//   try {
//     const res = await api.post("/attendance/clock-out");
//     return res.data;
//   } catch (err) {
//     console.error("Clock Out Error:", err.response?.data || err);
//     return {
//       status: "error",
//       message: err.response?.data?.message || "Failed to clock out"
//     };
//   }
// }

// Get Attendance Summary
// export async function getAttendanceSummary(userId, startDate, endDate) {
//   try {
//     const params = new URLSearchParams();
//     if (userId) params.append('userId', userId);
//     if (startDate) params.append('startDate', startDate);
//     if (endDate) params.append('endDate', endDate);

//  const res = await api.get(`/admin/attendance/summary?${params.toString()}`);
//     return res.data;
//   } catch (err) {
//     console.error("Attendance Summary Error:", err.response?.data || err);
//     return {
//       status: "error",
//       message: err.response?.data?.message || "Failed to fetch attendance summary"
//     };
//   }
// }

// Get All Attendance Records
// export async function getAllAttendance(userId, startDate, endDate) {
//   try {
//     const params = new URLSearchParams();
//     if (userId) params.append('userId', userId);
//     if (startDate) params.append('startDate', startDate);
//     if (endDate) params.append('endDate', endDate);

//     const res = await api.get(`/attendance/all?${params.toString()}`);
//     return res.data;
//   } catch (err) {
//     console.error("All Attendance Error:", err.response?.data || err);
//     return {
//       status: "error",
//       message: err.response?.data?.message || "Failed to fetch attendance records"
//     };
//   }
// }

// Correct Attendance (Admin)
// export async function correctAttendance(attendanceId, data) {
//   try {
//     const res = await api.put(`/attendance/admin-correct/${attendanceId}`, data);
//     return res.data;
//   } catch (err) {
//     console.error("Correct Attendance Error:", err.response?.data || err);
//     return {
//       status: "error",
//       message: err.response?.data?.message || "Failed to correct attendance"
//     };
//   }
// }

// Get Today's Attendance Status
// export async function getTodayAttendance() {
//   try {
//     const res = await api.get("/attendance/today");
//     return res.data;
//   } catch (err) {
//     console.error("Today's Attendance Error:", err.response?.data || err);
//     return {
//       status: "error",
//       message: err.response?.data?.message || "Failed to fetch today's attendance"
//     };
//   }
// }

// Get Monthly Attendance Report
// export async function getMonthlyAttendance(month, year) {
//   try {
//     const res = await api.get(`/attendance/monthly?month=${month}&year=${year}`);
//     return res.data;
//   } catch (err) {
//     console.error("Monthly Attendance Error:", err.response?.data || err);
//     return {
//       status: "error",
//       message: err.response?.data?.message || "Failed to fetch monthly attendance"
//     };
//   }
// }
// app/lib/api.js
// Fetch employees
export const fetchEmployees = async () => {
  try {
    const response = await fetchWithAuth("/reports/employees");
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    // Return sample data for demo if API fails
    return [
      {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        employeeId: "EMP001",
        department: "IT",
      },
      {
        _id: "2",
        firstName: "Jane",
        lastName: "Smith",
        employeeId: "EMP002",
        department: "HR",
      },
      {
        _id: "3",
        firstName: "Bob",
        lastName: "Johnson",
        employeeId: "EMP003",
        department: "Sales",
      },
    ];
  }
};

// Fetch departments
export const fetchDepartments = async () => {
  try {
    const response = await fetchWithAuth("/reports/departments");
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching departments:", error);
    return ["IT", "HR", "Sales", "Marketing", "Finance"];
  }
};

// Export report
export const exportReport = async (reportType, format, filters) => {
  try {
    const token = getToken();

    const endpoint = `/reports/${reportType}`;
    const acceptHeader =
      format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const response = await fetchWithAuth(endpoint, {
      method: "POST",
      headers: {
        Accept: acceptHeader,
      },
      body: JSON.stringify({ format, ...filters }),
    });

    if (format === "json") {
      return await response.json();
    }

    return await response.blob();
  } catch (error) {
    console.error("Export error:", error);

    // If it's a JSON error (like when expecting blob but got JSON)
    if (error.message.includes("Unexpected token")) {
      const response = await fetchWithAuth(`/reports/${reportType}`, {
        method: "POST",
        body: JSON.stringify({ format: "json", ...filters }),
      });
      return await response.json();
    }

    throw error;
  }
};
export const adminRequestOtp = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/admin/request-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: data.userEmail, // শুধু userEmail পাঠানো
      }),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const adminResetPassword = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/admin/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: data.userEmail,
        otp: data.otp,
        newPassword: data.newPassword,
      }),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};
// File: app/lib/api.js

// // ================= SHIFT MANAGEMENT APIs =================

// // Get all employee shifts (Admin only)
// export const getAllEmployeeShifts = async () => {
//   try {
//     const token = getToken();
//     if (!token) throw new Error('No authentication token found');

//     // ✅ সঠিক: /admin/employee-shifts (NOT /shift/admin/employee-shifts)
//     const response = await api.get('/admin/employee-shifts');
//     return response.data;
//   } catch (error) {
//     console.error('Get all employee shifts error:', error);
//     return { success: false, message: error.response?.data?.message || error.message };
//   }
// };

// // Assign shift to employee (Admin only) - PUT method
// export const assignShiftToEmployee = async (employeeId, shiftData) => {
//   try {
//     const token = getToken();
//     if (!token) throw new Error('No authentication token found');

//     // ✅ CORRECTED ENDPOINT
//     const response = await api.put(`/employee/${employeeId}/shift`, shiftData);
//     return response.data;
//   } catch (error) {
//     console.error('Assign shift error:', error);
//     return {
//       success: false,
//       message: error.response?.data?.message || error.message
//     };
//   }
// };

// // Reset employee shift to default (Admin only)
// export const resetEmployeeShift = async (employeeId, reason = '') => {
//   try {
//     const token = getToken();
//     if (!token) throw new Error('No authentication token found');

//     // ✅ সঠিক: POST /admin/reset-shift/:employeeId (NOT /shift/admin/reset-shift/:employeeId)
//     const response = await api.post(`/admin/reset-shift/${employeeId}`, { reason });
//     return response.data;
//   } catch (error) {
//     console.error('Reset shift error:', error);
//     return { success: false, message: error.response?.data?.message || error.message };
//   }
// };

// // Update default shift timing (Admin only)
// export const updateDefaultShift = async (startTime, endTime) => {
//   try {
//     const token = getToken();
//     if (!token) throw new Error('No authentication token found');

//     // ✅ সঠিক: PUT /admin/default-shift
//     const response = await api.put('/admin/default-shift', { startTime, endTime });
//     return response.data;
//   } catch (error) {
//     console.error('Update default shift error:', error);
//     return { success: false, message: error.response?.data?.message || error.message };
//   }
// };

// // Get employee shift history (Admin only)
// export const getEmployeeShiftHistory = async (employeeId) => {
//   try {
//     const token = getToken();
//     if (!token) throw new Error('No authentication token found');

//     // ✅ সঠিক: GET /admin/shift-history/:employeeId
//     const response = await api.get(`/admin/shift-history/${employeeId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Get shift history error:', error);
//     return { success: false, message: error.response?.data?.message || error.message };
//   }
// };

// // Bulk assign shifts (Admin only)
// export const bulkAssignShifts = async (employeeIds, shiftData) => {
//   try {
//     const token = getToken();
//     if (!token) throw new Error('No authentication token found');

//     // ✅ সঠিক: POST /admin/bulk-assign-shifts (NOT /shift/admin/bulk-assign-shifts)
//     const response = await api.post('/admin/bulk-assign-shifts', {
//       employeeIds,
//       ...shiftData
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Bulk assign shifts error:', error);
//     return { success: false, message: error.response?.data?.message || error.message };
//   }
// };

// // Get shift statistics (Admin only)
// export const getShiftStatistics = async () => {
//   try {
//     const token = getToken();
//     if (!token) throw new Error('No authentication token found');

//     // ✅ সঠিক: GET /admin/shift-statistics
//     const response = await api.get('/admin/shift-statistics');
//     return response.data;
//   } catch (error) {
//     console.error('Get shift statistics error:', error);
//     return { success: false, message: error.response?.data?.message || error.message };
//   }
// };

// // Get my shift (Employee)
// export const getMyShift = async () => {
//   try {
//     const token = getToken();
//     if (!token) throw new Error('No authentication token found');

//     // ✅ সঠিক: GET /my-shift (NOT /shift/my-shift)
//     const response = await api.get('/my-shift');
//     return response.data;
//   } catch (error) {
//     console.error('Get my shift error:', error);
//     return { success: false, message: error.response?.data?.message || error.message };
//   }
// };

// // Get specific employee's shift (Admin or Self)
// export const getEmployeeShift = async (employeeId) => {
//   try {
//     const token = getToken();
//     if (!token) throw new Error('No authentication token found');

//     // ✅ সঠিক: GET /employee/:employeeId/shift
//     const response = await api.get(`/employee/${employeeId}/shift`);
//     return response.data;
//   } catch (error) {
//     console.error('Get employee shift error:', error);
//     return { success: false, message: error.response?.data?.message || error.message };
//   }
// };

// Welcome Email পাঠানোর API
// app/lib/api.js - sendWelcomeEmail ফাংশন
export const sendWelcomeEmail = async (emailData) => {
  try {
    console.log("📧 [1] Starting sendWelcomeEmail...");

    // ✅ এই লাইনটি যোগ করুন
    const API_BASE_URL = API_BASE || "http://localhost:5000/api/v1";
    console.log("📧 Using API Base:", API_BASE_URL);

    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("adminToken");
    }

    // ✅ Headers
    const headers = {
      "Content-Type": "application/json",
    };

    if (token && token.trim() !== "") {
      headers["Authorization"] = `Bearer ${token.trim()}`;
    }

    // ✅ Correct endpoint
    const endpoint = `${API_BASE_URL}/send-welcome-email`;
    console.log("📧 [2] Making API call to:", endpoint);

    // ✅ 10 second timeout (30s খুব বেশি)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(emailData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("📧 [3] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("📧 API Error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ [4] Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ sendWelcomeEmail error:", error.name, error.message);

    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }

    throw error;
  }
};

export default api;
