"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiShield,
  FiTrendingUp,
  FiGlobe,
} from "react-icons/fi";
import Link from "next/link";

const EcommerceServicePage = () => {
  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/eBay/1.webp')] bg-cover bg-center opacity-30"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                E-Commerce Solutions
              </span>
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto mb-12">
              Transform your online store with powerful marketplace solutions
              that drive sales, enhance customer experience, and scale your
              business globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-5 px-10 rounded-full shadow-xl hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Selling Today
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marketplace Showcase */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Successful <span className="text-[#0066ff]">Marketplace</span>{" "}
              Stores
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Discover how we've helped businesses thrive on marketplace
              platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                image: "/assets/eBay/2.jpg",
                title: "Commercial Tyre",
                category: "Specialty Shop",
                results: "312% revenue growth",
              },
              {
                id: 2,
                image: "/assets/eBay/3.jpg",
                title: "Gym Equipment",
                category: "Health",
                results: "12K+ monthly visitors",
              },
              {
                id: 3,
                image: "/assets/eBay/4.jpeg",
                title: "Handmade Crafts Shop",
                category: "Artisan Goods",
                results: "98% positive feedback",
              },
              {
                id: 4,
                image: "/assets/eBay/5.jpeg",
                title: "Jute Boutique",
                category: "Apparel",
                results: "2.5x conversion rate",
              },
              {
                id: 5,
                image: "/assets/eBay/7.jpeg",
                title: "Kitchen Applier",
                category: "Home",
                results: "45% repeat customers",
              },
              {
                id: 6,
                image: "/assets/eBay/8.avif",
                title: "Home & Garden Store",
                category: "Home Goods",
                results: "Top-rated seller",
              },
            ].map((store) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#00f0ff]/20"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={store.image}
                    alt={`${store.title} showcase`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold bg-[#00f0ff] text-[#0a0a12] rounded-full">
                      {store.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {store.title}
                    </h3>
                    <p className="text-black text-sm">{store.results}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/success-stories"
              className="inline-flex items-center  text-[#0066ff] hover:bg-gradient-to-l hover:from-[#009aa8] hover:to-[#0066ff] hover:text-[#0a0a12] font-semibold py-3 px-8 rounded-full transition-colors duration-300 group "
            >
              View All Success Stories
              <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-6 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              OUR E-COMMERCE SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Complete Marketplace Solutions
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Everything you need to launch, grow, and optimize your online
              store
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiShoppingBag className="text-3xl text-[#00f0ff]" />,
                title: "Store Setup & Optimization",
                description:
                  "Professional store creation with SEO-friendly product listings",
                features: [
                  "Store Design",
                  "Category Structure",
                  "SEO Optimization",
                  "Brand Integration",
                ],
              },
              {
                icon: <FiTruck className="text-3xl text-[#00f0ff]" />,
                title: "Fulfillment Solutions",
                description:
                  "Streamlined inventory and order management systems",
                features: [
                  "Inventory Sync",
                  "Order Processing",
                  "Shipping Integration",
                  "Return Management",
                ],
              },
              {
                icon: <FiCreditCard className="text-3xl text-[#00f0ff]" />,
                title: "Payment Processing",
                description:
                  "Secure, multi-channel payment solutions for global sales",
                features: [
                  "Multiple Gateways",
                  "Fraud Protection",
                  "Currency Conversion",
                  "Payout Management",
                ],
              },
              {
                icon: <FiShield className="text-3xl text-[#00f0ff]" />,
                title: "Seller Protection",
                description:
                  "Comprehensive security and dispute resolution services",
                features: [
                  "Account Security",
                  "Dispute Resolution",
                  "Policy Compliance",
                  "Data Protection",
                ],
              },
              {
                icon: <FiTrendingUp className="text-3xl text-[#00f0ff]" />,
                title: "Sales Analytics",
                description:
                  "Data-driven insights to optimize performance and growth",
                features: [
                  "Performance Dashboard",
                  "Customer Analytics",
                  "Competitive Analysis",
                  "Growth Recommendations",
                ],
              },
              {
                icon: <FiGlobe className="text-3xl text-[#00f0ff]" />,
                title: "Global Expansion",
                description:
                  "International selling support and cross-border trade solutions",
                features: [
                  "Market Research",
                  "Localization",
                  "International Shipping",
                  "Compliance Guidance",
                ],
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-r from-[#6da5fa] to-[#0077b8] shadow-2xl p-8 rounded-xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-all duration-300 group "
              >
                <div className="w-16 h-16 bg-white shadow-2xl rounded-lg flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-white mb-5">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheck className="text-[#00f0ff] mt-1 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Process */}
      <section className="py-6 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              SELLER JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              From Setup to Success
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Our streamlined process to get your business selling quickly
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute left-16 right-16 top-1/2 h-1 bg-[#12121a]"></div>
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Account Setup",
                  description: "Seller registration and store configuration",
                },
                {
                  step: "02",
                  title: "Product Listing",
                  description: "Optimized listing creation and inventory setup",
                },
                {
                  step: "03",
                  title: "Launch & Promote",
                  description: "Store activation and marketing campaigns",
                },
                {
                  step: "04",
                  title: "Scale & Grow",
                  description: "Performance analysis and expansion strategies",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white shadow-2xl p-8 rounded-xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-colors duration-300"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                    {item.step}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-black">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-10 px-6 sm:px-12 bg-gradient-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to <span className="text-[#00f0ff]">Start Selling</span> on
            Marketplace Platforms?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-black mb-8 max-w-2xl mx-auto"
          >
            Join thousands of successful sellers who've expanded their business
            with our expertise.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/get-started"
              className="inline-flex items-center bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-5 px-12 rounded-full shadow-xl hover:shadow-[0_5px_30px_rgba(0,240,255,0.4)] transition-all duration-300 transform hover:scale-105 group"
            >
              Launch Your Store
              <FiArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EcommerceServicePage;
