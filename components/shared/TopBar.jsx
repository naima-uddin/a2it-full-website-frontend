"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const TopBar = () => {
     const pathname = usePathname();
     const site = useSiteSettings();
     const telHref = `tel:${(site.phone || "").replace(/[^+\d]/g, "")}`;

    // Check if current path is the one where navbar should be hidden
    const hideNavbarPaths = ['/promotions/website/']; // Add your paths here
    const shouldHideNavbar = hideNavbarPaths.includes(pathname);

    // If navbar should be hidden, return null (render nothing)
    if (shouldHideNavbar) {
      return null;
    }

    const socialItems = [
      { icon: <FaFacebookF className="text-xs sm:text-sm" />, url: site.social?.facebook, label: "Facebook" },
      { icon: <FaTwitter className="text-xs sm:text-sm" />, url: site.social?.twitter, label: "Twitter" },
      { icon: <FaYoutube className="text-xs sm:text-sm" />, url: site.social?.youtube, label: "YouTube" },
      { icon: <FaInstagram className="text-xs sm:text-sm" />, url: site.social?.instagram, label: "Instagram" },
      { icon: <FaLinkedinIn className="text-xs sm:text-sm" />, url: site.social?.linkedin, label: "LinkedIn" },
    ].filter((s) => s.url);
  return (
    <div className="bg-white text-[#e0e0ff] px-3 sm:px-4 py-2 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm border-b border-[#0066ff]/30">
      {/* Contact Info - Mobile: side by side, Desktop: same row */}
      <div className="flex items-center space-x-4 sm:space-x-4 mb-2 sm:mb-0">
        <a href={telHref} className="flex items-center space-x-1">
          <FaPhoneAlt className="text-[#0066ff] text-xs sm:text-sm" />
          <span className="font-medium sm:font-semibold whitespace-nowrap text-black">
            {site.phone}
          </span>
        </a>
        <div className="hidden sm:flex items-center space-x-1">
          <span className="text-[#b0b0ff]/60">|</span>
        </div>
        <a href={`mailto:${site.email}`} className="flex items-center space-x-1">
          <FaEnvelope className="text-[#0066ff] text-xs sm:text-sm" />
          <span className="font-medium sm:font-semibold whitespace-nowrap text-black">
            {site.email}
          </span>
        </a>
      </div>

      {/* Social Icons - Mobile: below, Desktop: same row */}
      <div className="flex space-x-1 sm:space-x-2">
        {socialItems.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0066ff] hover:bg-[#00f0ff] p-1.5 sm:p-2 rounded text-white border border-[#0066ff]/50 hover:border-[#00f0ff] hover:text-black transition-colors duration-300"
            aria-label={s.label}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default TopBar;