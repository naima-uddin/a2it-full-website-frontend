// components/PayrollFullPDF.js
// Two-page (front & back) payroll PDF for a single employee.
//   Front page → full month attendance (day-by-day)
//   Back page  → this month's payroll "as of today" (day 1 → today) breakdown
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 28, fontFamily: "Helvetica", fontSize: 9, color: "#111" },

  // Header
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#113F67",
    paddingBottom: 8,
    marginBottom: 12,
  },
  company: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#113F67" },
  sub: { fontSize: 9, color: "#666", marginTop: 2 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "flex-end",
  },
  pageTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#113F67" },
  meta: { fontSize: 8, color: "#666", textAlign: "right" },

  // Employee band
  empBand: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#f3f6fa",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  empCell: { width: "50%", flexDirection: "row", marginBottom: 3 },
  empLabel: { width: 70, color: "#555", fontFamily: "Helvetica-Bold" },
  empVal: { flex: 1 },

  // Generic table
  table: { borderWidth: 1, borderColor: "#dfe3e8", marginTop: 4 },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eceff2",
    minHeight: 16,
  },
  th: {
    backgroundColor: "#113F67",
    color: "#fff",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  cell: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: "#eceff2",
  },
  cellLast: { borderRightWidth: 0 },

  // Attendance columns (compact — one line per day so the month fits one page)
  cDate: { width: "20%" },
  cShift: { width: "16%" },
  cIn: { width: "18%" },
  cOut: { width: "16%" },
  cStatus: { width: "18%" },
  cHours: { width: "12%" },

  // Sub text inside cells
  subText: { fontSize: 6, color: "#8a5a00", marginTop: 1 },
  subMuted: { fontSize: 6, color: "#999", marginTop: 1 },

  // Status / punctuality pills
  pill: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 1.5,
    paddingHorizontal: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  pillPresent: { backgroundColor: "#d6f5df", color: "#1b7a3d" },
  pillLate: { backgroundColor: "#fdf1c9", color: "#8a6d00" },
  pillAbsent: { backgroundColor: "#fcdada", color: "#b3261e" },
  pillLeave: { backgroundColor: "#dbe8fc", color: "#1e4fa3" },
  pillOff: { backgroundColor: "#eceff2", color: "#555" },

  // Summary — single row (no boxes)
  summaryLine: {
    flexDirection: "row",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#dfe3e8",
    borderRadius: 4,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: "#eceff2",
  },
  summaryVal: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#113F67" },
  summaryLbl: {
    fontSize: 6.5,
    color: "#777",
    marginTop: 2,
    textTransform: "uppercase",
  },

  // Payroll rows
  payRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eceff2",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  payLabel: { color: "#333" },
  paySub: { fontSize: 7, color: "#999", marginTop: 1 },
  payVal: { fontFamily: "Helvetica-Bold" },
  sectionHead: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#113F67",
    marginTop: 12,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f1f4f8",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: "#c9d3df",
  },
  net: {
    marginTop: 14,
    backgroundColor: "#113F67",
    borderRadius: 6,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  netLabel: { color: "#cdd9e8", fontSize: 9, textTransform: "uppercase" },
  netVal: { color: "#fff", fontSize: 20, fontFamily: "Helvetica-Bold" },

  badge: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "#fbe6c2",
    color: "#8a5a00",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },

  footer: {
    position: "absolute",
    bottom: 18,
    left: 28,
    right: 28,
    textAlign: "center",
    fontSize: 7,
    color: "#999",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 6,
  },
});

// Round money UP to a whole number (e.g. 20,709.25 → 20,710); ignore FP noise.
const ceilAmount = (n) => {
  const v = Number(n) || 0;
  return v - Math.floor(v) > 1e-6 ? Math.ceil(v) : Math.round(v);
};
const money = (n) =>
  "BDT " + new Intl.NumberFormat("en-BD").format(ceilAmount(n));
const fmtDate = (d) => {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return "-";
  }
};
const fmtTime = (d) => {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "-";
  }
};

