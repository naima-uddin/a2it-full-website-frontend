"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiCreditCard,
  FiSmartphone,
  FiShield,
  FiTrendingUp,
  FiPieChart,
  FiTarget,
  FiLayers,
  FiBarChart2,
  FiCheckCircle,
  FiCpu,
  FiServer,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const EcommerceDevelopment = () => {
  return (
    <div className="bg-white text-black overflow-hidden">
      {/* **Hero Section – eCommerce Visual** */}
      <section className="relative flex flex-col lg:flex-row items-center overflow-hidden py-24">
        {/* Abstract background with shopping elements */}
        <div className="absolute inset-0 bg-[url('/assets/eCommerce/4.jpg')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#07070c] via-transparent to-[#0f0f1b]"></div>

        {/* Animated shopping cart icons */}
        <div className="absolute bottom-0 left-0 right-0 mb-5">
          <div className="flex justify-center flex-wrap gap-4 sm:gap-8">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
                className="text-[#00f0ff] text-2xl"
              >
                <FiShoppingCart />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-[#0066ff] text-[#fff] font-medium mb-6 rounded-full text-sm sm:text-base">
              ECOMMERCE SOLUTIONS
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                High-Converting
              </span>{" "}
              Online Stores
            </h1>
            <p className="text-lg sm:text-xl text-white max-w-2xl mb-12">
              Strategic eCommerce development focused on user experience,
              conversion optimization, and revenue growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-colors duration-300"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-auto relative mt-12 lg:mt-0"
          >
            {/* eCommerce dashboard visualization */}
            <div className="relative bg-white p-6 rounded-xl border border-[#00f0ff]/30 overflow-hidden">
              <div className="absolute inset-0 opacity-20"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
                  <div className="text-lg font-bold">Sales Dashboard</div>
                  <div className="text-sm text-[#00f0ff]">Live Preview</div>
                </div>

                {/* Sales chart */}
                <div className="h-24 sm:h-28 bg-white shadow-2xl rounded-lg p-3 sm:p-4 mb-6">
                  <div className="flex items-end h-full gap-1 sm:gap-2">
                    {[30, 45, 60, 75, 65, 80, 90].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-[#0066ff] to-[#00f0ff] rounded-t"
                      />
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#0066ff]/10 rounded-lg border border-[#0066ff]/20 flex flex-col items-start">
                    <FiTrendingUp className="text-[#00f0ff] text-xl mb-1" />
                    <div className="text-sm">Conversion Rate</div>
                    <div className="font-bold text-[#00f0ff]">+32%</div>
                  </div>
                  <div className="p-3 bg-[#00f0ff]/10 rounded-lg border border-[#00f0ff]/20 flex flex-col items-start">
                    <FiShoppingCart className="text-[#00f0ff] text-xl mb-1" />
                    <div className="text-sm">Avg. Order Value</div>
                    <div className="font-bold text-[#00f0ff]">$147.50</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* **Problem Statement Section** */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              THE CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-2">
              Is Your Online Store{" "}
              <span className="text-[#0066ff]">Falling Short</span>?
            </h2>
            <p className="text-black max-w-3xl mx-auto">
              Many online businesses approach eCommerce development
              reactively—adding features one at a time without a cohesive plan.
              This scattershot method often results in a site that looks
              functional but fails to perform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white p-8 rounded-xl border border-[#0066ff]/20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-90">
                  <Image
                    src="/assets/eCommerce/3.avif"
                    alt="Problem pattern"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 text-[#00f0ff]">
                    Common Issues
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Disjointed user experience",
                      "Low conversion rates",
                      "Poor mobile performance",
                      "Inconsistent branding",
                      "Security vulnerabilities",
                      "Slow page load times",
                    ].map((issue, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-6 h-6 bg-[#0066ff]/80 rounded-full flex items-center justify-center text-[#00f0ff] mr-3 mt-1">
                          <FiServer className="text-xs" />
                        </div>
                        <span className="text-white">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center relative"
            >
              <div className="">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#0066ff] to-[#00f0ff] rounded-full mb-6">
                  <FiTarget className="text-4xl text-[#0a0a12]" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
                <p className="text-black">
                  A2IT creates intuitive, conversion-focused platforms that
                  align with your brand identity and business goals. We deliver
                  custom-built solutions that encourage seamless, secure, and
                  satisfying shopping experiences.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* **Approach Section** */}
      <section className="py-10 px-6 sm:px-12 bg-white">
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
              What Sets Our{" "}
              <span className="text-[#0066ff]">Approach Apart</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Strategic Roadmap",
                icon: <FiTrendingUp className="text-3xl" />,
                desc: "Co-created strategy centered around your objectives and growth milestones",
                color: "from-[#00f0ff] to-[#0066ff]",
              },
              {
                title: "Design That Converts",
                icon: <FiLayers className="text-3xl" />,
                desc: "Emotionally resonant product pages and user journeys that compel action",
                color: "from-[#0066ff] to-[#00f0ff]",
              },
              {
                title: "Secure Payments",
                icon: <FiCreditCard className="text-3xl" />,
                desc: "Smooth, reliable checkout experiences across local and global gateways",
                color: "from-[#00f0ff] to-[#0066ff]",
              },
              {
                title: "Mobile-First",
                icon: <FiSmartphone className="text-3xl" />,
                desc: "Speed-optimized, touch-friendly layouts across all devices",
                color: "from-[#0066ff] to-[#00f0ff]",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-2xl rounded-xl overflow-hidden border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-all duration-300 group"
              >
                <div className="relative h-16 overflow-hidden"></div>
                <div className="p-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-[#0a0a12] mb-6 -mt-12 relative z-10`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-black">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Services Section** */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              OUR SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              eCommerce{" "}
              <span className="text-[#0066ff]">Development Services</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Discovery & Strategy",
                icon: <FiTarget />,
                features: [
                  "Audience definition",
                  "Goal setting",
                  "KPI establishment",
                  "Digital brand fit",
                ],
                image: "/assets/eCommerce/5.avif",
              },
              {
                title: "UX/UI & Design",
                icon: <FiLayers />,
                features: [
                  "Product page design",
                  "Category layouts",
                  "Visual content",
                  "Conversion messaging",
                ],
                image: "/assets/eCommerce/6.jpg",
              },
              {
                title: "Analytics & Tracking",
                icon: <FiPieChart />,
                features: [
                  "Full implementation",
                  "User behavior analysis",
                  "Conversion tracking",
                  "Bottleneck identification",
                ],
                image: "/assets/eCommerce/7.avif",
              },
              {
                title: "CRO",
                icon: <FiTrendingUp />,
                features: [
                  "Checkout optimization",
                  "Navigation refinement",
                  "Product showcasing",
                  "User flow enhancement",
                ],
                image: "/assets/eCommerce/2.avif",
              },
              {
                title: "A/B Testing",
                icon: <FiBarChart2 />,
                features: [
                  "Page variations",
                  "Layout testing",
                  "Copy optimization",
                  "Data-driven decisions",
                ],
                image: "/assets/eCommerce/1.jpeg",
              },
              {
                title: "Maintenance & Support",
                icon: <FiShield />,
                features: [
                  "Regular updates",
                  "Security monitoring",
                  "Performance enhancements",
                  "Scalability improvements",
                ],
                image: "/assets/eCommerce/8.avif",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-2xl rounded-xl overflow-hidden border border-[#00f0ff]/10 group hover:border-[#0066ff]/50 transition-colors"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover opacity-100 group-hover:scale-105 transition-transform duration-500"
                  /> 
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-[#0066ff] rounded-full flex items-center justify-center text-[#00f0ff] mb-4 -mt-12 relative z-10">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <FiCheckCircle className="text-[#00f0ff] mr-2" />
                        <span className="text-black">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Benefits Section** */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              WHY IT MATTERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Why a Strategic{" "}
              <span className="text-[#0066ff]">eCommerce Site Matters</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Stronger Sales",
                desc: "Intuitive, fast, and secure experiences lead to more completed purchases and customer retention.",
                icon: <FiTrendingUp className="text-4xl" />,
                color: "from-[#00f0ff] to-[#0066ff]",
                image: "/assets/eCommerce/7.avif",
              },
              {
                title: "Trust Through Consistency",
                desc: "Every visual detail supports your brand identity, building trust that drives sales.",
                icon: <FiShield className="text-4xl" />,
                color: "from-[#0066ff] to-[#00f0ff]",
                image: "/assets/eCommerce/9.avif",
              },
              {
                title: "Your Digital Hub",
                desc: "A well-built store amplifies the efficacy of marketing, social media, and email campaigns.",
                icon: <FiCpu className="text-4xl" />,
                color: "from-[#00f0ff] to-[#0066ff]",
                image: "/assets/eCommerce/10.avif",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-2xl rounded-xl overflow-hidden border border-[#00f0ff]/10 group hover:border-[#0066ff]/50 transition-colors"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    fill
                    unoptimized
                    className="object-cover  group-hover:scale-105 transition-transform duration-500"
                  /> 
                </div>
                <div className="p-8 text-center">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center text-[#0a0a12] mx-auto mb-6 -mt-12 relative z-10`}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-black">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Side by Side */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              KEY FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Powerful eCommerce{" "}
              <span className="text-[#0066ff]">Capabilities</span>
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Everything you need for a successful online store
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                {
                  icon: <FiShoppingCart className="text-3xl" />,
                  title: "Product Management",
                  description:
                    "Easy-to-use inventory and catalog systems with variants, categories, and filters",
                  image: "/assets/eCommerce/12.jpg",
                },
                {
                  icon: <FiCreditCard className="text-3xl" />,
                  title: "Payment Gateways",
                  description:
                    "Secure integration with Stripe, PayPal, and local payment methods",
                  image: "/assets/eCommerce/1.jpeg",
                },
                {
                  icon: <FiTruck className="text-3xl" />,
                  title: "Shipping Integration",
                  description:
                    "Real-time shipping rates, tracking, and label printing",
                  image: "/assets/eCommerce/4.jpg",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start bg-gradient-to-r from-[#00f0ff] to-[#0066ff] p-6 rounded-xl border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-colors group overflow-hidden"
                >
                  <div className="relative w-20 h-20 mr-6 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover rounded-lg   group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-black">{item.title}</h3>
                    <p className="text-white">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-8">
              {[
                {
                  icon: <FiUsers className="text-3xl" />,
                  title: "Best Electric Bike",
                  description:
                    "Personalized shopping experiences with order history and wishlists",
                  image: "/assets/eCommerce/3.avif",
                },
                {
                  icon: <FiBarChart2 className="text-3xl" />,
                  title: "Analytics Dashboard",
                  description:
                    "Track sales, visitors, conversions, and customer behavior",
                  image: "/assets/eCommerce/7.avif",
                },
                {
                  icon: <FiShield className="text-3xl" />,
                  title: "Security & Compliance",
                  description:
                    "PCI-DSS compliant, GDPR ready, and SSL encryption",
                  image: "/assets/eCommerce/6.jpg",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start bg-gradient-to-r from-[#00f0ff] to-[#0066ff] p-6 rounded-xl border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-colors group overflow-hidden"
                >
                  <div className="relative w-20 h-20 mr-6 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover rounded-lg  group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0066ff] to-[#00f0ff] opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-black">{item.title}</h3>
                    <p className="  text-white">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* **Portfolio Showcase Section** */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              OUR WORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Successful{" "}
              <span className="text-[#0066ff]">eCommerce Projects</span>
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              See how we've helped businesses transform their online presence
              and drive growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Best Electric Bike",
                description:
                  "Discover the best electric bikes in one place – compare top models, features, and prices to find the perfect ride for your lifestyle",
                image: "/assets/design_development/e-bike.png",
                metrics: "+217% Revenue Growth",
              },
              {
                title: "Best Home Gym Equipment",
                description:
                  "Find the best home gym equipment to build strength, stay fit, and achieve your fitness goals—all from the comfort of your home",
                image: "/assets/design_development/trademil.png",
                metrics: "+158% Conversion Rate",
              },
              {
                title: "Commercial Tyre",
                description:
                  "Reliable commercial tyres designed for performance, durability, and safety to keep your business moving",
                image: "/assets/design_development/c-tire.png",
                metrics: "+189% Average Order Value",
              },
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-2xl rounded-xl overflow-hidden border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-colors group"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  /> 
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">
                      {project.title}
                    </h3>
                    <div className="text-[#00f0ff] font-semibold">
                      {project.metrics}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-black mb-4">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center border-2 border-[#00f0ff] text-[#0066ff] hover:bg-[#00f0ff]/10 font-semibold py-4 px-8 rounded-lg transition-colors duration-300"
            >
              View All Projects
            </Link>
          </motion.div>
        </div>
      </section>

      {/* **Final CTA Section** */}
      <section className="py-16 px-6 sm:px-12 bg-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                repeatType: "reverse",
              }}
              className="absolute w-2 h-2 rounded-full bg-[#00f0ff]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
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
            Ready to Transform Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              eCommerce Presence
            </span>
            ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-black mb-6 max-w-2xl mx-auto"
          >
            Let's build a trusted, high-converting sales engine that scales with
            your business.
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
              className="inline-flex items-center bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-4 px-12 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300 transform hover:scale-105"
            >
              Start Your Project
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center border-2 border-[#00f0ff] text-[#0066ff] hover:bg-[#00f0ff]/10 font-semibold py-4 px-12 rounded-lg transition-colors duration-300"
            >
              View Case Studies
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceDevelopment;
