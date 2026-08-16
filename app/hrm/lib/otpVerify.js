// 📁 app/lib/api.js

// ✅ Fix 1: আলাদা API ফাংশন তৈরি করুন
const handleAdminRequestOtp = async () => {
  if (!selectedUserForReset?.email) {
    toast.error('Please select a user first');
    return;
  }

  setOtpLoading(true);
  
  const loadingToast = toast.custom(
    (t) => (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl shadow-xl max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="font-bold">Generating OTP...</p>
            <p className="text-sm opacity-90">For: {selectedUserForReset.email}</p>
          </div>
        </div>
      </div>
    ),
    { duration: Infinity, position: 'top-center' }
  );

  try {
    const result = await adminRequestOtpAPI({
      userEmail: selectedUserForReset.email // শুধু userEmail পাঠানো
    });

    toast.dismiss(loadingToast);
    console.log('OTP Response:', result);

    if (result.status === "success") {
      // OTP show করা
      const otp = result.otp || result.data?.otp;
      
      toast.custom(
        (t) => (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">✅ OTP Generated!</h3>
                  <p className="text-sm opacity-90">
                    Admin: {adminEmail}<br/>
                    User: {selectedUserForReset.email}
                  </p>
                </div>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* OTP Display */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-600 mb-2">Your 6-digit OTP Code</div>
                <div className="text-5xl font-mono font-bold text-gray-900 tracking-widest my-4">
                  {otp}
                </div>
                <div className="text-xs text-gray-500">
                  Check admin email for OTP
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setResetData(prev => ({ ...prev, otp: otp.toString() }));
                    setResetStep(2);
                    toast.dismiss(t.id);
                    toast.success('OTP auto-filled!', { duration: 2000 });
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all"
                >
                  Auto-fill OTP & Continue
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(otp);
                    toast.success('OTP copied to clipboard!', { duration: 2000 });
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-50"
                >
                  📋 Copy OTP
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>OTP ID: {result.otpId?.slice(-6) || 'N/A'}</span>
                <span>Step 1 of 3</span>
              </div>
            </div>
          </div>
        ),
        {
          duration: 30000,
          position: 'top-center'
        }
      );
      
      // Auto move to step 2
      setTimeout(() => {
        if (resetStep === 1) {
          setResetData(prev => ({ ...prev, otp: otp.toString() }));
          setResetStep(2);
          toast.success('Auto-proceeding to next step...', { duration: 2000 });
        }
      }, 5000);
      
    } else {
      toast.error(result.message || 'Failed to generate OTP');
    }
    
  } catch (error) {
    toast.dismiss(loadingToast);
    console.error('OTP Error:', error);
    
    let errorMessage = 'Failed to generate OTP';
    if (error.message.includes('404')) {
      errorMessage = 'User not found';
    } else if (error.message.includes('network')) {
      errorMessage = 'Network error. Check connection.';
    }
    
    toast.error(`❌ ${errorMessage}`);
  } finally {
    setOtpLoading(false);
  }
};

// ✅ Fix 2: Admin Verify OTP API যোগ করুন
const handleAdminVerifyOtpAndReset = async () => {
  if (!resetData.otp || resetData.otp.length !== 6) {
    toast.error('Please enter a valid 6-digit OTP');
    return;
  }

  if (resetData.newPassword !== resetData.confirmPassword) {
    toast.error("Passwords don't match!");
    return;
  }

  if (resetData.newPassword.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  setResetPasswordLoading(true);
  
  const loadingToast = toast.custom(
    (t) => (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl shadow-xl max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="font-bold">Resetting Password...</p>
            <p className="text-sm opacity-90">{selectedUserForReset.email}</p>
          </div>
        </div>
      </div>
    ),
    { duration: Infinity, position: 'top-center' }
  );

  try {
    console.log('🔐 Resetting password for:', selectedUserForReset.email);
    
    const result = await adminResetPasswordAPI({
      userEmail: selectedUserForReset.email,
      otp: resetData.otp,
      newPassword: resetData.newPassword
    });

    console.log('🔑 Reset Password Response:', result);
    toast.dismiss(loadingToast);

    if (result.status === "success") {
      toast.success(`✅ Password for ${selectedUserForReset.email} reset successfully!`, {
        duration: 5000,
        icon: '🔑'
      });
      
      // Close reset page
      handleCloseResetPasswordPage();
      
      // Refresh users
      fetchUsers();
    } else {
      toast.error(result.message || 'Failed to reset password');
    }
  } catch (error) {
    toast.dismiss(loadingToast);
    console.error('Reset Password Error:', error);
    
    if (error.message.includes('Invalid OTP')) {
      toast.error('❌ Invalid OTP. Please check and try again.');
    } else if (error.message.includes('400')) {
      toast.error('❌ Invalid request. Please check all fields.');
    } else if (error.message.includes('404')) {
      toast.error('❌ User not found.');
    } else {
      toast.error(`❌ ${error.message}`);
    }
  } finally {
    setResetPasswordLoading(false);
  }
};

// ✅ Fix 3: Admin Reset Password API যোগ করুন
const handleOpenResetPasswordPage = (user) => {
  setSelectedUserForReset(user);
  
  // Reset Data সেট করা
  setResetData({
    email: adminEmail, // Admin email শুধু দেখানোর জন্য
    userEmail: user.email, // User email আলাদাভাবে রাখা
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  setResetStep(1);
  setShowResetPasswordPage(true);
  
  console.log('📧 Opening reset for:', {
    adminEmail: adminEmail,
    userEmail: user.email
  });
};