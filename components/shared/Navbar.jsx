"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaShopify,
  FaEbay,
  FaAmazon,
  FaSearch,
  FaUsers,
  FaVectorSquare,
  FaDownload,
  FaLaptopCode,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import Logo from "./Logo";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  // Check if current path is the one where navbar should be hidden
  const hideNavbarPaths = ["/promotions/website/"]; // Add your paths here
  const shouldHideNavbar = hideNavbarPaths.includes(pathname);

  // If navbar should be hidden, return null (render nothing)
  if (shouldHideNavbar) {
    return null;
  }
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const timeoutRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debug current pathname
  useEffect(() => {
    console.log("Current pathname:", pathname);
  }, [pathname]);

  // Check if current path is active
  const isActive = (path) => {
    if (!pathname) return false;

    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Check if any service page is active
  const isServicesActive = () => {
    if (!pathname) return false;

    const servicePaths = [
      "/services/design-development",
      "/services/e-commerce",
      "/services/amazon",
      "/services/shopify",
      "/services/erp",
      "/services/seo",
      "/services/server-hosting",
      "/services/e-bay",
    ];

    return servicePaths.some((path) => pathname.startsWith(path));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("button[aria-label='Toggle menu']")
      ) {
        setMobileMenuOpen(false);
        setServicesOpen(false);
      }

      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("button[onClick]")
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, dropdownOpen]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleToggleClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setServicesOpen(false);
  };

  const toggleMobileServices = () => {
    setServicesOpen((prev) => !prev);
  };

  const handleServiceClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setServicesOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const services = [
    ["Design & Development", "/services/design-development", <FaLaptopCode />],
    ["E-Commerce", "/services/e-commerce", <FaCartShopping />],
    ["Amazon", "/services/amazon", <FaAmazon />],
    ["Shopify", "/services/shopify", <FaShopify />],
    ["ERP System Development", "/services/erp", <FaVectorSquare />],
    ["SEO / SEM / PPC", "/services/seo", <FaSearch />],
    ["Server and Hosting Services", "/services/server-hosting", <FaUsers />],
    ["E-bay", "/services/e-bay", <FaEbay />],
  ];

  return (
    <nav
      className={`bg-white text-black px-6 md:px-10 py-4 flex items-center justify-between relative z-50 sticky top-0 transition-all duration-300 font-bold ${
        isScrolled
          ? "bg-opacity-90 shadow-[0_4px_20px_0px_rgba(0,240,255,0.3)]"
          : "bg-opacity-100 shadow-none"
      }`}
    >
      <Link href="/" className="flex items-center space-x-2">
        <Logo />
      </Link>

      <ul className="hidden md:flex space-x-10 items-center text-sm font-medium relative">
        <li>
          <Link
            href="/"
            className={`hover:text-[#006dff] transition-colors duration-200 ${
              isActive("/") ? "text-[#006dff] font-bold" : ""
            }`}
          >
            Home
          </Link>
        </li>

        <li
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={handleToggleClick}
            className={`flex items-center gap-1 hover:text-[#006dff] transition-colors duration-200 ${
              isServicesActive() ? "text-[#006dff] font-bold" : ""
            }`}
          >
            Our Services{" "}
            <IoIosArrowDown
              className={`transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-[180px] -translate-x-1/2 mt-4 w-[95vw] sm:w-[700px] md:w-[900px] bg-white text-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-xl shadow-2xl z-20 px-6 sm:px-8 py-6 border"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map(([title, path, icon], idx) => (
                  <Link
                    href={path}
                    key={idx}
                    className={`flex items-center gap-3 hover:text-[#006dff] cursor-pointer transition-colors duration-200 ${
                      isActive(path) ? "text-[#006dff] font-bold" : ""
                    }`}
                    onClick={handleServiceClick}
                  >
                    <div
                      className={`p-2 rounded-full text-sm mt-1 ${
                        isActive(path)
                          ? "bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white"
                          : "bg-[#0066ff] text-[#fff]"
                      }`}
                    >
                      {icon}
                    </div>
                    <div className="text-sm leading-tight mt-1">{title}</div>
                  </Link>
                ))}
              </div>

              <div className="bg-[#0e0e15] border border-[#00f0ff]/20 rounded-lg p-4 relative overflow-hidden flex items-center justify-center text-center">
                <Image
                  src="/assets/banner.avif"
                  alt="banner img"
                  width="400"
                  height="400"
                  unoptimized
                  className="absolute inset-0 w-full h-full object-cover opacity-30 rounded-md"
                />

                <div className="relative z-10 flex flex-col items-center justify-center">
                  <h3 className="text-white font-semibold mb-2">
                    Download our PDF portfolio
                  </h3>

                  <p className="text-sm text-[#b0b0ff] mb-4 font-bold">
                    See our project experience & offerings in detail.
                  </p>

                  <a
                    href="/A2it Portfolio.pdf"
                    download="A2IT-Portfolio"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:from-[#00c0ff] hover:to-[#0044ff] rounded-full text-sm font-semibold text-[#0a0a12] transition"
                    onClick={handleServiceClick}
                  >
                    <FaDownload /> Download
                  </a>
                </div>
              </div>
            </div>
          )}
        </li>

        <li>
          <Link
            href="/about"
            className={`hover:text-[#006dff] transition-colors duration-200 ${
              isActive("/about") ? "text-[#006dff] font-bold" : ""
            }`}
          >
            About
          </Link>
        </li>

        <li>
          <Link
            href="/portfolio"
            className={`hover:text-[#006dff] transition-colors duration-200 ${
              isActive("/portfolio") ? "text-[#006dff] font-bold" : ""
            }`}
          >
            Portfolio
          </Link>
        </li>

        <li>
          <Link
            href="/blog"
            className={`hover:text-[#006dff] transition-colors duration-200 ${
              isActive("/blog") ? "text-[#006dff] font-bold" : ""
            }`}
          >
            Blog
          </Link>
        </li>
      </ul>

      <Link
        href="/contact"
        className={`bg-gradient-to-r from-[#0066ff] to-[#00f0ff] hover:from-[#00f0ff] hover:to-[#0066ff] transition-all duration-300 text-white px-3 py-2.5 rounded-full shadow-md text-sm font-semibold hidden md:flex items-center gap-1 ${
          isActive("/contact")
            ? "from-[#00f0ff] to-[#00f0ff] text-[#0a0a12] shadow-[0_0_15px_rgba(0,240,255,0.5)]"
            : ""
        }`}
      >
        <span className="animate-wave origin-[70%_70%]">👋</span> Contact Us
      </Link>

      <div className="md:hidden">
        <button onClick={toggleMobileMenu} aria-label="Toggle menu">
          {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 w-full bg-white text-black px-6 py-4 space-y-4 z-40 shadow-lg"
        >
          <Link
            href="/"
            className={`block py-2 hover:text-[#006dff] transition-colors duration-200 ${
              isActive("/")
                ? "text-[#006dff] font-bold border-l-4 border-[#00f0ff] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            Home
          </Link>

          <div>
            <button
              onClick={toggleMobileServices}
              className={`flex items-center justify-between w-full py-2 hover:text-[#006dff] cursor-pointer transition-colors duration-200 ${
                isServicesActive()
                  ? "text-[#006dff] font-bold border-l-4 border-[#00f0ff] pl-3"
                  : "pl-4"
              }`}
            >
              <span>Our Services</span>
              <IoIosArrowDown
                className={`transition-transform duration-300 ${
                  servicesOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {servicesOpen && (
              <div className="mt-2 space-y-1">
                {services.map(([title, path], idx) => (
                  <Link
                    href={path}
                    key={idx}
                    className={`block text-sm py-2 hover:text-[#006dff] transition-colors duration-200 ${
                      isActive(path)
                        ? "text-[#006dff] font-bold bg-[#00f0ff]/10 border-l-4 border-[#00f0ff] pl-6"
                        : "pl-8"
                    }`}
                    onClick={handleServiceClick}
                  >
                    {title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`block py-2 hover:text-[#006dff] transition-colors duration-200 ${
              isActive("/about")
                ? "text-[#006dff] font-bold border-l-4 border-[#00f0ff] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            About
          </Link>

          <Link
            href="/portfolio"
            className={`block py-2 hover:text-[#006dff] transition-colors duration-200 ${
              isActive("/portfolio")
                ? "text-[#006dff] font-bold border-l-4 border-[#00f0ff] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            Portfolio
          </Link>

          <Link
            href="/blog"
            className={`block py-2 hover:text-[#006dff] transition-colors duration-200 ${
              isActive("/blog")
                ? "text-[#006dff] font-bold border-l-4 border-[#00f0ff] pl-3"
                : "pl-4"
            }`}
            onClick={handleServiceClick}
          >
            Blog
          </Link>

          <Link
            href="/contact"
            className={`w-full mt-4 py-3 px-2 rounded-full text-sm font-semibold flex items-center justify-center gap-1 transition-all duration-300 ${
              isActive("/contact")
                ? "bg-gradient-to-r from-[#00f0ff] to-[#00f0ff] text-[#0a0a12] shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                : "bg-gradient-to-r from-[#0066ff] to-[#00f0ff] hover:from-[#0044ff] hover:to-[#00c0ff] text-white"
            }`}
            onClick={handleServiceClick}
          >
            <span className="animate-wave origin-[70%_70%]">👋</span> Contact Us
          </Link>
        </div>
      )}

      <style>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-8deg); }
          40% { transform: rotate(14deg); }
          50% { transform: rotate(-4deg); }
          60% { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave {
          display: inline-block;
          animation: wave 2s infinite;
        }
        
        /* Active link animation */
        .active-link {
          position: relative;
        }
        
        .active-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, #00f0ff, #0066ff);
          animation: underline 0.3s ease-out;
        }
        
        @keyframes underline {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
