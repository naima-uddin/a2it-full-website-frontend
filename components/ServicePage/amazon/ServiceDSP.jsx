"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FiArrowRight,
  FiTarget,
  FiBarChart2,
  FiTrendingUp,
  FiLayers,
  FiEye,
  FiDollarSign,
  FiUsers,
  FiGlobe,
  FiPlay,
  FiPause,
  FiChevronRight,
  FiCpu,
  FiPieChart,
  FiCheck,
} from "react-icons/fi";
import Link from "next/link";

// Predefined positions for nodes to avoid random values
const NODE_POSITIONS = [
  { x: "75.91vw", y: "20.83vh" },
  { x: "55.19vw", y: "13.74vh" },
  { x: "83.16vw", y: "45.30vh" },
  { x: "13.90vw", y: "49.05vh" },
  { x: "29.97vw", y: "47.13vh" },
  { x: "24.69vw", y: "52.08vh" },
  { x: "18.85vw", y: "46.45vh" },
  { x: "66.94vw", y: "21.66vh" },
  { x: "31.90vw", y: "73.12vh" },
  { x: "95.66vw", y: "78.31vh" },
  { x: "12.73vw", y: "99.24vh" },
  { x: "10.31vw", y: "22.84vh" },
];

// Fixed campaign data to avoid random values
const FIXED_CAMPAIGN_DATA = {
  impressions: 951234,
  clicks: 42367,
  conversions: 3124,
  ctr: "4.25",
  roas: "7.82",
};

// Predefined animation values for cyber nodes
const CYBER_NODE_ANIMATIONS = [
  { x: [0, 20, -10, 0], y: [0, -30, 15, 0] },
  { x: [0, -25, 15, 0], y: [0, 20, -10, 0] },
  { x: [0, 15, -20, 0], y: [0, -15, 25, 0] },
  { x: [0, -30, 10, 0], y: [0, 10, -20, 0] },
  { x: [0, 25, -15, 0], y: [0, -25, 15, 0] },
  { x: [0, -15, 30, 0], y: [0, 15, -25, 0] },
  { x: [0, 10, -25, 0], y: [0, -20, 10, 0] },
  { x: [0, -20, 15, 0], y: [0, 25, -15, 0] },
];

