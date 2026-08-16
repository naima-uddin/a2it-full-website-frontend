"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import {
  FaCode,
  FaServer,
  FaRobot,
  FaCloud,
  FaShoppingCart,
} from "react-icons/fa";
import Link from "next/link";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const slideInterval = useRef(null);
  const bannerRef = useRef(null);

  const slides = [
    {
      bg: "/assets/banner/0.avif",
      title: "Seamless",
      highlight: "E-Commerce Services",
      subtitle: "Amazon, eBay, Alibaba & Affiliate business solutions",
      icon: <FaShoppingCart className="text-6xl text-[#00f0ff] mb-6" />,
      particles: 22,
    },
    {
      bg: "/assets/banner/1.avif",
      title: "Relinquish",
      highlight: "Digital Potential",
      subtitle: "Transform your vision into cutting-edge solutions",
      icon: <FaCode className="text-6xl text-[#00f0ff] mb-6" />,
      particles: 15,
    },
    {
      bg: "/assets/banner/2.avif",
      title: "Next Generation",
      highlight: "Tech Solutions",
      subtitle: "Scalable, secure, and innovative systems",
      icon: <FaServer className="text-6xl text-[#00f0ff] mb-6" />,
      particles: 20,
    },
    {
      bg: "/assets/banner/3.avif",
      title: "AI-Powered",
      highlight: "Innovation",
      subtitle: "Harnessing artificial intelligence for your business",
      icon: <FaRobot className="text-6xl text-[#00f0ff] mb-6" />,
      particles: 25,
    },
    {
      bg: "/assets/banner/4.jpeg",
      title: "Cloud-Native",
      highlight: "Architecture",
      subtitle: "Future-proof your infrastructure with our expertise",
      icon: <FaCloud className="text-6xl text-[#00f0ff] mb-6" />,
      particles: 18,
    },
  ];

  useEffect(() => {
    setIsClient(true);
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    slideInterval.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoSlide = () => {
    clearInterval(slideInterval.current);
  };

  const nextSlide = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAnimating(false);
  };

  const goToSlide = async (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCurrentSlide(index);
    setIsAnimating(false);
  };

  const generateParticles = (count) => {
    // Server-side এ শুধু empty array return করবে
    if (!isClient) {
      return [];
    }

    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 6 + 2;
      return (
        <motion.div
          key={`particle-${currentSlide}-${i}`}
          className="absolute rounded-full bg-[#00f0ff]"
          style={{
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 50 - 25],
            opacity: [Math.random() * 0.5 + 0.1, Math.random() * 0.5 + 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      );
    });
  };

  const generateFloatingElements = () => {
    // Server-side এ শুধু empty array return করবে
    if (!isClient) {
      return [];
    }

    const icons = [<FaCode />, <FaServer />, <FaRobot />, <FaCloud />];
    return [1, 2, 3, 4].map((i) => {
      const size = Math.random() * 40 + 20;
      return (
        <motion.div
          key={`floating-${i}`}
          className="absolute text-[#00f0ff]/30"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            fontSize: `${size}px`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 50 - 25],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          {icons[i % icons.length]}
        </motion.div>
      );
    });
  };

  return (
    <div
      ref={bannerRef}
      className=" relative w-full h-[60vh] sm:h-[70vh] md:h-[60vh] lg:h-[65vh] xl:h-[80vh] overflow-hidden mb-2 lg:mb-2"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image with gradient overlay */}
          <div className="absolute inset-0 z-0">
            <motion.img
              src={slides[currentSlide].bg}
              alt="Background"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Animated particles - শুধু client-side এ দেখাবে */}
          <div className="absolute inset-0 overflow-hidden z-5">
            {generateParticles(slides[currentSlide].particles)}
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "backOut" }}
              className="mb-8 max-w-4xl"
            >
              {slides[currentSlide].icon}

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
                {slides[currentSlide].title}{" "}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#0088ff] to-[#0066ff]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  {slides[currentSlide].highlight}
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
              >
                {slides[currentSlide].subtitle}
              </motion.p>
            </motion.div>

            <div className="flex gap-4 mb-15">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white rounded-full font-medium shadow-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.7)] transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Link href="/contact" className="flex items-center">
                  Get Started <FiArrowRight className="ml-2" />
                </Link>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-8 py-4 bg-transparent border-2 border-[#00f0ff] text-white rounded-full font-medium shadow-lg hover:shadow-[0_0_20px_-5px_rgba(0,240,255,0.5)] transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <Link href="/portfolio" className="flex items-center">
                  Learn More
                </Link>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative p-1 group"
            disabled={isAnimating}
          >
            <motion.div
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-[#00f0ff]" : "bg-gray-400"
              } group-hover:bg-[#00f0ff] transition-colors`}
              whileHover={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
            {currentSlide === index && (
              <motion.div
                className="absolute inset-0 border-2 border-[#00f0ff] rounded-full"
                layoutId="activeDot"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        onClick={() =>
          window.scrollBy({ top: window.innerHeight - 100, behavior: "smooth" })
        }
      >
        <span className="text-sm text-gray-300 mb-2 sm:display hidden">
          Explore More
        </span>
        <motion.div
          animate={{
            y: [0, 15, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-6 h-6 border-b-2 border-r-2 border-[#00f0ff] transform rotate-45"
        />
      </motion.div>

      {/* Floating tech elements - শুধু client-side এ দেখাবে */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {generateFloatingElements()}
      </div>
    </div>
  );
};

export default Banner;