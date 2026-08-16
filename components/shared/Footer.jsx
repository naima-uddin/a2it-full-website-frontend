"use client";
import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Logo from "./Logo";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  // Check if current path is the one where navbar should be hidden
  const hideNavbarPaths = ["/promotions/website/"]; // Add your paths here
  const shouldHideNavbar = hideNavbarPaths.includes(pathname);

  // If navbar should be hidden, return null (render nothing)
  if (shouldHideNavbar) {
    return null;
  }
  // Route configuration
  const routes = {
    HOME: "/",
    PORTFOLIO: "/portfolio",
    ABOUT: "/about",
    BLOGS: "/blog",
    PRIVACY: "/privacy-policy",
    TERMS: "/terms-of-service",
    SITEMAP: "/contact",
    CONTACT: "/contact",
  };

  // Social media links
  const socialLinks = [
    {
      icon: <FaFacebookF />,
      color: "hover:text-[#1877F2]",
      url: "https://www.facebook.com/A2ITLtd",
    },
    {
      icon: <FaTwitter />,
      color: "hover:text-[#1DA1F2]",
      url: "https://twitter.com",
    },
    {
      icon: <FaLinkedinIn />,
      color: "hover:text-[#0A66C2]",
      url: "https://www.linkedin.com/in/a2itlimited/",
    },
  ];

  // Quick links
  const quickLinks = [
    { name: "Home", path: routes.HOME },
    { name: "Portfolio", path: routes.PORTFOLIO },
    { name: "About Us", path: routes.ABOUT },
    { name: "Blogs", path: routes.BLOGS },
    { name: "Contact", path: routes.CONTACT },
  ];

  // Policy links
  const policyLinks = [
    { name: "Privacy Policy", path: routes.PRIVACY },
    { name: "Terms of Service", path: routes.TERMS },
    { name: "Sitemap", path: routes.SITEMAP },
  ];

  return (
    <footer className="bg-white text-[#e0e0ff] pb-3 md:pb-4  pt-3 md:pt-6 px-4 md:px-16 relative overflow-hidden mx-auto border-t-2">
      {/* Glowing orb effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

      <div className="mx-auto relative z-10 max-w-7xl">
        {/* Main Footer Content - Mobile: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-2 md:mb-6 ">
          {/* Brand Info - Mobile: Row 1 Col 1 */}
          <div className="col-span-1 md:col-span-1 mx-auto ml-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl font-bold text-[#0a0a12]">
                <Logo />
              </div>
              <h2 className="text-xl md:text-3xl font-extrabold bg-gradient-to-r from-[#598cd8] to-[#1363f8] bg-clip-text text-transparent drop-shadow-md">
                A2IT Ltd
              </h2>
            </div>
            <p className="text-[#006dff] font-semibold mb-2 text-sm md:text-xl">
              Build Your Dreams
            </p>
            <p className="text-black text-xs md:text-base leading-relaxed">
              Transforming ideas into digital reality.
            </p>
          </div>

          {/* Quick Links - Mobile: Row 1 Col 2 */}
          <div className="col-span-1 md:col-span-1 mx-auto">
            <h3 className="text-sm md:text-xl font-semibold mb-3 md:mb-6 text-[#006dff] border-b-2 border-[#00f0ff]/40 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-0 md:space-y-1">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="text-black hover:text-[#006dff] transition-colors text-xs md:text-base"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Mobile: Row 2 Col 1 */}
          <div className="col-span-1 md:col-span-1  md:mt-0 mx-auto">
            <h3 className="text-sm md:text-xl font-semibold mb-3 md:mb-6 text-[#006dff] border-b-2 border-[#00f0ff]/40 inline-block">
              Contact Us
            </h3>
            <address className="not-italic text-black space-y-3 md:space-y-2 text-xs md:text-base">
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-[#006dff] mt-0.4 flex-shrink-0 mt-1.5" />
                <p>
                  Plot No 470
                  <br />
                  Road No 06
                  <br />
                  DOHS Mirpur, Dhaka
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-[#006dff] flex-shrink-0" />
                <a
                  href="tel:+8801846937397"
                  className="hover:text-[#0066ff] transition-colors"
                >
                  +880 1846-937397
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[#006dff] flex-shrink-0" />
                <a
                  href="mailto:info@a2itltd.com"
                  className="hover:text-[#0066ff] transition-colors"
                >
                  info@a2itltd.com
                </a>
              </div>
            </address>
          </div>

          {/* Policy Links - Mobile: Row 2 Col 2 */}
          <div className="col-span-1 md:col-span-1  md:mt-0 mx-auto">
            <h3 className="text-sm md:text-xl font-semibold mb-3 md:mb-6 text-[#006dff] border-b-2 border-[#00f0ff]/40 inline-block">
              Policies
            </h3>
            <ul className="space-y-0 md:space-y-3 mb-2">
              {policyLinks.map((policy) => (
                <li key={policy.name}>
                  <a
                    href={policy.path}
                    className="text-black hover:text-[#006dff] transition-colors text-xs md:text-base"
                  >
                    {policy.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 md:gap-4 mt-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-7 h-7 md:w-10 md:h-10 rounded-full bg-[#006dff] flex items-center justify-center text-xs md:text-lg text-[#ffff] ${social.color} hover:text-white hover:scale-110 hover:shadow-[0_0_10px_#00f0ff] transition-all duration-300`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#00f0ff]/20 pt-3 md:pt-4 text-center">
          <p className="text-black text-xs md:text-base">
            ©A2It Ltd. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
