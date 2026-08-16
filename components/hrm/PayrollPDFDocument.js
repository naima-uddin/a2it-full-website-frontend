// @/components/PayrollPDFDocument.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.3,
  },
  
  // Header Section
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  systemName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  documentInfo: {
    fontSize: 9,
    color: '#666',
    textAlign: 'right',
  },
  
  // Employee Information
  employeeSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  employeeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  employeeRow: {
    flexDirection: 'row',
    marginBottom: 6,
    width: '100%',
  },
  employeeLabel: {
    width: '40%',
    fontWeight: 'bold',
    color: '#555',
  },
  employeeValue: {
    width: '60%',
  },
  
  // Basic Info Table
  infoTable: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    minHeight: 25,
  },
  infoTableHeader: {
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold',
  },
  infoTableCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  infoTableCellLast: {
    borderRightWidth: 0,
  },
  
  // Earnings & Deductions Sections
  amountSection: {
    marginBottom: 15,
  },
  amountTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
  },
  amountRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    minHeight: 25,
  },
  amountDescription: {
    width: '70%',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  amountValue: {
    width: '30%',
    padding: 5,
  },
  totalRow: {
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold',
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  
  // Net Payable Section
  netPayableSection: {
    marginTop: 20,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#e8f4fd',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#b6d4fe',
  },
  netPayableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004085',
    marginBottom: 5,
    textAlign: 'center',
  },
  netPayableAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004085',
    textAlign: 'center',
    marginBottom: 5,
  },
  
  // Special Notes
  notesSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  notesList: {
    paddingLeft: 15,
  },
  noteItem: {
    marginBottom: 3,
  },
  
  // Status Section
  statusSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#d4edda',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  statusTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 5,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusItem: {
    width: '33%',
    marginBottom: 5,
  },
  statusLabel: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 9,
  },
  statusValue: {
    color: '#155724',
    fontWeight: 'bold',
  },
  
  // Footer
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

// Helper function
const formatCurrency = (amount) => {
  // Round money UP to a whole number (e.g. 20,709.25 → 20,710); ignore FP noise.
  const v = Number(amount) || 0;
  const whole = v - Math.floor(v) > 1e-6 ? Math.ceil(v) : Math.round(v);
  return new Intl.NumberFormat('en-BD').format(whole);
};