const statusPill = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("absent")) return styles.pillAbsent;
  if (s.includes("leave")) return styles.pillLeave;
  if (s.includes("off") || s.includes("holiday") || s.includes("weekly"))
    return styles.pillOff;
  if (s.includes("late")) return styles.pillLate;
  return styles.pillPresent;
};

// Human status label like the on-screen table ("Present (Late)")
const statusLabel = (d) => {
  const s = d.status || "-";
  const presentish = /present|early|clocked/i.test(s);
  if (d.isLate && (presentish || /late/i.test(s))) return "Present (Late)";
  return s;
};

const EmployeeBand = ({ e, monthLabel }) => (
  <View style={styles.empBand}>
    <View style={styles.empCell}>
      <Text style={styles.empLabel}>Name</Text>
      <Text style={styles.empVal}>{e.name || "-"}</Text>
    </View>
    <View style={styles.empCell}>
      <Text style={styles.empLabel}>Emp ID</Text>
      <Text style={styles.empVal}>{e.employeeId || "-"}</Text>
    </View>
    <View style={styles.empCell}>
      <Text style={styles.empLabel}>Department</Text>
      <Text style={styles.empVal}>{e.department || "-"}</Text>
    </View>
    <View style={styles.empCell}>
      <Text style={styles.empLabel}>Designation</Text>
      <Text style={styles.empVal}>{e.designation || "-"}</Text>
    </View>
    <View style={styles.empCell}>
      <Text style={styles.empLabel}>Period</Text>
      <Text style={styles.empVal}>{monthLabel}</Text>
    </View>
  </View>
);

const Header = ({ title, meta, company }) => (
  <View style={styles.header}>
    <Text style={styles.company}>{company?.name || "A2IT Limited"}</Text>
    <Text style={styles.sub}>{company?.tagline || "Marketing agency"}</Text>
    <View style={styles.titleRow}>
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.meta}>{meta}</Text>
    </View>
  </View>
);

