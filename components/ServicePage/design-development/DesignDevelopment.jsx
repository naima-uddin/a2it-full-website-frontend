"use client";
import React, { useRef, useState, useEffect } from "react";
import ServiceWebDev from "./ServiceWebDev";
import ServiceMobileApp from "./ServiceMobileApp";
import ServiceUIUX from "./ServiceUIUX";

const DesignDevelopment = () => {
  const webRef = useRef(null);
  const mobileRef = useRef(null);
  const uiuxRef = useRef(null);
  const [activeSection, setActiveSection] = useState("web");

  const getNavbarHeight = () => 80;

  const handleScroll = (ref, section) => {
    if (ref.current) {
      const navbarHeight = getNavbarHeight();
      const elementPosition = ref.current.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      setActiveSection(section);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + getNavbarHeight() + 50;

      if (uiuxRef.current && scrollPosition >= uiuxRef.current.offsetTop) {
        setActiveSection("uiux");
      } else if (
        mobileRef.current &&
        scrollPosition >= mobileRef.current.offsetTop
      ) {
        setActiveSection("mobile");
      } else {
        setActiveSection("web");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Enhanced Sidebar - compact and attractive */}
      <aside className="fixed left-2 top-35 bg-[#12121a]/90 backdrop-blur-xl rounded-2xl p-2 z-40 shadow-2xl border border-[#00f0ff]/20">
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => handleScroll(webRef, "web")}
              className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 group ${
                activeSection === "web"
                  ? "bg-gradient-to-br from-[#00f0ff] to-[#00a6ff] shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  : "bg-[#1a1a2e] hover:bg-[#252547]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  activeSection === "web"
                    ? "text-[#0a0a12]"
                    : "text-[#00f0ff] group-hover:scale-110"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <span className="absolute left-14 bg-[#0a0a12] text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                Web Development
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll(mobileRef, "mobile")}
              className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 group ${
                activeSection === "mobile"
                  ? "bg-gradient-to-br from-[#00f0ff] to-[#00a6ff] shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  : "bg-[#1a1a2e] hover:bg-[#252547]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  activeSection === "mobile"
                    ? "text-[#0a0a12]"
                    : "text-[#00f0ff] group-hover:scale-110"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="absolute left-14 bg-[#0a0a12] text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                Mobile App
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll(uiuxRef, "uiux")}
              className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 group ${
                activeSection === "uiux"
                  ? "bg-gradient-to-br from-[#00f0ff] to-[#00a6ff] shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  : "bg-[#1a1a2e] hover:bg-[#252547]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  activeSection === "uiux"
                    ? "text-[#0a0a12]"
                    : "text-[#00f0ff] group-hover:scale-110"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <span className="absolute left-14 bg-[#0a0a12] text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                UI/UX Design
              </span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main content - stays full width */}
      <main className=" space-y-20 w-full">
        <section ref={webRef} className="scroll-mt-20">
          <ServiceWebDev />
        </section>

        <section ref={mobileRef} className="scroll-mt-20">
          <ServiceMobileApp />
        </section>

        <section ref={uiuxRef} className="scroll-mt-20">
          <ServiceUIUX />
        </section>
      </main>
    </div>
  );
};

export default DesignDevelopment;
