"use client";
import { useState, useEffect } from "react";
import ConsultModal from "@/components/promotion/promotionModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const promotionalPackages = [
  {
    name: "Green",
    oldPrice: "$149",
    newPrice: "$99",
    badge: "Eco Starter",
    color: "green",
    features: [
      "5 Pages Responsive Website",
      "Basic SEO Optimization",
      "Contact Form with Email",
      "Mobile Responsive Design",
      "Social Media Icons",
      "Google Maps Integration",
      "1 Month Support",
      "Basic Security Setup",
    ],
  },
  {
    name: "Silver",
    oldPrice: "$299",
    newPrice: "$199",
    badge: "Most Popular",
    color: "slate",
    highlight: true,
    features: [
      "10 Pages Dynamic Website",
      "Advanced SEO Optimization",
      "Blog Integration",
      "Newsletter Subscription",
      "WhatsApp Chat Integration",
      "3 Months Support",
      "Speed Optimization",
      "SSL Certificate Included",
      "Basic E-commerce Features",
    ],
  },
  {
    name: "Gold",
    oldPrice: "$499",
    newPrice: "$399",
    badge: "Premium",
    color: "amber",
    features: [
      "Unlimited Pages Website",
      "Premium SEO Package",
      "E-commerce Full Setup",
      "Payment Gateway Integration",
      "Custom Admin Panel",
      "Advanced Analytics",
      "12 Months Priority Support",
      "Regular Backups",
      "Custom Features Development",
      "Multi-language Support",
    ],
  },
];

