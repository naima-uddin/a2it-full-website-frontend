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
import { useSectionContent } from "@/lib/serviceContent/useSectionContent";
import { SECTION_SCHEMAS } from "@/lib/serviceContent/registry";

const DEFAULTS = SECTION_SCHEMAS["amazon-marketing"].defaults;

// Icons cycle for cards / steps so any number of items still renders nicely.
const CARD_ICONS = [FiShoppingCart, FiTrendingUp, FiBarChart2, FiTarget];
const STEP_ICONS = [FiTarget, FiBarChart2, FiCheckCircle, FiTrendingUp];

const ServiceMarketing = () => {
  const content = useSectionContent("amazon-marketing", DEFAULTS);

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
          {content.heroTitle}
        </h1>
        <p className="text-lg text-black max-w-3xl mx-auto">{content.heroDesc}</p>
      </motion.div>

      {/* What is AMS */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-[#0066ff]">
          {content.amsHeading}
        </h2>
        <p className="text-black leading-relaxed">{content.amsDesc}</p>
      </section>

      {/* Core Components */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-[#0066ff]">
          {content.coreHeading}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {(content.cards || []).map((card, idx) => {
            const Icon = CARD_ICONS[idx % CARD_ICONS.length];
            const highlighted = idx % 2 === 1;
            return (
              <div
                key={idx}
                className={`p-6 border border-[#00f0ff]/20 rounded-2xl hover:border-[#00f0ff] transition ${
                  highlighted
                    ? "bg-gradient-to-r from-[#00f0ff] to-[#0066ff]"
                    : "bg-white shadow-2xl"
                }`}
              >
                <Icon
                  className={`text-3xl mb-4 ${
                    highlighted ? "text-white" : "text-[#00f0ff]"
                  }`}
                />
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className={highlighted ? "text-white" : "text-black"}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-[#0066ff]">
          {content.processHeading}
        </h2>
        <div className="space-y-6">
          {(content.steps || []).map((step, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length];
            return (
              <div key={idx} className="flex items-start gap-4">
                <Icon className="text-[#00f0ff] text-2xl mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">{step.title}</h4>
                  <p className="text-black">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Success Stories */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-[#0066ff]">
          {content.storiesHeading}
        </h2>
        <div className="space-y-8">
          {(content.stories || []).map((story, idx) => (
            <div
              key={idx}
              className="p-6 border border-[#00f0ff]/20 rounded-2xl bg-white shadow-2xl hover:border-[#00f0ff] transition"
            >
              <h4 className="font-semibold text-lg mb-2">{story.title}</h4>
              <p className="text-black">{story.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white p-10 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">{content.ctaTitle}</h2>
        <p className="max-w-2xl mx-auto mb-6">{content.ctaDesc}</p>
        <button className="bg-white text-[#0066ff] px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition">
          {content.ctaButton}
        </button>
      </motion.div>
    </div>
  );
};

export default ServiceMarketing;
