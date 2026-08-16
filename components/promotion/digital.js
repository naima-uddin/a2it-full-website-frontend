"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ConsultModal from '@/components/promotion/promotionModal';

const images = [
  "/images/project (9).jpeg",
  "/images/project (2).jpeg",
  "/images/project (3).jpeg",
  "/images/project (4).jpeg",
  "/images/project (5).jpeg",
  "/images/project (6).jpeg",
  "/images/project (7).jpeg",
  "/images/project (8).jpeg",
];

export default function Digital() {
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="relative w-full overflow-hidden min-h-[800px] lg:min-h-[600px] py-10 lg:py-0">
        {/* 🔵 BACKGROUND IMAGE */}
        <div className="absolute inset-0 -z-10 w-full">
          <Image
            src="/images/banner3.jpg"
            alt="background"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/70 to-orange-950/80 -z-10"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-20 items-center px-4 sm:px-6 py-6 lg:py-12">
          {/* LEFT CONTENT */}
          <div className="max-w-xl order-2 lg:order-1 text-center lg:text-left">
            {/* SMALL TAG */}
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs sm:text-sm font-semibold tracking-wide">
              🚀 Digital Solutions For Your Business
            </span>

            {/* HEADING */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-100">
              In the ever-connected,
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-[#f5b342] bg-clip-text text-transparent">
                attention-challenged
              </span>
              <br />
              digital era.
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-100 leading-relaxed">
              Designs Genie specializes in creating
              <span className="font-semibold text-[#f5b342]">
                {" "}captivating brand experiences
              </span>{" "}
              that inspire audiences and drive meaningful growth.
            </p>

            {/* FEATURES - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 mt-6 sm:mt-8 text-gray-300 text-xs sm:text-sm">
              {[
                "Website Design & Development",
                "Web Application Development",
                "Website Maintenance",
                "Branding And Stationary Design",
                "Search Engine Optimization",
                "Ecommerce Website Development",
                "Mobile Application Development",
                "Domain and Hosting",
                "Video Animation",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 group">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-[#f5b342] text-white text-xs font-bold shadow-md group-hover:scale-110 transition flex-shrink-0">
                    ✓
                  </div>
                  <p className="group-hover:text-[#f5b342] transition text-left">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* BUTTON */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-8 sm:mt-10">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-[#f5b342] text-white font-semibold shadow-lg hover:shadow-orange-300/40 hover:scale-105 transition duration-300 text-sm sm:text-base"
              >
                Let&apos;s Get Started
              </button>
            </div>
          </div>

          {/* RIGHT SLIDER - Hidden on mobile, visible on lg screens */}
          <div className="relative hidden lg:flex items-center justify-center h-[500px] order-1 lg:order-2">
            {images.map((src, i) => {
              const position = (i - index + images.length) % images.length;

              return (
                <motion.div
                  key={i}
                  className="absolute rounded-2xl overflow-hidden bg-white shadow-2xl"
                  animate={{
                    scale: position === 0 ? 1 : 0.82,
                    x: position === 0 ? 0 : position === 1 ? 140 : -140,
                    y: position === 0 ? 0 : 40,
                    opacity: position === 0 ? 1 : 0.45,
                    zIndex: position === 0 ? 30 : 10,
                    filter: position === 0 ? "blur(0px)" : "blur(1px)",
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src={src}
                    alt="project"
                    width={420}
                    height={420}
                    className="w-[280px] xl:w-[300px] h-[380px] xl:h-[400px] object-cover p-3"
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Slider - Simple version for small screens */}
          <div className="lg:hidden order-1 mb-8">
            <div className="relative w-full max-w-sm mx-auto h-[300px]">
              <Image
                src={images[index]}
                alt="project"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
            {/* Dots indicator for mobile */}
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index 
                      ? "w-6 bg-orange-500" 
                      : "w-2 bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Consult Modal */}
      <ConsultModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}