"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const ClientShowcase = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos`,
        );

        if (!response.ok) return;

        const data = await response.json();
        setLogos((data.logos || []).map((logo) => logo.image));
      } catch (error) {
        console.error("Error fetching client logos:", error);
      }
    };

    fetchLogos();
  }, []);

  return (
    <div className="bg-white">
      <div className="text-[#e0e0ff] py-2 overflow-hidden max-w-7xl mx-auto px-0">
        {/* Main row */}
        <div className="max-w-7xl mx-auto flex flex-col md:justify-center items-center gap-2">
          {/* Left text + client image */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="flex flex-col md:flex-row items-center justify-center md:items-end gap-4 md:gap-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight text-center md:text-left">
                Our <span className="text-[#0066ff]">clients</span>
              </h2>

              {/* Client image */}
              <div className="relative w-40 sm:w-48 md:w-60 aspect-[3/2] flex items-end justify-center -ml-0 md:-ml-6">
                {/* <div className="absolute bottom-0 w-28 sm:w-32 md:w-44 h-6 sm:h-8 md:h-10 bg-[#00f0ff] rounded-full z-0 shadow-[0_10px_30px_rgba(0,240,255,0.3)]" /> */}
                <Image
                  src="/assets/clientsImg/clients.png"
                  alt="Happy Clients"
                  width={200}
                  height={150}
                  className="relative z-10 w-full h-auto object-contain ml-8 sm:ml-12 md:ml-20"
                  style={{
                    filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.3))",
                  }}
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Premium subtitle */}
            <div className="mt-4 md:mt-1 relative w-full">
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center px-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d4d52] to-[#0066ff]">
                  Reflects
                </span>{" "}
                <span className="text-black">our expertise </span>
              </h3>
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3/4 sm:w-2/3 md:w-1/2 h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent rounded-full" />
            </div>
          </div>
        </div>

        {/* Scrolling logos */}
        {logos.length > 0 && (
          <div className="mt-6 md:mt-4 overflow-hidden whitespace-nowrap px-4">
            <div
              className="inline-block"
              style={{
                animation: "scroll 25s linear infinite",
              }}
            >
              {[...logos, ...logos].map((logo, idx) => (
                <Image
                  key={idx}
                  src={logo}
                  alt={`logo-${idx}`}
                  width={120}
                  height={80}
                  className="inline-block h-20 sm:h-24 md:h-26 mx-3 sm:mx-4 md:mx-6 hover:grayscale-0 transition duration-300 border-2 border-blue-200"
                  unoptimized
                />
              ))}
            </div>
          </div>
        )}

        {/* Animation styles */}
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          @media (min-width: 768px) {
            .inline-block {
              animation-duration: 10s !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ClientShowcase;
