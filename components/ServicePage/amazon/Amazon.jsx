"use client";

import React, { useRef, useState, useEffect } from "react";
import ServiceAffiliate from "./ServiceAffiliate";
import ServiceFBA from "./ServiceFBA";
import ServiceDSP from "./ServiceDSP";
import ServiceVendor from "./ServiceVendor";
import ServiceMarketing from "./ServiceMarketing";

const AmazonServices = () => {
  const affiliateRef = useRef(null);
  const fbaRef = useRef(null);
  const dspRef = useRef(null);
  const vendorRef = useRef(null);
  const marketingRef = useRef(null);
  const [activeSection, setActiveSection] = useState("affiliate");

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
    const onScroll = () => {
      const scrollPosition = window.scrollY + getNavbarHeight() + 50;

      if (
        marketingRef.current &&
        scrollPosition >= marketingRef.current.offsetTop
      ) {
        setActiveSection("marketing");
      } else if (
        vendorRef.current &&
        scrollPosition >= vendorRef.current.offsetTop
      ) {
        setActiveSection("vendor");
      } else if (dspRef.current && scrollPosition >= dspRef.current.offsetTop) {
        setActiveSection("dsp");
      } else if (fbaRef.current && scrollPosition >= fbaRef.current.offsetTop) {
        setActiveSection("fba");
      } else {
        setActiveSection("affiliate");
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Sidebar */}
      <aside className="fixed left-2 top-30 bg-[#12121a]/90 backdrop-blur-xl rounded-2xl p-2 z-50 shadow-2xl border border-[#00f0ff]/20">
        <ul className="space-y-3">
          {[
            {
              ref: affiliateRef,
              key: "affiliate",
              label: "Affiliate Program",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
            },
            {
              ref: fbaRef,
              key: "fba",
              label: "FBA Services",
              icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
            },
            {
              ref: vendorRef,
              key: "vendor",
              label: "Vendor Central",
              icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            },
            {
              ref: marketingRef,
              key: "marketing",
              label: "Marketing Services",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            },
          ].map((item) => (
            <li key={item.key}>
              <button
                onClick={() => handleScroll(item.ref, item.key)}
                className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 group ${
                  activeSection === item.key
                    ? "bg-gradient-to-br from-[#00f0ff] to-[#00a6ff] shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                    : "bg-[#1a1a2e] hover:bg-[#252547]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${
                    activeSection === item.key
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
                    d={item.icon}
                  />
                </svg>
                <span className="absolute left-14 bg-[#0a0a12] text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="w-full">
        <section ref={affiliateRef} className="scroll-mt-20">
          <ServiceAffiliate />
        </section>
        <section ref={fbaRef} className="scroll-mt-20">
          <ServiceFBA />
        </section>
        {/* <section ref={dspRef} className="scroll-mt-20">
          <ServiceDSP />
        </section> */}
        <section ref={vendorRef} className="scroll-mt-20">
          <ServiceVendor />
        </section>
        <section ref={marketingRef} className="scroll-mt-20">
          <ServiceMarketing />
        </section>
      </main>
    </div>
  );
};

export default AmazonServices;
