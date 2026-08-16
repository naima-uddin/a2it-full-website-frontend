"use client";

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiDollarSign,
  FiTrendingUp,
  FiSearch,
  FiPieChart,
  FiLink,
  FiBarChart2,
  FiUsers,
  FiBookOpen,
  FiTarget,
  FiChevronDown,
  FiPlay,
} from "react-icons/fi";
import Link from "next/link";

const ServiceAffiliate = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-rotate through steps
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <section className="relative flex flex-col items-center justify-center h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] xl:h-[80vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/assets/amazon/1.avif')] bg-cover bg-center opacity-20"></div>

        {/* Animated floating elements */}
        <div className="absolute top-1/4 left-1/4 w-16 sm:w-20 h-16 sm:h-20 bg-[#00f0ff] rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 sm:w-16 h-12 sm:h-16 bg-[#0066ff] rounded-full blur-2xl opacity-30 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center justify-center bg-white  rounded-full px-4 sm:px-6 py-2 border border-[#00f0ff]/30">
                <FiDollarSign className="text-[#00f0ff] mr-2" />
                <span className="text-xs sm:text-sm text-black">
                  Amazon Affiliate Program
                </span>
              </div>
            </motion.div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                Unlock Revenue Streams
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-black max-w-3xl mx-auto mb-6">
              Transform your digital presence into a profitable Amazon affiliate
              business with A2IT's expert guidance
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-3 sm:py-5 px-6 sm:px-10 rounded-full shadow-xl hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Earning Now
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center text-sm sm:text-base text-black rounded-full p-5 border-2 hover:text-[#0066ff] transition-colors duration-300"
              >
                <span>How It Works</span>
                <FiChevronDown className="ml-2 animate-bounce" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-16 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50%", label: "Average Earnings Increase" },
              { value: "10M+", label: "Products Available" },
              { value: "24-48h", label: "Commission Tracking" },
              { value: "$4.8B", label: "Paid to Affiliates" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-colors duration-300"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-black text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Section */}
      <section id="how-it-works" className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">
              How The Amazon Affiliate Program Works
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              A simple yet powerful process to start earning commissions with
              Amazon
            </p>
          </motion.div>

          <div className="flex flex-col items-center">
            {/* Step Navigation */}
            <div className="flex justify-center mb-6">
              {["Sign Up", "Promote", "Earn"].map((step, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveStep(index);
                    setIsPlaying(false);
                  }}
                  className={`px-6 py-3 mx-2 rounded-full transition-all duration-300 ${
                    activeStep === index
                      ? "bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12]"
                      : "bg-[#0066ff] text-white hover:bg-[#00f0ff] hover:text-black "
                  }`}
                >
                  {step}
                </button>
              ))}

              <button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center bg-[#0a0a12] text-[#00f0ff] rounded-full ml-4 hover:bg-[#12121a] transition-colors duration-300"
                aria-label={isPlaying ? "Pause animation" : "Play animation"}
              >
                {isPlaying ? (
                  <div className="w-5 h-5 flex items-center justify-center bg-[#00f0ff] rounded-sm">
                    <div className="w-1 h-3 bg-[#0a0a12] mx-0.5"></div>
                    <div className="w-1 h-3 bg-[#0a0a12] mx-0.5"></div>
                  </div>
                ) : (
                  <FiPlay className="ml-1" />
                )}
              </button>
            </div>

            {/* Step Content */}
            <div className="relative w-full max-w-4xl h-96">
              {[
                {
                  title: "Sign Up & Get Approved",
                  description:
                    "Create your Amazon Associates account with our guidance and get approved",
                  image: "/assets/amazon/hello.avif",
                  position: "center 20%",
                },
                {
                  title: "Promote Products",
                  description:
                    "Select relevant products and incorporate affiliate links into your content",
                  image: "/assets/eCommerce/1.jpeg",
                  position: "center 40%",
                },
                {
                  title: "Earn Commissions",
                  description:
                    "Get paid for qualifying purchases made through your affiliate links",
                  image: "/assets/eCommerce/7.avif",
                  position: "center 60%",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    opacity: activeStep === index ? 1 : 0,
                    scale: activeStep === index ? 1 : 0.9,
                    zIndex: activeStep === index ? 10 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col md:flex-row items-center justify-between"
                >
                  <div className="md:w-1/2 p-6">
                    <div className="text-4xl font-bold text-[#00f0ff] mb-2">
                      0{index + 1}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-black mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {[
                        "Easy registration process",
                        "Quick approval timeline",
                        "Access to millions of products",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center">
                          <FiCheck className="text-[#00f0ff] mr-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:w-1/2">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative"
                    >
                      <div
                        className="w-84 h-64 mx-auto bg-cover bg-center rounded-2xl shadow-2xl"
                        style={{
                          backgroundImage: `url('${step.image}')`,
                          backgroundPosition: step.position,
                        }}
                      ></div>
                      <div className="absolute -inset-4 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-2xl opacity-20 blur-xl -z-10"></div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Hover Effects */}
      <section className="py-10 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              OUR SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Comprehensive Amazon Affiliate Services
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              End-to-end solutions to maximize your Amazon affiliate earnings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiBookOpen className="text-3xl" />,
                title: "Program Enrollment Assistance",
                description:
                  "Step-by-step guidance to ensure a smooth enrollment process",
                features: [
                  "Account Creation",
                  "Payment Setup",
                  "Terms Understanding",
                ],
                image: "/assets/amazon/2.avif",
              },
              {
                icon: <FiSearch className="text-3xl" />,
                title: "Niche Selection & Research",
                description:
                  "Identify profitable niches and products with high conversion potential",
                features: [
                  "Market Analysis",
                  "Competitor Research",
                  "Product Selection",
                ],
                image: "/assets/amazon/3.avif",
              },
              {
                icon: <FiTrendingUp className="text-3xl" />,
                title: "Content Strategy Development",
                description:
                  "Create compelling content that drives traffic and conversions",
                features: [
                  "SEO Optimization",
                  "Content Planning",
                  "CTA Implementation",
                ],
                image: "/assets/amazon/1.avif",
              },
              {
                icon: <FiLink className="text-3xl" />,
                title: "Affiliate Link Integration",
                description:
                  "Seamlessly incorporate affiliate links for maximum click-through rates",
                features: [
                  "Strategic Placement",
                  "Link Management",
                  "Tracking Setup",
                ],
                image: "/assets/amazon/4.avif",
              },
              {
                icon: <FiBarChart2 className="text-3xl" />,
                title: "Performance Monitoring",
                description:
                  "Data-driven insights to continuously improve your efforts",
                features: [
                  "Analytics Reporting",
                  "A/B Testing",
                  "Strategy Refinement",
                ],
                image: "/assets/eCommerce/7.avif",
              },
              {
                icon: <FiCheck className="text-3xl" />,
                title: "Compliance & Best Practices",
                description:
                  "Ensure adherence to Amazon's guidelines and industry best practices",
                features: [
                  "Policy Compliance",
                  "Disclosure Guidance",
                  "Risk Management",
                ],
                image: "/assets/eCommerce/5.avif",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-xl overflow-hidden border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-all duration-300 shadow-2xl"
              >
                <div
                  className="h-40 bg-cover bg-center  duration-500 "
                  style={{ backgroundImage: `url('${service.image}')` }}
                ></div>

                <div className="relative p-6 -mt-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-lg flex items-center justify-center mb-6 text-[#0a0a12]">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-black mb-5">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <FiCheck className="text-[#00f0ff] mt-1 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated CTA Section */}
      <section className="py-10 px-6 sm:px-12 relative">
        <div className="absolute inset-0 bg-[url('/assets/amazon/1.avif')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-white"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to <span className="text-[#0066ff]">Unlock</span> Your Amazon
            Affiliate Potential?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-black mb-8 max-w-2xl mx-auto"
          >
            Let's discuss how we can help you maximize your affiliate earnings
            with proven strategies.
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
              Start Your Journey
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/portfolio"
              className="border-2 border-[#00f0ff] text-[#0066ff] hover:bg-[#00f0ff] hover:text-[#0a0a12] font-semibold py-5 px-10 rounded-full transition-colors duration-300"
            >
              View Case Studies
            </Link>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-10 w-6 h-6 bg-[#00f0ff] rounded-full opacity-20"
        ></motion.div>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/3 right-20 w-4 h-4 bg-[#0066ff] rounded-full opacity-30"
        ></motion.div>
      </section>
    </div>
  );
};

export default ServiceAffiliate;
