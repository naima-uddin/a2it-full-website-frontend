"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiTrendingUp,
  FiBarChart2,
  FiShoppingCart,
  FiCheckCircle,
} from "react-icons/fi";

const ServiceMarketing = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white text-black">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00f0ff] to-[#0066ff] bg-clip-text text-transparent mb-4">
          Amazon Marketing Services
        </h1>
        <p className="text-lg text-black max-w-3xl mx-auto">
          At A2IT, we specialize in providing comprehensive Amazon Marketing
          Services (AMS) that empower brands to enhance visibility, optimize
          product listings, and drive conversions.
        </p>
      </motion.div>

      {/* What is AMS */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-[#0066ff]">
          Understanding Amazon Marketing Services (AMS)
        </h2>
        <p className="text-black leading-relaxed">
          Amazon Marketing Services, now integrated into the broader Amazon Ads
          ecosystem, is a suite of advertising tools designed to help sellers
          and vendors promote their products on Amazon.
        </p>
      </section>

      {/* Core Components */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-[#0066ff]">
          Core Components of A2IT's Amazon Marketing Services
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 border border-[#00f0ff]/20 rounded-2xl bg-white shadow-2xl hover:border-[#00f0ff] transition">
            <FiShoppingCart className="text-[#00f0ff] text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Amazon Sponsored Products
            </h3>
            <p className="text-black">
              Sponsored Products are cost-per-click (CPC) ads that promote
              individual product listings.
            </p>
          </div>
          <div className="p-6 border border-[#00f0ff]/20 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:border-[#00f0ff] transition">
            <FiTrendingUp className="text-white text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Amazon Sponsored Brands
            </h3>
            <p className="text-white">
              We use audience insights and behavioral data to create personalized ad
              experiences that drive engagement and conversions.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-[#0066ff]">Our Process</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <FiTarget className="text-[#00f0ff] text-2xl mt-1" />
            <div>
              <h4 className="font-semibold text-lg">Initial Consultation</h4>
              <p className="text-black">
                Share your business objectives and challenges with our team.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FiBarChart2 className="text-[#00f0ff] text-2xl mt-1" />
            <div>
              <h4 className="font-semibold text-lg">Account Audit</h4>
              <p className="text-black">
                We conduct a comprehensive review of your Amazon account.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FiCheckCircle className="text-[#00f0ff] text-2xl mt-1" />
            <div>
              <h4 className="font-semibold text-lg">Strategy Development</h4>
              <p className="text-black">
                Based on the audit, we craft a tailored marketing strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-[#0066ff]">Success Stories</h2>
        <div className="space-y-8">
          <div className="p-6 border border-[#00f0ff]/20 rounded-2xl bg-white shadow-2xl hover:border-[#00f0ff] transition">
            <h4 className="font-semibold text-lg mb-2">MOJO Outdoors</h4>
            <p className="text-black">
              We helped MOJO Outdoors achieve record-setting sales, including a shipped
              COGS of <span className="font-semibold text-gradient-to-r from-[#00f0ff] to-[#0066ff]">$606,793.22</span> in
              December—a <span className="font-semibold text-white">41.9% increase</span>.
            </p>
          </div>
          <div className="p-6 border border-[#00f0ff]/20 rounded-2xl bg-white shadow-2xl hover:border-[#00f0ff] transition">
            <h4 className="font-semibold text-lg mb-2">Tech Gadgets Inc.</h4>
            <p className="text-black">
              Through optimized Sponsored Products campaigns and A+ Content, we increased
              visibility and delivered a{" "}
              <span className="font-semibold text-black">30% sales boost</span>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white p-10 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">
          Win More Business With Amazon Marketing Services
        </h2>
        <p className="max-w-2xl mx-auto mb-6">
          At A2IT, we provide comprehensive Amazon Marketing Services that help brands
          enhance visibility, drive traffic, and increase sales.
        </p>
        <button className="bg-white text-[#0066ff] px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition">
          Get Started Today
        </button>
      </motion.div>
    </div>
  );
};

export default ServiceMarketing;
