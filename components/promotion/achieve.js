"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaDollarSign, FaClock } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { BiPaint } from "react-icons/bi";
import { motion } from "framer-motion";

const features = [
  { icon: <FaDollarSign className="w-6 h-6 text-[#FD5621]" />, title: "Money-Back Policy" },
  { icon: <AiFillStar className="w-6 h-6 text-[#FD5621]" />, title: "Customer Satisfaction" },
  { icon: <FaClock className="w-6 h-6 text-[#FD5621]" />, title: "Round-the-Clock Support" },
  { icon: <BiPaint className="w-6 h-6 text-[#FD5621]" />, title: "Custom Crafted Designs" },
];

const collageImages = [
  { src: "/images/achieve (1).jpg", rotate: 3 },
  { src: "/images/achieve (2).jpg", rotate: -6 },
  { src: "/images/achieve (3).jpg", rotate: 6 },
  { src: "/images/achieve (4).jpg", rotate: -3 },
  { src: "/images/achieve (5).jpg", rotate: 4 },
  { src: "/images/achieve (6).jpg", rotate: -5 },
];

const Achieve = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % collageImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Desktop version with absolute positioning
  const DesktopCollage = () => (
    <div className="relative w-full h-[400px] lg:h-[500px]">
      {collageImages.map((img, idx) => {
        // Different positions for desktop
        const positions = [
          { top: 0, left: 10, w: 200, h: 200 },
          { top: 40, left: 150, w: 180, h: 180 },
          { top: 100, left: 60, w: 160, h: 160 },
          { top: 60, left: 220, w: 180, h: 180 },
          { top: 150, left: 140, w: 200, h: 200 },
          { top: 20, left: 300, w: 170, h: 170 },
        ];
        
        return (
          <motion.div
            key={idx}
            className="absolute rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform duration-300"
            style={{
              top: positions[idx].top + "px",
              left: positions[idx].left + "px",
              width: positions[idx].w + "px",
              height: positions[idx].h + "px",
              zIndex: activeImage === idx ? 10 : idx,
              filter: activeImage === idx ? "blur(0px) brightness(1)" : "blur(1px) brightness(0.7)",
            }}
            whileHover={{ scale: 1.05 }}
            animate={{
              scale: activeImage === idx ? 1.1 : 1,
              rotate: activeImage === idx ? 0 : img.rotate,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={() => setActiveImage(idx)}
          >
            <Image
              src={img.src}
              alt={`Brand Collage ${idx + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        );
      })}
    </div>
  );

  // Mobile version with grid layout
  const MobileCollage = () => (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {collageImages.map((img, idx) => (
        <motion.div
          key={idx}
          className="relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer"
          whileHover={{ scale: 1.02 }}
          animate={{
            scale: activeImage === idx ? 1.05 : 1,
            rotate: activeImage === idx ? 0 : img.rotate * 0.3,
            zIndex: activeImage === idx ? 10 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={() => setActiveImage(idx)}
          style={{
            filter: activeImage === idx ? "blur(0px) brightness(1)" : "blur(0.3px) brightness(0.9)",
          }}
        >
          <Image
            src={img.src}
            alt={`Brand Collage ${idx + 1}`}
            fill
            className="object-cover"
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden py-8 md:py-12 lg:py-16">
      {/* Background shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-48 md:w-72 lg:w-96 h-48 md:h-72 lg:h-96 bg-[#FD5621]/10 rounded-full top-10 left-10 animate-pulseSlow"></div>
        <div className="absolute w-40 md:w-56 lg:w-72 h-40 md:h-56 lg:h-72 bg-[#122652]/10 rounded-full bottom-20 right-20 animate-pulseSlow"></div>
        <div className="absolute w-32 md:w-48 lg:w-64 h-32 md:h-48 lg:h-64 bg-[#FD5621]/20 rounded-full top-1/2 left-1/3 animate-spinSlow"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Conditional rendering based on device */}
        {isMobile ? (
          // Mobile Layout: Collage first, then content
          <>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <MobileCollage />
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 leading-tight text-center">
                Achieve Professional <span className="text-[#FD5621]">Growth</span> through Brand{" "}
                <span className="text-[#FD5621]">Enhancement</span>
              </h2>
              <p className="text-sm text-gray-600 text-center">
                From the initial conceptualization till the final delivery of the designs, we make sure each step is smooth, transparent & flawless.
              </p>

              <div className="grid grid-cols-1 gap-2 mt-4">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 rounded-xl shadow-md cursor-pointer transition-all duration-300
                             bg-white hover:bg-gradient-to-r hover:from-[#FD5621]/30 hover:to-[#122652]/30"
                  >
                    <div className="p-2 rounded-full transition-colors duration-300 bg-white/20">
                      {React.cloneElement(feature.icon, { className: "w-4 h-4 text-[#FD5621]" })}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 hover:text-white transition-colors duration-300">
                      {feature.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          // Desktop Layout: Side by side
          <div className="flex flex-row items-center gap-8 lg:gap-12">
            {/* Left - Image Collage */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <DesktopCollage />
            </motion.div>

            {/* Right - Features */}
            <motion.div
              className="flex-1 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Achieve Professional <span className="text-[#FD5621]">Growth</span> through Brand{" "}
                <span className="text-[#FD5621]">Enhancement</span>
              </h2>
              <p className="text-base lg:text-lg text-gray-600">
                From the initial conceptualization till the final delivery of the designs, we make sure each step is smooth, transparent & flawless.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-6">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl shadow-lg cursor-pointer transition-all duration-300
                             bg-white hover:bg-gradient-to-r hover:from-[#FD5621]/30 hover:to-[#122652]/30"
                  >
                    <div className="p-3 rounded-full transition-colors duration-300 bg-white/20">
                      {React.cloneElement(feature.icon, { className: "w-6 h-6 text-[#FD5621]" })}
                    </div>
                    <span className="text-base font-semibold text-gray-900 hover:text-white transition-colors duration-300">
                      {feature.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Achieve;