const PayrollFullPDF = ({ data }) => {
  const {
    company,
    labels = {},
    employee,
    monthLabel,
    asOfLabel,
    isPartialMonth,
    attendance,
    payroll,
  } = data;
  const days = attendance.days || [];
  const s = attendance.summary || {};
  const generated = new Date().toLocaleString("en-GB");

  const ded = payroll.deductions || {};
  const customEarnings = payroll.customEarnings || [];
  const customDeductions = payroll.customDeductions || [];
  // Row-label override helper: L("late", "Late (3 lates = 1 day)")
  const L = (key, fallback) =>
    labels[key] && String(labels[key]).trim() !== "" ? labels[key] : fallback;

  return (
    <Document
      title={`Payroll & Attendance — ${employee?.name || ""} — ${monthLabel}`}
    >
      {/* ───────────── FRONT: FULL MONTH ATTENDANCE ───────────── */}
      <Page size="A4" style={styles.page}>
        <Header
          title={L("sheetTitle", "MONTHLY ATTENDANCE & PAYROLL SHEET")}
          meta={`Generated: ${generated}`}
          company={company}
        />
        <EmployeeBand e={employee} monthLabel={monthLabel} />

        {/* Summary at the top (like the monthly summary report) */}
        <Text style={styles.sectionHead}>Attendance Summary — {monthLabel}</Text>
        {(() => {
          const items = [
            { l: "Working", v: s.totalWorkingDays ?? "-" },
            { l: "Present", v: s.presentDays ?? "-" },
            { l: "Absent", v: s.absentDays ?? "-" },
            { l: "Late", v: s.lateDays ?? "-" },
            { l: "Leave", v: s.leaveDays ?? "-" },
            { l: "Half", v: s.halfDays ?? "-" },
            { l: "Weekly Off", v: s.weeklyOffs ?? "-" },
            { l: "Holiday", v: s.holidays ?? "-" },
          ];
          return (
            <View style={styles.summaryLine}>
              {items.map((c, i) => (
                <View
                  key={i}
                  style={[
                    styles.summaryItem,
                    i === items.length - 1 ? { borderRightWidth: 0 } : {},
                  ]}
                >
                  <Text style={styles.summaryVal}>{c.v}</Text>
                  <Text style={styles.summaryLbl}>{c.l}</Text>
                </View>
              ))}
            </View>
          );
        })()}

        <Text style={styles.sectionHead}>Attendance Details — {monthLabel}</Text>
        <View style={styles.table}>
          <View style={[styles.tr, styles.th]}>
            <Text style={[styles.cell, styles.cDate]}>Date</Text>
            <Text style={[styles.cell, styles.cShift]}>Shift</Text>
            <Text style={[styles.cell, styles.cIn]}>Clock In</Text>
            <Text style={[styles.cell, styles.cOut]}>Clock Out</Text>
            <Text style={[styles.cell, styles.cStatus]}>Status</Text>
            <Text style={[styles.cell, styles.cHours, styles.cellLast]}>
              Hours
            </Text>
          </View>
          {days.length === 0 ? (
            <View style={styles.tr}>
              <Text style={[styles.cell, { width: "100%" }, styles.cellLast]}>
                No attendance records for this month.
              </Text>
            </View>
          ) : (
            days.map((d, i) => (
              <View key={i} style={styles.tr} wrap={false}>
                <Text style={[styles.cell, styles.cDate]}>
                  {fmtDate(d.date)} {d.dayName || ""}
                </Text>
                <Text style={[styles.cell, styles.cShift]}>
                  {d.shift || "-"}
                </Text>
                <View style={[styles.cell, styles.cIn]}>
                  <Text>{fmtTime(d.clockIn)}</Text>
                  {d.isLate && d.lateMinutes > 0 ? (
                    <Text style={styles.subText}>{d.lateMinutes}m late</Text>
                  ) : null}
                </View>
                <Text style={[styles.cell, styles.cOut]}>
                  {fmtTime(d.clockOut)}
                </Text>
                <View style={[styles.cell, styles.cStatus]}>
                  <Text style={[styles.pill, statusPill(statusLabel(d))]}>
                    {statusLabel(d)}
                  </Text>
                </View>
                <Text style={[styles.cell, styles.cHours, styles.cellLast]}>
                  {Number(d.totalHours || 0).toFixed(1)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Payroll calculation continues on the SAME page — fills the space
            below the attendance table instead of forcing a new page. */}
        <View
          style={{
            marginTop: 14,
            borderTopWidth: 2,
            borderTopColor: "#113F67",
          }}
        />
        <Text style={[styles.sectionHead, { fontSize: 11, marginTop: 8 }]}>
          Salary Calculation{isPartialMonth ? " — as of today" : ""}
        </Text>
        {isPartialMonth && <Text style={styles.badge}>{asOfLabel}</Text>}

        <Text style={styles.sectionHead}>{L("salaryBasis", "Salary Basis")}</Text>
        <View style={styles.table}>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>{L("monthlySalary", "Monthly Salary")}</Text>
            <Text style={styles.payVal}>{money(payroll.monthlySalary)}</Text>
          </View>
          <View style={styles.payRow}>
            <View>
              <Text style={styles.payLabel}>{L("dailyRate", "Daily Rate")}</Text>
              <Text style={styles.paySub}>
                {money(payroll.monthlySalary)} ÷ {payroll.totalWorkingDays}{" "}
                working days
              </Text>
            </View>
            <Text style={styles.payVal}>{money(payroll.dailyRate)}</Text>
          </View>
        </View>

        <Text style={styles.sectionHead}>{L("earnings", "Earnings")}</Text>
        <View style={styles.table}>
          <View style={styles.payRow}>
            <View>
              <Text style={styles.payLabel}>
                {L("basicPay", "Basic Pay")}{" "}
                {isPartialMonth ? "(earned so far)" : ""}
              </Text>
              {isPartialMonth && (
                <Text style={styles.paySub}>
                  {money(payroll.dailyRate)} × {payroll.presentDays} present
                  day(s)
                </Text>
              )}
            </View>
            <Text style={styles.payVal}>{money(payroll.basicPay)}</Text>
          </View>
          {payroll.overtime > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{L("overtime", "Overtime")}</Text>
              <Text style={styles.payVal}>{money(payroll.overtime)}</Text>
            </View>
          )}
          {payroll.bonus > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{L("bonus", "Bonus")}</Text>
              <Text style={styles.payVal}>{money(payroll.bonus)}</Text>
            </View>
          )}
          {payroll.allowance > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{L("allowance", "Allowance")}</Text>
              <Text style={styles.payVal}>{money(payroll.allowance)}</Text>
            </View>
          )}
          {customEarnings.map((it, i) => (
            <View style={styles.payRow} key={`ce-${i}`} wrap={false}>
              <Text style={styles.payLabel}>{it.label || "Earning"}</Text>
              <Text style={styles.payVal}>{money(it.amount)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHead}>{L("deductions", "Deductions")}</Text>
        <View style={styles.table}>
          {ded.absent > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{L("absent", "Absent")}</Text>
              <Text style={styles.payVal}>- {money(ded.absent)}</Text>
            </View>
          )}
          {ded.late > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{L("late", "Late (3 lates = 1 day)")}</Text>
              <Text style={styles.payVal}>- {money(ded.late)}</Text>
            </View>
          )}
          {ded.leave > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{L("leave", "Unpaid Leave")}</Text>
              <Text style={styles.payVal}>- {money(ded.leave)}</Text>
            </View>
          )}
          {ded.halfDay > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{L("halfDay", "Half Day")}</Text>
              <Text style={styles.payVal}>- {money(ded.halfDay)}</Text>
            </View>
          )}
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>{L("utilityBill", "Utility Bill (Khala Bill)")}</Text>
            <Text style={styles.payVal}>- {money(payroll.utilityBill)}</Text>
          </View>
          {ded.meal > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>{L("meal", "Meal Deduction")}</Text>
              <Text style={styles.payVal}>- {money(ded.meal)}</Text>
            </View>
          )}
          {customDeductions.map((it, i) => (
            <View style={styles.payRow} key={`cd-${i}`} wrap={false}>
              <Text style={styles.payLabel}>{it.label || "Deduction"}</Text>
              <Text style={styles.payVal}>- {money(it.amount)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.payVal}>{L("totalDeductions", "Total Deductions")}</Text>
            <Text style={styles.payVal}>
              - {money(payroll.totalDeductions)}
            </Text>
          </View>
        </View>

        <View style={styles.net}>
          <View>
            <Text style={styles.netLabel}>
              {L("netPayable", "Net Payable")}{" "}
              {isPartialMonth ? "(as of today)" : ""}
            </Text>
          </View>
          <Text style={styles.netVal}>{money(payroll.netPayable)}</Text>
        </View>

        <Text style={styles.footer} fixed>
          Computer-generated attendance & salary slip • No signature required •
          A2IT HRM
        </Text>
      </Page>
    </Document>
  );
};

async function buildBlob(data) {
  const { pdf } = await import("@react-pdf/renderer");
  return pdf(<PayrollFullPDF data={data} />).toBlob();
}

// Generate + trigger download
export async function downloadPayrollFullPDF(data) {
  const blob = await buildBlob(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeId = (data.employee?.employeeId || "employee").replace(/\s+/g, "_");
  link.href = url;
  link.download = `Payroll_${safeId}_${data.monthLabel?.replace(/\s+/g, "_") || ""}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate + open the print dialog (via a hidden iframe)
export async function printPayrollFullPDF(data) {
  const blob = await buildBlob(data);
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      // Fallback: open in a new tab so the user can print manually
      window.open(url, "_blank");
    }
    // Clean up after the print dialog has had time to open
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
    }, 60000);
  };
}

export default PayrollFullPDF;
