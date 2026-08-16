"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiCode,
  FiSmartphone,
  FiDatabase,
  FiCloud,
  FiShield,
  FiCpu,
  FiUser,
  FiBarChart2,
  FiServer,
  FiMonitor,
} from "react-icons/fi";
import Link from "next/link";

const ServiceMobileApp = () => {
  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section with Device Mockup */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb')] bg-cover bg-center opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12  relative z-10 grid grid-cols-1   gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="py-24"
          >
            <span className="inline-block px-4 py-2 bg-[#12121a] rounded-full text-[#226166] font-medium ">
              Mobile App Development
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Transform Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5d85bb] to-[#0066ff]">
                Business
              </span>{" "}
              With Powerful Mobile Apps
            </h1>
            <p className="text-xl text-black mb-4 max-w-2xl">
              We craft beautiful, high-performance mobile applications that
              drive engagement, increase revenue, and elevate your brand
              presence on iOS and Android platforms.
            </p>
            <div className="flex flex-wrap gap-4 ">
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#134d52] to-[#0066ff] text-[#0a0a12] font-semibold py-4 px-8 rounded-lg hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Free Consultation
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="border border-[#00f0ff]/20 hover:border-[#134649] text-black bg-white font-semibold py-4 px-8 rounded-lg transition-colors duration-300"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff] rounded-full mix-blend-screen opacity-10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="mockup-phone mx-auto">
                <div className="camera"></div>
                <div className="display">
                  <div className="artboard artboard-demo phone-1 bg-[#0a0a12]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-[#0066ff]/10"></div>
                    <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                      <h3 className="text-xl font-bold mb-2">Your App Here</h3>
                      <p className="text-sm text-black">
                        We'll bring your vision to life
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div> */}
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-20  bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 ">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "100+", label: "Apps Developed" },
              { number: "4.9", label: "Avg. Rating" },
              { number: "10M+", label: "Downloads" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center shadow-lg p-6 rounded-lg"
              >
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#00f0ff] to-[#0066ff] bg-clip-text text-transparent mb-3">
                  {stat.number}
                </div>
                <p className="text-black uppercase text-sm tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase - Horizontal Scroll */}
      <section className="py-20  bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              OUR WORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Featured <span className="text-[#0066ff]">Mobile Apps</span>
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Cutting-edge mobile solutions across various industries
            </p>
          </motion.div>

          <div className="relative">
            <div className="flex overflow-x-auto pb-10 -mx-6 px-6 scrollbar-hide">
              <div className="flex space-x-8">
                {[
                  {
                    id: 1,
                    title: "Fitness Tracker",
                    category: "Health & Wellness",
                    screens: [
                      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5",
                      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
                      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
                    ],
                    description:
                      "AI-powered fitness app with personalized workout plans",
                  },
                  {
                    id: 2,
                    title: "Digital Wallet",
                    category: "FinTech",
                    screens: [
                      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
                      "https://images.unsplash.com/photo-1556742044-3c52d6e88c62",
                      "https://images.unsplash.com/photo-1556742044-3c52d6e88c62",
                    ],
                    description:
                      "Secure mobile payments with biometric authentication",
                  },
                  {
                    id: 3,
                    title: "Food Delivery",
                    category: "On-Demand",
                    screens: [
                      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
                      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
                      "https://images.unsplash.com/photo-1556911220-bff31c812dba",
                    ],
                    description: "Real-time food ordering with live tracking",
                  },
                  {
                    id: 4,
                    title: "Social Network",
                    category: "Community",
                    screens: [
                      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
                      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
                      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
                    ],
                    description:
                      "Niche community platform with rich media sharing",
                  },
                  {
                    id: 5,
                    title: "E-Learning",
                    category: "Education",
                    screens: [
                      "https://images.unsplash.com/photo-1588072432836-e10032774350",
                      "https://images.unsplash.com/photo-1588072432836-e10032774350",
                      "https://images.unsplash.com/photo-1588072432836-e10032774350",
                    ],
                    description: "Interactive courses with progress tracking",
                  },
                ].map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-colors duration-300"
                  >
                    <div className="p-6">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#0066ff] text-white rounded-full mb-3">
                        {project.category}
                      </span>
                      <h3 className="text-xl font-bold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-black text-sm mb-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="relative h-40 bg-white">
                      <div className="absolute inset-0 flex">
                        {project.screens.map((screen, i) => (
                          <div
                            key={i}
                            className="flex-1 border-r border-[#00f0ff]/20 last:border-r-0"
                            style={{
                              backgroundImage: `url(${screen})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-white  text-center border-t border-[#00f0ff]/20">
                      <p className="text-sm font-medium text-[#0066ff] hover:text-[#e0e0ff] transition-colors">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Card Grid */}
      <section className="py-6  bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 ">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              WHAT WE OFFER
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-1">
              Comprehensive{" "}
              <span className="text-[#0066ff]">Mobile Solutions</span>
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              End-to-end services to bring your mobile vision to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiSmartphone className="text-3xl text-[#00f0ff]" />,
                title: "Native App Development",
                description:
                  "High-performance iOS and Android apps built with platform-specific technologies",
                features: [
                  "Swift & Kotlin",
                  "Platform-specific UI/UX",
                  "Full hardware access",
                  "App Store optimization",
                ],
                color: "from-[#00f0ff] to-[#0066ff]",
              },
              {
                icon: <FiCpu className="text-3xl text-[#0066ff]" />,
                title: "Cross-Platform Development",
                description:
                  "Single codebase for both platforms with native-like performance",
                features: [
                  "React Native",
                  "Flutter",
                  "Code reusability",
                  "Hot reload",
                ],
                color: "from-[#0066ff] to-[#00a0ff]",
              },
              {
                icon: <FiUser className="text-3xl text-[#00f0ff]" />,
                title: "UI/UX Design",
                description:
                  "Beautiful, intuitive interfaces that delight users",
                features: [
                  "User research",
                  "Wireframing",
                  "Prototyping",
                  "Design systems",
                ],
                color: "from-[#00f0ff] to-[#0066ff]",
              },
              {
                icon: <FiDatabase className="text-3xl text-[#0066ff]" />,
                title: "Backend Development",
                description:
                  "Scalable cloud infrastructure for your mobile apps",
                features: [
                  "Node.js/Python",
                  "Firebase",
                  "API development",
                  "Database design",
                ],
                color: "from-[#0066ff] to-[#00a0ff]",
              },
              {
                icon: <FiBarChart2 className="text-3xl text-[#00f0ff]" />,
                title: "App Analytics",
                description: "Data-driven insights to improve user engagement",
                features: [
                  "User behavior",
                  "Crash reporting",
                  "Performance metrics",
                  "A/B testing",
                ],
                color: "from-[#00f0ff] to-[#0066ff]",
              },
              {
                icon: <FiServer className="text-3xl text-[#0066ff]" />,
                title: "App Maintenance",
                description: "Keep your app updated and performing flawlessly",
                features: [
                  "Bug fixes",
                  "OS updates",
                  "Feature additions",
                  "Performance tuning",
                ],
                color: "from-[#0066ff] to-[#00a0ff]",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-2xl rounded-xl overflow-hidden border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-lg flex items-center justify-center mb-6 border border-[#00f0ff]/20">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-black mb-5">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <FiCheck
                          className={`mt-1 mr-3 flex-shrink-0 ${service.color
                            .split(" ")[0]
                            .replace("from-", "text-")}`}
                        />
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

      {/* Process - Vertical Timeline */}
      <section className="py-6  bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 ">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              OUR PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              How We Build{" "}
              <span className="text-[#0066ff]">Successful Apps</span>
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              A transparent, collaborative approach to mobile development
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-[#245f63] via-[#0066ff] to-[#00f0ff]"></div>

            <div className="grid md:grid-cols-2 gap-y-12">
              {[
                {
                  step: "Discovery",
                  description:
                    "We start by understanding your business goals, target audience, and technical requirements through workshops and research.",
                  icon: <FiUser className="text-2xl" />,
                  color: "bg-[#00f0ff]",
                },
                {
                  step: "Design",
                  description:
                    "Our designers create wireframes, prototypes, and pixel-perfect UI designs tailored to your brand and user needs.",
                  icon: <FiMonitor className="text-2xl" />,
                  color: "bg-[#0066ff]",
                },
                {
                  step: "Development",
                  description:
                    "Our engineers build your app using best practices, with regular demos to keep you informed throughout the process.",
                  icon: <FiCode className="text-2xl" />,
                  color: "bg-[#00f0ff]",
                },
                {
                  step: "Testing",
                  description:
                    "We conduct rigorous QA testing across devices and scenarios to ensure flawless performance before launch.",
                  icon: <FiCheck className="text-2xl" />,
                  color: "bg-[#0066ff]",
                },
                {
                  step: "Launch",
                  description:
                    "We handle app store submission and ensure your app meets all guidelines for a smooth approval process.",
                  icon: <FiSmartphone className="text-2xl" />,
                  color: "bg-[#00f0ff]",
                },
                {
                  step: "Growth",
                  description:
                    "Post-launch, we provide analytics, updates, and optimization to help your app succeed long-term.",
                  icon: <FiBarChart2 className="text-2xl" />,
                  color: "bg-[#0066ff]",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative ${
                    index % 2 === 0
                      ? "md:pr-12 md:text-right"
                      : "md:pl-12 md:text-left"
                  } ${index === 0 ? "pt-0" : ""}`}
                >
                  <div
                    className={`absolute top-0 ${
                      index % 2 === 0 ? "md:right-0" : "md:left-0"
                    } w-8 h-8 ${
                      item.color
                    } rounded-full flex items-center justify-center text-[#0a0a12] z-10`}
                  >
                    {item.icon}
                  </div>
                  <div className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] p-8 rounded-xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-3">{item.step}</h3>
                    <p className="text-white">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-6  bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12  text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              Build
            </span>{" "}
            Your Mobile App?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-black mb-8 max-w-2xl mx-auto"
          >
            Let's discuss how we can create a mobile experience that delights
            your users and grows your business.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/contact"
              className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-4 px-8 rounded-lg hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Free Consultation
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/portfolio"
              className="border border-[#00f0ff]/20 hover:border-[#00f0ff] text-blackfont-semibold py-4 px-8 rounded-lg transition-colors duration-300"
            >
              View Our Portfolio
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceMobileApp;
