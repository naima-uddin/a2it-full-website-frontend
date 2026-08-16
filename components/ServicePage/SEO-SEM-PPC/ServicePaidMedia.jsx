"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const ServicePaidMedia = () => {
  return (
    <section className="relative w-full bg-white text-white py-20 px-6 md:px-12 lg:px-20 overflow-hidden"> 

      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto mb-16 relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#00f0ff] to-[#00a6ff] bg-clip-text text-transparent drop-shadow-lg">
          A2IT Paid Media (SEM/PPC) Services
        </h2>
        <p className="mt-4 text-lg text-black">
          Amplify Your Reach with Targeted Precision
        </p>
      </motion.div>

      {/* Image + Intro */}
      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src="/assets/SEO/1.avif"
            alt="Paid Media Strategy"
            width={600}
            height={400}
            unoptimized
            className="rounded-2xl hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00f0ff]/20 to-transparent" />
        </motion.div>

        {/* Right: Problem Statement */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-[#0066ff] mb-4">
            Is Your Paid Media Strategy Delivering Results?
          </h3>
          <p className="text-black mb-6">
            Many businesses waste ad spend with generic SEM/PPC campaigns. The
            result? Low conversions, poor ROI, and wasted budgets.
          </p>
          <ul className="space-y-3">
            {[
              "Difficulty reaching the right audience despite high ad spend",
              "Inconsistent campaign performance",
              "Inefficient budget allocation",
              "Trouble attracting leads who convert",
            ].map((point, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#00f0ff] shrink-0 mt-1" />
                <span className="text-black">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Approach Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-20 max-w-5xl mx-auto text-center"
      >
        <h3 className="text-3xl font-semibold text-[#0066ff] mb-6">
          A2IT’s Approach: Thoughtful Strategy Meets Powerful Execution
        </h3>
        <p className="text-black leading-relaxed mb-12">
          We craft SEM/PPC roadmaps, optimize campaigns, and use smart targeting
          to deliver **qualified leads** while maintaining **clear ROI visibility**.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Built-to-Perform Strategy",
              desc: "In-depth audits, documented roadmaps, budget pacing, and milestones.",
            },
            {
              title: "Campaigns That Convert",
              desc: "Custom segments, smart bidding, and relevant creatives for maximum impact.",
            },
            {
              title: "Smart Targeting",
              desc: "Blend first-party data with behavior insights to attract qualified leads.",
            },
            {
              title: "Transparent Analytics",
              desc: "Visually rich reports with CTR, conversions, and efficiency tracking.",
            },
            {
              title: "Continuous Testing",
              desc: "Ongoing A/B tests to refine ad formats, copy, and CTAs.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#00a6ff] shadow-lg border border-[#00f0ff]/20"
            >
              <h4 className="text-lg font-bold text-white mb-2">
                {item.title}
              </h4>
              <p className="text-black text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Services List */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-24"
      >
        <h3 className="text-3xl font-semibold text-center text-[#0066ff] mb-10">
          What You Can Expect
        </h3>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            "Strategic SEM/PPC Roadmap & Consultation",
            "Google Ads Campaign Setup & Management",
            "Microsoft Advertising Services",
            "Programmatic & Display Advertising",
            "Social PPC Solutions (Optional Add-Ons)",
            "Detailed Reporting & Dashboarding",
            "A/B Testing Framework",
            "Audience Segmentation & Retargeting",
          ].map((service, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 p-4 rounded-xl bg-[#00a6ff]  transition-all border border-[#00f0ff]/10 shadow-2xl"
            >
              <CheckCircle className="text-[#00f0ff] w-5 h-5 shrink-0" />
              <span className="text-white ">{service}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-24 text-center max-w-3xl mx-auto "
      >
        <h3 className="text-3xl font-bold text-black mb-4">
          Ready to Supercharge Your Paid Media Performance?
        </h3>
        <p className="text-[#0066ff] mb-8">
          Let’s build campaigns that work smarter—not harder. Reach out to A2IT
          today to discuss your custom SEM/PPC strategy.
        </p>
        <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00a6ff] text-black font-bold text-lg shadow-xl hover:shadow-[#00f0ff]/50 transition-all">
          Get Started Today
        </button>
      </motion.div>
    </section>
  );
};

export default ServicePaidMedia;
