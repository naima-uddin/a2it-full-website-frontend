// components/AttendanceReportPDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ফন্ট রেজিস্ট্রেশন
Font.register({
  family: "Helvetica",
  fonts: [
    { 
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2" 
    },
  ],
});

// ✅ Late/Early Calculation Function
const calculateLateEarlyMinutes = (clockInTime, shiftStart, recordStatus, lateThreshold = 10, earlyThreshold = 1) => {
  const nonWorkingStatuses = ['Absent', 'Leave', 'Govt Holiday', 'Weekly Off', 'Company Holiday', 'Holiday'];
  
  if (nonWorkingStatuses.includes(recordStatus)) {
    return {
      isLate: false,
      isEarly: false,
      minutes: 0,
      details: '',
      status: recordStatus
    };
  }
  
  if (!clockInTime || !shiftStart) return { 
    isLate: false, 
    isEarly: false, 
    minutes: 0, 
    details: 'N/A',
    status: 'Present'
  };

  try {
    const clockIn = new Date(clockInTime);
    const [shiftHour, shiftMinute] = shiftStart.split(':').map(Number);
    const clockInHour = clockIn.getHours();
    const clockInMinute = clockIn.getMinutes();
    
    const clockInTotalMinutes = clockInHour * 60 + clockInMinute;
    const shiftTotalMinutes = shiftHour * 60 + shiftMinute;
    const diffMinutes = clockInTotalMinutes - shiftTotalMinutes;
    
    // ✅ Case 1: EARLY
    if (diffMinutes < 0 && Math.abs(diffMinutes) >= earlyThreshold) {
      const earlyMinutes = Math.abs(diffMinutes);
      let details = '';
      
      if (earlyMinutes >= 60) {
        const hours = Math.floor(earlyMinutes / 60);
        const mins = earlyMinutes % 60;
        details = mins > 0 ? `${hours}h ${mins}m early` : `${hours}h early`;
      } else {
        details = `${earlyMinutes}m early`;
      }
      
      return { 
        isLate: false, 
        isEarly: true, 
        minutes: earlyMinutes, 
        details,
        status: `Present (Early)`
      };
    } 
    // ✅ Case 2: LATE
    else if (diffMinutes > lateThreshold) {
      const lateMinutes = diffMinutes - lateThreshold;
      let details = '';
      
      if (lateMinutes >= 60) {
        const hours = Math.floor(lateMinutes / 60);
        const mins = lateMinutes % 60;
        details = mins > 0 ? `${hours}h ${mins}m late` : `${hours}h late`;
      } else {
        details = `${lateMinutes}m late`;
      }
      
      return { 
        isLate: true, 
        isEarly: false, 
        minutes: lateMinutes, 
        details,
        status: `Present (Late)`
      };
    }
    // ✅ Case 3: ON TIME
    else {
      let details = '';
      
      if (diffMinutes === 0) {
        details = 'Exactly on time';
      } else if (diffMinutes > 0) {
        details = `${diffMinutes}m after shift start`;
      } else {
        details = `${Math.abs(diffMinutes)}m before shift start (On time)`;
      }
      
      return { 
        isLate: false, 
        isEarly: false, 
        minutes: Math.abs(diffMinutes), 
        details,
        status: `Present (On Time)`
      };
    }
  } catch (error) {
    return { 
      isLate: false, 
      isEarly: false, 
      minutes: 0, 
      details: 'Calculation error',
      status: 'Present'
    };
  }
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#667eea",
    borderBottomStyle: "solid",
  },
  
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  
  logoCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
  },
  
  logoText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
  },
  
  companyTagline: {
    fontSize: 8,
    color: "#718096",
    marginTop: 1,
  },
  
  reportInfo: {
    alignItems: "flex-end",
  },
  
  reportTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4C51BF",
    marginBottom: 4,
  },
  
  reportSubtitle: {
    fontSize: 9,
    color: "#718096",
  },
  
  reportDate: {
    fontSize: 8,
    color: "#4A5568",
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    marginTop: 4,
  },
  
  // Summary Section
  summarySection: {
    marginBottom: 15,
  },
  
  summaryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  
  // Summary Cards
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  
  summaryCard: {
    flex: 1,
    minWidth: "23%",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    minHeight: 50,
  },
  
  summaryLabel: {
    fontSize: 8,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 2,
  },
  
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  
  summarySubtext: {
    fontSize: 7,
    color: "#FFFFFF",
    opacity: 0.8,
    marginTop: 1,
  },
  
  // Filters
  filtersSection: {
    backgroundColor: "#F7FAFC",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  
  filtersTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#4A5568",
    marginBottom: 6,
  },
  
  filtersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  
  filterBadge: {
    fontSize: 7,
    color: "#4A5568",
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  
  // Table
  tableSection: {
    marginBottom: 20,
  },
  
  tableTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 8,
  },
  
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  
  // টেবিল হেডারে Name কলাম
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4C51BF",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  
  tableHeaderText: {
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  
  // Name কলামের হেডার একটু বড়
  nameHeader: {
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: "bold",
    flex: 1.4,
    textAlign: "center",
  },
  
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  
  tableRowEven: {
    backgroundColor: "#F7FAFC",
  },
  
  tableCell: {
    fontSize: 7,
    color: "#2D3748",
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 2,
  },
  
  // Name কলামের জন্য আলাদা স্টাইল
  nameCell: {
    fontSize: 7,
    color: "#2D3748",
    flex: 1.4,
    textAlign: "left",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  
  employeeName: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 2,
  },
  
  employeeId: {
    fontSize: 6.5,
    color: "#718096",
    fontStyle: "italic",
  },
  
  employeeDept: {
    fontSize: 6,
    color: "#4A5568",
  },
  
  statusBadge: {
    fontSize: 6.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  
  // Late/Early Badges
  lateEarlyBadge: {
    fontSize: 6.5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    textAlign: "center",
    marginTop: 2,
  },
  
  // Fixed badge styles with explicit colors
  lateBadge: {
    backgroundColor: "#FEFCBF",
    color: "#D69E2E",
  },
  
  earlyBadge: {
    backgroundColor: "#E9D8FD",
    color: "#805AD5",
  },
  
  onTimeBadge: {
    backgroundColor: "#C6F6D5",
    color: "#38A169",
  },
  
  detailsCell: {
    fontSize: 6.5,
    color: "#4A5568",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 1,
  },
  
  // Footer
  footer: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  footerText: {
    fontSize: 7,
    color: "#718096",
  },
  
  pageNumber: {
    fontSize: 7,
    color: "#4A5568",
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
});

const AttendanceReportPDF = ({ 
  attendance = [], 
  filters = {}, 
  dateRange = {}, 
  summary = {}, 
  userData = {}, 
  isAdmin = false,
  selectedEmployeeName = '',
  employeeDetails = {}
}) => {
    const sortedAttendance = [...attendance].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  // ✅ ফাংশনগুলো ডিফাইন করুন
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateString || "-";
    }
  };
  
  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return timeString || "-";
    }
  };
  
  // ✅ Status colors function - সব স্ট্যাটাসের জন্য কালার যোগ করা হলো
  const getStatusColor = (status) => {
    const colorMap = {
      'Present': '#38A169',
      'Present (On Time)': '#38A169',
      'Present (Late)': '#D69E2E',
      'Present (Early)': '#805AD5',
      'Absent': '#E53E3E',
      'Leave': '#3182CE',
      'Govt Holiday': '#6B46C1',
      'Weekly Off': '#4A5568',
      'Company Holiday': '#718096',
      'Holiday': '#6B46C1'
    };
    return colorMap[status] || '#4A5568';
  };
  
  const getStatusBgColor = (status) => {
    const bgMap = {
      'Present': '#C6F6D5',
      'Present (On Time)': '#C6F6D5',
      'Present (Late)': '#FEFCBF',
      'Present (Early)': '#E9D8FD',
      'Absent': '#FED7D7',
      'Leave': '#BEE3F8',
      'Govt Holiday': '#E9D8FD',
      'Weekly Off': '#E2E8F0',
      'Company Holiday': '#EDF2F7',
      'Holiday': '#E9D8FD'
    };
    return bgMap[status] || '#E2E8F0';
  };
  
  // ✅ Calculate statistics - সব স্ট্যাটাসের জন্য কাউন্ট যোগ করা হলো
  const presentCount = attendance.filter(a => 
    a.status === "Present" || 
    a.status === "Present (On Time)" || 
    a.status === "Present (Late)" || 
    a.status === "Present (Early)"
  ).length;
  
  const absentCount = attendance.filter(a => a.status === "Absent").length;
  const leaveCount = attendance.filter(a => a.status === "Leave").length;
  const govtHolidayCount = attendance.filter(a => a.status === "Govt Holiday" || a.status === "Holiday").length;
  const weeklyOffCount = attendance.filter(a => a.status === "Weekly Off").length;
  const offDayCount = attendance.filter(a => a.status === "Company Holiday").length;
  
  const lateEarlyStats = attendance.reduce((stats, record) => {
    const lateEarly = calculateLateEarlyMinutes(
      record.clockIn,
      record.shift?.start || "09:00",
      record.status,
      10,
      1
    );

    if (lateEarly.isLate) {
      stats.lateMinutes += lateEarly.minutes;
      stats.lateCount++;
    } else if (lateEarly.isEarly) {
      stats.earlyMinutes += lateEarly.minutes;
      stats.earlyCount++;
    } else if (lateEarly.status === 'Present (On Time)') {
      stats.onTimeCount++;
    }
    
    return stats;
  }, { lateCount: 0, lateMinutes: 0, earlyCount: 0, earlyMinutes: 0, onTimeCount: 0 });
  
  const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);
  const attendanceRate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;
  
  // ✅ Employee name extraction function
  const getEmployeeName = (record) => {
    if (record.employee && typeof record.employee === 'object') {
      if (record.employee.fullName) {
        return record.employee.fullName;
      }
      if (record.employee.name) {
        return record.employee.name;
      }
      if (record.employee.firstName && record.employee.lastName) {
        return `${record.employee.firstName} ${record.employee.lastName}`;
      }
      if (record.employee.firstName) {
        return record.employee.firstName;
      }
    }
    
    if (record.userId && employeeDetails[record.userId]) {
      const emp = employeeDetails[record.userId];
      if (emp.fullName) return emp.fullName;
      if (emp.name) return emp.name;
      if (emp.firstName && emp.lastName) return `${emp.firstName} ${emp.lastName}`;
      if (emp.firstName) return emp.firstName;
    }
    
    if (record.employeeId && employeeDetails[record.employeeId]) {
      const emp = employeeDetails[record.employeeId];
      if (emp.fullName) return emp.fullName;
      if (emp.name) return emp.name;
      if (emp.firstName && emp.lastName) return `${emp.firstName} ${emp.lastName}`;
      if (emp.firstName) return emp.firstName;
    }
    
    if (userData.fullName) {
      return userData.fullName;
    }
    if (userData.name) {
      return userData.name;
    }
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    if (userData.firstName) {
      return userData.firstName;
    }
    
    if (selectedEmployeeName && selectedEmployeeName !== "Employee") {
      return selectedEmployeeName;
    }
    
    return "Employee";
  };
  
  // ✅ Employee ID extraction function
  const getEmployeeId = (record) => {
    if (record.employee && typeof record.employee === 'object') {
      if (record.employee.employeeId) {
        return `ID: ${record.employee.employeeId}`;
      }
      if (record.employee._id) {
        return `ID: ${record.employee._id.substring(0, 8)}`;
      }
    }
    
    if (record.employeeId) {
      return `ID: ${record.employeeId}`;
    }
    
    if (record.userId && employeeDetails[record.userId]?.employeeId) {
      return `ID: ${employeeDetails[record.userId].employeeId}`;
    }
    
    if (userData.employeeId) {
      return `ID: ${userData.employeeId}`;
    }
    
    return "";
  };
  
  // ✅ Department extraction function
  const getEmployeeDepartment = (record) => {
    if (record.employee && typeof record.employee === 'object') {
      if (record.employee.department) {
        return record.employee.department;
      }
    }
    
    if (record.userId && employeeDetails[record.userId]?.department) {
      return employeeDetails[record.userId].department;
    }
    
    if (userData.department) {
      return userData.department;
    }
    
    return "";
  };
  
  // ✅ SUMMARY cards - সব স্ট্যাটাসের জন্য কার্ড যোগ করা হলো
  const summaryCards = [
    { 
      label: "Total Days", 
      value: attendance.length, 
      subtext: "in period", 
      color: "#4C51BF" 
    },
    { 
      label: "Present", 
      value: presentCount, 
      subtext: `${((presentCount/attendance.length)*100 || 0).toFixed(1)}%`, 
      color: "#38A169" 
    },
    { 
      label: "Absent", 
      value: absentCount, 
      subtext: `${((absentCount/attendance.length)*100 || 0).toFixed(1)}%`, 
      color: "#E53E3E" 
    },
         { 
      label: "Late", 
      value: lateEarlyStats.lateCount, 
      subtext: lateEarlyStats.lateCount > 0 ? `Avg: ${(lateEarlyStats.lateMinutes/lateEarlyStats.lateCount).toFixed(0)}m` : 'None', 
      color: "#D69E2E" 
    },
    { 
      label: "Early", 
      value: lateEarlyStats.earlyCount, 
      subtext: lateEarlyStats.earlyCount > 0 ? `Avg: ${(lateEarlyStats.earlyMinutes/lateEarlyStats.earlyCount).toFixed(0)}m` : 'None', 
      color: "#805AD5" 
    },
    { 
      label: "On Time", 
      value: lateEarlyStats.onTimeCount, 
      subtext: `${((lateEarlyStats.onTimeCount/attendance.length)*100 || 0).toFixed(1)}%`, 
      color: "#319795" 
    },
    { 
      label: "Leave", 
      value: leaveCount, 
      subtext: `${((leaveCount/attendance.length)*100 || 0).toFixed(1)}%`, 
      color: "#3182CE" 
    },
    { 
      label: "Weekly Off", 
      value: weeklyOffCount, 
      subtext: `${((weeklyOffCount/attendance.length)*100 || 0).toFixed(1)}%`, 
      color: "#4A5568" 
    },
    { 
      label: "Govt Holiday", 
      value: govtHolidayCount, 
      subtext: `${((govtHolidayCount/attendance.length)*100 || 0).toFixed(1)}%`, 
      color: "#6B46C1" 
    },
    { 
      label: "Company Holiday", 
      value: offDayCount, 
      subtext: `${((offDayCount/attendance.length)*100 || 0).toFixed(1)}%`, 
      color: "#718096" 
    },
    { 
      label: "Total Hrs", 
      value: totalHours.toFixed(1), 
      subtext: "hours worked", 
      color: "#3182CE" 
    },
    { 
      label: "Rate", 
      value: attendanceRate.toFixed(1) + "%", 
      subtext: "attendance %", 
      color: "#6B46C1" 
    },
  ];
  
  // ✅ Filter badges
  const filterBadges = [];
  if (dateRange.startDate && dateRange.endDate) {
    filterBadges.push(`${formatDate(dateRange.startDate)} to ${formatDate(dateRange.endDate)}`);
  }
  if (filters?.status && filters.status !== 'all') {
    filterBadges.push(`Status: ${filters.status}`);
  }
  if (filters?.employeeId && selectedEmployeeName && selectedEmployeeName !== "Employee") {
    filterBadges.push(`Employee: ${selectedEmployeeName}`);
  }
  if (filters?.search) {
    filterBadges.push(`Search: "${filters.search}"`);
  }
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>A2</Text>
            </View>
            <View>
              <Text style={styles.companyName}>A2IT HRM</Text>
              <Text style={styles.companyTagline}>Attendance Management System</Text>
            </View>
          </View>
          
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>Attendance Report</Text>
            <Text style={styles.reportSubtitle}>
              {isAdmin ? 'Admin Report' : 'Employee Report'}
            </Text>
            <Text style={styles.reportDate}>
              {new Date().toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </View>
        
        {/* Employee Information - যদি শুধু একজন এমপ্লয়ির রিপোর্ট হয় */}
        {!isAdmin && userData.name && (
          <View style={[styles.filtersSection, { backgroundColor: '#EBF4FF', borderLeftWidth: 4, borderLeftColor: '#4299E1' }]}>
            <Text style={[styles.filtersTitle, { color: '#2B6CB0' }]}>
              Employee Information
            </Text>
            <View style={styles.filtersGrid}>
              <Text style={[styles.filterBadge, { backgroundColor: '#BEE3F8', color: '#2C5282' }]}>
                Name: {userData.fullName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()}
              </Text>
              {userData.employeeId && (
                <Text style={[styles.filterBadge, { backgroundColor: '#C6F6D5', color: '#22543D' }]}>
                  ID: {userData.employeeId}
                </Text>
              )}
              {userData.department && (
                <Text style={[styles.filterBadge, { backgroundColor: '#E9D8FD', color: '#553C9A' }]}>
                  Department: {userData.department}
                </Text>
              )}
              <Text style={[styles.filterBadge, { backgroundColor: '#FED7D7', color: '#9B2C2C' }]}>
                Report Period: {formatDate(dateRange.startDate)} to {formatDate(dateRange.endDate)}
              </Text>
            </View>
          </View>
        )}
        
        {/* Summary Section - এখন সব স্ট্যাটাস দেখাবে */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Attendance Summary</Text>
          <View style={styles.summaryGrid}>
            {summaryCards.map((card, index) => (
              <View 
                key={index} 
                style={[
                  styles.summaryCard, 
                  { backgroundColor: card.color }
                ]}
              >
                <Text style={styles.summaryLabel}>{card.label}</Text>
                <Text style={styles.summaryValue}>{card.value}</Text>
                <Text style={styles.summarySubtext}>{card.subtext}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Active Filters */}
        {filterBadges.length > 0 && (
          <View style={styles.filtersSection}>
            <Text style={styles.filtersTitle}>Active Filters</Text>
            <View style={styles.filtersGrid}>
              {filterBadges.map((badge, index) => (
                <Text key={index} style={styles.filterBadge}>{badge}</Text>
              ))}
            </View>
          </View>
        )}
        
        {/* Attendance Table */}
        <View style={styles.tableSection}>
          <Text style={styles.tableTitle}>Attendance Details</Text>
          <View style={styles.table}>
            {/* Table Header - Name কলাম সহ */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.nameHeader}>Name</Text>
              <Text style={styles.tableHeaderText}>Shift</Text>
              <Text style={styles.tableHeaderText}>Clock In</Text>
              <Text style={styles.tableHeaderText}>Clock Out</Text>
              <Text style={styles.tableHeaderText}>Status</Text>
              <Text style={styles.tableHeaderText}>Punctuality</Text>
              <Text style={styles.tableHeaderText}>Hours</Text>
            </View>
            
            {/* Table Rows */}
            {sortedAttendance.map((record, index) => {
              const date = new Date(record.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const isEvenRow = index % 2 === 0;
              
              // Calculate Late/Early (শুধু Present স্ট্যাটাসের জন্য)
              const lateEarly = calculateLateEarlyMinutes(
                record.clockIn,
                record.shift?.start || "09:00",
                record.status,
                10,
                1
              );
              
              // Get status display
              const displayStatus = lateEarly.status;
              const statusColor = getStatusColor(displayStatus);
              const statusBgColor = getStatusBgColor(displayStatus);
              
              // Determine punctuality badge (শুধু Present স্ট্যাটাসের জন্য)
              let punctualityBadge = null;
              let punctualityText = "";
              
              if (lateEarly.isLate) {
                punctualityBadge = styles.lateBadge;
                punctualityText = "LATE";
              } else if (lateEarly.isEarly) {
                punctualityBadge = styles.earlyBadge;
                punctualityText = "EARLY";
              } else if (lateEarly.status === 'Present (On Time)') {
                punctualityBadge = styles.onTimeBadge;
                punctualityText = "ON TIME";
              }
              
              // ✅ Get employee details
              const employeeName = getEmployeeName(record);
              const employeeId = getEmployeeId(record);
              const employeeDept = getEmployeeDepartment(record);
              
              return (
                <View 
                  key={record._id || index} 
                  style={[
                    styles.tableRow,
                    isEvenRow && styles.tableRowEven
                  ]}
                >
                  {/* Date */}
                  <View style={styles.tableCell}>
                    <Text>{formatDate(record.date)}</Text>
                    <Text style={{ fontSize: 6.5, color: '#718096' }}>{dayName}</Text>
                    {(record.autoGenerated || record.markedAbsent) && (
                      <Text style={{ fontSize: 6, color: '#718096', fontStyle: 'italic', marginTop: 1 }}>
                        {record.autoGenerated ? 'Auto' : ''}
                        {record.markedAbsent ? 'Auto-absent' : ''}
                      </Text>
                    )}
                  </View>
                  
                  {/* Name Column */}
                  <View style={styles.nameCell}>
                    <Text style={styles.employeeName}>
                      {employeeName}
                    </Text>
                    {employeeId && (
                      <Text style={styles.employeeId}>
                        {employeeId}
                      </Text>
                    )}
                    {employeeDept && (
                      <Text style={styles.employeeDept}>
                        {employeeDept}
                      </Text>
                    )}
                  </View>
                  
                  {/* Shift Time */}
                  <Text style={styles.tableCell}>
                    {record.shift?.start || "09:00"} - {record.shift?.end || "18:00"}
                  </Text>
                  
                  {/* Clock In - Non-working days এ "-" দেখাবে */}
                  <View style={styles.tableCell}>
                    <Text>
                      {record.clockIn ? formatTime(record.clockIn) : 
                       ['Absent', 'Leave', 'Govt Holiday', 'Weekly Off', 'Company Holiday'].includes(record.status) ? '-' : '-'}
                    </Text>
                    {lateEarly.isLate && record.clockIn && (
                      <Text style={[styles.lateEarlyBadge, styles.lateBadge]}>
                        {lateEarly.details}
                      </Text>
                    )}
                    {lateEarly.isEarly && record.clockIn && (
                      <Text style={[styles.lateEarlyBadge, styles.earlyBadge]}>
                        {lateEarly.details}
                      </Text>
                    )}
                  </View>
                  
                  {/* Clock Out - Non-working days এ "-" দেখাবে */}
                  <View style={styles.tableCell}>
                    <Text>
                      {record.clockOut ? formatTime(record.clockOut) : 
                       ['Absent', 'Leave', 'Govt Holiday', 'Weekly Off', 'Company Holiday'].includes(record.status) ? '-' : '-'}
                    </Text>
                    {record.autoClockOut && (
                      <Text style={{ fontSize: 6, color: '#D69E2E', fontStyle: 'italic', marginTop: 1 }}>
                        Auto
                      </Text>
                    )}
                  </View>
                  
                  {/* Status */}
                  <View style={styles.tableCell}>
                    <Text 
                      style={[
                        styles.statusBadge,
                        { 
                          color: statusColor,
                          backgroundColor: statusBgColor
                        }
                      ]}
                    >
                      {displayStatus}
                    </Text>
                  </View>
                  
                  {/* Punctuality - শুধু Present স্ট্যাটাসের জন্য দেখাবে */}
                  <View style={styles.tableCell}>
                    {punctualityBadge ? (
                      <>
                        <Text style={[styles.lateEarlyBadge, punctualityBadge]}>
                          {punctualityText}
                        </Text>
                        <Text style={styles.detailsCell}>
                          {lateEarly.details}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.detailsCell}>
                        {['Govt Holiday', 'Weekly Off', 'Company Holiday', 'Leave'].includes(record.status) ? '-' : ''}
                      </Text>
                    )}
                  </View>
                  
                  {/* Hours - Non-working days এ "0.0" দেখাবে */}
                  <View style={styles.tableCell}>
                    <Text style={{ fontWeight: 'bold', fontSize: 8 }}>
                      {record.totalHours?.toFixed(1) || "0.0"}
                    </Text>
                    <Text style={{ fontSize: 6.5, color: '#718096' }}>
                      hours
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            A2IT HRM • Attendance Management System • Generated on {new Date().toLocaleDateString()}
          </Text>
          {/* <Text style={styles.pageNumber}>
            Page 1
          </Text> */}
        </View>
      </Page>
    </Document>
  );
};

export default AttendanceReportPDF;