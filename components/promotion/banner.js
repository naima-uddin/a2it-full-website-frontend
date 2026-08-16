// components/HeroSection.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { redirectToThankYou } from "../shared/contactSuccessRedirect";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, MessageCircle, Clock, X } from "lucide-react";
import Image from "next/image";

// Platforms Slider Component
const platforms = [
  { name: "Magento", src: "/images/brand (1).png" },
  { name: "WordPress", src: "/images/brand (2).png" },
  { name: "WooCommerce", src: "/images/brand (3).png" },
  { name: "Laravel", src: "/images/brand (4).png" },
  { name: "CSS3", src: "/images/brand (5).png" },
  { name: "HTML5", src: "/images/brand (6).png" },
  { name: "OpenCart", src: "/images/brand (7).png" },
];

const PlatformsSlider = () => {
  return (
    <div className="relative py-3 overflow-hidden animate-fade-in z-30">
      <div className="flex animate-scroll whitespace-nowrap gap-12">
        {platforms.concat(platforms).map((platform, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-32 h-16 flex items-center justify-center"
          >
            <Image
              src={platform.src}
              alt={platform.name}
              width={128}
              height={64}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 20s linear infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

// Main Hero Section
const Banner = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package: "",
    description: "",
  });
  const [packageOptions, setPackageOptions] = useState([]);

  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchPackageOptions = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "https://a2it-dashboard-backend.vercel.app";
        const response = await fetch(`${backendUrl}/api/promotional-packages`);
        const json = await response.json();

        const packagesArray = Array.isArray(json)
          ? json
          : Array.isArray(json?.packages)
            ? json.packages
            : [];

        if (!response.ok || !Array.isArray(packagesArray)) {
          console.error("Failed to load promotional packages", json);
          return;
        }

        const mappedOptions = packagesArray
          .filter((pkg) => pkg.isActive !== false)
          .map((pkg) => ({
            value:
              pkg._id || (pkg.name || "").toLowerCase().replace(/\s+/g, "-"),
            label: pkg.name || "Untitled Package",
            price: pkg.newPrice || pkg.oldPrice || "",
            badge: pkg.badge || "",
            features: pkg.features || [],
          }));

        setPackageOptions(mappedOptions);

        setFormData((prev) => {
          if (mappedOptions.length === 0) {
            return prev;
          }

          const currentSelection = mappedOptions.find(
            (option) => option.value === prev.package,
          );

          return currentSelection
            ? prev
            : { ...prev, package: mappedOptions[0].value };
        });
      } catch (error) {
        console.error("Error fetching promotional packages", error);
      }
    };

    fetchPackageOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.package
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const selectedPackage = packageOptions.find(
      (option) => option.value === formData.package,
    );
    const packageSummary = selectedPackage
      ? `${selectedPackage.label}${selectedPackage.price ? ` - ${selectedPackage.price}` : ""}${selectedPackage.badge ? ` (${selectedPackage.badge})` : ""}`
      : formData.package;

    try {
      const response = await fetch(
        "https://a2it-dashboard-backend.vercel.app/api/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "banner_inquiry",
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            model: packageSummary,
            shippingTerm: "50% OFF Eligible - Website Package",
            message: formData.description || "No project description provided",
            subject: `🎯 NEW PRODUCT INQUIRY: ${selectedPackage?.label || formData.package} - 50% OFF`,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          package: "",
          description: "",
        });

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
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear status when user starts typing again
    if (submitStatus) setSubmitStatus(null);
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full overflow-hidden bg-[#0a192f] pt-30 ">
      {/* Platforms Logos Floating Above Banner */}
      <div className="absolute bottom-2 z-40 left-0 w-full flex justify-center">
        <PlatformsSlider />
      </div>

      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[0.5px]"
          style={{ backgroundImage: "url('/images/banner.png')" }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#f5b342]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Content */}
          <div
            className={`space-y-5 sm:space-y-6 text-white order-2 lg:order-1 transition-all duration-500    ${showForm ? "lg:col-span-1" : "lg:col-span-2 lg:max-w-3xl lg:mx-auto text-center "}`}
          >
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#f5b342]/20 to-[#f5b342]/5 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-[#f5b342] shadow-lg shadow-[#f5b342]/30 hover:shadow-[#f5b342]/50 hover:scale-105 hover:border-[#f5b342] transition-all duration-300 group ${showForm ? "" : "mx-auto"}`}
            >
              <div className="relative">
                <Sparkles size={20} className="text-[#f5b342] animate-pulse" />
                <div className="absolute inset-0 bg-[#f5b342] blur-md opacity-50 animate-ping"></div>
              </div>
              <span className="text-sm sm:text-base font-bold text-[#f5b342] tracking-wide whitespace-nowrap bg-gradient-to-r from-[#f5b342] to-[#f5b342]/80 bg-clip-text text-transparent">
                WEBSITES FROM $99
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#f5b342] animate-pulse"></div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-xl font-bold leading-tight ${showForm ? "" : "mx-auto"}`}
            >
              <span className="text-white">Web Designs Starts from </span>{" "}
              <span className="text-[#f5b342] relative inline-block font-bold text-2xl">
                $99 ONLY
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#f5b342] to-transparent rounded-full"></span>
              </span>
              <br />
              <span className="text-lg sm:text-xl md:text-2xl text-gray-200 font-normal block mt-2 sm:mt-3 max-w-2xl">
                Your Vision, Our Magic ✨
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl border-l-2 border-[#f5b342] pl-4 italic ${showForm ? "" : "mx-auto"}`}
            >
              Designs A2it is your versatile platform for crafting stunning,
              interactive websites, catering to personal blogs, e-commerce
              shops, corporate sites, and custom web applications, all designed
              to captivate your audience.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`flex flex-col sm:flex-row items-stretch sm:items-center pb-10 gap-3 sm:gap-4 pt-5 ${showForm ? "" : "justify-center"}`}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-[#f5b342] text-[#0a192f] text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-[#f5b342]/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f5b342]/20 hover:shadow-xl relative overflow-hidden group"
              >
                <span className="relative z-10">GET STARTED</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform relative z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Form */}
          <AnimatePresence mode="wait">
            {showForm && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
                className="relative lg:justify-self-end w-full max-w-md mx-auto lg:mx-0 order-1 lg:order-2"
              >
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => {
                    setShowForm(false);
                    setSubmitStatus(null);
                  }}
                  className="absolute -top-2 -right-2 z-30 bg-white/20 backdrop-blur-sm text-white p-1.5 rounded-full hover:bg-white/30 transition-all border border-white/30"
                  disabled={isSubmitting}
                >
                  <X size={16} />
                </motion.button>

                {/* Offer Badge */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute -top-2 -right-1 z-20 bg-gradient-to-r from-[#f5b342] to-[#f5d742] text-[#0a192f] px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg"
                >
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="animate-spin" />
                    50% OFF
                  </span>
                </motion.div>

                {/* Form Container */}
                <div className="relative group">
                  <div className="relative bg-black/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/20 shadow-xl">
                    {/* Decorative Elements */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -top-3 -left-3 w-12 h-12 bg-[#f5b342]/20 rounded-full blur-md"
                    ></motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                      className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#f5b342]/20 rounded-full blur-md"
                    ></motion.div>

                    <div className="relative z-10">
                      {/* Header */}
                      <motion.div
                        initial={{ y: -15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-3"
                      >
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                          Sign up Now To Unlock Exclusive Discounts!
                        </h2>
                        <motion.div
                          animate={{ scale: [1, 1.03, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block bg-white/10 text-[#f5b342] px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border border-[#f5b342]/30"
                        >
                          Up to 50% Off On Website Packages
                        </motion.div>
                      </motion.div>

                      {/* Status Messages */}
                      {submitStatus === "success" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400 text-xs"
                        >
                          <span>
                            Thank you! Your inquiry has been sent successfully!
                          </span>
                        </motion.div>
                      )}

                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-xs"
                        >
                          <span>Something went wrong. Please try again.</span>
                        </motion.div>
                      )}

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {["name", "email"].map((field, index) => (
                            <motion.div
                              key={field}
                              initial={{ x: -15, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                            >
                              <input
                                type={field === "email" ? "email" : "text"}
                                name={field}
                                placeholder={
                                  field === "name" ? "Your name" : "Email"
                                }
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-gray-300 focus:outline-none focus:border-[#f5b342] focus:ring-2 focus:ring-[#f5b342]/20 transition-all"
                                required
                                disabled={isSubmitting}
                              />
                            </motion.div>
                          ))}
                        </div>

                        <motion.div
                          initial={{ x: -15, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-gray-300 focus:outline-none focus:border-[#f5b342] focus:ring-2 focus:ring-[#f5b342]/20 transition-all"
                            required
                            disabled={isSubmitting}
                          />
                        </motion.div>

                        {/* Package Dropdown */}
                        <motion.div
                          initial={{ x: -15, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="relative"
                        >
                          <select
                            name="package"
                            value={formData.package || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-gray-300 focus:outline-none focus:border-[#f5b342] focus:ring-2 focus:ring-[#f5b342]/20 transition-all appearance-none cursor-pointer"
                            required
                            disabled={isSubmitting}
                          >
                            <option
                              value=""
                              disabled
                              className="bg-[#0a192f] text-gray-300"
                            >
                              {packageOptions.length > 0
                                ? "Select your package"
                                : "Loading packages..."}
                            </option>
                            {packageOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                className="bg-[#0a192f] text-white"
                              >
                                {option.label} - {option.price}
                              </option>
                            ))}
                          </select>

                          {/* Custom dropdown arrow */}
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg
                              className="w-4 h-4 text-white/70"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ x: -15, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <textarea
                            name="description"
                            placeholder="Project details (optional)..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-gray-300 focus:outline-none focus:border-[#f5b342] focus:ring-2 focus:ring-[#f5b342]/20 transition-all resize-none"
                            disabled={isSubmitting}
                          />
                        </motion.div>

                        <motion.button
                          type="submit"
                          whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          disabled={isSubmitting}
                          className={`w-full bg-gradient-to-r from-[#f5b342] to-[#f5d742] text-[#0a192f] font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-[#f5b342]/20 transition-all duration-300 text-xs flex items-center justify-center gap-1.5 group relative overflow-hidden ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <span className="relative z-10">
                            {isSubmitting ? "Sending..." : "Send Request"}
                          </span>
                          {!isSubmitting && (
                            <ArrowRight
                              size={14}
                              className="group-hover:translate-x-1 transition-transform relative z-10"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Banner;
