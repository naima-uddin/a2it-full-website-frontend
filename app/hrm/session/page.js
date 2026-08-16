// app/sessions/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock, Calendar, Filter, Search, Download, Trash2, Eye, MoreVertical,
  ChevronLeft, ChevronRight, ChevronDown, User, Smartphone,
  Globe, Shield, AlertCircle, CheckCircle, XCircle, RefreshCw, BarChart3,
  Users, Zap, DollarSign, TrendingUp, ShieldAlert, Plus,
  Settings, LogOut, MapPin, PowerOff, Table, Grid, Home,
  ShieldCheck, ArrowUpDown, Activity, Cpu, Hash, Battery,
  Wifi, WifiOff, Map, Navigation, Server, Database,
  HardDrive, Terminal, Play, Pause, StopCircle, X,
  ExternalLink, Copy, Earth, Monitor, Smartphone as Phone,
  Tablet, Laptop, Wifi as WifiIcon, Signal, Battery as BatteryIcon,
  Activity as ActivityIcon, FileText, Key, LogIn, LogOut as LogOutIcon,
  Info, AlertTriangle, CalendarDays, Clock as ClockIcon,
  Navigation as NavigationIcon, Map as MapIcon, Building, Flag,
  Mail, Phone as PhoneIcon, Globe as GlobeIcon, Cpu as CpuIcon,
  MemoryStick, HardDrive as HardDriveIcon, Layers
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function SessionsPage() {
  const router = useRouter();
  
  // State variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage, setSessionsPerPage] = useState(10);
  const [totalSessions, setTotalSessions] = useState(0);
  
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    startDate: '',
    endDate: '',
    device: 'all',
    sortBy: 'loginAt',
    sortOrder: 'desc'
  });
  
  const [viewMode, setViewMode] = useState('table');
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    expired: 0,
    terminated: 0,
    totalHours: 0,
    avgDuration: '0m',
    uniqueUsers: 0
  });
  
  // Session Details Modal State
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Token management functions
  const getTokenByUserType = () => {
    if (typeof window === 'undefined') return null;
    
    // Check for all possible tokens
    const adminToken = localStorage.getItem("adminToken");
    const employeeToken = localStorage.getItem("employeeToken");
    const moderatorToken = localStorage.getItem("moderatorToken");
    
    return {
      adminToken,
      employeeToken,
      moderatorToken
    };
  };
  
  const getCurrentUserType = () => {
    if (typeof window === 'undefined') return null;
    
    // Check for all possible tokens
    const adminToken = localStorage.getItem("adminToken");
    const employeeToken = localStorage.getItem("employeeToken");
    const moderatorToken = localStorage.getItem("moderatorToken");
    
    if (adminToken) return "admin";
    if (moderatorToken) return "moderator";
    if (employeeToken) return "employee";
    
    return null;
  };
  
  const getCurrentToken = () => {
    const userType = getCurrentUserType();
    switch(userType) {
      case 'admin':
        return localStorage.getItem("adminToken");
      case 'moderator':
        return localStorage.getItem("moderatorToken");
      case 'employee':
        return localStorage.getItem("employeeToken");
      default:
        return null;
    }
  };
  
  const getUserDashboard = (userType) => {
    switch(userType) {
      case 'admin':
        return '/admin/dashboard';
      case 'moderator':
        return '/moderator/dashboard';
      case 'employee':
        return '/employee/dashboard';
      default:
        return '/';
    }
  };
  
  // User type detection
  const isAdmin = () => {
    return getCurrentUserType() === 'admin';
  };
  
  const isModerator = () => {
    return getCurrentUserType() === 'moderator';
  };
  
  const isEmployee = () => {
    return getCurrentUserType() === 'employee';
  };
  
  // Get status color and badge
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return {
          text: 'Active',
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          icon: '●',
          light: 'bg-emerald-500/10 text-emerald-600'
        };
      case 'completed':
        return {
          text: 'Completed',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          icon: '✓',
          light: 'bg-blue-500/10 text-blue-600'
        };
      case 'expired':
        return {
          text: 'Expired',
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          icon: '⌛',
          light: 'bg-amber-500/10 text-amber-600'
        };
      case 'terminated':
        return {
          text: 'Terminated',
          color: 'text-rose-600',
          bg: 'bg-rose-50',
          icon: '✗',
          light: 'bg-rose-500/10 text-rose-600'
        };
      default:
        return {
          text: 'Unknown',
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          icon: '?',
          light: 'bg-gray-500/10 text-gray-600'
        };
    }
  };
  
  // Get role color
  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
      case 'superadmin':
        return {
          bg: 'bg-gradient-to-r from-violet-500 to-purple-600',
          text: 'text-violet-600',
          light: 'bg-violet-50 text-violet-700',
          icon: '👑'
        };
      case 'moderator':
        return {
          bg: 'bg-gradient-to-r from-indigo-500 to-blue-600',
          text: 'text-indigo-600',
          light: 'bg-indigo-50 text-indigo-700',
          icon: '🛡️'
        };
      case 'employee':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-600',
          text: 'text-purple-600',
          light: 'bg-purple-50 text-purple-700',
          icon: '👨‍💼'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          text: 'text-gray-600',
          light: 'bg-gray-50 text-gray-700',
          icon: '👤'
        };
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  // Format date for display (without seconds)
  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      return `${days}d ${hours}h`;
    }
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = Math.floor(minutes % 60);
      return `${hours}h ${mins}m`;
    }
    
    return `${Math.floor(minutes)}m`;
  };
  
  // Parse device from userAgent
  const parseDeviceInfo = (userAgent) => {
    if (!userAgent) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };
    
    const ua = userAgent.toLowerCase();
    const result = {
      device: 'Desktop',
      browser: 'Unknown',
      os: 'Unknown',
      deviceIcon: <Monitor className="w-5 h-5" />
    };
    
    if (ua.includes('mobile')) {
      result.device = 'Mobile';
      result.deviceIcon = <Phone className="w-5 h-5" />;
    }
    else if (ua.includes('tablet')) {
      result.device = 'Tablet';
      result.deviceIcon = <Tablet className="w-5 h-5" />;
    }
    else if (ua.includes('laptop')) {
      result.device = 'Laptop';
      result.deviceIcon = <Laptop className="w-5 h-5" />;
    }
    
    if (ua.includes('chrome') && !ua.includes('edge')) result.browser = 'Chrome';
    else if (ua.includes('firefox')) result.browser = 'Firefox';
    else if (ua.includes('safari') && !ua.includes('chrome')) result.browser = 'Safari';
    else if (ua.includes('edge')) result.browser = 'Edge';
    else if (ua.includes('opera')) result.browser = 'Opera';
    else if (ua.includes('brave')) result.browser = 'Brave';
    
    if (ua.includes('windows')) result.os = 'Windows';
    else if (ua.includes('mac os')) result.os = 'macOS';
    else if (ua.includes('linux')) result.os = 'Linux';
    else if (ua.includes('android')) result.os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone')) result.os = 'iOS';
    
    return result;
  };
  
  // Get device icon
  const getDeviceIcon = (device) => {
    switch(device?.toLowerCase()) {
      case 'mobile':
        return <Phone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'laptop':
        return <Laptop className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };
  
  // Get browser icon
  const getBrowserIcon = (browser) => {
    switch(browser?.toLowerCase()) {
      case 'chrome':
        return <GlobeIcon className="w-5 h-5 text-red-500" />;
      case 'firefox':
        return <GlobeIcon className="w-5 h-5 text-orange-500" />;
      case 'safari':
        return <GlobeIcon className="w-5 h-5 text-blue-500" />;
      case 'edge':
        return <GlobeIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <GlobeIcon className="w-5 h-5" />;
    }
  };
  
  // Fetch user profile based on token type
  const fetchUserProfile = async () => {
    try {
      const userType = getCurrentUserType();
      const token = getCurrentToken();
      
      if (!token || !userType) {
        console.log('No token or user type, redirecting to login');
        router.push("/hrm");
        return null;
      }
      
      let endpoint;
      
      // Different endpoints based on user type
      if (userType === 'admin') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/admin/getAdminProfile`;
      } else if (userType === 'moderator') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/users/getProfile`;
      } else if (userType === 'employee') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/users/getProfile`;
      } else {
        toast.error("Invalid user type");
        return null;
      }
      
      console.log('📡 Fetching user profile from:', endpoint);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Profile fetch failed:', response.status);
        toast.error("Please login again");
        // Clear invalid tokens
        localStorage.removeItem('adminToken');
        localStorage.removeItem('moderatorToken');
        localStorage.removeItem('employeeToken');
        router.push('/hrm');
        return null;
      }
      
      const data = await response.json();
      console.log('✅ User profile loaded:', data);
      
      // Set user based on response structure
      if (data.user) {
        setUser(data.user);
        return data.user;
      } else if (data.admin) {
        setUser(data.admin);
        return data.admin;
      } else if (data.moderator) {
        setUser(data.moderator);
        return data.moderator;
      } else if (data.data) {
        setUser(data.data);
        return data.data;
      } else {
        setUser(data);
        return data;
      }
      
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Please login again");
      router.push("/hrm");
      return null;
    }
  };
  
  // Fetch session details
  const fetchSessionDetails = async (sessionId) => {
    try {
      setLoadingDetails(true);
      const token = getCurrentToken();
      const userType = getCurrentUserType();
      
      if (!token || !userType) {
        toast.error("Authentication required");
        return null;
      }
      
      let endpoint;
      if (userType === 'admin') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/details/${sessionId}`;
      } else if (userType === 'moderator') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/details/${sessionId}`; // Moderator uses admin endpoint
      } else {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/my/details/${sessionId}`;
      }
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessionDetails(data.data || data);
        return data.data || data;
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to load session details");
        return null;
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
      toast.error("Failed to load session details");
      return null;
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Fetch sessions based on user role
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = getCurrentToken();
      const userType = getCurrentUserType();
      
      console.log('🔍 Fetching sessions for user type:', userType);
      console.log('🔑 Token exists:', !!token);
      
      if (!token || !userType) {
        toast.error("Please login first");
        localStorage.clear();
        router.push("/hrm");
        return;
      }
      
      let endpoint;
      let headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Determine endpoint based on user role
      if (userType === 'admin') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/all`;
      } else if (userType === 'moderator') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/all`; // Moderator can see all sessions
      } else if (userType === 'employee') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/my-sessions`;
      } else {
        toast.error("Invalid user type");
        return;
      }
      
      console.log('📡 API Endpoint:', endpoint);
      
      // Add query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: sessionsPerPage,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
      
      const url = `${endpoint}?${params}`;
      console.log('🌐 Full URL:', url);
      
      const response = await fetch(url, {
        headers: headers,
        cache: 'no-cache'
      });
      
      console.log('📊 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ API Response:', result);
        
        // Process sessions
        const sessionsData = result.data || result.sessions || result || [];
        console.log(`📊 Processing ${sessionsData.length} sessions`);
        
        const processedSessions = sessionsData.map(session => {
          const deviceInfo = parseDeviceInfo(session.userAgent || '');
          const statusBadge = getStatusBadge(session.sessionStatus || session.status);
          const roleColor = getRoleColor(session.userRole || session.role);
          
          // Duration calculation
          let durationMinutes = session.durationMinutes || 0;
          if (!durationMinutes && session.loginAt) {
            const loginTime = new Date(session.loginAt);
            const logoutTime = session.logoutAt ? new Date(session.logoutAt) : new Date();
            durationMinutes = Math.round((logoutTime - loginTime) / (1000 * 60));
          }
          
          // Check if active
          const isCurrentlyActive = (session.sessionStatus === 'active') && 
                                   session.lastActivity && 
                                   (new Date() - new Date(session.lastActivity)) < 5 * 60 * 1000;
          
          // Location string
          let locationString = 'Unknown Location';
          if (session.location) {
            if (session.location.city && session.location.country) {
              locationString = `${session.location.city}, ${session.location.country}`;
              if (session.location.region && session.location.region !== session.location.city) {
                locationString = `${session.location.city}, ${session.location.region}, ${session.location.country}`;
              }
            }
          } else if (session.ip) {
            locationString = `IP: ${session.ip}`;
          }
          
          // Session number
          let sessionNumber = session.sessionNumber;
          if (!sessionNumber && session._id) {
            sessionNumber = `SESS-${session._id.toString().slice(-6).toUpperCase()}`;
          } else if (!sessionNumber && session.id) {
            sessionNumber = `SESS-${session.id.toString().slice(-6).toUpperCase()}`;
          }
          
          return {
            id: session._id || session.id,
            sessionNumber: sessionNumber,
            userId: session.userId,
            userName: session.userName || session.user?.name || 'Unknown User',
            userEmail: session.userEmail || session.user?.email || 'No email',
            userRole: session.userRole || session.user?.role || 'employee',
            loginAt: session.loginAt,
            logoutAt: session.logoutAt,
            formattedLogin: session.formattedLogin || formatDateShort(session.loginAt),
            formattedLogout: session.formattedLogout || 
                           (session.logoutAt ? formatDateShort(session.logoutAt) : 
                           (isCurrentlyActive ? 'Active Now' : 'Inactive')),
            status: session.sessionStatus || session.status || 'unknown',
            statusBadge: statusBadge,
            durationMinutes: durationMinutes,
            formattedDuration: session.formattedDuration || formatDuration(durationMinutes),
            ip: session.ip || 'No IP',
            device: session.device || deviceInfo.device,
            browser: session.browser || deviceInfo.browser,
            os: session.os || deviceInfo.os,
            deviceIcon: deviceInfo.deviceIcon,
            location: session.location || {},
            locationString: locationString,
            userAgent: session.userAgent || '',
            activities: session.activities || [],
            roleColor: roleColor,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            lastActivity: session.lastActivity,
            isActive: isCurrentlyActive
          };
        });
        
        console.log(`✅ Processed ${processedSessions.length} sessions`);
        
        setSessions(processedSessions);
        setFilteredSessions(processedSessions);
        setTotalSessions(result.total || processedSessions.length);
        
        // Calculate statistics
        calculateStatistics(processedSessions);
        
        toast.success(`Loaded ${processedSessions.length} sessions`);
        
      } else if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        router.push('/hrm');
      } else if (response.status === 403) {
        toast.error("You don't have permission to view these sessions.");
        router.push(getUserDashboard(getCurrentUserType()));
      } else if (response.status === 404) {
        console.log('ℹ️ No sessions found (404)');
        setSessions([]);
        setFilteredSessions([]);
        setTotalSessions(0);
        toast.info("No sessions found");
      } else {
        const errorText = await response.text();
        console.error('❌ Server error:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          toast.error(errorData.message || 'Failed to load sessions');
        } catch {
          toast.error('Server error occurred');
        }
      }
      
    } catch (error) {
      console.error('❌ fetchSessions error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate statistics
  const calculateStatistics = (sessions) => {
    const userType = getCurrentUserType();
    
    // For employees, only show their own stats
    if (userType === 'employee') {
      const activeSessions = sessions.filter(s => s.status === 'active').length;
      const completedSessions = sessions.filter(s => s.status === 'completed').length;
      const terminatedSessions = sessions.filter(s => s.status === 'terminated').length;
      const expiredSessions = sessions.filter(s => s.status === 'expired').length;
      
      const totalDuration = sessions.reduce((sum, session) => sum + (session.durationMinutes || 0), 0);
      const avgDuration = sessions.length > 0 ? totalDuration / sessions.length : 0;
      
      setStats({
        total: sessions.length,
        active: activeSessions,
        completed: completedSessions,
        terminated: terminatedSessions,
        expired: expiredSessions,
        totalHours: (totalDuration / 60).toFixed(2),
        avgDuration: formatDuration(avgDuration),
        uniqueUsers: 1 // Employee sees only their own sessions
      });
    } else {
      // For admin and moderator, show all stats
      const activeSessions = sessions.filter(s => s.status === 'active').length;
      const completedSessions = sessions.filter(s => s.status === 'completed').length;
      const terminatedSessions = sessions.filter(s => s.status === 'terminated').length;
      const expiredSessions = sessions.filter(s => s.status === 'expired').length;
      
      const totalDuration = sessions.reduce((sum, session) => sum + (session.durationMinutes || 0), 0);
      const avgDuration = sessions.length > 0 ? totalDuration / sessions.length : 0;
      const uniqueUsers = new Set(sessions.map(s => s.userId)).size;
      
      setStats({
        total: sessions.length,
        active: activeSessions,
        completed: completedSessions,
        terminated: terminatedSessions,
        expired: expiredSessions,
        totalHours: (totalDuration / 60).toFixed(2),
        avgDuration: formatDuration(avgDuration),
        uniqueUsers: uniqueUsers
      });
    }
  };
  
  // Open session details modal
  const openSessionDetails = async (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
    
    // Fetch detailed session information
    const details = await fetchSessionDetails(session.id);
    if (!details) {
      // If API call fails, use the basic session data
      setSessionDetails(session);
    }
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
    setSessionDetails(null);
  };
  
  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };
  
  // Apply filters
  useEffect(() => {
    if (sessions.length === 0) return;
    
    let filtered = [...sessions];
    
    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(session => session.status === filters.status);
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(session =>
        session.userName?.toLowerCase().includes(searchLower) ||
        session.userEmail?.toLowerCase().includes(searchLower) ||
        session.device?.toLowerCase().includes(searchLower) ||
        session.browser?.toLowerCase().includes(searchLower) ||
        session.ip?.includes(searchLower) ||
        session.locationString?.toLowerCase().includes(searchLower) ||
        session.sessionNumber?.toLowerCase().includes(searchLower)
      );
    }
    
    // Device filter
    if (filters.device !== 'all') {
      filtered = filtered.filter(session => 
        session.device?.toLowerCase().includes(filters.device.toLowerCase())
      );
    }
    
    // Date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(session => new Date(session.loginAt) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(session => new Date(session.loginAt) <= endDate);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];
      
      if (filters.sortBy === 'loginAt' || filters.sortBy === 'logoutAt' || filters.sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredSessions(filtered);
    setCurrentPage(1);
  }, [filters, sessions]);
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      search: '',
      startDate: '',
      endDate: '',
      device: 'all',
      sortBy: 'loginAt',
      sortOrder: 'desc'
    });
    setSelectedSessions([]);
    setSelectAll(false);
  };
  
  // Session actions
  const handleViewSession = (session) => {
    openSessionDetails(session);
  };
  
  const handleTerminateSession = async (sessionId) => {
    if (!confirm("Are you sure you want to terminate this session?")) return;
    
    try {
      const token = getCurrentToken();
      const userType = getCurrentUserType();
      
      let endpoint;
      if (userType === 'admin') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/terminate/${sessionId}`;
      } else if (userType === 'moderator') {
        endpoint = `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/terminate/${sessionId}`; // Moderator uses admin endpoint
      } else {
        toast.error("You don't have permission to terminate sessions");
        return;
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success("Session terminated successfully");
        fetchSessions();
        closeModal();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to terminate session");
      }
    } catch (error) {
      console.error("Terminate error:", error);
      toast.error("Failed to terminate session");
    }
  };
  
  const handleDeleteSession = async (sessionId) => {
    if (!confirm("Are you sure you want to delete this session? This action cannot be undone.")) return;
    
    try {
      const token = getCurrentToken();
      const userType = getCurrentUserType();
      
      // Only admin can delete sessions
      if (userType !== 'admin') {
        toast.error("Only administrators can delete sessions");
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/delete/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success("Session deleted successfully");
        fetchSessions();
        closeModal();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to delete session");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete session");
    }
  };
  
  // Session selection
  const handleSessionSelect = (sessionId) => {
    setSelectedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSessions([]);
    } else {
      const currentPageSessions = filteredSessions.slice(
        (currentPage - 1) * sessionsPerPage,
        currentPage * sessionsPerPage
      );
      setSelectedSessions(currentPageSessions.map(session => session.id));
    }
    setSelectAll(!selectAll);
  };
  
  // Bulk actions
  const handleBulkDelete = async () => {
    if (selectedSessions.length === 0) {
      toast.error("No sessions selected");
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedSessions.length} selected sessions? This action cannot be undone.`)) return;
    
    try {
      const token = getCurrentToken();
      const userType = getCurrentUserType();
      
      // Only admin can perform bulk delete
      if (userType !== 'admin') {
        toast.error("Only administrators can delete sessions");
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionIds: selectedSessions })
      });
      
      if (response.ok) {
        toast.success(`${selectedSessions.length} sessions deleted successfully`);
        setSelectedSessions([]);
        setSelectAll(false);
        fetchSessions();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to delete sessions");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Failed to delete sessions");
    }
  };
  
  const handleBulkTerminate = async () => {
    if (selectedSessions.length === 0) {
      toast.error("No sessions selected");
      return;
    }
    
    if (!confirm(`Are you sure you want to terminate ${selectedSessions.length} selected sessions?`)) return;
    
    try {
      const token = getCurrentToken();
      const userType = getCurrentUserType();
      
      // Admin and moderator can perform bulk terminate
      if (userType !== 'admin' && userType !== 'moderator') {
        toast.error("You don't have permission to terminate sessions");
        return;
      }
      
      const endpoint = userType === 'admin' 
        ? `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/bulk-terminate`
        : `${process.env.NEXT_PUBLIC_HRM_API_URL}/sessions/admin/bulk-terminate`; // Moderator uses admin endpoint
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionIds: selectedSessions })
      });
      
      if (response.ok) {
        toast.success(`${selectedSessions.length} sessions terminated successfully`);
        setSelectedSessions([]);
        setSelectAll(false);
        fetchSessions();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to terminate sessions");
      }
    } catch (error) {
      console.error("Bulk terminate error:", error);
      toast.error("Failed to terminate sessions");
    }
  };
  
  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Initial data fetch
  useEffect(() => {
    const init = async () => {
      try {
        const userData = await fetchUserProfile();
        if (userData) {
          console.log('👤 User loaded, fetching sessions...');
          await fetchSessions();
        }
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Failed to initialize');
      }
    };
    
    init();
  }, []);
  
  // Fetch sessions when page or per page changes
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [currentPage, sessionsPerPage]);
  
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      
      {/* Table Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="p-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Stats Cards Component
  const StatsCards = () => {
    const userType = getCurrentUserType();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Sessions */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Total Sessions</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
              <div className="flex items-center mt-2 text-sm">
                <Database className="w-4 h-4 mr-2" />
                <span>
                  {userType === 'employee' ? 'My sessions' : 'All time records'}
                </span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Server className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        {/* Active Sessions */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Active Now</p>
              <p className="text-3xl font-bold mt-2">{stats.active}</p>
              <div className="flex items-center mt-2 text-sm">
                <Activity className="w-4 h-4 mr-2" />
                <span>
                  {userType === 'employee' ? 'My active sessions' : 'Real-time tracking'}
                </span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        {/* Average Duration */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Avg Duration</p>
              <p className="text-3xl font-bold mt-2">{stats.avgDuration}</p>
              <div className="flex items-center mt-2 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>{stats.totalHours} total hours</span>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        {/* Unique Users - Hide for employees */}
        {userType !== 'employee' ? (
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Unique Users</p>
                <p className="text-3xl font-bold mt-2">{stats.uniqueUsers}</p>
                <div className="flex items-center mt-2 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Distinct accounts</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold mt-2">{stats.completed}</p>
                <div className="flex items-center mt-2 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Successfully ended</span>
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Filter Bar Component
  const FilterBar = () => {
    const userType = getCurrentUserType();
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  userType === 'employee' 
                    ? "Search my sessions by device, location, IP..."
                    : "Search sessions by user, device, location, IP..."
                }
                className="pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl w-full focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
            
            <button
              onClick={handleResetFilters}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <div className="flex space-x-2">
              <select
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="loginAt">Login Time</option>
                <option value="logoutAt">Logout Time</option>
                <option value="createdAt">Created At</option>
                <option value="durationMinutes">Duration</option>
              </select>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-700"
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Session Table Component
  const SessionTable = () => {
    const userType = getCurrentUserType();
    const canSelect = userType === 'admin' || userType === 'moderator';
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {userType === 'employee' ? 'My Session History' : 'Session History'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Showing {Math.min((currentPage - 1) * sessionsPerPage + 1, filteredSessions.length)} to{" "}
                {Math.min(currentPage * sessionsPerPage, filteredSessions.length)} of {filteredSessions.length} sessions
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title="Table View"
                >
                  <Table className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title="Card View"
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>
              
              {/* Bulk actions for admin and moderator */}
              {canSelect && selectedSessions.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBulkTerminate}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    Terminate ({selectedSessions.length})
                  </button>
                  
                  {/* Only admin can delete */}
                  {userType === 'admin' && (
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete ({selectedSessions.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {/* Show checkbox only for admin and moderator */}
                {canSelect && (
                  <th className="py-4 px-6 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                  </th>
                )}
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  User
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Session Details
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Device & Location
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Duration
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSessions
                .slice((currentPage - 1) * sessionsPerPage, currentPage * sessionsPerPage)
                .map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                  >
                    {/* Show checkbox only for admin and moderator */}
                    {canSelect && (
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedSessions.includes(session.id)}
                          onChange={() => handleSessionSelect(session.id)}
                          className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                      </td>
                    )}
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${session.roleColor.bg} text-white`}>
                          {session.userName?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {session.userName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {session.userEmail}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session.roleColor.light} mt-1`}>
                            {session.roleColor.icon} {session.userRole}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Hash className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {session.sessionNumber}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Login: {session.formattedLogin}
                        </div>
                        {session.logoutAt && (
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Logout: {session.formattedLogout}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Cpu className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm">{session.device} • {session.os}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Globe className="w-3 h-3 mr-2" />
                          <span>{session.browser}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-3 h-3 mr-2" />
                          <span className="truncate max-w-[180px]">{session.locationString}</span>
                        </div>
                        {session.ip && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            IP: {session.ip}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {session.formattedDuration}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${session.statusBadge.light}`}>
                        <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                        {session.statusBadge.text}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewSession(session)}
                          className="p-2 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        {/* Only show terminate button for active sessions and if user has permission */}
                        {(canSelect) && session.status === 'active' && (
                          <button
                            onClick={() => handleTerminateSession(session.id)}
                            className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                            title="Terminate Session"
                          >
                            <StopCircle className="w-5 h-5" />
                          </button>
                        )}
                        
                        {/* Only admin can delete sessions */}
                        {userType === 'admin' && (
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                            title="Delete Session"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          
          {filteredSessions.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No sessions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {getCurrentUserType() === 'employee' 
                  ? "You don't have any sessions yet. Try logging in from a different device."
                  : "Try adjusting your search or filter criteria to find what you're looking for."
                }
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Session Cards Component
  const SessionCards = () => {
    const userType = getCurrentUserType();
    const canSelect = userType === 'admin' || userType === 'moderator';
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions
          .slice((currentPage - 1) * sessionsPerPage, currentPage * sessionsPerPage)
          .map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group"
            >
              <div className="p-6">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${session.roleColor.bg} text-white`}>
                      {session.userName?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {session.userName}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session.roleColor.light}`}>
                          {session.roleColor.icon} {session.userRole}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session.statusBadge.light}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                          {session.statusBadge.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Show checkbox only for admin and moderator */}
                  {canSelect && (
                    <div className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={selectedSessions.includes(session.id)}
                        onChange={() => handleSessionSelect(session.id)}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                      />
                    </div>
                  )}
                </div>
                
                {/* Session Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <Hash className="w-4 h-4 mr-2" />
                      <span className="font-mono">{session.sessionNumber}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Login Time</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.formattedLogin}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {session.formattedDuration}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Device & Location */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      {session.deviceIcon || <Cpu className="w-5 h-5 text-gray-400 mr-3" />}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.device} • {session.os}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {session.browser}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                          {session.locationString}
                        </p>
                        {session.ip && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            IP: {session.ip}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {session.activities?.length || 0} activities
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewSession(session)}
                      className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-sm flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    
                    {canSelect && (
                      <div className="relative group/actions">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover/actions:block z-10">
                          {session.status === 'active' && (
                            <button
                              onClick={() => handleTerminateSession(session.id)}
                              className="w-full px-4 py-3 text-left text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-t-xl flex items-center"
                            >
                              <StopCircle className="w-4 h-4 mr-3" />
                              Terminate
                            </button>
                          )}
                          {/* Only show delete option for admin */}
                          {userType === 'admin' && (
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className={`w-full px-4 py-3 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 ${session.status === 'active' ? 'rounded-b-xl' : 'rounded-xl'} flex items-center`}
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };
  
  // Pagination Component
  const Pagination = () => {
    if (filteredSessions.length <= sessionsPerPage) return null;
    
    const startItem = (currentPage - 1) * sessionsPerPage + 1;
    const endItem = Math.min(currentPage * sessionsPerPage, filteredSessions.length);
    
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-semibold">{startItem}-{endItem}</span> of{" "}
            <span className="font-semibold">{filteredSessions.length}</span> sessions
          </p>
          <div className="flex items-center mt-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-3">Show:</span>
            <select
              value={sessionsPerPage}
              onChange={(e) => setSessionsPerPage(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl border ${
              currentPage === 1
                ? "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-xl ${
                  currentPage === pageNumber
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                    : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-xl border ${
              currentPage === totalPages
                ? "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };
  
  // Session Details Modal Component
  const SessionDetailsModal = () => {
    if (!isModalOpen || !selectedSession) return null;
    
    const session = sessionDetails || selectedSession;
    const userType = getCurrentUserType();
    const statusBadge = getStatusBadge(session.status);
    const roleColor = getRoleColor(session.userRole);
    const deviceInfo = parseDeviceInfo(session.userAgent);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="sticky top-0 z-10 px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${roleColor.bg}`}>
                  <Terminal className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Session Details
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {session.sessionNumber}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusBadge.light}`}>
                  <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                  {statusBadge.text}
                </span>
                
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Modal Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-8">
            {loadingDetails ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - User Info */}
                <div className="lg:col-span-1 space-y-6">
                  {/* User Card */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${roleColor.bg} text-white text-xl font-bold`}>
                        {session.userName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {session.userName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">{session.userEmail}</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleColor.light} mt-2`}>
                          {session.userRole}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400">User ID</span>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                            {session.userId?.slice(-8) || 'N/A'}
                          </code>
                          <button
                            onClick={() => copyToClipboard(session.userId)}
                            className="p-1 text-gray-500 hover:text-violet-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Session Status Card */}
                  <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Session Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Duration</span>
                        <span className="text-xl font-bold">{session.formattedDuration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Started</span>
                        <span>{session.formattedLogin}</span>
                      </div>
                      {session.logoutAt && (
                        <div className="flex items-center justify-between">
                          <span>Ended</span>
                          <span>{session.formattedLogout}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Activities</span>
                        <span className="text-xl font-bold">{session.activities?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Middle Column - Device & Location */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Device Information */}
                  <div className="bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <CpuIcon className="w-5 h-5 mr-2 text-violet-600" />
                      Device Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                          {deviceInfo.deviceIcon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{session.device}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{session.os}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getBrowserIcon(session.browser)}
                            <span className="text-sm text-gray-600 dark:text-gray-300">Browser</span>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">{session.browser}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-5 h-5 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">Language</span>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">{session.language || 'en-US'}</p>
                        </div>
                      </div>
                      
                      {session.userAgent && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Terminal className="w-5 h-5 text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">User Agent</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(session.userAgent)}
                              className="p-1 text-gray-500 hover:text-violet-600"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <code className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg block overflow-x-auto">
                            {session.userAgent}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Location Information */}
                  <div className="bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                      Location Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <MapIcon className="w-6 h-6 text-emerald-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{session.locationString}</h4>
                          {session.location?.region && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">{session.location.region}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-5 h-5 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">IP Address</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <code className="font-mono text-gray-900 dark:text-gray-100">{session.ip}</code>
                            <button
                              onClick={() => copyToClipboard(session.ip)}
                              className="p-1 text-gray-500 hover:text-violet-600"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Activities & Actions */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Session Timeline */}
                  <div className="bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <ActivityIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Session Timeline
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
                        
                        {/* Login Event */}
                        <div className="relative flex items-start mb-8">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center z-10">
                            <LogIn className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="ml-6">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Session Started</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(session.loginAt)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Login successful</p>
                          </div>
                        </div>
                        
                        {/* Activities */}
                        {session.activities?.slice(0, 3).map((activity, index) => (
                          <div key={index} className="relative flex items-start mb-6">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center z-10">
                              <ActivityIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-6">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{activity.action || 'Activity'}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {activity.timestamp ? formatDate(activity.timestamp) : 'N/A'}
                              </p>
                              {activity.details && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.details}</p>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Logout Event */}
                        {session.logoutAt && (
                          <div className="relative flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center z-10">
                              <LogOutIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="ml-6">
                              <h4 className="font-semibold text-gray-900 dark:text-white">Session Ended</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(session.logoutAt)}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {session.status === 'terminated' ? 'Session terminated' : 'Normal logout'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {session.activities && session.activities.length > 3 && (
                        <button className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          View {session.activities.length - 3} more activities
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Session Actions */}
                  <div className="bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Session Actions</h3>
                    
                    <div className="space-y-3">
                      {/* Terminate Session Button (for active sessions) */}
                      {(userType === 'admin' || userType === 'moderator') && session.status === 'active' && (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          className="w-full flex items-center justify-center space-x-2 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          <StopCircle className="w-5 h-5" />
                          <span>Terminate Session</span>
                        </button>
                      )}
                      
                      {/* Delete Session Button (admin only) */}
                      {userType === 'admin' && (
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="w-full flex items-center justify-center space-x-2 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span>Delete Session Record</span>
                        </button>
                      )}
                    </div>
                    
                    {/* Technical Details */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Technical Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Session ID</span>
                          <code className="font-mono text-gray-900 dark:text-gray-100">{session.id?.slice(-12)}</code>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Created</span>
                          <span className="text-gray-900 dark:text-gray-100">{session.createdAt ? formatDateShort(session.createdAt) : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                          <span className="text-gray-900 dark:text-gray-100">{session.updatedAt ? formatDateShort(session.updatedAt) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="sticky bottom-0 px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Session ID: <code className="font-mono">{session.id}</code>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    copyToClipboard(JSON.stringify(session, null, 2));
                    toast.success("Session data copied to clipboard");
                  }}
                  className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Copy Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Main render
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <LoadingSkeleton />
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  const userType = getCurrentUserType();
  const userName = user.firstName || user.name || user.fullName || 'User';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push(getUserDashboard(userType))}
                className="flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center group-hover:from-violet-700 group-hover:to-purple-700 transition-all">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Session Manager
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {userType === 'admin' ? 'Admin Dashboard' : 
                     userType === 'moderator' ? 'Moderator View' : 
                     'My Sessions'}
                  </p>
                </div>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchSessions}
                className="p-2 text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user.role || userType}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleColor(user.role || userType).bg} text-white`}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push('/hrm');
                }}
                className="p-2 text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {userName}!
              </h2>
              <p className="text-violet-100">
                {userType === 'admin' 
                  ? 'Manage all user sessions and monitor activity in real-time.'
                  : userType === 'moderator'
                  ? 'Monitor user sessions and manage access.'
                  : 'Track your login sessions and activities.'
                }
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm">
                <Shield className="w-4 h-4 mr-2" />
                {userType === 'admin' ? 'Admin Access' : 
                 userType === 'moderator' ? 'Moderator Access' : 
                 'Employee Access'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Filter Bar */}
        <FilterBar />
        
        {/* Sessions Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {viewMode === 'table' ? <SessionTable /> : <SessionCards />}
            <Pagination />
          </>
        )}
      </main>
      
      {/* Session Details Modal */}
      <SessionDetailsModal />
    </div>
  );
}