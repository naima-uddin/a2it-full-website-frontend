// src/services/mealService.js
import { API_URL, ENDPOINTS } from '@/utils/mealApi';

class MealService {
  constructor() {
    this.baseURL = API_URL;
  }

  getHeaders(token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  getCurrentToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("adminToken") || 
             localStorage.getItem("employeeToken") || 
             localStorage.getItem("moderatorToken");
    }
    return null;
  }

  // User Profile
  async getProfile() {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.GET_PROFILE}`, {
      headers: this.getHeaders(token)
    });
    return response.json();
  }

  // Departments
  async getDepartments() {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.GET_DEPARTMENTS}`, {
      headers: this.getHeaders(token)
    });
    return response.json();
  }

  // ============ EMPLOYEE ROUTES ============
  
  // Daily Meal Request
  async requestDailyMeal(data) {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.REQUEST_MEAL}`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Get My Daily Meals
  async getMyDailyMeals(params = {}) {
    const token = this.getCurrentToken();
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseURL}${ENDPOINTS.MY_MEAL_REQUESTS}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getHeaders(token)
    });
    return response.json();
  }

  // Cancel Daily Meal
  async cancelDailyMeal(data) {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.CANCEL_MEAL}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // ============ SUBSCRIPTION ROUTES ============
  
  // Setup Monthly Subscription
  async setupSubscription(data) {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.SETUP_SUBSCRIPTION}`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Cancel Subscription
  async cancelSubscription(data) {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.CANCEL_SUBSCRIPTION}`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Update Auto Renew
  async updateAutoRenew(data) {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.UPDATE_AUTO_RENEW}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Get My Subscription Details
  async getMySubscription() {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.MY_SUBSCRIPTION}`, {
      headers: this.getHeaders(token)
    });
    return response.json();
  }

  // Update Preference
  async updatePreference(data) {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.UPDATE_PREFERENCE}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // ============ DASHBOARD ============
  
  async getDashboardStats() {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.DASHBOARD_STATS}`, {
      headers: this.getHeaders(token)
    });
    return response.json();
  }

  // ============ ADMIN ROUTES ============
  
  // Get All Subscriptions
  async getAllSubscriptions(params = {}) {
    const token = this.getCurrentToken();
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseURL}${ENDPOINTS.ALL_SUBSCRIPTIONS}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getHeaders(token)
    });
    return response.json();
  }

  // Admin Create Subscription
  async adminCreateSubscription(data) {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.ADMIN_CREATE_SUBSCRIPTION}`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Admin Approve Subscription
  async adminApproveSubscription(data) {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.ADMIN_APPROVE_SUBSCRIPTION}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Get Pending Approvals
  async getPendingApprovals() {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.PENDING_APPROVALS}`, {
      headers: this.getHeaders(token)
    });
    return response.json();
  }

  // Get Monthly Report
  async getMonthlyReport(params = {}) {
    const token = this.getCurrentToken();
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseURL}${ENDPOINTS.MONTHLY_REPORT}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getHeaders(token)
    });
    return response.json();
  }

  // Export Payroll Data
  async exportPayrollData(params = {}) {
    const token = this.getCurrentToken();
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseURL}${ENDPOINTS.PAYROLL_EXPORT}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getHeaders(token)
    });
    return response.json();
  }

  // Update Meal Days
  async updateMealDays(data) {
    const token = this.getCurrentToken();
    const response = await fetch(`${this.baseURL}${ENDPOINTS.UPDATE_MEAL_DAYS}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export default new MealService();