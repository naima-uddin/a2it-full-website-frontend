"use client";

import React, { useState, useEffect } from "react";
import { 
  Sun, Moon, User, Briefcase, Clock, 
  CheckCircle, XCircle, Calendar, TrendingUp,
  Timer, LogIn, LogOut, MapPin, Smartphone,
  Sparkles, Star, Award, Shield, RefreshCw,
  ChevronRight, MoreVertical, Filter
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function EmployeeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("Loading...");
  const [greetingIcon, setGreetingIcon] = useState(null);
  const [greetingColor, setGreetingColor] = useState("from-purple-500 to-pink-500");
  const [loading, setLoading] = useState(false);
  
  // Your actual data states
  const [userData, setUserData] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [summary, setSummary] = useState(null);
  
  // Get greeting based on time
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour < 12) {
        setGreeting("Good Morning");
        setGreetingIcon(<Sun className="text-yellow-300" size={28} />);
        setGreetingColor("from-purple-500 via-purple-600 to-pink-500");
      } else if (hour < 17) {
        setGreeting("Good Afternoon");
        setGreetingIcon(<Sun className="text-amber-400" size={28} />);
        setGreetingColor("from-purple-600 via-pink-600 to-rose-500");
      } else if (hour < 20) {
        setGreeting("Good Evening");
        setGreetingIcon(<Moon className="text-purple-300" size={28} />);
        setGreetingColor("from-purple-700 via-indigo-600 to-purple-800");
      } else {
        setGreeting("Good Night");
        setGreetingIcon(<Moon className="text-blue-300" size={28} />);
        setGreetingColor("from-purple-800 via-indigo-700 to-purple-900");
      }
    };

    updateGreeting();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Load user data from localStorage or API
  useEffect(() => {
    const loadUserData = () => {
      try {
        const token = localStorage.getItem("employeeToken");
        if (token) {
          // Decode token or fetch user data
          const storedUser = localStorage.getItem("employeeData");
          if (storedUser) {
            setUserData(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const formatTime = (date) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString('en-BD', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-BD', {
      timeZone: 'Asia/Dhaka',
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Refreshing data...");
    setTimeout(() => {
      setLoading(false);
      toast.success("Data refreshed!");
    }, 1000);
  };

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-6">
        
        {/* ===================== GREETINGS HEADER ===================== */}
        <div className={`bg-gradient-to-r ${greetingColor} rounded-2xl p-6 mb-6 shadow-xl border border-white/20 relative overflow-hidden`}>
          
          {/* Animated Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              
              {/* Greeting and User Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  {greetingIcon}
                </div>
                
                <div>
                  <div className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                    {greeting} <Sparkles className="inline ml-2" size={16} />
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mt-2">
                    {userData?.firstName || "Employee"} {userData?.lastName || ""}
                  </h1>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white flex items-center gap-2">
                      <Briefcase size={14} />
                      {userData?.department || "Department"}
                    </div>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white flex items-center gap-2">
                      <Star size={14} />
                      ID: {userData?.employeeId || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Time */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="text-center">
                  <div className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                    Current Time
                  </div>
                  <div className="text-4xl font-bold text-white mb-1 font-mono">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-sm text-white/80">
                    {formatDate(currentTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </>
  );
}