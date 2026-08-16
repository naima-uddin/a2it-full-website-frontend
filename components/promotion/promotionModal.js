"use client";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { redirectToThankYou } from "../shared/contactSuccessRedirect";

const PromotionModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState("popular");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    projectDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          projectDescription: "",
        });
        setSelectedPlan("popular");
        setSubmitStatus(null);
        setFormErrors({});
      }, 300);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [plans, setPlans] = useState([]);

  // Fetch promotional packages from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "https://a2it-dashboard-backend.vercel.app";
        const res = await fetch(`${backendUrl}/api/promotional-packages`);
        const json = await res.json();

        // Support APIs that return either an array or an object { success, packages }
        let packagesArray = null;
        if (Array.isArray(json)) {
          packagesArray = json;
        } else if (json && Array.isArray(json.packages)) {
          packagesArray = json.packages;
        }

        if (res.ok && Array.isArray(packagesArray)) {
          const mapped = packagesArray
            .filter((p) => p.isActive !== false)
            .map((p) => ({
              value: p._id || (p.name || "").toLowerCase().replace(/\s+/g, "-"),
              label: p.name || "",
              price: p.newPrice || p.oldPrice || "",
              badge: p.badge || "",
              features: p.features || [],
            }));
          setPlans(mapped);
        } else {
          console.error("Failed to load promotional packages", json);
        }
      } catch (err) {
        console.error("Error fetching promotional packages", err);
      }
    };

    fetchPlans();
  }, []);

  // Ensure selectedPlan is valid when plans update
  useEffect(() => {
    if (plans.length > 0) {
      const found = plans.find((p) => p.value === selectedPlan);
      if (!found) setSelectedPlan(plans[0].value);
    }
  }, [plans]);

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const selectedPlanData = plans.find((p) => p.value === selectedPlan);

      // Replace with your actual backend URL
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://a2it-dashboard-backend.vercel.app";

      const response = await fetch(`${backendUrl}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message:
            formData.projectDescription || "No project description provided",
          type: "product_inquiry",
          subject: `🔔 NEW PRODUCT INQUIRY: ${selectedPlanData?.label} Plan - 70% OFF`,
          model: `${selectedPlanData?.label} Plan - ${selectedPlanData?.price}`,
          shippingTerm: `Selected Plan: ${selectedPlanData?.label} (${selectedPlanData?.badge}) - Features: ${selectedPlanData?.features.join(", ")}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          projectDescription: "",
        });
        setSelectedPlan("popular");

        // Redirect to thank-you page
        redirectToThankYou(router);
        return;
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlanData = plans.find((p) => p.value === selectedPlan);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content with animation */}
      <div className="relative bg-white rounded-2xl max-w-md w-full mx-auto shadow-2xl transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7e602c] via-[#f5b342] to-[#7e602c]"></div>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#7e602c] to-[#f5b342] p-5 sm:p-6 text-white flex-shrink-0 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors z-20 bg-black/20 hover:bg-black/30 rounded-full p-1.5"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center relative z-10">
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3 border border-white/30">
              🎉 LIMITED TIME OFFER
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              ACTIVATE YOUR <span className="text-yellow-300">70% OFF</span>
            </h2>
            <p className="text-sm sm:text-base text-white/90 px-4">
              Everywhere & Every Device, Your Site Should Flow Seamlessly!
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                Thank you for your interest!
              </p>
              <p className="text-xs text-green-600 mt-1">
                We've received your consultation request. Our team will contact
                you within 24 hours.
              </p>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Something went wrong</p>
              <p className="text-xs text-red-600 mt-1">
                Please try again or contact us directly at
                support@yourcompany.com
              </p>
            </div>
          </div>
        )}

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Plan Selection Card */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Choose Your Plan <span className="text-[#f5b342]">*</span>
              </label>

              {/* Plan Selection Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {plans.map((plan) => (
                  <button
                    key={plan.value}
                    type="button"
                    onClick={() => setSelectedPlan(plan.value)}
                    className={`relative p-2 rounded-lg text-center transition-all ${
                      selectedPlan === plan.value
                        ? "bg-[#f5b342] text-white shadow-md scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <span className="block text-xs font-bold">
                      {plan.label}
                    </span>
                    <span
                      className={`block text-[10px] mt-0.5 ${
                        selectedPlan === plan.value
                          ? "text-white/90"
                          : "text-gray-500"
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.badge === "BEST VALUE" && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        🔥 BEST
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Selected Plan Features */}
              {selectedPlanData && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 mt-2">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    ✨ Plan Features:
                  </p>
                  <ul className="space-y-1">
                    {selectedPlanData.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-xs text-gray-600 flex items-center gap-1.5"
                      >
                        <span className="text-[#f5b342]">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Full Name <span className="text-[#f5b342]">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-sm border ${
                  formErrors.fullName
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                } rounded-xl focus:ring-2 focus:ring-[#f5b342] focus:border-transparent outline-none transition`}
                placeholder="John Doe"
              />
              {formErrors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Email Address <span className="text-[#f5b342]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-sm border ${
                  formErrors.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                } rounded-xl focus:ring-2 focus:ring-[#f5b342] focus:border-transparent outline-none transition`}
                placeholder="john@example.com"
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Phone Number <span className="text-[#f5b342]">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-sm border ${
                  formErrors.phone
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                } rounded-xl focus:ring-2 focus:ring-[#f5b342] focus:border-transparent outline-none transition`}
                placeholder="+1 (555) 000-0000"
              />
              {formErrors.phone && (
                <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Project Description{" "}
                <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 text-sm border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[#f5b342] focus:border-transparent outline-none transition resize-none"
                placeholder="Tell us about your project, goals, and requirements..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#f5b342] to-[#e4a231] text-white font-bold py-4 px-4 rounded-xl text-sm hover:from-[#e4a231] hover:to-[#d39221] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  SENDING REQUEST...
                </>
              ) : (
                "ACTIVATE 70% OFF NOW"
              )}
            </button>

            {/* Trust Badge */}
            <p className="text-xs text-center text-gray-400 mt-4">
              🔒 Your information is secure and will never be shared
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
