"use client";
import React from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { PiTarget } from "react-icons/pi";
import Image from "next/image";

const MissionAndTeam = () => {
  return (
    <div className="bg-white text-black font-sans overflow-hidden ">
      {/* Our Mission Section - Text left, Image right */}
      <section className="relative grid md:grid-cols-2 gap-8 items-center px-6 md:px-20 py-6 border-b border-[#00f0ff]/20">
        {/* Glow effect behind image */}
        <div className="absolute right-0 w-1/2 h-full bg-gradient-to-l from-[#00f0ff]/10 to-transparent opacity-30"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#0066ff] mb-4">
            <PiTarget className="text-2xl" />
            <span className="uppercase tracking-widest text-sm font-medium">
              Our Mission
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-4">
            Setting growth
            <br />
            with <span className="text-[#0066ff]">technology</span>
          </h2>
          <p className="text-black text-lg leading-relaxed">
            We believe that the right technology partnership can be
            transformative. Our mission is to serve as trusted advisors who
            understand both the complex technology landscape and the unique
            challenges facing our clients, creating connections that drive
            growth and innovation.
          </p>
        </div>

        <div className="relative flex justify-center">
          {/* Image with glow and reflection */}
          <div className="relative group">
            <Image
              src="/assets/AboutImg/robotHand.jpg"
              alt="Robotic Hand"
              width={400}
              height={400}
              unoptimized
              className="max-w-full h-auto object-contain rounded-lg shadow-xl group-hover:shadow-[0_0_30px_-5px_rgba(0,240,255,0.3)] transition-all duration-500"
            />
            {/* Subtle reflection effect */}
            {/* <div className="absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a12] to-transparent opacity-80"></div> */}
            {/* Glow border */}
            <div className="absolute inset-0 rounded-lg border border-[#00f0ff]/20 group-hover:border-[#00f0ff]/40 pointer-events-none transition-all duration-500"></div>
          </div>
          {/* Floating particles effect */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#00f0ff]/10 blur-xl animate-pulse"></div>
        </div>
      </section>

      {/* Who We Are Section - Image left, Text right */}
      <section className="relative grid md:grid-cols-2 gap-8 items-center px-6 md:px-20 py-16">
        {/* Glow effect behind image */}
        <div className="absolute left-0 w-1/2 h-full bg-gradient-to-r from-[#00f0ff]/10 to-transparent opacity-30"></div>

        <div className="relative flex justify-center order-1 md:order-1">
          {/* Image with glow and reflection */}
          <div className="relative group">
            <Image
              src="/assets/AboutImg/teamBg.jpg"
              alt="Team Discussion"
              width={400}
              height={400}
              unoptimized
              className="max-w-full h-auto object-cover rounded-lg shadow-xl group-hover:shadow-[0_0_30px_-5px_rgba(0,240,255,0.3)] transition-all duration-500"
            /> 
            {/* Glow border */}
            <div className="absolute inset-0 rounded-lg border border-[#00f0ff]/20 group-hover:border-[#00f0ff]/40 pointer-events-none transition-all duration-500"></div>
          </div>
          {/* Floating particles effect */}
          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#00f0ff]/10 blur-xl animate-pulse"></div>
        </div>

        <div className="relative z-10 order-2 md:order-2">
          <div className="flex items-center gap-2 text-[#0066ff] mb-4">
            <FaRegLightbulb className="text-2xl" />
            <span className="uppercase tracking-widest text-sm font-medium">
              Who We Are
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-4">
            Founded by
            <br />
            industry <span className="text-[#0066ff]">veterans</span>
          </h2>
          <p className="text-black text-lg leading-relaxed">
            With decades of combined experience across software development,
            enterprise IT, cybersecurity, and business consulting, 1030Tech was
            born from a simple observation: the technology marketplace is vast
            and complex, and businesses need expert guidance to navigate it
            effectively.
          </p>
          <p className="text-black text-lg leading-relaxed mt-4">
            Our team combines deep technical expertise with business acumen,
            allowing us to understand not just what technology can do, but how
            it can create value for your specific organization.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MissionAndTeam;
