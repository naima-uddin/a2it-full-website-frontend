"use client"
import React from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiShoppingCart,
  FiCreditCard,
  FiTruck,
  FiPieChart,
  FiBox,
  FiGlobe,
  FiShield,
  FiUsers,
  FiBarChart2,
  FiCode,
} from "react-icons/fi";
import Link from "next/link";

const ServiceEcommerce = () => {
  return (
    <div className="bg-[#0a0a12] text-[#e0e0ff] overflow-hidden">
      {/* Hero Section with Product Showcase */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-transparent to-[#0a0a12]"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                eCommerce Development
              </span>
            </h1>
            <p className="text-xl text-[#b0b0ff] max-w-2xl mb-12">
              We build high-converting online stores that drive sales and grow
              your business with cutting-edge eCommerce solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-4 px-8 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Free Consultation
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/portfolio"
                className="border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-semibold py-4 px-8 rounded-lg transition-colors duration-300 text-center"
              >
                View Our Stores
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff] rounded-full mix-blend-screen opacity-10 blur-3xl"></div>
            <div className="relative z-10 bg-[#12121a] p-8 rounded-2xl border border-[#00f0ff]/20">
              <div className="mockup-window border-2 border-[#00f0ff]">
                <div className="flex justify-center px-4 py-16 bg-[#0a0a12]">
                  <div className="text-center">
                    <FiShoppingCart className="text-6xl mx-auto text-[#00f0ff] mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Your eCommerce Store
                    </h3>
                    <p className="text-[#b0b0ff]">
                      Built for maximum conversions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-20 px-6 sm:px-12 bg-[#12121a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <FiShoppingCart className="text-4xl" />,
                value: "100+",
                label: "Stores Built",
                color: "text-[#00f0ff]",
              },
              {
                icon: <FiCreditCard className="text-4xl" />,
                value: "30%",
                label: "Avg. Revenue Growth",
                color: "text-[#0066ff]",
              },
              {
                icon: <FiTruck className="text-4xl" />,
                value: "2.5x",
                label: "Faster Load Times",
                color: "text-[#00f0ff]",
              },
              {
                icon: <FiPieChart className="text-4xl" />,
                value: "4.8/5",
                label: "Client Satisfaction",
                color: "text-[#0066ff]",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-[#0a0a12] rounded-xl border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-all"
              >
                <div
                  className={`w-20 h-20 bg-[#0066ff]/10 rounded-full flex items-center justify-center mx-auto mb-4 ${stat.color}`}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] bg-clip-text text-transparent">
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

      {/* Platform Solutions */}
      <section className="py-28 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
              OUR SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              eCommerce <span className="text-[#0066ff]">Platforms</span>
            </h2>
            <p className="text-[#b0b0ff] max-w-2xl mx-auto">
              We specialize in all major eCommerce platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiShoppingCart className="text-4xl" />,
                title: "Shopify Stores",
                description:
                  "Beautiful, high-converting Shopify themes and custom stores",
                features: [
                  "Custom themes",
                  "App integrations",
                  "SEO optimized",
                  "Mobile-first",
                ],
                color: "from-[#00f0ff] to-[#0066ff]",
              },
              {
                icon: <FiBox className="text-4xl" />,
                title: "WooCommerce",
                description:
                  "Flexible WordPress eCommerce solutions for scalability",
                features: [
                  "Custom plugins",
                  "High performance",
                  "Secure checkout",
                  "Multi-vendor",
                ],
                color: "from-[#0066ff] to-[#00f0ff]",
              },
              {
                icon: <FiGlobe className="text-4xl" />,
                title: "Custom Marketplaces",
                description:
                  "Tailored multi-vendor platforms for niche markets",
                features: [
                  "B2B/B2C",
                  "Payment gateways",
                  "Seller dashboards",
                  "Advanced search",
                ],
                color: "from-[#00f0ff] to-[#0066ff]",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#12121a] rounded-xl overflow-hidden border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-8">
                  <div className="w-16 h-16 bg-[#0a0a12] rounded-lg flex items-center justify-center mb-6 border border-[#00f0ff]/20">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-[#b0b0ff] mb-5">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
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

      {/* Features - Side by Side */}
      <section className="py-28 px-6 sm:px-12 bg-[#12121a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
              KEY FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Powerful eCommerce{" "}
              <span className="text-[#0066ff]">Capabilities</span>
            </h2>
            <p className="text-[#b0b0ff] max-w-2xl mx-auto">
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
                },
                {
                  icon: <FiCreditCard className="text-3xl" />,
                  title: "Payment Gateways",
                  description:
                    "Secure integration with Stripe, PayPal, and local payment methods",
                },
                {
                  icon: <FiTruck className="text-3xl" />,
                  title: "Shipping Integration",
                  description:
                    "Real-time shipping rates, tracking, and label printing",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start bg-[#0a0a12] p-6 rounded-xl border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-lg flex items-center justify-center text-white mr-6">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-[#b0b0ff]">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-8">
              {[
                {
                  icon: <FiUsers className="text-3xl" />,
                  title: "Customer Accounts",
                  description:
                    "Personalized shopping experiences with order history and wishlists",
                },
                {
                  icon: <FiBarChart2 className="text-3xl" />,
                  title: "Analytics Dashboard",
                  description:
                    "Track sales, visitors, conversions, and customer behavior",
                },
                {
                  icon: <FiShield className="text-3xl" />,
                  title: "Security & Compliance",
                  description:
                    "PCI-DSS compliant, GDPR ready, and SSL encryption",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start bg-[#0a0a12] p-6 rounded-xl border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0066ff] to-[#00f0ff] rounded-lg flex items-center justify-center text-white mr-6">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-[#b0b0ff]">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process - Vertical Timeline */}
      <section className="py-28 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
              OUR PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              eCommerce <span className="text-[#0066ff]">Development</span>{" "}
              Journey
            </h2>
            <p className="text-[#b0b0ff] max-w-2xl mx-auto">
              A proven methodology to build successful online stores
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-[#00f0ff] via-[#0066ff] to-[#00f0ff]"></div>

            <div className="grid md:grid-cols-2 gap-y-12">
              {[
                {
                  step: "Discovery",
                  description:
                    "Understand your business goals, target audience, and product catalog",
                  icon: <FiUsers className="text-2xl" />,
                  color: "bg-[#00f0ff]",
                },
                {
                  step: "Design",
                  description:
                    "Create conversion-focused UI/UX designs tailored to your brand",
                  icon: <FiShoppingCart className="text-2xl" />,
                  color: "bg-[#0066ff]",
                },
                {
                  step: "Development",
                  description:
                    "Build your store with clean code, optimized performance, and security",
                  icon: <FiCode className="text-2xl" />,
                  color: "bg-[#00f0ff]",
                },
                {
                  step: "Testing",
                  description:
                    "Rigorous QA across devices, payment flows, and user journeys",
                  icon: <FiCheck className="text-2xl" />,
                  color: "bg-[#0066ff]",
                },
                {
                  step: "Launch",
                  description:
                    "Deploy your store with SEO optimization and marketing setup",
                  icon: <FiGlobe className="text-2xl" />,
                  color: "bg-[#00f0ff]",
                },
                {
                  step: "Growth",
                  description:
                    "Ongoing support, analytics, and optimization to scale your business",
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
                    } rounded-full flex items-center justify-center text-white z-10`}
                  >
                    {item.icon}
                  </div>
                  <div className="bg-[#12121a] p-8 rounded-xl border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-3">{item.step}</h3>
                    <p className="text-[#b0b0ff]">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 sm:px-12 bg-gradient-to-br from-[#0a0a12] via-[#12121a] to-[#0a0a12]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              Launch
            </span>{" "}
            Your Online Store?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#b0b0ff] mb-8 max-w-2xl mx-auto"
          >
            Let's build an eCommerce website that drives sales and grows your
            business.
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
              Get Started Now
              <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceEcommerce;
