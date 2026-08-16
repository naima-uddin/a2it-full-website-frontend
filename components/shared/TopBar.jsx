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

const TopBar = () => {
     const pathname = usePathname();
    
    // Check if current path is the one where navbar should be hidden
    const hideNavbarPaths = ['/promotions/website/']; // Add your paths here
    const shouldHideNavbar = hideNavbarPaths.includes(pathname);
    
    // If navbar should be hidden, return null (render nothing)
    if (shouldHideNavbar) {
      return null;
    } 
  return (
    <div className="bg-white text-[#e0e0ff] px-3 sm:px-4 py-2 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm border-b border-[#0066ff]/30">
      {/* Contact Info - Mobile: side by side, Desktop: same row */}
      <div className="flex items-center space-x-4 sm:space-x-4 mb-2 sm:mb-0">
        <div className="flex items-center space-x-1">
          <FaPhoneAlt className="text-[#0066ff] text-xs sm:text-sm" />
          <span className="font-medium sm:font-semibold whitespace-nowrap text-black">
            +88 01846 937397
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-1">
          <span className="text-[#b0b0ff]/60">|</span>
        </div>
        <div className="flex items-center space-x-1">
          <FaEnvelope className="text-[#0066ff] text-xs sm:text-sm" />
          <span className="font-medium sm:font-semibold whitespace-nowrap text-black">info@a2itltd.com</span>
        </div>
      </div>

      {/* Social Icons - Mobile: below, Desktop: same row */}
      <div className="flex space-x-1 sm:space-x-2">
        <a
          href="https://www.facebook.com/A2ITLtd"
          className="bg-[#0066ff] hover:bg-[#00f0ff] p-1.5 sm:p-2 rounded text-white border border-[#0066ff]/50 hover:border-[#00f0ff] hover:text-black transition-colors duration-300"
          aria-label="Facebook"
        >
          <FaFacebookF className="text-xs sm:text-sm" />
        </a>
        <a
          href="#"
          className="bg-[#0066ff] hover:bg-[#00f0ff] p-1.5 sm:p-2 rounded text-white border border-[#0066ff]/50 hover:border-[#00f0ff] hover:text-black  transition-colors duration-300"
          aria-label="Twitter"
        >
          <FaTwitter className="text-xs sm:text-sm" />
        </a>
        <a
          href="#"
          className="bg-[#0066ff] hover:bg-[#00f0ff] p-1.5 sm:p-2 rounded text-white border border-[#0066ff]/50 hover:border-[#00f0ff] hover:text-black  transition-colors duration-300"
          aria-label="YouTube"
        >
          <FaYoutube className="text-xs sm:text-sm" />
        </a>
        <a
          href="#"
          className="bg-[#0066ff] hover:bg-[#00f0ff] p-1.5 sm:p-2 rounded text-white border border-[#0066ff]/50 hover:border-[#00f0ff] hover:text-black  transition-colors duration-300"
          aria-label="Instagram"
        >
          <FaInstagram className="text-xs sm:text-sm" />
        </a>
        <a
          href="https://www.linkedin.com/in/a2itlimited/"
          className="bg-[#0066ff] hover:bg-[#00f0ff] p-1.5 sm:p-2 rounded text-white border border-[#0066ff]/50 hover:border-[#00f0ff] hover:text-black  transition-colors duration-300"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn className="text-xs sm:text-sm" />
        </a>
      </div>
    </div>
  );
};

export default TopBar;