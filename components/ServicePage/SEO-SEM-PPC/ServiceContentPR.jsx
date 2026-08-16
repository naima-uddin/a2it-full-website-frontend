"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  PenTool,
  Globe,
  Layers,
  BarChart,
  Users,
  Zap,
  CheckCircle,
} from "lucide-react";

export default function ServiceContentPR() {
  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative mb-6 flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-4xl"
        >
          <span className="inline-block px-5 py-2 bg-white shadow-2xl rounded-full text-[#0066ff] font-medium mb-6  ">
            Content & PR Services
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Tell Stories That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              Inspire
            </span>{" "}
            and Build Trust
          </h1>
          <p className="text-lg text-black">
            From strategic storytelling to PR amplification—our content drives
            awareness, authority, and audience engagement.
          </p>
        </motion.div>

        {/* Floating Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute bottom-10 right-10 hidden md:block"
        >
        </motion.div>
      </section>

      {/* Content Marketing */}
      <section className="py-6 px-6 sm:px-12 bg-white">
        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6"
        >
          📢 Content Marketing
        </motion.h2>
        <p className="text-center text-black max-w-3xl mx-auto">
          Engage, educate, and inspire with content designed to connect with
          your target audience.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {[
            { icon: PenTool, title: "Build Trust", desc: "Content that establishes authority." },
            { icon: BarChart, title: "Boost SEO", desc: "Search-driven blogs & articles." },
            { icon: Users, title: "Drive Engagement", desc: "Stories that spark interaction." },
            { icon: Zap, title: "Lead Generation", desc: "Optimized for conversions." },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white shadow-2xl p-6 rounded-2xl border border-[#00f0ff]/20 hover:border-[#00f0ff] transition-all duration-300 text-center group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              <item.icon className="mx-auto h-10 w-10 text-[#0066ff]" />
              <h3 className="font-semibold mt-4">{item.title}</h3>
              <p className="text-sm text-black mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Digital PR with Image */}
      <section className="py-20 px-6 ml-16 sm:px-12 bg-white grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            🌐 Digital PR That Expands Reach
          </h2>
          <p className="text-black mb-6">
            Build authority with PR campaigns that place your brand in the
            spotlight through media coverage, partnerships, and social
            amplification.
          </p>
          <ul className="space-y-4">
            {[
              "Strategic Media Outreach",
              "Influencer Partnerships",
              "Press Release Distribution",
              "Reputation Management",
            ].map((point, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="text-[#00f0ff] w-5 h-5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <Image
            src="/assets/SEO/2.avif"
            alt="Digital PR"
            width={500}
            height={400}
            unoptimized
            className="rounded-xl shadow-lg shadow-[#0066ff]/30"
          />
        </motion.div>
      </section>

      {/* Content Auditing */}
      <section className="mb-6 px-6 sm:px-12 bg-white">
        <motion.h2
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6"
        >
          🔍 Content Auditing
        </motion.h2>
        <p className="text-center text-black max-w-3xl mx-auto">
          Discover what works and what needs improvement with a full content
          performance audit.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: Layers, title: "Content Inventory", desc: "Full audit of blogs, videos, & pages." },
            { icon: Globe, title: "Performance Metrics", desc: "Analyze SEO, traffic & engagement." },
            { icon: Zap, title: "Action Plan", desc: "Step-by-step improvements to execute." },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-2xl p-6 rounded-2xl border border-[#00f0ff]/20 hover:border-[#00f0ff] text-center transition-all duration-300"
            >
              <item.icon className="mx-auto h-10 w-10 text-[#0066ff]" />
              <h3 className="font-semibold mt-4">{item.title}</h3>
              <p className="text-sm text-black mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-15 px-6 sm:px-12 bg-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Ready to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
            Elevate
          </span>{" "}
          Your Brand?
        </motion.h2>
        <p className="text-lg text-black max-w-xl mx-auto mb-8">
          Let’s create a tailored Content & PR strategy that builds authority
          and drives measurable growth.
        </p>
        <Link
          href="/contact"
          className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold py-4 px-8 rounded-lg hover:shadow-[0_5px_30px_rgba(0,240,255,0.3)] transition-all duration-300"
        >
          <span className="relative z-10">Get Started</span>
        </Link>
      </section>
    </div>
  );
}