export default function PricingSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packagesData, setPackagesData] = useState(promotionalPackages);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/promotional-packages`);

        if (!response.ok) return;

        const data = await response.json();
        if (data.packages?.length) {
          setPackagesData(data.packages);
        }
      } catch (error) {
        console.error("Error loading promotional packages:", error);
      }
    };

    loadPackages();
  }, []);

  const handleStartProject = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  const resolveTheme = (color) => {
    const normalized = String(color || "")
      .trim()
      .toLowerCase();

    if (normalized === "green") {
      return {
        value: "rgb(22 163 74)",
        light: "rgb(220 252 231)",
        dark: "rgb(21 128 61)",
        text: "rgb(21 128 61)",
        mutedText: "rgb(22 163 74)",
      };
    }

    if (
      normalized === "silver" ||
      normalized === "slate" ||
      normalized === "gray"
    ) {
      return {
        value: "rgb(71 85 105)",
        light: "rgb(241 245 249)",
        dark: "rgb(71 85 105)",
        text: "rgb(71 85 105)",
        mutedText: "rgb(71 85 105)",
      };
    }

    if (
      normalized === "gold" ||
      normalized === "amber" ||
      normalized === "orange" ||
      normalized === "yellow"
    ) {
      return {
        value: "rgb(217 119 6)",
        light: "rgb(255 237 213)",
        dark: "rgb(217 119 6)",
        text: "rgb(217 119 6)",
        mutedText: "rgb(217 119 6)",
      };
    }

    const isCssColor =
      /^(#|rgb\(|rgba\(|hsl\(|hsla\()/i.test(normalized) ||
      /^[a-z]+$/i.test(normalized);

    return {
      value: isCssColor ? normalized : "rgb(71 85 105)",
      light: isCssColor ? normalized : "rgb(241 245 249)",
      dark: isCssColor ? normalized : "rgb(71 85 105)",
      text: isCssColor ? normalized : "rgb(71 85 105)",
      mutedText: isCssColor ? normalized : "rgb(71 85 105)",
    };
  };

  // Function to get mobile color classes based on package color
  const getMobileColorClasses = (color) => {
    switch (color) {
      case "green":
        return "md:hover:bg-green-600 mobile-color-green";
      case "slate":
        return "md:hover:bg-slate-600 mobile-color-slate";
      case "amber":
        return "md:hover:bg-amber-600 mobile-color-amber";
      default:
        return "md:hover:bg-slate-500 mobile-color-neutral";
    }
  };

  // Function to get badge color classes for mobile
  const getBadgeMobileColor = (color) => {
    switch (color) {
      case "green":
        return "md:group-hover:bg-white md:group-hover:text-green-600 mobile-badge-green";
      case "slate":
        return "md:group-hover:bg-white md:group-hover:text-slate-600 mobile-badge-slate";
      case "amber":
        return "md:group-hover:bg-white md:group-hover:text-amber-600 mobile-badge-amber";
      default:
        return "md:group-hover:bg-white md:group-hover:text-slate-600 mobile-badge-neutral";
    }
  };

  // Function to get button color classes for mobile
  const getButtonMobileColor = (color) => {
    switch (color) {
      case "green":
        return "md:group-hover:bg-white md:group-hover:text-green-600 mobile-button-green";
      case "slate":
        return "md:group-hover:bg-white md:group-hover:text-slate-600 mobile-button-slate";
      case "amber":
        return "md:group-hover:bg-white md:group-hover:text-amber-600 mobile-button-amber";
      default:
        return "md:group-hover:bg-white md:group-hover:text-slate-600 mobile-button-neutral";
    }
  };

  return (
    <>
      <div className="relative py-12 md:py-20 bg-gray-100 overflow-hidden">
        {/* Animated Background Elements - Responsive */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Gradient Orbs - Smaller on mobile */}
          <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
          <div className="absolute top-40 right-10 w-56 h-56 md:w-80 md:h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-medium"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 md:w-96 md:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-fast"></div>

          {/* Animated Grid Lines - Hidden on very small devices if needed */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          {/* Moving Dots - Fewer on mobile */}
          <div className="absolute inset-0 hidden md:block">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gray-400 rounded-full animate-ping-slow"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3 animate-fade-in px-2">
              Choose Your Perfect Package
            </h2>
            <p className="text-sm sm:text-base text-gray-500 animate-fade-in-up px-4">
              Premium solutions tailored for your business
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
            {packagesData.map((pkg, index) =>
              (() => {
                const theme = resolveTheme(pkg.color);
                const badgeTheme = (() => {
                  const base = resolveTheme(pkg.color);
                  const lighten = (c) => {
                    const hexMatch = String(c || "").match(
                      /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
                    );
                    if (hexMatch) {
                      let hex = hexMatch[1];
                      if (hex.length === 3)
                        hex = hex
                          .split("")
                          .map((h) => h + h)
                          .join("");
                      const r = parseInt(hex.slice(0, 2), 16);
                      const g = parseInt(hex.slice(2, 4), 16);
                      const b = parseInt(hex.slice(4, 6), 16);
                      const mix = (v) => Math.round(v + (255 - v) * 0.38);
                      const hr = mix(r).toString(16).padStart(2, "0");
                      const hg = mix(g).toString(16).padStart(2, "0");
                      const hb = mix(b).toString(16).padStart(2, "0");
                      return { light: `#${hr}${hg}${hb}`, dark: c };
                    }

                    const rgbMatch = String(c || "").match(/rgba?\(([^)]+)\)/i);
                    if (rgbMatch) {
                      const parts = rgbMatch[1].split(",").map((p) => p.trim());
                      const r = parseInt(parts[0], 10) || 0;
                      const g = parseInt(parts[1], 10) || 0;
                      const b = parseInt(parts[2], 10) || 0;
                      const mix = (v) => Math.round(v + (255 - v) * 0.38);
                      return {
                        light: `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`,
                        dark: c,
                      };
                    }

                    return { light: base.light, dark: base.dark };
                  };

                  // prefer explicit badgeColor if present, else derive
                  const source = pkg.badgeColor || pkg.color || base.value;
                  const computed = lighten(source);
                  return {
                    light: computed.light || base.light,
                    dark: computed.dark || base.dark,
                  };
                })();
                const isKnownTheme = [
                  "green",
                  "slate",
                  "silver",
                  "gold",
                  "amber",
                ].includes(String(pkg.color || "").toLowerCase());

                return (
                  <div
                    key={index}
                    style={{
                      "--theme-color": theme.value,
                      "--theme-light": theme.light,
                      "--theme-dark": theme.dark,
                      "--theme-text": theme.text,
                    }}
                    className={`package-card group relative rounded-xl md:rounded-2xl border-2 bg-white/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 transition-all duration-500 md:hover:-translate-y-3 md:hover:shadow-2xl hover:bg-opacity-100 ${getMobileColorClasses(pkg.color)} ${
                      isKnownTheme
                        ? pkg.color === "green"
                          ? "border-green-200 bg-green-50/30"
                          : pkg.color === "silver" || pkg.color === "slate"
                            ? "border-slate-200 bg-slate-50/30"
                            : "border-amber-200 bg-amber-50/30"
                        : "border-slate-200 bg-slate-50/30"
                    }`}
                  >
                    {/* Badge */}
                    <div className="absolute -top-5 md:-top-6.5 left-1/2 -translate-x-1/2">
                      <div
                        style={{
                          backgroundColor: badgeTheme.light,
                          color: badgeTheme.dark,
                        }}
                        className={`package-badge px-3 md:px-4 py-0.5 md:py-1 text-xs font-semibold rounded-full transition-all duration-500 whitespace-nowrap ${getBadgeMobileColor(
                          pkg.color,
                        )}`}
                      >
                        {pkg.badge}
                      </div>
                    </div>

                    <div className="flex flex-col h-[380px] sm:h-[400px] md:h-[420px]">
                      {/* Title */}
                      <h3
                        style={{ color: theme.text }}
                        className="package-title text-xl sm:text-2xl font-bold text-center mt-6 md:mt-4 mb-2 md:mb-3"
                      >
                        {pkg.name}
                      </h3>

                      {/* Price */}
                      <div className="package-price text-center mb-4 md:mb-6">
                        <span className="package-old-price line-through text-gray-400 max-md:text-orange-500 mr-2 text-sm md:text-base transition-colors duration-300">
                          {pkg.oldPrice}
                        </span>
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold">
                          {pkg.newPrice}
                        </span>
                        <p className="text-xs mt-1 opacity-70">
                          one-time payment
                        </p>
                      </div>

                      {/* Features */}
                      <div className="package-features flex-1 overflow-y-auto pr-1 md:pr-2 space-y-1.5 md:space-y-2 scrollbar-hide md:group-hover:scrollbar-thin md:group-hover:scrollbar-thumb-white/50 text-xs sm:text-sm">
                        {pkg.features.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-1.5 md:gap-2"
                          >
                            <span
                              style={{ color: theme.mutedText }}
                              className="package-check font-bold mt-0.5"
                            >
                              ✓
                            </span>
                            <span className="flex-1">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Button */}
                      <button
                        onClick={() => handleStartProject(pkg)}
                        style={{
                          backgroundColor:
                            pkg.color === "green"
                              ? "rgb(22 163 74)"
                              : pkg.color === "silver" || pkg.color === "slate"
                                ? "rgb(71 85 105)"
                                : pkg.color === "gold" ||
                                    pkg.color === "amber" ||
                                    pkg.color === "orange" ||
                                    pkg.color === "yellow"
                                  ? "rgb(217 119 6)"
                                  : theme.dark,
                          color: "white",
                        }}
                        className={`package-button mt-4 md:mt-6 w-full py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-300 transform active:scale-95 md:hover:scale-105 text-sm md:text-base ${getButtonMobileColor(pkg.color)}`}
                      >
                        Start Project
                      </button>
                    </div>
                  </div>
                );
              })(),
            )}
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx global>{`
          .scrollbar-thin::-webkit-scrollbar {
            width: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.6);
            border-radius: 10px;
          }
          .scrollbar-hide::-webkit-scrollbar {
            width: 0px;
          }

          /* Background Pattern */
          .bg-grid-pattern {
            background-image:
              linear-gradient(to right, #80808012 1px, transparent 1px),
              linear-gradient(to bottom, #80808012 1px, transparent 1px);
            background-size: 50px 50px;
          }

          /* Mobile Color Classes - Applied without hover on mobile */
          @media (max-width: 768px) {
            .mobile-color-green {
              background-color: rgb(22 163 74) !important;
              border-color: rgb(22 163 74) !important;
              color: white !important;
            }

            .mobile-color-slate {
              background-color: rgb(71 85 105) !important;
              border-color: rgb(71 85 105) !important;
              color: white !important;
            }

            .mobile-color-amber {
              background-color: rgb(217 119 6) !important;
              border-color: rgb(217 119 6) !important;
              color: white !important;
            }

            /* Mobile badge colors */
            .mobile-badge-green {
              background-color: white !important;
              color: rgb(22 163 74) !important;
            }

            .mobile-badge-slate {
              background-color: white !important;
              color: rgb(71 85 105) !important;
            }

            .mobile-badge-amber {
              background-color: white !important;
              color: rgb(217 119 6) !important;
            }

            /* Mobile button colors */
            .mobile-button-green {
              background-color: white !important;
              color: rgb(22 163 74) !important;
            }

            .mobile-button-slate {
              background-color: white !important;
              color: rgb(71 85 105) !important;
            }

            .mobile-button-amber {
              background-color: white !important;
              color: rgb(217 119 6) !important;
            }

            .mobile-color-neutral {
              background-color: rgb(71 85 105) !important;
              border-color: rgb(71 85 105) !important;
              color: white !important;
            }

            .mobile-badge-neutral {
              background-color: white !important;
              color: rgb(71 85 105) !important;
            }

            .mobile-button-neutral {
              background-color: white !important;
              color: rgb(71 85 105) !important;
            }

            .package-card:hover .package-title,
            .package-card:hover .package-price,
            .package-card:hover .package-features,
            .package-card:hover .package-check,
            .package-card:hover .package-old-price {
              color: white !important;
            }

            .package-card:hover .package-badge,
            .package-card:hover .package-button {
              background-color: white !important;
            }
          }

          /* Animation Keyframes */
          @keyframes float-slow {
            0%,
            100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(30px, -30px) rotate(120deg);
            }
            66% {
              transform: translate(-20px, 20px) rotate(240deg);
            }
          }

          @keyframes float-medium {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-20px, 30px) scale(1.1);
            }
            75% {
              transform: translate(20px, -20px) scale(0.9);
            }
          }

          @keyframes float-fast {
            0%,
            100% {
              transform: translate(0, 0) rotate(0deg);
            }
            50% {
              transform: translate(40px, -40px) rotate(180deg);
            }
          }

          @keyframes ping-slow {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(2);
              opacity: 0.5;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes wave {
            0% {
              transform: translateX(0) translateZ(0) scaleY(1);
            }
            50% {
              transform: translateX(-25%) translateZ(0) scaleY(0.8);
            }
            100% {
              transform: translateX(-50%) translateZ(0) scaleY(1);
            }
          }

          @keyframes dash {
            to {
              stroke-dashoffset: 120;
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Animation Classes */
          .animate-float-slow {
            animation: float-slow 20s ease-in-out infinite;
          }

          .animate-float-medium {
            animation: float-medium 15s ease-in-out infinite;
          }

          .animate-float-fast {
            animation: float-fast 12s ease-in-out infinite;
          }

          .animate-ping-slow {
            animation: ping-slow 4s ease-in-out infinite;
          }

          .animate-wave {
            animation: wave 15s linear infinite;
          }

          .animate-dash {
            stroke-dasharray: 60;
            animation: dash 20s linear infinite;
          }

          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }

          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out 0.2s both;
          }
        `}</style>
      </div>

      {/* Consult Modal */}
      <ConsultModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedPackage={selectedPackage}
      />
    </>
  );
}
