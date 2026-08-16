"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { redirectToThankYou } from "../shared/contactSuccessRedirect";
import {
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Sparkles,
  Award,
  Shield,
  MessageSquare,
  User,
  Smartphone,
} from "lucide-react";

export default function PromotionFooter() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const router = useRouter();

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        if (!/^[a-zA-Z\s]*$/.test(value))
          return "Name can only contain letters";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email";
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^[\d\s\+\-\(\)]{10,}$/.test(value.replace(/\D/g, "")))
          return "Please enter a valid phone number";
        return "";

      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear status when user starts typing
    if (submitStatus) setSubmitStatus(null);

    // Real-time validation
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    });

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      try {
        const response = await fetch(
          "https://a2it-dashboard-backend.vercel.app/api/send-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "footer_inquiry",
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              message: formData.message,
              subject: `📞 New Consultation: ${formData.name} - Free Consultation Request`,
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          setSubmitStatus("success");
          setFormData({ name: "", email: "", phone: "", message: "" });

          // Redirect to thank-you page
          redirectToThankYou(router);
          return;
        } else {
          setSubmitStatus("error");
          console.error("Submission error:", data.error);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getInputStyle = (fieldName) => {
    const baseStyle =
      "w-full px-4 pt-3.5 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 border";

    if (touched[fieldName]) {
      if (errors[fieldName]) {
        return `${baseStyle} border-red-500/50 focus:ring-2 focus:ring-red-500 bg-red-500/5`;
      } else if (formData[fieldName]) {
        return `${baseStyle} border-green-500/50 focus:ring-2 focus:ring-green-500 bg-green-500/5`;
      }
    }

    return `${baseStyle} border-white/10 focus:ring-2 focus:ring-orange-500 hover:border-orange-500/30`;
  };

  return (
    <footer className="relative w-full text-white overflow-hidden min-h-[400px]">
      {/* Animated Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 hover:scale-100 transition-transform duration-10000"
        style={{
          backgroundImage: "url('/images/footer.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/80 to-orange-950/80"></div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-40 right-40 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>

      {/* Main Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 pb-2 pt-8 flex flex-col justify-between">
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Content - Enhanced */}
          <div className="space-y-5">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:border-orange-500/50 transition-all duration-300 group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium tracking-wider group-hover:text-orange-300 transition-colors">
                ✦ LIMITED TIME OFFER ✦
              </span>
              <Sparkles className="w-3 h-3 text-orange-400 animate-spin-slow" />
            </div>

            {/* Animated Heading */}
            <h2 className="relative">
              <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent animate-gradient">
                Transform Your
              </span>
              <br />
              <span className="text-4xl md:text-5xl font-bold inline-flex items-center gap-3">
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Digital Presence
                </span>
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-bounce" />
              </span>
            </h2>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Award, text: "Expert Team" },
                { icon: Clock, text: "24/7 Support" },
                { icon: Shield, text: "100% Secure" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-orange-500/30 transition-all group"
                >
                  <feature.icon className="w-3.5 h-3.5 text-orange-400 group-hover:rotate-12 transition-transform" />
                  <span className="text-xs text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Description with Icon */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5" />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Join{" "}
                <span className="text-orange-400 font-semibold">
                  Designs A2it
                </span>{" "}
                and get a
                <span className="text-white font-semibold">
                  {" "}
                  FREE consultation
                </span>{" "}
                worth $99! Our experts are ready to bring your vision to life.
              </p>
            </div>

            {/* Contact Info with Hover Effects */}
            <div className="grid grid-cols-2 gap-3">
              <a href="mailto:service@a2itltd.com" className="group">
                <div className="flex items-center gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-orange-500 hover:bg-orange-500/10 transition-all">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4 text-orange-400 group-hover:text-orange-300" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Email Us</p>
                    <p className="text-xs font-medium group-hover:text-orange-300 transition-colors">
                      service@a2itltd.com
                    </p>
                  </div>
                </div>
              </a>

              <a href="tel:+8801846937397" className="group">
                <div className="flex items-center gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-orange-500 hover:bg-orange-500/10 transition-all">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4 text-orange-400 group-hover:text-orange-300" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Call Now</p>
                    <p className="text-xs font-medium group-hover:text-orange-300 transition-colors">
                      +880 1846-937397
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Form - Premium Design with Validation */}
          <div className="lg:ml-6">
            <div className="relative group/form">
              {/* Animated border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl opacity-0 group-hover/form:opacity-20 blur transition duration-1000"></div>

              <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl p-5 rounded-2xl border border-white/20">
                {/* Header with Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                      Free Consultation
                    </h3>
                    <p className="text-gray-400 text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Response: 2 hours</span>
                    </p>
                  </div>
                </div>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <div className="mb-3 p-2 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2 animate-slideDown">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <p className="text-xs text-green-400">
                      Thanks! We'll contact you within 2 hours.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 animate-slideDown">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-xs text-red-400">
                      Failed to send. Please try again.
                    </p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {/* Name */}
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.name && touched.name ? "text-red-400" : formData.name ? "text-green-400" : "text-gray-400"}`}
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Full name"
                      className={`${getInputStyle("name")} pl-9 py-2.5 text-sm`}
                      disabled={isSubmitting}
                    />
                    {touched.name && errors.name && (
                      <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email && touched.email ? "text-red-400" : formData.email ? "text-green-400" : "text-gray-400"}`}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Email"
                      className={`${getInputStyle("email")} pl-9 py-2.5 text-sm`}
                      disabled={isSubmitting}
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Smartphone
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.phone && touched.phone ? "text-red-400" : formData.phone ? "text-green-400" : "text-gray-400"}`}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Phone"
                      className={`${getInputStyle("phone")} pl-9 py-2.5 text-sm`}
                      disabled={isSubmitting}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <MessageSquare
                      className={`absolute left-3 top-3 w-4 h-4 ${errors.message && touched.message ? "text-red-400" : formData.message ? "text-green-400" : "text-gray-400"}`}
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tell us about your project..."
                      rows="2"
                      className={`${getInputStyle("message")} pl-9 py-2.5 text-sm resize-none`}
                      disabled={isSubmitting}
                    />
                    {touched.message && errors.message && (
                      <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 font-semibold text-sm shadow-lg shadow-orange-500/30 overflow-hidden group/btn"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Request
                          <Send className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <Shield className="w-3 h-3 text-gray-500" />
                    <p className="text-[8px] text-gray-500">
                      100% secure. No spam. Response within 2 hours.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Animation */}
        <div className="relative mt-6 pt-4 border-t border-white/10 px-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-[10px] flex items-center gap-2">
              <span>© 2026 Designs A2it</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="text-gray-500">All rights reserved</span>
            </p>

            <div className="flex items-center gap-3">
              <img
                src="/images/fotterLogo.png"
                alt="VISA"
                className="h-8 w-40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .duration-10000 {
          transition-duration: 10000ms;
        }
      `}</style>
    </footer>
  );
}
