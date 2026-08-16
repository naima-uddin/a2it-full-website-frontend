"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Calendar, Check, X, Users, DollarSign, Clock, AlertCircle, Loader2 } from "lucide-react";

const MealRequest = ({ user, token, onRequestUpdate }) => {
  const [mealData, setMealData] = useState({
    date: new Date().toISOString().split('T')[0],
    requests: [],
    summary: null,
    loading: false,
    requesting: false,
    showCalendar: false,
    selectedDate: new Date().toISOString().split('T')[0]
  });

  // Fetch meal data
  const fetchMealData = async (date = null) => {
    try {
      setMealData(prev => ({ ...prev, loading: true }));
      
      const selectedDate = date || mealData.selectedDate;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HRM_API_URL}/food-cost/meal-summary?date=${selectedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMealData(prev => ({
          ...prev,
          summary: data.data,
          loading: false
        }));
      } else {
        toast.error('Failed to fetch meal data');
        setMealData(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error fetching meal data:', error);
      toast.error('Network error');
      setMealData(prev => ({ ...prev, loading: false }));
    }
  };

  // Request meal
  const handleRequestMeal = async () => {
    if (!user.workLocationType === 'onsite') {
      toast.error('Only onsite employees can request meals');
      return;
    }

    if (mealData.requesting) return;

    setMealData(prev => ({ ...prev, requesting: true }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HRM_API_URL}/food-cost/request-meal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: mealData.selectedDate
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Meal request submitted successfully!');
        fetchMealData();
        if (onRequestUpdate) onRequestUpdate();
      } else {
        toast.error(data.message || 'Failed to submit meal request');
      }
    } catch (error) {
      console.error('Error requesting meal:', error);
      toast.error('Network error');
    } finally {
      setMealData(prev => ({ ...prev, requesting: false }));
    }
  };

  // Cancel meal request
  const handleCancelRequest = async () => {
    if (!confirm("Are you sure you want to cancel your meal request?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HRM_API_URL}/food-cost/cancel-meal-request/${mealData.selectedDate}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Meal request cancelled!');
        fetchMealData();
        if (onRequestUpdate) onRequestUpdate();
      } else {
        toast.error(data.message || 'Failed to cancel meal request');
      }
    } catch (error) {
      console.error('Error cancelling meal request:', error);
      toast.error('Network error');
    }
  };

  // Check if user has requested meal for selected date
  const hasUserRequested = () => {
    if (!mealData.summary) return false;
    
    const allRequests = [
      ...(mealData.summary.approved?.employees || []),
      ...(mealData.summary.pending?.employees || [])
    ];
    
    return allRequests.some(req => req.id === user._id);
  };

  // Check if user's request is approved
  const isUserRequestApproved = () => {
    if (!mealData.summary) return false;
    
    return mealData.summary.approved?.employees?.some(
      req => req.id === user._id
    ) || false;
  };

  useEffect(() => {
    if (user && token) {
      fetchMealData();
    }
  }, [user, token, mealData.selectedDate]);

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shadow-sm">
            <Users className="text-orange-600" size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Meal Request</h3>
            <p className="text-sm text-gray-600">Request your daily meal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setMealData(prev => ({ ...prev, showCalendar: !prev.showCalendar }))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Calendar size={16} />
              {new Date(mealData.selectedDate).toLocaleDateString()}
            </button>
            
            {mealData.showCalendar && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-10">
                <input
                  type="date"
                  value={mealData.selectedDate}
                  onChange={(e) => {
                    setMealData(prev => ({ 
                      ...prev, 
                      selectedDate: e.target.value,
                      showCalendar: false 
                    }));
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meal Request Status */}
      <div className="mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Today's Meal Request</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.workLocationType === 'onsite' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {user.workLocationType === 'onsite' ? 'Eligible' : 'Not Eligible'}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Your Work Type:</span>
              <span className="font-medium text-gray-900 capitalize">{user.workLocationType}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Meal Eligibility:</span>
              <span className={`font-medium ${
                user.mealEligibility ? 'text-green-600' : 'text-gray-600'
              }`}>
                {user.mealEligibility ? 'Yes' : 'No'}
              </span>
            </div>
            
            {user.hasRequestedMeal && user.mealRequestDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Request Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date(user.mealRequestDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Meal Summary */}
        {mealData.loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : mealData.summary ? (
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">Meal Summary for {new Date(mealData.selectedDate).toLocaleDateString()}</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="text-gray-500" size={16} />
                  <span className="text-sm text-gray-600">Total Requesters</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {mealData.summary.totalRequesters || 0}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="text-gray-500" size={16} />
                  <span className="text-sm text-gray-600">Cost per Person</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  ৳{mealData.summary.costPerPerson?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {mealData.summary.approved?.employees?.length > 0 && (
                <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="text-green-600" size={16} />
                    <span className="text-sm font-medium text-green-800">Approved ({mealData.summary.approved.count})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mealData.summary.approved.employees.slice(0, 3).map(emp => (
                      <span key={emp.id} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {emp.name.split(' ')[0]}
                      </span>
                    ))}
                    {mealData.summary.approved.count > 3 && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        +{mealData.summary.approved.count - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {mealData.summary.pending?.employees?.length > 0 && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-yellow-600" size={16} />
                    <span className="text-sm font-medium text-yellow-800">Pending ({mealData.summary.pending.count})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mealData.summary.pending.employees.slice(0, 3).map(emp => (
                      <span key={emp.id} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        {emp.name.split(' ')[0]}
                      </span>
                    ))}
                    {mealData.summary.pending.count > 3 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        +{mealData.summary.pending.count - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-600">No meal data available for this date</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {user.workLocationType === 'onsite' && (
        <div className="flex gap-3">
          {!hasUserRequested() ? (
            <button
              onClick={handleRequestMeal}
              disabled={mealData.requesting || new Date(mealData.selectedDate) < new Date()}
              className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mealData.requesting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Requesting...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Request Meal
                </>
              )}
            </button>
          ) : isUserRequestApproved() ? (
            <button
              disabled
              className="flex-1 px-4 py-3 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Meal Approved
            </button>
          ) : (
            <div className="flex gap-3 w-full">
              <button
                disabled
                className="flex-1 px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200 flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Request Pending
              </button>
              <button
                onClick={handleCancelRequest}
                className="px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> 
          {user.workLocationType === 'onsite' 
            ? ' You can request meals only for current or future dates. Each meal request costs ৳100 (deducted from salary).' 
            : ' Only onsite employees are eligible for meal requests.'}
        </p>
      </div>
    </div>
  );
};

export default MealRequest;