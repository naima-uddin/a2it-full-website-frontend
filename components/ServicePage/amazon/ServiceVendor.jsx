"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiBarChart2,
  FiTrendingUp,
  FiBox,
  FiUsers,
  FiGlobe,
} from "react-icons/fi";
import Link from "next/link";

const ServiceVendor = () => {
  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] xl:[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/vendor/hero.avif')] bg-cover bg-center "></div> 

        {/* Floating glow effects */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-[#00f0ff] rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-[#0066ff] rounded-full blur-2xl opacity-30 animate-pulse delay-1000"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 sm:px-12"
        >
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center bg-white shadow-2xl rounded-full px-6 py-2 border border-[#00f0ff]/30">
              <FiBox className="text-[#00f0ff] mr-2" />
              <span className="text-sm text-black">
                Amazon Vendor Central
              </span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              Sell Smarter with Vendor Central
            </span>
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto mb-12">
            Partner directly with Amazon to scale your brand — we’ll guide you
            from strategy to execution for long-term growth.
          </p>
          <Link
            href="/contact"
            className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-5 px-10 rounded-full shadow-xl hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Get Started
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Key Features of Vendor Central
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Why top manufacturers and brands choose Vendor Central
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Bulk Selling",
                desc: "Sell directly to Amazon in wholesale volumes.",
                icon: <FiBox />,
              },
              {
                title: "Prime Eligibility",
                desc: "Your products automatically qualify for Prime.",
                icon: <FiGlobe />,
              },
              {
                title: "A+ Content",
                desc: "Enhanced brand pages and product storytelling.",
                icon: <FiBarChart2 />,
              },
              {
                title: "AMS Access",
                desc: "Exclusive Amazon Marketing Services campaigns.",
                icon: <FiTrendingUp />,
              },
              {
                title: "Amazon Managed",
                desc: "Fulfillment, service & returns handled by Amazon.",
                icon: <FiUsers />,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-white shadow-2xl rounded-xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-all duration-300"
              >
                <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#0066ff] text-[#0a0a12] text-xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-black text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className=" px-6 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Success Story: MOJO Outdoors
            </h2>
            <p className="text-black mb-6">
              Through our Vendor Central strategies, MOJO Outdoors achieved
              record-breaking growth:
            </p>
            <ul className="space-y-3">
              {[
                "Record COGS: $606,793.22 in December",
                "41.9% COGS increase vs previous year",
                "Year-over-year growth boosted from 10% → 19.5%",
              ].map((point, i) => (
                <li key={i} className="flex items-start">
                  <FiCheck className="text-[#00f0ff] mt-1 mr-2 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div
              className="w-full h-72 rounded-2xl bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: "url('/assets/serviceImg/1.webp')" }}
            ></div>
            <div className="absolute -inset-4 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-2xl opacity-20 blur-xl -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 sm:px-12 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#0066ff]">
            Getting Started with A2IT
          </h2>
          <p className="text-black">
            Our step-by-step process to unlock your Vendor Central potential
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              step: "01",
              title: "Consultation",
              desc: "We analyze your business goals.",
            },
            {
              step: "02",
              title: "Audit",
              desc: "Deep review of your Vendor account.",
            },
            {
              step: "03",
              title: "Strategy",
              desc: "Tailored marketing roadmap.",
            },
            {
              step: "04",
              title: "Execution",
              desc: "Campaign launch & optimization.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 text-left bg-white shadow-2xl rounded-xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-all duration-300"
            >
              <div className="text-2xl font-bold text-[#0066ff] mb-2">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-black text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 px-6 sm:px-12 relative">
        <div className="absolute inset-0 bg-[url('/assets/vendor/cta.avif')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-white"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to Scale with{" "}
            <span className="text-[#0066ff]">Vendor Central?</span>
          </motion.h2>
          <p className="text-black mb-8">
            Let A2IT guide your journey to becoming one of Amazon’s trusted
            suppliers.
          </p>
          <Link
            href="/contact"
            className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#fff] font-semibold py-5 px-10 rounded-full shadow-xl hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Start Now
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceVendor;
