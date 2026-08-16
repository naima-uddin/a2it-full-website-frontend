"use client"
import React from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiSearch,
  FiDollarSign,
  FiBarChart2,
  FiGlobe,
  FiTarget,
  FiLayers,
  FiEye,
  FiAward,
  FiZap,
} from "react-icons/fi";
import Link from "next/link";

const ServiceDigitalMarketing = () => {
  return (
    <div className="bg-[#0a0a12] text-[#e0e0ff] overflow-hidden">
      {/* **Hero Section – Cyber Header** */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]"></div>
        </div>

        {/* Glowing elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#0066ff] opacity-15 blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#00f0ff] opacity-15 blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-medium mb-6 rounded-full">
              DIGITAL GROWTH
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                Dominant Search Presence
              </span>
            </h1>
            <p className="text-xl text-[#b0b0ff] max-w-2xl mb-12">
              Laser-targeted SEO, SEM & PPC campaigns that put your business in
              front of ready-to-buy customers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-4 px-8 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Free Audit
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-semibold py-4 px-8 rounded-lg transition-colors duration-300"
              >
                See Results
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Search results mockup */}
            <div className="relative bg-[#12121a] p-1 rounded-xl border border-[#00f0ff]/30">
              <div className="absolute inset-0 rounded-xl border border-[#0066ff]/20 pointer-events-none"></div>

              {/* Mock search UI */}
              <div className="bg-[#0e0e15] p-6 rounded-lg">
                <div className="mb-6">
                  <div className="flex items-center bg-[#0a0a12] px-4 py-3 rounded-lg border border-[#00f0ff]/20">
                    <FiSearch className="text-[#00f0ff] mr-3" />
                    <div className="font-mono text-[#b0b0ff]">
                      best [your industry] services near me
                    </div>
                  </div>
                </div>

                {/* Search results */}
                <div className="space-y-4">
                  <div className="bg-[#0066ff]/5 p-4 rounded-lg border-l-4 border-[#00f0ff]">
                    <div className="text-[#00f0ff] font-bold mb-1">
                      YourBusiness.com
                    </div>
                    <div className="text-[#b0b0ff] text-sm mb-1">
                      https://yourbusiness.com › services
                    </div>
                    <div className="text-[#e0e0ff] text-sm">
                      Top-rated [industry] services with 24/7 availability. Book
                      your consultation online today with instant confirmation.
                    </div>
                  </div>

                  <div className="bg-[#0a0a12] p-3 rounded-lg border border-[#00f0ff]/10">
                    <div className="text-[#00f0ff] text-xs mb-1">AD</div>
                    <div className="text-[#00f0ff] font-bold mb-1">
                      YourBusiness.com | Official Site
                    </div>
                    <div className="text-[#b0b0ff] text-sm">
                      Get 20% Off First Service - Limited Time Offer - Book
                      Online Now
                    </div>
                  </div>

                  <div className="bg-[#0a0a12] p-3 rounded-lg">
                    <div className="text-[#b0b0ff] text-sm mb-1">
                      https://yourbusiness.com › why-choose-us
                    </div>
                    <div className="text-[#e0e0ff]">
                      Why We're The Top Rated [Industry] Service Provider |
                      5-Star Reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* **Services Matrix – Interactive Grid** */}
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
              OUR SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#0066ff]">Performance-Driven</span>{" "}
              Marketing
            </h2>
            <p className="text-[#b0b0ff] max-w-2xl mx-auto">
              Data-optimized strategies that deliver measurable growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FiSearch className="text-3xl" />,
                title: "SEO Strategy",
                description: "Organic search dominance",
                features: [
                  "Keyword research",
                  "Technical SEO",
                  "Content optimization",
                  "Link building",
                ],
                color: "bg-[#00f0ff]",
                glow: "hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)]",
              },
              {
                icon: <FiDollarSign className="text-3xl" />,
                title: "PPC Management",
                description: "Immediate targeted traffic",
                features: [
                  "Google Ads",
                  "Remarketing",
                  "Conversion tracking",
                  "A/B testing",
                ],
                color: "bg-[#0066ff]",
                glow: "hover:shadow-[0_0_30px_-10px_rgba(0,102,255,0.5)]",
              },
              {
                icon: <FiTarget className="text-3xl" />,
                title: "Social Advertising",
                description: "Precision audience targeting",
                features: [
                  "Facebook/Instagram",
                  "LinkedIn B2B",
                  "Creative strategy",
                  "Lead generation",
                ],
                color: "bg-[#00f0ff]",
                glow: "hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)]",
              },
              {
                icon: <FiTrendingUp className="text-3xl" />,
                title: "Content Marketing",
                description: "Authority & engagement",
                features: [
                  "Blog strategy",
                  "Video content",
                  "Infographics",
                  "E-books",
                ],
                color: "bg-[#0066ff]",
                glow: "hover:shadow-[0_0_30px_-10px_rgba(0,102,255,0.5)]",
              },
              {
                icon: <FiGlobe className="text-3xl" />,
                title: "Local SEO",
                description: "Dominate your community",
                features: [
                  "GBP optimization",
                  "Local citations",
                  "Reviews management",
                  "Map rankings",
                ],
                color: "bg-[#00f0ff]",
                glow: "hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)]",
              },
              {
                icon: <FiBarChart2 className="text-3xl" />,
                title: "Analytics & CRO",
                description: "Maximize every visitor",
                features: [
                  "Data tracking",
                  "Funnel analysis",
                  "Heatmaps",
                  "Testing strategy",
                ],
                color: "bg-[#0066ff]",
                glow: "hover:shadow-[0_0_30px_-10px_rgba(0,102,255,0.5)]",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-[#0e0e15] p-8 rounded-xl border ${
                  service.color === "bg-[#00f0ff]"
                    ? "border-[#00f0ff]/20"
                    : "border-[#0066ff]/20"
                } hover:${
                  service.color === "bg-[#00f0ff]"
                    ? "border-[#00f0ff]/50"
                    : "border-[#0066ff]/50"
                } transition-all duration-300 ${service.glow}`}
              >
                <div
                  className={`w-14 h-14 ${service.color} rounded-lg flex items-center justify-center text-[#0a0a12] mb-6`}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-[#b0b0ff] mb-5">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-[#b0b0ff]">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                          service.color === "bg-[#00f0ff]"
                            ? "bg-[#00f0ff]"
                            : "bg-[#0066ff]"
                        }`}
                      ></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Results Showcase – Animated Stats** */}
      <section className="py-28 px-6 sm:px-12 bg-[#0a0a12]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
              PROVEN RESULTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#0066ff]">Data-Backed</span> Performance
            </h2>
            <p className="text-[#b0b0ff] max-w-2xl mx-auto">
              Real metrics from our client campaigns
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: "387%",
                label: "Avg. Traffic Growth",
                icon: <FiTrendingUp className="text-3xl" />,
                color: "text-[#00f0ff]",
              },
              {
                value: "4.8x",
                label: "ROI Increase",
                icon: <FiDollarSign className="text-3xl" />,
                color: "text-[#0066ff]",
              },
              {
                value: "#1-3",
                label: "Keyword Rankings",
                icon: <FiAward className="text-3xl" />,
                color: "text-[#00f0ff]",
              },
              {
                value: "62%",
                label: "Cost Reduction",
                icon: <FiZap className="text-3xl" />,
                color: "text-[#0066ff]",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center bg-[#12121a] p-8 rounded-xl border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 ${
                    stat.color
                  } rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${
                    stat.color === "text-[#00f0ff]"
                      ? "from-[#00f0ff]/20 to-[#00f0ff]/10"
                      : "from-[#0066ff]/20 to-[#0066ff]/10"
                  } border ${
                    stat.color === "text-[#00f0ff]"
                      ? "border-[#00f0ff]/30"
                      : "border-[#0066ff]/30"
                  }`}
                >
                  {stat.icon}
                </div>
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-[#b0b0ff] uppercase text-sm tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Process – Circular Diagram** */}
      <section className="py-28 px-6 sm:px-12 bg-[#12121a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              OUR APPROACH
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#00f0ff]">360° Digital</span> Strategy
            </h2>
            <p className="text-[#b0b0ff] max-w-2xl mx-auto">
              Continuous optimization cycle for maximum impact
            </p>
          </motion.div>

          <div className="relative h-96 md:h-[500px]">
            {/* Central circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#00f0ff]/10 to-[#0066ff]/10 border-2 border-[#00f0ff]/30 flex items-center justify-center">
              <div className="text-center">
                <FiEye className="text-4xl mx-auto text-[#00f0ff] mb-2" />
                <div className="text-xl font-bold">Data-Driven</div>
              </div>
            </div>

            {/* Orbiting process steps */}
            {[
              {
                step: "1. Research",
                description: "Market & competitor analysis",
                icon: <FiSearch className="text-2xl" />,
                color: "bg-[#00f0ff]",
                angle: 0,
              },
              {
                step: "2. Strategy",
                description: "Custom campaign planning",
                icon: <FiTarget className="text-2xl" />,
                color: "bg-[#0066ff]",
                angle: 60,
              },
              {
                step: "3. Launch",
                description: "Campaign implementation",
                icon: <FiZap className="text-2xl" />,
                color: "bg-[#00f0ff]",
                angle: 120,
              },
              {
                step: "4. Monitor",
                description: "Real-time performance tracking",
                icon: <FiBarChart2 className="text-2xl" />,
                color: "bg-[#0066ff]",
                angle: 180,
              },
              {
                step: "5. Optimize",
                description: "Data-driven refinements",
                icon: <FiTrendingUp className="text-2xl" />,
                color: "bg-[#00f0ff]",
                angle: 240,
              },
              {
                step: "6. Scale",
                description: "Expand winning strategies",
                icon: <FiGlobe className="text-2xl" />,
                color: "bg-[#0066ff]",
                angle: 300,
              },
            ].map((item, index) => {
              const radius = 180;
              const x = Math.cos((item.angle * Math.PI) / 180) * radius;
              const y = Math.sin((item.angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: x * 0.5, y: y * 0.5 }}
                  whileInView={{ opacity: 1, x: x, y: y }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`absolute top-1/2 left-1/2 w-40 h-40 transform -translate-x-1/2 -translate-y-1/2 ${item.color} rounded-lg flex items-center justify-center text-[#0a0a12] z-10 p-6 text-center`}
                  style={{ x, y }}
                >
                  <div>
                    {item.icon}
                    <h3 className="text-sm font-bold mt-2">{item.step}</h3>
                    <p className="text-xs opacity-80 mt-1">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Connecting lines */}
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <path
                d="M50,20 Q65,30 70,50 Q65,70 50,80 Q35,70 30,50 Q35,30 50,20"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* **Final CTA – Glowing Section** */}
      <section className="py-32 px-6 sm:px-12 bg-[#0a0a12] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-[#0066ff] opacity-10 blur-[100px]"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-[#00f0ff] opacity-10 blur-[100px]"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              Dominate Search
            </span>
            ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#b0b0ff] mb-8 max-w-2xl mx-auto"
          >
            Let's create a digital marketing strategy that drives qualified
            traffic and conversions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-4 px-12 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300 transform hover:scale-105"
            >
              Get Your Free Proposal
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDigitalMarketing;
