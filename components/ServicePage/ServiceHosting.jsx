"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiServer,
  FiDatabase,
  FiShield,
  FiZap,
  FiGlobe,
  FiCpu,
  FiBarChart2,
  FiDownload,
  FiUpload,
  FiCode,
  FiX,
  FiChevronDown,
  FiCloudRain,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const ServiceHosting = () => {
  const [activeCategory, setActiveCategory] = useState("web-hosting");
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categoryData = {
    "web-hosting": {
      title: "Web Hosting",
      icon: <FiGlobe className="text-2xl" />,
      color: "from-[#00f0ff] to-[#0066ff]",
      content: `A2IT Web Hosting Services: Reliable, Secure, and Scalable Solutions for Your Online Presence
      
      In the digital age, establishing a robust online presence is paramount for businesses and individuals alike. Central to this presence is reliable web hosting. At A2IT, we offer a comprehensive suite of web hosting services tailored to meet the diverse needs of our clients.`,
    },
    "cloud-hosting": {
      title: "Cloud Hosting",
      icon: <FiCloudRain className="text-2xl" />,
      color: "from-[#0066ff] to-[#00a0ff]",
      content: `A2IT Cloud Hosting Services: Empowering Your Digital Transformation
      
      In today's fast-paced digital landscape, businesses require robust, scalable, and secure hosting solutions to support their online operations. A2IT's Cloud Hosting Services offer a cutting-edge infrastructure designed to meet the diverse needs of modern enterprises.`,
    },
    "dedicated-servers": {
      title: "Dedicated Servers",
      icon: <FiServer className="text-2xl" />,
      color: "from-[#ff00cc] to-[#ff0066]",
      content: `A2IT Dedicated Server Hosting: Unmatched Performance and Control for Your Business
      
      In the ever-evolving digital landscape, businesses require robust and reliable hosting solutions to ensure their online presence remains uninterrupted. A2IT's Dedicated Server Hosting offers a premium service designed to meet the needs of enterprises seeking unparalleled performance, security, and control.`,
    },
    "vps-hosting": {
      title: "VPS Hosting",
      icon: <FiCpu className="text-2xl" />,
      color: "from-[#00ff99] to-[#00ccff]",
      content: `A2IT VPS Hosting: Empowering Your Business with Scalable and Secure Solutions
      
      In the ever-evolving digital landscape, businesses require robust and reliable hosting solutions to ensure seamless online operations. A2IT's Virtual Private Server (VPS) hosting services offer a perfect blend of performance, flexibility, and security, catering to businesses of all sizes.`,
    },
    "managed-hosting": {
      title: "Managed Hosting",
      icon: <FiShield className="text-2xl" />,
      color: "from-[#ff9900] to-[#ff6600]",
      content: `A2IT Managed Hosting Servers: Comprehensive Solutions for Modern Businesses
      
      In today's digital-first world, businesses require robust, secure, and efficient hosting solutions to ensure seamless online operations. A2IT's Managed Hosting Servers offer a comprehensive suite of services designed to meet the diverse needs of modern enterprises.`,
    },
    "domain-management": {
      title: "Domain Management",
      icon: <FiGlobe className="text-2xl" />,
      color: "from-[#cc00ff] to-[#6600ff]",
      content: `A2IT Domain Management Servers: Streamlining Your Online Presence
      
      In the digital age, your domain name is more than just an address—it's the cornerstone of your online identity. Efficient domain management ensures that your website remains accessible, secure, and aligned with your business objectives.`,
    },
  };

  // Predefined positions for the dots to avoid hydration mismatch
  const dotPositions = [
    { left: "10%", top: "20%" },
    { left: "25%", top: "60%" },
    { left: "40%", top: "30%" },
    { left: "55%", top: "80%" },
    { left: "70%", top: "40%" },
    { left: "85%", top: "70%" },
    { left: "15%", top: "50%" },
    { left: "30%", top: "10%" },
    { left: "45%", top: "90%" },
    { left: "60%", top: "25%" },
    { left: "75%", top: "65%" },
    { left: "90%", top: "35%" },
    { left: "20%", top: "75%" },
    { left: "35%", top: "45%" },
    { left: "50%", top: "15%" },
  ];

  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/assets/amazon/1.avif"
            alt="Server background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div> 

        <div className="absolute bottom-0 left-0 right-0 h-32">
          <div className="flex justify-center space-x-4">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  repeatType: "reverse",
                }}
                className="w-2 h-2 rounded-full bg-[#00f0ff]"
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-[#00f0ff] text-[#0a0a12] font-medium mb-6 rounded-full">
              ENTERPRISE HOSTING
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                High-Performance
              </span>{" "}
              Hosting Solutions
            </h1>
            <p className="text-xl text-black max-w-2xl mb-12">
              Enterprise-grade server infrastructure with 99.99% uptime, global
              CDN, and military-grade security.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-4 px-8 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Custom Quote
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="border-2 border-[#00f0ff] text-[#0066ff] hover:bg-[#00f0ff]/10 font-semibold py-4 px-8 rounded-lg transition-colors duration-300"
              >
                View More
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative bg-[#fff] shadow-2xl p-6 rounded-xl border border-[#00f0ff]/30">
              <div className="server-rack">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="server-unit flex items-center px-4 py-3 border-b border-[#00f0ff]/10"
                  >
                    <div className="w-3 h-3 rounded-full bg-[#0066ff] mr-3"></div>
                    <div className="flex-1">
                      <div className="h-2 bg-[#00f0ff]/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${30 + i * 10}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className="h-full bg-[#00f0ff] rounded-full"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-[#0066ff] ml-3">
                      Node-{i + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-[#0066ff]/10 rounded-lg border border-[#0066ff]/20">
                  <FiDownload className="text-[#0066ff] text-xl mx-auto mb-1" />
                  <div className="text-sm">10Gbps</div>
                </div>
                <div className="p-3 bg-[#00f0ff]/10 rounded-lg border border-[#00f0ff]/20">
                  <FiCpu className="text-[#0066ff] text-xl mx-auto mb-1" />
                  <div className="text-sm">64 Cores</div>
                </div>
                <div className="p-3 bg-[#0066ff]/10 rounded-lg border border-[#0066ff]/20">
                  <FiDatabase className="text-[#0066ff] text-xl mx-auto mb-1" />
                  <div className="text-sm">NVMe SSD</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="py-16 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              OUR SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#0066ff]">Comprehensive</span> Hosting
              Services
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Choose the perfect hosting solution for your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {Object.entries(categoryData).map(([key, category]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(key)}
                className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                  activeCategory === key
                    ? `bg-gradient-to-r ${category.color} text-white`
                    : "bg-white text-black shadow-2xl border hover:bg-[#0066ff] hover:text-white"
                }`}
              >
                <div className="mb-2">{category.icon}</div>
                <span className="text-sm font-medium">{category.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Category Content Display */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-2xl rounded-xl overflow-hidden border border-[#00f0ff]/20"
            >
              <div
                className={`h-2 bg-gradient-to-r ${categoryData[activeCategory].color}`}
              ></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    {categoryData[activeCategory].icon}
                    {categoryData[activeCategory].title}
                  </h3>
                  <button
                    onClick={() => setExpandedInfo(!expandedInfo)}
                    className="flex items-center gap-2 text-[#00f0ff] hover:text-[#00a0ff] transition-colors"
                  >
                    {expandedInfo ? (
                      <>
                        <span>Show Less</span>
                        <FiX />
                      </>
                    ) : (
                      <>
                        <span>Learn More</span>
                        <FiChevronDown />
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {expandedInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="prose prose-invert max-w-none text-black">
                        <p className="whitespace-pre-line">
                          {categoryData[activeCategory].content}
                        </p>
                      </div>
                      <div className="mt-6">
                        <Link
                          href="/contact"
                          className="inline-flex items-center bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-2 px-6 rounded-lg hover:shadow-[0_0_20px_-5px_rgba(0,240,255,0.5)] transition-all duration-300"
                        >
                          Get Started with {categoryData[activeCategory].title}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Hosting Types – Tech Spec Cards */}
      <section className="mb-6 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              TECHNICAL SPECIFICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#0066ff]">Scalable</span> Hosting
              Infrastructure
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Enterprise-grade solutions for every workload
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                type: "Cloud Hosting",
                icon: <FiGlobe className="text-4xl" />,
                specs: [
                  { name: "CPU Cores", value: "4-64", icon: <FiCpu /> },
                  { name: "RAM", value: "8-256GB", icon: <FiZap /> },
                  { name: "Storage", value: "100GB-4TB", icon: <FiDatabase /> },
                  { name: "Bandwidth", value: "Unmetered", icon: <FiUpload /> },
                ],
                color: "from-[#00f0ff] to-[#0066ff]",
              },
              {
                type: "Dedicated Servers",
                icon: <FiServer className="text-4xl" />,
                specs: [
                  { name: "Processors", value: "Dual Xeon", icon: <FiCpu /> },
                  { name: "RAM", value: "32-512GB", icon: <FiZap /> },
                  { name: "Storage", value: "RAID NVMe", icon: <FiDatabase /> },
                  { name: "Uplink", value: "10-100Gbps", icon: <FiUpload /> },
                ],
                color: "from-[#0066ff] to-[#00f0ff]",
              },
              {
                type: "Edge Computing",
                icon: <FiCode className="text-4xl" />,
                specs: [
                  { name: "Locations", value: "50+", icon: <FiGlobe /> },
                  { name: "Latency", value: "<10ms", icon: <FiZap /> },
                  { name: "Cache", value: "1TB+", icon: <FiDatabase /> },
                  { name: "Tiering", value: "Smart", icon: <FiBarChart2 /> },
                ],
                color: "from-[#00f0ff] to-[#0066ff]",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-2xl rounded-xl overflow-hidden border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#0066ff]/10 to-[#00f0ff]/10 rounded-lg flex items-center justify-center text-[#00f0ff] mb-6 border border-[#00f0ff]/20">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-6">{service.type}</h3>
                  <ul className="space-y-4">
                    {service.specs.map((spec, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#0066ff]/10 rounded-full flex items-center justify-center text-[#00f0ff] mr-3">
                            {spec.icon}
                          </div>
                          <span className="text-[#0066ff]">{spec.name}</span>
                        </div>
                        <span className="font-mono font-bold">
                          {spec.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-10 px-6 sm:px-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {dotPositions.map((position, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.1, 0.5, 0.1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                repeatType: "reverse",
              }}
              className="absolute w-1 h-1 rounded-full bg-[#00f0ff]"
              style={{
                left: position.left,
                top: position.top,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              Enterprise-Grade
            </span>{" "}
            Hosting?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-black mb-8 max-w-2xl mx-auto"
          >
            Let's build the perfect infrastructure for your mission-critical
            applications.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-4 px-12 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300 transform hover:scale-105"
            >
              Deploy Your Servers
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceHosting;