// Main PDF Component
const PayrollPDF = ({ payroll }) => {
  // Calculate daily rate
  const dailyRate = Math.round((payroll.earnings?.basicPay || 0) / 23);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>A2IT Limited</Text>
          <Text style={styles.systemName}>Payroll System</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>PAYROLL SLIP</Text>
            <View>
              <Text style={styles.documentInfo}>
                Generated: {formatDate(new Date())}
              </Text>
              <Text style={styles.documentInfo}>
                Payroll ID: {payroll.payrollId?.slice(-12)}
              </Text>
            </View>
          </View>
        </View>

        {/* Employee Information */}
        <View style={styles.employeeSection}>
          <Text style={styles.sectionTitle}>EMPLOYEE INFORMATION</Text>
          
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Name:</Text>
            <Text style={styles.employeeValue}>{payroll.employee?.name || 'N/A'}</Text>
          </View>
          
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Employee ID:</Text>
            <Text style={styles.employeeValue}>{payroll.employee?.employeeId || 'N/A'}</Text>
          </View>
          
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Department:</Text>
            <Text style={styles.employeeValue}>{payroll.employee?.department || 'N/A'}</Text>
          </View>
          
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Designation:</Text>
            <Text style={styles.employeeValue}>{payroll.employee?.designation || 'N/A'}</Text>
          </View>
          
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Period:</Text>
            <Text style={styles.employeeValue}>{payroll.period?.formattedPeriod || 'N/A'}</Text>
          </View>
          
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Payment Date:</Text>
            <Text style={styles.employeeValue}>{formatDate(payroll.paymentDate)}</Text>
          </View>
        </View>

        {/* Basic Information Table */}
        <View style={styles.infoTable}>
          <View style={[styles.infoTableRow, styles.infoTableHeader]}>
            <Text style={styles.infoTableCell}>Description</Text>
            <Text style={styles.infoTableCell}>Amount (BDT)</Text>
            <Text style={[styles.infoTableCell, styles.infoTableCellLast]}>Notes</Text>
          </View>
          
          <View style={styles.infoTableRow}>
            <Text style={styles.infoTableCell}>Basic Salary</Text>
            <Text style={styles.infoTableCell}>BDT {formatCurrency(payroll.earnings?.basicPay || 0)}</Text>
            <Text style={[styles.infoTableCell, styles.infoTableCellLast]}>Monthly</Text>
          </View>
          
          <View style={styles.infoTableRow}>
            <Text style={styles.infoTableCell}>Daily Rate</Text>
            <Text style={styles.infoTableCell}>BDT {formatCurrency(dailyRate)}</Text>
            <Text style={[styles.infoTableCell, styles.infoTableCellLast]}>Based on 23 days</Text>
          </View>
          
          <View style={styles.infoTableRow}>
            <Text style={styles.infoTableCell}>Present Days</Text>
            <Text style={styles.infoTableCell}>
              {payroll.attendance?.presentDays || 0}/{payroll.attendance?.totalDays || 23}
            </Text>
            <Text style={[styles.infoTableCell, styles.infoTableCellLast]}>
              {payroll.attendance?.attendancePercentage || 0}% attendance
            </Text>
          </View>
        </View>

        {/* Earnings Section */}
        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>EARNINGS</Text>
          <View style={styles.amountTable}>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountDescription}>Basic Pay</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.earnings?.basicPay || 0)}</Text>
            </View>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountDescription}>Overtime</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.earnings?.overtime || 0)}</Text>
            </View>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountDescription}>Bonus</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.earnings?.bonus || 0)}</Text>
            </View>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountDescription}>Allowance</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.earnings?.allowance || 0)}</Text>
            </View>
            
            {payroll.onsiteBenefits?.teaAllowance > 0 && (
              <View style={styles.amountRow}>
                <Text style={styles.amountDescription}>Onsite Tea Allowance</Text>
                <Text style={styles.amountValue}>BDT {formatCurrency(payroll.onsiteBenefits.teaAllowance)}</Text>
              </View>
            )}
            
            <View style={[styles.amountRow, styles.totalRow]}>
              <Text style={styles.amountDescription}>Total Earnings:</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.summary?.grossEarnings || 0)}</Text>
            </View>
          </View>
        </View>

        {/* Deductions Section */}
        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>DEDUCTIONS</Text>
          <View style={styles.amountTable}>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountDescription}>Late Deduction</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.deductions?.late || 0)}</Text>
            </View>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountDescription}>Absent Deduction</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.deductions?.absent || 0)}</Text>
            </View>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountDescription}>Leave Deduction</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.deductions?.leave || 0)}</Text>
            </View>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountDescription}>Half Day Deduction</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.deductions?.halfDay || 0)}</Text>
            </View>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountDescription}>Allowance Adjustment</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.deductions?.allowanceDeduction || 0)}</Text>
            </View>
            
            {payroll.mealDeduction?.amount > 0 && (
              <View style={styles.amountRow}>
                <Text style={styles.amountDescription}>
                  Meal Deduction ({payroll.mealDeduction.type || 'monthly_subscription'})
                </Text>
                <Text style={styles.amountValue}>BDT {formatCurrency(payroll.mealDeduction.amount)}</Text>
              </View>
            )}
            
            {payroll.onsiteBenefits?.serviceCharge > 0 && (
              <View style={styles.amountRow}>
                <Text style={styles.amountDescription}>Onsite Service Charge</Text>
                <Text style={styles.amountValue}>BDT {formatCurrency(payroll.onsiteBenefits.serviceCharge)}</Text>
              </View>
            )}
            
            {payroll.foodCostDetails?.fixedDeduction > 0 && (
              <View style={styles.amountRow}>
                <Text style={styles.amountDescription}>Food Cost Contribution</Text>
                <Text style={styles.amountValue}>BDT {formatCurrency(payroll.foodCostDetails.fixedDeduction)}</Text>
              </View>
            )}
            
            <View style={[styles.amountRow, styles.totalRow]}>
              <Text style={styles.amountDescription}>Total Deductions:</Text>
              <Text style={styles.amountValue}>BDT {formatCurrency(payroll.summary?.totalDeductions || 0)}</Text>
            </View>
          </View>
        </View>

        {/* Net Payable Amount */}
        <View style={styles.netPayableSection}>
          <Text style={styles.netPayableTitle}>NET PAYABLE AMOUNT:</Text>
          <Text style={styles.netPayableAmount}>
            BDT {formatCurrency(payroll.summary?.netPayable || 0)}
          </Text>
        </View>

        {/* Special Notes */}
        {(payroll.mealDeduction?.amount > 0 || payroll.onsiteBenefits) && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>SPECIAL NOTES:</Text>
            <View style={styles.notesList}>
              {payroll.mealDeduction?.amount > 0 && (
                <Text style={styles.noteItem}>
                  • Meal deduction applied: BDT {formatCurrency(payroll.mealDeduction.amount)} ({payroll.mealDeduction.type || 'monthly_subscription'})
                </Text>
              )}
              
              {payroll.onsiteBenefits && (
                <Text style={styles.noteItem}>
                  • Onsite employee benefits applied: Tea Allowance BDT {formatCurrency(payroll.onsiteBenefits.teaAllowance || 0)}, 
                  Service Charge BDT {formatCurrency(payroll.onsiteBenefits.serviceCharge || 0)}
                </Text>
              )}
              
              {payroll.foodCostDetails?.fixedDeduction > 0 && (
                <Text style={styles.noteItem}>
                  • Food cost contribution: BDT {formatCurrency(payroll.foodCostDetails.fixedDeduction)}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Status & Approval */}
        <View style={styles.statusSection}>
          <Text style={styles.statusTitle}>STATUS & APPROVAL</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Payroll Status:</Text>
              <Text style={styles.statusValue}>{payroll.status?.current || 'Pending'}</Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Employee Accepted:</Text>
              <Text style={styles.statusValue}>
                {payroll.status?.employeeAccepted ? 'Yes' : 'No'}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Accepted Date:</Text>
              <Text style={styles.statusValue}>
                {payroll.status?.acceptedAt ? formatDate(payroll.status.acceptedAt) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is a computer-generated document. No signature required.</Text>
          <Text>Generated by A2IT HRM System</Text>
        </View>
        
      </Page>
    </Document>
  );
};

// Export function
export const PayrollPDFDocument = async (payrollDetails) => {
  try {
    const { pdf } = await import('@react-pdf/renderer');
    
    // Prepare data with defaults
    const preparedData = {
      ...payrollDetails,
      employee: {
        name: payrollDetails.employee?.name || 'Unknown',
        employeeId: payrollDetails.employee?.employeeId || 'N/A',
        department: payrollDetails.employee?.department || 'N/A',
        designation: payrollDetails.employee?.designation || 'N/A',
      },
      earnings: {
        basicPay: payrollDetails.earnings?.basicPay || 0,
        overtime: payrollDetails.earnings?.overtime || 0,
        bonus: payrollDetails.earnings?.bonus || 0,
        allowance: payrollDetails.earnings?.allowance || 0,
      },
      deductions: {
        late: payrollDetails.deductions?.late || 0,
        absent: payrollDetails.deductions?.absent || 0,
        leave: payrollDetails.deductions?.leave || 0,
        halfDay: payrollDetails.deductions?.halfDay || 0,
        allowanceDeduction: payrollDetails.deductions?.allowanceDeduction || 0,
      },
      summary: {
        grossEarnings: payrollDetails.summary?.grossEarnings || 0,
        totalDeductions: payrollDetails.summary?.totalDeductions || 0,
        netPayable: payrollDetails.summary?.netPayable || 0,
      },
      attendance: {
        presentDays: payrollDetails.attendance?.presentDays || 0,
        totalDays: payrollDetails.attendance?.totalDays || 23,
        attendancePercentage: payrollDetails.attendance?.attendancePercentage || 0,
      },
      status: {
        current: payrollDetails.status?.current || 'Pending',
        employeeAccepted: payrollDetails.status?.employeeAccepted || false,
        acceptedAt: payrollDetails.status?.acceptedAt,
      },
      period: {
        formattedPeriod: payrollDetails.period?.formattedPeriod || 'N/A',
      },
      payrollId: payrollDetails.payrollId || Date.now().toString(),
      paymentDate: payrollDetails.paymentDate || new Date().toISOString(),
    };
    
    const blob = await pdf(<PayrollPDF payroll={preparedData} />).toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payroll_${preparedData.employee.employeeId}_${new Date().toISOString().slice(0, 10)}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

export default PayrollPDFDocument;