const ServiceDSP = () => {
  const [activeAudience, setActiveAudience] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [campaignData, setCampaignData] = useState(FIXED_CAMPAIGN_DATA);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef(null);
  const visualizationRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Remove the random data generation and use fixed data instead
  useEffect(() => {
    if (isPlaying && isMounted) {
      const interval = setInterval(() => {
        setCampaignData((prev) => ({
          ...prev,
          // Small predictable changes instead of random ones
          impressions: prev.impressions + 1000,
          clicks: prev.clicks + 50,
          conversions: prev.conversions + 3,
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isMounted]);

  // Audience targeting data
  const audienceTargeting = [
    {
      icon: <FiUsers className="text-3xl" />,
      title: "Demographics",
      description: "Age, gender, income, and more",
      metrics: "15+ demographic segments",
    },
    {
      icon: <FiTrendingUp className="text-3xl" />,
      title: "Shopping Behavior",
      description: "Past purchases and browsing history",
      metrics: "Real-time behavioral data",
    },
    {
      icon: <FiTarget className="text-3xl" />,
      title: "Interest Targeting",
      description: "Product categories and interests",
      metrics: "1000+ interest categories",
    },
    {
      icon: <FiGlobe className="text-3xl" />,
      title: "Life Events",
      description: "Major milestones and life changes",
      metrics: "20+ life event triggers",
    },
  ];

  // Advertising channels
  const advertisingChannels = [
    { name: "Amazon.com", value: 45, color: "#00f0ff" },
    { name: "IMDb", value: 20, color: "#0066ff" },
    { name: "Twitch", value: 15, color: "#00a6ff" },
    { name: "Fire TV", value: 10, color: "#0080ff" },
    { name: "3rd Party", value: 10, color: "#0044ff" },
  ];

  return (
    <div className="bg-[#0a0a12] text-[#e0e0ff] overflow-hidden">
      {/* Cyber-inspired Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern bg-cover"></div>
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-[#0066ff]/10"
          ></motion.div>
        </div>

        {/* Fixed node animation with predefined positions */}
        <div className="absolute inset-0">
          {NODE_POSITIONS.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-[#00f0ff] rounded-full"
              style={{
                left: position.x,
                top: position.y,
              }}
              initial={{ scale: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center bg-[#12121a] rounded-full px-6 py-3 border border-[#00f0ff]/30 mb-8"
            >
              <FiCpu className="text-[#00f0ff] mr-2" />
              <span className="text-sm text-black">Amazon DSP Services</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                Precision Advertising
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                At Scale
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl text-black max-w-3xl mx-auto mb-12"
            >
              Leverage Amazon's powerful Demand Side Platform to reach your
              ideal audience with data-driven precision
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-5 px-10 rounded-full shadow-xl hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Launch Your Campaign
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() =>
                  document
                    .getElementById("audience")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center text-black hover:text-[#0066ff] transition-colors duration-300"
              >
                <span>Targeting Options</span>
                <FiChevronRight className="ml-2 animate-bounce" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Real-time Campaign Dashboard with fixed data */}
      <section className="py-20 px-6 sm:px-12 bg-[#12121a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
              LIVE CAMPAIGN DATA
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Real-Time Performance Metrics
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Monitor your advertising performance with our advanced dashboard
            </p>
          </motion.div>

          <div className="bg-[#0a0a12] rounded-2xl border border-[#00f0ff]/20 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Campaign Performance</h3>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center text-[#00f0ff]"
              >
                {isPlaying ? (
                  <FiPause className="mr-2" />
                ) : (
                  <FiPlay className="mr-2" />
                )}
                {isPlaying ? "Pause" : "Live"} Data
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
              {[
                {
                  label: "Impressions",
                  value: campaignData.impressions.toLocaleString(),
                  icon: <FiEye />,
                },
                {
                  label: "Clicks",
                  value: campaignData.clicks.toLocaleString(),
                  icon: <FiTrendingUp />,
                },
                {
                  label: "Conversions",
                  value: campaignData.conversions.toLocaleString(),
                  icon: <FiTarget />,
                },
                {
                  label: "CTR",
                  value: `${campaignData.ctr}%`,
                  icon: <FiBarChart2 />,
                },
                {
                  label: "ROAS",
                  value: `${campaignData.roas}x`,
                  icon: <FiDollarSign />,
                },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 bg-[#12121a] rounded-xl border border-[#00f0ff]/20"
                >
                  <div className="text-3xl font-bold text-[#00f0ff] mb-2 flex items-center justify-center">
                    {metric.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-black text-sm">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Channel distribution chart */}
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-4">Channel Distribution</h4>
              <div className="flex items-center h-8 bg-[#12121a] rounded-full overflow-hidden">
                {advertisingChannels.map((channel, index) => (
                  <motion.div
                    key={index}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${channel.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full flex items-center justify-center text-xs font-medium text-[#0a0a12]"
                    style={{ backgroundColor: channel.color }}
                  >
                    {channel.value}%
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-black mt-2">
                {advertisingChannels.map((channel, index) => (
                  <span key={index}>{channel.name}</span>
                ))}
              </div>
            </div>

            {/* Performance graph */}
            <div className="bg-[#12121a] rounded-xl p-4">
              <h4 className="text-lg font-bold mb-4">Performance Trend</h4>
              <div className="h-40 relative">
                <svg viewBox="0 0 100 40" className="w-full h-full">
                  <motion.path
                    d="M 0,35 C 10,30 20,15 30,20 40,25 50,10 60,15 70,20 80,5 90,10 100,15"
                    stroke="#00f0ff"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                  />
                  <motion.path
                    d="M 0,25 C 10,20 20,5 30,10 40,15 50,0 60,5 70,10 80,0 90,5 100,10"
                    stroke="#0066ff"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute bottom-0 left-0 text-xs text-black">
                  Impressions
                </div>
                <div className="absolute top-0 right-0 text-xs text-black">
                  Conversions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Targeting Visualization */}
      <section id="audience" className="py-20 px-6 sm:px-12 bg-[#0a0a12]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
              ADVANCED TARGETING
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Precision Audience Segmentation
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Leverage Amazon's rich first-party data to reach your ideal
              customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Targeting visualization */}
            <div className="relative h-96">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-[#12121a] rounded-full border border-[#00f0ff]/20 flex items-center justify-center">
                  <div className="w-48 h-48 bg-[#0a0a12] rounded-full border border-[#00f0ff]/20 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-full flex items-center justify-center text-2xl font-bold text-[#0a0a12]">
                      Target
                    </div>
                  </div>
                </div>
              </div>

              {/* Audience segments orbiting around center */}
              {audienceTargeting.map((audience, index) => (
                <motion.div
                  key={index}
                  className="absolute w-20 h-20 bg-[#12121a] rounded-xl border border-[#00f0ff]/20 flex items-center justify-center cursor-pointer"
                  animate={{
                    x:
                      Math.cos(
                        (index / audienceTargeting.length) * Math.PI * 2,
                      ) * 140,
                    y:
                      Math.sin(
                        (index / audienceTargeting.length) * Math.PI * 2,
                      ) * 140,
                    scale: activeAudience === index ? 1.1 : 1,
                    borderColor:
                      activeAudience === index ? "#00f0ff" : "#00f0ff/20",
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveAudience(index)}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <div className="text-[#00f0ff]">{audience.icon}</div>
                </motion.div>
              ))}

              {/* Connection lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 200"
              >
                {audienceTargeting.map((_, index) => (
                  <motion.line
                    key={index}
                    x1="100"
                    y1="100"
                    x2={
                      100 +
                      Math.cos(
                        (index / audienceTargeting.length) * Math.PI * 2,
                      ) *
                        140
                    }
                    y2={
                      100 +
                      Math.sin(
                        (index / audienceTargeting.length) * Math.PI * 2,
                      ) *
                        140
                    }
                    stroke="#00f0ff"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                ))}
              </svg>
            </div>

            {/* Audience details */}
            <div>
              <h3 className="text-2xl font-bold text-[#00f0ff] mb-4">
                {audienceTargeting[activeAudience].title}
              </h3>
              <p className="text-black mb-6">
                {audienceTargeting[activeAudience].description}
              </p>
              <div className="text-lg font-bold text-[#00f0ff] mb-6">
                {audienceTargeting[activeAudience].metrics}
              </div>

              <div className="space-y-4">
                {[
                  "Advanced demographic filtering",
                  "Real-time behavioral data integration",
                  "Custom audience segment creation",
                  "Lookalike audience modeling",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-[#00f0ff] rounded-full flex items-center justify-center mr-3 text-[#0a0a12]">
                      <FiCheck className="text-xs" />
                    </div>
                    <span className="text-black">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertising Channels Section */}
      <section className="py-20 px-6 sm:px-12 bg-[#12121a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
              MULTI-CHANNEL REACH
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Cross-Platform Advertising
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Reach your audience across Amazon's ecosystem and beyond
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                platform: "Amazon.com",
                description: "Reach shoppers at the point of purchase",
                reach: "300M+ active customers",
                icon: <FiGlobe />,
              },
              {
                platform: "IMDb",
                description: "Target entertainment enthusiasts",
                reach: "250M+ monthly visitors",
                icon: <FiEye />,
              },
              {
                platform: "Twitch",
                description: "Engage with gaming communities",
                reach: "140M+ monthly users",
                icon: <FiTrendingUp />,
              },
              {
                platform: "Fire TV",
                description: "Connect with streaming audiences",
                reach: "50M+ active users",
                icon: <FiLayers />,
              },
              {
                platform: "Third-Party Sites",
                description: "Extend reach beyond Amazon properties",
                reach: "Thousands of premium sites",
                icon: <FiPieChart />,
              },
              {
                platform: "Mobile Apps",
                description: "Reach users on their mobile devices",
                reach: "Across popular mobile applications",
                icon: <FiTarget />,
              },
            ].map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 bg-[#0a0a12] rounded-2xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-[#0066ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-2xl flex items-center justify-center text-2xl text-[#0a0a12] mb-4 group-hover:scale-110 transition-transform duration-300">
                    {channel.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{channel.platform}</h3>
                  <p className="text-black mb-4">{channel.description}</p>
                  <div className="text-sm text-[#00f0ff] font-medium">
                    {channel.reach}
                  </div>
                </div>

                <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-md"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story with Data Visualization */}
      <section className="py-20 px-6 sm:px-12 bg-[#0a0a12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
                SUCCESS STORY
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
                Electronics Retailer Transformation
              </h2>

              <div className="space-y-6 mb-8">
                {[
                  { value: "30%", label: "Increase in Website Traffic" },
                  { value: "25%", label: "Boost in Sales" },
                  { value: "15%", label: "Improvement in ROI" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-2xl flex items-center justify-center text-xl font-bold text-[#0a0a12] mr-6">
                      {stat.value}
                    </div>
                    <div className="text-black">{stat.label}</div>
                  </div>
                ))}
              </div>

              <p className="text-black">
                Targeted campaigns led to increased product purchases and higher
                engagement through precise audience segmentation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Data visualization */}
              <div className="bg-[#12121a] p-6 rounded-2xl border border-[#00f0ff]/20">
                <h4 className="text-lg font-bold mb-4 text-center">
                  Campaign Performance Lift
                </h4>
                <div className="h-64 relative">
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end h-48">
                    {[30, 45, 60, 75, 90].map((value, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="w-16 bg-gradient-to-t from-[#00f0ff] to-[#0066ff] rounded-t-xl flex items-center justify-center text-[#0a0a12] font-bold"
                      >
                        {value}%
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-sm text-black">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                  <span>Week 5</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section with Cyber Elements */}
      <section className="py-32 px-6 sm:px-12 relative overflow-hidden">
        {/* Animated cyber grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern bg-cover"></div>
        </div>

        {/* Animated nodes with predefined animations */}
        <div className="absolute inset-0">
          {CYBER_NODE_ANIMATIONS.map((animation, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-[#00f0ff] rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + i * 5}%`,
              }}
              animate={animation}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                repeatType: "reverse",
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
            Ready to <span className="text-[#00f0ff]">Transform</span> Your
            Advertising?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-black mb-8 max-w-2xl mx-auto"
          >
            Launch data-driven campaigns that reach your ideal audience with
            precision
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-5 px-10 rounded-full shadow-xl hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Advertising
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/case-studies"
              className="border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#0a0a12] font-semibold py-5 px-10 rounded-full transition-colors duration-300"
            >
              View Success Stories
            </Link>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default ServiceDSP;
