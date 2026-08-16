"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiUserCheck,
  FiLayers,
  FiTarget,
  FiPenTool,
  FiBarChart2,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const fadeInUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

export default function ServiceBranding() {
  return (
    <div className="bg-white text-black overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-white"></div>
        {/* Floating background shapes */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0066ff]/10 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite]"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-medium mb-6 rounded-full">
              BRANDING SERVICES
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Craft <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">Memorable Brands</span> That Resonate
            </h1>
            <p className="text-xl text-black max-w-2xl mb-12">
              We build brand strategies and designs that capture attention, build trust, and drive business growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-4 px-8 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300"
              >
                Get Started
              </Link>
              <Link
                href="/portfolio"
                className="border-2 border-[#00f0ff] text-[#0066ff] hover:bg-[#00f0ff]/10 font-semibold py-4 px-8 rounded-lg transition-colors duration-300"
              >
                See Our Work
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <Image
              src="/assets/SEO/3.avif"
              alt="Branding"
              width={500}
              height={500}
              unoptimized
              className="rounded-xl shadow-2xl shadow-[#00f0ff]/30"
            />
          </motion.div>
        </div>
      </section>

      {/* Branding Process Section */}
      <section className="px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="show"
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-black mb-4"
          >
            Our Branding Process
          </motion.h2>
          <p className="text-black max-w-2xl mx-auto">
            From discovery to implementation, we craft brand strategies and designs that resonate with your audience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {[
            { icon: FiUserCheck, title: "Discovery", desc: "Stakeholder interviews, audience analysis, market research." },
            { icon: FiTarget, title: "Strategy", desc: "Brand positioning, messaging, and architecture." },
            { icon: FiPenTool, title: "Design", desc: "Logo, color palette, typography, and visual assets." },
            { icon: FiLayers, title: "Implementation", desc: "Website, collateral, and social media branding." },
            { icon: FiBarChart2, title: "Evaluation", desc: "Performance tracking and refinement." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="show"
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
              className="bg-white shadow-2xl p-6 rounded-2xl border border-[#00f0ff]/20  hover:shadow-[#00f0ff]/40 text-center transition-all duration-300"
            >
              <item.icon className="mx-auto h-12 w-12 text-[#0066ff]" />
              <h3 className="font-semibold mt-4 text-xl">{item.title}</h3>
              <p className="text-black mt-2 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-10 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="show"
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-[#0066ff]"
          >
            Case Studies
          </motion.h2>
          <p className="text-black max-w-2xl mx-auto mt-2">
            Real results from brands we’ve transformed
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {[
            {
              title: "E-Commerce Rebranding",
              desc: "Modern, vibrant identity resulting in +30% website traffic and +25% sales.",
              image: "/assets/SEO/4.avif",
            },
            {
              title: "Healthcare Brand Strategy",
              desc: "Differentiated identity attracting new patients and strengthening relationships.",
              image: "/assets/SEO/5.jpeg",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="show"
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-[#00f0ff]/20 shadow-lg"
            >
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0066ff]">{item.title}</h3>
                <p className="text-black mt-2">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-14 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="show"
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-[#0066ff]"
          >
            Industries We Serve
          </motion.h2>
          <p className="text-black max-w-2xl mx-auto mt-2">
            Tailored branding solutions for diverse industries
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto text-center">
          {["Technology", "Healthcare", "Retail", "Finance", "Education"].map((industry, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="show"
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white shadow-2xl border border-[#00f0ff]/20 rounded-xl hover:shadow-[#00f0ff]/40 transition-all duration-300"
            >
              <FiLayers className="mx-auto h-10 w-10 text-[#0066ff]" />
              <h3 className="mt-4 font-semibold text-lg">{industry}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-6 sm:px-12 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl font-bold mb-6"
        >
          Ready to <span className="text-[#0a0a12]">Elevate</span> Your Brand?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl mb-8 max-w-2xl mx-auto text-white"
        >
          Let's create a brand strategy and design that connects with your audience and drives business growth.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center bg-white text-[#0066ff] font-semibold py-4 px-12 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300 transform hover:scale-105"
          >
            Get Your Free Branding Consultation
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
