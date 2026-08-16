"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiPackage,
  FiTruck,
  FiHeadphones,
  FiGlobe,
  FiBarChart2,
  FiSettings,
  FiUserCheck,
  FiStar,
  FiPlay,
  FiPause,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";

const ServiceFBA = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef(null);
  const featuresRef = useRef(null);

  // scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });

  // Auto-rotate features
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Pre-generate particle positions ONCE to avoid hydration error
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Run ONLY on client after hydration
    const generated = Array.from({ length: 15 }).map(() => ({
      x: `${Math.random() * 100}vw`,
      y: `${Math.random() * 100}vh`,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  const features = [
    {
      icon: <FiPackage className="text-4xl" />,
      title: "Storage & Inventory Management",
      description:
        "Amazon stores your products and manages inventory until sold",
      stats: "99.9% inventory accuracy",
    },
    {
      icon: <FiTruck className="text-4xl" />,
      title: "Order Fulfillment",
      description:
        "Amazon picks, packs, and ships products directly to customers",
      stats: "24-48h delivery guarantee",
    },
    {
      icon: <FiHeadphones className="text-4xl" />,
      title: "Customer Service & Returns",
      description:
        "Amazon handles inquiries, returns, and refunds professionally",
      stats: "98% customer satisfaction",
    },
    {
      icon: <FiStar className="text-4xl" />,
      title: "Prime Eligibility",
      description: "FBA products get Prime badge with free two-day shipping",
      stats: "35% higher conversion",
    },
    {
      icon: <FiGlobe className="text-4xl" />,
      title: "Multi-Channel Fulfillment",
      description: "Fulfill orders from your website and other marketplaces",
      stats: "Expand to 10+ channels",
    },
  ];

  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[70vh] lg:h-[75vh] xl:[80vh] flex items-center justify-center overflow-hidden ">
        <div
          className="absolute inset-0 bg-[url('/assets/eCommerce/5.avif')] bg-cover bg-center opacity-50"
          style={{ backgroundPosition: "center 30%", transform: "scale(1.1)" }}
        ></div> 

        {/* Particle animation */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#00f0ff] rounded-full"
              initial={{ x: p.x, y: p.y, scale: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 border border-[#00f0ff]/30 mb-8">
              <FiPackage className="text-[#0066ff] mr-2" />
              <span className="text-sm text-black ">
                Amazon FBA Services
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                Streamline Your
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                E-Commerce Success
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl text-black max-w-3xl mx-auto mb-12"
            >
              Let Amazon handle fulfillment while you focus on growing your
              business with A2IT's expert FBA management
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#fff] font-semibold py-5 px-10 rounded-full shadow-xl hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Optimize Your FBA
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center text-black hover:text-[#0066ff] transition-colors duration-300"
              >
                <span>Explore Features</span>
                <FiChevronRight className="ml-2 animate-bounce" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#00f0ff] rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-[#00f0ff] rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Animated Stats Section */}
      <motion.section
        style={{ opacity, scale }}
        ref={sectionRef}
        className="py-20 px-6 sm:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: "30%",
                label: "Average Sales Increase",
                icon: <FiBarChart2 />,
              },
              {
                value: "99.9%",
                label: "Inventory Accuracy",
                icon: <FiCheck />,
              },
              {
                value: "98%",
                label: "Customer Satisfaction",
                icon: <FiUserCheck />,
              },
              { value: "50+", label: "Countries Reached", icon: <FiGlobe /> },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-colors duration-300 group shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl text-[#0a0a12] group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <motion.div
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="text-3xl md:text-4xl font-bold text-[#0066ff] mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-black text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Interactive Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="py-10 px-6 sm:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              AMAZON FBA FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Powerful Fulfillment Solutions
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Leverage Amazon's vast logistics network to grow your business
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            {/* Feature Selector */}
            <div className="lg:w-2/5">
              <div className="sticky top-24 space-y-4">
                {features.map((feature, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setActiveFeature(index);
                      setIsPlaying(false);
                    }}
                    whileHover={{ x: 10 }}
                    className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#ffff] shadow-xl"
                        : "bg-white text-black hover:bg-[#0066ff] shadow-2xl hover:text-white"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`mr-4 ${
                          activeFeature === index
                            ? "text-[#0a0a12]"
                            : "text-[#00f0ff]"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        <p className="text-sm mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white rounded-full hover:bg-[#1a1a2e] transition-colors duration-300"
                    aria-label={
                      isPlaying ? "Pause animation" : "Play animation"
                    }
                  >
                    {isPlaying ? <FiPause /> : <FiPlay />}
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Visualizer */}
            <div className="lg:w-3/5">
              <div className="relative h-96 lg:h-[500px] bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#00f0ff]/20">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{
                      opacity: activeFeature === index ? 1 : 0,
                      scale: activeFeature === index ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8"
                  >
                    <div
                      className="w-full h-48 bg-cover bg-center rounded-xl mb-6 opacity-80"
                      style={{
                        backgroundImage: `url('/assets/amazon/5.avif')`,
                      }}
                    ></div>

                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#0066ff] mb-2">
                        {feature.stats}
                      </div>
                      <p className="text-black">{feature.description}</p>
                    </div>

                    {/* Animated elements */}
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: { duration: 2, repeat: Infinity },
                      }}
                      className="absolute top-4 right-4 w-8 h-8 bg-[#00f0ff] rounded-full opacity-20"
                    ></motion.div>

                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute bottom-4 left-4 w-6 h-6 bg-[#0066ff] rounded-full opacity-30"
                    ></motion.div>
                  </motion.div>
                ))}

                {/* Connection lines animation */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                >
                  <motion.line
                    x1="20"
                    y1="20"
                    x2="80"
                    y2="80"
                    stroke="#00f0ff"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.line
                    x1="80"
                    y1="20"
                    x2="20"
                    y2="80"
                    stroke="#00f0ff"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with 3D Effect */}
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
              WHY CHOOSE A2IT
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Benefits of Our FBA Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Scalability",
                description:
                  "Grow your business without infrastructure investments",
                icon: <FiBarChart2 />,
              },
              {
                title: "Global Reach",
                description:
                  "Access customers worldwide through Amazon's network",
                icon: <FiGlobe />,
              },
              {
                title: "Focus on Core Business",
                description:
                  "Outsource logistics to concentrate on product development",
                icon: <FiSettings />,
              },
              {
                title: "Enhanced Customer Experience",
                description:
                  "Provide fast, reliable shipping with Amazon's trusted service",
                icon: <FiUserCheck />,
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 bg-white shadow-2xl rounded-2xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-all duration-300 overflow-hidden"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-[#0066ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-2xl flex items-center justify-center text-2xl text-[#0a0a12] mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-black">{benefit.description}</p>
                </div>

                {/* Hover effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-md"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
                SUCCESS STORY
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
                Consumer Electronics Brand Scaling
              </h2>

              <div className="space-y-6">
                {[
                  { value: "30%", label: "Increase in Sales" },
                  { value: "98%", label: "Customer Satisfaction" },
                  { value: "50%", label: "Operational Efficiency" },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-2xl flex items-center justify-center text-2xl font-bold text-[#0a0a12] mr-6">
                      {stat.value}
                    </div>
                    <div className="text-black">{stat.label}</div>
                  </div>
                ))}
              </div>

              <p className="text-black mt-6">
                Optimized product listings and efficient inventory management
                led to higher sales and improved customer experiences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div
                className="h-80 bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url('/assets/amazon/6.avif')` }}
              ></div>

              {/* Animated graph overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] p-6 rounded-2xl border border-[#00f0ff]/20 shadow-xl"
              >
                <div className="flex items-end space-x-2">
                  {[30, 60, 45, 80, 65, 90].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                      className="w-4 bg-gradient-to-t from-[#00f0ff] to-[#0066ff] rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="text-center mt-4 text-sm text-white">
                  Sales Growth
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated CTA Section */}
      <section className="py-32 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/eCommerce/5.avif')] bg-cover bg-center opacity-10"></div>

        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#00f0ff] rounded-full blur-6xl"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#0066ff] rounded-full blur-6xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to <span className="text-[#0066ff]">Streamline</span> Your FBA
            Operations?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-black mb-8 max-w-2xl mx-auto"
          >
            Let our experts handle Amazon FBA while you focus on growing your
            business
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
              Start With FBA
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/case-studies"
              className="border-2 border-[#00f0ff] text-black hover:bg-[#0066ff] hover:text-[#fff] font-semibold py-5 px-10 rounded-full transition-colors duration-300"
            >
              View Case Studies
            </Link>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-8 h-8 bg-[#00f0ff] rounded-lg opacity-20"
        ></motion.div>

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-[#0066ff] rounded-lg opacity-30"
        ></motion.div>
      </section>
    </div>
  );
};

export default ServiceFBA;
