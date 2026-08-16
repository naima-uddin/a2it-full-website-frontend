// app/dashboard/moderatorDashboard/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Calendar,
  RefreshCw,
  ChevronDown,
  FileDown,
  AlertCircle,
  BarChart3,
  PieChart,
  Shield,
  Utensils,
  LogOut,
  User,
  TrendingUp,
  Home,
  Zap,
  Package,
  Car,
  Receipt,
  Crown
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_HRM_API_URL || 'http://localhost:5000/api/v1';

// Months for dropdown
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function page() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState({ monthly: false, yearly: false });
  const [pdfReady, setPdfReady] = useState(false);
  
  // Initialize PDF libraries on client side
  useEffect(() => {
    const initializePDF = async () => {
      if (typeof window !== 'undefined') {
        const [jsPDFModule] = await Promise.all([
          import('jspdf'),
          import('jspdf-autotable').catch(() => ({ default: null }))
        ]);
        setPdfReady(true);
      }
    };
    
    initializePDF();
  }, []);
  
  // Dashboard state
  const [dashboardData, setDashboardData] = useState({
    selectedYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1,
    selectedYearForYearly: new Date().getFullYear(),
    
    monthlySummary: {
      total: 0,
      officeRent: 0,
      utilities: 0,
      officeSupplies: 0,
      transportExpenses: 0,
      extraExpenses: 0,
      foodCosts: 0,
      isLoading: false,
      error: null,
      categoryBreakdown: []
    },
    
    yearlySummary: {
      total: 0,
      isLoading: false,
      error: null,
      monthlyBreakdown: [],
      categoryTotals: []
    }
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Fetch data after authentication
  useEffect(() => {
    if (user && !authLoading) {
      fetchMonthlySummary();
      fetchYearlySummary();
    }
  }, [user, authLoading, dashboardData.selectedYear, dashboardData.selectedMonth, dashboardData.selectedYearForYearly]);

  const checkAuthentication = () => {
    const moderatorToken = localStorage.getItem('moderatorToken');
    const moderatorData = localStorage.getItem('moderatorData');

    if (!moderatorToken) {
      router.push('/hrm');
      return;
    }

    try {
      if (moderatorData) {
        setUser(JSON.parse(moderatorData));
      } else {
        setUser({ name: 'Moderator', role: 'moderator' });
      }
      setAuthLoading(false);
    } catch {
      router.push('/hrm');
    }
  };

  const getAuthHeaders = () => {
    const moderatorToken = localStorage.getItem('moderatorToken');
    return {
      'Content-Type': 'application/json',
      ...(moderatorToken ? { 'Authorization': `Bearer ${moderatorToken}` } : {})
    };
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  // Format currency in BDT (Taka)
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'BDT 0';
    
    const formattedAmount = new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    return `BDT ${formattedAmount}`;
  };

  // Format amount without symbol
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '0.00';
    
    return new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate percentage for category breakdown
  const calculatePercentage = (amount) => {
    const total = dashboardData.monthlySummary.total;
    return total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
  };

  // Calculate percentage for yearly summary
  const calculateYearlyPercentage = (amount) => {
    const total = dashboardData.yearlySummary.total;
    return total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
  };

  // Handle API errors
  const handleAPIError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    
    if (error.message?.includes('authentication') || 
        error.message?.includes('token') || 
        error.message?.includes('401') || 
        error.message?.includes('403')) {
      
      const moderatorToken = localStorage.getItem('moderatorToken');
      if (!moderatorToken) {
        localStorage.clear();
        router.push('/hrm');
        return;
      }
      
      if (context === 'monthly summary') {
        setDashboardData(prev => ({
          ...prev,
          monthlySummary: {
            ...prev.monthlySummary,
            error: `Some ${context} data could not be loaded. Your moderator session may need refresh.`,
            isLoading: false
          }
        }));
      } else {
        setDashboardData(prev => ({
          ...prev,
          yearlySummary: {
            ...prev.yearlySummary,
            error: `Some ${context} data could not be loaded. Your moderator session may need refresh.`,
            isLoading: false
          }
        }));
      }
      
      return false;
    }
    
    if (context === 'monthly summary') {
      setDashboardData(prev => ({ 
        ...prev, 
        monthlySummary: {
          ...prev.monthlySummary,
          error: error.message || `Failed to load ${context} data`,
          isLoading: false
        }
      }));
    } else {
      setDashboardData(prev => ({ 
        ...prev, 
        yearlySummary: {
          ...prev.yearlySummary,
          error: error.message || `Failed to load ${context} data`,
          isLoading: false
        }
      }));
    }
    
    return true;
  };

  // Fetch monthly summary data
  const fetchMonthlySummary = async () => {
    if (!user) return;
    
    try {
      setDashboardData(prev => ({ 
        ...prev, 
        monthlySummary: { ...prev.monthlySummary, isLoading: true, error: null } 
      }));
      
      const { selectedYear, selectedMonth } = dashboardData;
      const headers = getAuthHeaders();
      
      const responses = await Promise.allSettled([
        fetch(`${API_BASE_URL}/office-rents`, { headers }),
        fetch(`${API_BASE_URL}/bills/month/${selectedYear}/${selectedMonth}`, { headers }),
        fetch(`${API_BASE_URL}/office-supplies`, { headers }),
        fetch(`${API_BASE_URL}/transport-expenses`, { headers }),
        fetch(`${API_BASE_URL}/extra-expenses`, { headers }),
        fetch(`${API_BASE_URL}/food-costs`, { headers })
      ]);

      const data = await Promise.all(
        responses.map(async (response, index) => {
          if (response.status === 'fulfilled') {
            try {
              const result = await response.value.json();
              
              if (response.value.status === 401 || response.value.status === 403) {
                console.warn(`API ${index} returned auth error`);
                return { success: false, data: [], authError: true };
              }
              
              return result;
            } catch (error) {
              console.error(`Error parsing API ${index} response:`, error);
              return { success: false, data: [] };
            }
          }
          return { success: false, data: [] };
        })
      );

      const hasAuthError = data.some(item => item.authError);
      if (hasAuthError) {
        handleAPIError(new Error('Authentication failed for some APIs'), 'monthly summary');
        return;
      }

      const filterByMonth = (items, dateField) => {
        if (!items || !Array.isArray(items)) return [];
        return items.filter(item => {
          if (!item[dateField]) return false;
          try {
            const date = new Date(item[dateField]);
            return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
          } catch {
            return false;
          }
        });
      };

      const monthRents = filterByMonth(data[0]?.data, 'date');
      const monthBills = data[1]?.data || [];
      const monthSupplies = filterByMonth(data[2]?.data, 'date');
      const monthTransport = filterByMonth(data[3]?.data, 'date');
      const monthExtra = filterByMonth(data[4]?.data, 'date');
      const monthFoodCosts = filterByMonth(data[5]?.data, 'date');

      const officeRent = monthRents.reduce((sum, rent) => sum + (rent.rent || 0), 0);
      const utilities = monthBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
      const officeSupplies = monthSupplies.reduce((sum, supply) => sum + (supply.price || 0), 0);
      const transportExpenses = monthTransport.reduce((sum, transport) => sum + (transport.cost || 0), 0);
      const extraExpenses = monthExtra.reduce((sum, extra) => sum + (extra.amount || 0), 0);
      const foodCosts = monthFoodCosts.reduce((sum, food) => sum + (food.cost || 0), 0);

      const total = officeRent + utilities + officeSupplies + transportExpenses + extraExpenses + foodCosts;

      const categoryBreakdown = [
        { category: 'House Rent', amount: officeRent, color: '#8B5CF6', icon: <Home className="w-4 h-4" /> },
        { category: 'Utilities', amount: utilities, color: '#A855F7', icon: <Zap className="w-4 h-4" /> },
        { category: 'Office Supplies', amount: officeSupplies, color: '#D946EF', icon: <Package className="w-4 h-4" /> },
        { category: 'Transport Expenses', amount: transportExpenses, color: '#EC4899', icon: <Car className="w-4 h-4" /> },
        { category: 'Extra Expenses', amount: extraExpenses, color: '#F472B6', icon: <Receipt className="w-4 h-4" /> },
        { category: 'Food Costs', amount: foodCosts, color: '#F97316', icon: <Utensils className="w-4 h-4" /> }
      ].filter(item => item.amount > 0);

      setDashboardData(prev => ({
        ...prev,
        monthlySummary: {
          total,
          officeRent,
          utilities,
          officeSupplies,
          transportExpenses,
          extraExpenses,
          foodCosts,
          categoryBreakdown,
          isLoading: false,
          error: null
        }
      }));

    } catch (error) {
      handleAPIError(error, 'monthly summary');
    }
  };

  // Fetch yearly summary data
  const fetchYearlySummary = async () => {
    if (!user) return;
    
    try {
      setDashboardData(prev => ({ 
        ...prev, 
        yearlySummary: { ...prev.yearlySummary, isLoading: true, error: null } 
      }));
      
      const { selectedYearForYearly } = dashboardData;
      const headers = getAuthHeaders();
      
      const responses = await Promise.allSettled([
        fetch(`${API_BASE_URL}/office-rents`, { headers }),
        fetch(`${API_BASE_URL}/bills`, { headers }),
        fetch(`${API_BASE_URL}/office-supplies`, { headers }),
        fetch(`${API_BASE_URL}/transport-expenses`, { headers }),
        fetch(`${API_BASE_URL}/extra-expenses`, { headers }),
        fetch(`${API_BASE_URL}/food-costs`, { headers })
      ]);

      const data = await Promise.all(
        responses.map(async (response, index) => {
          if (response.status === 'fulfilled') {
            try {
              const result = await response.value.json();
              
              if (response.value.status === 401 || response.value.status === 403) {
                console.warn(`API ${index} returned auth error`);
                return { success: false, data: [], authError: true };
              }
              
              return result;
            } catch (error) {
              console.error(`Error parsing API ${index} response:`, error);
              return { success: false, data: [] };
            }
          }
          return { success: false, data: [] };
        })
      );

      const hasAuthError = data.some(item => item.authError);
      if (hasAuthError) {
        handleAPIError(new Error('Authentication failed for some APIs'), 'yearly summary');
        return;
      }

      const filterByYear = (items, dateField) => {
        if (!items || !Array.isArray(items)) return [];
        return items.filter(item => {
          if (!item[dateField]) return false;
          try {
            const date = new Date(item[dateField]);
            return date.getFullYear() === selectedYearForYearly;
          } catch {
            return false;
          }
        });
      };

      const yearRents = filterByYear(data[0]?.data, 'date');
      const yearBills = (data[1]?.data || []).filter(bill => bill.year === selectedYearForYearly);
      const yearSupplies = filterByYear(data[2]?.data, 'date');
      const yearTransport = filterByYear(data[3]?.data, 'date');
      const yearExtra = filterByYear(data[4]?.data, 'date');
      const yearFoodCosts = filterByYear(data[5]?.data, 'date');

      const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const monthName = MONTHS[i].substring(0, 3);
        
        const filterByMonth = (items, dateField) => {
          return items.filter(item => {
            try {
              const date = new Date(item[dateField]);
              return date.getMonth() + 1 === month;
            } catch {
              return false;
            }
          });
        };

        const monthRents = filterByMonth(yearRents, 'date');
        const monthBills = yearBills.filter(bill => bill.month === month);
        const monthSupplies = filterByMonth(yearSupplies, 'date');
        const monthTransport = filterByMonth(yearTransport, 'date');
        const monthExtra = filterByMonth(yearExtra, 'date');
        const monthFoodCosts = filterByMonth(yearFoodCosts, 'date');

        const total = 
          monthRents.reduce((sum, rent) => sum + (rent.rent || 0), 0) +
          monthBills.reduce((sum, bill) => sum + (bill.amount || 0), 0) +
          monthSupplies.reduce((sum, supply) => sum + (supply.price || 0), 0) +
          monthTransport.reduce((sum, transport) => sum + (transport.cost || 0), 0) +
          monthExtra.reduce((sum, extra) => sum + (extra.amount || 0), 0) +
          monthFoodCosts.reduce((sum, food) => sum + (food.cost || 0), 0);

        return {
          month,
          monthName,
          total,
          officeRent: monthRents.reduce((sum, rent) => sum + (rent.rent || 0), 0),
          utilities: monthBills.reduce((sum, bill) => sum + (bill.amount || 0), 0),
          officeSupplies: monthSupplies.reduce((sum, supply) => sum + (supply.price || 0), 0),
          transportExpenses: monthTransport.reduce((sum, transport) => sum + (transport.cost || 0), 0),
          extraExpenses: monthExtra.reduce((sum, extra) => sum + (extra.amount || 0), 0),
          foodCosts: monthFoodCosts.reduce((sum, food) => sum + (food.cost || 0), 0)
        };
      });

      const categoryTotals = [
        { category: 'House Rent', amount: yearRents.reduce((sum, rent) => sum + (rent.rent || 0), 0), color: '#8B5CF6', icon: <Home className="w-4 h-4" /> },
        { category: 'Utilities', amount: yearBills.reduce((sum, bill) => sum + (bill.amount || 0), 0), color: '#A855F7', icon: <Zap className="w-4 h-4" /> },
        { category: 'Office Supplies', amount: yearSupplies.reduce((sum, supply) => sum + (supply.price || 0), 0), color: '#D946EF', icon: <Package className="w-4 h-4" /> },
        { category: 'Transport Expenses', amount: yearTransport.reduce((sum, transport) => sum + (transport.cost || 0), 0), color: '#EC4899', icon: <Car className="w-4 h-4" /> },
        { category: 'Extra Expenses', amount: yearExtra.reduce((sum, extra) => sum + (extra.amount || 0), 0), color: '#F472B6', icon: <Receipt className="w-4 h-4" /> },
        { category: 'Food Costs', amount: yearFoodCosts.reduce((sum, food) => sum + (food.cost || 0), 0), color: '#F97316', icon: <Utensils className="w-4 h-4" /> }
      ].filter(item => item.amount > 0);

      const total = 
        yearRents.reduce((sum, rent) => sum + (rent.rent || 0), 0) +
        yearBills.reduce((sum, bill) => sum + (bill.amount || 0), 0) +
        yearSupplies.reduce((sum, supply) => sum + (supply.price || 0), 0) +
        yearTransport.reduce((sum, transport) => sum + (transport.cost || 0), 0) +
        yearExtra.reduce((sum, extra) => sum + (extra.amount || 0), 0) +
        yearFoodCosts.reduce((sum, food) => sum + (food.cost || 0), 0);

      setDashboardData(prev => ({
        ...prev,
        yearlySummary: {
          total,
          monthlyBreakdown,
          categoryTotals,
          isLoading: false,
          error: null
        }
      }));

    } catch (error) {
      handleAPIError(error, 'yearly summary');
    }
  };

  // Download Monthly Summary PDF
  const downloadMonthlyPDF = async () => {
    try {
      setDownloadingPDF(prev => ({ ...prev, monthly: true }));
      
      const { default: jsPDF } = await import('jspdf');
      const summary = dashboardData.monthlySummary;
      const monthName = MONTHS[dashboardData.selectedMonth - 1];
      const year = dashboardData.selectedYear;
      
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(107, 70, 193);
      doc.text(`Monthly Expense Summary - ${monthName} ${year}`, 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Moderator View - Limited Access', 105, 30, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });
      doc.text(`Generated by: ${user?.name || 'Moderator'}`, 105, 46, { align: 'center' });
      
      const moderatorToken = localStorage.getItem('moderatorToken');
      if (moderatorToken) {
        doc.text('Access: Moderator Token', 105, 54, { align: 'center' });
      }
      
      doc.setFontSize(16);
      doc.setTextColor(107, 70, 193);
      doc.text(`Total Monthly Expenses: ${formatCurrency(summary.total)}`, 105, 65, { align: 'center' });
      
      let yPosition = 80;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      doc.setFont(undefined, 'bold');
      doc.text('Category', 20, yPosition);
      doc.text('Amount (BDT)', 120, yPosition);
      doc.text('Percentage', 180, yPosition);
      doc.setFont(undefined, 'normal');
      
      yPosition += 10;
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 10;
      
      const categories = [
        { name: 'House Rent', amount: summary.officeRent },
        { name: 'Utilities', amount: summary.utilities },
        { name: 'Office Supplies', amount: summary.officeSupplies },
        { name: 'Transport Expenses', amount: summary.transportExpenses },
        { name: 'Extra Expenses', amount: summary.extraExpenses },
        { name: 'Food Costs', amount: summary.foodCosts }
      ];
      
      categories.forEach(category => {
        if (category.amount > 0) {
          const percentage = ((category.amount / summary.total) * 100).toFixed(1);
          doc.text(category.name, 20, yPosition);
          doc.text(formatAmount(category.amount), 120, yPosition);
          doc.text(`${percentage}%`, 180, yPosition);
          yPosition += 8;
        }
      });
      
      yPosition += 5;
      doc.setDrawColor(100, 100, 100);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;
      
      doc.setFont(undefined, 'bold');
      doc.text('TOTAL', 20, yPosition);
      doc.text(formatAmount(summary.total), 120, yPosition);
      doc.text('100%', 180, yPosition);
      doc.setFont(undefined, 'normal');
      
      yPosition += 20;
      doc.setFontSize(12);
      doc.setTextColor(249, 115, 22);
      doc.text('Food Cost Analysis:', 20, yPosition);
      
      yPosition += 8;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const dailyAverage = summary.foodCosts / 30;
      const weeklyAverage = summary.foodCosts / 4;
      
      doc.text(`• Daily Average: ${formatCurrency(dailyAverage)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Weekly Average: ${formatCurrency(weeklyAverage)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Percentage of Total: ${calculatePercentage(summary.foodCosts)}%`, 25, yPosition);
      
      yPosition += 15;
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Note: This is a moderator view. Employee salary data is not accessible.', 20, yPosition);
      yPosition += 6;
      doc.text('Contact administrator for full financial reports.', 20, yPosition);
      
      doc.setFontSize(8);
      doc.text(`Page 1 of 1`, 195, 285, { align: 'right' });
      doc.text('Confidential - Moderator Expenses Report', 15, 285);
      doc.text(`Access Token: ${moderatorToken ? 'Moderator Token' : 'Regular Token'}`, 105, 285, { align: 'center' });
      
      doc.save(`Monthly_Expense_Summary_Moderator_${monthName}_${year}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPDF(prev => ({ ...prev, monthly: false }));
    }
  };

  // Download Yearly Summary PDF
  const downloadYearlyPDF = async () => {
    try {
      setDownloadingPDF(prev => ({ ...prev, yearly: true }));
      
      const { default: jsPDF } = await import('jspdf');
      const year = dashboardData.selectedYearForYearly;
      const summary = dashboardData.yearlySummary;
      
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(107, 70, 193);
      doc.text(`Yearly Expense Summary - ${year}`, 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Moderator View - Limited Access', 105, 30, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });
      doc.text(`Generated by: ${user?.name || 'Moderator'}`, 105, 46, { align: 'center' });
      
      const moderatorToken = localStorage.getItem('moderatorToken');
      if (moderatorToken) {
        doc.text('Access: Moderator Token', 105, 54, { align: 'center' });
      }
      
      doc.setFontSize(16);
      doc.setTextColor(107, 70, 193);
      doc.text(`Total Yearly Expenses: ${formatCurrency(summary.total)}`, 105, 65, { align: 'center' });
      
      let yPosition = 80;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      doc.setFont(undefined, 'bold');
      doc.text('Month', 20, yPosition);
      doc.text('Total (BDT)', 60, yPosition);
      doc.text('Food Costs', 120, yPosition);
      doc.text('% of Total', 180, yPosition);
      doc.setFont(undefined, 'normal');
      
      yPosition += 10;
      
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 10;
      
      summary.monthlyBreakdown.forEach(month => {
        const monthPercentage = ((month.total / summary.total) * 100).toFixed(1);
        const foodPercentage = month.total > 0 ? ((month.foodCosts / month.total) * 100).toFixed(1) : '0.0';
        
        doc.text(month.monthName, 20, yPosition);
        doc.text(formatAmount(month.total), 60, yPosition);
        doc.text(formatAmount(month.foodCosts), 120, yPosition);
        doc.text(`${foodPercentage}%`, 180, yPosition);
        yPosition += 8;
      });
      
      yPosition += 5;
      doc.setDrawColor(100, 100, 100);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;
      
      doc.setFont(undefined, 'bold');
      doc.text('YEAR TOTAL', 20, yPosition);
      doc.text(formatAmount(summary.total), 60, yPosition);
      doc.text(formatAmount(summary.categoryTotals.find(c => c.category === 'Food Costs')?.amount || 0), 120, yPosition);
      const yearlyFoodPercentage = summary.total > 0 ? 
        ((summary.categoryTotals.find(c => c.category === 'Food Costs')?.amount || 0) / summary.total * 100).toFixed(1) : '0.0';
      doc.text(`${yearlyFoodPercentage}%`, 180, yPosition);
      doc.setFont(undefined, 'normal');
      
      yPosition += 20;
      doc.setFontSize(12);
      doc.setTextColor(249, 115, 22);
      doc.text('Food Cost Summary:', 20, yPosition);
      
      yPosition += 8;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const totalFoodCosts = summary.categoryTotals.find(c => c.category === 'Food Costs')?.amount || 0;
      const avgMonthlyFood = totalFoodCosts / 12;
      const avgDailyFood = totalFoodCosts / 365;
      
      doc.text(`• Total Food Costs: ${formatCurrency(totalFoodCosts)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Average Monthly: ${formatCurrency(avgMonthlyFood)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Average Daily: ${formatCurrency(avgDailyFood)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`• Percentage of Yearly Total: ${calculateYearlyPercentage(totalFoodCosts)}%`, 25, yPosition);
      
      yPosition += 15;
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('Note: This is a moderator view. Employee salary data is not accessible.', 20, yPosition);
      yPosition += 6;
      doc.text('Contact administrator for full financial reports.', 20, yPosition);
      
      doc.setFontSize(8);
      doc.text(`Page 1 of 1`, 195, 285, { align: 'right' });
      doc.text('Confidential - Moderator Yearly Report', 15, 285);
      doc.text(`Access Token: ${moderatorToken ? 'Moderator Token' : 'Regular Token'}`, 105, 285, { align: 'center' });
      
      doc.save(`Yearly_Expense_Summary_Moderator_${year}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPDF(prev => ({ ...prev, yearly: false }));
    }
  };

  // Handle year/month change
  const handleMonthYearChange = (type, value) => {
    setDashboardData(prev => ({
      ...prev,
      [type]: parseInt(value)
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    if (!user) return;
    fetchMonthlySummary();
    fetchYearlySummary();
  };

  // Handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      localStorage.removeItem('moderatorToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
      router.push('/hrm');
    }
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Checking moderator authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
              <p className="text-purple-100 mt-1">Limited access expense overview</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                  MODERATOR PRIVILEGES
                </span>
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                  RESTRICTED ACCESS
                </span> 
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-right hidden md:block">
              <p className="text-purple-200 text-sm">Logged in as</p>
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-purple-200 text-xs">Moderator Role</p>
            </div> 
          </div>
        </div>
        
        {/* User info for mobile */}
        <div className="md:hidden mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Logged in as</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            <User className="w-6 h-6 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(dashboardData.monthlySummary.error || dashboardData.yearlySummary.error) && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-red-800 font-medium">Data Loading Error</p>
                <p className="text-red-600 text-sm mt-1">
                  {dashboardData.monthlySummary.error || dashboardData.yearlySummary.error}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setDashboardData(prev => ({
                  ...prev,
                  monthlySummary: { ...prev.monthlySummary, error: null },
                  yearlySummary: { ...prev.yearlySummary, error: null }
                }));
              }}
              className="text-red-500 hover:text-red-700 p-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Moderator Token Status */}
      {localStorage.getItem('moderatorToken') && (
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg mr-3">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-emerald-800 font-semibold">Moderator Token Active</p>
              <p className="text-emerald-600 text-sm mt-1">
                You are accessing this dashboard with moderator privileges. Employee salary data is hidden.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Summary Section */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Monthly Expense Summary</h2>
              <p className="text-gray-600 text-sm">Detailed breakdown for selected month</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={downloadMonthlyPDF}
              disabled={downloadingPDF.monthly || dashboardData.monthlySummary.isLoading}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileDown className={`w-4 h-4 mr-2 ${downloadingPDF.monthly ? 'animate-spin' : ''}`} />
              {downloadingPDF.monthly ? 'Generating...' : 'Download PDF'}
            </button>
            
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={dashboardData.selectedYear}
                  onChange={(e) => handleMonthYearChange('selectedYear', e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  disabled={dashboardData.monthlySummary.isLoading}
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={dashboardData.selectedMonth}
                  onChange={(e) => handleMonthYearChange('selectedMonth', e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                  disabled={dashboardData.monthlySummary.isLoading}
                >
                  {MONTHS.map((month, index) => (
                    <option key={index + 1} value={index + 1}>{month}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {dashboardData.monthlySummary.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Monthly Total Card */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <p className="text-purple-600 text-sm font-medium">
                      {MONTHS[dashboardData.selectedMonth - 1]} {dashboardData.selectedYear}
                    </p>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(dashboardData.monthlySummary.total)}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">Total Monthly Expenses</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      No Employee Data
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      Moderator View
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Category Breakdown
              </h3>
              <div className="space-y-4">
                {dashboardData.monthlySummary.categoryBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                          {React.cloneElement(item.icon, { className: "w-4 h-4", style: { color: item.color } })}
                        </div>
                        <span className="font-medium text-gray-700">{item.category}</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full shadow-sm" 
                        style={{ 
                          width: `${calculatePercentage(item.amount)}%`,
                          backgroundColor: item.color 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{calculatePercentage(item.amount)}% of total</span>
                      <span className="font-medium" style={{ color: item.color }}>
                        BDT {formatAmount(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.monthlySummary.categoryBreakdown.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                        {React.cloneElement(item.icon, { className: "w-4 h-4", style: { color: item.color } })}
                      </div>
                      <p className="text-gray-700 font-medium">{item.category}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                      backgroundColor: `${item.color}20`,
                      color: item.color
                    }}>
                      {calculatePercentage(item.amount)}%
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {formatCurrency(item.amount)}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      BDT {formatAmount(item.amount)}
                    </p>
                    {item.category === 'Food Costs' && (
                      <div className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                        Daily: {formatCurrency(item.amount / 30)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-700 font-medium">Office & Operational</p>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Home className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.monthlySummary.officeRent + dashboardData.monthlySummary.officeSupplies)}
                </p>
                <div className="flex items-center text-sm text-gray-600 mt-2 gap-4">
                  <span>Rent: {formatCurrency(dashboardData.monthlySummary.officeRent)}</span>
                  <span>Supplies: {formatCurrency(dashboardData.monthlySummary.officeSupplies)}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-700 font-medium">Utilities & Transport</p>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Zap className="w-4 h-4 text-indigo-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.monthlySummary.utilities + dashboardData.monthlySummary.transportExpenses)}
                </p>
                <div className="flex items-center text-sm text-gray-600 mt-2 gap-4">
                  <span>Utilities: {formatCurrency(dashboardData.monthlySummary.utilities)}</span>
                  <span>Transport: {formatCurrency(dashboardData.monthlySummary.transportExpenses)}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-700 font-medium">Food & Miscellaneous</p>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Utensils className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.monthlySummary.foodCosts + dashboardData.monthlySummary.extraExpenses)}
                </p>
                <div className="flex items-center text-sm text-gray-600 mt-2 gap-4">
                  <span>Food: {formatCurrency(dashboardData.monthlySummary.foodCosts)}</span>
                  <span>Extra: {formatCurrency(dashboardData.monthlySummary.extraExpenses)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Yearly Summary Section */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Yearly Expense Summary</h2>
              <p className="text-gray-600 text-sm">Annual overview and trends</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={downloadYearlyPDF}
              disabled={downloadingPDF.yearly || dashboardData.yearlySummary.isLoading}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileDown className={`w-4 h-4 mr-2 ${downloadingPDF.yearly ? 'animate-spin' : ''}`} />
              {downloadingPDF.yearly ? 'Generating...' : 'Download PDF'}
            </button>
            
            <div className="relative">
              <select
                value={dashboardData.selectedYearForYearly}
                onChange={(e) => handleMonthYearChange('selectedYearForYearly', e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                disabled={dashboardData.yearlySummary.isLoading}
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {dashboardData.yearlySummary.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Yearly Total Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <p className="text-indigo-600 text-sm font-medium">
                      Year {dashboardData.selectedYearForYearly}
                    </p>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(dashboardData.yearlySummary.total)}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">Total Yearly Expenses</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      Annual Overview
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Excluding Salaries
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Monthly Breakdown Chart */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Monthly Breakdown
                </h3>
                <div className="flex items-center text-sm text-orange-600 font-medium">
                  <Utensils className="w-4 h-4 mr-1" />
                  <span>Food costs highlighted</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {dashboardData.yearlySummary.monthlyBreakdown.map((month, index) => {
                  const foodPercentage = month.total > 0 ? (month.foodCosts / month.total) * 100 : 0;
                  const totalPercentage = month.total > 0 ? 
                    (month.total / Math.max(...dashboardData.yearlySummary.monthlyBreakdown.map(m => m.total || 1))) * 100 : 0;
                  
                  return (
                    <div key={index} className="text-center group">
                      <div className="text-sm text-gray-500 mb-2 font-medium">{month.monthName}</div>
                      <div className="text-lg font-bold text-gray-900 mb-3">
                        {formatCurrency(month.total)}
                      </div>
                      <div className="mt-2 relative">
                        <div 
                          className="h-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors"
                          style={{ 
                            width: '100%',
                            position: 'relative'
                          }}
                        >
                          <div 
                            className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full absolute top-0 left-0 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all"
                            style={{ 
                              width: `${Math.min(totalPercentage, 100)}%`
                            }}
                          ></div>
                          
                          {month.foodCosts > 0 && (
                            <div 
                              className="h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full absolute top-0 left-0"
                              style={{ 
                                width: `${Math.min(totalPercentage * (foodPercentage / 100), 100)}%`
                              }}
                            ></div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 space-y-1">
                        <div className="font-medium">Total: BDT {formatAmount(month.total)}</div>
                        {month.foodCosts > 0 && (
                          <div className="text-orange-600 font-medium">
                            Food: BDT {formatAmount(month.foodCosts)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Yearly Category Totals */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Yearly Category Totals
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Utensils className="w-4 h-4 mr-1 text-orange-500" />
                  <span>Food costs included</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.yearlySummary.categoryTotals.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${item.color}20` }}>
                        {React.cloneElement(item.icon, { className: "w-5 h-5", style: { color: item.color } })}
                      </div>
                      <span className="font-semibold text-gray-800">{item.category}</span>
                      {item.category === 'Food Costs' && (
                        <div className="ml-auto px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                          Daily: {formatCurrency(item.amount / 365)}
                        </div>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {formatCurrency(item.amount)}
                    </p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>BDT {formatAmount(item.amount)}</div>
                      <div className="font-medium" style={{ color: item.color }}>
                        {calculateYearlyPercentage(item.amount)}% of yearly total
                      </div>
                      {item.category === 'Food Costs' && (
                        <div className="text-orange-600 font-medium mt-2">
                          Monthly: {formatCurrency(item.amount / 12)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yearly Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-700 font-medium">Monthly Average</p>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.yearlySummary.total / 12)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Average expense per month
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-700 font-medium">Food Cost Average</p>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Utensils className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    (dashboardData.yearlySummary.categoryTotals.find(c => c.category === 'Food Costs')?.amount || 0) / 12
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Average monthly food costs
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-700 font-medium">Quarterly Average</p>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.yearlySummary.total / 4)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Average expense per quarter
                </p>
              </div>
            </div>
          </>
        )}
      </div> 
    </div>
  );
}