"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// Safe motion components that filter out Framer Motion props
const MotionDiv =
  motion?.div ||
  (({
    children,
    initial,
    whileInView,
    transition,
    whileHover,
    whileTap,
    ...props
  }) => <div {...props}>{children}</div>);

const MotionButton =
  motion?.button ||
  (({ children, whileHover, whileTap, ...props }) => (
    <button {...props}>{children}</button>
  ));

const techImages = [
  "/assets/AboutImg/capabilities/1.avif",
  "/assets/AboutImg/capabilities/2.avif",
  "/assets/AboutImg/capabilities/3.avif",
  "/assets/AboutImg/capabilities/4.avif",
  "/assets/AboutImg/capabilities/5.avif",
];

const CapabilitiesSection = () => {
  return (
    <div className="bg-white text-black py-6 px-6 md:px-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#0066ff] filter blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-[#0066ff] to-[#003399] filter blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Unlock Your Software Development{" "}
              <span className="text-[#006dff]">Capabilities</span> With Us
            </h2>

            <p className="text-lg text-black leading-relaxed">
              TechnoNext empowers your vision with specialized teams proficient
              in:
            </p>

            <ul className="grid grid-cols-2 gap-3">
              {[
                "Software Engineering",
                "System Integration",
                "QA Testing",
                "Maintenance",
                "DevSecOps",
                "Cybersecurity",
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-[#00f0ff] mr-2">•</span>
                  <span className="text-black">{item}</span>
                </li>
              ))}
            </ul>

            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-medium rounded-lg shadow-lg hover:shadow-[0_0_20px_-5px_rgba(0,240,255,0.5)] transition-all duration-300 inline-flex items-center"
            >
              <Link href="/contact" className="flex items-center">
                Contact Us <FiArrowRight className="ml-2" />
              </Link>
            </MotionButton>
          </MotionDiv>

          {/* Image grid */}
          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 gap-4"
          >
            {/* First row - 3 images */}
            {techImages.slice(0, 3).map((img, index) => (
              <MotionDiv
                key={`first-${index}`}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-xl aspect-square border border-[#00f0ff]/20"
              >
                <Image
                  src={img}
                  alt="Technology"
                  width={200}
                  height={200}
                  unoptimized
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/60 via-transparent to-transparent"></div>
              </MotionDiv>
            ))}

            {/* Second row - full width image */}
            <MotionDiv
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-xl aspect-video col-span-3 md:col-span-2 border border-[#00f0ff]/20"
            >
              <Image
                src={techImages[3]}
                alt="Technology"
                width={400}
                height={200}
                unoptimized
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/60 via-transparent to-transparent"></div>
            </MotionDiv>

            {/* Third image in second row */}
            <MotionDiv
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-xl aspect-square md:block hidden border border-[#00f0ff]/20"
            >
              <Image
                src={techImages[4]}
                alt="Technology"
                width={200}
                height={200}
                unoptimized
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/60 via-transparent to-transparent"></div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default CapabilitiesSection;
