// components/Navbar.jsx
"use client";

import { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle, Menu, X } from 'lucide-react';

const PromotionNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      // For mobile devices (width < 768px)
      if (window.innerWidth < 768) {
        // If mobile menu is open, close it when scrolling
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling down - hide navbar
          setNavbarVisible(false);
        } else if (currentScrollY < lastScrollY || currentScrollY < 10) {
          // Scrolling up OR at the very top - show navbar
          setNavbarVisible(true);
        }
      } else {
        // On desktop, always show navbar
        setNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  return (
    <>
      <nav
        className={`
          w-full left-0 z-50 transition-all duration-300
          ${scrolled 
            ? 'fixed top-0 bg-secondary/95 backdrop-blur-md shadow-lg border-b border-[#f5b342]' 
            : 'absolute top-0 bg-gradient-to-b from-black/50 to-transparent'
          }
          ${!navbarVisible ? '-translate-y-full' : 'translate-y-0'}
        `}
        style={{
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Brand Section */}
            <a href="https://a2itltd.com/">
              <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                <img 
                  className='w-8 sm:w-12 md:w-10 lg:w-14 object-contain transition-all duration-300' 
                  src="/images/A2ITLogo.png" 
                  alt="A2IT Logo" 
                />
              </div>
            </div>
            </a>

            {/* Desktop Contact Section */}
            <div className="hidden md:flex items-center gap-3 lg:gap-6">
              {/* Email */}
              <div className={`
                items-center gap-2
                ${scrolled ? 'text-white bg-red-500 p-2 rounded-full' : 'text-white'}
              `}>
                <a 
                  href="mailto:service@a2itltd.com"
                  className="hidden lg:flex items-center gap-2 group"
                >
                  <Mail size={18} className="text-[#f5b342] group-hover:scale-110 transition-transform" />
                  <span className="text-sm hover:text-[#f5b342] transition-colors border-b border-dashed border-white/30 whitespace-nowrap">
                    service@a2itltd.com
                  </span>
                </a>
              </div>

              {/* Phone */}
              <div className={`
                flex items-center gap-2
                ${scrolled ? 'text-white bg-blue-500 p-2 rounded-full' : 'text-white'}
              `}>
                <a 
                  href="tel:+880 1846-937397"
                  className="flex items-center gap-2 group"
                >
                  <Phone size={18} className="text-[#f5b342] group-hover:scale-110 transition-transform" />
                  <span className="font-medium hover:text-[#f5b342] transition-colors whitespace-nowrap text-sm lg:text-sm">
                    +880 1846-937397
                  </span>
                </a>
              </div>

              {/* Chat Button */}
              <a 
  href="https://www.facebook.com/A2ITLtd"
  className={`
    bg-[#f5b342] text-[#0b1c2f] font-semibold rounded-full 
    flex items-center gap-2 transition-all duration-300
    hover:bg-[#f5b342]/90 hover:scale-105 active:scale-95
    whitespace-nowrap group
    ${scrolled 
      ? 'py-2 px-4 text-sm shadow-md' 
      : 'py-2.5 px-5 text-sm lg:text-base shadow-lg shadow-[#f5b342]/20'
    }
  `}
>
  {/* <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" /> */}
  <span className="hidden sm:inline">Stay Connected</span>
  <span className="sm:hidden">Connect</span>
</a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              {/* Hamburger Menu */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`
                  p-2 rounded-lg transition-all duration-300
                  ${scrolled 
                    ? 'bg-secondary/80 text-gray-300' 
                    : 'bg-white/10 text-white backdrop-blur-sm'
                  }
                `}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? 'max-h-60 opacity-100 py-4' : 'max-h-0 opacity-0'}
          `}>
            <div className={`
              rounded-xl p-4 space-y-3
              ${scrolled 
                ? 'bg-secondary/95 backdrop-blur-md' 
                : 'bg-black/40 backdrop-blur-md'
              }
            `}>
              {/* Mobile Email */}
              <a 
                href="mailto:service@a2itltd.com"
                className={`
                  flex items-center gap-3 p-2 rounded-lg transition-colors
                  ${scrolled ? 'text-gray-300' : 'text-white'}
                  hover:bg-white/10
                `}
              >
                <Mail size={18} className="text-[#f5b342]" />
                <span className="text-sm">service@a2itltd.com</span>
              </a>

              {/* Mobile Phone (full) */}
              <a 
                href="tel:+880 1846-937397"
                className={`
                  flex items-center gap-3 p-2 rounded-lg transition-colors
                  ${scrolled ? 'text-gray-300' : 'text-white'}
                  hover:bg-white/10
                `}
              >
                <Phone size={18} className="text-[#f5b342]" />
                <span className="text-sm font-medium">+880 1846-937397</span>
              </a>

              {/* Mobile Full Chat Button */}
              <button 
  onClick={() => window.open('https://www.facebook.com/A2ITLtd', '_blank')}
  className="
    w-full bg-[#f5b342] text-[#0b1c2f] font-semibold rounded-lg 
    flex items-center justify-center gap-2 py-3 px-4
    hover:bg-[#f5b342]/90 transition-all duration-300
  "
>
  {/* <MessageCircle size={18} className="text-[#0b1c2f]" /> */}
  <span>Stay Connected</span>
</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      {scrolled && <div className="h-[72px] sm:h-[80px] md:h-[88px]" />}
    </>
  );
};

export default PromotionNavbar;