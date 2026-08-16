"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  FiCpu,
  FiDatabase,
  FiPieChart,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiGlobe,
  FiShield,
  FiRefreshCw,
  FiBriefcase,
  FiServer,
  FiCode,
  FiShoppingCart,
  FiArrowRight,
  FiPlay,
  FiX,
} from "react-icons/fi";
import Link from "next/link";

const ServiceERP = () => {
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const industries = [
    {
      name: "Manufacturing",
      icon: <FiSettings className="mr-3" />,
      features: [
        "Shop floor control",
        "Quality management",
        "Supply chain integration",
      ],
      color: "from-[#3d5afe] to-[#00bcd4]",
    },
    {
      name: "Healthcare",
      icon: <FiUsers className="mr-3" />,
      features: ["Patient management", "HIPAA compliance", "Medical inventory"],
      color: "from-[#00bcd4] to-[#3d5afe]",
    },
    {
      name: "Retail",
      icon: <FiShoppingCart className="mr-3" />,
      features: [
        "Omnichannel POS",
        "Inventory optimization",
        "Customer analytics",
      ],
      color: "from-[#3d5afe] to-[#00bcd4]",
    },
    {
      name: "Construction",
      icon: <FiBriefcase className="mr-3" />,
      features: ["Project costing", "Equipment tracking", "Subcontractor mgmt"],
      color: "from-[#00bcd4] to-[#3d5afe]",
    },
  ];

  const capabilities = [
    {
      icon: <FiCpu className="text-3xl" />,
      title: "AI-Powered Analytics",
      description: "Predictive insights and machine learning models",
      color: "from-[#3d5afe] to-[#00bcd4]",
    },
    {
      icon: <FiDatabase className="text-3xl" />,
      title: "Unified Data Platform",
      description: "Single source of truth across all departments",
      color: "from-[#00bcd4] to-[#3d5afe]",
    },
    {
      icon: <FiRefreshCw className="text-3xl" />,
      title: "Process Automation",
      description: "Eliminate manual workflows with RPA",
      color: "from-[#3d5afe] to-[#00bcd4]",
    },
    {
      icon: <FiGlobe className="text-3xl" />,
      title: "Global Deployment",
      description: "Multi-currency, language, and compliance",
      color: "from-[#00bcd4] to-[#3d5afe]",
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "Blockchain Security",
      description: "Immutable audit trails and smart contracts",
      color: "from-[#3d5afe] to-[#00bcd4]",
    },
    {
      icon: <FiServer className="text-3xl" />,
      title: "Hybrid Cloud",
      description: "Flexible deployment options",
      color: "from-[#00bcd4] to-[#3d5afe]",
    },
  ];

  const steps = [
    {
      phase: "Phase 1",
      title: "Discovery & Planning",
      duration: "2-4 Weeks",
      activities: [
        "Requirements workshop",
        "Process mapping",
        "Solution design",
      ],
      color: "bg-[#3d5afe]",
    },
    {
      phase: "Phase 2",
      title: "Core System Setup",
      duration: "4-6 Weeks",
      activities: [
        "Platform configuration",
        "Data migration",
        "Basic automation",
      ],
      color: "bg-[#00bcd4]",
    },
    {
      phase: "Phase 3",
      title: "Module Implementation",
      duration: "6-8 Weeks",
      activities: [
        "Departmental rollouts",
        "Custom development",
        "Integration",
      ],
      color: "bg-[#3d5afe]",
    },
    {
      phase: "Phase 4",
      title: "Testing & Training",
      duration: "3-4 Weeks",
      activities: [
        "User acceptance testing",
        "Training programs",
        "Documentation",
      ],
      color: "bg-[#00bcd4]",
    },
    {
      phase: "Phase 5",
      title: "Go-Live & Support",
      duration: "Ongoing",
      activities: [
        "Phased rollout",
        "Hypercare support",
        "Continuous improvement",
      ],
      color: "bg-[#3d5afe]",
    },
  ];

  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute -top-12 right-0 text-white text-2xl p-2 hover:text-[#00bcd4] transition-colors"
            >
              <FiX />
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {/* Replace with actual video embed */}
              <div className="w-full l flex items-center justify-center bg-gradient-to-br from-[#3d5afe]/20 to-[#00bcd4]/20">
                <p className="text-xl text-white/80">ERP System Demo Video</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* **Hero Section – Enhanced with 3D elements** */}
      <section className="relative  flex items-center overflow-hidden">
        {/* Animated grid background with movement */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]"></div>
        </div>

        {/* Animated floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#3d5afe] opacity-20 blur-[100px]"
        ></motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#00bcd4] opacity-15 blur-[100px]"
        ></motion.div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#00bcd4] opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-4 py-2 bg-[#3d5afe] text-white font-medium mb-6 rounded-full"
            >
              ENTERPRISE SOLUTIONS
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3d5afe] to-[#00bcd4]">
                Next-Gen ERP Systems
              </span>
            </h1>
            <p className="text-xl text-[#000] max-w-2xl mb-12">
              AI-powered enterprise platforms that unify your operations with
              predictive analytics and intelligent automation.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="relative overflow-hidden group bg-gradient-to-r from-[#3d5afe] to-[#00bcd4] text-white font-semibold py-4 px-8 rounded-lg hover:shadow-[0_0_30px_rgba(61,90,254,0.5)] transition-all duration-300 flex items-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Request Demo{" "}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Animated dashboard mockup */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="relative bg-white p-1 rounded-xl border border-[#3d5afe]/30 shadow-2xl shadow-[#3d5afe]/10"
            >
              <div className="absolute inset-0 rounded-xl border border-[#00bcd4]/20 pointer-events-none"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-[#3d5afe]/10 to-[#00bcd4]/10 rounded-xl blur-lg opacity-30 -z-10"></div>

              {/* Mock dashboard UI with animations */}
              <div className="bg-white p-6 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <div className="text-sm text-[#000]">
                    ERP DASHBOARD v4.2
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#3d5afe]/10 p-3 rounded-lg border border-[#3d5afe]/20"
                  >
                    <div className="text-[#00bcd4] text-sm mb-1">Revenue</div>
                    <div className="text-xl font-mono">$284,402</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-[#00bcd4]/10 p-3 rounded-lg border border-[#00bcd4]/20"
                  >
                    <div className="text-[#3d5afe] text-sm mb-1">Orders</div>
                    <div className="text-xl font-mono">1,284</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#3d5afe]/10 p-3 rounded-lg border border-[#3d5afe]/20"
                  >
                    <div className="text-[#00bcd4] text-sm mb-1">
                      Efficiency
                    </div>
                    <div className="text-xl font-mono">87%</div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="h-40 bg-gradient-to-r from-[#3d5afe]/10 to-[#00bcd4]/10 rounded-lg border border-[#3d5afe]/20 flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-20"></div>
                  <FiPieChart className="text-4xl text-[#000] opacity-60" />

                  {/* Animated chart elements */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-around px-6">
                    {[30, 60, 45, 80, 55, 70].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                        className="w-3 bg-gradient-to-t from-[#3d5afe] to-[#00bcd4] rounded-t-md"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating elements around dashboard */}
            <motion.div
              animate={{
                rotate: 360,
                y: [0, -10, 0],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-[#3d5afe] rounded-full flex items-center justify-center text-white text-sm z-20 shadow-lg shadow-[#3d5afe]/40"
            >
              <FiDatabase />
            </motion.div>
            <motion.div
              animate={{
                rotate: -360,
                y: [0, 10, 0],
              }}
              transition={{
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#00bcd4] rounded-full flex items-center justify-center text-white text-sm z-20 shadow-lg shadow-[#00bcd4]/40"
            >
              <FiServer />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* **Core Capabilities – Enhanced with hover effects** */}
      <section className="py-6 px-6 sm:px-12 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#3d5afe] opacity-10 blur-[100px]"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#00bcd4] opacity-10 blur-[100px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00bcd4] font-semibold tracking-widest text-sm">
              ENTERPRISE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#3d5afe]">Modular</span> Platform
              Architecture
            </h2>
            <p className="text-[#000] max-w-2xl mx-auto">
              Scalable components that adapt to your evolving business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white shadow-2xl p-8 rounded-xl border border-[#3d5afe]/10 hover:border-[#00bcd4]/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(0,188,212,0.5)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#3d5afe]/5 to-[#00bcd4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white mb-6 relative z-10`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">
                  {item.title}
                </h3>
                <p className="text-[#000] relative z-10">
                  {item.description}
                </p>

                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3d5afe] to-[#00bcd4] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Industry Solutions – Interactive Carousel** */}
      <section className="py-10 px-6 sm:px-12 bg-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9InJnYmEoNjEsOTAsMjU0LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgLz48L3N2Zz4=')]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00bcd4] font-semibold tracking-widest text-sm">
              INDUSTRY FOCUS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#3d5afe]">Vertical-Specific</span>{" "}
              Solutions
            </h2>
            <p className="text-[#000] max-w-2xl mx-auto">
              Tailored ERP configurations for your industry challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Industry selector */}
            <div className="flex flex-col space-y-4">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveIndustry(index)}
                  className={`bg-white shadow-2xl p-6 rounded-xl border cursor-pointer transition-all duration-300 group ${
                    activeIndustry === index
                      ? "border-[#00bcd4]/50 shadow-[0_0_20px_-5px_rgba(0,188,212,0.3)]"
                      : "border-[#3d5afe]/10 hover:border-[#00bcd4]/30"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${industry.color} flex items-center justify-center text-white mr-4`}
                    >
                      {industry.icon}
                    </div>
                    <h3 className="text-xl font-bold">{industry.name}</h3>
                  </div>
                  <div className="mt-4 pl-14">
                    <ul className="space-y-2">
                      {industry.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start text-[#000]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 mr-3 bg-gradient-to-r ${industry.color}`}
                          ></div>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right side - Visual representation */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full h-96">
                {/* Animated industry visualization */}
                <motion.div
                  key={activeIndustry}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-80 h-80">
                    {/* Central icon */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div
                        className={`w-32 h-32 rounded-full bg-gradient-to-r ${industries[activeIndustry].color} flex items-center justify-center text-white text-4xl shadow-lg`}
                      >
                        {industries[activeIndustry].icon}
                      </div>
                    </div>

                    {/* Rotating circles */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full border border-[#3d5afe]/30"
                    ></motion.div>

                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-8 rounded-full border border-[#00bcd4]/30"
                    ></motion.div>

                    {/* Floating features */}
                    {industries[activeIndustry].features.map((feature, i) => {
                      const angle =
                        i * (360 / industries[activeIndustry].features.length) -
                        90;
                      const radian = angle * (Math.PI / 180);
                      const radius = 120;
                      const x = radius * Math.cos(radian);
                      const y = radius * Math.sin(radian);

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.2, type: "spring" }}
                          className="absolute w-24 h-24 flex items-center justify-center"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <div className="bg-white shadow-2xl p-3 rounded-lg border border-[#3d5afe]/30 text-xs text-center backdrop-blur-sm">
                            {feature}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* **Implementation Timeline – Enhanced Vertical Stepper** */}
      <section className="py-10 px-6 sm:px-12 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#0a0a12] to-transparent opacity-10"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00bcd4] font-semibold tracking-widest text-sm">
              OUR METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#3d5afe]">Phased</span> Implementation
            </h2>
            <p className="text-[#000] max-w-2xl mx-auto">
              Minimizing disruption while maximizing value delivery
            </p>
          </motion.div>

          <div className="relative">
            {/* Animated vertical line */}
            <div className="hidden lg:block absolute left-1/2 h-[85%] top-[7.5%] w-1 bg-gradient-to-b from-[#3d5afe] via-[#00bcd4] to-[#3d5afe]">
              <motion.div
                className="h-full w-full bg-gradient-to-b from-[#3d5afe] to-[#00bcd4] origin-top"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>

            {/* Steps */}
            <div className="grid lg:grid-cols-2 gap-y-16">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative ${
                    index % 2 === 0
                      ? "lg:pr-24 lg:text-right"
                      : "lg:pl-24 lg:text-left"
                  }`}
                >
                  <div
                    className={`absolute top-0 ${
                      index % 2 === 0 ? "lg:right-0" : "lg:left-0"
                    } w-8 h-8 ${
                      step.color
                    } rounded-full flex items-center justify-center text-white z-10 transform ${
                      index % 2 === 0 ? "translate-x-4" : "-translate-x-4"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white shadow-2xl p-8 rounded-xl border border-[#3d5afe]/10 hover:border-[#00bcd4]/50 transition-all duration-300 group cursor-pointer"
                  >
                    <div
                      className={`text-sm font-mono mb-2 ${
                        step.color === "bg-[#3d5afe]"
                          ? "text-[#3d5afe]"
                          : "text-[#00bcd4]"
                      }`}
                    >
                      {step.phase} • {step.duration}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <ul className="space-y-2">
                      {step.activities.map((activity, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start text-[#000]"
                          initial={{
                            opacity: 0,
                            x: index % 2 === 0 ? 10 : -10,
                          }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 + index * 0.1 }}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                              step.color === "bg-[#3d5afe]"
                                ? "bg-[#3d5afe]"
                                : "bg-[#00bcd4]"
                            }`}
                          ></div>
                          <span>{activity}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3d5afe]/5 to-[#00bcd4]/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500"></div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* **Stats Section - New Addition** */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00bcd4] font-semibold tracking-widest text-sm">
              PROVEN RESULTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#3d5afe]">Transformative</span> Impact
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "47%", label: "Faster Decision Making" },
              { value: "32%", label: "Reduced Operational Costs" },
              { value: "28%", label: "Increased Productivity" },
              { value: "63%", label: "Improved Data Accuracy" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 bg-white shadow-2xl rounded-xl border border-[#3d5afe]/10 hover:border-[#00bcd4]/50 transition-all duration-300"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-[#3d5afe] to-[#00bcd4] text-transparent bg-clip-text mb-4">
                  {stat.value}
                </div>
                <div className="text-[#000]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Final CTA – Enhanced with Particles** */}
      <section className="py-10 px-6 sm:px-12 bg-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-[#3d5afe] opacity-10 blur-[100px]"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-[#00bcd4] opacity-10 blur-[100px]"></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#00bcd4] opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3d5afe] to-[#00bcd4]">
              Digital Transformation
            </span>
            ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#000] mb-8 max-w-2xl mx-auto"
          >
            Let's build an intelligent ERP system that becomes your competitive
            advantage.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-flex items-center bg-gradient-to-r from-[#3d5afe] to-[#00bcd4] text-white font-semibold py-4 px-12 rounded-lg hover:shadow-[0_0_30px_-5px_rgba(61,90,254,0.5)] transition-all duration-300"
              >
                Start Your ERP Journey
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/pricing"
                className="inline-flex items-center border-2 border-[#3d5afe] text-[#3d5afe] hover:bg-[#3d5afe]/10 font-semibold py-4 px-12 rounded-lg transition-colors duration-300"
              >
                View Pricing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceERP;
