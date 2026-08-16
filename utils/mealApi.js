// src/utils/api.js
export const API_URL = process.env.NEXT_PUBLIC_HRM_API_URL || 'http://localhost:5000/api';

// Auth endpoints
export const ENDPOINTS = {
  // User
  GET_PROFILE: '/users/getProfile',
  GET_DEPARTMENTS: '/users/departments',
  
  // Meal - Employee routes
  REQUEST_MEAL: '/meal/daily/request',
  MY_MEAL_REQUESTS: '/meal/daily/my-meals',
  CANCEL_MEAL: '/meal/daily/cancel',
  
  // Meal Subscription
  SETUP_SUBSCRIPTION: '/meal/subscription/setup',
  CANCEL_SUBSCRIPTION: '/meal/subscription/cancel',
  UPDATE_AUTO_RENEW: '/meal/subscription/update-auto-renew',
  MY_SUBSCRIPTION: '/meal/subscription/my-details',
  UPDATE_PREFERENCE: '/meal/subscription/update-preference',
  
  // Dashboard
  DASHBOARD_STATS: '/meal/dashboard/stats',
  
  // Admin routes
  ALL_SUBSCRIPTIONS: '/meal/admin/subscriptions/all',
  ADMIN_CREATE_SUBSCRIPTION: '/meal/admin/subscription/create',
  ADMIN_APPROVE_SUBSCRIPTION: '/meal/admin/subscription/approve',
  PENDING_APPROVALS: '/meal/admin/pending-approvals',
  MONTHLY_REPORT: '/meal/admin/monthly-report',
  PAYROLL_EXPORT: '/meal/admin/payroll-export',
  UPDATE_MEAL_DAYS: '/meal/admin/update-meal-days'
};